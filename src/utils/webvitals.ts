// src/utils/webvitals.ts
import { onCLS, onINP, onLCP, type Metric } from 'web-vitals';

declare global {
  interface Window { gtag?: (...args: any[]) => void }
}

const sendToGA4 = (metric: Metric) => {
  const { name, value } = metric;
  // GA4 requiere enteros; CLS en milisegundos
  const val = Math.round(name === 'CLS' ? value * 1000 : value);

  window.gtag?.('event', 'web_vital', {
    event_category: 'Web Vitals',
    event_label: name,     // 'LCP' | 'CLS' | 'INP'
    value: val,
    non_interaction: true,
  });
};

export const initWebVitals = () => {
  // Seguro en CSR; si no hay GA4, simplemente no envía
  onLCP(sendToGA4);
  onCLS(sendToGA4);
  onINP(sendToGA4);
};
