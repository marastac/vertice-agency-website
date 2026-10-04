// src/pages/legalContent.ts — Contenido de las páginas legales.
//
// ⚠️ BORRADORES (draft: true → noindex y fuera del sitemap). No son textos definitivos.
// Reglas de este archivo:
//   - Solo hechos técnicamente verificados en el código y decisiones confirmadas por MAASTAC.
//   - NO incluir ningún dato personal del responsable (nombre legal, DNI, RUC, domicilio…),
//     ni placeholders que parezcan datos reales. Lo pendiente se marca con `pending`.
//   - No inventar plazos de conservación, duraciones de cookies, jurisdicción ni condiciones de pago.
// TODO(ANTES DEL LANZAMIENTO COMERCIAL): completar las secciones `pending`, revisar los textos con
// asesoría legal y, entonces, poner draft: false y añadir las páginas al sitemap.
import { CONTACT_EMAIL, PRIVACY_EMAIL } from '../config/contact';

export type LegalKind = 'privacidad' | 'terminos' | 'cookies' | 'aviso-legal';

/** Texto con enlaces internos opcionales. */
export type Inline = string | { href: string; label: string };

export type Block =
  | { kind: 'p'; content: Inline[] }
  | { kind: 'ul'; items: Inline[][] }
  | { kind: 'cookie-table' }
  | { kind: 'cookie-settings-button' };

export interface LegalSection {
  id: string;
  heading: string;
  blocks: Block[];
  /** Si existe, la sección necesita información aún no disponible (se muestra como pendiente). */
  pending?: string;
}

export interface LegalPageDef {
  kind: LegalKind;
  path: string;
  title: string;
  draft: boolean;
  intro: Inline[];
  sections: LegalSection[];
}

const p = (...content: Inline[]): Block => ({ kind: 'p', content });
const ul = (...items: Inline[][]): Block => ({ kind: 'ul', items });
const link = (href: string, label: string): Inline => ({ href, label });

const PENDING_LAUNCH = 'a completar antes del lanzamiento comercial definitivo.';

