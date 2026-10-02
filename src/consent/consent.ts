// src/consent/consent.ts — Preferencias de cookies (sin dependencias externas).
//
// Categorías:
//   - necesarias: siempre activas (solo esta preferencia, guardada en localStorage).
//   - analytics:  Google Analytics 4. Desactivada por defecto.
//   - marketing:  Meta Pixel. Desactivada por defecto.
// Sin una decisión guardada NO se carga ningún tracker.

export const CONSENT_KEY = 'maastac_consent';
export const CONSENT_VERSION = 1;

/** Evento global emitido al guardar una preferencia (detail: { previous, current }). */
export const CONSENT_EVENT = 'maastac:consent-change';
/** Evento global para abrir el panel de configuración desde cualquier lugar (p. ej. el footer). */
export const OPEN_COOKIE_SETTINGS_EVENT = 'maastac:open-cookie-settings';

export interface ConsentState {
  version: number;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

export interface ConsentChange {
  previous: ConsentState | null;
  current: ConsentState;
}

/** Lee la preferencia guardada. Devuelve null si no existe, es inválida o es de otra versión. */
export function readConsent(): ConsentState | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (
      parsed.version !== CONSENT_VERSION ||
      typeof parsed.analytics !== 'boolean' ||
      typeof parsed.marketing !== 'boolean' ||
      typeof parsed.updatedAt !== 'string'
    ) {
      return null;
    }
    return parsed as ConsentState;
  } catch {
    return null;
  }
}

/** Guarda la preferencia y notifica a la web. Aplica la revocación si se retira algún permiso. */
export function saveConsent(choice: { analytics: boolean; marketing: boolean }): ConsentState {
  const previous = readConsent();
  const current: ConsentState = {
    version: CONSENT_VERSION,
    analytics: choice.analytics,
    marketing: choice.marketing,
    updatedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(current));
  } catch {
    // Sin almacenamiento disponible la elección solo dura esta visita; los trackers siguen bloqueados
    // salvo que el usuario los acepte expresamente.
  }

  const revokedAnalytics = Boolean(previous?.analytics) && !current.analytics;
  const revokedMarketing = Boolean(previous?.marketing) && !current.marketing;

  window.dispatchEvent(new CustomEvent<ConsentChange>(CONSENT_EVENT, { detail: { previous, current } }));

  if (revokedAnalytics || revokedMarketing) {
    applyRevocation({ analytics: revokedAnalytics, marketing: revokedMarketing });
  }
  return current;
}

export function openCookieSettings(): void {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}

// ---------------------------------------------------------------------------
// Revocación
// ---------------------------------------------------------------------------

const GA_COOKIE_PREFIXES = ['_ga']; // _ga y _ga_<ID> (GA4)
const META_COOKIES = ['_fbp', '_fbc'];

/** Dominios desde los que pudimos crear cookies: el host actual y sus dominios padre (nunca el TLD). */
function cookieDomains(): string[] {
  const host = window.location.hostname;
  const parts = host.split('.');
  const domains = new Set<string>(['']);
  for (let i = 0; i < parts.length - 1; i++) {
    const d = parts.slice(i).join('.');
    domains.add(d);
    domains.add(`.${d}`);
  }
  return [...domains];
}

function deleteCookie(name: string): void {
  for (const domain of cookieDomains()) {
    const domainAttr = domain ? `; domain=${domain}` : '';
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainAttr}`;
  }
}

/** Borra solo las cookies de nuestros trackers (GA4 / Meta) creadas en nuestro dominio. */
function deleteTrackerCookies(kind: { analytics: boolean; marketing: boolean }): void {
  const names = document.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter(Boolean);
  for (const name of names) {
    if (kind.analytics && GA_COOKIE_PREFIXES.some((p) => name === p || name.startsWith(`${p}_`))) deleteCookie(name);
    if (kind.marketing && META_COOKIES.includes(name)) deleteCookie(name);
  }
}

function applyRevocation(kind: { analytics: boolean; marketing: boolean }): void {
  const w = window as Window & { gtag?: (...args: unknown[]) => void; fbq?: (...args: unknown[]) => void };
  try {
    if (kind.analytics) w.gtag?.('consent', 'update', { analytics_storage: 'denied' });
    if (kind.marketing) w.fbq?.('consent', 'revoke');
  } catch {
    // Los mecanismos de revocación son de mejor esfuerzo; la recarga garantiza que dejan de operar.
  }
  deleteTrackerCookies(kind);
  // Un script ya cargado no se puede descargar: recargamos para que no siga operando.
  window.location.reload();
}
