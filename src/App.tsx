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

function App() {
  useEffect(() => {
    // Inicializar analytics
    initAnalytics();
    
    // 🚀 Setup adicional de marketing
    setupMarketingTracking();
  }, []);

  const setupMarketingTracking = () => {
    // Facebook Pixel - eventos adicionales
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
      
      // Track scroll depth
      let maxScroll = 0;
      const trackScrollDepth = () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
          maxScroll = scrollPercent;
          (window as any).fbq('trackCustom', 'ScrollDepth', {
            scroll_depth: scrollPercent
          });
        }
      };
      
      window.addEventListener('scroll', trackScrollDepth, { passive: true });
    }

    // Google Analytics - eventos personalizados
    if (typeof window !== 'undefined' && (window as any).gtag) {
      // Track time on site
      const startTime = Date.now();
      window.addEventListener('beforeunload', () => {
        const timeOnSite = Math.round((Date.now() - startTime) / 1000);
        (window as any).gtag('event', 'time_on_site', {
          value: timeOnSite,
          event_category: 'engagement'
        });
      });

      // Track CTA clicks
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.closest('[data-cta]')) {
          const ctaName = target.closest('[data-cta]')?.getAttribute('data-cta');
          (window as any).gtag('event', 'cta_click', {
            cta_name: ctaName,
            page_location: window.location.href
          });
        }
      });
    }
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