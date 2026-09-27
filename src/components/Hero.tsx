// src/components/Hero.tsx
import { memo, useState, useCallback, useEffect, useRef } from 'react';
import Newsletter from './Newsletter';
import { Target, ChartLineUp, Lightning, Gift, EnvelopeSimple, CheckCircle } from 'phosphor-react';

const Hero = memo(() => {
  const [showNewsletter, setShowNewsletter] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleNewsletterToggle = useCallback(() => {
    setShowNewsletter((p) => !p);
    (window as any)?.gtag?.('event', 'newsletter_modal_open', { source: 'hero_cta' });
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          (window as any)?.gtag?.('event', 'view_item', {
            item_id: 'hero_section',
            section: 'home',
          });
        }
      });
    }, { threshold: 0.4 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!showNewsletter) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowNewsletter(false); };
    document.addEventListener('keydown', onKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [showNewsletter]);

  const onPrimaryCta = useCallback(() => scrollToSection('contact'), [scrollToSection]);
  const onSecondaryCta = useCallback(() => scrollToSection('recursos'), [scrollToSection]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-24 pb-20 md:pt-32 md:pb-28 lg:pt-40 lg:pb-32"
    >
      {/* VIDEO */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden motion-reduce:hidden" aria-hidden="true">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/25 mix-blend-multiply"></div>
      </div>

      <div className="container relative z-10 text-center max-w-5xl mx-auto">
        {/* badge superior */}
        <div className="arc-pill mb-8 inline-flex items-center gap-3 border-2 border-blue-200 bg-white/60 px-6 py-3 text-base font-semibold text-blue-700 shadow-md">
          <Lightning size={20} weight="duotone" className="text-blue-600" />
          Marketing Digital Potenciado por IA
        </div>

        <h1 className="mb-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.5)]">
          Escala tu Negocio Online con{' '}
          <span className="relative inline-block">
            <span className="text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.6)]">
              Inteligencia Artificial
            </span>
            <div className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </span>
        </h1>

        <p className="mb-10 text-xl sm:text-2xl text-white font-semibold drop-shadow-[0_4px_14px_rgba(0,0,0,0.5)] lg:px-16 leading-relaxed">
          Ayudamos a <strong>coaches, consultores y creadores de contenido</strong> en Perú y España a{' '}
          <strong>atraer más clientes, automatizar procesos</strong> y lograr{' '}
          <strong>crecimiento sostenido</strong> con estrategias digitales impulsadas por IA.
        </p>

        {/* KPIs */}
        <div className="mb-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { icon: <Target size={32} weight="duotone" color="#fff" />, value: '+300%', label: 'ROI Promedio', color: 'from-blue-500 to-blue-600' },
            { icon: <ChartLineUp size={32} weight="duotone" color="#fff" />, value: '2x', label: 'Más Leads Cualificados', color: 'from-green-500 to-green-600' },
            { icon: <Lightning size={32} weight="duotone" color="#fff" />, value: '80%', label: 'Ahorro en Tiempo', color: 'from-purple-500 to-purple-600' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className={`mb-3 w-16 h-16 gloss-circle rounded-full flex items-center justify-center bg-gradient-to-r ${stat.color} shadow-lg`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">{stat.value}</div>
              <span className="text-sm font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <button
            onClick={onPrimaryCta}
            className="arc-pill inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-5 font-bold text-white text-lg shadow-2xl hover:scale-105 transition-all"
          >
            Auditoría Gratuita con IA
            <span className="text-xl" aria-hidden>→</span>
          </button>

          <button
            onClick={onSecondaryCta}
            className="arc-pill inline-flex items-center gap-3 border-2 border-white/60 bg-white/10 backdrop-blur px-10 py-5 text-lg font-bold text-white hover:bg-white/20 shadow-lg transition-all"
          >
            <Gift size={20} weight="duotone" color="#fff" />
            Ver Recursos Gratuitos
            <span className="text-xl" aria-hidden>↓</span>
          </button>
        </div>

        {/* newsletter */}
        <div className="mt-4">
          <button
            onClick={handleNewsletterToggle}
            className="text-sm font-semibold text-white underline underline-offset-4 inline-flex items-center gap-2 hover:text-white"
          >
            <EnvelopeSimple size={16} weight="duotone" color="#fff" />
            Recibir tips de IA gratis
          </button>
        </div>

        {showNewsletter && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowNewsletter(false)}
          >
            <div
              ref={dialogRef}
              role="dialog"
              tabIndex={-1}
              className="relative max-w-lg w-full outline-none"
            >
              <button
                onClick={handleNewsletterToggle}
                className="absolute -top-4 -right-4 bg-white text-gray-600 hover:text-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow-lg"
              >
                ×
              </button>
              <Newsletter variant="popup" onSuccess={() => setTimeout(() => setShowNewsletter(false), 3000)} />
            </div>
          </div>
        )}

        {/* confianza */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm font-semibold text-white">
          {['Auditoría sin compromiso', 'Resultados medibles', 'Soporte en español'].map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle size={18} weight="duotone" color="#86efac" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
export default Hero;
