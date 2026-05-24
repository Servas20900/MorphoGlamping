module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        accent: 'var(--color-accent)',
      },
      fontFamily: {
        body: ['var(--font-body)'],
        heading: ['var(--font-heading)'],
      },
    },
  },
  plugins: [],
}
