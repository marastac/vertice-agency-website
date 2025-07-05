import { memo } from 'react'

const ClientLogos = memo(() => {
  const clients = [
    { name: "TechStartup", category: "Startup" },
    { name: "Creative Agency", category: "Agencia" }, 
    { name: "Digital Solutions", category: "Consultora" },
    { name: "Innovation Lab", category: "Tech" },
    { name: "Growth Company", category: "Ecommerce" },
    { name: "Scale Business", category: "SaaS" },
    { name: "Smart Coaching", category: "Coach" },
    { name: "Expert Consulting", category: "Consultor" }
  ];

  const testimonials = [
    {
      text: "Vértice Agency transformó completamente nuestra estrategia digital. En 3 meses aumentamos nuestros leads en 400%.",
      author: "María González",
      company: "TechStartup",
      role: "CEO"
    },
    {
      text: "La automatización con IA nos ahorró 80% del tiempo en marketing. Ahora nos enfocamos en lo que realmente importa.",
      author: "Carlos Mendoza",
      company: "Growth Company", 
      role: "Director de Marketing"
    },
    {
      text: "Profesionales excepcionales. Su enfoque data-driven nos ayudó a optimizar nuestro ROI de forma impresionante.",
      author: "Ana Rodríguez",
      company: "Digital Solutions",
      role: "Fundadora"
    }
  ];

  return (
    <section className="bg-white py-20 md:py-28 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-10 right-20 w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-10 blur-2xl"></div>

      <div className="container">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 rounded-full border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 text-base font-semibold text-blue-700 mb-6">
            <span className="text-xl">🤝</span>
            Nuestros Clientes
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Empresas que confían en{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vértice Agency
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Desde startups hasta empresas consolidadas en Perú y España que han transformado su marketing digital
          </p>
        </div>

        {/* Grid de logos con animación infinita */}
        <div className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 items-center justify-center">
            {clients.map((client, index) => (
              <div
                key={client.name}
                className="group flex flex-col items-center justify-center p-6 transition-all duration-500 hover:scale-110"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Logo placeholder mejorado */}
                <div className="w-full h-20 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl flex flex-col items-center justify-center opacity-70 hover:opacity-100 transition-all duration-300 hover:border-blue-300 hover:shadow-lg group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-purple-50">
                  <span className="text-sm font-bold text-gray-600 group-hover:text-blue-600 transition-colors duration-300 text-center px-2">
                    {client.name}
                  </span>
                  <span className="text-xs text-gray-400 group-hover:text-blue-400 transition-colors duration-300">
                    {client.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonios */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            Lo que dicen nuestros clientes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-6">
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xl">⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role} - {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estadísticas mejoradas */}
        <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  50+
                </div>
                <div className="font-semibold text-blue-100">Proyectos Exitosos</div>
              </div>
            </div>
            
            <div className="group">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📈</span>
                </div>
                <div className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  +300%
                </div>
                <div className="font-semibold text-blue-100">ROI Promedio</div>
              </div>
            </div>
            
            <div className="group">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🌎</span>
                </div>
                <div className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  2
                </div>
                <div className="font-semibold text-blue-100">Países (Perú & España)</div>
              </div>
            </div>
            
            <div className="group">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  24/7
                </div>
                <div className="font-semibold text-blue-100">Automatización IA</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

ClientLogos.displayName = 'ClientLogos';

export default ClientLogos;