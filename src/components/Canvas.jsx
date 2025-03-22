import React, { useMemo } from "react";
import { availableIcons } from "../configs";

const Canvas = ({
  handleDrop,
  handleDragStart,
  handleDragOver,
  selectedTheme,
  canvasElements,
  selectedElement,
  setSelectedElement,
}) => {

  const canvasStyle = useMemo(() => ({
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${selectedTheme})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }), [selectedTheme]); 
  
  const handleCanvasClick = (e) => {
    // Check if we're clicking directly on the canvas or on its immediate child div
    // which serves as the canvas container
    if (
      e.target === e.currentTarget ||
      (e.target.tagName === "DIV" &&
        e.target.parentNode === e.currentTarget &&
        !e.target.classList.contains("exported-element"))
    ) {
      setSelectedElement(null);
    }
  };
  const handleElementSelect = (e, element) => {
    e.stopPropagation();
    setSelectedElement(element);
  };
  const renderCanvasElement = (element) => {
    if (!element || !element.elementId || !element.type) {
      console.warn("Attempted to render invalid element:", element);
      return null;
    }

    const isSelected =
      selectedElement && selectedElement.elementId === element.elementId;
    const baseStyle = {
      position: "absolute",
      left: `${element.position?.x || 0}px`,
      top: `${element.position?.y || 0}px`,
      zIndex: element.properties.zIndex || 0,
      cursor: "move",
      border: isSelected ? "2px solid #3B82F6" : "none",
      padding: "4px",
      borderRadius: "2px",
      backgroundColor: isSelected ? "rgba(219, 234, 254, 0.4)" : "transparent",
      // Make entire element clickable and draggable
      display: "inline-block",
      pointerEvents: "all",
    };

    const commonProps = {
      draggable: true,
      onDragStart: (e) => handleDragStart(e, element),
      onClick: (e) => handleElementSelect(e, element),
      style: baseStyle,
    };

    switch (element.type) {
      case "text":
        return (
          <div key={element.elementId} {...commonProps}>
            <p
              style={{
                fontSize: `${element.properties.fontSize}px`,
                color: element.properties.color,
                fontWeight: element.properties.fontWeight,
                fontFamily: element.properties.fontFamily,
                margin: 0,
              }}
            >
              {element.properties.content}
            </p>
          </div>
        );

      case "image":
        return (
          <div key={element.elementId} {...commonProps}>
            <img
              src={element.properties.customSrc || element.properties.src}
              alt={element.properties.alt}
              width={element.properties.width}
              style={{ transform: `rotate(${element.properties.rotation}deg)` }}
              className="object-cover"
            />
          </div>
        );

      case "button":
        return (
          <div key={element.elementId} {...commonProps}>
            <button
              style={{
                backgroundColor: element.properties.backgroundColor,
                color: element.properties.textColor,
                borderRadius: `${element.properties.borderRadius}px`,
                padding:
                  element.properties.size === "small"
                    ? "4px 8px"
                    : element.properties.size === "medium"
                    ? "8px 16px"
                    : "12px 24px",
                fontFamily: element.properties.fontFamily,
                border: "none",
                cursor: "inherit"
              }}
              onMouseDown={(e) => e.stopPropagation()} // Stop propagation to make entire button clickable
              onClick={(e) => {
                e.stopPropagation();
                handleElementSelect(e, element);
              }}
            >
              {element.properties.text}
            </button>
          </div>
        );

      // In the renderCanvasElement function, replace the divider case:
      case "divider":
        const dividerStyle = {
          width: `${element.properties.thickness}px`,
          height: `${element.properties.width}px`,
          backgroundColor: element.properties.color,
          margin: "0 12px",
          display: "inline-block", // Add this for vertical dividers
        };

        return (
          <div key={element.elementId} {...commonProps}>
            <div style={dividerStyle}></div>
          </div>
        );

      case "icon":
        const iconSymbol =
          availableIcons.find((i) => i.id === element.properties.icon)
            ?.symbol || "★";
        return (
          <div key={element.elementId} {...commonProps}>
            <div
              style={{
                fontSize: `${element.properties.size}px`,
                color: element.properties.color,
                transform: `rotate(${element.properties.rotation}deg)`,
                display: "inline-block",
              }}
            >
              {iconSymbol}
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <div
      className="relative flex-1 bg-gray-100 overflow-auto"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleCanvasClick}
      style={canvasStyle}
    >
      <div className="relative w-[1200px] h-[800px] min-h-screen mx-auto">
        {canvasElements.map((element) => renderCanvasElement(element))}
      </div>
    </div>
  );
};

export default Canvas;
