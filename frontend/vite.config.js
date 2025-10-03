import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',       // Needed for React DOM tests
    globals: true,              // Allows using `describe`, `it`, `expect` globally
    setupFiles: './setupTests.js',  // Your testing-library setup
     include: ['src/**/*.test.{js,jsx}'], 
  },
});
