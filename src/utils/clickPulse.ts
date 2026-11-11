// src/utils/clickPulse.ts — Pulso visual breve al hacer clic con el ratón (decorativo).
//
// Sustituye de forma sutil al antiguo rastro de cursor: no sigue al puntero ni oculta el cursor nativo.
// - Solo con ratón (pointerType "mouse", botón principal) y en dispositivos con puntero fino y hover.
// - Respeta prefers-reduced-motion (se comprueba en cada clic, por si cambia en caliente).
// - El elemento es aria-hidden, no recibe eventos (pointer-events: none) y se elimina al terminar.
// - Sin estado de React ni requestAnimationFrame: un <span> con una animación CSS (ver .click-pulse en index.css).

const MAX_ACTIVE = 4; // límite de pulsos simultáneos (clics muy rápidos)
const FALLBACK_MS = 1000; // retirada de seguridad si no llega animationend (la animación dura 600 ms)

export function initClickPulse(): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Set<HTMLSpanElement>();

  const remove = (el: HTMLSpanElement) => {
    if (!active.delete(el)) return;
    el.remove();
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    if (!finePointer.matches || reducedMotion.matches) return;

    if (active.size >= MAX_ACTIVE) {
      const oldest = active.values().next().value;
      if (oldest) remove(oldest);
    }

    const el = document.createElement('span');
    el.className = 'click-pulse';
    el.setAttribute('aria-hidden', 'true');
    el.style.left = `${e.clientX}px`;
    el.style.top = `${e.clientY}px`;
    active.add(el);
    document.body.appendChild(el);

    el.addEventListener('animationend', () => remove(el), { once: true });
    window.setTimeout(() => remove(el), FALLBACK_MS);
  };

  window.addEventListener('pointerdown', onPointerDown, { passive: true, capture: true });

  return () => {
    window.removeEventListener('pointerdown', onPointerDown, { capture: true });
    active.forEach((el) => el.remove());
    active.clear();
  };
}
