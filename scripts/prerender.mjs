// scripts/prerender.mjs — Genera un HTML estático por cada página (SEO, enlaces directos y 404 reales).
//
// Se ejecuta en `npm run build`, después de:
//   1. vite build                              → dist/ (bundle del navegador + index.html plantilla)
//   2. vite build --ssr src/entry-server.tsx   → dist-ssr/entry-server.js (renderizado en Node)
// Resultado: dist/index.html, dist/<ruta>/index.html, dist/404.html y dist/sitemap.xml.
// Sin dependencias nuevas: usa react-dom/server, ya incluido en el proyecto.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');
const SITE_URL = 'https://maastac.com';

const fail = (msg) => {
  console.error(`✖ prerender: ${msg}`);
  process.exit(1);
};

const templatePath = join(dist, 'index.html');
if (!existsSync(templatePath)) fail('falta dist/index.html (¿se ejecutó vite build?)');
const template = readFileSync(templatePath, 'utf8');
if (!template.includes('<!--app-head-->') || !template.includes('<!--app-html-->')) {
  fail('la plantilla no contiene los marcadores <!--app-head--> y <!--app-html-->');
}

const { prerenderPages } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);
const pages = prerenderPages();

const seen = new Set();
for (const page of pages) {
  if (seen.has(page.file)) fail(`archivo duplicado: ${page.file}`);
  seen.add(page.file);
  if (!page.html || page.html.length < 500) fail(`HTML vacío o demasiado corto para ${page.path}`);

  const out = template.replace('<!--app-head-->', page.head).replace('<!--app-html-->', page.html);
  const target = join(dist, page.file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, out, 'utf8');
  console.log(`✓ ${page.path.padEnd(26)} → dist/${page.file}`);
}

// Sitemap: solo páginas indexables (sin borradores legales ni la 404).
const today = new Date().toISOString().slice(0, 10);
const urls = pages
  .filter((p) => p.inSitemap)
  .map((p) => {
    const loc = `${SITE_URL}${p.path === '/' ? '/' : p.path}`;
    const priority = p.path === '/' ? '1.0' : '0.8';
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join('\n');
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  'utf8',
);
console.log(`✓ sitemap.xml (${pages.filter((p) => p.inSitemap).length} URL)`);

// El bundle de Node no se publica.
rmSync(ssrDir, { recursive: true, force: true });
