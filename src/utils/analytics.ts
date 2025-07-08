// src/utils/analytics.ts - Versión Final Optimizada
// Combina lazy loading + enhanced tracking + performance

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    lintrk: (...args: any[]) => void;
    dataLayer: any[];
    _linkedin_partner_id: string;
    _linkedin_data_partner_ids: string[];
  }
}

// 🎯 Configuration
const ANALYTICS_CONFIG = {
  GA_MEASUREMENT_ID: 'G-YN77ENMF5B',
  FB_PIXEL_ID: '1419230625849117',
  LINKEDIN_PARTNER_ID: '', // Para futuro uso
  DEBUG_MODE: process.env.NODE_ENV === 'development'
};

// 🚀 Lazy loading de scripts optimizado
const loadScriptAsync = (src: string, id?: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (id && document.getElementById(id)) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    if (id) script.id = id;
    
    script.onload = () => resolve();
    script.onerror = reject;
    
    document.head.appendChild(script);
  });
};

// 📊 Google Analytics 4 con enhanced tracking
export const initGA4 = async (measurementId: string = ANALYTICS_CONFIG.GA_MEASUREMENT_ID) => {
  try {
    // Cargar script de forma lazy
    await loadScriptAsync(
      `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
      'ga-script'
    );
    
    // Configurar gtag
    window.dataLayer = window.dataLayer || [];
    const gtag = (...args: any[]) => {
      window.dataLayer.push(args);
    };
    
    gtag('js', new Date());
    gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      // Enhanced measurement
      enhanced_measurement: {
        scrolls: true,
        outbound_clicks: true,
        site_search: true,
        video_engagement: true,
        file_downloads: true
      },
      // Custom parameters
      custom_map: {
        'custom_parameter_1': 'business_type',
        'custom_parameter_2': 'lead_source'
      }
    });
    
    // Hacer gtag disponible globalmente
    window.gtag = gtag;
    
    if (ANALYTICS_CONFIG.DEBUG_MODE) {
      console.log('✅ Google Analytics 4 inicializado');
    }
  } catch (error) {
    console.error('❌ Error al cargar Google Analytics:', error);
  }
};

// 📱 Facebook Pixel con lazy loading optimizado
export const initFacebookPixel = async (pixelId: string = ANALYTICS_CONFIG.FB_PIXEL_ID) => {
  try {
    // Evitar doble inicialización
    if (window.fbq) return;

    const script = document.createElement('script');
    script.innerHTML = `
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
    
    document.head.appendChild(script);
    
    if (ANALYTICS_CONFIG.DEBUG_MODE) {
      console.log('✅ Facebook Pixel inicializado');
    }
  } catch (error) {
    console.error('❌ Error al cargar Facebook Pixel:', error);
  }
};

// 💼 LinkedIn Insight Tag (para futuro)
export const initLinkedInInsight = async (partnerId: string = ANALYTICS_CONFIG.LINKEDIN_PARTNER_ID) => {
  if (!partnerId) return;
  
  try {
    const script = document.createElement('script');
    script.innerHTML = `
      _linkedin_partner_id = "${partnerId}";
      window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
      window._linkedin_data_partner_ids.push(_linkedin_partner_id);
    `;
    document.head.appendChild(script);

    await loadScriptAsync('https://snap.licdn.com/li.lms-analytics/insight.min.js', 'linkedin-insight');
    
    if (ANALYTICS_CONFIG.DEBUG_MODE) {
      console.log('✅ LinkedIn Insight Tag inicializado');
    }
  } catch (error) {
    console.error('❌ Error al cargar LinkedIn Insight:', error);
  }
};

// 🎯 Track events optimizado con múltiples plataformas
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  const eventData = {
    ...parameters,
    timestamp: Date.now(),
    page_url: window.location.href,
    page_title: document.title
  };

  // Google Analytics
  if (window.gtag) {
    window.gtag('event', eventName, eventData);
  }

  // Facebook Pixel
  if (window.fbq) {
    window.fbq('trackCustom', eventName, eventData);
  }

  if (ANALYTICS_CONFIG.DEBUG_MODE) {
    console.log('📊 Event tracked:', eventName, eventData);
  }
};

