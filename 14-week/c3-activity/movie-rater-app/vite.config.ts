/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: { port: 8100 },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
