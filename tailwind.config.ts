import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { nude: "#F4F4F5", beige: "#FAFAFA", rose: "#71717A", mist: "#E4E4E7", ink: "#09090B" },
      fontFamily: { sans: ["var(--font-sans)"], serif: ["var(--font-serif)"] },
    },
  },
  plugins: [],
} satisfies Config;
