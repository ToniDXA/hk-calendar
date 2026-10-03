import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/hk-calendar/',
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['icon.svg'],
    manifest: {
      name: '香港月曆', short_name: 'HK 月曆',
      start_url: '/hk-calendar/', scope: '/hk-calendar/', display: 'standalone',
      theme_color: '#08111f', background_color: '#08111f',
      icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' }]
    }
  })]
})
