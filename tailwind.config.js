/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./node_modules/flowbite/**/*.js",
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        'page-bg': '#020205',
        'card-bg': '#0D121D',
        'accent': '#3898FA',
        'spixi': '#17334F',
        'spixi-dark': '#F0F2F4'
      },
      fontFamily: {
        'lexend': ['Lexend', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to right bottom, #1B0F33, #080C14)',
      },
    },
  },
  darkMode: 'class',
}

