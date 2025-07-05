import { useEffect, lazy, Suspense } from 'react'
import Hero from './components/Hero'
import Header from './components/Header'
import { initAnalytics } from './utils/analytics'

// Lazy loading SOLO de componentes below-the-fold
const ClientLogos = lazy(() => import('./components/ClientLogos'))
const Features = lazy(() => import('./components/Features'))
const Contact = lazy(() => import('./components/Contact'))
const Footer = lazy(() => import('./components/Footer'))

// Componente de loading específico para cada sección
const SectionLoader = ({ section }: { section: string }) => (
  <div className="flex justify-center items-center py-16">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      <div className="text-gray-600 text-sm font-medium">
        Cargando {section}...
      </div>
    </div>
  </div>
)

// Componente de error boundary para lazy loading
const LazyErrorBoundary = ({ children, fallback }: { children: React.ReactNode, fallback: React.ReactNode }) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  )
}

function App() {
  useEffect(() => {
    // Inicializar analytics
    initAnalytics();
    
    // Preload componentes críticos después del initial load
    const timer = setTimeout(() => {
      import('./components/ClientLogos')
      import('./components/Features')
    }, 2000)
    
    return () => clearTimeout(timer)
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        
        <LazyErrorBoundary fallback={<SectionLoader section="clientes" />}>
          <ClientLogos />
        </LazyErrorBoundary>
        
        <LazyErrorBoundary fallback={<SectionLoader section="servicios" />}>
          <Features />
        </LazyErrorBoundary>
        
        <LazyErrorBoundary fallback={<SectionLoader section="contacto" />}>
          <Contact />
        </LazyErrorBoundary>
      </main>
      
      <LazyErrorBoundary fallback={<SectionLoader section="footer" />}>
        <Footer />
      </LazyErrorBoundary>
    </div>
  )
}

export default App