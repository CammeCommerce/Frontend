/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sidenav: "#0E2238",
        primaryButton: "#00bac7",
        primaryButtonHover: "#009ea9",
        primaryBackground: "#F8FAFB",
      },
      width: {
        content: "calc(100% - 14rem)",
        excelModal: "800px",
        updateModal: "700px",
      },
      height: {
        main: "calc(100% - 4rem)",
        excelModal: "600px",
        updateModal: "800px",
      },
    },
  },
  plugins: [],
};
