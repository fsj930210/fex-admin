import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [mdx(), react(), tailwindcss()],
  server: { port: 4005, strictPort: true },
})
