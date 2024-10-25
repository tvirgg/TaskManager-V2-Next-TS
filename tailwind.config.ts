// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'gray-850': '#1a202c',
      },
    },
  },
  plugins: [],
} satisfies Config;
