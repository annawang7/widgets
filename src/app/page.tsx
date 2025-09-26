"use client";

import { useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import Widget from "./components/Widget";

interface WidgetData {
  id: string;
  x: number;
  y: number;
  title: string;
}

export default function Home() {
  const [widgets, setWidgets] = useState<WidgetData[]>([]);
  const [widgetCounter, setWidgetCounter] = useState(0);

  const createWidget = () => {
    const newWidget: WidgetData = {
      id: `widget-${widgetCounter}`,
      x: Math.random() * (window.innerWidth - 400) + 50, // Random x position
      y: Math.random() * (window.innerHeight - 300) + 50, // Random y position
      title: `Widget ${widgetCounter}`,
    };

    console.log("new widget made");

    setWidgets((prev) => [...prev, newWidget]);
    setWidgetCounter((prev) => prev + 1);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;

    setWidgets((prev) =>
      prev.map((widget) =>
        widget.id === active.id
          ? {
              ...widget,
              x: Math.max(0, widget.x + delta.x),
              y: Math.max(0, widget.y + delta.y),
            }
          : widget
      )
    );
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gray-50 relative overflow-hidden">
        {/* Header with Create Widget button */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Widget Dashboard
            </h1>
            <button
              onClick={createWidget}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Create Widget
            </button>
          </div>
        </header>

        {/* Widgets container */}
        <div className="relative w-full h-[calc(100vh-80px)]">
          {widgets.map((widget) => (
            <Widget
              key={widget.id}
              id={widget.id}
              x={widget.x}
              y={widget.y}
              title={widget.title}
            />
          ))}
        </div>

        {/* Instructions */}
        {widgets.length === 0 && (
          <div className=" flex items-center justify-center">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Welcome to Widget Dashboard
              </h2>
              <p className="text-gray-600 mb-6">
                Click &quot;Create Widget&quot; to add your first widget. You
                can drag widgets around the screen to reposition them.
              </p>
              <div className="text-sm text-gray-500">
                Widgets are iframes with dummy content that you can move around
                freely.
              </div>
            </div>
          </div>
        )}
      </div>
    </DndContext>
  );
}
