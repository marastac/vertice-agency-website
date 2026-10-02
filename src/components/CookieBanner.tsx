// src/components/CookieBanner.tsx — Banner y panel de preferencias de cookies (sin dependencias).
//
// - Sin decisión guardada: banner visible; la web sigue siendo usable (no bloquea contenido).
// - "Aceptar todas" y "Rechazar todas" comparten EXACTAMENTE el mismo estilo (misma prominencia).
// - Analíticas y Marketing empiezan desactivadas; Necesarias no se puede desactivar.
// - El panel se reabre desde el footer ("Configurar cookies") mediante openCookieSettings().
import { useCallback, useEffect, useRef, useState } from 'react';
import { OPEN_COOKIE_SETTINGS_EVENT, readConsent, saveConsent } from '../consent/consent';
import type { ConsentState } from '../consent/consent';

// Mismo estilo para Aceptar y Rechazar (requisito: misma prominencia visual).
const PRIMARY_CHOICE =
  'inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold bg-white text-gray-900 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-colors';
const SECONDARY =
  'inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold border border-white/40 text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-colors';

type Choice = { analytics: boolean; marketing: boolean };

function Toggle({
  id,
  checked,
  disabled,
  onChange,
  label,
}: {
  id: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
        checked ? 'bg-blue-500' : 'bg-gray-500'
      } ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function CookieBanner() {
  const [consent, setConsent] = useState<ConsentState | null>(() => readConsent());
  const [panelOpen, setPanelOpen] = useState(false);
  // Selección del panel: parte SIEMPRE de lo guardado (o desactivado si no hay decisión).
  const [choice, setChoice] = useState<Choice>({ analytics: false, marketing: false });
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const openPanel = useCallback(() => {
    const saved = readConsent();
    setChoice({ analytics: saved?.analytics ?? false, marketing: saved?.marketing ?? false });
    lastFocused.current = document.activeElement as HTMLElement | null;
    setPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    lastFocused.current?.focus?.();
  }, []);

  const decide = useCallback((next: Choice) => {
    setConsent(saveConsent(next)); // si se retira un permiso, consent.ts borra cookies y recarga
    setPanelOpen(false);
  }, []);

  // Reabrir desde el footer ("Configurar cookies")
  useEffect(() => {
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openPanel);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openPanel);
  }, [openPanel]);

  // Panel modal: foco inicial, Esc para cerrar y foco atrapado dentro del diálogo
  useEffect(() => {
    if (!panelOpen) return;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]') ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closePanel();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [panelOpen, closePanel]);

  const showBanner = !consent && !panelOpen;

  return (
    <>
      {showBanner && (
        <section
          aria-label="Aviso de cookies"
          data-cookie-banner
          className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-gradient-to-r from-gray-900/95 to-blue-900/95 p-5 text-white shadow-2xl backdrop-blur">
            <p className="text-sm leading-relaxed text-blue-50">
              Usamos cookies propias necesarias para que la web funcione y, solo si lo aceptas, cookies de
              analítica (Google Analytics) y de marketing (Meta Pixel). Puedes aceptarlas, rechazarlas o configurarlas,
              y cambiar tu elección cuando quieras desde «Configurar cookies».{' '}
              <a href="/cookies" className="underline underline-offset-2 hover:text-white">
                Política de Cookies
              </a>
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <button type="button" className={PRIMARY_CHOICE} data-consent="reject" onClick={() => decide({ analytics: false, marketing: false })}>
                Rechazar todas
              </button>
              <button type="button" className={PRIMARY_CHOICE} data-consent="accept" onClick={() => decide({ analytics: true, marketing: true })}>
                Aceptar todas
              </button>
              <button type="button" className={`${SECONDARY} col-span-2 sm:col-span-1`} data-consent="configure" onClick={openPanel}>
                Configurar
              </button>
            </div>
          </div>
        </section>
      )}

      {panelOpen && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 p-3 sm:p-4">
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-settings-title"
            data-cookie-panel
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-blue-900 p-6 text-white shadow-2xl"
          >
            <h2 id="cookie-settings-title" className="text-xl font-bold">
              Configurar cookies
            </h2>
            <p className="mt-2 text-sm text-blue-100">
              Elige qué categorías permites. Las analíticas y de marketing están desactivadas hasta que las actives.
            </p>

            <ul className="mt-5 space-y-4">
              <li className="flex items-start justify-between gap-4 rounded-xl bg-white/5 p-4">
                <div>
                  <p className="font-semibold">Necesarias</p>
                  <p className="text-sm text-blue-100">
                    Guardan tu elección de cookies. Siempre activas: sin ellas no podríamos recordar tu preferencia.
                  </p>
                </div>
                <Toggle id="cookie-necessary" checked disabled label="Cookies necesarias: siempre activas" />
              </li>
              <li className="flex items-start justify-between gap-4 rounded-xl bg-white/5 p-4">
                <div>
                  <p className="font-semibold">Analíticas</p>
                  <p className="text-sm text-blue-100">Google Analytics: estadísticas de uso de la web.</p>
                </div>
                <Toggle
                  id="cookie-analytics"
                  checked={choice.analytics}
                  onChange={(v) => setChoice((c) => ({ ...c, analytics: v }))}
                  label="Cookies analíticas (Google Analytics)"
                />
              </li>
              <li className="flex items-start justify-between gap-4 rounded-xl bg-white/5 p-4">
                <div>
                  <p className="font-semibold">Marketing</p>
                  <p className="text-sm text-blue-100">Meta Pixel: medición de campañas en Meta (Facebook / Instagram).</p>
                </div>
                <Toggle
                  id="cookie-marketing"
                  checked={choice.marketing}
                  onChange={(v) => setChoice((c) => ({ ...c, marketing: v }))}
                  label="Cookies de marketing (Meta Pixel)"
                />
              </li>
            </ul>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <button type="button" className={PRIMARY_CHOICE} data-consent="panel-reject" onClick={() => decide({ analytics: false, marketing: false })}>
                Rechazar todas
              </button>
              <button type="button" className={PRIMARY_CHOICE} data-consent="panel-accept" onClick={() => decide({ analytics: true, marketing: true })}>
                Aceptar todas
              </button>
              <button type="button" className={`${SECONDARY} col-span-2 sm:col-span-1`} data-consent="panel-save" onClick={() => decide(choice)}>
                Guardar selección
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <a href="/cookies" className="text-blue-200 underline underline-offset-2 hover:text-white">
                Política de Cookies
              </a>
              {consent && (
                <button type="button" onClick={closePanel} className="text-blue-200 hover:text-white">
                  Cerrar sin cambios
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
