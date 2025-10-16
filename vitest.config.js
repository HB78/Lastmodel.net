import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    globals: true,
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
});