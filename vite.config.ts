import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cadApiPlugin } from './src/viteApiPlugin.ts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), cadApiPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
  },
})

