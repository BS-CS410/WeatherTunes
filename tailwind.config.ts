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
        "pulse-eq": "pulse-eq 1.2s infinite ease-in-out",
        float: "float 3s infinite ease-in-out",
        "pulse-updown": "pulse-updown 0.8s infinite cubic-bezier(0.4,0,0.6,1)",
      },
      keyframes: {
        "pulse-eq": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.2" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-24px)" },
        },
        "pulse-updown": {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "20%": { transform: "translateY(-12px) scale(1.05)" },
          "50%": { transform: "translateY(0) scale(1)" },
          "70%": { transform: "translateY(12px) scale(0.95)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
