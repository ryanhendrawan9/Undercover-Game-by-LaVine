/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      colors: {
        ink: "#0D0D0D",
        paper: "#F5F0E8",
        crimson: "#C41E3A",
        gold: "#D4AF37",
        mist: "#8B9EB7",
        shadow: "#1A1A2E",
      },
    },
  },
  plugins: [],
};
