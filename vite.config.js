import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Disable CSS minification to avoid native module issues in some environments.
    // Vercel's build environment has all needed native binaries.
    cssMinify: false,
  },
})
