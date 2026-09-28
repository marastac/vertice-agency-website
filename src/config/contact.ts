// src/config/contact.ts — Datos de contacto centralizados (único lugar a modificar).
//
// ⚠️ TODO(ANTES DEL DEPLOY DE LANZAMIENTO): estos datos son PROVISIONALES.
//   - WHATSAPP: +51 999 999 999 es un PLACEHOLDER, no un número real. Sustituir por el número
//     empresarial definitivo (formato internacional sin "+" ni espacios en WHATSAPP_NUMBER).
//   - EMAIL: pendiente de confirmar el dominio y el correo profesional definitivos.
// No publicar el lanzamiento con estos valores.

/** Número para enlaces wa.me: solo dígitos con prefijo de país (sin "+", sin espacios). */
export const WHATSAPP_NUMBER = '51999999999'; // TODO(ANTES DEL DEPLOY DE LANZAMIENTO): número definitivo

/** Número tal como se muestra en la web. */
export const WHATSAPP_DISPLAY = '+51 999 999 999'; // TODO(ANTES DEL DEPLOY DE LANZAMIENTO): número definitivo

/** Correo de contacto. */
export const CONTACT_EMAIL = 'hola@verticeagency.com'; // TODO(ANTES DEL DEPLOY DE LANZAMIENTO): confirmar dominio y correo

/** Construye el enlace de WhatsApp con un mensaje predefinido opcional. */
export const whatsappUrl = (message?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
