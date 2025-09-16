// src/components/ClientLogos.tsx
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

type Client = {
  name: string;
  category: string;
  tagline: string;
};

const clients: Client[] = [
  { name: 'TechStartup',      category: 'Startup',   tagline: 'SaaS de alto crecimiento' },
  { name: 'Creative Agency',  category: 'Agencia',   tagline: 'Branding y contenidos' },
  { name: 'Digital Solutions',category: 'Consultora',tagline: 'Transformación digital' },
  { name: 'Innovation Lab',   category: 'Tech',      tagline: 'I+D y prototipado' },
  { name: 'Growth Company',   category: 'Ecommerce', tagline: 'DTC y suscripciones' },
  { name: 'Scale Business',   category: 'SaaS',      tagline: 'B2B lead gen' },
  { name: 'Smart Coaching',   category: 'Coach',     tagline: 'Cursos y mentorías' },
  { name: 'Expert Consulting',category: 'Consultor', tagline: 'Servicios premium' }
];

const testimonials = [
  {
    text: 'En 90 días multiplicamos x4 los leads y bajamos 35% el CAC con funnels + IA.',
    author: 'María González',
    company: 'TechStartup',
    role: 'CEO',
    metric: '+300% leads · -35% CAC'
  },
  {
    text: 'Automatizamos nurturing y reservas. El equipo ahorra 80% del tiempo operativo.',
    author: 'Carlos Mendoza',
    company: 'Growth Company',
    role: 'Director de Marketing',
    metric: '80% menos trabajo manual'
  },
  {
    text: 'Optimización creativa y testing A/B elevaron el CTR 2.3x y el ROAS 2x.',
    author: 'Ana Rodríguez',
    company: 'Digital Solutions',
    role: 'Fundadora',
    metric: 'CTR 2.3x · ROAS 2x'
  }
];

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 3).toUpperCase();
}

/* ---------------------- LOGO CARD ---------------------- */
const LogoCard = ({ client }: { client: Client }) => (
  <div
    className="group flex flex-col items-center justify-center p-6 transition-all duration-300 hover:scale-105"
    data-cta={`client_logo_${client.name.replace(/\s+/g, '_').toLowerCase()}`}
    aria-label={`Cliente: ${client.name} (${client.category})`}
  >
    <div className="w-full h-20 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <svg
        className="h-full w-full"
        role="img"
        aria-labelledby={`${client.name}-title`}
        viewBox="0 0 400 160"
        preserveAspectRatio="xMidYMid meet"
      >
        <title id={`${client.name}-title`}>{client.name}</title>
        <defs>
          <linearGradient id={`${client.name}-grad`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="400" height="160" fill="#f8fafc" />
        <circle cx="60" cy="80" r="36" fill={`url(#${client.name}-grad)`} opacity="0.9" />
        <rect x="110" y="48" width="220" height="18" rx="9" fill="#e5e7eb" />
        <rect x="110" y="78" width="170" height="14" rx="7" fill="#e5e7eb" />
        <text x="60" y="86" textAnchor="middle" fontSize="28" fontWeight="700" fill="#ffffff" aria-hidden="true">
          {initials(client.name)}
        </text>
      </svg>
    </div>
    <div className="mt-3 text-center">
      <div className="text-sm font-semibold text-gray-700">{client.name}</div>
      <div className="text-xs text-gray-500">{client.category} · {client.tagline}</div>
    </div>
  </div>
);

/* ---------------------- HOOKS UTIL ---------------------- */
const useInView = (threshold = 0.5) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && setInView(true)), { threshold });
    io.observe(node);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
};

