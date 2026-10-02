// src/config/contact.ts — Datos de contacto centralizados (único lugar a modificar).
//
// ⚠️ TODO(ANTES DEL DEPLOY DE LANZAMIENTO): el WhatsApp sigue siendo PROVISIONAL.
//   - WHATSAPP: +51 999 999 999 es un PLACEHOLDER, no un número real. Sustituir por el número
//     empresarial definitivo (formato internacional sin "+" ni espacios en WHATSAPP_NUMBER).
//   - EMAIL: hola@maastac.com es el correo público oficial (reenvío configurado en Namecheap).
//     No publicar nunca aquí la dirección de destino del reenvío.

/** Número para enlaces wa.me: solo dígitos con prefijo de país (sin "+", sin espacios). */
export const WHATSAPP_NUMBER = '51999999999'; // TODO(ANTES DEL DEPLOY DE LANZAMIENTO): número definitivo

/** Número tal como se muestra en la web. */
export const WHATSAPP_DISPLAY = '+51 999 999 999'; // TODO(ANTES DEL DEPLOY DE LANZAMIENTO): número definitivo

/** Correo de contacto público. */
export const CONTACT_EMAIL = 'hola@maastac.com';

/**
 * Correo PREVISTO para consultas y derechos de privacidad (se muestra en /privacidad).
 * TODO(ANTES DEL LANZAMIENTO): crear y verificar el alias/reenvío de privacidad@maastac.com
 * (todavía no está configurado). No publicar nunca la dirección de destino del reenvío.
 */
export const PRIVACY_EMAIL = 'privacidad@maastac.com';

/** Construye el enlace de WhatsApp con un mensaje predefinido opcional. */
export const whatsappUrl = (message?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
