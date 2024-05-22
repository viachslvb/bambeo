const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './src/**/*.{html,ts}',
    './projects/**/*.{html,ts}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['GT Eesti', 'Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
    screens: {
      'xxs': '320px',
      'xs': '425px',
      ...defaultTheme.screens,
    },
  }
 };