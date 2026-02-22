import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// We don't need the manual window.Buffer here anymore
// because ProvidePlugin handles it globally.

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
