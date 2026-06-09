/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: 'var(--color-sidebar)',
        main: 'var(--color-main)',
        input: 'var(--color-input)',
        hover: 'var(--color-hover)',
        active: 'var(--color-active)',
        border: 'var(--color-border)',
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        muted: 'var(--color-text-muted)',
      },
    },
  },
  plugins: [],
}
