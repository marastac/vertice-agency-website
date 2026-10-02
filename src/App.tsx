// src/App.tsx
import { useEffect } from 'react'
import Hero from './components/Hero'
import Features from './components/Features'
import LeadAI from './components/LeadAI'
import HowWeWork from './components/HowWeWork'
import Capabilities from './components/Capabilities'
import AboutUs from './components/AboutUs'
import Contact from './components/Contact'
import Header from './components/Header'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import LegalPage from './pages/LegalPage'
import NotFound from './pages/NotFound'
import { LEGAL_PAGES } from './pages/legalContent'
import { initAnalytics } from './utils/analytics'
import CursorTrail from './components/CursorTrail' // ✨ Efecto de rastro del cursor (flechas)

/** Ruta actual sin barra final (la web no usa router: cada página es una carga completa). */
const currentPath = () => {
  const p = window.location.pathname.replace(/\/+$/, '');
  return p === '' ? '/' : p;
};

function Home() {
  // Al llegar desde otra página con /#seccion, desplazarse a la sección cuando ya está renderizada.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const raf = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <main>
      <Hero />                {/* #home */}
      <Features />            {/* #servicios — 3 pilares */}
      <LeadAI />              {/* #lead-ai — producto propio */}
      <HowWeWork />           {/* #como-trabajamos */}
      <Capabilities />        {/* #capacidades — tecnologías y proyectos propios */}
      <AboutUs />             {/* #nosotros */}
      {/* Recursos (#recursos) retirado temporalmente: los recursos actuales no encajan con el
          posicionamiento. LeadMagnetSection se conserva como base para los recursos futuros. */}
      <Contact />             {/* #contact — CTA final */}
    </main>
  )
}

function App() {
  useEffect(() => {
    // GA4 / Meta Pixel se cargan SOLO según el consentimiento guardado (ver src/consent/consent.ts).
    // Web Vitals se inicializa una única vez en main.tsx.
    initAnalytics();
  }, []);

  const path = currentPath();
  const legal = LEGAL_PAGES.find((page) => page.path === path);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {path === '/' ? <Home /> : legal ? <LegalPage page={legal} /> : <NotFound />}
      <Footer />

      {/* Banner y panel de cookies (siempre disponibles; reabribles desde el footer) */}
      <CookieBanner />

      {/* ✨ Rastro de cursor (flechas) — renderizado una sola vez a nivel raíz */}
      <CursorTrail
        leaderSize={44}      // tamaño de la flecha líder (más grande)
        trailLength={10}     // cantidad de flechas en el rastro
      />
    </div>
  )
}

export default App
