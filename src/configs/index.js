export const getDefaultProperties = (type) => {
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

// Available elements that can be dragged
export const availableElements = [
  { id: "text", type: "text", label: "Text Block", icon: "📝" },
  { id: "image", type: "image", label: "Image", icon: "🖼️" },
  { id: "button", type: "button", label: "Button", icon: "🔘" },
  { id: "divider", type: "divider", label: "Divider", icon: "—" },
  { id: "icon", type: "icon", label: "Icon", icon: "🔣" },
];

// Available fonts
export const availableFonts = [
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "Helvetica, sans-serif", label: "Helvetica" },
  { value: "Times New Roman, serif", label: "Times New Roman" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Courier New, monospace", label: "Courier New" },
  { value: "Tahoma, sans-serif", label: "Tahoma" },
  { value: "Trebuchet MS, sans-serif", label: "Trebuchet MS" },
  { value: "Impact, sans-serif", label: "Impact" },
];

export const availableThemes = [
  { value: "template1.avif", label: "Template 1" },
  { value: "template2.avif", label: "Template 2" },
  { value: "template3.avif", label: "Template 3" },
];

// Available icons
export const availableIcons = [
  { id: "star", label: "Star", symbol: "★" },
  { id: "heart", label: "Heart", symbol: "❤️" },
  { id: "check", label: "Check", symbol: "✓" },
  { id: "cross", label: "Cross", symbol: "✗" },
  { id: "arrow-right", label: "Arrow Right", symbol: "→" },
  { id: "arrow-left", label: "Arrow Left", symbol: "←" },
  { id: "arrow-up", label: "Arrow Up", symbol: "↑" },
  { id: "arrow-down", label: "Arrow Down", symbol: "↓" },
  { id: "search", label: "Search", symbol: "🔍" },
  { id: "circle", label: "Circle", symbol: "⚪" },
  { id: "square", label: "Square", symbol: "■" },
  { id: "triangle", label: "Triangle", symbol: "▲" },
  { id: "phone", label: "Phone", symbol: "📞" },
  { id: "mail", label: "Mail", symbol: "✉️" },
  { id: "home", label: "Home", symbol: "🏠" },
  { id: "settings", label: "Settings", symbol: "⚙️" },
];
