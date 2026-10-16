import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './'),
      'next/image': path.resolve(process.cwd(), './src/components/common/Image.tsx'),
    },
  },
  server: {
    port: 3005,
    host: true,
    allowedHosts: true,
  },
  build: {
    outDir: 'out',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('@supabase')) return 'supabase-vendor';
            if (id.includes('motion') || id.includes('framer-motion')) return 'motion-vendor';
            if (id.includes('lucide-react')) return 'icons-vendor';
            if (id.includes('leaflet')) return 'leaflet-vendor';
          }
        },
      },
    },
  },
});
