import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { type ReactNode } from "react";
import { muiTheme, muiDarkTheme } from "@/lib";
import { useSettings } from "@/hooks";

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Material UI theme provider that integrates with existing settings context
 * Automatically switches between light and dark themes based on user preferences
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const { settings } = useSettings();

  // Determine which theme to use based on settings
  const isDark =
    settings.themeMode === "dark" ||
    (settings.themeMode === "auto" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const theme = isDark ? muiDarkTheme : muiTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </MuiThemeProvider>
  );
}
