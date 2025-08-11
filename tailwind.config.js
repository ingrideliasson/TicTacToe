/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
              delius: ['Delius', 'cursive'],
              autour: ['Autour One', 'system-ui'],
              nunito: ['Nunito', 'sans-serif'],
              cherry: ['Cherry Bomb One', 'system-ui'],
              shortstack: ['Short Stack', 'cursive'],
              girlnextdoor: ['The Girl Next Door', 'cursive'],
          },
    },
  },
  plugins: [],
}
