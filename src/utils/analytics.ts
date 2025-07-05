// Analytics y tracking utilities optimizados

// Lazy loading de scripts para mejorar performance
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

// Google Analytics 4 con lazy loading
export const initGA4 = async (measurementId: string) => {
  try {
    // Cargar script de forma lazy
    await loadScriptAsync(
      `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
      'ga-script'
    );
    
    // Configurar gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    const gtag = (...args: any[]) => {
      (window as any).dataLayer.push(args);
    };
    
    gtag('js', new Date());
    gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    
    // Hacer gtag disponible globalmente
    (window as any).gtag = gtag;
    
    console.log('✅ Google Analytics 4 inicializado');
  } catch (error) {
    console.error('❌ Error al cargar Google Analytics:', error);
  }
};

// Track events optimizado
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, {
      ...parameters,
      timestamp: Date.now(),
    });
  }
};

// Track form submissions con debounce
let formSubmissionTimeout: any;
export const trackFormSubmission = (formType: string, debounceMs: number = 1000) => {
  clearTimeout(formSubmissionTimeout);
  formSubmissionTimeout = setTimeout(() => {
    trackEvent('form_submit', {
      form_type: formType,
      page_location: window.location.href,
      page_title: document.title,
      timestamp: new Date().toISOString(),
    });
  }, debounceMs);
};

// Track button clicks optimizado
export const trackButtonClick = (buttonName: string, location: string) => {
  // Usar requestIdleCallback para mejor performance
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      trackEvent('button_click', {
        button_name: buttonName,
        click_location: location,
        page_location: window.location.href,
      });
    });
  } else {
    // Fallback para browsers que no soportan requestIdleCallback
    setTimeout(() => {
      trackEvent('button_click', {
        button_name: buttonName,
        click_location: location,
        page_location: window.location.href,
      });
    }, 0);
  }
};

// Track scroll depth optimizado con throttling
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
                page_location: window.location.href,
              });
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

// Facebook Pixel con lazy loading
export const initFacebookPixel = async (pixelId: string) => {
  try {
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
    console.log('✅ Facebook Pixel inicializado');
  } catch (error) {
    console.error('❌ Error al cargar Facebook Pixel:', error);
  }
};

// LinkedIn Insight Tag con lazy loading
export const initLinkedInInsight = async (partnerId: string) => {
  try {
    const script = document.createElement('script');
    script.innerHTML = `
      _linkedin_partner_id = "${partnerId}";
      window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
      window._linkedin_data_partner_ids.push(_linkedin_partner_id);
    `;
    document.head.appendChild(script);

    await loadScriptAsync('https://snap.licdn.com/li.lms-analytics/insight.min.js', 'linkedin-insight');
    console.log('✅ LinkedIn Insight Tag inicializado');
  } catch (error) {
    console.error('❌ Error al cargar LinkedIn Insight:', error);
  }
};

// Performance monitoring mejorado
export const measurePerformance = () => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navEntries = performance.getEntriesByType('navigation');
        if (navEntries.length > 0) {
          const perfData = navEntries[0] as PerformanceNavigationTiming;
          
          trackEvent('page_performance', {
            page_load_time: Math.round(perfData.loadEventEnd - perfData.navigationStart),
            dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.navigationStart),
            first_paint: Math.round(perfData.responseEnd - perfData.navigationStart),
            ttfb: Math.round(perfData.responseStart - perfData.navigationStart),
            page_url: window.location.href,
          });
        }
      }, 1000);
    });
  }
};

// Initialize all analytics con lazy loading
export const initAnalytics = () => {
  // Inicializar analytics después de que el usuario interactúe
  const initializeTracking = () => {
    setTimeout(() => {
      initGA4('G-YN77ENMF5B');
      measurePerformance();
      trackScrollDepth();
    }, 1000);
  };

  // Inicializar cuando el usuario haga scroll o click
  const handleUserInteraction = () => {
    initializeTracking();
    
    // Remover listeners después de la primera interacción
    window.removeEventListener('scroll', handleUserInteraction);
    window.removeEventListener('click', handleUserInteraction);
    window.removeEventListener('keydown', handleUserInteraction);
  };

  // Agregar listeners para detectar interacción del usuario
  window.addEventListener('scroll', handleUserInteraction, { passive: true });
  window.addEventListener('click', handleUserInteraction, { passive: true });
  window.addEventListener('keydown', handleUserInteraction, { passive: true });

  // Fallback: inicializar después de 3 segundos aunque no haya interacción
  setTimeout(() => {
    initializeTracking();
  }, 3000);
  
  console.log('📊 Sistema de Analytics inicializado');
};