import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
  content: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#232323',
      white: '#FFFFFF',
      purple: '#644FCF',
      primary: 'var(--primary-color)',
      highlight: 'var(--highlight-color)',
      active: 'var(--active-color)',
      alert: {
        warning: '#FFA342',
        error: '#D97481',
        alarm: '#E44E62',
        success: '#74D827',
      },
      'pastel-alert': {
        warning: '#FFF3D9',
        error: '#FFDCD8',
        success: '#EEFDD3',
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('has', '&:not(:empty)');
    }),
  ],
} satisfies Config;
