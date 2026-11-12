import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { nude: "#EFE3DA", beige: "#F6EFE9", rose: "#B9867F", mist: "#E7E4E2", ink: "#171414" },
    fontFamily: { sans: ["var(--font-sans)"], serif: ["var(--font-serif)"] },
  } },
} satisfies Config;
