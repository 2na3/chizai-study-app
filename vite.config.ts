import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_READ_ONLY_MODE === 'true' ? '/chizai-study-app/' : '/',
})
