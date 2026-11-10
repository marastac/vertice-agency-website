// src/pages/NotFound.tsx — Página 404. Se prerenderiza en dist/404.html y Vercel la sirve con estado 404
// real para cualquier URL que no exista (sin reescrituras genéricas que oculten el error).
import { ArrowRight } from 'phosphor-react';
import { CtaLink } from '../components/ui/CtaLink';
import { AREAS } from '../content/areas';

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-brand-dark pb-24 pt-32 text-white md:pt-40" aria-labelledby="page-title">
      <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden="true" />
      <div className="container relative max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sky-300">Error 404</p>
        <h1 id="page-title" className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
          Página no encontrada
        </h1>
        <p className="mt-4 text-lg text-slate-300">El enlace que abriste no existe o fue movido.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <CtaLink href="/" cta="404_home" variant="light">
            Volver al inicio
          </CtaLink>
          <CtaLink href="/contacto" cta="404_contacto" variant="outline-light" contactIntent location="404">
            Contactar
          </CtaLink>
        </div>
        <ul className="mt-12 grid gap-3 text-left sm:grid-cols-3">
          {AREAS.map((area) => (
            <li key={area.id}>
              <a href={area.path} className="flex h-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10">
                {area.name}
                <ArrowRight size={14} weight="bold" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
