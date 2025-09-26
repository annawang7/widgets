"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface WidgetProps {
  id: string;
  x: number;
  y: number;
  title?: string;
}

export default function Widget({ id, x, y, title = "Widget" }: WidgetProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    position: "absolute" as const,
    left: x,
    top: y,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white border-2 border-gray-300 rounded-lg shadow-lg cursor-move hover:shadow-xl transition-shadow duration-200 min-w-[300px] min-h-[200px]"
    >
      <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 rounded-t-lg flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        </div>
      </div>
      <div className="p-4 h-full">
        <iframe
          src="data:text/html,<html><body style='margin:0;padding:20px;font-family:Arial,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;text-align:center;'><h2>Widget Content</h2><p>This is a sample widget with some dummy content.</p><p>You can drag me around!</p></body></html>"
          className="w-full h-full border-0 rounded"
          title={`Widget ${id}`}
        />
      </div>
    </div>
  );
}
