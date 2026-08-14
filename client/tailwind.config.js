/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        logo: ['Ribes', 'sans-serif'],
        display: ['Roboto Condensed', 'sans-serif'],
        body: ['Roboto Condensed', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
        mono: ['Schroffer Mono', 'monospace']
      }, 
      colors: {
        bird: {
          orange: '#FF6B18',
          pink: '#FF0085',
          white: '#FFFFFF',
          blue: '#0000FF',
          green: '#39FF14',
          yellow: '#CCFF00',
          black: '#0A0A0A',
        }
      }
    },
  },
  plugins: [],
}

