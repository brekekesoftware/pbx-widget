const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', ...defaultTheme.fontFamily.sans],
      },
      width: {
        widget: '398px',
      },
      colors: {
        app: {
          DEFAULT: '#8DCC75',
          text: '#63bc4d',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
