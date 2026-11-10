// src/components/Hero.tsx — Portada de la home.
// Sin cifras ni clientes: no publicamos métricas que no podamos respaldar.
import { memo, useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle } from 'phosphor-react';
import { AREAS } from '../content/areas';
import { gtagEvent } from '../utils/analytics';
import { trackContactClick } from '../utils/events';
import { Eyebrow } from './ui/Section';

// Fondo: póster (siempre) + vídeo 720p solo en pantallas ≥768 px, sin "reducir movimiento" y sin ahorro de
// datos. En móvil no se descarga ningún vídeo. El velo oscuro garantiza el contraste del texto aunque el
// vídeo no cargue.
const VIDEO_QUERY = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';
const MEDIA_CLASSES = 'absolute inset-0 h-full w-full object-cover';

function useHeroVideo() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(VIDEO_QUERY);
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    const update = () => setEnabled(mq.matches && !saveData);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return enabled;
}

// Imagen LCP: prioridad alta. En minúsculas porque React 18 no reconoce la prop fetchPriority.
const LCP_HINT = { fetchpriority: 'high' } as Record<string, string>;

const TRUST = [
  'Evaluación inicial sin costo ni compromiso',
  'Alcance, plazos y costo por escrito antes de empezar',
  'Hablas directamente con quien construye tu solución',
];

const Hero = memo(() => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoEnabled = useHeroVideo();
  const [videoPlaying, setVideoPlaying] = useState(false);

  // GA4: vista del hero (evento existente, se conserva).
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) gtagEvent('view_item', { item_id: 'hero_section', section: 'home' });
        }),
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section id="home" ref={sectionRef} className="relative overflow-hidden bg-ink pb-16 pt-28 text-white md:pb-24 md:pt-40" aria-labelledby="home-title">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true" data-hero-media>
        <picture>
          <source type="image/webp" srcSet="/media/hero-poster-800.webp 800w, /media/hero-poster-1600.webp 1600w" sizes="100vw" />
          <img src="/media/hero-poster-1600.jpg" alt="" className={`${MEDIA_CLASSES} opacity-60`} decoding="async" {...LCP_HINT} />
        </picture>
        {videoEnabled && (
          <video
            className={`${MEDIA_CLASSES} transition-opacity duration-700 ${videoPlaying ? 'opacity-60' : 'opacity-0'}`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onPlaying={() => setVideoPlaying(true)}
          >
            <source src="/media/hero-bg-720.webm" type="video/webm" />
            <source src="/media/hero-bg-720.mp4" type="video/mp4" />
          </video>
        )}
        {/* Velo: más denso a la izquierda (donde está el texto) y en la parte inferior. */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" data-hero-veil />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      <div className="container relative">
        <div className="max-w-3xl motion-safe:animate-fade-up">
          <Eyebrow dark>Software · Automatización · IA · Integraciones</Eyebrow>
          <h1 id="home-title" className="text-[2.5rem] font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.6rem]">
            Desarrollamos sistemas que <span className="text-gradient-light">conectan tus procesos</span> y reducen el
            trabajo manual
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
            Software a medida, automatizaciones, integraciones e inteligencia artificial para empresas que quieren ordenar
            su operación, atender mejor a sus clientes y crecer sin depender de tareas repetitivas.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-950/40 transition-colors hover:from-blue-500 hover:to-violet-500"
              data-cta="hero_evaluacion"
              onClick={() => trackContactClick('hero_evaluacion', 'hero')}
            >
              Solicitar evaluación gratuita
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </a>
            <a
              href="#servicios"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/10"
              data-cta="hero_servicios"
            >
              Ver servicios
            </a>
          </div>

          <ul className="mt-9 grid gap-3 text-sm text-slate-300 sm:grid-cols-3 sm:gap-5">
            {TRUST.map((t) => (
              <li key={t} className="flex gap-2">
                <CheckCircle size={18} weight="duotone" className="mt-0.5 shrink-0 text-emerald-300" aria-hidden="true" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Accesos directos a las tres áreas de servicio */}
        <ul className="mt-14 grid gap-4 md:mt-20 md:grid-cols-3">
          {AREAS.map((area) => (
            <li key={area.id}>
              <a
                href={area.path}
                className="group flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-ink/60 p-5 transition-colors hover:border-white/25 hover:bg-white/[0.08]"
                data-cta={`hero_area_${area.id}`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-300 ring-1 ring-white/15" aria-hidden="true">
                  <area.Icon size={22} weight="duotone" />
                </span>
                <span>
                  <span className="flex items-center gap-2 font-semibold text-white">
                    {area.name}
                    <ArrowRight
                      size={14}
                      weight="bold"
                      className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-white"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-400">{area.summary}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
export default Hero;
