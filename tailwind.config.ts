import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blueprint: {
          dark: "#0F2847",
          DEFAULT: "#1B3A6B",
          light: "#2C5F8A",
          line: "#7FB4E0",
        },
        paper: "#EAF2FA",
        ink: "#0B1F33",
        accent: "#FF6B4A",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(127,180,224,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(127,180,224,0.18) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "24px 24px",
      },
    },
  },
  plugins: [],
};
export default config;
