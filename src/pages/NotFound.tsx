// src/pages/NotFound.tsx — Página 404 para rutas desconocidas.
// Nota: al ser una SPA servida por la reescritura de Vercel, el servidor responde 200 ("soft 404");
// por eso se marca noindex para que no se indexe.
import { usePageMeta } from './usePageMeta';

export default function NotFound() {
  usePageMeta('Página no encontrada | MAASTAC', 'noindex');

  return (
    <main className="bg-white pt-32 pb-24 md:pt-40">
      <div className="container max-w-2xl mx-auto text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Error 404</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-black text-gray-900">Página no encontrada</h1>
        <p className="mt-4 text-gray-600">El enlace que abriste no existe o fue movido.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white hover:shadow-lg"
          >
            Volver al inicio
          </a>
          <a
            href="/#contact"
            className="inline-flex items-center justify-center rounded-xl border-2 border-gray-200 px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50"
          >
            Contactar
          </a>
        </div>
      </div>
    </main>
  );
}
