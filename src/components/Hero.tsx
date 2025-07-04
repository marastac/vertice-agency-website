const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-24 pb-20 md:pt-32 md:pb-28 lg:pt-40 lg:pb-32">
      <div className="container">
        <div className="flex flex-wrap items-center">
          <div className="w-full px-4">
            <div className="mx-auto max-w-5xl text-center">
              
              {/* Badge Superior */}
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 text-base font-semibold text-blue-700 shadow-lg">
                <span className="text-xl">✨</span>
                Marketing Digital Potenciado por IA
              </div>

              {/* Título Principal */}
              <h1 className="mb-8 text-4xl font-black leading-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
                Escala tu Negocio Online con{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                    Inteligencia Artificial
                  </span>
                  <div className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                </span>
              </h1>

              {/* Subtítulo */}
              <p className="mb-10 text-xl leading-relaxed text-gray-600 sm:text-2xl md:text-2xl lg:px-20">
                Transformamos <strong className="text-gray-900 font-bold">coaches, consultores y creadores de contenido</strong> en Perú y España con estrategias de marketing digital innovadoras, automatización inteligente y soluciones de IA que generan leads cualificados y maximizan conversiones.
              </p>

              {/* Estadísticas Rápidas */}
              <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">+300%</div>
                  <span className="text-sm font-semibold text-gray-700">
                    ROI Promedio
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">2x</div>
                  <span className="text-sm font-semibold text-gray-700">
                    Más Leads Cualificados
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600 mb-1">80%</div>
                  <span className="text-sm font-semibold text-gray-700">
                    Ahorro en Tiempo
                  </span>
                </div>
              </div>

              {/* Botones CTA */}
              <div className="flex flex-col items-center justify-center space-y-6 sm:flex-row sm:space-x-8 sm:space-y-0">
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-5 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-1"
                >
                  Agenda tu Auditoría Gratuita con IA
                  <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
                </a>
                
                <a
                  href="#servicios"
                  className="group inline-flex items-center gap-3 rounded-2xl border-3 border-gray-300 bg-white px-10 py-5 text-lg font-bold text-gray-900 shadow-lg transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 hover:shadow-xl hover:-translate-y-1"
                >
                  Ver Cómo Funciona la IA
                  <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>

              {/* Indicador de confianza */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-500 text-lg">✅</span>
                  <span>Auditoría sin compromiso</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500 text-lg">✅</span>
                  <span>Resultados garantizados</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500 text-lg">✅</span>
                  <span>Soporte en español</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Elementos de fondo decorativos mejorados */}
      <div className="absolute right-0 top-0 -z-10 opacity-30">
        <div className="h-96 w-96 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 -z-10 opacity-30">
        <div className="h-64 w-64 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-400 blur-2xl"></div>
      </div>
      <div className="absolute right-1/4 top-1/3 -z-10 opacity-20">
        <div className="h-32 w-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 blur-2xl"></div>
      </div>
    </section>
  );
};

export default Hero;