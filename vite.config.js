import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/tests/**/*.test.jsx'],
    setupFiles: './src/tests/setup.jsx',
    exclude: [...configDefaults.exclude, 'dist/**', '**/node_modules/**'],
    deps: {
      inline: ['leaflet', 'react-leaflet']
    }
  },
})
