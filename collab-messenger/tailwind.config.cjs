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
      lightBlue: '#D7E4F6',
      blue30: '#B2D5FF',
      pureWhite: '#FFFFFF',
      green: '#4EC274'
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require('daisyui')],
};
