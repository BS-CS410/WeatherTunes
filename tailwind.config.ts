import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        intertight: ["Inter Tight", "sans-serif"],
      },
      animation: {
        float: "float 3s infinite ease-in-out",
        glow: "glow 4s ease-in-out infinite alternate",
        "liquid-morph": "liquid-morph 6s ease-in-out infinite",
        "liquid-breathe": "liquid-breathe 4s ease-in-out infinite",
        "liquid-shimmer": "liquid-shimmer 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-24px)" },
        },
        glow: {
          "0%": { opacity: "0.7", filter: "blur(8px) brightness(1.1)" },
          "50%": { opacity: "1", filter: "blur(16px) brightness(1.3)" },
          "100%": { opacity: "0.7", filter: "blur(8px) brightness(1.1)" },
        },
        "liquid-morph": {
          "0%": {
            borderRadius: "1rem",
            transform: "scale(1)",
          },
          "50%": {
            borderRadius: "1.5rem",
            transform: "scale(1.005)",
          },
          "100%": {
            borderRadius: "1rem",
            transform: "scale(1)",
          },
        },
        "liquid-breathe": {
          "0%, 100%": {
            backdropFilter: "blur(16px) saturate(160%)",
            borderColor: "rgba(255, 255, 255, 0.12)",
            boxShadow: "inset 0 0.5px 0 0 rgba(255, 255, 255, 0.15)",
          },
          "50%": {
            backdropFilter: "blur(20px) saturate(170%)",
            borderColor: "rgba(255, 255, 255, 0.15)",
            boxShadow: "inset 0 0.5px 0 0 rgba(255, 255, 255, 0.2)",
          },
        },
        "liquid-shimmer": {
          "0%": {
            backgroundPosition: "-200% 0",
            opacity: "0.1",
          },
          "50%": {
            opacity: "0.3",
          },
          "100%": {
            backgroundPosition: "200% 0",
            opacity: "0.1",
          },
        },
      },
      borderRadius: {
        liquid: "0.75rem", // 12px - matches Apple's design
        "liquid-lg": "1rem", // 16px - for larger elements
        "liquid-xl": "1.25rem", // 20px - for prominent elements
        "liquid-2xl": "1.5rem", // 24px - for hero elements
      },
    },
  },
  plugins: [],
};
export default config;
