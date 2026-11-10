// src/utils/contactIntent.ts — Preselección del campo "¿Qué necesitas?" desde los CTAs.
//
// Los CTAs son enlaces normales a #contact: si este script falla, el enlace sigue llevando
// al formulario y el usuario puede elegir la opción manualmente.
import { SERVICES } from '../config/services';
import type { ServiceId } from '../config/services';

/** Opciones fuera de los 7 servicios: el producto propio (consulta informativa) y "otro". */
export type Interest = ServiceId | 'lead_ai_info' | 'otro';

export const INTEREST_OPTIONS: ReadonlyArray<{ value: Interest; label: string }> = [
  ...SERVICES.map((s) => ({ value: s.id, label: s.name })),
  { value: 'lead_ai_info', label: 'Información sobre Lead AI (producto propio)' },
  { value: 'otro', label: 'Otro / aún no lo sé' },
];

export const INTEREST_EVENT = 'vertice:contact-interest';

/** Pide al formulario de contacto que preseleccione un interés. */
export const selectContactInterest = (interest: Interest) => {
  try {
    window.dispatchEvent(new CustomEvent<Interest>(INTEREST_EVENT, { detail: interest }));
  } catch {
    // Sin preselección: el enlace a #contact sigue funcionando.
  }
};
