// Analytics y tracking utilities

// Google Analytics 4
export const initGA4 = (measurementId: string) => {
  // Script para Google Analytics 4
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `;
  document.head.appendChild(script2);
};

// Track events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, parameters);
  }
};

// Track form submissions
export const trackFormSubmission = (formType: string) => {
  trackEvent('form_submit', {
    form_type: formType,
    page_location: window.location.href,
    page_title: document.title
  });
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    click_location: location,
    page_location: window.location.href
  });
};

// Track scroll depth
export const trackScrollDepth = () => {
  let maxScroll = 0;
  const trackingThresholds = [25, 50, 75, 90, 100];

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / documentHeight) * 100);

    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      
      for (const threshold of trackingThresholds) {
        if (scrollPercent >= threshold && maxScroll < threshold) {
          trackEvent('scroll_depth', {
            scroll_depth: threshold,
            page_location: window.location.href
          });
          break;
        }
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Cleanup function
  return () => window.removeEventListener('scroll', handleScroll);
};

// Facebook Pixel
export const initFacebookPixel = (pixelId: string) => {
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
};

// LinkedIn Insight Tag
export const initLinkedInInsight = (partnerId: string) => {
  const script = document.createElement('script');
  script.innerHTML = `
    _linkedin_partner_id = "${partnerId}";
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(_linkedin_partner_id);
  `;
  document.head.appendChild(script);

  const script2 = document.createElement('script');
  script2.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
  script2.async = true;
  document.head.appendChild(script2);
};

// Performance monitoring
export const measurePerformance = () => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        trackEvent('page_performance', {
          page_load_time: Math.round(perfData.loadEventEnd - perfData.navigationStart),
          dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.navigationStart),
          first_paint: Math.round(perfData.responseEnd - perfData.navigationStart),
          page_url: window.location.href
        });
      }, 1000);
    });
  }
};

// Initialize all analytics
export const initAnalytics = () => {
  // Uncomment and add your IDs when ready for production
  // initGA4('G-XXXXXXXXXX');
  // initFacebookPixel('XXXXXXXXXX');
  // initLinkedInInsight('XXXXXXXXXX');
  
  measurePerformance();
  trackScrollDepth();
  
  console.log('📊 Analytics initialized - Ready for production IDs');
};