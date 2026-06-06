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
          dark: "#0F1A2E",
        },
        champagne: {
          gold: "#D4AF37",
          light: "#E5C76B",
        },
        burnt: {
          sienna: "#A0522D",
        },
        parchment: {
          base: "#FDFCF8",
          muted: "#F5F2EA",
          dark: "#E8E2D3",
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
      borderRadius: {
        soft: "8px",
        photo: "2px",
      },
      boxShadow: {
        scrapbook: "0 4px 20px -2px rgba(26, 43, 72, 0.1), 0 2px 10px -1px rgba(26, 43, 72, 0.05)",
        polaroid: "0 10px 30px -5px rgba(0, 0, 0, 0.2)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'subtle-grain': "url('https://grainy-gradients.vercel.app/noise.svg')",
      }
    },
  },
  plugins: [],
};
export default config;
