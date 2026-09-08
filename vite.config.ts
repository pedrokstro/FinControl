import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'icons/*.png'],
      manifestFilename: 'manifest.json',
      manifest: {
        name: 'FinControl - Controle Financeiro Pessoal',
        short_name: 'FinControl',
        description: 'Sistema completo de controle financeiro pessoal com gráficos, relatórios e análises avançadas',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'fullscreen',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        lang: 'pt-BR',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Nova Transação',
            short_name: 'Nova',
            description: 'Adicionar nova transação rapidamente',
            url: '/app/dashboard?action=new',
            icons: [{ src: '/icons/shortcut-new.png', sizes: '96x96' }]
          },
          {
            name: 'Transações',
            short_name: 'Transações',
            description: 'Ver todas as transações',
            url: '/app/transactions',
            icons: [{ src: '/icons/shortcut-transactions.png', sizes: '96x96' }]
          }
        ],
        screenshots: [
          {
            src: '/screenshots/dashboard.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Dashboard do FinControl'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,json,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.fincontrol\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 horas
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 horas
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
              }
            }
          },
          {
            urlPattern: /\.(?:woff|woff2|ttf|eot)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
              }
            }
          }
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) {
              return 'vendor-react'
            }
            if (/[\\/]node_modules[\\/](recharts|d3-)/.test(id)) {
              return 'vendor-charts'
            }
            if (/[\\/]node_modules[\\/](framer-motion)[\\/]/.test(id)) {
              return 'vendor-motion'
            }
            if (/[\\/]node_modules[\\/](gsap|@gsap)[\\/]/.test(id)) {
              return 'vendor-gsap'
            }
            if (/[\\/]node_modules[\\/](lucide-react|@iconify)[\\/]/.test(id)) {
              return 'vendor-icons'
            }
            if (/[\\/]node_modules[\\/](@remotion|remotion)[\\/]/.test(id)) {
              return 'vendor-remotion'
            }
            if (/[\\/]node_modules[\\/](@supabase|axios)[\\/]/.test(id)) {
              return 'vendor-backend'
            }
            if (/[\\/]node_modules[\\/](three|@react-three)[\\/]/.test(id)) {
              return 'vendor-3d'
            }
            if (/[\\/]node_modules[\\/](jspdf|xlsx|html2canvas)[\\/]/.test(id)) {
              return 'vendor-export'
            }
            if (/[\\/]node_modules[\\/](date-fns|clsx|tailwind-merge|zod|zustand|react-hot-toast)[\\/]/.test(id)) {
              return 'vendor-core-utils'
            }
          }
        }
      },
    },
  },
})
