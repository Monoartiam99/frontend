/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        primaryText: '#1a1a1a',
        secondaryText: '#555555',
        surfaceMuted: '#ffffff',
        textInverse: '#667eea',
        surfaceBase: '#000000',
        surfaceStrong: '#f8f9fa',
        primaryBrand: '#667eea', // Reusing inverse as an accent brand color
      }
    },
  },
  plugins: [],
}
