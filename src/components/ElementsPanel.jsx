import React from "react";
import { availableElements } from "../configs";

const ElementsPanel = ({ handleDragStart }) => {
  return (
    <div className="w-full lg:w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="font-semibold text-gray-700 mb-4">Elements</h2>
        <div className="space-y-2">
          {availableElements.map((element) => (
            <div
              key={element.id}
              draggable
              onDragStart={(e) => handleDragStart(e, element)}
              className="p-3 bg-gray-100 rounded-md flex items-center cursor-move hover:bg-gray-200 transition"
            >
              <span className="text-xl mr-3">{element.icon}</span>
              <span>{element.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ElementsPanel;
