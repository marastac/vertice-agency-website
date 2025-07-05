import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Optimizaciones básicas y seguras
  build: {
    // Minificación básica
    minify: true,
    
    // Optimizar CSS
    cssCodeSplit: true,
    
    // Configuración de assets
    assetsInlineLimit: 4096,
    
    // Eliminar comentarios en producción
    rollupOptions: {
      output: {
        // Nombres de archivos con hash para cache busting
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    }
  },
  
  // Optimizaciones de dependencias
  optimizeDeps: {
    // Pre-bundle dependencias críticas
    include: ['react', 'react-dom', 'lucide-react'],
  },
  
  // Configuración de servidor de desarrollo
  server: {
    open: true, // Abrir navegador automáticamente
  },
  
  // Configuración de preview
  preview: {
    port: 3000,
    open: true,
  }
})