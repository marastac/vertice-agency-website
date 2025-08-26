import { useEffect } from 'react'
import Hero from './components/Hero'
import ClientLogos from './components/ClientLogos'
import Features from './components/Features'
import LeadMagnetSection from './components/LeadMagnetSection'
import Newsletter from './components/Newsletter'
import Contact from './components/Contact'
import Header from './components/Header'
import Footer from './components/Footer'
import { initAnalytics } from './utils/analytics'
import { initWebVitals } from './utils/webvitals' // ← añade este archivo (te lo pasé antes)

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
        <Hero />
        <ClientLogos />
        
        {/* 🎁 Lead Magnets Section */}
        <LeadMagnetSection />
        
        <Features />
        
        {/* 📧 Newsletter Section - Optimizada */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  🚀 Únete a +1,000 Emprendedores Exitosos
                </h2>
                <p className="text-xl text-blue-100 mb-6">
                  Recibe estrategias exclusivas de IA y marketing digital cada semana
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto mb-8">
                <Newsletter variant="hero" />
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-blue-100">
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-lg">✅</span>
                  <span className="text-sm md:text-base">Contenido exclusivo semanal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-lg">✅</span>
                  <span className="text-sm md:text-base">Tips prácticos de IA</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-lg">✅</span>
                  <span className="text-sm md:text-base">Sin spam, cancela cuando quieras</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
