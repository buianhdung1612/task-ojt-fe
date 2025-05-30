/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#FF6B3D', // Cam chính
            light: '#FF8F6B',
            dark: '#E55A30',
          },
          secondary: {
            DEFAULT: '#FFFFFF', // Trắng
            dark: '#F5F5F5',
          },
        },
      },
    },
    plugins: [],
  }