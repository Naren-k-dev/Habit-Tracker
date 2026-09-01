import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";


// ==========================================
// RESTORE SAVED THEME
// ==========================================

const savedTheme =
  localStorage.getItem("habitflow_theme");


// ==========================================
// APPLY THEME BEFORE APP RENDERS
// ==========================================

if (savedTheme === "Dark") {

  document.documentElement.dataset.theme =
    "dark";

} else {

  document.documentElement.dataset.theme =
    "light";

}


// ==========================================
// RENDER APPLICATION
// ==========================================

createRoot(
  document.getElementById("root")!
).render(

  <StrictMode>

    <App />

  </StrictMode>

);