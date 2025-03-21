import { useRef } from "react";
import { availableFonts, availableIcons } from "../configs";

const RenderPropertiesPanel = ({
  selectedElement,
  updateElementProperties,
}) => {
  const fileInputRef = useRef(null);

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (e) => {
    if (!selectedElement || selectedElement.type !== "image") return;

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      updateElementProperties("customSrc", event.target.result);
    };
    reader.readAsDataURL(file);
  };

  if (!selectedElement)
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Select an element to edit its properties</p>
      </div>
    );

  switch (selectedElement.type) {
    case "text":
      return (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Text Properties</h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Content</label>
            <textarea
              value={selectedElement.properties.content}
              onChange={(e) =>
                updateElementProperties("content", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="3"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Font Family</label>
            <select
              value={selectedElement.properties.fontFamily}
              onChange={(e) =>
                updateElementProperties("fontFamily", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {availableFonts.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Font Size (px)</label>
            <input
              type="number"
              value={selectedElement.properties.fontSize}
              onChange={(e) =>
                updateElementProperties("fontSize", parseInt(e.target.value))
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              min="8"
              max="72"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Overlay (z-index)
            </label>
            <input
              type="number"
              value={selectedElement.properties.zIndex}
              onChange={(e) =>
                updateElementProperties("zIndex", parseInt(e.target.value))
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              min="-10"
              max="10"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={selectedElement.properties.color}
                onChange={(e) =>
                  updateElementProperties("color", e.target.value)
                }
                className="p-1 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={selectedElement.properties.color}
                onChange={(e) =>
                  updateElementProperties("color", e.target.value)
                }
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Font Weight</label>
            <select
              value={selectedElement.properties.fontWeight}
              onChange={(e) =>
                updateElementProperties("fontWeight", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="lighter">Light</option>
            </select>
          </div>
        </div>
      );

    // Replace the image properties panel section:
    case "image":
      return (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Image Properties</h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Upload Image</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={triggerFileUpload}
              className="w-full p-2 bg-blue-100 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-200"
            >
              Upload Image
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Alt Text</label>
            <input
              type="text"
              value={selectedElement.properties.alt}
              onChange={(e) => updateElementProperties("alt", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Size (px)</label>
              <input
                type="number"
                value={selectedElement.properties.width}
                onChange={(e) =>
                  updateElementProperties("width", parseInt(e.target.value))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                min="50"
                max="1200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Overlay (z-index)
            </label>
            <input
              type="number"
              value={selectedElement.properties.zIndex}
              onChange={(e) =>
                updateElementProperties("zIndex", parseInt(e.target.value))
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              min="-10"
              max="10"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Rotation (degrees)
            </label>
            <input
              type="number"
              value={selectedElement.properties.rotation}
              onChange={(e) =>
                updateElementProperties("rotation", e.target.value)
              }
              onBlur={(e) => {
                const value = parseInt(e.target.value);
                updateElementProperties("rotation", isNaN(value) ? 0 : value);
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="-360"
              max="360"
            />
          </div>
        </div>
      );

    case "button":
      return (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Button Properties</h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Button Text</label>
            <input
              type="text"
              value={selectedElement.properties.text}
              onChange={(e) => updateElementProperties("text", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Font Family</label>
            <select
              value={selectedElement.properties.fontFamily}
              onChange={(e) =>
                updateElementProperties("fontFamily", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {availableFonts.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Background Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={selectedElement.properties.backgroundColor}
                onChange={(e) =>
                  updateElementProperties("backgroundColor", e.target.value)
                }
                className="p-1 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={selectedElement.properties.backgroundColor}
                onChange={(e) =>
                  updateElementProperties("backgroundColor", e.target.value)
                }
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Text Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={selectedElement.properties.textColor}
                onChange={(e) =>
                  updateElementProperties("textColor", e.target.value)
                }
                className="p-1 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={selectedElement.properties.textColor}
                onChange={(e) =>
                  updateElementProperties("textColor", e.target.value)
                }
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Size</label>
            <select
              value={selectedElement.properties.size}
              onChange={(e) => updateElementProperties("size", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Overlay (z-index)
            </label>
            <input
              type="number"
              value={selectedElement.properties.zIndex}
              onChange={(e) =>
                updateElementProperties("zIndex", parseInt(e.target.value))
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              min="-10"
              max="10"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Border Radius (px)
            </label>
            <input
              type="number"
              value={selectedElement.properties.borderRadius}
              onChange={(e) =>
                updateElementProperties(
                  "borderRadius",
                  parseInt(e.target.value)
                )
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
              max="32"
            />
          </div>
        </div>
      );

    case "divider":
      return (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Divider Properties</h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Width (%)</label>
            <input
              type="number"
              value={selectedElement.properties.width}
              onChange={(e) =>
                updateElementProperties("width", parseInt(e.target.value))
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              min="10"
              max="100"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Thickness (px)</label>
            <input
              type="number"
              value={selectedElement.properties.thickness}
              onChange={(e) =>
                updateElementProperties("thickness", parseInt(e.target.value))
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              min="1"
              max="20"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Overlay (z-index)
            </label>
            <input
              type="number"
              value={selectedElement.properties.zIndex}
              onChange={(e) =>
                updateElementProperties("zIndex", parseInt(e.target.value))
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              min="-10"
              max="10"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={selectedElement.properties.color}
                onChange={(e) =>
                  updateElementProperties("color", e.target.value)
                }
                className="p-1 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={selectedElement.properties.color}
                onChange={(e) =>
                  updateElementProperties("color", e.target.value)
                }
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      );

    case "icon":
      return (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Icon Properties</h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Icon</label>
            <select
              value={selectedElement.properties.icon}
              onChange={(e) => updateElementProperties("icon", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {availableIcons.map((icon) => (
                <option key={icon.id} value={icon.id}>
                  {icon.symbol} {icon.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Size (px)</label>
            <input
              type="number"
              value={selectedElement.properties.size}
              onChange={(e) =>
                updateElementProperties("size", parseInt(e.target.value))
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              min="12"
              max="128"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Overlay (z-index)
            </label>
            <input
              type="number"
              value={selectedElement.properties.zIndex}
              onChange={(e) =>
                updateElementProperties("zIndex", parseInt(e.target.value))
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              min="-10"
              max="10"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Rotation (degrees)
            </label>
            <input
              type="number"
              value={selectedElement.properties.rotation}
              onChange={(e) =>
                updateElementProperties("rotation", e.target.value)
              }
              onBlur={(e) => {
                const value = parseInt(e.target.value);
                updateElementProperties("rotation", isNaN(value) ? 0 : value);
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="-360"
              max="360"
            />
          </div>
        </div>
      );

    default:
      return (
        <div className="p-4 text-center text-gray-500">
          <p>Select an element to edit its properties</p>
        </div>
      );
  }
};

export default RenderPropertiesPanel;
