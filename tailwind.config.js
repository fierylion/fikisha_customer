/** @type {import('tailwindcss').Config} */
// #000000 // #14213d // #fca311 // #e5e5e5 // #ffffff





// OpenSans_300Light,
//     OpenSans_400Regular,
//     OpenSans_500Medium,
//     OpenSans_600SemiBold,
//     OpenSans_700Bold,
//     OpenSans_800ExtraBold,
//     OpenSans_300Light_Italic,
//     OpenSans_400Regular_Italic,
//     OpenSans_500Medium_Italic,
//     OpenSans_600SemiBold_Italic,
//     OpenSans_700Bold_Italic,
//     OpenSans_800ExtraBold_Italic,
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    fontFamily: {
      sanSmall_300: 'OpenSans_300Light',
      sanLight_300: 'OpenSans_300Light_Italic',
      sanRegular_400: ' OpenSans_400Regular',
      sanBold_500: 'OpenSans_500Medium',
      sanBold_700: 'OpenSans_700Bold',
    },
    colors: {
      custom_orange: {
        500: '#fca311', // major
      },
      custom_red: {
        200: '#EE4B2B',
      },
      custom_blue: {
        200: '#5f77f5',
        500: '#162140',
        600: '#14213d', // major
        700: '#071333',

        900: '#001125',
      },
      custom_white: {
        100: '#ffffff', // major
        400: '#f0f0f0',
        600: '#808080', // major gray
        500: '#e5e5e5', // major
        700: '#aaacaf',
      },
      custom_black: {
        100: '#000000', // major
      },
      custom_silver: {
        500: '#C0C0C0',
      },
    },
    extend: {},
  },
  plugins: [],
}