const useCountUp = (to: number, opts?: { duration?: number; suffix?: string; prefix?: string; decimals?: number; start?: boolean; }) => {
  const { duration = 1200, suffix = '', prefix = '', decimals = 0, start = true } = opts || {};
  const [val, setVal] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTs = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;
    const from = 0;
    const animate = (ts: number) => {
      if (startTs.current == null) startTs.current = ts;
      const p = Math.min(1, (ts - startTs.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(from + (to - from) * eased);
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [to, duration, start]);

  const formatted = useMemo(() => {
    const fixed = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();
    return `${prefix}${fixed}${suffix}`;
  }, [val, prefix, suffix, decimals]);

  return formatted;
};

/* ---------------------- STATS ITEM ---------------------- */
type StatItem = {
  icon: string;
  to: number;
  title: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
};

const TiltStat = ({ icon, to, title, suffix = '', prefix = '', decimals = 0 }: StatItem) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const { ref, inView } = useInView(0.5);
  const value = useCountUp(to, { duration: 1400, suffix, prefix, decimals, start: inView });

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -6;
    const ry = ((x / rect.width) - 0.5) *  6;
    setTilt({ rx, ry });
  }, []);
  const onLeave = useCallback(() => setTilt({ rx: 0, ry: 0 }), []);

  return (
    <div ref={ref} className="relative">
      {/* borde degradado coherente con el logo */}
      <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-blue-500/50 via-indigo-500/50 to-purple-500/50 blur-[2px]" aria-hidden="true"></div>

      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative rounded-3xl bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(99,102,241,0.18),rgba(139,92,246,0.18))] backdrop-blur-xl border border-white/15 p-6 md:p-7 text-center shadow-[0_10px_40px_rgba(2,6,23,.35)] transition-transform duration-200 will-change-transform
                   flex flex-col items-center justify-center min-h-[180px]"
        style={{ transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
      >
        {/* shimmer sutil */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden">
          <div className="absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-12 translate-x-[-120%] group-hover:translate-x-[220%] transition-transform duration-[1500ms] ease-out"></div>
        </div>

        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2.5 bg-white/10">
          <span className="text-2xl" aria-hidden="true">{icon}</span>
        </div>

        <div className="leading-none">
          <span className="text-4xl md:text-5xl font-black tracking-tight">{value}</span>
        </div>

        <div className="font-medium text-blue-100 mt-2 max-w-[13ch] mx-auto">
          {title}
        </div>
      </div>
    </div>
  );
};

/* ---------------------- MAIN ---------------------- */
const ClientLogos = memo(() => {
  const sectionRef = useRef<HTMLElement | null>(null);

  // GA4 cuando la sección entra en viewport
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          (window as any)?.gtag?.('event', 'view_item', {
            item_category: 'social_proof',
            section: 'client_logos',
            engagement_time_msec: 1000
          });
        }
      });
    }, { threshold: 0.4 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-20 md:py-28 relative overflow-hidden">
      {/* decorativos */}
      <div className="absolute top-10 right-20 w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 blur-xl" aria-hidden="true"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-10 blur-2xl" aria-hidden="true"></div>

      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 rounded-full border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 text-base font-semibold text-blue-700 mb-6">
            <span className="text-xl">🤝</span>
            Confianza que acelera resultados
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Marcas que confían en{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Vértice Agency
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Desde startups hasta empresas consolidadas en Perú y España. Resultados medibles, soporte cercano y enfoque data-driven.
          </p>
        </div>

        {/* Logos */}
        <div className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 items-center justify-center">
            {clients.map((client) => (
              <LogoCard key={client.name} client={client} />
            ))}
          </div>
        </div>

        {/* Testimonios */}
        <div className="mb-20" aria-labelledby="testimonials-title">
          <h3 id="testimonials-title" className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            Lo que dicen nuestros clientes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <article
                key={`${t.author}-${i}`}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                aria-label={`Testimonio de ${t.author} (${t.company})`}
              >
                <div className="mb-6">
                  <div className="flex text-yellow-400 mb-4" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <span key={s} className="text-xl">⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-800 leading-relaxed">“{t.text}”</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold" aria-hidden="true">
                      {initials(t.author)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{t.author}</div>
                      <div className="text-sm text-gray-600">{t.role} — {t.company}</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                    {t.metric}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Estadísticas (paleta del logo + alturas iguales) */}
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-tr from-blue-700 via-indigo-800 to-purple-900"></div>
          <div className="bg-gradient-to-r from-gray-900/95 to-blue-900/95 rounded-[28px] p-6 md:p-10 text-white shadow-[0_25px_90px_rgba(2,6,23,.45)]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 group">
              <TiltStat icon="🎯" to={50}  suffix="+" title="Proyectos exitosos" />
              <TiltStat icon="📈" to={300} suffix="%" title="ROI promedio" />
              <TiltStat icon="🌎" to={2} title="Países (Perú & España)" />
              <TiltStat icon="⚡" to={24} suffix="/7" title="Automatización IA" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
});

ClientLogos.displayName = 'ClientLogos';
export default ClientLogos;
