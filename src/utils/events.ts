// src/utils/events.ts — Eventos de interacción para análisis (solo GA4 y solo con consentimiento analítico).
//
// ⚠️ Ninguno de estos eventos es una conversión. La conversión principal sigue siendo `generate_lead`,
// que SOLO envía /gracias.html tras un envío confirmado por Formspree (ver src/utils/leadConversion.ts).
// No marcar estos eventos como conversiones principales en Google Ads.
//
// Todos pasan por trackEvent → gtagEvent, que bloquea el envío sin consentimiento analítico vigente.
// Nunca se envían datos que el visitante escribe (nombre, email, mensaje…).
import { trackEvent } from './analytics';

/** Clic en un CTA que lleva al contacto (formulario o página /contacto). */
export const trackContactClick = (cta: string, location: string) =>
  trackEvent('contact_click', { cta_id: cta, click_location: location });

/** Clic en un enlace de WhatsApp. Mismo nombre de evento que antes (whatsapp_click). */
export const trackWhatsAppClick = (location: string) =>
  trackEvent('whatsapp_click', { contact_method: 'whatsapp', click_location: location });

/** Clic en un enlace de email (mismo nombre de evento que antes). */
export const trackEmailClick = (location: string) =>
  trackEvent('email_click', { contact_method: 'email', click_location: location });

/** Interés en un servicio: CTA de una tarjeta o selección en el formulario. Solo el identificador estable. */
export const trackServiceInterest = (serviceId: string, source: string) =>
  trackEvent('service_interest', { service_id: serviceId, interest_source: source });

/** Primera interacción con un formulario (una vez por formulario y carga de página). */
export const trackFormStart = (formLocation: string) =>
  trackEvent('form_start', { form_type: 'contact', form_location: formLocation });
