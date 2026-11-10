// src/routes.ts — Mapa de páginas de la web (fuente única para la navegación, el prerender, el SEO y el sitemap).
//
// La web es multipágina SIN router de cliente: cada URL es un HTML prerenderizado en el build
// (scripts/prerender.mjs) y los enlaces internos son <a href> normales (rastreables y sin JavaScript).
// Las URL que no están aquí reciben un 404 real (dist/404.html) en Vercel.
import type { ServiceAreaId } from './config/services';
import { AREAS } from './content/areas';
import { LEGAL_PAGES } from './pages/legalContent';

export type PageKind = 'home' | 'area' | 'lead-ai' | 'about' | 'contact' | 'solutions' | 'legal' | 'not-found';

export interface RouteDef {
  path: string;
  kind: PageKind;
  areaId?: ServiceAreaId;
  title: string;
  description: string;
  /** Si se indica, se publica como <meta name="robots">. Por defecto index,follow. */
  robots?: string;
  inSitemap: boolean;
  /** Nombre en las migas de pan (BreadcrumbList). */
  breadcrumb?: string;
}

export const ROUTES: RouteDef[] = [
  {
    path: '/',
    kind: 'home',
    title: 'MAASTAC | Software a medida, automatización e IA para empresas',
    description:
      'Desarrollamos software a medida, automatizamos procesos, integramos tus herramientas y aplicamos IA a tu negocio. Agencia tecnológica en Perú. Evaluación inicial gratuita.',
    inSitemap: true,
  },
  ...AREAS.map(
    (area): RouteDef => ({
      path: area.path,
      kind: 'area',
      areaId: area.id,
      title: area.seoTitle,
      description: area.seoDescription,
      inSitemap: true,
      breadcrumb: area.name,
    }),
  ),
  {
    path: '/lead-ai',
    kind: 'lead-ai',
    title: 'Lead AI: captación y calificación de prospectos con IA | MAASTAC',
    description:
      'Lead AI es el producto propio de MAASTAC para captar y calificar prospectos con formularios con puntuación, un asistente de chat con IA, un panel de leads e integración con HubSpot.',
    inSitemap: true,
    breadcrumb: 'Lead AI',
  },
  {
    path: '/soluciones',
    kind: 'solutions',
    title: 'Soluciones y proyectos propios | MAASTAC',
    description:
      'Proyectos propios de MAASTAC: Lead AI, su integración con HubSpot y esta web. Tecnologías con las que trabajamos, sin casos ni cifras inventadas.',
    inSitemap: true,
    breadcrumb: 'Soluciones',
  },
  {
    path: '/nosotros',
    kind: 'about',
    title: 'Nosotros: quiénes somos y cómo trabajamos | MAASTAC',
    description:
      'MAASTAC es una agencia tecnológica de Perú. Hablas directamente con quien diseña y construye tu solución, con alcance claro y entregas que puedes revisar.',
    inSitemap: true,
    breadcrumb: 'Nosotros',
  },
  {
    path: '/contacto',
    kind: 'contact',
    title: 'Contacto: solicita una evaluación gratuita | MAASTAC',
    description:
      'Cuéntanos qué quieres construir, automatizar o integrar. Evaluación inicial gratuita y sin compromiso por formulario, WhatsApp o email.',
    inSitemap: true,
    breadcrumb: 'Contacto',
  },
  ...LEGAL_PAGES.map(
    (page): RouteDef => ({
      path: page.path,
      kind: 'legal',
      title: `${page.title} | MAASTAC`,
      description: `${page.title} de MAASTAC.`,
      // Borradores: noindex y fuera del sitemap (vercel.json además envía X-Robots-Tag).
      robots: page.draft ? 'noindex,follow' : undefined,
      inSitemap: !page.draft,
      breadcrumb: page.title,
    }),
  ),
];

export const NOT_FOUND_ROUTE: RouteDef = {
  path: '/404',
  kind: 'not-found',
  title: 'Página no encontrada | MAASTAC',
  description: 'La página que buscas no existe o fue movida.',
  robots: 'noindex',
  inSitemap: false,
};

/** Ruta sin barra final ni index.html ("/nosotros/" → "/nosotros"). */
export const normalizePath = (pathname: string): string => {
  const p = pathname.replace(/\/index\.html$/, '').replace(/\/+$/, '');
  return p === '' ? '/' : p;
};

export const matchRoute = (pathname: string): RouteDef =>
  ROUTES.find((r) => r.path === normalizePath(pathname)) ?? NOT_FOUND_ROUTE;

/** Anclas antiguas de la home que siguen funcionando (enlaces ya publicados o compartidos). */
export const HASH_ALIASES: Record<string, string> = {
  services: 'servicios',
  contacto: 'contact',
  about: 'nosotros',
  'lead_ai': 'lead-ai',
  leadai: 'lead-ai',
  proceso: 'como-trabajamos',
};
