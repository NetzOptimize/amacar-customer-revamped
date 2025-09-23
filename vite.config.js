import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"



// https://vite.dev/config/
export default defineConfig({
  // base: '/frontend/',
  plugins: [react(), tailwindcss(),],
  server: {
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
   build: {
    chunkSizeWarningLimit: 3000 
  }
})
