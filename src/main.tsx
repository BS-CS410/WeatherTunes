import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CurrentTrackProvider } from "@/contexts/CurrentTrackContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <CurrentTrackProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </CurrentTrackProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>,
);
