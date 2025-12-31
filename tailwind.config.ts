import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
      fontSize: {
        xs: ["var(--fs-0)", { lineHeight: "1.25rem" }],     // 12px
        sm: ["var(--fs-1)", { lineHeight: "1.35rem" }],     // 14px
        base: ["var(--fs-2)", { lineHeight: "1.55rem" }],   // 16px
        lg: ["var(--fs-3)", { lineHeight: "1.7rem" }],      // 18px
        xl: ["var(--fs-4)", { lineHeight: "2rem" }],        // 24px
        "2xl": ["var(--fs-5)", { lineHeight: "2.4rem" }],   // 32px
        "3xl": ["var(--fs-6)", { lineHeight: "2.9rem" }],   // 40px
        "4xl": ["var(--fs-7)", { lineHeight: "3.5rem" }],   // 48px
        "5xl": ["var(--fs-8)", { lineHeight: "4.5rem" }],   // 64px
        "6xl": ["var(--fs-9)", { lineHeight: "6.5rem" }],   // 96px - Hero
      },
      colors: {
        brand: {
          green: "rgb(22 163 74)",
          blue: "rgb(37 99 235)",
          violet: "rgb(124 58 237)",
          emerald: "rgb(5 150 105)",
        },
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.06)",
        card: "0 8px 24px rgba(0,0,0,0.06)",
        glow: "0 0 60px rgba(59,130,246,0.15)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  // HIER WAR DER FEHLER - JETZT GEFÜLLT:
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
export default config;