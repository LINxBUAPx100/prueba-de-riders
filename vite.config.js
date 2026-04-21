import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/prueba-de-riders/', // 👈 nombre exacto de tu repo
})
