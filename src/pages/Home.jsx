import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import ElementsPanel from "../components/ElementsPanel";
import Canvas from "../components/Canvas";
import PropertiesPanel from "../components/PropertiesPanel";
import { getDefaultProperties } from "../configs";
import Footer from "../components/Footer";

const Home = () => {
  const [canvasElements, setCanvasElements] = useState([]);

  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem("selectedTheme") || "template1.avif";
  });
  const [selectedElement, setSelectedElement] = useState(null);
  const draggedItem = useRef(null);
  const [isDraggingExistingElement, setIsDraggingExistingElement] =
    useState(false);
  const dragStartPosition = useRef({ x: 0, y: 0 });
  const elementSize = useRef({ width: 0, height: 0 });
  const canvasRef = useRef(null);

  useEffect(() => {
    try {
      const savedElements = localStorage.getItem("canvasElements");
      if (savedElements) {
        const parsedElements = JSON.parse(savedElements);
        if (Array.isArray(parsedElements) && parsedElements.length > 0) {
          setCanvasElements(parsedElements);
        }
      }
    } catch (e) {
      console.error("Error loading saved elements:", e);
    }
  }, []);

  useEffect(() => {
    try {
      if (canvasElements.length > 0) {
        localStorage.setItem("canvasElements", JSON.stringify(canvasElements));
      }
    } catch (e) {
      console.error("Error saving elements:", e);
    }
  }, [canvasElements]);

  const handleDragStart = (e, element) => {
    if (!element) return;

    // Set the data transfer for compatibility
    e.dataTransfer.setData("text/plain", element.id || element.elementId || "");

    // for centered positioning
    const rect = e.currentTarget.getBoundingClientRect();
    elementSize.current = {
      width: rect.width,
      height: rect.height,
    };

    // Check if we're dragging from panel or canvas
    if (element.elementId) {
      setIsDraggingExistingElement(true);
      draggedItem.current = { ...element };

      dragStartPosition.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    } else {
      setIsDraggingExistingElement(false);
      draggedItem.current = { ...element };
    }

    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    // Clean up drag state
    draggedItem.current = null;
    setIsDraggingExistingElement(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    if (!draggedItem.current) {
      console.warn("Drop occurred but no draggedItem was found");
      return;
    }

    try {
      let adjustedX, adjustedY;

      if (e.canvasX !== undefined && e.canvasY !== undefined) {
        adjustedX = Math.max(
          0,
          Math.min(
            e.canvasX - elementSize.current.width / 2,
            1200 - elementSize.current.width
          )
        );

        adjustedY = Math.max(
          0,
          Math.min(
            e.canvasY - elementSize.current.height / 2,
            800 - elementSize.current.height
          )
        );
      } else {
        // Fallback to original calculation if needed
        const canvasContainer = e.currentTarget;
        const canvasRect = canvasContainer.getBoundingClientRect();

        // Calculate drop position taking scroll into account
        const x =
          e.clientX -
          canvasRect.left +
          canvasContainer.scrollLeft -
          elementSize.current.width / 2;
        const y =
          e.clientY -
          canvasRect.top +
          canvasContainer.scrollTop -
          elementSize.current.height / 2;

        // Constrain to canvas boundaries
        adjustedX = Math.max(0, Math.min(x, 1200 - elementSize.current.width));
        adjustedY = Math.max(0, Math.min(y, 800 - elementSize.current.height));
      }

      if (isDraggingExistingElement) {
        if (draggedItem.current && draggedItem.current.elementId) {
          const elementIdToMove = draggedItem.current.elementId;

          setCanvasElements((prev) =>
            prev.map((el) => {
              if (el && el.elementId === elementIdToMove) {
                return {
                  ...el,
                  position: { x: adjustedX, y: adjustedY },
                };
              }
              return el;
            })
          );
        } else {
          console.warn(
            "Attempted to move an element without a valid elementId"
          );
        }
      } else {
        if (draggedItem.current && draggedItem.current.type) {
          const newElement = {
            ...draggedItem.current,
            elementId: `${draggedItem.current.type}-${Date.now()}`,
            position: { x: adjustedX, y: adjustedY },
            properties: getDefaultProperties(draggedItem.current.type),
          };

          setCanvasElements((prev) => [...prev, newElement]);
          setSelectedElement(newElement);
        } else {
          console.warn("Attempted to create an element without a valid type");
        }
      }
    } catch (error) {
      console.error("Error in handleDrop:", error);
    } finally {
      // Always reset drag state even if there was an error
      handleDragEnd();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
        canvasElements={canvasElements}
        setCanvasElements={setCanvasElements}
        setSelectedElement={setSelectedElement}
      />
      <div className="lg:h-screen flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 p-4">
        <Canvas
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
          selectedTheme={selectedTheme}
          canvasElements={canvasElements}
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          handleDragStart={handleDragStart}
          canvasRef={canvasRef}
        />
        <div className="group grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2">
          <ElementsPanel handleDragStart={handleDragStart} />
          <PropertiesPanel
            selectedElement={selectedElement}
            setCanvasElements={setCanvasElements}
            setSelectedElement={setSelectedElement}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
