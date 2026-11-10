// src/components/ui/CtaLink.tsx — Botón-enlace común de la web (CTAs).
// Es un <a href> normal: funciona sin JavaScript y los buscadores lo siguen.
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { trackContactClick } from '../../utils/events';

type Variant = 'primary' | 'secondary' | 'light' | 'outline-light';
type Size = 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  // Acción principal: degradado de marca azul → violeta.
  primary:
    'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-sm shadow-blue-900/20 hover:from-blue-500 hover:to-violet-500 hover:shadow-md',
  // Acción secundaria sobre fondo claro.
  secondary: 'border border-slate-300 bg-white text-slate-800 hover:border-blue-300 hover:text-blue-700',
  // Sobre fondo oscuro: botón claro.
  light: 'bg-white text-ink shadow-sm hover:bg-blue-50',
  // Sobre fondo oscuro: secundaria con borde.
  'outline-light': 'border border-white/25 bg-white/5 text-white hover:border-white/50 hover:bg-white/10',
};

const SIZES: Record<Size, string> = {
  md: 'px-5 py-3 text-[15px]',
  lg: 'px-6 py-3.5 text-base',
};

export interface CtaLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** Identificador del CTA (data-cta) para la analítica. */
  cta: string;
  variant?: Variant;
  size?: Size;
  /** Si lleva al contacto, se registra `contact_click` (solo con consentimiento analítico). */
  contactIntent?: boolean;
  /** Ubicación del CTA para la analítica (p. ej. "hero", "header"). */
  location?: string;
  children: ReactNode;
}

export function CtaLink({
  href,
  cta,
  variant = 'primary',
  size = 'md',
  contactIntent = false,
  location = 'page',
  className = '',
  onClick,
  children,
  ...rest
}: CtaLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (contactIntent) trackContactClick(cta, location);
    onClick?.(e);
  };

  return (
    <a
      href={href}
      data-cta={cta}
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-200 motion-safe:transition-all ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}
