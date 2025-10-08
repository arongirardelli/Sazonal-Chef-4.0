/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bone-white': '#F5F5DC',  // Branco Osso/Giz
        'terracotta': '#CD853F',  // Laranja Terracota
        'terracotta-dark': '#8B4513',  // Marrom Terracota escuro
        'dark-gray': '#2F2F2F',  // Cinza Escuro (quase preto)
      }
    },
  },
  plugins: [],
}
