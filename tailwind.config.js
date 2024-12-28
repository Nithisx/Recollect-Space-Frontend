module.exports = {
  content: [
    "./index.html",  // Make sure this file path is correct
    "./src/**/*.{js,ts,jsx,tsx}",  // Ensure this covers all your React components
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'system-ui'],  // Corrected font-family name
      },
      colors: {
        indigo: {
          50: '#f0f5ff',
          100: '#e5edff',
          200: '#c6d4ff',
          300: '#a1b7ff',
          400: '#7b8cff',
          500: '#5361ff',
          600: '#3b4aff',
          700: '#2633ff',
          800: '#1c2cff',
          900: '#1725ff'
        }
      },
      animation: {
        'fade-in-down': 'fadeInDown 0.5s ease-out',
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      boxShadow: {
        'custom': '0 10px 30px rgba(0, 0, 0, 0.05)',
      }
    }
  },
  plugins: [],
}
