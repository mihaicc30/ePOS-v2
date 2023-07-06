/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        fadeUP1: "fadeUP .5s forwards",
        fadeUPnDOWN: "fadeUPnDOWN 4s forwards",
        fadeDOWN1: "fadeDOWN .5s forwards",
        shrinkFromLeft: "shrinkFromLeft 4s forwards",
        shake: "shake .5s forwards",
      },
      keyframes: {
        fadeUPnDOWN: {
          "0%": { transform: "translateY(-2rem)", opacity: "0" },
          "20%": { transform: "translateY(0rem)", opacity: "1" },
          "70%": { transform: "translateY(0rem)", opacity: "1" },
          "100%": { transform: "translateY(2rem)", opacity: "0" },
        },
        fadeUP: {
          "0%": { transform: "translateY(2rem)", opacity: "0" },
          "100%": { transform: "translateY(0rem)", opacity: "1" },
        },
        fadeDOWN: {
          "0%": { transform: "translateY(0rem)", opacity: "1" },
          "100%": { transform: "translateY(2rem)", opacity: "0" },
        },

        shrinkFromLeft: {
          "0%": { width: "100%" },
          "100%": { width: "0%" },
        },

        shake: {
          "0%": { transform: "translate(2px, 1px) rotate(0deg)" },
          "10%": { transform: "translate(-1px, -2px) rotate(-1deg)" },
          "20%": { transform: "translate(-3px, 0px) rotate(1deg)" },
          "30%": { transform: "translate(0px, 2px) rotate(0deg)" },
          "40%": { transform: "translate(1px, -1px) rotate(1deg)" },
          "50%": { transform: "translate(-1px, 2px) rotate(-1deg)" },
          "60%": { transform: "translate(-3px, 1px) rotate(0deg)" },
          "70%": { transform: "translate(2px, 1px) rotate(-1deg)" },
          "80%": { transform: "translate(-1px, -1px) rotate(1deg)" },
          "90%": { transform: "translate(2px, 2px) rotate(0deg)" },
          "99%": { transform: "translate(1px, -2px) rotate(-1deg)" },
          "100%": { transform: "translate(0px, 0px) rotate(0deg)" },
        },
      },
    },
  },
  plugins: [],
};
