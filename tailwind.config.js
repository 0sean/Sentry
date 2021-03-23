module.exports = {
  purge: ["./web/pages/**/*.tsx", "./web/components/**/*.tsx"],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        notquiteblack: "#23272A",
        blend: "#090A0B",
        sentryred: "#FF474A"
      },
      fontFamily: {
        noisywalk: "Noisy Walk",
        inter: "Inter",
        sans: "Poppins"
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ["checked"]
    }
  },
  plugins: [
    require("@tailwindcss/forms")
  ]
}