// ---------------------------------------------------------------------------
// Política de Privacidad
// ---------------------------------------------------------------------------
const PRIVACIDAD: LegalPageDef = {
  kind: 'privacidad',
  path: '/privacidad',
  title: 'Política de Privacidad',
  draft: true,
  intro: [
    'Esta política explica qué datos personales tratamos cuando visitas maastac.com o nos envías una solicitud, para qué los usamos y qué derechos tienes.',
  ],
  sections: [
    {
      id: 'responsable',
      heading: '1. Responsable del tratamiento',
      blocks: [
        p('MAASTAC es el nombre comercial de un proyecto de servicios digitales gestionado actualmente por una persona natural con residencia en Perú. MAASTAC no está constituida todavía como empresa.'),
        p('Para cualquier cuestión sobre privacidad puedes escribir a ', PRIVACY_EMAIL, '.'),
      ],
      pending: `${PENDING_LAUNCH} Falta publicar los datos identificativos del responsable exigidos por la normativa aplicable.`,
    },
    {
      id: 'datos',
      heading: '2. Datos que tratamos',
      blocks: [
        p('Cuando nos envías el formulario de contacto tratamos:'),
        ul(
          ['Nombre, correo electrónico, servicio que te interesa y mensaje (obligatorios).'],
          ['Teléfono o WhatsApp y nombre de tu empresa o negocio (opcionales).'],
        ),
        p('Junto con el formulario se envían automáticamente algunos datos técnicos: la página desde la que lo envías, la fecha y hora, el tipo de navegador, la página de procedencia y, si existen, los parámetros de campaña de la URL (utm). El proveedor del formulario recibe además, como cualquier servidor web, tu dirección IP.'),
        p('Si aceptas las cookies analíticas o de marketing, se tratan además datos de navegación (ver apartado 5 y la ', link('/cookies', 'Política de Cookies'), ').'),
        p('Te pedimos que no incluyas en el mensaje datos sensibles ni datos de terceros que no sean necesarios.'),
      ],
    },
    {
      id: 'finalidad',
      heading: '3. Finalidad',
      blocks: [
        p('Usamos los datos del formulario únicamente para atender tu solicitud de información o evaluación y para responderte por el medio de contacto que nos indiques.'),
        p('No usamos los datos del formulario para enviarte newsletters ni comunicaciones publicitarias, ni para crear perfiles publicitarios.'),
        p('Enviar el formulario no supone ninguna contratación: es solo una solicitud de contacto. Ver los ', link('/terminos', 'Términos de Servicio'), '.'),
      ],
    },
    {
      id: 'base-juridica',
      heading: '4. Base jurídica',
      blocks: [
        ul(
          ['Formulario de contacto: tu solicitud y el tratamiento necesario para atenderla y responderte antes de cualquier posible contratación, así como tu consentimiento al enviarnos voluntariamente tus datos.'],
          ['Cookies analíticas y de marketing: tu consentimiento, que puedes retirar en cualquier momento.'],
          ['Almacenamiento estrictamente necesario (tu preferencia de cookies): necesario para que la web recuerde tu elección.'],
        ),
      ],
      pending: `${PENDING_LAUNCH} Revisar con asesoría legal la base jurídica concreta según la normativa aplicable (Perú y, para visitantes de la Unión Europea, el RGPD).`,
    },
    {
      id: 'destinatarios',
      heading: '5. Destinatarios y proveedores',
      blocks: [
        p('No vendemos tus datos. Para que la web funcione utilizamos proveedores que tratan datos por nuestra cuenta:'),
        ul(
          ['Formspree: recibe y nos entrega los mensajes del formulario de contacto.'],
          ['Vercel: alojamiento de la web; procesa los datos técnicos de cada visita (como la dirección IP).'],
          ['Namecheap: servicio de correo electrónico (reenvío) de las direcciones @maastac.com.'],
          ['Google (Google Analytics 4): solo si aceptas las cookies analíticas.'],
          ['Meta (Meta Pixel): solo si aceptas las cookies de marketing.'],
        ),
        p('Si nos contactas por WhatsApp o por correo electrónico, esa comunicación se rige además por las condiciones del servicio que elijas. Enlazar a WhatsApp no envía datos a WhatsApp hasta que pulsas el enlace.'),
      ],
    },
    {
      id: 'transferencias',
      heading: '6. Transferencias internacionales',
      blocks: [
        p('Algunos de los proveedores anteriores pueden tratar datos fuera de Perú y del Espacio Económico Europeo, por ejemplo en Estados Unidos.'),
      ],
      pending: `${PENDING_LAUNCH} Falta detallar, por proveedor, los países y las garantías aplicables a cada transferencia.`,
    },
    {
      id: 'conservacion',
      heading: '7. Conservación',
      blocks: [
        p('Conservaremos los datos del formulario el tiempo necesario para atender tu solicitud. Puedes pedirnos en cualquier momento que los eliminemos.'),
      ],
      pending: `${PENDING_LAUNCH} El plazo concreto de conservación de las solicitudes todavía no está definido.`,
    },
    {
      id: 'derechos',
      heading: '8. Tus derechos',
      blocks: [
        p('Puedes solicitar el acceso, la rectificación, la cancelación o supresión de tus datos y oponerte a su tratamiento. Si te encuentras en la Unión Europea puedes ejercer además los derechos de limitación y portabilidad. También puedes retirar en cualquier momento los consentimientos que hayas dado, sin que ello afecte a lo realizado antes de retirarlo.'),
        p('Para ejercerlos, escribe a ', PRIVACY_EMAIL, ' indicando qué derecho quieres ejercer.'),
        p('Si consideras que no hemos atendido correctamente tu solicitud, puedes presentar una reclamación ante la autoridad de protección de datos competente: en Perú, la Autoridad Nacional de Protección de Datos Personales; en la Unión Europea, la autoridad de control de tu país (en España, la Agencia Española de Protección de Datos).'),
      ],
    },
    {
      id: 'cookies',
      heading: '9. Cookies',
      blocks: [
        p('Google Analytics y Meta Pixel solo se cargan si los aceptas. Toda la información, y cómo cambiar tu elección, está en la ', link('/cookies', 'Política de Cookies'), '.'),
        { kind: 'cookie-settings-button' },
      ],
    },
    {
      id: 'seguridad',
      heading: '10. Seguridad',
      blocks: [
        p('La web se sirve mediante conexión cifrada (HTTPS) y aplica cabeceras de seguridad del navegador. Ningún sistema es completamente infalible, por lo que no podemos garantizar una seguridad absoluta.'),
      ],
    },
    {
      id: 'cambios',
      heading: '11. Cambios en esta política',
      blocks: [
        p('Podemos actualizar esta política cuando cambien nuestros servicios o la normativa. Publicaremos la versión vigente en esta página y, si el cambio afecta a las cookies, podremos pedirte de nuevo tu elección.'),
      ],
    },
    {
      id: 'contacto',
      heading: '12. Contacto de privacidad',
      blocks: [p('Para cualquier consulta sobre esta política: ', PRIVACY_EMAIL, '.')],
    },
  ],
};

