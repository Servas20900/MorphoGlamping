module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        surface: '#f5f5f7',
        stone: '#e8e8ed',
        ink: '#111111',
        muted: '#586060',
        accent: '#245d66',
        'accent-soft': '#7a9ba1',
        volcanic: '#2e2e2e',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['"Inter Tight"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        section: '1.1rem',
        card: '1.6rem',
      },
      maxWidth: {
        page: '1440px',
      },
      boxShadow: {
        glass: '0 18px 60px rgba(15,23,42,0.08)',
        card: '0 18px 42px rgba(17,17,17,0.08)',
      },
    },
  },
  plugins: [],
}
