import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Atlas de Proyectos',
        short_name: 'Atlas',
        description: 'Atlas visual y educativo de los 51 proyectos: arquitectura, despliegues, repositorios, Docker y proveedores de IA.',
        theme_color: '#0b1020',
        background_color: '#0b1020',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /\.(?:jpg|png|svg)$/,
            handler: 'CacheFirst',
            options: { cacheName: 'imagenes', expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 } },
          },
        ],
      },
    }),
  ],
})
