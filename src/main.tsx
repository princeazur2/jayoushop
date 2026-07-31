import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { useTheme } from "@/stores/useTheme";
import { useAdmin } from "@/stores/useAdmin";
import ErrorBoundary from "@/components/ErrorBoundary";

useTheme.getState().applyColors();
useAdmin.getState().init();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Echec silencieux : le site reste utilisable normalement sans SW.
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);