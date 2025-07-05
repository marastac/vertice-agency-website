import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Optimizaciones avanzadas de build
  build: {
    // Minificación con terser (más agresiva)
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
      },
    },
    
    // Configuración de chunks optimizada
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor principal
          'react-vendor': ['react', 'react-dom'],
          
          // Separar utilidades
          'utils': ['lucide-react', 'clsx', 'tailwind-merge'],
          
          // Separar componentes lazy
          'components-lazy': [
            './src/components/ClientLogos.tsx',
            './src/components/Features.tsx',
            './src/components/Contact.tsx',
            './src/components/Footer.tsx'
          ]
        },
        
        // Nomenclatura optimizada para cache
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId && facadeModuleId.includes('node_modules')) {
            return 'vendor/[name]-[hash].js'
          }
          return 'assets/[name]-[hash].js'
        },
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/[name]-[hash].css'
          }
          return 'assets/[name]-[hash].[ext]'
        },
      }
    },
    
    // Configuración de assets
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    
    // Configuración de chunks
    chunkSizeWarningLimit: 1000,
    
    // No source maps en producción
    sourcemap: false,
    
    // Target optimizado
    target: 'es2015',
    
    // Reportar tamaño comprimido
    reportCompressedSize: true,
  },
  
  // Optimizaciones de dependencias
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react'
    ],
    exclude: [],
    
    // Configuración de esbuild
    esbuildOptions: {
      target: 'es2015',
      drop: ['console', 'debugger'],
    }
  },
  
  // Configuración de CSS
  css: {
    postcss: {},
    devSourcemap: false,
    
    // Configuración de CSS modules si los usas
    modules: {
      localsConvention: 'camelCase',
    },
  },
  
  // Configuración de servidor de desarrollo
  server: {
    open: true,
    port: 3000,
    host: true,
  },
  
  // Configuración de preview
  preview: {
    port: 3000,
    open: true,
  },
  
  // Configuración de resolve
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@utils': '/src/utils',
    },
  },
  
  // Configuración de define para variables de entorno
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})