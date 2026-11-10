// src/seo/head.ts — Etiquetas <head> de cada página (las inserta scripts/prerender.mjs en el HTML estático).
// Así cada URL llega a buscadores y redes sociales con su propio título, descripción, canonical,
// Open Graph y datos estructurados, sin depender de que se ejecute JavaScript.
import { AREAS } from '../content/areas';
import { DEFAULT_OG_IMAGE, ORGANIZATION_JSONLD, SITE_LOCALE, SITE_NAME, SITE_URL, WEBSITE_JSONLD } from '../config/site';
import type { RouteDef } from '../routes';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** JSON dentro de <script>: se escapa "<" para que ningún texto pueda cerrar la etiqueta. */
const jsonLd = (data: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

export const canonicalUrl = (route: RouteDef) => `${SITE_URL}${route.path === '/' ? '/' : route.path}`;

function structuredData(route: RouteDef): unknown[] {
  if (route.kind === 'not-found') return [];
  const data: unknown[] = [];
  if (route.kind === 'home') data.push(ORGANIZATION_JSONLD, WEBSITE_JSONLD);

  if (route.breadcrumb) {
    data.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: route.breadcrumb, item: canonicalUrl(route) },
      ],
    });
  }

  if (route.kind === 'area') {
    const area = AREAS.find((a) => a.id === route.areaId);
    if (area) {
      data.push({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: area.name,
        description: area.seoDescription,
        serviceType: area.name,
        url: canonicalUrl(route),
        areaServed: { '@type': 'Country', name: 'Perú' },
        provider: { '@type': 'Organization', name: SITE_NAME, url: `${SITE_URL}/` },
      });
    }
  }
  return data;
}

/** HTML de las etiquetas <head> específicas de la página. */
export function renderHead(route: RouteDef): string {
  const url = canonicalUrl(route);
  const tags = [
    `<title>${esc(route.title)}</title>`,
    `<meta name="description" content="${esc(route.description)}" />`,
    `<meta name="robots" content="${esc(route.robots ?? 'index,follow')}" />`,
  ];
  // Sin canonical en páginas noindex (404 y borradores legales): señales contradictorias para Google.
  const indexable = !(route.robots ?? '').includes('noindex');
  if (indexable) tags.push(`<link rel="canonical" href="${esc(url)}" />`);

  tags.push(
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="${SITE_LOCALE}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(route.title)}" />`,
    `<meta property="og:description" content="${esc(route.description)}" />`,
    `<meta property="og:image" content="${DEFAULT_OG_IMAGE.url}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="${DEFAULT_OG_IMAGE.width}" />`,
    `<meta property="og:image:height" content="${DEFAULT_OG_IMAGE.height}" />`,
    `<meta property="og:image:alt" content="${esc(DEFAULT_OG_IMAGE.alt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(route.title)}" />`,
    `<meta name="twitter:description" content="${esc(route.description)}" />`,
    `<meta name="twitter:image" content="${DEFAULT_OG_IMAGE.url}" />`,
    `<meta name="twitter:image:alt" content="${esc(DEFAULT_OG_IMAGE.alt)}" />`,
  );

  for (const item of structuredData(route)) tags.push(jsonLd(item));
  return tags.join('\n    ');
}
