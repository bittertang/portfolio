import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Stamped in when the site is built (or the dev server starts), for the
  // "last updated" date in the footer.
  define: {
    __LAST_UPDATED__: JSON.stringify(new Date().toISOString()),
  },
})
