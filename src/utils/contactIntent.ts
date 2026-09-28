// src/utils/contactIntent.ts — Preselección del campo "¿Qué necesitas?" desde los CTAs.
//
// Los CTAs son enlaces normales a #contact: si este script falla, el enlace sigue llevando
// al formulario y el usuario puede elegir la opción manualmente.

export const INTEREST_OPTIONS = [
  { value: 'web_conversion', label: 'Web & Conversión' },
  { value: 'automation_ai', label: 'Automatización & IA' },
  { value: 'integrated_systems', label: 'Sistemas & Integraciones' },
  { value: 'lead_ai_demo', label: 'Demo de Lead AI' },
  { value: 'otro', label: 'Otro / aún no lo sé' },
] as const;

export type Interest = (typeof INTEREST_OPTIONS)[number]['value'];

export const INTEREST_EVENT = 'vertice:contact-interest';

/** Pide al formulario de contacto que preseleccione un interés. */
export const selectContactInterest = (interest: Interest) => {
  try {
    window.dispatchEvent(new CustomEvent<Interest>(INTEREST_EVENT, { detail: interest }));
  } catch {
    // Sin preselección: el enlace a #contact sigue funcionando.
  }
};
