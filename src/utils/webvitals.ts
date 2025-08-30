// src/utils/webvitals.ts
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

const send = (m: Metric) => {
  const name = m.name; // 'LCP' | 'CLS' | 'INP' | 'FCP' | 'TTFB'
  const value = Math.round(name === 'CLS' ? m.value * 1000 : m.value);

  window.gtag?.('event', 'web_vital', {
    event_category: 'Web Vitals',
    event_label: name,
    value,
    id: m.id,
    page: window.location.href,
    non_interaction: true,
  });

  window.fbq?.('trackCustom', 'WebVital', { name, value, id: m.id });
};

export function reportWebVitals() {
  onLCP(send);
  onCLS(send);
  onINP(send);
  onFCP(send);
  onTTFB(send); // reemplaza FID en v5
}

export const initWebVitals = reportWebVitals;
