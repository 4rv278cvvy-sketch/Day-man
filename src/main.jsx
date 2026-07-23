import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// L'app a été extraite d'un environnement d'artefact qui fournissait
// window.storage.get/set (persistance clé-valeur asynchrone). En dehors de
// cet environnement, on retombe sur localStorage avec la même interface.
if (!window.storage) {
  window.storage = {
    async get(key) {
      const value = localStorage.getItem(key);
      return { value };
    },
    async set(key, value) {
      localStorage.setItem(key, value);
    },
  };
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
