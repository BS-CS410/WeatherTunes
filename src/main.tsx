import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { MuiThemeProvider } from "@/components/MuiThemeProvider";
import { CurrentTrackProvider } from "@/contexts/CurrentTrackContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <CurrentTrackProvider>
          <MuiThemeProvider>
            <App />
          </MuiThemeProvider>
        </CurrentTrackProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>,
);
