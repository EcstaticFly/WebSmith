import React from "react";
import RenderPropertiesPanel from "./RenderPropertiesPanel";

const PropertiesPanel = ({
  selectedElement,
  setSelectedElement,
  setCanvasElements,
}) => {
  const updateElementProperties = (propertyName, value) => {
    if (!selectedElement) return;

    // Convert rotation to a number if it's valid, otherwise keep it as a string
    const processedValue =
      propertyName === "rotation" && value === "" ? "" : value;

    setCanvasElements((prev) =>
      prev.map((el) =>
        el.elementId === selectedElement.elementId
          ? {
              ...el,
              properties: { ...el.properties, [propertyName]: processedValue },
            }
          : el
      )
    );

    setSelectedElement((prev) =>
      prev
        ? {
            ...prev,
            properties: { ...prev.properties, [propertyName]: processedValue },
          }
        : null
    );
  };

  const deleteSelectedElement = () => {
    if (!selectedElement) return;

    setCanvasElements((prev) =>
      prev.filter((el) => el.elementId !== selectedElement.elementId)
    );
    setSelectedElement(null);
  };
  return (
    <div className="w-full lg:w-72 bg-white border-1 border-t border-l rounded-lg border-gray-400 overflow-y-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-700">Properties</h2>
          {selectedElement && (
            <button
              onClick={deleteSelectedElement}
              className="p-1 text-red-600 hover:bg-red-100 rounded"
              title="Delete element"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
        {
          <RenderPropertiesPanel
            selectedElement={selectedElement}
            updateElementProperties={updateElementProperties}
          />
        }
      </div>
    </div>
  );
};

export default PropertiesPanel;
