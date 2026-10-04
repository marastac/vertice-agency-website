// src/utils/leadConversion.ts — Marca de un solo uso para registrar la conversión de un envío real.
//
// Contact.tsx la guarda SOLO cuando Formspree responde OK. /gracias.html la lee y la BORRA antes de
// enviar generate_lead (GA4) y Lead (Meta), así que un refresh, Atrás/Adelante, una visita directa o la
// URL copiada en otra pestaña no generan conversiones. sessionStorage es propio de cada pestaña.
// Solo se guarda si hay consentimiento de Analíticas o de Marketing: sin consentimiento no hay
// conversión que medir y no se almacena nada (ver inventario en src/pages/legalContent.ts).
// ⚠️ public/gracias.html repite la clave, el formato y el TTL: mantenerlos sincronizados.
import { readConsent } from '../consent/consent';

export const LEAD_PENDING_KEY = 'maastac_lead_pending';
export const LEAD_PENDING_TTL_MS = 30 * 60 * 1000;

export interface LeadPending {
  id: string;
  src: 'contact';
  ts: number;
}

const newId = (): string => {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }
};

/**
 * Marca un envío correcto, solo con consentimiento de Analíticas o Marketing.
 * Si sessionStorage no está disponible no se registra conversión (nunca se duplica).
 */
export function markLeadPending(src: LeadPending['src']): void {
  const consent = readConsent();
  if (!consent?.analytics && !consent?.marketing) return;
  try {
    const value: LeadPending = { id: newId(), src, ts: Date.now() };
    window.sessionStorage.setItem(LEAD_PENDING_KEY, JSON.stringify(value));
  } catch {
    // Sin almacenamiento: /gracias.html mostrará la página pero no enviará la conversión.
  }
}
