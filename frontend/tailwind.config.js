/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        oil: {
          dark: "#0b1320",
          card: "#131f33",
          border: "#1f3150",
          accent: "#ff9900",
          blue: "#0077cc"
        }
      }
    },
  },
  plugins: [],
}
