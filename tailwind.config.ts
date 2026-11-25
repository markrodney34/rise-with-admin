import type { Config } from "tailwindcss";
// Design tokens: edit colours, fonts, radii and shadows here.
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { blue: "#397c79", navy: "#123b31", grow: "#79b934", mist: "#f3f4ed", ink: "#202720", lime: "#c8ef63", paper: "#fbfbf7" },
      fontFamily: { display: ["var(--font-display)", "Impact", "sans-serif"], body: ["var(--font-body)", "system-ui", "sans-serif"] },
      borderRadius: { card: "4px" },
      boxShadow: { lift: "0 18px 40px -18px rgba(18,59,49,.28)" },
    },
  },
  plugins: [],
} satisfies Config;
