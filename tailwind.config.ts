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
      },
    },
  },
  plugins: [],
};
export default config;
