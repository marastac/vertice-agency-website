const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: '#', color: 'hover:text-blue-400' },
    { name: 'Instagram', icon: '📷', url: '#', color: 'hover:text-pink-400' },
    { name: 'LinkedIn', icon: '💼', url: '#', color: 'hover:text-blue-300' },
    { name: 'Twitter', icon: '🐦', url: '#', color: 'hover:text-blue-400' },
    { name: 'YouTube', icon: '📺', url: '#', color: 'hover:text-red-400' }
  ];

  const services = [
    'Automatización con IA',
    'Estrategias de Crecimiento', 
    'Publicidad Inteligente',
    'Marketing de Contenido',
    'Analytics Avanzado',
    'Implementación Rápida'
  ];

  const quickLinks = [
    { name: 'Inicio', id: 'home' },
    { name: 'Servicios', id: 'servicios' },
    { name: 'Casos de Éxito', id: 'casos' },
    { name: 'Blog', url: '#' },
    { name: 'Recursos', url: '#' }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"></div>

      <div className="relative">
        {/* Newsletter Section */}
        <div className="border-b border-white/10 py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                🚀 Recibe estrategias exclusivas de marketing digital
              </h3>
              <p className="text-blue-100 mb-8 text-lg">
                Tips semanales, casos de éxito y las últimas tendencias en IA aplicada al marketing
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
                />
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 whitespace-nowrap">
                  Suscribirme
                </button>
              </div>
              <p className="text-xs text-blue-200 mt-4">
                📧 Sin spam. Cancela cuando quieras.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              
              {/* Logo y descripción */}
              <div className="lg:col-span-2">
                <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                  Vértice Agency
                </div>
                <p className="text-blue-100 mb-6 max-w-md leading-relaxed">
                  Transformamos negocios digitales con estrategias de marketing innovadoras y soluciones de inteligencia artificial que generan resultados medibles y escalables.
                </p>
                
                {/* Redes sociales */}
                <div className="flex space-x-4 mb-6">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      className={`w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl transition-all duration-300 hover:bg-white/20 backdrop-blur-sm ${social.color} hover:scale-110 hover:-translate-y-1`}
                      title={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>

                {/* Certificaciones */}
                <div className="flex flex-wrap gap-3">
                  <div className="bg-white/10 px-3 py-2 rounded-lg text-xs font-semibold backdrop-blur-sm">
                    🏆 Google Partner
                  </div>
                  <div className="bg-white/10 px-3 py-2 rounded-lg text-xs font-semibold backdrop-blur-sm">
                    🔥 Meta Business Partner
                  </div>
                </div>
              </div>

              {/* Enlaces rápidos */}
              <div>
                <h3 className="text-lg font-bold mb-6 text-white">Enlaces Rápidos</h3>
                <ul className="space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <button
                        onClick={() => link.id ? scrollToSection(link.id) : window.open(link.url)}
                        className="text-blue-100 hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block"
                      >
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Servicios */}
              <div>
                <h3 className="text-lg font-bold mb-6 text-white">Servicios</h3>
                <ul className="space-y-3">
                  {services.map((service) => (
                    <li key={service}>
                      <button
                        onClick={() => scrollToSection('servicios')}
                        className="text-blue-100 hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block text-left"
                      >
                        {service}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contacto */}
              <div>
                <h3 className="text-lg font-bold mb-6 text-white">Contacto</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-blue-100">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm">📧</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">Email</div>
                      <a href="mailto:hola@verticeagency.com" className="hover:text-white transition-colors">
                        hola@verticeagency.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 text-blue-100">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm">📱</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">WhatsApp</div>
                      <a href="https://wa.me/51999999999" className="hover:text-white transition-colors">
                        +51 999 999 999
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 text-blue-100">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm">🌎</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">Cobertura</div>
                      <span>Perú & España</span>
                    </div>
                  </li>
                </ul>

                <button
                  onClick={() => scrollToSection('contact')}
                  className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Auditoría Gratuita
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 py-8">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-blue-200 text-sm">
                © {currentYear} Vértice Agency. Todos los derechos reservados.
              </div>
              
              <div className="flex flex-wrap gap-6 text-sm">
                <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300">
                  Política de Privacidad
                </a>
                <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300">
                  Términos de Servicio
                </a>
                <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300">
                  Cookies
                </a>
                <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300">
                  Aviso Legal
                </a>
              </div>

              <div className="text-blue-200 text-sm">
                Made with ❤️ in Peru & Spain
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;