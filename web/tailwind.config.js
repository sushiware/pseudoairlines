/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        futura_heavy: ["futura_heavy"],
      },
      width: {
        128: "32rem",
      },
    },
  },
  plugins: [],
};
