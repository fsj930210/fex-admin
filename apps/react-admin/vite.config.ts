import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4001,
    strictPort: true,
    proxy: {
      '/upload-api': {
        target: 'http://127.0.0.1:4310',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/upload-api/, ''),
      },
    },
  },
})
