import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          DEFAULT: "#6e0f1f",
          muted: "rgba(110, 15, 31, 0.65)",
        },
        gold: {
          DEFAULT: "#c9a227",
          soft: "#e8d48b",
        },
      },
      fontFamily: {
        electrolize: ["var(--font-electrolize)", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
