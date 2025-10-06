import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'firebase': ['firebase/app', 'firebase/auth'],
          'mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'data-fetching': ['axios', '@tanstack/react-query']
        }
      }
    }
  }
});