import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
  build: {
    rollupOptions: {
      output: {
        // Charting and animation libraries are only needed once a user reaches
        // the dashboard, so keep them out of the initial entry chunk.
        manualChunks: {
          charts: ['recharts'],
          motion: ['motion'],
        },
      },
    },
  },
  server: {
    // AI Studio sets DISABLE_HMR to stop file watching from flickering during
    // agent edits.
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
