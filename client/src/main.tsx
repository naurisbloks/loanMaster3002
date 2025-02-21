import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from './App';
import "./index.css";
import "./lib/i18n"; // Initialize i18next

// Initialize root element for React application
const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found. Make sure there is a div with id 'root' in your HTML file.");
}

// Create and render React application
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Enable HMR in development
if (import.meta.hot) {
  import.meta.hot.accept();
}