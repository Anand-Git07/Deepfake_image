export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        guard: {
          bg: "#0d0d12",
          panel: "#171721",
          card: "#1c1b27",
          line: "#343145",
          purple: "#7c5cff",
          red: "#ff4d4d",
          green: "#33e09b",
          amber: "#ffb020"
        }
      },
      boxShadow: {
        glow: "0 0 34px rgba(124,92,255,.28)",
        redglow: "0 0 38px rgba(255,77,77,.24)"
      }
    }
  },
  plugins: []
};
