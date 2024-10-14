/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sidenav: "#0E2238",
        signOutButton: "#00bac7",
        signOutButtonHover: "#009ea9",
        primaryBackground: "#F8FAFB",
        primaryButton: "#7749F8",
        primaryButtonHover: "#5227CC",
        editButton: "#6C757D",
      },
      borderColor: {
        primaryButton: "#7749F8",
      },
      textColor: {
        primaryButton: "#6610F2",
      },
      width: {
        content: "calc(100% - 14rem)",
        excelModal: "800px",
        updateModal: "700px",
        registerModal: "600px",
      },
      height: {
        main: "calc(100% - 4rem)",
        excelModal: "600px",
        updateModal: "800px",
        registerModal: "400px",
      },
    },
  },
  plugins: [],
};
