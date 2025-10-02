/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bege': '#F5F0E5',
        'verde-escuro': '#2C5530',
      }
    },
  },
  plugins: [],
}
