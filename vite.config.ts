import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  ssr: {
    // Build de prerender (src/entry-server.tsx). phosphor-react publica ESM sin "type": "module", que Node
    // no puede cargar directamente: se empaqueta. React y react-dom se cargan desde node_modules.
    // No afecta al bundle del navegador.
    noExternal: ['phosphor-react'],
  },
})
