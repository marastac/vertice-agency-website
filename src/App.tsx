// src/App.tsx — Estructura común y selección de página según la ruta.
//
// Sin router de cliente: cada URL es un HTML prerenderizado (scripts/prerender.mjs) y la navegación interna
// usa enlaces normales. `path` llega desde main.tsx (navegador) o entry-server.tsx (prerender).
import { useEffect, useState } from 'react';
import CookieBanner from './components/CookieBanner';
import Footer from './components/Footer';
import Header from './components/Header';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import LeadAIPage from './pages/LeadAIPage';
import LegalPage from './pages/LegalPage';
import NotFound from './pages/NotFound';
import ServiceAreaPage from './pages/ServiceAreaPage';
import SolutionsPage from './pages/SolutionsPage';
import { LEGAL_PAGES } from './pages/legalContent';
import { HASH_ALIASES, matchRoute } from './routes';
import type { RouteDef } from './routes';
import { initAnalytics } from './utils/analytics';
import { initClickPulse } from './utils/clickPulse';

function Page({ route }: { route: RouteDef }) {
  switch (route.kind) {
    case 'home':
      return <HomePage />;
    case 'area':
      return route.areaId ? <ServiceAreaPage areaId={route.areaId} /> : <NotFound />;
    case 'lead-ai':
      return <LeadAIPage />;
    case 'solutions':
      return <SolutionsPage />;
    case 'about':
      return <AboutPage />;
    case 'contact':
      return <ContactPage />;
    case 'legal': {
      const legal = LEGAL_PAGES.find((p) => p.path === route.path);
      return legal ? <LegalPage page={legal} /> : <NotFound />;
    }
    default:
      return <NotFound />;
  }
}

/** Ancla de la URL (incluidos alias antiguos como #services): desplaza a la sección al cargar. */
function useInitialHashScroll() {
  useEffect(() => {
    const raw = decodeURIComponent(window.location.hash.slice(1));
    if (!raw) return;
    const id = HASH_ALIASES[raw] ?? raw;
    const raf = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    return () => cancelAnimationFrame(raf);
  }, []);
}

/** El banner de cookies depende de localStorage: se monta solo en el navegador (evita desajustes al hidratar). */
function ClientCookieBanner() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <CookieBanner /> : null;
}

export default function App({ path }: { path: string }) {
  const route = matchRoute(path);

  useEffect(() => {
    // GA4 / Meta Pixel se cargan SOLO según el consentimiento guardado (ver src/consent/consent.ts).
    initAnalytics();
  }, []);

  // Pulso visual decorativo al hacer clic con el ratón (solo puntero fino y sin "reducir movimiento").
  useEffect(() => initClickPulse(), []);

  useInitialHashScroll();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header currentPath={route.path} />
      <main id="main" className="flex-1">
        <Page route={route} />
      </main>
      <Footer />
      <ClientCookieBanner />
    </div>
  );
}
