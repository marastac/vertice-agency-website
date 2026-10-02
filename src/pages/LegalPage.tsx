// src/pages/LegalPage.tsx — Plantilla de páginas legales (/privacidad, /terminos, /cookies, /aviso-legal).
// Contenido en legalContent.ts. Mientras `draft` sea true: noindex + aviso de borrador visible.
import { openCookieSettings } from '../consent/consent';
import { COOKIE_INVENTORY, LEGAL_PAGES } from './legalContent';
import type { Block, Inline, LegalPageDef } from './legalContent';
import { usePageMeta } from './usePageMeta';

function InlineText({ content }: { content: Inline[] }) {
  return (
    <>
      {content.map((part, i) =>
        typeof part === 'string' ? (
          <span key={i}>{part}</span>
        ) : (
          <a key={i} href={part.href} className="font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900">
            {part.label}
          </a>
        ),
      )}
    </>
  );
}

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

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'p':
      return (
        <p className="text-gray-700 leading-relaxed">
          <InlineText content={block.content} />
        </p>
      );
    case 'ul':
      return (
        <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed">
          {block.items.map((item, i) => (
            <li key={i}>
              <InlineText content={item} />
            </li>
          ))}
        </ul>
      );
    case 'cookie-table':
      return <CookieTable />;
    case 'cookie-settings-button':
      return (
        <button
          type="button"
          onClick={openCookieSettings}
          className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 font-semibold text-white hover:shadow-lg"
        >
          Configurar cookies
        </button>
      );
  }
}

export default function LegalPage({ page }: { page: LegalPageDef }) {
  usePageMeta(`${page.title} | MAASTAC`, page.draft ? 'noindex,follow' : undefined);
  const pendingCount = page.sections.filter((s) => s.pending).length;

  return (
    <main className="bg-white pt-28 pb-20 md:pt-36">
      <article className="container max-w-3xl mx-auto" aria-labelledby="legal-title">
        <h1 id="legal-title" className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
          {page.title}
        </h1>

        {page.draft && (
          <div role="note" data-legal-draft className="mb-8 rounded-xl border-2 border-amber-300 bg-amber-50 p-4 text-amber-900">
            <p className="font-semibold">Documento en preparación</p>
            <p className="text-sm">
              Este texto todavía no es definitivo.
              {pendingCount > 0 &&
                ` Hay ${pendingCount} ${pendingCount === 1 ? 'apartado pendiente' : 'apartados pendientes'} de completar antes del lanzamiento comercial.`}
            </p>
          </div>
        )}

        <p className="mb-8 text-lg text-gray-700 leading-relaxed">
          <InlineText content={page.intro} />
        </p>

        <nav aria-label="Contenido de la página" className="mb-10 rounded-xl bg-gray-50 p-5">
          <p className="mb-2 text-sm font-semibold text-gray-900">Contenido</p>
          <ol className="grid gap-1 text-sm sm:grid-cols-2">
            {page.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-blue-700 hover:underline">
                  {s.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-10">
          {page.sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-28 space-y-4">
              <h2 id={`${section.id}-title`} className="text-xl md:text-2xl font-bold text-gray-900">
                {section.heading}
              </h2>
              {section.blocks.map((block, i) => (
                <BlockView key={i} block={block} />
              ))}
              {section.pending && (
                <p role="note" data-legal-pending className="rounded-lg border border-dashed border-amber-400 bg-amber-50/60 px-4 py-3 text-sm text-amber-900">
                  <span className="font-semibold">Pendiente: </span>
                  {section.pending}
                </p>
              )}
            </section>
          ))}
        </div>

        <nav aria-label="Otras páginas legales" className="mt-12 flex flex-wrap gap-4 border-t border-gray-100 pt-6 text-sm">
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