// ---------------------------------------------------------------------------
// Política de Cookies
// ---------------------------------------------------------------------------
const COOKIES: LegalPageDef = {
  kind: 'cookies',
  path: '/cookies',
  title: 'Política de Cookies',
  draft: true,
  intro: [
    'Las cookies y tecnologías similares son pequeños datos que una web guarda en tu navegador. En maastac.com solo usamos almacenamiento estrictamente necesario de forma predeterminada; Google Analytics y Meta Pixel únicamente se cargan si los aceptas.',
  ],
  sections: [
    {
      id: 'tipos',
      heading: '1. Qué usamos y para qué',
      blocks: [
        ul(
          ['Necesarias: tu elección de cookies se guarda en maastac_consent, en el almacenamiento local (localStorage) del navegador; no es una cookie. Siempre activa.'],
          ['Analíticas (Google Analytics 4): estadísticas de uso de la web para mejorarla. Solo con tu consentimiento.'],
          ['Marketing (Meta Pixel): medición de campañas en Meta (Facebook / Instagram). Solo con tu consentimiento.'],
        ),
        p('Mientras no decidas, no se carga ningún script de Google Analytics ni de Meta y no se crean sus cookies.'),
      ],
    },
    {
      id: 'inventario',
      heading: '2. Cookies y almacenamiento utilizados',
      blocks: [
        { kind: 'cookie-table' },
        p('Las cookies de Google y de Meta solo se crean si aceptas la categoría correspondiente. Las duraciones indicadas son las máximas: se borran antes si retiras tu consentimiento o eliminas las cookies de tu navegador.'),
      ],
    },
    {
      id: 'gestion',
      heading: '3. Cómo aceptar, rechazar o configurar',
      blocks: [
        ul(
          ['Aceptar: pulsa «Aceptar todas» en el aviso de cookies.'],
          ['Rechazar: pulsa «Rechazar todas». La web funciona igual.'],
          ['Configurar: pulsa «Configurar» y activa solo las categorías que quieras; después pulsa «Guardar selección».'],
        ),
      ],
    },
    {
      id: 'modificar',
      heading: '4. Cómo modificar o retirar tu consentimiento',
      blocks: [
        p('Puedes cambiar tu elección en cualquier momento desde el enlace «Configurar cookies» del pie de página o desde este botón:'),
        { kind: 'cookie-settings-button' },
        p('Si retiras un consentimiento, eliminamos las cookies de Google Analytics o de Meta que nuestra web haya creado en este dominio y recargamos la página para que esos servicios dejen de funcionar. También puedes borrar las cookies y el almacenamiento desde la configuración de tu navegador.'),
      ],
    },
    {
      id: 'terceros',
      heading: '5. Cookies de terceros',
      blocks: [
        p('Si aceptas Meta Pixel, Meta puede además utilizar sus propias cookies en sus dominios (por ejemplo, si has iniciado sesión en Facebook o Instagram). Esas cookies las gestiona Meta según su propia política y no podemos eliminarlas desde nuestra web.'),
        p('Más información sobre cómo tratamos los datos en la ', link('/privacidad', 'Política de Privacidad'), '.'),
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Aviso Legal
// ---------------------------------------------------------------------------
const AVISO_LEGAL: LegalPageDef = {
  kind: 'aviso-legal',
  path: '/aviso-legal',
  title: 'Aviso Legal',
  draft: true,
  intro: ['Información general sobre el titular y el uso de maastac.com.'],
  sections: [
    {
      id: 'titular',
      heading: '1. Titular de la web',
      blocks: [
        p('MAASTAC es el nombre comercial de un proyecto de servicios digitales (automatización, desarrollo web e integraciones) gestionado actualmente por una persona natural con residencia en Perú. MAASTAC no está constituida todavía como empresa.'),
      ],
      pending: `${PENDING_LAUNCH} Falta publicar los datos identificativos del titular (nombre o denominación, identificación y domicilio) y, cuando exista, la información fiscal o registral.`,
    },
    {
      id: 'contacto',
      heading: '2. Contacto',
      blocks: [
        p('Correo electrónico: ', CONTACT_EMAIL, '.'),
        p('Para cuestiones de privacidad: ', PRIVACY_EMAIL, '.'),
      ],
    },
    {
      id: 'objeto',
      heading: '3. Objeto de la web',
      blocks: [
        p('maastac.com presenta los servicios de MAASTAC y permite solicitar información o una evaluación mediante el formulario de contacto. La web no permite contratar ni pagar servicios directamente.'),
      ],
    },
    {
      id: 'condiciones',
      heading: '4. Condiciones de uso',
      blocks: [
        p('El uso de la web y las solicitudes de servicios se rigen por los ', link('/terminos', 'Términos de Servicio'), '.'),
      ],
    },
    {
      id: 'propiedad',
      heading: '5. Propiedad intelectual',
      blocks: [
        p('Los textos, el diseño, los logotipos y el resto de contenidos de la web, así como los nombres comerciales MAASTAC y Lead AI, pertenecen a sus titulares. No está permitido reproducirlos ni utilizarlos con fines comerciales sin autorización previa.'),
      ],
    },
    {
      id: 'privacidad',
      heading: '6. Privacidad y cookies',
      blocks: [
        p('Consulta la ', link('/privacidad', 'Política de Privacidad'), ' y la ', link('/cookies', 'Política de Cookies'), '.'),
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Términos de Servicio
// ---------------------------------------------------------------------------
const TERMINOS: LegalPageDef = {
  kind: 'terminos',
  path: '/terminos',
  title: 'Términos de Servicio',
  draft: true,
  intro: ['Estas condiciones regulan el uso de maastac.com y las solicitudes de servicios que se realizan a través de la web.'],
  sections: [
    {
      id: 'objeto',
      heading: '1. Objeto',
      blocks: [
        p('MAASTAC ofrece servicios de desarrollo web orientado a negocio, automatización con IA, integración de sistemas y la solución Lead AI. La web presenta esos servicios y permite solicitar información o una evaluación.'),
      ],
    },
    {
      id: 'uso',
      heading: '2. Uso de la web',
      blocks: [
        p('Te comprometes a usar la web de forma lícita y a no enviar información falsa, contenido ilícito o comunicaciones masivas o automatizadas a través del formulario.'),
      ],
    },
    {
      id: 'solicitudes',
      heading: '3. Solicitudes de servicios',
      blocks: [
        ul(
          ['Enviar el formulario de contacto es únicamente una solicitud de contacto o evaluación.'],
          ['Enviar el formulario no supone la contratación de ningún servicio ni genera ninguna obligación de pago.'],
          ['La evaluación inicial es gratuita y sin compromiso.'],
          ['Cualquier contratación posterior quedará sujeta a la propuesta y a las condiciones que se te comuniquen y que aceptes expresamente.'],
        ),
      ],
    },
    {
      id: 'pagos',
      heading: '4. Precios y pagos',
      blocks: [
        p('Actualmente la web no permite comprar ni pagar servicios: no existe un proceso de pago en maastac.com. Los precios y las condiciones de pago se indicarán en cada propuesta.'),
      ],
    },
    {
      id: 'informacion',
      heading: '5. Información de la web',
      blocks: [
        p('La información sobre servicios es orientativa y puede cambiar. El alcance concreto de cada servicio se define en la propuesta correspondiente.'),
      ],
    },
    {
      id: 'propiedad',
      heading: '6. Propiedad intelectual',
      blocks: [
        p('Los contenidos de la web y los nombres comerciales MAASTAC y Lead AI no pueden reproducirse ni utilizarse con fines comerciales sin autorización previa.'),
      ],
    },
    {
      id: 'terceros',
      heading: '7. Enlaces y servicios de terceros',
      blocks: [
        p('La web puede enlazar a servicios de terceros, como WhatsApp. Su uso se rige por las condiciones de esos terceros.'),
      ],
    },
    {
      id: 'cambios',
      heading: '8. Cambios en estas condiciones',
      blocks: [p('Podemos actualizar estas condiciones. La versión vigente es la publicada en esta página.')],
    },
    {
      id: 'ley',
      heading: '9. Legislación aplicable y jurisdicción',
      blocks: [],
      pending: `${PENDING_LAUNCH} La legislación aplicable y la jurisdicción todavía no están definidas.`,
    },
    {
      id: 'contacto',
      heading: '10. Contacto',
      blocks: [p('Para cualquier consulta sobre estas condiciones: ', CONTACT_EMAIL, '.')],
    },
  ],
};

export const LEGAL_PAGES: LegalPageDef[] = [PRIVACIDAD, TERMINOS, COOKIES, AVISO_LEGAL];

// ---------------------------------------------------------------------------
// Inventario técnico de cookies (verificado en el código y en pruebas de navegador)
// ---------------------------------------------------------------------------
export interface CookieRow {
  name: string;
  type: string;
  provider: string;
  category: 'Necesaria' | 'Analítica' | 'Marketing';
  purpose: string;
  duration: string;
}

/**
 * Duraciones verificadas en navegador (build de producción, Edge/Chromium) y contrastadas con la
 * documentación de Google (_ga / _ga_<ID>: 2 años), Meta (_fbc: 90 días) y Chrome (límite de 400 días).
 */
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
    duration: 'Hasta 2 años según Google; en Chrome y Edge, 400 días (máximo que permiten estos navegadores). Se renueva en cada visita. Otros navegadores pueden aplicar límites más cortos.',
  },
  {
    name: '_ga_YN77ENMF5B',
    type: 'Cookie',
    provider: 'Google Analytics 4',
    category: 'Analítica',
    purpose: 'Mantener el estado de la sesión de Google Analytics.',
    duration: 'Hasta 2 años según Google; en Chrome y Edge, 400 días (máximo que permiten estos navegadores). Se renueva en cada visita. Otros navegadores pueden aplicar límites más cortos.',
  },
  {
    name: '_fbp',
    type: 'Cookie',
    provider: 'Meta Pixel',
    category: 'Marketing',
    purpose: 'Identificar el navegador para medir campañas de Meta.',
    duration: '90 días. Se renueva en cada visita.',
  },
  {
    name: '_fbc',
    type: 'Cookie',
    provider: 'Meta Pixel',
    category: 'Marketing',
    purpose: 'Guardar el identificador de clic cuando llegas a la web desde un enlace de Meta con el parámetro fbclid (por ejemplo, un anuncio). Solo se crea en ese caso y si has aceptado Marketing.',
    duration: '90 días.',
  },
];
