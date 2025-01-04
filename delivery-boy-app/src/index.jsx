import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Get the root DOM node
const rootElement = document.getElementById("root");

// Create a root and render the app
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
