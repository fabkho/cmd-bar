import type { Config } from 'tailwindcss'

export default {
  content: ['../components/**/*.vue'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        //  --dark-color-overlay: rgba(26, 25, 25, 0.5);
        'dark-color-overlay': {
          dark: 'rgba(26, 25, 25, 0.5)',
          light: 'rgba(54, 53, 53, 0.5)'
        },
        'light-color-overlay': {
          dark: 'rgba(55, 55, 55, 1)',
          light: 'rgba(234, 236, 240, 1)'
        }
      }
    }
  }
} as Config
