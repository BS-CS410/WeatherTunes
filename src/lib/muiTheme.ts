import { createTheme } from "@mui/material/styles";

// Material UI theme that integrates with existing WeatherTunes design
export const muiTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3b82f6", // blue-500 - matches existing blue theme
      light: "#60a5fa", // blue-400
      dark: "#1d4ed8", // blue-700
    },
    secondary: {
      main: "#6b7280", // gray-500 - neutral secondary
      light: "#9ca3af", // gray-400
      dark: "#374151", // gray-700
    },
    background: {
      default: "#ffffff",
      paper: "#f8fafc", // slate-50 - matches existing card backgrounds
    },
    text: {
      primary: "#1f2937", // gray-800 - matches existing text
      secondary: "#6b7280", // gray-500
    },
  },
  typography: {
    fontFamily: "inherit", // Use existing font stack
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8, // matches existing rounded-lg
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640, // matches Tailwind sm
      md: 768, // matches Tailwind md
      lg: 1024, // matches Tailwind lg
      xl: 1280, // matches Tailwind xl
    },
  },
  components: {
    // Customize components to match existing design
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none", // remove default gradient
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // keep normal case
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)", // matches existing shadow
        },
      },
    },
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
    },
  },
});

// Dark theme variant
export const muiDarkTheme = createTheme({
  ...muiTheme,
  palette: {
    ...muiTheme.palette,
    mode: "dark",
    primary: {
      main: "#60a5fa", // blue-400 - lighter for dark mode
      light: "#93c5fd", // blue-300
      dark: "#3b82f6", // blue-500
    },
    background: {
      default: "#0f172a", // slate-900
      paper: "#1e293b", // slate-800
    },
    text: {
      primary: "#f1f5f9", // slate-100
      secondary: "#94a3b8", // slate-400
    },
  },
});
