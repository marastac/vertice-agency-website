// src/entry-server.tsx — Entrada de renderizado para el prerender (solo se usa en el build, nunca en el navegador).
// scripts/prerender.mjs la importa desde dist-ssr/ y genera un HTML estático por cada ruta de src/routes.ts.
import { renderToString } from 'react-dom/server';
import App from './App';
import { NOT_FOUND_ROUTE, ROUTES } from './routes';
import type { RouteDef } from './routes';
import { renderHead } from './seo/head';

export interface PrerenderPage {
  path: string;
  /** Ruta del archivo dentro de dist/ ("index.html", "nosotros/index.html", "404.html"). */
  file: string;
  head: string;
  html: string;
  inSitemap: boolean;
}

const fileFor = (route: RouteDef) => {
  if (route.kind === 'not-found') return '404.html';
  if (route.path === '/') return 'index.html';
  return `${route.path.slice(1)}/index.html`;
};

export function prerenderPages(): PrerenderPage[] {
  return [...ROUTES, NOT_FOUND_ROUTE].map((route) => ({
    path: route.path,
    file: fileFor(route),
    head: renderHead(route),
    html: renderToString(<App path={route.path} />),
    inSitemap: route.inSitemap,
  }));
}
