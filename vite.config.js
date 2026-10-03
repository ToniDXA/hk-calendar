import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/hk-calendar/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'favicon-32.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'holidays.json'],
      manifest: {
        name: '香港月曆',
        short_name: '香港月曆',
        description: '香港公眾假期與請假攻略月曆',
        start_url: '/hk-calendar/',
        scope: '/hk-calendar/',
        display: 'standalone',
        background_color: '#08111f',
        theme_color: '#08111f',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        navigateFallback: '/hk-calendar/index.html',
        runtimeCaching: [{
          urlPattern: ({ url }) => url.pathname.endsWith('/holidays.json'),
          handler: 'CacheFirst',
          options: { cacheName: 'holiday-data', expiration: { maxEntries: 1, maxAgeSeconds: 60 * 60 * 24 * 365 } }
        }]
      }
    })
  ]
})
