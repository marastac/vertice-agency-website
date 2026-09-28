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
import { initAnalytics } from './utils/analytics'
import { initWebVitals } from './utils/webvitals'
import CursorTrail from './components/CursorTrail' // ✨ Efecto de rastro del cursor (flechas)

function App() {
  useEffect(() => {
    // Inicializar analytics y Web Vitals
    initAnalytics();
    initWebVitals();

    // 🚀 Setup adicional de marketing (con cleanup)
    const cleanup = setupMarketingTracking();
    return () => {
      cleanup?.();
    };
  }, []);

  const setupMarketingTracking = () => {
    const cleanups: Array<() => void> = [];

    // Facebook Pixel - eventos adicionales
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');

      // Track scroll depth
      let maxScroll = 0;
      const trackScrollDepth = () => {
        const total = document.body.scrollHeight - window.innerHeight;
        if (total <= 0) return;
        const scrollPercent = Math.round((window.scrollY / total) * 100);
        if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
          maxScroll = scrollPercent;
          (window as any).fbq('trackCustom', 'ScrollDepth', { scroll_depth: scrollPercent });
        }
      };
      window.addEventListener('scroll', trackScrollDepth, { passive: true });
      cleanups.push(() => window.removeEventListener('scroll', trackScrollDepth));
    }

    // Google Analytics - eventos personalizados
    if (typeof window !== 'undefined' && (window as any).gtag) {
      // Track time on site
      const startTime = Date.now();
      const onBeforeUnload = () => {
        const timeOnSite = Math.round((Date.now() - startTime) / 1000);
        (window as any).gtag('event', 'time_on_site', {
          value: timeOnSite,
          event_category: 'engagement'
        });
      };
      window.addEventListener('beforeunload', onBeforeUnload);
      cleanups.push(() => window.removeEventListener('beforeunload', onBeforeUnload));

      // Track CTA clicks
      const onDocClick = (e: Event) => {
        const target = e.target as HTMLElement;
        const el = target?.closest?.('[data-cta]') as HTMLElement | null;
        if (!el) return;
        const ctaName = el.getAttribute('data-cta');
        (window as any).gtag('event', 'cta_click', {
          cta_name: ctaName,
          page_location: window.location.href
        });
      };
      document.addEventListener('click', onDocClick);
      cleanups.push(() => document.removeEventListener('click', onDocClick));
    }

    // devolver cleanup único
    return () => cleanups.forEach(fn => fn());
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
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
      <Footer />

      {/* ✨ Rastro de cursor (flechas) — renderizado una sola vez a nivel raíz */}
      <CursorTrail
        leaderSize={44}      // tamaño de la flecha líder (más grande)
        trailLength={10}     // cantidad de flechas en el rastro
      />
    </div>
  )
}

export default App
