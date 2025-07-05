import { useEffect, lazy, Suspense } from 'react'
import Hero from './components/Hero'
import Header from './components/Header'
import { initAnalytics } from './utils/analytics'
import './App.css'

// Lazy loading de componentes no críticos (mejora LCP)
const ClientLogos = lazy(() => import('./components/ClientLogos'))
const Features = lazy(() => import('./components/Features'))
const Contact = lazy(() => import('./components/Contact'))
const Footer = lazy(() => import('./components/Footer'))

// Componente de loading optimizado
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
)

function App() {
  useEffect(() => {
    // Inicializar analytics
    initAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<LoadingSpinner />}>
          <ClientLogos />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <Features />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={<LoadingSpinner />}>
        <Footer />
      </Suspense>
    </div>
  )
}

export default App