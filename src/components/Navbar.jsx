import React, { useEffect, useState } from "react";
import { availableIcons, availableThemes } from "../configs/index";
import { ChevronDownIcon } from "lucide-react";

const Navbar = ({
  selectedTheme,
  setSelectedTheme,
  canvasElements,
  setCanvasElements,
  setSelectedElement,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
      setSelectedTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (selectedTheme) {
      localStorage.setItem("selectedTheme", selectedTheme);
    }
  }, [selectedTheme]);

  const handleThemeChange = (value) => {
    setSelectedTheme(value);
    setIsOpen(false);
  };

  const exportWebsite = async () => {
    // Helper function to convert image file to Base64
    const convertToBase64 = (filePath) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        fetch(filePath)
          .then((response) => response.blob())
          .then((blob) => {
            reader.readAsDataURL(blob);
            reader.onloadend = () => resolve(reader.result);
          });
      });
    };

    // Convert theme to Base64 if it exists
    let themeBase64 = "";
    if (selectedTheme) {
      themeBase64 = await convertToBase64(selectedTheme);
    }

    // Create a basic HTML structure
    const head = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Exported Website</title>
      <style>
        body { 
          margin: 0; 
          padding: 0; 
          width: 100vw;
          height: 100vh;
          background-image: url('${themeBase64}'); 
          background-size: cover;
          background-position: center;
          position: relative;
        }
        .exported-element { position: absolute; }
      </style>
    </head>
    <body>`;

    const foot = `</body></html>`;
    let content = "";

    canvasElements.forEach((element) => {
      const style = `position: absolute; left: ${element.position.x}px; top: ${element.position.y}px;`;

      switch (element.type) {
        case "text":
          content += `<p class="exported-element" style="${style} font-size: ${element.properties.fontSize}px; color: ${element.properties.color}; font-weight: ${element.properties.fontWeight}; font-family: ${element.properties.fontFamily};">${element.properties.content}</p>\n`;
          break;

        case "image":
          content += `<img class="exported-element" style="${style} transform: rotate(${
            element.properties.rotation
          }deg);" src="${
            element.properties.customSrc || element.properties.src
          }" alt="${element.properties.alt}" width="${
            element.properties.width
          }" height="${element.properties.height}">\n`;
          break;

        case "button":
          const buttonStyle = `${style} background-color: ${
            element.properties.backgroundColor
          }; color: ${element.properties.textColor}; border-radius: ${
            element.properties.borderRadius
          }px; padding: ${
            element.properties.size === "small"
              ? "4px 8px"
              : element.properties.size === "medium"
              ? "8px 16px"
              : "12px 24px"
          }; font-family: ${
            element.properties.fontFamily
          }; border: none; cursor: pointer;`;
          content += `<button class="exported-element" style="${buttonStyle}">${element.properties.text}</button>\n`;
          break;

        case "divider":
          const dividerStyle =
            element.properties.orientation === "horizontal"
              ? `${style} width: ${element.properties.width}%; height: ${element.properties.thickness}px; background-color: ${element.properties.color};`
              : `${style} width: ${element.properties.thickness}px; height: ${element.properties.width}px; background-color: ${element.properties.color};`;
          content += `<div class="exported-element" style="${dividerStyle}"></div>\n`;
          break;

        case "icon":
          const iconSymbol =
            availableIcons.find((i) => i.id === element.properties.icon)
              ?.symbol || "★";
          const iconStyle = `${style} font-size: ${element.properties.size}px; color: ${element.properties.color}; transform: rotate(${element.properties.rotation}deg);`;
          content += `<div class="exported-element" style="${iconStyle}">${iconSymbol}</div>\n`;
          break;

        default:
          break;
      }
    });

    const html = head + content + foot;

    // Create download link
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "exported-website.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearCanvas = () => {
    if (
      window.confirm(
        "Are you sure you want to clear the canvas? This action cannot be undone."
      )
    ) {
      setCanvasElements([]);
      setSelectedElement(null);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
      <div className="flex gap-2">
        <img
          src="/WebSmith.webp"
          alt="WebSmith logo"
          className="size-7 rounded-sm"
        />
        <h1 className="text-xl font-semibold text-gray-800">WebSmith</h1>
      </div>
      <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0">
        <div className="relative w-full sm:w-auto">
          <div
            className="p-2 border border-gray-300 rounded-lg shadow-sm bg-white flex justify-between items-center cursor-pointer focus:ring-2 focus:ring-blue-500 transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>
              {availableThemes.find((theme) => theme.value === selectedTheme)
                ?.label || "Select Theme"}
            </span>
            <ChevronDownIcon
              className={`w-5 h-5 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {isOpen && (
            <div className="absolute mt-1 text-center w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {availableThemes.map((theme) => (
                <div
                  key={theme.value}
                  onClick={() => handleThemeChange(theme.value)}
                  className="px-4 py-2 text-gray-700 hover:bg-blue-100 cursor-pointer transition"
                >
                  {theme.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={exportWebsite}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
        >
          Export HTML
        </button>

        <button
          onClick={clearCanvas}
          className="px-5 py-2.5 bg-red-100 text-red-700 rounded-lg shadow-md hover:bg-red-200 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-auto"
        >
          Clear Canvas
        </button>
      </div>
    </div>
  );
};

export default Navbar;
