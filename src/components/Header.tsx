// src/components/Header.tsx
import { useState, useEffect, memo, useCallback, useRef } from 'react';

const LOGO_SRC = '/vertice-logo.png'; // coloca tu archivo en /public

const Header = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsMobileMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const original = document.body.style.overflow;
    if (isMobileMenuOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, [isMobileMenuOpen]);

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
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scrollToSection = useCallback((sectionId: string, source?: string) => {
    (window as any)?.gtag?.('event', 'select_content', {
      content_type: 'nav',
      item_id: sectionId,
      source: source || 'header'
    });
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: prefersNoMotion() ? 'auto' : 'smooth' });
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
    (window as any)?.gtag?.('event', 'select_content', {
      content_type: 'nav_toggle',
      item_id: 'mobile_menu',
      state: !isMobileMenuOpen ? 'open' : 'close'
    });
  }, [isMobileMenuOpen]);

  const navigationItems = [
    { name: 'Inicio', id: 'home', cta: 'nav_home' },
    { name: 'Servicios', id: 'servicios', cta: 'nav_servicios' },
    { name: 'Nosotros', id: 'nosotros', cta: 'nav_nosotros' },
    { name: 'Casos de Éxito', id: 'casos', cta: 'nav_casos' },
    { name: 'Contacto', id: 'contact', cta: 'nav_contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg' : 'bg-transparent'
      }`}
      aria-label="Barra de navegación principal"
    >
      <div className="container">
        <div className="flex items-center justify-between py-4">
          {/* Logo + Marca (sin subtítulo) */}
          <button
            type="button"
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => scrollToSection('home', 'logo')}
            aria-label="Ir al inicio"
            data-cta="logo_home"
          >
            <span className={`relative inline-flex items-center justify-center rounded-xl ${isScrolled ? 'shadow-md' : ''}`}>
              <img
                src={LOGO_SRC}
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 select-none will-change-transform transition-transform duration-300 group-hover:scale-105 group-active:scale-95"
                loading="eager"
                decoding="async"
              />
            </span>
            <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vértice Agency
            </div>
          </button>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Navegación principal">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="relative px-4 py-2 font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 focus-visible:outline-none"
                data-cta={item.cta}
                aria-label={`Ir a ${item.name}`}
              >
                {item.name}
                <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-0.5 scale-x-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-transform duration-300 hover:scale-x-100" />
              </button>
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:block">
            <button
              type="button"
              onClick={() => {
                (window as any)?.gtag?.('event', 'select_content', {
                  content_type: 'cta',
                  item_id: 'header_auditoria'
                });
                scrollToSection('contact', 'header_cta');
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              data-cta="header_auditoria"
              aria-label="Ir a Contacto para solicitar Auditoría Gratuita"
            >
              Auditoría Gratuita
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            data-cta="header_mobile_toggle"
          >
            <div className={`w-6 h-0.5 bg-gray-600 mb-1.5 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-gray-600 mb-1.5 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-gray-600 transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          ref={menuRef}
          className={`lg:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}
        >
          <nav className="flex flex-col space-y-4 pt-4 border-t border-gray-200" aria-label="Navegación móvil">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id, 'mobile')}
                className="text-left text-gray-700 hover:text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-all duration-300"
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
                  item_id: 'header_auditoria_mobile'
                });
                scrollToSection('contact', 'mobile_cta');
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 mx-4 mt-4"
              data-cta="header_auditoria_mobile"
              aria-label="Ir a Contacto para solicitar Auditoría Gratuita"
            >
              Auditoría Gratuita
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
export default Header;
