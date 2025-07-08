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
        
        {/* 🎁 Nueva sección de Lead Magnets */}
        <LeadMagnetSection />
        
        <Features />
        
        {/* 📧 Newsletter Section - Entre Features y Contact */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  🚀 Únete a +1,000 Emprendedores Exitosos
                </h2>
                <p className="text-xl text-blue-100">
                  Recibe estrategias exclusivas de IA y marketing digital cada semana
                </p>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <Newsletter variant="hero" />
              </div>
              
              <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-blue-100">
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-lg">✅</span>
                  <span>Contenido exclusivo semanal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-lg">✅</span>
                  <span>Tips prácticos de IA</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-lg">✅</span>
                  <span>Sin spam, cancela cuando quieras</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <Contact />
      </main>
      <Footer />
      
      {/* 🔥 Scripts de tracking mejorados */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Enhanced Facebook Pixel Events
            if (typeof fbq !== 'undefined') {
              // Track video views if any
              document.addEventListener('play', function(e) {
                if (e.target.tagName === 'VIDEO') {
                  fbq('trackCustom', 'VideoPlay', {
                    video_title: e.target.title || 'Unnamed Video'
                  });
                }
              }, true);
              
              // Track external link clicks
              document.addEventListener('click', function(e) {
                const link = e.target.closest('a');
                if (link && link.hostname !== window.location.hostname) {
                  fbq('trackCustom', 'ExternalLinkClick', {
                    link_url: link.href,
                    link_text: link.textContent
                  });
                }
              });
            }
            
            // Enhanced Google Analytics Events
            if (typeof gtag !== 'undefined') {
              // Track file downloads
              document.addEventListener('click', function(e) {
                const link = e.target.closest('a');
                if (link && link.href.match(/\\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar)$/i)) {
                  gtag('event', 'file_download', {
                    file_name: link.href.split('/').pop(),
                    link_text: link.textContent
                  });
                }
              });
              
              // Track search if site has search
              const searchInput = document.querySelector('[data-search]');
              if (searchInput) {
                searchInput.addEventListener('keypress', function(e) {
                  if (e.key === 'Enter' && this.value) {
                    gtag('event', 'search', {
                      search_term: this.value
                    });
                  }
                });
              }
            }
          `
        }}
      />
    </div>
  )
}

export default App