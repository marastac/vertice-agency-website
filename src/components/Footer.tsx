// src/components/Footer.tsx
import { memo, useCallback } from 'react';
import { CONTACT_EMAIL, WHATSAPP_DISPLAY, whatsappUrl } from '../config/contact';

// Mejora visual: íconos Phosphor consistentes (reemplazan emojis)
import {
  EnvelopeSimple,
  DeviceMobile,
  GlobeHemisphereWest,
  Heart,
} from 'phosphor-react';

// Redes sociales: se añadirán cuando existan perfiles reales (no mostrar enlaces vacíos).

const Footer = memo(() => {
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const currentYear = new Date().getFullYear();

  const services = [
    { name: 'Web & Conversión', id: 'servicios' },
    { name: 'Automatización & IA', id: 'servicios' },
    { name: 'Sistemas & Integraciones', id: 'servicios' },
    { name: 'Lead AI', id: 'lead-ai' },
  ];

  const quickLinks = [
    { name: 'Servicios', id: 'servicios' },
    { name: 'Cómo trabajamos', id: 'como-trabajamos' },
    { name: 'Capacidades', id: 'capacidades' },
    { name: 'Nosotros', id: 'nosotros' },
    { name: 'Contacto', id: 'contact' },
  ];

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
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {/* Logo y descripción */}
              <div className="lg:col-span-2">
                {/* Logo MAASTAC (blanco, sobre el fondo oscuro del footer). Proporción real 5:1 (800×160 / 1476×296). */}
                <img
                  src="/brand/maastac-logo-horizontal-white-800.png"
                  srcSet="/brand/maastac-logo-horizontal-white-800.png 800w, /brand/maastac-logo-horizontal-white.png 1476w"
                  sizes="(min-width: 768px) 240px, 200px"
                  alt="MAASTAC"
                  width={800}
                  height={160}
                  loading="lazy"
                  decoding="async"
                  className="h-10 md:h-12 w-auto max-w-full mb-6 select-none"
                />
                <p className="text-blue-100 mb-6 max-w-md leading-relaxed">
                  Automatización, desarrollo web e integraciones para empresas y negocios digitales. Construimos sistemas
                  que reducen el trabajo manual y ayudan a captar y gestionar clientes.
                </p>

                {/* Áreas (sustituye a los badges de certificaciones, que no tenemos) */}
                <div className="flex flex-wrap gap-3">
                  {['Automatización', 'Desarrollo web', 'Integraciones'].map((area) => (
                    <div key={area} className="bg-white/10 px-3 py-2 rounded-lg text-xs font-semibold backdrop-blur-sm">
                      {area}
                    </div>
                  ))}
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
                            item_id: link.id.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
                            section: 'footer',
                          });
                          scrollToSection(link.id);
                        }}
                        className="text-blue-100 hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block"
                        data-cta={`footer_quicklink_${link.id.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`}
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
                    <li key={service.name}>
                      <button
                        type="button"
                        onClick={() => {
                          (window as any)?.gtag?.('event', 'select_content', {
                            content_type: 'service_link',
                            item_id: service.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
                            section: 'footer',
                          });
                          scrollToSection(service.id);
                        }}
                        className="text-blue-100 hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block text-left"
                        data-cta={`footer_service_${service.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`}
                        aria-label={`Ver servicio: ${service.name}`}
                      >
                        {service.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contacto */}
              <div>
                <h3 className="text-lg font-bold mb-6 text-white">Contacto</h3>
                <ul className="space-y-4">
                  {/* Email */}
                  <li className="flex items-start gap-3 text-blue-100">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      {/* Mejora visual: ícono de sobre (Phosphor) */}
                      <EnvelopeSimple size={16} weight="duotone" color="#FFFFFF" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Email</div>
                      {/* TODO(ANTES DEL DEPLOY DE LANZAMIENTO): email y WhatsApp provisionales → src/config/contact.ts */}
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="hover:text-white transition-colors break-words"
                        data-cta="footer_email"
                      >
                        {CONTACT_EMAIL}
                      </a>
                    </div>
                  </li>

                  {/* WhatsApp */}
                  <li className="flex items-start gap-3 text-blue-100">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      {/* Mejora visual: ícono de móvil (Phosphor) */}
                      <DeviceMobile size={16} weight="duotone" color="#FFFFFF" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">WhatsApp</div>
                      <a
                        href={whatsappUrl()}
                        className="hover:text-white transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cta="footer_whatsapp"
                        onClick={() => {
                          (window as any)?.gtag?.('event', 'whatsapp_click', {
                            location: 'footer',
                          });
                        }}
                      >
                        {WHATSAPP_DISPLAY}
                      </a>
                    </div>
                  </li>

                  {/* Cobertura */}
                  <li className="flex items-start gap-3 text-blue-100">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      {/* Mejora visual: ícono de globo (Phosphor) */}
                      <GlobeHemisphereWest size={16} weight="duotone" color="#FFFFFF" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Atención remota</div>
                      <span>Perú · España · Estados Unidos</span>
                    </div>
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={() => {
                    (window as any)?.gtag?.('event', 'select_content', {
                      content_type: 'cta',
                      item_id: 'footer_auditoria',
                    });
                    scrollToSection('contact');
                  }}
                  className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
                  data-cta="footer_auditoria"
                  aria-label="Ir a la sección de contacto para solicitar una evaluación gratuita"
                >
                  Solicitar evaluación
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
                © {currentYear} MAASTAC. Todos los derechos reservados.
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                {['Política de Privacidad','Términos de Servicio','Cookies','Aviso Legal'].map((txt) => (
                  <a
                    key={txt}
                    // TODO(ANTES DEL LANZAMIENTO): enlaces legales pendientes (Privacidad, Términos, Cookies,
                    // Aviso Legal) + consentimiento de cookies para España/UE. No inventar textos legales.
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
                        section: 'footer',
                      });
                      // Cuando tengas URLs reales, reemplaza '#' y quita este return
                      return;
                    }}
                  >
                    {txt}
                  </a>
                ))}
              </div>

              <div className="text-blue-200 text-sm inline-flex items-center gap-2 whitespace-nowrap">
                Hecho con
                {/* Mejora visual: corazón Phosphor en lugar de emoji */}
                <Heart size={16} weight="duotone" className="text-pink-300" aria-hidden="true" />
                por MAASTAC
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
