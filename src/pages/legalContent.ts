// src/pages/legalContent.ts — Estructura de las páginas legales.
//
// ⚠️ BORRADORES INTERNOS: NO son textos legales definitivos ni están listos para producción.
// No contienen datos del titular (nombre legal, DNI/RUC/NIF, domicilio, representante UE, plazos…)
// porque todavía no están confirmados. Mientras `draft` sea true se publican con noindex.
// Solo se incluyen hechos técnicos verificados en el código (inventario de cookies, datos del formulario).

export type LegalKind = 'privacidad' | 'terminos' | 'cookies' | 'aviso-legal';

export interface LegalPageDef {
  kind: LegalKind;
  path: string;
  title: string;
  draft: boolean;
  /** Apartados previstos; el contenido definitivo se redactará con los datos legales confirmados. */
  pendingSections: string[];
}

export const LEGAL_PAGES: LegalPageDef[] = [
  {
    kind: 'privacidad',
    path: '/privacidad',
    title: 'Política de Privacidad',
    draft: true,
    pendingSections: [
      'Responsable del tratamiento',
      'Datos que tratamos',
      'Finalidades',
      'Base jurídica',
      'Destinatarios y encargados del tratamiento',
      'Transferencias internacionales',
      'Plazos de conservación',
      'Derechos de las personas usuarias y cómo ejercerlos',
      'Reclamaciones ante la autoridad de control',
    ],
  },
  {
    kind: 'terminos',
    path: '/terminos',
    title: 'Términos de Servicio',
    draft: true,
    pendingSections: [
      'Objeto y ámbito',
      'Uso de la web',
      'Servicios y contratación',
      'Propiedad intelectual',
      'Responsabilidad',
      'Legislación aplicable y jurisdicción',
    ],
  },
  {
    kind: 'cookies',
    path: '/cookies',
    title: 'Política de Cookies',
    draft: true,
    pendingSections: ['Responsable', 'Duraciones verificadas de cada cookie', 'Transferencias internacionales'],
  },
  {
    kind: 'aviso-legal',
    path: '/aviso-legal',
    title: 'Aviso Legal',
    draft: true,
    pendingSections: [
      'Titular de la web (nombre legal o razón social)',
      'Identificación fiscal',
      'Domicilio',
      'Contacto',
      'Datos registrales (si corresponde)',
      'Condiciones de uso',
    ],
  },
];

export interface CookieRow {
  name: string;
  type: string;
  provider: string;
  category: 'Necesaria' | 'Analítica' | 'Marketing';
  purpose: string;
  duration: string;
}

/** Inventario técnico real (auditoría del código). Duraciones pendientes de verificar en navegador. */
export const COOKIE_INVENTORY: CookieRow[] = [
  {
    name: 'maastac_consent',
    type: 'Almacenamiento local (localStorage)',
    provider: 'MAASTAC (propia)',
    category: 'Necesaria',
    purpose: 'Guardar tu elección de cookies.',
    duration: 'Hasta que la cambies o borres los datos del navegador',
  },
  {
    name: '_ga',
    type: 'Cookie',
    provider: 'Google Analytics 4',
    category: 'Analítica',
    purpose: 'Distinguir visitantes para elaborar estadísticas de uso.',
    duration: 'Pendiente de verificar',
  },
  {
    name: '_ga_YN77ENMF5B',
    type: 'Cookie',
    provider: 'Google Analytics 4',
    category: 'Analítica',
    purpose: 'Mantener el estado de la sesión de Google Analytics.',
    duration: 'Pendiente de verificar',
  },
  {
    name: '_fbp',
    type: 'Cookie',
    provider: 'Meta Pixel',
    category: 'Marketing',
    purpose: 'Identificar el navegador para medir campañas de Meta.',
    duration: 'Pendiente de verificar',
  },
  {
    name: '_fbc',
    type: 'Cookie',
    provider: 'Meta Pixel',
    category: 'Marketing',
    purpose: 'Guardar el identificador de clic cuando se llega desde un anuncio de Meta (parámetro fbclid).',
    duration: 'Pendiente de verificar',
  },
];
