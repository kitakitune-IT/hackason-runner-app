/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
            fontFamily: {
        'mincho': ['"Sawarabi Mincho"', 'serif']
      },
      colors: {
        'nostalgic-brown': '#5a4641',
      }
    },
  },
  plugins: [],
}