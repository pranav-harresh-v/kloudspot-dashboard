/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        kloud: {
          sidebar: "#0f383a",
          hover: "#1a4f52",
          bg: "#f8fafc",
          primary: "#14b8a6",
          text: "#334155",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
