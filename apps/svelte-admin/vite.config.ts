import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, searchForWorkspaceRoot } from 'vite'
import { fileURLToPath } from 'node:url'

const appRoot = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],
  server: {
    port: 4003,
    strictPort: true,
    // SvelteKit narrows Vite's default allow list. Restore the workspace root so
    // linked packages and their worker/assets behave like installed packages.
    fs: { allow: [searchForWorkspaceRoot(appRoot)] },
    proxy: {
      '/tree-api': {
        target: 'http://127.0.0.1:4310',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tree-api/, ''),
      },
      '/upload-api': {
        target: 'http://127.0.0.1:4310',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/upload-api/, ''),
      },
    },
  },
})
