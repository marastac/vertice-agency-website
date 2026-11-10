/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Identidad MAASTAC: azul tecnológico sobre navy profundo, con acentos violeta.
        ink: {
          DEFAULT: '#071123', // fondo oscuro principal (también theme-color)
          800: '#0c1838',
          700: '#13234a',
        },
        plum: '#1b1145', // violeta oscuro de los degradados de marca
      },
      fontFamily: {
        // Sin fuentes remotas (privacidad y rendimiento): pila del sistema, Inter si ya está instalada.
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};
