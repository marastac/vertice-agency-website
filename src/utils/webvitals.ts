// src/utils/webvitals.ts
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { gtagEvent } from './analytics';
// Los tipos de window.gtag / window.fbq se declaran una sola vez en src/utils/analytics.ts.

const send = (m: Metric) => {
  const name = m.name; // 'LCP' | 'CLS' | 'INP' | 'FCP' | 'TTFB'
  const value = Math.round(name === 'CLS' ? m.value * 1000 : m.value);

  // Solo con consentimiento analítico vigente (también cuando se emite al ocultar o cerrar la página).
  gtagEvent('web_vital', {
    event_category: 'Web Vitals',
    event_label: name,
    value,
    id: m.id,
    page_path: window.location.pathname, // sin query string ni hash (minimización)
    non_interaction: true,
  });
  // Métrica técnica: solo GA4 (con consentimiento analítico). No se envía a Meta.
};

export function reportWebVitals() {
  onLCP(send);
  onCLS(send);
  onINP(send);
  onFCP(send);
  onTTFB(send); // reemplaza FID en v5
}

export const initWebVitals = reportWebVitals;