// 📝 Track form submissions con debounce mejorado
let formSubmissionTimeout: any;
export const trackFormSubmission = (formType: string, additionalData?: Record<string, any>, debounceMs: number = 1000) => {
  clearTimeout(formSubmissionTimeout);
  formSubmissionTimeout = setTimeout(() => {
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'form_submit', {
        form_type: formType,
        page_location: window.location.href,
        page_title: document.title,
        value: formType === 'contact' ? 100 : formType === 'newsletter' ? 50 : 25,
        ...additionalData
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      const eventType = formType === 'contact' ? 'Lead' : 'Subscribe';
      window.fbq('track', eventType, {
        content_name: `${formType} form`,
        content_category: 'Lead Generation',
        value: formType === 'contact' ? 100 : 50,
        currency: 'USD',
        ...additionalData
      });
    }

    if (ANALYTICS_CONFIG.DEBUG_MODE) {
      console.log('📝 Form submission tracked:', formType, additionalData);
    }
  }, debounceMs);
};

// 🖱️ Track button clicks optimizado
export const trackButtonClick = (buttonName: string, location: string, additionalData?: Record<string, any>) => {
  // Usar requestIdleCallback para mejor performance
  const trackClick = () => {
    trackEvent('button_click', {
      button_name: buttonName,
      click_location: location,
      ...additionalData
    });
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(trackClick);
  } else {
    setTimeout(trackClick, 0);
  }
};

// 📏 Track scroll depth optimizado con throttling
export const trackScrollDepth = () => {
  let maxScroll = 0;
  let ticking = false;
  const trackingThresholds = [25, 50, 75, 90, 100];
  const trackedThresholds = new Set<number>();

  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / documentHeight) * 100);

        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent;
          
          for (const threshold of trackingThresholds) {
            if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
              trackedThresholds.add(threshold);
              
              trackEvent('scroll_depth', {
                scroll_depth: threshold,
                max_scroll_reached: maxScroll
              });
              
              // Facebook Pixel custom event
              if (window.fbq) {
                window.fbq('trackCustom', 'ScrollDepth', {
                  scroll_depth: threshold
                });
              }
              break;
            }
          }
        }
        
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
    trackedThresholds.clear();
  };
};

// ⚡ Performance monitoring mejorado
export const measurePerformance = () => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navEntries = performance.getEntriesByType('navigation');
        if (navEntries.length > 0) {
          const perfData = navEntries[0] as PerformanceNavigationTiming;
          
          const performanceMetrics = {
            page_load_time: Math.round(perfData.loadEventEnd - perfData.navigationStart),
            dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.navigationStart),
            first_paint: Math.round(perfData.responseEnd - perfData.navigationStart),
            ttfb: Math.round(perfData.responseStart - perfData.navigationStart),
            page_url: window.location.href,
            connection_type: (navigator as any).connection?.effectiveType || 'unknown'
          };

          trackEvent('page_performance', performanceMetrics);

          // Track Core Web Vitals si están disponibles
          if ('getEntriesByType' in performance) {
            const paintEntries = performance.getEntriesByType('paint');
            paintEntries.forEach((entry) => {
              trackEvent('core_web_vitals', {
                metric_name: entry.name,
                metric_value: Math.round(entry.startTime),
                page_url: window.location.href
              });
            });
          }
        }
      }, 1000);
    });
  }
};

// 🎯 Track conversiones específicas
export const trackConversion = (conversionType: 'lead' | 'newsletter' | 'download' | 'contact', value?: number, additionalData?: Record<string, any>) => {
  const conversionValue = value || (conversionType === 'contact' ? 100 : conversionType === 'download' ? 75 : 50);
  
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', 'conversion', {
      conversion_type: conversionType,
      value: conversionValue,
      currency: 'USD',
      ...additionalData
    });
  }

  // Facebook Pixel
  if (window.fbq) {
    const eventMap = {
      'lead': 'Lead',
      'newsletter': 'Subscribe', 
      'download': 'CompleteRegistration',
      'contact': 'Lead'
    };
    
    window.fbq('track', eventMap[conversionType], {
      value: conversionValue,
      currency: 'USD',
      content_category: 'Lead Generation',
      ...additionalData
    });
  }

  if (ANALYTICS_CONFIG.DEBUG_MODE) {
    console.log('💰 Conversion tracked:', conversionType, { value: conversionValue, ...additionalData });
  }
};

// 🚨 Error tracking mejorado
export const trackError = (error: Error, context?: string, additionalData?: Record<string, any>) => {
  trackEvent('javascript_error', {
    error_message: error.message,
    error_stack: error.stack?.substring(0, 500),
    context: context || 'unknown',
    user_agent: navigator.userAgent,
    ...additionalData
  });

  if (ANALYTICS_CONFIG.DEBUG_MODE) {
    console.error('🚨 Error tracked:', error, context, additionalData);
  }
};

