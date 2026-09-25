import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './'),
      'next/image': path.resolve(import.meta.dirname, './src/components/common/Image.tsx'),
    },
  },
  server: {
    port: 3005,
    host: true,
  },
  build: {
    outDir: 'out',
    emptyOutDir: true,
  },
});
