import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        display: ["var(--font-instrument)", "Georgia", "serif"],
      },
      colors: {
        bg: "#0a0a0a",
        ink: "#fafafa",
        muted: "#a3a3a3",
        line: "#1f1f1f",
        accent: "#d4ff3a",
        warn: "#ff6b3a",
      },
      keyframes: {
        ticker: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
      },
      animation: { ticker: "ticker 60s linear infinite" },
    },
  },
  plugins: [],
};

export default config;
