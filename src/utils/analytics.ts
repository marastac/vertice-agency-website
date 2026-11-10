// src/utils/analytics.ts — GA4 y Meta Pixel cargados SOLO con consentimiento (ver src/consent/consent.ts)
import { CONSENT_EVENT, readConsent } from '../consent/consent';
import { isProductionHost } from '../config/environment';
import type { ConsentChange, ConsentState } from '../consent/consent';

// Tipos globales (única declaración para toda la web).
// Las funciones de los trackers aceptan argumentos variables cuyo contenido no usamos: `unknown[]`.
export type TrackerFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: TrackerFn;
    fbq?: TrackerFn;
    lintrk?: TrackerFn;
    dataLayer?: unknown[];
    _linkedin_partner_id?: string;
    _linkedin_data_partner_ids?: string[];
    __analytics_initialized?: boolean;
    __ga4_loaded?: boolean;
    __fb_loaded?: boolean;
  }
}

// 🎯 Configuración (Vite-safe)
const getMode = () => {
  try { return import.meta.env?.MODE || 'production'; } catch { return 'production'; }
};
const ANALYTICS_CONFIG = {
  GA_MEASUREMENT_ID: 'G-YN77ENMF5B',
  FB_PIXEL_ID: '1419230625849117',
  LINKEDIN_PARTNER_ID: '', // Para futuro
  DEBUG_MODE: getMode() !== 'production',
};

// 🚀 Cargador async de scripts (id evita duplicados)
const loadScriptAsync = (src: string, id?: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (id && document.getElementById(id)) return resolve();
    if (document.querySelector(`script[src="${src}"]`)) return resolve();

    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    if (id) s.id = id;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
};

