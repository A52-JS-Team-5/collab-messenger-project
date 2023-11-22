// eslint-disable-next-line no-undef
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      'light-gray': '#EFEFF0',
      red: '#ff0000',
      white: '#F9F9FF',
      grey: '#EEEFF5',
      yellow: '#FFD100',
      mint: '#77EAE2',
      blue: '#0075FF',
      'darker-blue': '#0C12D7',
      pink: '#EE4FE8',
      black: '#000C1A',
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require('daisyui')],
};
