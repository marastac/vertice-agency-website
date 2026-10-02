// src/components/Header.tsx
import { useState, useEffect, memo, useCallback, useRef } from 'react';
import { Rocket } from 'phosphor-react';

// Logo MAASTAC (símbolo + palabra en blanco), pensado para fondos oscuros. Proporción real 5:1 (800×160 / 1476×296).
const LOGO_SRC = '/brand/maastac-logo-horizontal-white-800.png';
const LOGO_SRC_2X = '/brand/maastac-logo-horizontal-white.png';

const Header = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  /* === GA4: Detecta vista del header === */
  useEffect(() => {
    const node = headerRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (window as any)?.gtag?.('event', 'view_header', {
              section: 'header',
              engagement_time_msec: 800,
            });
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  /* === Scroll effect === */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* === Escape key close === */
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isMobileMenuOpen]);

  /* === Prevent scroll behind menu === */
  useEffect(() => {
    const original = document.body.style.overflow;
    if (isMobileMenuOpen) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isMobileMenuOpen]);

  /* === Click outside menu === */
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [isMobileMenuOpen]);

  const prefersNoMotion = () =>
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scrollToSection = useCallback((sectionId: string, source?: string) => {
    (window as any)?.gtag?.('event', 'select_content', {
      content_type: 'nav',
      item_id: sectionId,
      source: source || 'header',
    });
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: prefersNoMotion() ? 'auto' : 'smooth' });
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
    (window as any)?.gtag?.('event', 'select_content', {
      content_type: 'nav_toggle',
      item_id: 'mobile_menu',
      state: !isMobileMenuOpen ? 'open' : 'close',
    });
  }, [isMobileMenuOpen]);

  const navigationItems = [
    { name: 'Servicios', id: 'servicios', cta: 'nav_servicios' },
    { name: 'Lead AI', id: 'lead-ai', cta: 'nav_lead_ai' },
    { name: 'Cómo trabajamos', id: 'como-trabajamos', cta: 'nav_como_trabajamos' },
    { name: 'Nosotros', id: 'nosotros', cta: 'nav_nosotros' },
    { name: 'Contacto', id: 'contact', cta: 'nav_contact' },
  ];

  // === Visual classes ===
  // El logo MAASTAC es blanco y está pensado para fondos oscuros, así que el header siempre lleva
  // el fondo oscuro translúcido (algo más transparente arriba del Hero) y los enlaces en claro.
  // Con scroll o con el menú móvil abierto se usa la versión más sólida.
  const solid = isScrolled || isMobileMenuOpen;

  const headerBg = solid
    ? 'bg-gradient-to-r from-gray-900/90 to-blue-900/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-white/10 shadow-xl'
    : 'bg-gradient-to-r from-gray-900/60 to-blue-900/60 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-white/10';

  const linkBase = 'text-white/90 hover:text-white';

  const underlineClass = 'from-white to-white';

  const burgerBar = 'bg-white';

  const mobileLink = 'text-white/90 hover:text-white hover:bg-white/10';

  const mobileSectionBorder = 'border-white/10';

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
      aria-label="Barra de navegación principal"
    >
      <div className="container">
        <div className="flex items-center justify-between py-4">
          {/* Logo (incluye la palabra MAASTAC) */}
          <button
            type="button"
            className="flex items-center cursor-pointer group shrink-0"
            onClick={() => scrollToSection('home', 'logo')}
            aria-label="MAASTAC — ir al inicio"
            data-cta="logo_home"
          >
            <img
              src={LOGO_SRC}
              srcSet={`${LOGO_SRC} 800w, ${LOGO_SRC_2X} 1476w`}
              sizes="(min-width: 768px) 200px, 160px"
              alt="MAASTAC"
              width={800}
              height={160}
              className="h-8 md:h-10 w-auto select-none transition-transform duration-300 group-hover:scale-105 group-active:scale-95"
              loading="eager"
              decoding="async"
            />
          </button>

          {/* Navigation - Desktop */}
          <nav
            className="hidden xl:flex items-center space-x-1"
            aria-label="Navegación principal"
          >
            {navigationItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`relative px-3 py-2 font-semibold whitespace-nowrap transition-all duration-300 focus-visible:outline-none ${linkBase}`}
                data-cta={item.cta}
                aria-label={`Ir a ${item.name}`}
              >
                {item.name}
                <span
                  className={`pointer-events-none absolute inset-x-3 -bottom-0.5 h-0.5 scale-x-0 rounded-full bg-gradient-to-r ${underlineClass} transition-transform duration-300 group-hover:scale-x-100`}
                />
              </button>
            ))}
          </nav>

          {/* CTA - Desktop */}
          <div className="hidden xl:block">
            <button
              type="button"
              onClick={() => {
                (window as any)?.gtag?.('event', 'select_content', {
                  content_type: 'cta',
                  item_id: 'header_auditoria',
                });
                scrollToSection('contact', 'header_cta');
              }}
              className="flex items-center gap-2 whitespace-nowrap bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              data-cta="header_auditoria"
              aria-label="Ir a Contacto para solicitar una evaluación gratuita"
            >
              <Rocket size={18} weight="duotone" aria-hidden="true" />
              Solicitar evaluación
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="xl:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            data-cta="header_mobile_toggle"
          >
            <div
              className={`w-6 h-0.5 ${burgerBar} mb-1.5 transition-transform duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 ${burgerBar} mb-1.5 transition-opacity duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 ${burgerBar} transition-transform duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            ></div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          ref={menuRef}
          className={`xl:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 pb-6' : 'max-h-0'
          }`}
        >
          <nav
            className={`flex flex-col space-y-4 pt-4 border-t ${mobileSectionBorder} ${
              solid ? 'text-white/90' : ''
            }`}
            aria-label="Navegación móvil"
          >
            {navigationItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id, 'mobile')}
                className={`text-left font-semibold py-2 px-4 rounded-lg transition-all duration-300 ${mobileLink}`}
                data-cta={`${item.cta}_mobile`}
                aria-label={`Ir a ${item.name}`}
              >
                {item.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                (window as any)?.gtag?.('event', 'select_content', {
                  content_type: 'cta',
                  item_id: 'header_auditoria_mobile',
                });
                scrollToSection('contact', 'mobile_cta');
              }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 mx-4 mt-4"
              data-cta="header_auditoria_mobile"
              aria-label="Ir a Contacto para solicitar una evaluación gratuita"
            >
              <Rocket size={18} weight="duotone" aria-hidden="true" />
              Solicitar evaluación
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
export default Header;
