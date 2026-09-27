// src/components/Features.tsx
import { useState, memo, useCallback } from 'react';
import { Lightning, Rocket } from 'phosphor-react';

import aiAutomation from '../assets/services/ai-automation-pro.png';
import growthStrategy from '../assets/services/growth-strategy-pro.png';
import smartAds from '../assets/services/smart-ads-pro.png';
import contentMarketing from '../assets/services/content-marketing-pro.png';
import advancedAnalytics from '../assets/services/advanced-analytics-pro.png';
import rapidImplementation from '../assets/services/rapid-implementation-pro.png';

const serviceIconSrc: Record<string, string> = {
  'Automatización con IA': aiAutomation,
  'Estrategias de Crecimiento': growthStrategy,
  'Publicidad Inteligente': smartAds,
  'Marketing de Contenido': contentMarketing,
  'Analytics Avanzado': advancedAnalytics,
  'Implementación Rápida': rapidImplementation,
};

// Gradientes por servicio (para el anillo y el glow)
const serviceGradients: Record<string, string> = {
  'Automatización con IA': 'from-blue-500 to-cyan-500',
  'Estrategias de Crecimiento': 'from-green-500 to-emerald-500',
  'Publicidad Inteligente': 'from-purple-500 to-violet-500',
  'Marketing de Contenido': 'from-orange-500 to-red-500',
  'Analytics Avanzado': 'from-indigo-500 to-blue-500',
  'Implementación Rápida': 'from-pink-500 to-rose-500',
};

// Badge con anillo + glow y centro blanco para que el logo no se opaque
function GlowBadge({ title }: { title: string }) {
  const src = serviceIconSrc[title];
  const grad = serviceGradients[title] ?? 'from-blue-500 to-purple-500';

  return (
    <div className="relative w-20 h-20 mx-auto">
      {/* Glow exterior suave */}
      <div
        aria-hidden="true"
        className={`absolute -inset-2 rounded-full blur-xl opacity-40 bg-gradient-to-r ${grad}`}
      />
      {/* Anillo degradado */}
      <div className={`relative w-full h-full rounded-full p-[2px] bg-gradient-to-r ${grad} shadow-[0_10px_30px_rgba(2,6,23,.15)]`}>
        {/* Centro blanco “glass” para proteger el logo */}
        <div className="w-full h-full rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center ring-1 ring-black/5">
          <img
            src={src}
            alt={title}
            className="h-12 w-12 object-contain"
            loading="lazy"
            decoding="async"
          />
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
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

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

  const services = [
    {
      title: 'Automatización con IA',
      description:
        'Sistemas inteligentes que automatizan tu marketing, generación de contenido y seguimiento de leads 24/7.',
      benefits: ['Respuesta automática', 'Content generation', 'Lead scoring'],
    },
    {
      title: 'Estrategias de Crecimiento',
      description:
        'Diseñamos estrategias personalizadas basadas en datos para escalar tu negocio digital de forma sostenible.',
      benefits: ['Growth hacking', 'Funnel optimization', 'Data-driven decisions'],
    },
    {
      title: 'Publicidad Inteligente',
      description:
        'Campañas publicitarias optimizadas con IA en Google, Facebook, Instagram y LinkedIn para maximizar ROI.',
      benefits: ['Targeting preciso', 'Optimización automática', 'ROI garantizado'],
    },
    {
      title: 'Marketing de Contenido',
      description:
        'Creación de contenido de alto valor que posiciona tu marca como líder en tu industria.',
      benefits: ['SEO optimizado', 'Engagement alto', 'Brand authority'],
    },
    {
      title: 'Analytics Avanzado',
      description:
        'Dashboards en tiempo real y reportes detallados para tomar decisiones basadas en datos reales.',
      benefits: ['Métricas clave', 'Insights accionables', 'ROI tracking'],
    },
    {
      title: 'Implementación Rápida',
      description:
        'Resultados visibles en las primeras 4 semanas con nuestro sistema de implementación acelerada.',
      benefits: ['Setup rápido', 'Resultados inmediatos', 'Soporte continuo'],
    },
  ];

  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_');

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
            Nuestros Servicios
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Potencia tu Negocio con{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              IA Avanzada
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Combinamos marketing tradicional con inteligencia artificial para crear estrategias que generan resultados
            medibles y escalables.
          </p>
        </div>

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const grad = serviceGradients[service.title] ?? 'from-blue-500 to-purple-500';
            return (
              <div
                key={service.title}
                className={`arc-card group relative bg-white rounded-2xl p-8 border border-gray-100 transition-all duration-500 cursor-pointer ${
                  hoveredCard === index ? 'shadow-2xl -translate-y-2' : 'hover:shadow-xl hover:-translate-y-1'
                }`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                data-cta={`service_card_${slug(service.title)}`}
                aria-label={`Servicio: ${service.title}`}
              >
                {/* Nuevo badge pro: anillo + glow + centro blanco */}
                <div className="mb-6">
                  <GlowBadge title={service.title} />
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {service.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

                <ul className="space-y-3">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center text-sm font-medium text-gray-600">
                      <span
                        className={`w-5 h-5 bg-gradient-to-r ${grad} rounded-full flex items-center justify-center mr-3`}
                      >
                        <span className="text-white text-xs font-bold">✓</span>
                      </span>
                      <span className="group-hover:text-gray-800 transition-colors duration-300">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div
                  className={`mt-6 transition-all duration-500 ${
                    hoveredCard === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleServiceCTA(service.title)}
                    className={`w-full bg-gradient-to-r ${grad} text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300`}
                  >
                    Más información
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA inferior */}
        <div className="text-center">
          <div className="arc-card bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">¿Listo para revolucionar tu marketing digital?</h3>
            <p className="text-xl mb-8 text-blue-100">Descubre cómo nuestras soluciones de IA pueden transformar tu negocio</p>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="arc-pill inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Descubre cómo podemos ayudarte
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
