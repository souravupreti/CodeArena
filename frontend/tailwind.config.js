module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        arena: {
          bg: '#f8f9fa',
          surface: '#ffffff',
          border: '#e5e7eb',
          orange: '#FFA116',
          purple: '#7B61FF',
          green: '#00B8A3',
          yellow: '#FFC01E',
          red: '#FF375F',
          muted: '#6b7280',
          text: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
};

