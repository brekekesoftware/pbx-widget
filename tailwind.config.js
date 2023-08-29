const defaultTheme = require('tailwindcss/defaultTheme');
const { tailwindcssOriginSafelist } = require('@headlessui-float/react');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [...tailwindcssOriginSafelist],
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
  plugins: [require('@tailwindcss/forms')],
};
