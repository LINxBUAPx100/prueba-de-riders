import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/riders-media/', // 👈 Cambia esto al nombre exacto de tu repositorio en GitHub
})
