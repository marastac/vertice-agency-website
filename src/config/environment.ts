// src/config/environment.ts — ¿Estamos en el dominio oficial de producción?
//
// GA4, Meta Pixel, las conversiones (generate_lead / Lead) y el envío real del formulario a Formspree
// SOLO funcionan en estos dominios. En local (localhost) y en las vistas previas de Vercel (*.vercel.app)
// quedan desactivados: así las pruebas no ensucian la analítica, no cuentan como conversiones de Google Ads
// ni crean leads reales ni consumen la cuota de Formspree.
// ⚠️ public/gracias.html repite esta lista: mantenerlas sincronizadas.
export const PRODUCTION_HOSTS = ['maastac.com', 'www.maastac.com'];

export const isProductionHost = (hostname?: string): boolean => {
  try {
    const host = hostname ?? window.location.hostname;
    return PRODUCTION_HOSTS.includes(host.toLowerCase());
  } catch {
    return false; // sin window (prerender en Node): nunca se considera producción
  }
};
