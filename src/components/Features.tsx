// src/components/Features.tsx
import { useState, memo, useCallback } from 'react';

// ✅ Importar assets para que Vite los procese en build (Vercel)
// Mejora: evita rutas /src/... que no existen en producción
import aiAutomation from '../assets/services/ai-automation-pro.png';
import growthStrategy from '../assets/services/growth-strategy-pro.png';
import smartAds from '../assets/services/smart-ads-pro.png';
import contentMarketing from '../assets/services/content-marketing-pro.png';
import advancedAnalytics from '../assets/services/advanced-analytics-pro.png';
import rapidImplementation from '../assets/services/rapid-implementation-pro.png';

// Mapa de íconos: ahora usando imports (funciona en build)
const serviceIconSrc: Record<string, string> = {
  "Automatización con IA": aiAutomation,
  "Estrategias de Crecimiento": growthStrategy,
  "Publicidad Inteligente": smartAds,
  "Marketing de Contenido": contentMarketing,
  "Analytics Avanzado": advancedAnalytics,
  "Implementación Rápida": rapidImplementation,
};

const Features = memo(() => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleServiceCTA = useCallback((serviceTitle: string) => {
    // Tracking suave (no rompe si no existen)
    (window as any)?.gtag?.('event', 'service_cta_click', {
      service_name: serviceTitle,
      page_location: window.location.href,
    });
    (window as any)?.fbq?.('trackCustom', 'ServiceCTA', { service_name: serviceTitle });
    scrollToSection('contact');
  }, [scrollToSection]);

  const services = [
    {
      icon: "🤖",
      title: "Automatización con IA",
      description: "Sistemas inteligentes que automatizan tu marketing, generación de contenido y seguimiento de leads 24/7.",
      benefits: ["Respuesta automática", "Content generation", "Lead scoring"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "📈",
      title: "Estrategias de Crecimiento",
      description: "Diseñamos estrategias personalizadas basadas en datos para escalar tu negocio digital de forma sostenible.",
      benefits: ["Growth hacking", "Funnel optimization", "Data-driven decisions"],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "🎯",
      title: "Publicidad Inteligente",
      description: "Campañas publicitarias optimizadas con IA en Google, Facebook, Instagram y LinkedIn para maximizar ROI.",
      benefits: ["Targeting preciso", "Optimización automática", "ROI garantizado"],
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: "💬",
      title: "Marketing de Contenido",
      description: "Creación de contenido de alto valor que posiciona tu marca como líder en tu industria.",
      benefits: ["SEO optimizado", "Engagement alto", "Brand authority"],
      color: "from-orange-500 to-red-500"
    },
    {
      icon: "📊",
      title: "Analytics Avanzado",
      description: "Dashboards en tiempo real y reportes detallados para tomar decisiones basadas en datos reales.",
      benefits: ["Métricas clave", "Insights accionables", "ROI tracking"],
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: "🚀",
      title: "Implementación Rápida",
      description: "Resultados visibles en las primeras 4 semanas con nuestro sistema de implementación acelerada.",
      benefits: ["Setup rápido", "Resultados inmediatos", "Soporte continuo"],
      color: "from-pink-500 to-rose-500"
    }
  ];

  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_');

  return (
    <section id="servicios" className="relative bg-gradient-to-br from-gray-50 to-blue-50/30 py-20 md:py-28 overflow-hidden">
      {/* Elementos decorativos de fondo (sin cambios de lógica) */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 blur-2xl" aria-hidden="true"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-10 blur-3xl" aria-hidden="true"></div>

      <div className="container relative">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 rounded-full border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 text-base font-semibold text-blue-700 mb-6 shadow-lg">
            <span className="text-xl">⚡</span>
            Nuestros Servicios
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-8 leading-tight">
            Potencia tu Negocio con{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              IA Avanzada
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Combinamos marketing tradicional con inteligencia artificial para crear estrategias que generan resultados medibles y escalables.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-500 cursor-pointer ${
                hoveredCard === index ? 'shadow-2xl -translate-y-2 scale-105' : 'hover:shadow-xl hover:-translate-y-1'
              }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              data-cta={`service_card_${slug(service.title)}`}
              role="button"
              tabIndex={0}
              aria-label={`Servicio: ${service.title}`}
            >
              {/* Overlay de color muy sutil en card al hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>

              {/* Icono: SIN CUADRO, más grande y con glow focal */}
              <div className={`relative mb-6 transition-transform duration-500 ${hoveredCard === index ? 'scale-110' : ''}`}>
                {/* Glow (azul→morado) SOLO en hover */}
                <span
                  aria-hidden
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 
                              h-24 w-24 md:h-28 md:w-28 rounded-full 
                              bg-gradient-to-br ${service.color} blur-2xl opacity-0 
                              group-hover:opacity-60 transition-opacity duration-500`}
                />
                {serviceIconSrc[service.title] ? (
                  <img
                    src={serviceIconSrc[service.title]}
                    alt={service.title}
                    width={96}
                    height={96}
                    loading="lazy"
                    decoding="async"
                    // Mejora visual: icono grande y crecimiento en hover
                    className="h-20 w-20 md:h-24 md:w-24 object-contain select-none transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_4px_14px_rgba(37,99,235,0.22)]"
                  />
                ) : (
                  <span className="text-5xl md:text-6xl leading-none">{service.icon}</span>
                )}
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                {service.title}
              </h3>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>

              <ul className="space-y-3">
                {service.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center text-sm font-medium text-gray-600">
                    <div className={`w-5 h-5 bg-gradient-to-r ${service.color} rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="group-hover:text-gray-800 transition-colors duration-300">{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* Botón que aparece en hover */}
              <div className={`mt-6 transition-all duration-500 ${hoveredCard === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <button
                  type="button"
                  onClick={() => handleServiceCTA(service.title)}
                  className={`w-full bg-gradient-to-r ${service.color} text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300`}
                  data-cta={`service_cta_${slug(service.title)}`}
                >
                  Más información
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                300%
              </div>
              <div className="text-gray-600 font-semibold">ROI Promedio</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                50+
              </div>
              <div className="text-gray-600 font-semibold">Clientes Satisfechos</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-gray-600 font-semibold">Automatización IA</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                4
              </div>
              <div className="text-gray-600 font-semibold">Semanas a Resultados</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              ¿Listo para revolucionar tu marketing digital?
            </h3>
            <p className="text-xl mb-8 text-blue-100">
              Descubre cómo nuestras soluciones de IA pueden transformar tu negocio
            </p>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              data-cta="services_bottom_cta_contact"
            >
              Descubre cómo podemos ayudarte
              <span className="text-xl">🚀</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

Features.displayName = 'Features';
export default Features;
