import { join } from 'path';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
    join(require.resolve('stylist-svelte'), '../**/*.{html,js,svelte,ts}')
  ],
  theme: {
    extend: {
      colors: {
        // Custom dark mode colors
        dark: {
          '50': '#1a1a1a',
          '100': '#2a2a2a',
          '200': '#3a3a3a',
          '300': '#4a4a4a',
          '400': '#5a5a5a',
          '500': '#6a6a6a',
          '600': '#7a7a7a',
          '700': '#8a8a8a',
          '800': '#9a9a9a',
          '900': '#aaaaaa',
        },
        // Example of how to override default colors for dark mode
        primary: {
          '50': '#eff6ff',
          '100': '#dbeafe',
          '200': '#bfdbfe',
          '300': '#93c5fd',
          '400': '#60a5fa',
          '500': '#3b82f6',
          '600': '#2563eb',
          '700': '#1d4ed8',
          '800': '#1e40af',
          '900': '#1e3a8a',
          '950': '#172554',
        },
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
};
