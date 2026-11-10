// src/config/site.ts — Datos globales del sitio (SEO, Open Graph y datos estructurados).
import { CONTACT_EMAIL, WHATSAPP_DISPLAY } from './contact';

export const SITE_URL = 'https://maastac.com';
export const SITE_NAME = 'MAASTAC';
export const SITE_LOCALE = 'es_PE';
export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/og-image-1200x630.jpg`,
  width: 1200,
  height: 630,
  alt: 'MAASTAC — Software · Automatización · IA',
};

/** Organización para JSON-LD. Solo datos reales y verificables (sin sameAs hasta tener perfiles confirmados). */
export const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/brand/maastac-icon-512.png`,
  email: CONTACT_EMAIL,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: WHATSAPP_DISPLAY.replace(/\s+/g, '-'),
    email: CONTACT_EMAIL,
    availableLanguage: ['es'],
    areaServed: 'PE',
  },
};

export const WEBSITE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  inLanguage: 'es',
  publisher: { '@id': `${SITE_URL}/#organization` },
};
