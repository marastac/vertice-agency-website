// src/components/Header.tsx — Navegación principal (multipágina, enlaces <a href> rastreables).
import { memo, useEffect, useRef, useState } from 'react';
import { ArrowRight, CaretDown, List, X } from 'phosphor-react';
import { AREAS } from '../content/areas';
import { gtagEvent } from '../utils/analytics';
import { trackContactClick } from '../utils/events';

// Logo MAASTAC (símbolo + palabra en blanco) para fondo oscuro. Proporción real 5:1 (800×160 / 1476×296).
const LOGO_SRC = '/brand/maastac-logo-horizontal-white-800.png';
const LOGO_SRC_2X = '/brand/maastac-logo-horizontal-white.png';

const NAV = [
  { name: 'Lead AI', href: '/lead-ai', id: 'lead_ai' },
  { name: 'Soluciones', href: '/soluciones', id: 'soluciones' },
  { name: 'Nosotros', href: '/nosotros', id: 'nosotros' },
  { name: 'Contacto', href: '/contacto', id: 'contacto' },
];

const trackNav = (itemId: string, source: string) =>
  gtagEvent('select_content', { content_type: 'nav', item_id: itemId, source });

const Header = memo(({ currentPath }: { currentPath: string }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  const isServicePage = AREAS.some((a) => a.path === currentPath);

  // GA4: vista del header (evento existente, se conserva).
  useEffect(() => {
    const node = headerRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) gtagEvent('view_header', { section: 'header', engagement_time_msec: 800 });
        }),
      { threshold: 0.3 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape cierra los menús; un clic fuera cierra el desplegable de servicios.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setServicesOpen(false);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setServicesOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, []);

  // Sin scroll del fondo con el menú móvil abierto.
  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileOpen]);

  const solid = scrolled || mobileOpen;
  const linkClass = (active: boolean) =>
    `rounded-lg px-3 py-2 text-[15px] font-medium transition-colors ${
      active ? 'text-white' : 'text-slate-300 hover:text-white'
    }`;

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        solid ? 'border-white/10 bg-ink/95 shadow-lg shadow-black/20 backdrop-blur' : 'border-transparent bg-ink/70 backdrop-blur'
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-ink"
      >
        Saltar al contenido
      </a>
      <div className="container">
        <div className="flex h-16 items-center justify-between gap-6 md:h-[72px]">
          <a href="/" className="shrink-0" aria-label="MAASTAC — inicio" data-cta="logo_home" onClick={() => trackNav('home', 'logo')}>
            <img
              src={LOGO_SRC}
              srcSet={`${LOGO_SRC} 800w, ${LOGO_SRC_2X} 1476w`}
              sizes="(min-width: 768px) 180px, 150px"
              alt="MAASTAC"
              width={800}
              height={160}
              className="h-[30px] w-auto select-none md:h-9"
              loading="eager"
              decoding="async"
            />
          </a>

          {/* Escritorio */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
            {/* Desplegable por clic (o Enter/Espacio): se cierra con Escape o al hacer clic fuera. */}
            <div ref={servicesRef} className="relative">
              <button
                type="button"
                className={`${linkClass(isServicePage)} inline-flex items-center gap-1.5`}
                aria-expanded={servicesOpen}
                aria-controls="menu-servicios"
                onClick={() => setServicesOpen((v) => !v)}
                data-cta="nav_servicios"
              >
                Servicios
                <CaretDown
                  size={14}
                  weight="bold"
                  className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              <div
                id="menu-servicios"
                className={`absolute left-1/2 top-full w-[420px] -translate-x-1/2 pt-3 ${servicesOpen ? 'block' : 'hidden'}`}
              >
                <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                  {AREAS.map((area) => (
                    <a
                      key={area.id}
                      href={area.path}
                      aria-current={currentPath === area.path ? 'page' : undefined}
                      className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50"
                      data-cta={`nav_${area.id}`}
                      onClick={() => trackNav(area.id, 'header_menu')}
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700" aria-hidden="true">
                        <area.Icon size={20} weight="duotone" />
                      </span>
                      <span>
                        <span className="block font-semibold text-slate-900">{area.name}</span>
                        <span className="block text-sm leading-snug text-slate-500">{area.summary}</span>
                      </span>
                    </a>
                  ))}
                  <a
                    href="/#servicios"
                    className="mt-1 flex items-center justify-between rounded-xl border-t border-slate-100 px-3 py-3 text-sm font-semibold text-blue-700 hover:bg-slate-50"
                    data-cta="nav_todos_servicios"
                    onClick={() => trackNav('servicios', 'header_menu')}
                  >
                    Ver los 7 servicios
                    <ArrowRight size={16} weight="bold" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={currentPath === item.href ? 'page' : undefined}
                className={linkClass(currentPath === item.href)}
                data-cta={`nav_${item.id}`}
                onClick={() => trackNav(item.id, 'header')}
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="/contacto"
              className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-[15px] font-semibold text-white shadow-sm transition-colors hover:from-blue-500 hover:to-violet-500 sm:inline-flex"
              data-cta="header_auditoria"
              onClick={() => trackContactClick('header_auditoria', 'header')}
            >
              Solicitar evaluación
            </a>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
              aria-controls="menu-movil"
              data-cta="header_mobile_toggle"
            >
              {mobileOpen ? <X size={24} aria-hidden="true" /> : <List size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Móvil */}
      <div
        id="menu-movil"
        className={`lg:hidden ${mobileOpen ? 'block' : 'hidden'} max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-ink`}
      >
        <nav className="container py-5" aria-label="Navegación móvil">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Servicios</p>
          <ul className="mb-4 space-y-1">
            {AREAS.map((area) => (
              <li key={area.id}>
                <a
                  href={area.path}
                  aria-current={currentPath === area.path ? 'page' : undefined}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium text-slate-100 hover:bg-white/5"
                  data-cta={`nav_${area.id}_mobile`}
                  onClick={() => trackNav(area.id, 'mobile')}
                >
                  <area.Icon size={20} weight="duotone" className="text-sky-300" aria-hidden="true" />
                  {area.name}
                </a>
              </li>
            ))}
          </ul>
          <ul className="space-y-1 border-t border-white/10 pt-4">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={currentPath === item.href ? 'page' : undefined}
                  className="block rounded-xl px-3 py-3 text-base font-medium text-slate-100 hover:bg-white/5"
                  data-cta={`nav_${item.id}_mobile`}
                  onClick={() => trackNav(item.id, 'mobile')}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/contacto"
            className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3.5 font-semibold text-white"
            data-cta="header_auditoria_mobile"
            onClick={() => trackContactClick('header_auditoria_mobile', 'mobile_menu')}
          >
            Solicitar evaluación gratuita
            <ArrowRight size={18} weight="bold" aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
export default Header;
