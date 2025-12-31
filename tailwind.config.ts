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
        xs: ["var(--fs-0)", { lineHeight: "1.25rem" }],
        sm: ["var(--fs-1)", { lineHeight: "1.35rem" }],
        base: ["var(--fs-2)", { lineHeight: "1.55rem" }],
        lg: ["var(--fs-3)", { lineHeight: "1.7rem" }],
        xl: ["var(--fs-4)", { lineHeight: "2rem" }],
        "2xl": ["var(--fs-5)", { lineHeight: "2.4rem" }],
        "3xl": ["var(--fs-6)", { lineHeight: "2.9rem" }],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.06)",
        card: "0 8px 24px rgba(0,0,0,0.06)",
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