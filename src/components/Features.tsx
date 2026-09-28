// src/components/Features.tsx — Servicios (3 pilares)
import { memo, useCallback } from 'react';
import type { ComponentType } from 'react';
import type { IconProps } from 'phosphor-react';
import { Lightning, Rocket, Robot, Browsers, PlugsConnected } from 'phosphor-react';

type Service = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  items: string[];
  Icon: ComponentType<IconProps>;
  gradient: string;
};

const SERVICES: Service[] = [
  {
    id: 'automatizacion',
    title: 'Automatización e IA',
    tagline: 'Menos tareas repetitivas, mejor seguimiento de clientes',
    description:
      'Automatizamos el seguimiento de leads, la mensajería y los procesos internos para que tu equipo dedique su tiempo a lo que genera valor. Usamos IA donde aporta: en tareas concretas y medibles.',
    items: [
      'Automatización de WhatsApp y mensajería',
      'Seguimiento de leads y flujos de email',
      'Formularios inteligentes y calificación de leads',
      'Automatización de tareas y procesos internos',
      'IA aplicada a procesos reales (incluye Lead AI)',
    ],
    Icon: Robot,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'desarrollo-web',
    title: 'Desarrollo web orientado a negocio',
    tagline: 'Webs que forman parte de tu sistema comercial',
    description:
      'No solo diseñamos páginas: construimos webs que captan contactos, los envían a tus herramientas y apoyan tu proceso de venta.',
    items: [
      'Landing pages orientadas a conversión',
      'Webs corporativas profesionales',
      'Desarrollo a medida de complejidad básica y media',
      'Formularios y captación de leads',
      'Integración con tu CRM y herramientas',
    ],
    Icon: Browsers,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'integraciones',
    title: 'Integraciones y sistemas',
    tagline: 'Tus herramientas conectadas, tu información en orden',
    description:
      'Conectamos las aplicaciones que ya usas y construimos los sistemas que te faltan, para que la información fluya sin copiar y pegar entre herramientas.',
    items: [
      'CRM e integración con HubSpot',
      'APIs e integración entre aplicaciones',
      'Bases de datos y dashboards',
      'Sistemas internos y flujos comerciales',
      'Automatización de procesos operativos',
    ],
    Icon: PlugsConnected,
    gradient: 'from-purple-500 to-violet-500',
  },
];

// Badge con anillo + glow y centro blanco
function GlowBadge({ Icon, gradient }: { Icon: ComponentType<IconProps>; gradient: string }) {
  return (
    <div className="relative w-20 h-20 mx-auto">
      {/* Glow exterior suave */}
      <div
        aria-hidden="true"
        className={`absolute -inset-2 rounded-full blur-xl opacity-40 bg-gradient-to-r ${gradient}`}
      />
      {/* Anillo degradado */}
      <div className={`relative w-full h-full rounded-full p-[2px] bg-gradient-to-r ${gradient} shadow-[0_10px_30px_rgba(2,6,23,.15)]`}>
        {/* Centro blanco “glass” */}
        <div className="w-full h-full rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center ring-1 ring-black/5">
          <Icon size={36} weight="duotone" className="text-blue-700" aria-hidden="true" />
        </div>
      </div>
      {/* Brillo especular sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full overflow-hidden"
      >
        <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-14 h-8 rounded-b-full bg-white/50 blur-md opacity-40" />
      </div>
    </div>
  );
}

const Features = memo(() => {
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleServiceCTA = useCallback(
    (serviceTitle: string) => {
      (window as any)?.gtag?.('event', 'service_cta_click', {
        service_name: serviceTitle,
        page_location: window.location.href,
      });
      (window as any)?.fbq?.('trackCustom', 'ServiceCTA', { service_name: serviceTitle });
      scrollToSection('contact');
    },
    [scrollToSection]
  );

  return (
    <section
      id="servicios"
      className="relative bg-gradient-to-br from-gray-50 to-blue-50/30 py-20 md:py-28 overflow-hidden"
    >
      {/* decorativos */}
      <div
        className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-10 blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="arc-pill inline-flex items-center gap-3 border-2 border-blue-200 bg-white/70 px-6 py-3 text-base font-semibold text-blue-700 mb-6 shadow-lg">
            <Lightning size={22} weight="duotone" className="text-blue-600" />
            Servicios
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Tres áreas, un objetivo:{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              que tu negocio funcione mejor
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Automatizamos, construimos e integramos según lo que tu negocio necesite. Puedes empezar por una sola área y
            crecer desde ahí.
          </p>
        </div>

        {/* Services */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {SERVICES.map((service) => (
            <article
              key={service.id}
              className="arc-card group relative flex flex-col bg-white rounded-2xl p-8 border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
              data-cta={`service_card_${service.id}`}
              aria-labelledby={`servicio-${service.id}`}
            >
              <div className="mb-6">
                <GlowBadge Icon={service.Icon} gradient={service.gradient} />
              </div>

              <h3
                id={`servicio-${service.id}`}
                className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center group-hover:text-blue-600 transition-colors duration-300"
              >
                {service.title}
              </h3>
              <p className="text-sm font-semibold text-blue-700 mb-4 text-center">{service.tagline}</p>

              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

              <ul className="space-y-3 mb-8">
                {service.items.map((item) => (
                  <li key={item} className="flex items-start text-sm font-medium text-gray-700">
                    <span
                      className={`mt-0.5 w-5 h-5 flex-shrink-0 bg-gradient-to-r ${service.gradient} rounded-full flex items-center justify-center mr-3`}
                    >
                      <span className="text-white text-xs font-bold">✓</span>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleServiceCTA(service.title)}
                className={`mt-auto w-full bg-gradient-to-r ${service.gradient} text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300`}
                data-cta={`service_cta_${service.id}`}
              >
                Consultar sobre este servicio
              </button>
            </article>
          ))}
        </div>

        {/* CTA inferior */}
        <div className="text-center">
          <div className="arc-card bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">¿No sabes por dónde empezar?</h3>
            <p className="text-xl mb-8 text-blue-100">
              Cuéntanos cómo trabajas hoy y te proponemos qué automatizar, construir o integrar primero.
            </p>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="arc-pill inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              data-cta="services_bottom_evaluacion"
            >
              Solicitar evaluación gratuita
              <Rocket size={22} weight="duotone" className="text-blue-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

Features.displayName = 'Features';
export default Features;
