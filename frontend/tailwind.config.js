module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#DC2626",
          accent: "#14B8A6",
          light: "#F9FAFB",
          dark: "#0F172A"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)"
      },
      backgroundImage: {
        "dashboard-watermark":
          "radial-gradient(circle at 20% 20%, rgba(220,38,38,0.08), transparent 30%), radial-gradient(circle at 80% 0%, rgba(20,184,166,0.08), transparent 25%)"
      }
    }
  },
  plugins: []
};
