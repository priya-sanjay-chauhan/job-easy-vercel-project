/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(54, 55, 245)",
        secondary: "rgb(84, 85, 247)",
        accent: "rgb(44, 45, 235)",
        neutral: "rgb(240, 240, 255)",
        warmGray: "#d6d3d1",
        warmBlack: "#1c1917",
      },
    },
  },
  plugins: [],
};
