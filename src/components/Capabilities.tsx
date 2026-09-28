// src/components/Capabilities.tsx — Prueba de capacidades (sustituye a ClientLogos)
// Solo contenido verificable: tecnologías usadas en esta web y en Lead AI, y proyectos propios.
// No añadir clientes, testimonios, certificaciones ni métricas que no sean reales.
import { memo, useEffect, useRef } from 'react';
import type { ComponentType } from 'react';
import type { IconProps } from 'phosphor-react';
import { Stack, Code, Database, Robot, ChartLineUp, Sparkle, PlugsConnected, Browsers } from 'phosphor-react';

type TechGroup = {
  title: string;
  items: string[];
  Icon: ComponentType<IconProps>;
};

const TECH_GROUPS: TechGroup[] = [
  { title: 'Desarrollo', items: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'], Icon: Code },
  { title: 'Datos e integraciones', items: ['PostgreSQL / Supabase', 'APIs REST', 'HubSpot API', 'OAuth'], Icon: Database },
  { title: 'IA y automatización', items: ['Modelos de IA vía API', 'Formularios con puntuación'], Icon: Robot },
  { title: 'Medición y despliegue', items: ['Google Analytics 4', 'Meta Pixel', 'Vercel'], Icon: ChartLineUp },
];

type Project = {
  title: string;
  tag: string;
  description: string;
  stack: string;
  Icon: ComponentType<IconProps>;
};

const PROJECTS: Project[] = [
  {
    title: 'Lead AI',
    tag: 'Producto propio',
    description:
      'Plataforma de captación y calificación de leads con formularios con puntuación, chat con IA y panel para trabajar en equipo.',
    stack: 'React · Supabase · Node.js · IA vía API',
    Icon: Sparkle,
  },
  {
    title: 'Integración Lead AI + HubSpot',
    tag: 'Integración',
    description:
      'Conexión segura por OAuth para enviar o actualizar leads como contactos, evitando duplicados cuando cambia el email.',
    stack: 'HubSpot API · Node.js',
    Icon: PlugsConnected,
  },
  {
    title: 'Web de Vértice',
    tag: 'Desarrollo web',
    description:
      'Esta misma web: formulario de contacto conectado y medición de conversiones con GA4 y Meta Pixel.',
    stack: 'React · TypeScript · Vercel',
    Icon: Browsers,
  },
];

const Capabilities = memo(() => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          window.gtag?.('event', 'view_item', {
            item_category: 'capabilities',
            section: 'capacidades',
            engagement_time_msec: 1000
          });
        }
      });
    }, { threshold: 0.4 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="capacidades"
      ref={sectionRef}
      className="bg-white py-20 md:py-28 relative overflow-hidden"
      aria-labelledby="capacidades-heading"
    >
      {/* decorativos */}
      <div className="absolute top-10 right-20 w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 blur-xl" aria-hidden="true"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-10 blur-2xl" aria-hidden="true"></div>

      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 arc-pill border-2 border-blue-200 bg-white/60 px-6 py-3 text-base font-semibold text-blue-700 mb-6">
            <Stack size={22} weight="duotone" className="text-blue-600" aria-hidden="true" />
            Capacidades
          </div>
          <h2 id="capacidades-heading" className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Lo que ya hemos{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              construido
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Preferimos mostrarte proyectos reales y las tecnologías con las que trabajamos, en lugar de prometer cifras.
          </p>
        </div>

        {/* Tecnologías */}
        <div className="mb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TECH_GROUPS.map(({ title, items, Icon }) => (
            <div
              key={title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center">
                  <Icon size={20} weight="duotone" color="#fff" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-gray-900">{title}</h3>
              </div>
              <ul className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <li
                    key={item}
                    className="px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Proyectos propios */}
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-tr from-blue-700 via-indigo-800 to-purple-900"></div>
          <div className="bg-gradient-to-r from-gray-900/95 to-blue-900/95 rounded-[28px] p-6 md:p-10 text-white shadow-[0_25px_90px_rgba(2,6,23,.45)]">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-10">Proyectos propios</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {PROJECTS.map(({ title, tag, description, stack, Icon }) => (
                <article
                  key={title}
                  className="arc-card relative rounded-3xl bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(99,102,241,0.18),rgba(139,92,246,0.18))] backdrop-blur-xl border border-white/15 p-6 md:p-7 shadow-[0_10px_40px_rgba(2,6,23,.35)] flex flex-col"
                >
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-12 h-12 gloss-circle rounded-full flex items-center justify-center bg-white/10">
                      <Icon size={24} weight="duotone" color="#fff" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-semibold text-blue-100 bg-white/10 px-3 py-1 rounded-full whitespace-nowrap">{tag}</span>
                  </div>
                  <h4 className="text-xl font-bold mb-2">{title}</h4>
                  <p className="text-blue-100 leading-relaxed mb-4">{description}</p>
                  <p className="mt-auto text-xs font-semibold text-blue-200">{stack}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Capabilities.displayName = 'Capabilities';
export default Capabilities;
