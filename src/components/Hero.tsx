// src/components/Hero.tsx
import { memo, useCallback, useEffect, useRef } from 'react';
import { Robot, Browsers, PlugsConnected, Lightning, CheckCircle, ArrowRight } from 'phosphor-react';

// Beneficio primero (título) y la oferta que lo resuelve después (etiqueta).
// Sin cifras: no publicamos métricas que no podamos respaldar.
const PILLARS = [
  { icon: <Browsers size={32} weight="duotone" color="#fff" />, title: 'Más oportunidades', label: 'Web & Conversión', color: 'from-green-500 to-green-600' },
  { icon: <Robot size={32} weight="duotone" color="#fff" />, title: 'Menos trabajo manual', label: 'Automatización & IA', color: 'from-blue-500 to-blue-600' },
  { icon: <PlugsConnected size={32} weight="duotone" color="#fff" />, title: 'Herramientas conectadas', label: 'Sistemas & Integraciones', color: 'from-purple-500 to-purple-600' },
];

const Hero = memo(() => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
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

  const onPrimaryCta = useCallback(() => scrollToSection('contact'), [scrollToSection]);
  const onSecondaryCta = useCallback(() => scrollToSection('lead-ai'), [scrollToSection]);

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
          Web · Automatización · Integraciones · IA aplicada
        </div>

        <h1 className="mb-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.5)]">
          Sistemas digitales{' '}
          <span className="relative inline-block">
            <span className="text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.6)]">
              que trabajan para tu negocio
            </span>
            <div className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </span>
        </h1>

        <p className="mb-10 text-xl sm:text-2xl text-white font-semibold drop-shadow-[0_4px_14px_rgba(0,0,0,0.5)] lg:px-16 leading-relaxed">
          <strong>Menos tareas manuales</strong>, <strong>más clientes bien atendidos</strong> y{' '}
          <strong>herramientas que trabajan juntas</strong>. Construimos la web, las automatizaciones y las integraciones
          que tu empresa o negocio digital necesita para crecer con orden.
        </p>

        {/* Pilares */}
        <div className="mb-12 grid grid-cols-3 gap-3 sm:gap-8">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="flex flex-col items-center text-center">
              <div className={`mb-3 w-12 h-12 sm:w-16 sm:h-16 gloss-circle rounded-full flex items-center justify-center bg-gradient-to-r ${pillar.color} shadow-lg`}>
                {pillar.icon}
              </div>
              <div className="text-sm sm:text-xl font-bold leading-tight text-white mb-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">{pillar.title}</div>
              <span className="hidden sm:inline text-sm font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">{pillar.label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <button
            onClick={onPrimaryCta}
            className="arc-pill inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-5 font-bold text-white text-lg shadow-2xl hover:scale-105 transition-all"
            data-cta="hero_evaluacion"
          >
            Solicitar evaluación gratuita
            <span className="text-xl" aria-hidden>→</span>
          </button>

          <button
            onClick={onSecondaryCta}
            className="arc-pill inline-flex items-center gap-3 border-2 border-white/60 bg-white/10 backdrop-blur px-10 py-5 text-lg font-bold text-white hover:bg-white/20 shadow-lg transition-all"
            data-cta="hero_lead_ai"
          >
            Conocer Lead AI
            <ArrowRight size={20} weight="bold" color="#fff" aria-hidden="true" />
          </button>
        </div>

        {/* confianza */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm font-semibold text-white">
          {['Evaluación sin compromiso', 'Soluciones a medida', 'Atención en español'].map((t) => (
            <div key={t} className="flex items-center gap-2">
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