// 📊 Google Analytics 4 — SOLO se llama con consentimiento analítico (ver initAnalytics).
export const initGA4 = async (measurementId: string = ANALYTICS_CONFIG.GA_MEASUREMENT_ID) => {
  try {
    if (!isProductionHost()) return; // solo en maastac.com (nunca en local ni en vistas previas)
    if (!measurementId || window.__ga4_loaded) return; // evita inicializaciones duplicadas
    window.__ga4_loaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      // gtag.js necesita el objeto `arguments` original (no un array).
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    // Solo hay consentimiento analítico: almacenamiento publicitario denegado.
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    window.gtag('js', new Date());
    // Privacidad: sin Google Signals ni personalización de anuncios. (anonymize_ip no aplica a GA4:
    // GA4 no registra ni almacena direcciones IP completas.)
    window.gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    await loadScriptAsync(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`, 'ga-script');

    if (ANALYTICS_CONFIG.DEBUG_MODE) console.log('✅ GA4 cargado con consentimiento analítico');
  } catch (e) {
    console.error('❌ Error GA4:', e);
  }
};

// 📱 Meta Pixel — SOLO se llama con consentimiento de marketing (ver initAnalytics).
type FbqStub = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: unknown;
  loaded: boolean;
  version: string;
};

export const initFacebookPixel = async (pixelId: string = ANALYTICS_CONFIG.FB_PIXEL_ID) => {
  try {
    if (!isProductionHost()) return; // solo en maastac.com (nunca en local ni en vistas previas)
    if (!pixelId || window.__fb_loaded || typeof window.fbq === 'function') return; // sin duplicados
    window.__fb_loaded = true;

    // Equivalente tipado del snippet oficial de Meta: cola de llamadas hasta que carga fbevents.js.
    const fbq = function () {
      // eslint-disable-next-line prefer-rest-params
      const args = arguments;
      if (fbq.callMethod) fbq.callMethod(...Array.from(args));
      else fbq.queue.push(args); // la cola conserva el objeto `arguments`, como el snippet oficial
    } as FbqStub;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    window.fbq = fbq;
    (window as Window & { _fbq?: FbqStub })._fbq = fbq;

    fbq('consent', 'grant');
    fbq('init', pixelId);
    fbq('track', 'PageView'); // único PageView de Meta por carga de página
    await loadScriptAsync('https://connect.facebook.net/en_US/fbevents.js', 'fb-pixel-script');

    if (ANALYTICS_CONFIG.DEBUG_MODE) console.log('✅ Meta Pixel cargado con consentimiento de marketing');
  } catch (e) {
    console.error('❌ Error Pixel:', e);
  }
};

// 💼 LinkedIn Insight (futuro)
export const initLinkedInInsight = async (partnerId: string = ANALYTICS_CONFIG.LINKEDIN_PARTNER_ID) => {
  if (!partnerId) return;
  try {
    const pre = document.createElement('script');
    pre.innerHTML = `
      _linkedin_partner_id = "${partnerId}";
      window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
      window._linkedin_data_partner_ids.push(_linkedin_partner_id);
    `;
    document.head.appendChild(pre);
    await loadScriptAsync('https://snap.licdn.com/li.lms-analytics/insight.min.js', 'linkedin-insight');
    if (ANALYTICS_CONFIG.DEBUG_MODE) console.log('✅ LinkedIn Insight listo');
  } catch (e) {
    console.error('❌ Error LinkedIn:', e);
  }
};

// 🔒 Minimización: en los eventos propios solo se envía la ruta (sin dominio, query string ni hash),
// para no reenviar a terceros parámetros de URL (utm, fbclid u otros) ni fragmentos.
export const currentPagePath = (): string => {
  try { return window.location.pathname; } catch { return 'unknown'; }
};

// 🔐 Consentimiento analítico vigente, en memoria. Se actualiza en cada decisión (CONSENT_EVENT), que
// consent.ts emite ANTES de aplicar la revocación y recargar. Así, al retirar el permiso, los eventos
// propios quedan bloqueados de inmediato, incluidos los que se disparan al salir de la página
// (beforeunload, visibilitychange/pagehide de Web Vitals). Sin estado en memoria se usa el guardado.
let analyticsGranted: boolean | null = null;
export const isAnalyticsAllowed = (): boolean => analyticsGranted ?? readConsent()?.analytics === true;

/**
 * Punto único para los eventos analíticos propios hacia GA4: solo se envían con consentimiento analítico
 * vigente. Las llamadas técnicas de Consent Mode (gtag('consent', …)) no pasan por aquí.
 */
export const gtagEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (!isAnalyticsAllowed()) return;
  window.gtag?.('event', eventName, params);
};

// 🔐 Consentimiento de marketing vigente, en memoria (mismo mecanismo que el analítico e independiente de él).
let marketingGranted: boolean | null = null;
export const isMarketingAllowed = (): boolean => marketingGranted ?? readConsent()?.marketing === true;

/**
 * Punto único para los eventos propios hacia Meta Pixel: solo se envían con consentimiento de marketing
 * vigente. Las llamadas técnicas (fbq('consent', …), fbq('init', …) y el PageView de inicialización) no
 * pasan por aquí.
 */
export const fbqEvent = (method: 'track' | 'trackCustom', eventName: string, params?: Record<string, unknown>) => {
  if (!isMarketingAllowed()) return;
  window.fbq?.(method, eventName, params);
};

// 🎯 Evento analítico (solo GA4 y solo con consentimiento analítico vigente).
// Meta Pixel ya NO recibe estos eventos: solo recibe PageView, Lead (gracias.html) y ServiceCTA.
export const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window === 'undefined' || !isAnalyticsAllowed()) return;
  const eventData = {
    ...parameters,
    page_path: currentPagePath(),
    page_title: document.title,
  };
  gtagEvent(eventName, eventData);
  if (ANALYTICS_CONFIG.DEBUG_MODE) console.log('📊 Event:', eventName, eventData);
};

// 📝 Envío de formulario (solo GA4). Se registra de inmediato (antes había un debounce de 1000 ms,
// mayor que los 400 ms de la redirección, que lo descartaba siempre). GA4 agrupa eventos antes de
// enviarlos, así que la conversión de referencia es `generate_lead` en /gracias.html.
// El Lead de Meta se envía una sola vez desde /gracias.html (si hay consentimiento de marketing).
export const trackFormSubmission = (formType: string, additionalData?: Record<string, unknown>) => {
  gtagEvent('form_submit', {
    form_type: formType,
    page_path: currentPagePath(),
    page_title: document.title,
    // Sin valor monetario: no asignamos valores ficticios a un formulario hasta tener datos comerciales reales.
    ...additionalData,
  });
  if (ANALYTICS_CONFIG.DEBUG_MODE) console.log('📝 Form submit:', formType, additionalData);
};

// 🖱️ Clicks (idle)
export const trackButtonClick = (buttonName: string, location: string, additionalData?: Record<string, unknown>) => {
  const run = () => trackEvent('button_click', { button_name: buttonName, click_location: location, ...additionalData });
  if ('requestIdleCallback' in window) window.requestIdleCallback(run);
  else setTimeout(run, 0);
};

// 📏 Scroll depth con thresholds
export const trackScrollDepth = () => {
  let maxScroll = 0, ticking = false;
  const thresholds = [25, 50, 75, 90, 100];
  const seen = new Set<number>();

  const onScroll = () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const top = window.pageYOffset || document.documentElement.scrollTop;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH <= 0) { ticking = false; return; }
      const pct = Math.round((top / docH) * 100);
      if (pct > maxScroll) {
        maxScroll = pct;
        for (const t of thresholds) {
          if (pct >= t && !seen.has(t)) {
            seen.add(t);
            trackEvent('scroll_depth', { scroll_depth: t, max_scroll_reached: maxScroll });
            break;
          }
        }
      }
      ticking = false;
    });
    ticking = true;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
};

// ⚡ Performance básica + paints
export const measurePerformance = () => {
  if (!('performance' in window)) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      const nav = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (nav && nav.length) {
        const p = nav[0];
        // Navigation Timing L2: los tiempos son relativos a timeOrigin; startTime (0) = inicio de la navegación
        const data = {
          page_load_time: Math.round(p.loadEventEnd - p.startTime),
          dom_content_loaded: Math.round(p.domContentLoadedEventEnd - p.startTime),
          first_paint: Math.round(p.responseEnd - p.startTime),
          ttfb: Math.round(p.responseStart - p.startTime),
        };
        trackEvent('page_performance', data);

        const paints = performance.getEntriesByType('paint');
        paints.forEach((entry: PerformanceEntry) => {
          trackEvent('core_web_vitals', { metric_name: entry.name, metric_value: Math.round(entry.startTime) });
        });
      }
    }, 1000);
  });
};

// 💰 Conversiones
export const trackConversion = (type: 'lead' | 'newsletter' | 'download' | 'contact', value?: number, extra?: Record<string, unknown>) => {
  // 'contact' no tiene valor por defecto (sin valores ficticios); solo se envía value/currency si hay valor.
  const v = value ?? (type === 'contact' ? undefined : type === 'download' ? 75 : 50);
  gtagEvent('conversion', { conversion_type: type, ...(v !== undefined ? { value: v, currency: 'USD' } : {}), ...extra });
  if (ANALYTICS_CONFIG.DEBUG_MODE) console.log('💰 Conversion:', type, { value: v, ...extra });
};

// 🚨 Errores — minimizado: solo el TIPO de error (p. ej. "TypeError") y el contexto.
// No se envían el mensaje, la traza ni el user agent: pueden contener URLs, datos del formulario u
// otra información personal. El detalle completo solo se muestra en la consola en modo desarrollo.
const errorType = (error: unknown): string => {
  if (error instanceof Error && error.name) return error.name.slice(0, 40);
  return typeof error === 'string' ? 'message' : 'unknown';
};
export const trackError = (error: unknown, context?: string) => {
  trackEvent('javascript_error', { error_type: errorType(error), context: context || 'unknown' });
  if (ANALYTICS_CONFIG.DEBUG_MODE) console.error('🚨 Error tracked:', error, context);
};

// 🧠 Interacciones avanzadas
export const setupAdvancedTracking = () => {
  // Clicks en elementos con data-cta
  const onClick = (e: Event) => {
    const target = e.target as HTMLElement;
    const el = target.closest('[data-cta]') as HTMLElement | null;
    if (el) {
      const ctaName = el.getAttribute('data-cta') || 'unknown_cta';
      const ctaText = el.textContent?.trim();
      trackButtonClick(ctaName, getPageSection(el), { cta_text: ctaText, element_type: el.tagName.toLowerCase() });
    }
    // Enlaces externos — solo el dominio de destino (sin URL completa ni texto del enlace).
    const link = target.closest?.('a') as HTMLAnchorElement | null;
    if (link && link.hostname && link.hostname !== window.location.hostname) {
      trackEvent('external_link_click', { target_domain: link.hostname });
    }
  };
  document.addEventListener('click', onClick);

  // Foco en campos de formulario: ELIMINADO (minimización). No se mide la interacción campo a campo
  // y nunca se envían valores introducidos por el usuario.

  // Videos (solo el título si existe; sin la URL del archivo)
  const onPlay = (e: Event) => {
    const v = e.target as HTMLVideoElement;
    if (v && v.tagName === 'VIDEO') {
      trackEvent('video_play', { video_title: v.title || 'untitled' });
    }
  };
  document.addEventListener('play', onPlay, true);

  // Tiempo en página
  const start = Date.now();
  const onUnload = () => {
    const secs = Math.round((Date.now() - start) / 1000);
    trackEvent('time_on_page', { time_seconds: secs, time_minutes: Math.round(secs / 60) });
  };
  window.addEventListener('beforeunload', onUnload);

  // Cleanup opcional (si alguna vez lo necesitas)
  return () => {
    document.removeEventListener('click', onClick);
    document.removeEventListener('play', onPlay, true);
    window.removeEventListener('beforeunload', onUnload);
  };
};

// 🔍 Utilidad
const getPageSection = (el: Element): string => {
  const section = el.closest('section');
  return section?.id || (section?.className?.toString().split(' ')[0] ?? 'unknown');
};

// 📈 Medición de comportamiento (solo GA4). Se activa una vez, cuando hay consentimiento analítico.
let behaviorTrackingStarted = false;
const startBehaviorTracking = () => {
  if (behaviorTrackingStarted) return;
  behaviorTrackingStarted = true;
  measurePerformance();
  trackScrollDepth();
  setupAdvancedTracking();
  window.addEventListener('error', (event: ErrorEvent) => trackError(event.error || event.message, 'global_error_handler'));
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) =>
    trackError(event.reason, 'unhandled_promise_rejection'),
  );
};

/** Carga únicamente los trackers autorizados por la preferencia indicada. */
const applyConsent = (consent: ConsentState | null) => {
  if (!consent) return; // sin decisión: no se carga nada
  analyticsGranted = consent.analytics; // también bloquea al instante los eventos propios si se retira
  marketingGranted = consent.marketing; // ídem para Meta (categoría independiente)
  if (consent.analytics) {
    void initGA4();
    startBehaviorTracking();
  }
  if (consent.marketing) {
    void initFacebookPixel();
  }
  // LinkedIn Insight sigue desactivado (sin ID). Si se activa, debe ir bajo consentimiento de marketing.
};

// 🚀 Init maestro (una sola vez): respeta el consentimiento guardado y escucha cambios posteriores.
// Al conceder un permiso se carga en el momento; al retirarlo, consent.ts borra cookies y recarga.
export const initAnalytics = () => {
  if (window.__analytics_initialized) return;
  window.__analytics_initialized = true;

  // Protección por dominio: fuera de maastac.com no se carga ningún tracker ni se envía ningún evento.
  if (!isProductionHost()) {
    if (ANALYTICS_CONFIG.DEBUG_MODE) console.log('📊 Analytics desactivado: dominio que no es de producción');
    return;
  }

  applyConsent(readConsent());
  window.addEventListener(CONSENT_EVENT, (e) => applyConsent((e as CustomEvent<ConsentChange>).detail.current));

  if (ANALYTICS_CONFIG.DEBUG_MODE) console.log('📊 Analytics: carga sujeta a consentimiento');
};

// Debug helper
export const getAnalyticsConfig = () => ANALYTICS_CONFIG;