// 🎮 Enhanced user interaction tracking
export const setupAdvancedTracking = () => {
  // Track CTA clicks con data attributes
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const ctaElement = target.closest('[data-cta]');
    
    if (ctaElement) {
      const ctaName = ctaElement.getAttribute('data-cta');
      const ctaText = ctaElement.textContent?.trim();
      
      trackButtonClick(ctaName || 'unknown_cta', getPageSection(ctaElement), {
        cta_text: ctaText,
        element_type: ctaElement.tagName.toLowerCase()
      });
    }

    // Track external links
    const link = target.closest('a') as HTMLAnchorElement;
    if (link && link.hostname !== window.location.hostname) {
      trackEvent('external_link_click', {
        link_url: link.href,
        link_text: link.textContent?.trim(),
        target_domain: link.hostname
      });
    }
  });

  // Track form field interactions
  document.addEventListener('focusin', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
      const formName = target.closest('form')?.getAttribute('data-form-name') || 'unknown';
      const fieldName = target.getAttribute('name') || target.id || 'unknown_field';
      
      trackEvent('form_field_focus', {
        form_name: formName,
        field_name: fieldName,
        field_type: target.getAttribute('type') || target.tagName.toLowerCase()
      });
    }
  });

  // Track video interactions si hay videos
  document.addEventListener('play', (e) => {
    const target = e.target as HTMLVideoElement;
    if (target.tagName === 'VIDEO') {
      trackEvent('video_play', {
        video_title: target.title || target.src,
        video_duration: target.duration,
        video_current_time: target.currentTime
      });
    }
  }, true);

  // Track time on page
  const startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    trackEvent('time_on_page', {
      time_seconds: timeOnPage,
      time_minutes: Math.round(timeOnPage / 60)
    });
  });
};

// 🔍 Utility functions
const getPageSection = (element: Element): string => {
  const section = element.closest('section');
  return section?.id || section?.className.split(' ')[0] || 'unknown';
};

// 🚀 Initialize all analytics con estrategia optimizada
export const initAnalytics = () => {
  let analyticsInitialized = false;

  const initializeTracking = async () => {
    if (analyticsInitialized) return;
    analyticsInitialized = true;

    try {
      // Inicializar servicios en paralelo
      await Promise.all([
        initGA4(),
        initFacebookPixel(),
        // initLinkedInInsight() // Descomentar cuando tengas LinkedIn Business
      ]);

      // Setup tracking adicional
      measurePerformance();
      const cleanupScrollTracking = trackScrollDepth();
      setupAdvancedTracking();

      // Setup error tracking global
      window.addEventListener('error', (event) => {
        trackError(event.error, 'global_error_handler');
      });

      window.addEventListener('unhandledrejection', (event) => {
        trackError(new Error(event.reason), 'unhandled_promise_rejection');
      });

      if (ANALYTICS_CONFIG.DEBUG_MODE) {
        console.log('🎯 Sistema de Analytics completamente inicializado');
      }

      // Retornar función de cleanup
      return () => {
        cleanupScrollTracking();
      };

    } catch (error) {
      console.error('❌ Error durante inicialización de analytics:', error);
    }
  };

  // Estrategia de inicialización optimizada
  const handleUserInteraction = () => {
    initializeTracking();
    
    // Remover listeners después de la primera interacción
    window.removeEventListener('scroll', handleUserInteraction);
    window.removeEventListener('click', handleUserInteraction);
    window.removeEventListener('keydown', handleUserInteraction);
    window.removeEventListener('touchstart', handleUserInteraction);
  };

  // Detectar interacción del usuario para inicializar
  window.addEventListener('scroll', handleUserInteraction, { passive: true });
  window.addEventListener('click', handleUserInteraction, { passive: true });
  window.addEventListener('keydown', handleUserInteraction, { passive: true });
  window.addEventListener('touchstart', handleUserInteraction, { passive: true });

  // Fallback: inicializar después de 3 segundos aunque no haya interacción
  setTimeout(() => {
    if (!analyticsInitialized) {
      initializeTracking();
    }
  }, 3000);
  
  if (ANALYTICS_CONFIG.DEBUG_MODE) {
    console.log('📊 Sistema de Analytics preparado para inicialización lazy');
  }
};

// Exportar configuración para debugging
export const getAnalyticsConfig = () => ANALYTICS_CONFIG;