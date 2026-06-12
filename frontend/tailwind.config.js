/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ey: {
          yellow: "#FFE600",
          black:  "#1A1A1A",
          gray:   "#595959",
          light:  "#F6F6F6",
          border: "#D3D3D3",
        },
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
};
