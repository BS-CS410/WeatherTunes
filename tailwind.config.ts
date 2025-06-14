import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        intertight: ["Inter Tight", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
