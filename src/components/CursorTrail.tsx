// src/components/CursorTrail.tsx
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import './CursorTrail.css';

type Point = { x: number; y: number; angle: number };

type CursorTrailProps = {
  trailLength?: number;      // cantidad de flechas
  leaderSize?: number;       // tamaño base del líder (px)
  smoothing?: number;        // suavizado (0..1) para el líder
  follow?: number;           // cuánto siguen los segmentos (0..1)
  inactivityMs?: number;     // oculta si no hay movimiento
};

const isTouch = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CursorTrail = memo(({
  trailLength = 12,
  leaderSize = 20,
  smoothing = 0.35,
  follow = 0.25,
  inactivityMs = 1200,
}: CursorTrailProps) => {
  // Respetar accesibilidad y evitar móviles
  const disabled = isTouch() || prefersReduced();
  const [enabled, setEnabled] = useState(!disabled);

  // Posiciones del rastro
  const [trail, setTrail] = useState<Point[]>(() => {
    const midX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    const midY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
    return Array.from({ length: trailLength }, () => ({ x: midX, y: midY, angle: 0 }));
  });

  const targetRef = useRef<Point>({ x: trail[0].x, y: trail[0].y, angle: 0 });
  const lastMoveTs = useRef<number>(Date.now());
  const rafRef = useRef<number | null>(null);

  // Manejo del movimiento del mouse
  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      targetRef.current.x = clientX;
      targetRef.current.y = clientY;
      lastMoveTs.current = Date.now();
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [enabled]);

  // Animación con física ligera (requestAnimationFrame)
  useEffect(() => {
    if (!enabled) return;

    const step = () => {
      const now = Date.now();
      const isInactive = now - lastMoveTs.current > inactivityMs;

      setTrail(prev => {
        if (prev.length === 0) return prev;

        // Copia mutable
        const next: Point[] = prev.map(p => ({ ...p }));

        // 1) Líder: suaviza hacia el target
        const leader = next[0];
        const tx = targetRef.current.x;
        const ty = targetRef.current.y;
        const dx0 = tx - leader.x;
        const dy0 = ty - leader.y;
        leader.x += dx0 * smoothing;
        leader.y += dy0 * smoothing;
        leader.angle = Math.atan2(dy0, dx0) * 180 / Math.PI + 90;

        // 2) Cada segmento sigue al anterior
        for (let i = 1; i < next.length; i++) {
          const prevP = next[i - 1];
          const p = next[i];
          const dx = prevP.x - p.x;
          const dy = prevP.y - p.y;
          p.x += dx * follow;
          p.y += dy * follow;
          p.angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
        }

        // 3) Si está inactivo, desvanecer todo empujándolo levemente al punto actual (para no “temblar”)
        if (isInactive) {
          const midX = window.innerWidth / 2;
          const midY = window.innerHeight / 2;
          // No movemos a centro (sería brusco); solo dejamos que el fade/opacity haga el trabajo
          // Mantener posiciones actuales es suficiente.
        }

        return next;
      });

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [enabled, smoothing, follow, inactivityMs]);

  // Auto-habilitar si el usuario cambia preferencias del SO en caliente
  useEffect(() => {
    if (disabled) return;
    setEnabled(true);
  }, [disabled]);

  // Gradiente único por performance
  const gradientId = useMemo(
    () => `cursorTrailGrad-${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  if (!enabled) return null;

  return (
    <div className="cursor-trail-container" aria-hidden="true">
      {/* Defs SVG (una sola vez) */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />   {/* blue-400 */}
            <stop offset="60%" stopColor="#7c3aed" />  {/* violet-600 */}
            <stop offset="100%" stopColor="#a78bfa" /> {/* violet-300 */}
          </linearGradient>
          <filter id="cursorShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.25)" />
          </filter>
        </defs>
      </svg>

      {trail.map((p, i) => {
        const t = i / (trail.length - 1 || 1);       // 0 → líder, 1 → último
        const opacity = Math.max(0, 1 - t * 0.9);    // desvanecido progresivo
        const scale = 1 - t * 0.5;                   // más pequeño hacia el final
        const size = leaderSize * (0.85 + (1 - t) * 0.3); // líder un poco más grande
        const fadeInactive =
          Date.now() - lastMoveTs.current > inactivityMs ? 0 : 1;

        return (
          <div
            key={i}
            className="cursor-arrow"
            style={{
              top: `${p.y}px`,
              left: `${p.x}px`,
              transform: `translate(-50%, -50%) rotate(${p.angle}deg) scale(${scale})`,
              opacity: opacity * fadeInactive,
              transition: 'opacity 220ms ease-out',
            }}
          >
            {/* Flecha SVG “pro”: cuerpo + punta */}
            <svg
              width={size}
              height={size}
              viewBox="0 0 40 40"
              style={{ filter: 'url(#cursorShadow)' }}
              role="presentation"
            >
              {/* “Cuerpo” (línea) */}
              <line
                x1="20" y1="34" x2="20" y2="10"
                stroke={`url(#${gradientId})`}
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* “Punta” (triángulo) */}
              <path
                d="M20 6 L16 14 L24 14 Z"
                fill={`url(#${gradientId})`}
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
});

CursorTrail.displayName = 'CursorTrail';
export default CursorTrail;
