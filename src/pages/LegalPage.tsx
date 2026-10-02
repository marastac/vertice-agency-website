// src/pages/LegalPage.tsx — Plantilla de páginas legales (/privacidad, /terminos, /cookies, /aviso-legal).
// Ver legalContent.ts: son BORRADORES sin datos legales inventados.
import { openCookieSettings } from '../consent/consent';
import { COOKIE_INVENTORY, LEGAL_PAGES } from './legalContent';
import type { LegalPageDef } from './legalContent';
import { usePageMeta } from './usePageMeta';

function CookieTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">Nombre</th>
            <th scope="col" className="px-4 py-3 font-semibold">Tipo</th>
            <th scope="col" className="px-4 py-3 font-semibold">Proveedor</th>
            <th scope="col" className="px-4 py-3 font-semibold">Categoría</th>
            <th scope="col" className="px-4 py-3 font-semibold">Finalidad</th>
            <th scope="col" className="px-4 py-3 font-semibold">Duración</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-gray-700">
          {COOKIE_INVENTORY.map((row) => (
            <tr key={row.name}>
              <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{row.name}</td>
              <td className="px-4 py-3">{row.type}</td>
              <td className="px-4 py-3">{row.provider}</td>
              <td className="px-4 py-3">{row.category}</td>
              <td className="px-4 py-3">{row.purpose}</td>
              <td className="px-4 py-3">{row.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LegalPage({ page }: { page: LegalPageDef }) {
  usePageMeta(`${page.title} | MAASTAC`, page.draft ? 'noindex,follow' : undefined);

  return (
    <main className="bg-white pt-28 pb-20 md:pt-36">
      <article className="container max-w-3xl mx-auto" aria-labelledby="legal-title">
        <h1 id="legal-title" className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
          {page.title}
        </h1>

        {page.draft && (
          <div role="note" className="mb-8 rounded-xl border-2 border-amber-300 bg-amber-50 p-4 text-amber-900">
            <p className="font-semibold">Documento en preparación</p>
            <p className="text-sm">
              Este texto todavía no es definitivo. Estamos completando la información legal de esta página.
            </p>
          </div>
        )}

        {page.kind === 'cookies' && (
          <section className="mb-10 space-y-4 text-gray-700 leading-relaxed">
            <p>
              Esta web solo usa almacenamiento estrictamente necesario de forma predeterminada. Google Analytics
              (analítica) y Meta Pixel (marketing) únicamente se cargan si los aceptas, y puedes cambiar tu elección en
              cualquier momento.
            </p>
            <button
              type="button"
              onClick={openCookieSettings}
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 font-semibold text-white hover:shadow-lg"
            >
              Configurar cookies
            </button>
            <h2 className="pt-4 text-xl font-bold text-gray-900">Cookies y almacenamiento utilizados</h2>
            <CookieTable />
          </section>
        )}

        <section aria-labelledby="pending-title" className="rounded-xl border border-dashed border-gray-300 p-5">
          <h2 id="pending-title" className="text-lg font-bold text-gray-900 mb-3">
            Apartados pendientes de completar
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            {page.pendingSections.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        <nav aria-label="Otras páginas legales" className="mt-10 flex flex-wrap gap-4 text-sm">
          {LEGAL_PAGES.filter((p) => p.path !== page.path).map((p) => (
            <a key={p.path} href={p.path} className="text-blue-700 underline underline-offset-2 hover:text-blue-900">
              {p.title}
            </a>
          ))}
          <a href="/" className="text-blue-700 underline underline-offset-2 hover:text-blue-900">
            Volver al inicio
          </a>
        </nav>
      </article>
    </main>
  );
}
