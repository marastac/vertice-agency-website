import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Optimizaciones básicas y seguras
  build: {
    // Minificación estándar (no terser para evitar problemas)
    minify: true,
    
    // CSS code splitting para mejor caching
    cssCodeSplit: true,
    
    // Inline assets pequeños para reducir requests
    assetsInlineLimit: 4096,
    
    // Configuración de rollup para mejor organización
    rollupOptions: {
      output: {
        // Organización de archivos con hash para cache busting
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/css/[name]-[hash].css'
          }
          if (assetInfo.name && /\.(png|jpe?g|svg|gif|webp|avif)$/.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash].[ext]'
          }
          return 'assets/[name]-[hash].[ext]'
        },
        
        // Separación básica de chunks para mejor caching
        manualChunks: {
          // React core en chunk separado
          'react-core': ['react', 'react-dom'],
          
          // Librerías de utilidades
          'utils': ['lucide-react', 'clsx', 'tailwind-merge'],
        }
      }
    },
    
    // Configuración de chunks
    chunkSizeWarningLimit: 1500,
    
    // Source maps solo en desarrollo
    sourcemap: process.env.NODE_ENV === 'development',
    
    // Target para compatibilidad
    target: 'es2015',
  },
  
  // Optimizaciones de dependencias
  optimizeDeps: {
    // Pre-bundle dependencias críticas
    include: [
      'react',
      'react-dom',
      'lucide-react'
    ],
    
    // Configuración de esbuild
    esbuildOptions: {
      target: 'es2015',
    }
  },
  
  // Configuración de CSS
  css: {
    // PostCSS para Tailwind
    postcss: {},
    
    // No source maps en producción
    devSourcemap: process.env.NODE_ENV === 'development',
  },
  
  // Configuración de servidor de desarrollo
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  
  // Configuración de preview
  preview: {
    port: 3000,
    open: true,
  },
  
  // Resolve aliases para imports más limpios
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@utils': '/src/utils',
    },
  },
})