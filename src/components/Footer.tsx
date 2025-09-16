// src/components/Footer.tsx
import { memo, useCallback, useEffect, useRef } from 'react';
import Newsletter from './Newsletter';

const Footer = memo(() => {
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const openExternalLink = useCallback((url: string) => {
    // Evita abrir pestañas vacías si aún no hay URL real
    if (!url || url === '#') return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Facebook',  icon: '📘', url: '#', color: 'hover:text-blue-400' },
    { name: 'Instagram', icon: '📷', url: '#', color: 'hover:text-pink-400' },
    { name: 'LinkedIn',  icon: '💼', url: '#', color: 'hover:text-blue-300' },
    { name: 'Twitter',   icon: '🐦', url: '#', color: 'hover:text-blue-400' },
    { name: 'YouTube',   icon: '📺', url: '#', color: 'hover:text-red-400'  }
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
    { name: 'Recursos', id: 'recursos' } // → scroll a #recursos
  ];

  // GA4: registrar vista del bloque de newsletter en el footer
  const nlRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const node = nlRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (window as any)?.gtag?.('event', 'view_item', {
              item_category: 'newsletter',
              section: 'footer',
              engagement_time_msec: 1000
            });
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Elementos decorativos */}
      <div
        className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"
        aria-hidden="true"
      />

      <div className="relative">
        {/* Newsletter Section -> usa el componente real */}
        <div className="border-b border-white/10 py-16" ref={nlRef}>
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                🚀 Recibe estrategias exclusivas de marketing digital
              </h3>
              <p className="text-blue-100 mb-8 text-lg">
                Tips semanales, casos de éxito y las últimas tendencias en IA aplicada al marketing
              </p>

              <div className="max-w-md mx-auto">
                <Newsletter variant="footer" />
              </div>
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
                      onClick={(e) => {
                        e.preventDefault();
                        (window as any)?.gtag?.('event', 'select_content', {
                          content_type: 'social',
                          item_id: social.name.toLowerCase(),
                          section: 'footer'
                        });
                        openExternalLink(social.url);
                      }}
                      data-cta={`footer_social_${social.name.toLowerCase()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Abrir ${social.name} en nueva pestaña`}
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
                        type="button"
                        onClick={() => {
                          (window as any)?.gtag?.('event', 'select_content', {
                            content_type: 'quicklink',
                            item_id: (link.id || link.name).toLowerCase().replace(/[^a-z0-9]+/g, '_'),
                            section: 'footer'
                          });
                          return link.id ? scrollToSection(link.id) : openExternalLink(link.url!);
                        }}
                        className="text-blue-100 hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block"
                        data-cta={`footer_quicklink_${(link.id || link.name).toLowerCase().replace(/[^a-z0-9]+/g,'_')}`}
                        aria-label={`Ir a ${link.name}`}
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
                        type="button"
                        onClick={() => {
                          (window as any)?.gtag?.('event', 'select_content', {
                            content_type: 'service_link',
                            item_id: service.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
                            section: 'footer'
                          });
                          scrollToSection('servicios');
                        }}
                        className="text-blue-100 hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block text-left"
                        data-cta={`footer_service_${service.toLowerCase().replace(/[^a-z0-9]+/g,'_')}`}
                        aria-label={`Ver servicio: ${service}`}
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
                      <a
                        href="mailto:hola@verticeagency.com"
                        className="hover:text-white transition-colors"
                        data-cta="footer_email"
                      >
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
                      <a
                        href="https://wa.me/51999999999"
                        className="hover:text-white transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cta="footer_whatsapp"
                        onClick={() => {
                          (window as any)?.gtag?.('event', 'whatsapp_click', {
                            location: 'footer'
                          });
                        }}
                      >
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
                  type="button"
                  onClick={() => {
                    (window as any)?.gtag?.('event', 'select_content', {
                      content_type: 'cta',
                      item_id: 'footer_auditoria'
                    });
                    scrollToSection('contact');
                  }}
                  className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
                  data-cta="footer_auditoria"
                  aria-label="Ir a la sección de contacto para solicitar Auditoría Gratuita"
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
                {['Política de Privacidad','Términos de Servicio','Cookies','Aviso Legal'].map((txt) => (
                  <a
                    key={txt}
                    href="#"
                    className="text-blue-200 hover:text-white transition-colors duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cta={`footer_policy_${txt.toLowerCase().replace(/[^a-z0-9]+/g,'_')}`}
                    onClick={(e) => {
                      e.preventDefault();
                      (window as any)?.gtag?.('event', 'select_content', {
                        content_type: 'policy',
                        item_id: txt.toLowerCase().replace(/[^a-z0-9]+/g,'_'),
                        section: 'footer'
                      });
                      // Cuando tengas URLs reales, reemplaza '#' y quita este return
                      return;
                    }}
                  >
                    {txt}
                  </a>
                ))}
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
});

Footer.displayName = 'Footer';
export default Footer;
