// src/config/contact.ts — Datos de contacto centralizados (único lugar a modificar).
//
//   - WHATSAPP: número empresarial definitivo de MAASTAC (WHATSAPP_NUMBER sin "+" ni espacios).
//   - EMAIL: hola@maastac.com es el correo público oficial (reenvío configurado en Namecheap).
//     No publicar nunca aquí la dirección de destino del reenvío.

/** Número para enlaces wa.me: solo dígitos con prefijo de país (sin "+", sin espacios). */
export const WHATSAPP_NUMBER = '51940399159';

/** Número tal como se muestra en la web. */
export const WHATSAPP_DISPLAY = '+51 940 399 159';

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
