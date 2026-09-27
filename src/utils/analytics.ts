// src/utils/analytics.ts — Versión Final Optimizada (con guardias anti-duplicado)

// Tipos globales
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    lintrk?: (...args: any[]) => void;
    dataLayer?: any[];
    _linkedin_partner_id?: string;
    _linkedin_data_partner_ids?: string[];
    __analytics_initialized?: boolean;
    __ga4_loaded?: boolean;
    __fb_loaded?: boolean;
  }
}

// 🎯 Configuración (Vite-safe)
const getMode = () => {
  try { return (import.meta as any)?.env?.MODE || 'production'; } catch { return 'production'; }
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

// 📊 Google Analytics 4 (con guardias)
export const initGA4 = async (measurementId: string = ANALYTICS_CONFIG.GA_MEASUREMENT_ID) => {
  try {
    if (!measurementId) return;

    // Si ya hay gtag() o un script de GA en la página, NO duplicar
    const alreadyHasGtag = typeof window.gtag === 'function';
    const hasGaScript = !!document.querySelector('script[src*="googletagmanager.com/gtag/js"]');

    if (!alreadyHasGtag && !hasGaScript) {
      await loadScriptAsync(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`, 'ga-script');
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer!.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        // Enhanced measurement básico
        enhanced_measurement: {
          scrolls: true,
          outbound_clicks: true,
          site_search: true,
          video_engagement: true,
          file_downloads: true,
        },
      });
      window.__ga4_loaded = true;
    } else {
      // Asegura dataLayer y respeta config existente (evita doble PageView)
      window.dataLayer = window.dataLayer || [];
    }

    if (ANALYTICS_CONFIG.DEBUG_MODE) console.log('✅ GA4 listo (sin duplicados)');
  } catch (e) {
    console.error('❌ Error GA4:', e);
  }
};

// 📱 Facebook Pixel (con guardias)
export const initFacebookPixel = async (pixelId: string = ANALYTICS_CONFIG.FB_PIXEL_ID) => {
  try {
    if (!pixelId) return;
    const hasFbq = typeof window.fbq === 'function';
    const hasFbScript = !!document.querySelector('script[src*="connect.facebook.net"]');
    if (hasFbq || hasFbScript || window.__fb_loaded) {
      if (ANALYTICS_CONFIG.DEBUG_MODE) console.log('ℹ️ Pixel ya presente, no se duplica');
      return;
    }

    const boot = document.createElement('script');
    boot.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(boot);
    window.__fb_loaded = true;

    if (ANALYTICS_CONFIG.DEBUG_MODE) console.log('✅ Facebook Pixel listo (sin duplicados)');
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

// 🎯 Event tracking unificado
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  const eventData = {
    ...parameters,
    timestamp: Date.now(),
    page_url: window.location.href,
    page_title: document.title,
  };
  window.gtag?.('event', eventName, eventData);
  try { window.fbq?.('trackCustom', eventName, eventData); } catch {}
  if (ANALYTICS_CONFIG.DEBUG_MODE) console.log('📊 Event:', eventName, eventData);
};

// 📝 Forms con debounce
let __formTimeout: any;
export const trackFormSubmission = (formType: string, additionalData?: Record<string, any>, debounceMs: number = 1000) => {
  clearTimeout(__formTimeout);
  __formTimeout = setTimeout(() => {
    window.gtag?.('event', 'form_submit', {
      form_type: formType,
      page_location: window.location.href,
      page_title: document.title,
      value: formType === 'contact' ? 100 : formType === 'newsletter' ? 50 : 25,
      ...additionalData,
    });
    const fbEvent = formType === 'contact' ? 'Lead' : 'Subscribe';
    try {
      window.fbq?.('track', fbEvent as any, {
        content_name: `${formType} form`,
        content_category: 'Lead Generation',
        value: formType === 'contact' ? 100 : 50,
        currency: 'USD',
        ...additionalData,
      });
    } catch {}
    if (ANALYTICS_CONFIG.DEBUG_MODE) console.log('📝 Form submit:', formType, additionalData);
  }, debounceMs);
};

// 🖱️ Clicks (idle)
export const trackButtonClick = (buttonName: string, location: string, additionalData?: Record<string, any>) => {
  const run = () => trackEvent('button_click', { button_name: buttonName, click_location: location, ...additionalData });
  (window as any).requestIdleCallback ? (window as any).requestIdleCallback(run) : setTimeout(run, 0);
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
            try { window.fbq?.('trackCustom', 'ScrollDepth', { scroll_depth: t }); } catch {}
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
          page_url: window.location.href,
          connection_type: (navigator as any).connection?.effectiveType || 'unknown',
        };
        trackEvent('page_performance', data);

        const paints = performance.getEntriesByType('paint');
        paints.forEach((entry: any) => {
          trackEvent('core_web_vitals', { metric_name: entry.name, metric_value: Math.round(entry.startTime), page_url: window.location.href });
        });
      }
    }, 1000);
  });
};

// 💰 Conversiones
export const trackConversion = (type: 'lead' | 'newsletter' | 'download' | 'contact', value?: number, extra?: Record<string, any>) => {
  const v = value ?? (type === 'contact' ? 100 : type === 'download' ? 75 : 50);
  window.gtag?.('event', 'conversion', { conversion_type: type, value: v, currency: 'USD', ...extra });
  const map = { lead: 'Lead', newsletter: 'Subscribe', download: 'CompleteRegistration', contact: 'Lead' } as const;
  try { window.fbq?.('track', map[type] as any, { value: v, currency: 'USD', content_category: 'Lead Generation', ...extra }); } catch {}
  if (ANALYTICS_CONFIG.DEBUG_MODE) console.log('💰 Conversion:', type, { value: v, ...extra });
};

// 🚨 Errores
export const trackError = (error: any, context?: string, extra?: Record<string, any>) => {
  const msg = error?.message || String(error);
  const stack = (error?.stack || '').toString().slice(0, 500);
  trackEvent('javascript_error', { error_message: msg, error_stack: stack, context: context || 'unknown', user_agent: navigator.userAgent, ...extra });
  if (ANALYTICS_CONFIG.DEBUG_MODE) console.error('🚨 Error tracked:', error, context, extra);
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
    // Enlaces externos
    const link = target.closest?.('a') as HTMLAnchorElement | null;
    if (link && link.hostname !== window.location.hostname) {
      trackEvent('external_link_click', { link_url: link.href, link_text: link.textContent?.trim(), target_domain: link.hostname });
    }
  };
  document.addEventListener('click', onClick);

  // Focus de campos
  const onFocus = (e: Event) => {
    const t = e.target as HTMLElement;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) {
      const formName = t.closest('form')?.getAttribute('data-form-name') || 'unknown';
      const fieldName = t.getAttribute('name') || t.id || 'unknown_field';
      trackEvent('form_field_focus', { form_name: formName, field_name: fieldName, field_type: t.getAttribute('type') || t.tagName.toLowerCase() });
    }
  };
  document.addEventListener('focusin', onFocus);

  // Videos
  const onPlay = (e: Event) => {
    const v = e.target as HTMLVideoElement;
    if (v && v.tagName === 'VIDEO') {
      trackEvent('video_play', { video_title: v.title || v.src, video_duration: v.duration, video_current_time: v.currentTime });
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
    document.removeEventListener('focusin', onFocus);
    document.removeEventListener('play', onPlay, true);
    window.removeEventListener('beforeunload', onUnload);
  };
};

// 🔍 Utilidad
const getPageSection = (el: Element): string => {
  const section = el.closest('section');
  return section?.id || (section?.className?.toString().split(' ')[0] ?? 'unknown');
};

// 🚀 Init maestro (una sola vez)
export const initAnalytics = () => {
  if (window.__analytics_initialized) return;
  window.__analytics_initialized = true;

  const initializeTracking = async () => {
    try {
      await Promise.all([
        initGA4(),
        initFacebookPixel(),
        // initLinkedInInsight() // Activar cuando tengas LinkedIn
      ]);

      measurePerformance();
      const cleanupScroll = trackScrollDepth();
      setupAdvancedTracking();

      // Error handlers globales (una vez)
      const onErr = (event: ErrorEvent) => trackError(event.error || event.message, 'global_error_handler');
      const onRej = (event: PromiseRejectionEvent) => trackError(event.reason, 'unhandled_promise_rejection');
      window.addEventListener('error', onErr);
      window.addEventListener('unhandledrejection', onRej);

      if (ANALYTICS_CONFIG.DEBUG_MODE) console.log('🎯 Analytics inicializado (one-shot)');

      // Opcional: retorna cleanup (si hiciera falta desmontar)
      return () => {
        cleanupScroll?.();
        window.removeEventListener('error', onErr);
        window.removeEventListener('unhandledrejection', onRej);
      };
    } catch (e) {
      console.error('❌ Error init analytics:', e);
    }
  };

  // Inicialización por interacción + fallback
  const handleUserInteraction = () => {
    initializeTracking();
    window.removeEventListener('scroll', handleUserInteraction);
    window.removeEventListener('click', handleUserInteraction);
    window.removeEventListener('keydown', handleUserInteraction);
    window.removeEventListener('touchstart', handleUserInteraction);
  };

  window.addEventListener('scroll', handleUserInteraction, { passive: true });
  window.addEventListener('click', handleUserInteraction, { passive: true });
  window.addEventListener('keydown', handleUserInteraction, { passive: true });
  window.addEventListener('touchstart', handleUserInteraction, { passive: true });

  setTimeout(() => initializeTracking(), 3000);

  if (ANALYTICS_CONFIG.DEBUG_MODE) console.log('📊 Analytics listo para iniciar');
};

// Debug helper
export const getAnalyticsConfig = () => ANALYTICS_CONFIG;
