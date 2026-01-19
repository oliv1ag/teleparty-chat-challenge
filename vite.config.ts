import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/teleparty-chat-challenge/' : '/',
  plugins: [react()],
  optimizeDeps: {
    include: ['teleparty-websocket-lib'],
  },
  build: {
    commonjsOptions: {
      include: [/teleparty-websocket-lib/, /node_modules/],
      transformMixedEsModules: true,
    },
  },
})
