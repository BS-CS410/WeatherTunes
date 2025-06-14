import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
