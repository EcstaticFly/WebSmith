import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import ElementsPanel from "../components/ElementsPanel";
import Canvas from "../components/Canvas";
import PropertiesPanel from "../components/PropertiesPanel";

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

    // Get the size of the element being dragged for centered positioning
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

  const handleDrop = (e) => {
    e.preventDefault();

    if (!draggedItem.current) {
      console.warn("Drop occurred but no draggedItem was found");
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left - elementSize.current.width / 2;
    const y = e.clientY - rect.top - elementSize.current.height / 2;

    const adjustedX = Math.max(0, x);
    const adjustedY = Math.max(0, y);

    try {
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
      draggedItem.current = null;
      setIsDraggingExistingElement(false);
    }
  };

  const getDefaultProperties = (type) => {
    switch (type) {
      case "text":
        return {
          content: "Edit this text",
          fontSize: 16,
          color: "#000000",
          fontWeight: "normal",
          fontFamily: "Arial, sans-serif",
          zIndex: 0,
        };
      case "image":
        return {
          src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMzAwIDIwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM5OTkiPkltYWdlIFBsYWNlaG9sZGVyPC90ZXh0Pjwvc3ZnPg==",
          alt: "Image description",
          width: 300,
          height: 200,
          customSrc: "",
          rotation: 0,
          zIndex: 0,
        };
      case "button":
        return {
          text: "Click Me",
          backgroundColor: "#3B82F6",
          textColor: "#FFFFFF",
          size: "medium",
          borderRadius: 4,
          fontFamily: "Arial, sans-serif",
          zIndex: 0,
        };

      case "divider":
        return {
          width: 100,
          color: "#000000",
          thickness: 2,
          zIndex: 0,
        };
      case "icon":
        return {
          icon: "star",
          size: 32,
          rotation: 0,
          zIndex: 0,
        };
      default:
        return {};
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
      <div className="lg:flex ">
        <Canvas
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
          selectedTheme={selectedTheme}
          canvasElements={canvasElements}
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          handleDragStart={handleDragStart}
        />
        {/* <div className="md:flex md:space-y-2"> */}
        <ElementsPanel handleDragStart={handleDragStart} />
        <PropertiesPanel
          selectedElement={selectedElement}
          setCanvasElements={setCanvasElements}
          setSelectedElement={setSelectedElement}
        />
        {/* </div> */}
      </div>
    </div>
  );
};

export default Home;
