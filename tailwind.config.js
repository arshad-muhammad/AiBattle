/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
      extend: {
        colors: {
          main: '#121212', // Dark background for main area
          sidebar: '#0a0a0a', // Slightly darker for sidebar
          input: '#202020', // Input area background
          hoverGray: '#2a2a2a',
          textPrimary: '#ededed',
          textSecondary: '#a1a1a1',
          border: '#333333'
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        }
      },
    },
    plugins: [],
  };
  