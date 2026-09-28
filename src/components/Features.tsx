// src/components/Features.tsx — Oferta comercial (3 líneas de servicio)
import { memo, useCallback } from 'react';
import type { ComponentType } from 'react';
import type { IconProps } from 'phosphor-react';
import { Lightning, Rocket, Robot, Browsers, PlugsConnected } from 'phosphor-react';
import { selectContactInterest } from '../utils/contactIntent';
import type { Interest } from '../utils/contactIntent';

type Offer = {
  id: string;
  interest: Interest;
  name: string;
  tagline: string;
  forWho: string;
  problem: string;
  includes: string[];
  badge?: string;
  Icon: ComponentType<IconProps>;
  gradient: string;
};

// Sin precios ni promesas de resultados: se definirán más adelante.
const OFFERS: Offer[] = [
  {
    id: 'web-conversion',
    interest: 'web_conversion',
    name: 'Web & Conversión',
    tagline: 'Una web profesional que genera oportunidades',
    forWho: 'Negocios que necesitan una presencia digital profesional que además capte clientes potenciales.',
    problem: 'Tu web existe, pero no capta contactos o no los envía a ningún proceso de venta.',
    includes: [
      'Landing pages',
      'Webs corporativas',
      'Formularios de captación',
      'Integraciones con tus herramientas',
      'Analítica y medición',
      'Desarrollo web a medida (básico e intermedio)',
    ],
    Icon: Browsers,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'automation-ai',
    interest: 'automation_ai',
    name: 'Automatización & IA',
    tagline: 'Menos trabajo manual, mejor seguimiento',
    forWho: 'Empresas que pierden tiempo en tareas repetitivas o en el seguimiento manual de clientes.',
    problem: 'Leads que se enfrían, seguimientos que se olvidan y tareas que se repiten cada día.',
    includes: [
      'Automatización de leads y flujos de seguimiento',
      'Automatización de mensajes y email',
      'CRM',
      'Formularios inteligentes',
      'IA aplicada a procesos concretos',
      'Automatización de tareas internas',
    ],
    Icon: Robot,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'integrated-systems',
    interest: 'integrated_systems',
    name: 'Sistemas & Integraciones',
    tagline: 'Tus herramientas trabajando juntas',
    forWho: 'Proyectos en los que varias herramientas deben compartir información y funcionar como un solo sistema.',
    problem: 'Datos repartidos entre aplicaciones, copiar y pegar entre herramientas y procesos que dependen de tareas manuales.',
    includes: [
      'APIs e integraciones entre aplicaciones',
      'CRM y HubSpot',
      'Bases de datos',
      'Dashboards',
      'Formularios y automatizaciones conectadas',
      'Sistemas internos (básicos e intermedios)',
    ],
    badge: 'Mayor alcance técnico',
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
  const handleOfferCTA = useCallback((offer: Offer) => {
    (window as any)?.gtag?.('event', 'service_cta_click', {
      service_name: offer.name,
      page_location: window.location.href,
    });
    (window as any)?.fbq?.('trackCustom', 'ServiceCTA', { service_name: offer.name });
    selectContactInterest(offer.interest);
  }, []);

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
            Qué puedes{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              contratar con Vértice
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            No somos una agencia de marketing ni solo hacemos páginas web: construimos la web, las automatizaciones y
            las integraciones que tu negocio necesita para vender y operar mejor.
          </p>
        </div>

        {/* Ofertas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {OFFERS.map((offer) => (
            <article
              key={offer.id}
              className="arc-card group relative flex flex-col bg-white rounded-2xl p-8 border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
              data-cta={`service_card_${offer.id}`}
              aria-labelledby={`oferta-${offer.id}`}
            >
              {offer.badge && (
                <span className="absolute top-4 right-4 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full whitespace-nowrap">
                  {offer.badge}
                </span>
              )}

              <div className="mb-6 mt-4">
                <GlowBadge Icon={offer.Icon} gradient={offer.gradient} />
              </div>

              <h3
                id={`oferta-${offer.id}`}
                className="text-2xl font-bold text-gray-900 mb-2 text-center group-hover:text-blue-600 transition-colors duration-300"
              >
                {offer.name}
              </h3>
              <p className="text-sm font-semibold text-blue-700 mb-6 text-center">{offer.tagline}</p>

              <dl className="space-y-4 mb-6">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Para quién</dt>
                  <dd className="text-gray-700 leading-relaxed">{offer.forWho}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Qué resuelve</dt>
                  <dd className="text-gray-700 leading-relaxed">{offer.problem}</dd>
                </div>
              </dl>

              <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">Puede incluir</p>
              <ul className="space-y-3 mb-8">
                {offer.includes.map((item) => (
                  <li key={item} className="flex items-start text-sm font-medium text-gray-700">
                    <span
                      className={`mt-0.5 w-5 h-5 flex-shrink-0 bg-gradient-to-r ${offer.gradient} rounded-full flex items-center justify-center mr-3`}
                    >
                      <span className="text-white text-xs font-bold">✓</span>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                onClick={() => handleOfferCTA(offer)}
                className={`mt-auto block w-full text-center bg-gradient-to-r ${offer.gradient} text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300`}
                data-cta={`service_cta_${offer.id}`}
              >
                Consultar sobre {offer.name}
              </a>
            </article>
          ))}
        </div>

        {/* CTA inferior */}
        <div className="text-center">
          <div className="arc-card bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">¿No sabes por dónde empezar?</h3>
            <p className="text-xl mb-8 text-blue-100">
              Cuéntanos cómo trabajas hoy y te proponemos qué construir, automatizar o integrar primero.
            </p>
            <a
              href="#contact"
              onClick={() => selectContactInterest('otro')}
              className="arc-pill inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              data-cta="services_bottom_evaluacion"
            >
              Solicitar evaluación gratuita
              <Rocket size={22} weight="duotone" className="text-blue-600" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
});

Features.displayName = 'Features';
export default Features;
