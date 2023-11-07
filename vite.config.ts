import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { manifestForPlugIn } from './manifest';

export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugIn)],
  server: {
    open: '/app',
    proxy: {
      '/fishing/api': {
        target: 'http://0.0.0.0:3000/zvejyba/api/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fishing\/api/, ''),
      },
      '/uetk/api': {
        target: 'https://uetk.biip.lt/api/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/uetk\/api/, ''),
      },
    },
  },
  assetsInclude: ['**/*.png'],
});
