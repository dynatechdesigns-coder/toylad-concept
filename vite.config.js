import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import devApi from './scripts/dev-api.js'

// The navbar uses public/logo.svg when it exists, otherwise a text wordmark.
const hasLogo = existsSync(fileURLToPath(new URL('./public/logo.svg', import.meta.url)))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), devApi()],
  server: { port: 3000 },
  define: {
    __HAS_LOGO__: JSON.stringify(hasLogo),
  },
})
