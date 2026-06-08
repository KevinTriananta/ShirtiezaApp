import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/components/cart': fileURLToPath(new URL('./src/features/cart/components', import.meta.url)),
      '@/components/ui': fileURLToPath(new URL('./src/shared/ui', import.meta.url)),
      '@/providers': fileURLToPath(new URL('./src/app/providers', import.meta.url)),
      '@/services': fileURLToPath(new URL('./src/shared/api', import.meta.url)),
      '@/types': fileURLToPath(new URL('./src/shared/types', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
