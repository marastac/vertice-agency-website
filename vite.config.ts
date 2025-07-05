import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Optimizaciones críticas de build
  build: {
    // Minificación agresiva
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2, // Doble pasada para mejor minificación
      },
    },
    
    // Configuración de chunks optimizada
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar React core
          'react-vendor': ['react', 'react-dom'],
          
          // Separar utilidades
          'utils': ['lucide-react', 'clsx', 'tailwind-merge'],
        },
        
        // Nomenclatura optimizada para caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    },
    
    // Configuración de chunks mejorada
    chunkSizeWarningLimit: 1000, // Más estricto
    
    // Inline assets pequeños
    assetsInlineLimit: 4096,
    
    // CSS optimizado
    cssCodeSplit: true,
    
    // Sin source maps en producción
    sourcemap: false,
    
    // Optimizar el target
    target: 'es2015',
    
    // Reportar bundle size
    reportCompressedSize: false,
  },
  
  // Optimizaciones de dependencias
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
    exclude: [],
    
    // Configuración de esbuild
    esbuildOptions: {
      target: 'es2015',
    }
  },
  
  // Configuración de CSS
  css: {
    postcss: {},
    devSourcemap: false,
  },
  
  // Configuración de servidor
  server: {
    middlewareMode: false,
  },
  
  // Configuración de preview
  preview: {
    port: 3000,
  }
})