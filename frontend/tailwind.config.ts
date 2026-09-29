import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B2545",
          800: "#102F52",
          900: "#071C35",
        },
        primary: { DEFAULT: "#F04444", foreground: "#ffffff" },
        secondary: { DEFAULT: "#0B2545", foreground: "#ffffff" },
        accent: { DEFAULT: "#FF8A3D", foreground: "#0B2545" },
        "accent-light": "#FF9B52",
        success: { DEFAULT: "#16A34A", foreground: "#ffffff" },
        muted: { DEFAULT: "#F1F5F9", foreground: "#475569" },
        border: "#E2E8F0",
        background: "#F7F9FC",
        foreground: "#0F172A",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        arabic: ["var(--font-noto-arabic)", "sans-serif"],
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(11, 37, 69, 0.05)",
        "card-hover": "0 12px 32px rgba(11, 37, 69, 0.10)",
        search: "0 4px 18px rgba(11, 37, 69, 0.08)",
        header: "0 4px 20px rgba(11, 37, 69, 0.08)",
      },
      maxWidth: {
        "8xl": "88rem",
      },
    },
  },
  plugins: [],
};

export default config;
