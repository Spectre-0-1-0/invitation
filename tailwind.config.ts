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
        heritage: {
          navy: "#1A2B48",
        },
        champagne: {
          gold: "#D4AF37",
        },
        burnt: {
          sienna: "#A0522D",
        },
        parchment: {
          base: "#FDFCF8",
          muted: "#F5F2EA",
        },
        charcoal: {
          DEFAULT: "#333333",
          muted: "#666666",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
