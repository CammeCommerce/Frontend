/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sidenav: "#0E2238",
        primaryButton: "#00bac7",
        primaryButtonHover: "#009ea9",
      },
      width: {
        content: "calc(100% - 14rem)",
      },
    },
  },
  plugins: [],
};
