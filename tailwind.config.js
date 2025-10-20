/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // JoltCab Brand Colors - Based on logo
        joltcab: {
          // Green (Primary - from logo)
          50: '#f3fdf0',
          100: '#e5fbdc',
          200: '#cdf7ba',
          300: '#a8f08b',
          400: '#7ed957', // Main logo green
          500: '#5ec438',
          600: '#47a127',
          700: '#397d22',
          800: '#316321',
          900: '#2a531e',
          950: '#132e0b',
        },
        // Keep black for secondary
        black: '#000000',
      },
      // Add primary alias for easier use
      primary: {
        DEFAULT: '#7ed957',
        dark: '#47a127',
        light: '#a8f08b',
      },
    },
  },
  plugins: [],
}
