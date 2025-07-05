import { useState, memo, useCallback } from 'react';

const Features = memo(() => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

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

  return (
    <section id="servicios" className="relative bg-gradient-to-br from-gray-50 to-blue-50/30 py-20 md:py-28 overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 blur-2xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-10 blur-3xl"></div>
      
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
                hoveredCard === index 
                  ? 'shadow-2xl -translate-y-2 scale-105' 
                  : 'hover:shadow-xl hover:-translate-y-1'
              }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Gradient overlay en hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
              
              {/* Icono con animación */}
              <div className={`relative mb-6 transition-transform duration-500 ${hoveredCard === index ? 'scale-125 rotate-6' : ''}`}>
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500`}>
                  <span className="text-3xl">{service.icon}</span>
                </div>
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
                <button className={`w-full bg-gradient-to-r ${service.color} text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300`}>
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
              onClick={() => scrollToSection('contact')}
              className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
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