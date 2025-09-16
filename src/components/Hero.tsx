// src/components/Hero.tsx
import { memo, useState, useCallback, useEffect, useRef } from 'react';
import Newsletter from './Newsletter';

const Hero = memo(() => {
  const [showNewsletter, setShowNewsletter] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Scroll suave a sección
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Abrir / cerrar newsletter (popup)
  const handleNewsletterToggle = useCallback(() => {
    setShowNewsletter(prev => !prev);
    (window as any)?.gtag?.('event', 'newsletter_modal_open', { source: 'hero_cta' });
  }, []);

  // Visibilidad del hero → GA4
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            (window as any)?.gtag?.('event', 'view_item', {
              item_id: 'hero_section',
              item_name: 'Hero',
              section: 'home'
            });
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // Accesibilidad: cerrar modal con Escape + focus al abrir
  useEffect(() => {
    if (!showNewsletter) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowNewsletter(false);
    };
    document.addEventListener('keydown', onKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [showNewsletter]);

  // Tracking de CTAs
  const onPrimaryCta = useCallback(() => {
    (window as any)?.gtag?.('event', 'select_content', {
      content_type: 'cta',
      item_id: 'hero_audit',
      section: 'home'
    });
    scrollToSection('contact');
  }, [scrollToSection]);

  const onSecondaryCta = useCallback(() => {
    (window as any)?.gtag?.('event', 'select_content', {
      content_type: 'cta',
      item_id: 'hero_resources',
      section: 'home'
    });
    scrollToSection('recursos');
  }, [scrollToSection]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-24 pb-20 md:pt-32 md:pb-28 lg:pt-40 lg:pb-32"
      aria-labelledby="hero-heading"
    >
      {/* ===========================
         VIDEO de fondo (colores vivos, intensos y nítidos)
      ============================ */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden motion-reduce:hidden"
        aria-hidden="true"
      >
        <video
          className="h-full w-full object-cover opacity-80 filter saturate-[1.35] contrast-[1.25] brightness-[1.15]"
          autoPlay
          muted
          loop
          playsInline
          poster="/media/hero-poster.jpg"
        >
          <source src="/media/hero-bg.webm" type="video/webm" />
          <source src="/media/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Overlays mínimos, solo para resaltar texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/25 mix-blend-multiply"></div>
      </div>

      <div className="container relative z-10">
        <div className="flex flex-wrap items-center">
          <div className="w-full px-4">
            <div className="mx-auto max-w-5xl text-center">

              {/* Badge Superior */}
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 text-base font-semibold text-blue-700 shadow-lg">
                <span className="text-xl" aria-hidden="true">✨</span>
                Marketing Digital Potenciado por IA
              </div>

              {/* Título Principal */}
              <h1
                id="hero-heading"
                className="mb-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.5)]"
              >
                Escala tu Negocio Online con{' '}
                <span className="relative inline-block">
                  <span className="text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.6)]">
                    Inteligencia Artificial
                  </span>
                  <div className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </span>
              </h1>

              {/* Subtítulo */}
              <p className="mb-10 text-xl sm:text-2xl md:text-2xl lg:px-20 leading-relaxed text-white font-semibold drop-shadow-[0_4px_14px_rgba(0,0,0,0.5)]">
                Ayudamos a <strong className="text-white font-extrabold">coaches, consultores y creadores de contenido</strong> en Perú y España a{' '}
                <span className="font-extrabold text-white">atraer más clientes, automatizar procesos</span> y lograr{' '}
                <span className="font-extrabold text-white">crecimiento sostenido</span> con estrategias digitales impulsadas por IA.
              </p>

              {/* Estadísticas Rápidas */}
              <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                    <span className="text-2xl" aria-hidden="true">🎯</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">+300%</div>
                  <span className="text-sm font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">ROI Promedio</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
                    <span className="text-2xl" aria-hidden="true">📈</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">2x</div>
                  <span className="text-sm font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">Más Leads Cualificados</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
                    <span className="text-2xl" aria-hidden="true">⚡</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">80%</div>
                  <span className="text-sm font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">Ahorro en Tiempo</span>
                </div>
              </div>

              {/* Botones CTA */}
              <div className="flex flex-col items-center justify-center sm:flex-row sm:justify-center sm:space-x-8 space-y-6 sm:space-y-0">
                <button
                  type="button"
                  onClick={onPrimaryCta}
                  data-cta="hero-audit-primary"
                  className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-5 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-1"
                  aria-label="Ir a contacto para solicitar Auditoría Gratuita con IA"
                >
                  Auditoría Gratuita con IA
                  <span className="text-xl transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                </button>

                <button
                  type="button"
                  onClick={onSecondaryCta}
                  data-cta="hero-resources-secondary"
                  className="group inline-flex items-center gap-3 rounded-2xl border-2 border-white/70 bg-white/10 backdrop-blur px-10 py-5 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:-translate-y-1"
                  aria-label="Ir a la sección de recursos gratuitos"
                >
                  🎁 Ver Recursos Gratuitos
                  <span className="text-xl transition-transform group-hover:translate-x-1" aria-hidden="true">↓</span>
                </button>
              </div>

              {/* Enlace Newsletter */}
              <div className="mt-4 text-white">
                <button
                  type="button"
                  onClick={handleNewsletterToggle}
                  data-cta="hero-open-newsletter"
                  className="text-sm font-semibold underline underline-offset-4 hover:text-white"
                  aria-haspopup="dialog"
                  aria-expanded={showNewsletter}
                >
                  📧 Recibir tips de IA gratis
                </button>
              </div>

              {/* Newsletter Modal */}
              {showNewsletter && (
                <div
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                  onClick={(e) => { if (e.target === e.currentTarget) setShowNewsletter(false); }}
                >
                  <div
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="newsletter-modal-title"
                    tabIndex={-1}
                    className="relative max-w-lg w-full outline-none"
                  >
                    <button
                      type="button"
                      onClick={handleNewsletterToggle}
                      className="absolute -top-4 -right-4 bg-white text-gray-600 hover:text-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow-lg z-10"
                      aria-label="Cerrar"
                    >
                      ×
                    </button>
                    <h2 id="newsletter-modal-title" className="sr-only">Suscripción al Newsletter</h2>
                    <Newsletter
                      variant="popup"
                      onSuccess={() => { setTimeout(() => setShowNewsletter(false), 3000); }}
                    />
                  </div>
                </div>
              )}

              {/* Confianza */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-white">
                <div className="flex items-center gap-2">
                  <span className="text-green-300 text-lg" aria-hidden="true">✅</span>
                  <span>Auditoría sin compromiso</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-300 text-lg" aria-hidden="true">✅</span>
                  <span>Resultados medibles</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-300 text-lg" aria-hidden="true">✅</span>
                  <span>Soporte en español</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
export default Hero;
