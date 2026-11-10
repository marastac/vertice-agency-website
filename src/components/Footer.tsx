// src/components/Footer.tsx — Pie de página con enlaces rastreables a todas las páginas.
import { memo } from 'react';
import { EnvelopeSimple, MapPin, WhatsappLogo } from 'phosphor-react';
import { CONTACT_EMAIL, WHATSAPP_DISPLAY, whatsappUrl } from '../config/contact';
import { openCookieSettings } from '../consent/consent';
import { AREAS } from '../content/areas';
import { gtagEvent } from '../utils/analytics';
import { trackContactClick, trackEmailClick, trackWhatsAppClick } from '../utils/events';

// Redes sociales: se añadirán cuando existan perfiles reales (no mostrar enlaces vacíos).
// TODO(ANTES DEL LANZAMIENTO): las páginas legales siguen siendo borradores (noindex) hasta su revisión legal.
const LEGAL_LINKS = [
  { txt: 'Política de Privacidad', href: '/privacidad' },
  { txt: 'Términos de Servicio', href: '/terminos' },
  { txt: 'Cookies', href: '/cookies' },
  { txt: 'Aviso Legal', href: '/aviso-legal' },
];

const COMPANY_LINKS = [
  { name: 'Lead AI', href: '/lead-ai' },
  { name: 'Soluciones', href: '/soluciones' },
  { name: 'Cómo trabajamos', href: '/#como-trabajamos' },
  { name: 'Nosotros', href: '/nosotros' },
  { name: 'Contacto', href: '/contacto' },
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_');
const trackFooter = (contentType: string, itemId: string) =>
  gtagEvent('select_content', { content_type: contentType, item_id: itemId, section: 'footer' });

const linkClass = 'text-slate-400 transition-colors hover:text-white';

const Footer = memo(() => {
  return (
    <footer className="bg-ink text-white" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Pie de página
      </h2>
      <div className="container py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <img
              src="/brand/maastac-logo-horizontal-white-800.png"
              srcSet="/brand/maastac-logo-horizontal-white-800.png 800w, /brand/maastac-logo-horizontal-white.png 1476w"
              sizes="200px"
              alt="MAASTAC"
              width={800}
              height={160}
              loading="lazy"
              decoding="async"
              className="mb-5 h-9 w-auto select-none"
            />
            <p className="max-w-sm leading-relaxed text-slate-400">
              Agencia tecnológica B2B. Desarrollamos software a medida, automatizamos procesos, integramos herramientas y
              aplicamos inteligencia artificial a problemas reales de negocio.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-slate-400">
              <MapPin size={16} weight="duotone" className="text-sky-300" aria-hidden="true" />
              Lima, Perú · atención remota
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">Servicios</h3>
            <ul className="space-y-3">
              {AREAS.map((area) => (
                <li key={area.id}>
                  <a
                    href={area.path}
                    className={linkClass}
                    data-cta={`footer_service_${area.id}`}
                    onClick={() => trackFooter('service_link', area.id)}
                  >
                    {area.name}
                  </a>
                </li>
              ))}
              <li>
                <a href="/#servicios" className={linkClass} data-cta="footer_service_todos" onClick={() => trackFooter('service_link', 'todos')}>
                  Todos los servicios
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">Empresa</h3>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={linkClass}
                    data-cta={`footer_quicklink_${slug(link.name)}`}
                    onClick={() => trackFooter('quicklink', slug(link.name))}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">Contacto</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-slate-300 transition-colors hover:text-white"
                  data-cta="footer_whatsapp"
                  onClick={() => trackWhatsAppClick('footer')}
                >
                  <WhatsappLogo size={18} weight="duotone" className="text-emerald-300" aria-hidden="true" />
                  {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2.5 break-all text-slate-300 transition-colors hover:text-white"
                  data-cta="footer_email"
                  onClick={() => trackEmailClick('footer')}
                >
                  <EnvelopeSimple size={18} weight="duotone" className="text-sky-300" aria-hidden="true" />
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
            <a
              href="/contacto"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 font-semibold text-white transition-colors hover:from-blue-500 hover:to-violet-500"
              data-cta="footer_auditoria"
              onClick={() => trackContactClick('footer_auditoria', 'footer')}
            >
              Solicitar evaluación gratuita
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-4 py-6 text-sm md:flex-row md:items-center md:justify-between">
          <p className="text-slate-500">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> MAASTAC. Todos los derechos reservados.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_LINKS.map(({ txt, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-slate-500 transition-colors hover:text-white"
                  data-cta={`footer_policy_${slug(txt)}`}
                  onClick={() => trackFooter('policy', slug(txt))}
                >
                  {txt}
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={openCookieSettings}
                className="text-slate-500 transition-colors hover:text-white"
                data-cta="footer_cookie_settings"
              >
                Configurar cookies
              </button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
export default Footer;
