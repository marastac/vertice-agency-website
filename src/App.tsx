import { useEffect } from 'react'
import Hero from './components/Hero'
import ClientLogos from './components/ClientLogos'
import Features from './components/Features'
import Contact from './components/Contact'
import Header from './components/Header'
import Footer from './components/Footer'
import { initAnalytics } from './utils/analytics'
// import './App.css'  ← ELIMINA ESTA LÍNEA

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
        <ClientLogos />
        <Features />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App