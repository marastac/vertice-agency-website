// src/main.tsx — Arranque en el navegador.
// En producción el HTML ya viene prerenderizado (scripts/prerender.mjs): React lo "hidrata" sin volver a
// pintarlo. En desarrollo (vite) no hay prerender y se renderiza desde cero.
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { matchRoute, normalizePath } from './routes';
import { initWebVitals } from './utils/webvitals';

const container = document.getElementById('root')!;
const path = normalizePath(window.location.pathname);
const app = (
  <StrictMode>
    <App path={path} />
  </StrictMode>
);

// Hay HTML prerenderizado si el contenedor tiene elementos (el marcador <!--app-html--> es un comentario).
if (container.firstElementChild) hydrateRoot(container, app);
else {
  createRoot(container).render(app);
  // Solo en desarrollo (sin prerender): título de la página para orientarse.
  document.title = matchRoute(path).title;
}

// Core Web Vitals -> GA4 (solo con consentimiento analítico; no bloquea el render)
if ('requestIdleCallback' in window) {
  window.requestIdleCallback(() => initWebVitals());
} else {
  setTimeout(() => initWebVitals(), 1);
}
