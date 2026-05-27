/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#faf9f7',
          100: '#f5f3ef',
          200: '#ede9e2',
          300: '#ddd7cc',
          400: '#c9c0b3',
          500: '#b5a99a',
          600: '#9e9082',
          700: '#7e7268',
          800: '#5e5650',
          900: '#3e3a36',
        },
        charcoal: {
          DEFAULT: '#2d2d2d',
          light: '#3d3d3d',
          muted: '#5a5a5a',
        },
        brand: {
          purple: '#7c3aed',
          'purple-light': '#a78bfa',
          orange: '#f97316',
          'orange-light': '#fdba74',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #7c3aed 0%, #a855f7 40%, #f97316 100%)',
        'brand-gradient-subtle': 'linear-gradient(135deg, #ede9fe 0%, #fce7d6 100%)',
      },
    },
  },
  plugins: [],
}

