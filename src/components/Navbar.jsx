import React, { useEffect } from "react";
import { availableIcons, availableThemes } from "../configs/index";

const Navbar = ({
  selectedTheme,
  setSelectedTheme,
  canvasElements,
  setCanvasElements,
  setSelectedElement,
}) => {
  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
      setSelectedTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    if (selectedTheme) {
      localStorage.setItem("selectedTheme", selectedTheme);
    }
  }, [selectedTheme]);

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

    // Convert canvas elements to HTML
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
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">WebSmith</h1>
      <div className="space-x-2">
        <select
          value={selectedTheme}
          onChange={(e) => setSelectedTheme(e.target.value)}
          className="p-2 border rounded-md"
        >
          {availableThemes.map((theme) => (
            <option key={theme.value} value={theme.value}>
              {theme.label}
            </option>
          ))}
        </select>
        <button
          onClick={exportWebsite}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Export HTML
        </button>
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
        >
          Clear Canvas
        </button>
      </div>
    </div>
  );
};

export default Navbar;
