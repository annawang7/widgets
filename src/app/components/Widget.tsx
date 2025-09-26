"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface WidgetProps {
  id: string;
  x: number;
  y: number;
  title?: string;
}

export default function Widget({ id, x, y, title = "Widget" }: WidgetProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [widgetContent, setWidgetContent] = useState("");
  const [showForm, setShowForm] = useState(true);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-widget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate widget content");
      }

      const data = await response.json();
      setWidgetContent(data.content);
      setShowForm(false);
    } catch (error) {
      console.error("Error generating widget:", error);
      alert("Failed to generate widget content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const style = {
    transform: CSS.Translate.toString(transform),
    position: "absolute" as const,
    left: x,
    top: y,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white border-2 border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 min-w-[300px] min-h-[200px]"
    >
      <div
        {...listeners}
        className="bg-gray-100 px-3 py-2 border-b border-gray-300 rounded-t-lg flex items-center justify-between cursor-move"
      >
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        </div>
      </div>
      <div className="p-4 h-full">
        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor={`prompt-${id}`}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                What do you want this widget to be?
              </label>
              <textarea
                id={`prompt-${id}`}
                value={prompt}
                onChange={(e) => {
                  console.log("onChange triggered:", e.target.value);
                  setPrompt(e.target.value);
                }}
                placeholder="Describe what you want this widget to do or display..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              {isLoading ? "Generating..." : "Submit"}
            </button>
          </form>
        ) : (
          <div className="h-full">
            {widgetContent ? (
              <iframe
                srcDoc={widgetContent}
                className="w-full h-full border-0 rounded"
                title={`Generated Widget ${id}`}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Loading widget content...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
