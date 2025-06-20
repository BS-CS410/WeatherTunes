import { useContext } from "react";
import { SettingsContext } from "@/contexts/SettingsProvider";
import type { SettingsContextType } from "@/contexts/SettingsProvider";

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
