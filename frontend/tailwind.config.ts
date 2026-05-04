import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        cloud: '#f8fafc',
        accent: '#0ea5e9'
      },
      boxShadow: {
        glow: '0 24px 80px rgba(14, 165, 233, 0.22)'
      }
    }
  },
  plugins: []
};

export default config;
