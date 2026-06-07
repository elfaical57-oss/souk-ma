import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#e63946", foreground: "#ffffff" },
        secondary: { DEFAULT: "#1d3557", foreground: "#ffffff" },
        accent: { DEFAULT: "#f4a261", foreground: "#1d3557" },
        muted: { DEFAULT: "#f1f5f9", foreground: "#64748b" },
        border: "#e2e8f0",
        background: "#ffffff",
        foreground: "#1d3557",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        arabic: ["var(--font-noto-arabic)", "sans-serif"],
      },
      borderRadius: { lg: "0.5rem", md: "0.375rem", sm: "0.25rem" },
    },
  },
  plugins: [],
};

export default config;
