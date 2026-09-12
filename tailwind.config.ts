import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        surface: "#FFFFFF",
        "surface-container": "#F1F5F9",
        "surface-container-low": "#F8FAFC",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-high": "#E2E8F0",
        "on-surface": "#0F172A",
        "on-surface-variant": "#475569",
        outline: "#94A3B8",
        "outline-variant": "#E2E8F0",
        primary: "#0F766E", // Restrained Deep Teal / Emerald
        "primary-hover": "#0D9488",
        "on-primary": "#FFFFFF",
        secondary: "#D97706",
        tertiary: "#059669",
        error: "#DC2626",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
