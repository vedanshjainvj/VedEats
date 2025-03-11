import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// --------------- IMPORTING COMPONENTS ---------------
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "./components/ui/sonner.tsx";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster/>
  </StrictMode>,
)
