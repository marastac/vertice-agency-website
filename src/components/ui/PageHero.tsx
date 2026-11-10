// src/components/ui/PageHero.tsx — Cabecera oscura de las páginas interiores (con migas de pan visibles).
import type { ReactNode } from 'react';
import { CaretRight } from 'phosphor-react';
import { Eyebrow } from './Section';

export function PageHero({
  eyebrow,
  title,
  highlight,
  lead,
  crumb,
  children,
  aside,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  lead: ReactNode;
  /** Nombre de la página actual en las migas de pan. */
  crumb: string;
  /** CTAs bajo el texto. */
  children?: ReactNode;
  /** Contenido opcional a la derecha en escritorio. */
  aside?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-dark pb-16 pt-28 text-white md:pb-24 md:pt-36" aria-labelledby="page-title">
      <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden="true" />
      <div className="container relative">
        <nav aria-label="Migas de pan" className="mb-8 text-sm text-slate-400">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <a href="/" className="hover:text-white">
                Inicio
              </a>
            </li>
            <li aria-hidden="true">
              <CaretRight size={12} weight="bold" />
            </li>
            <li aria-current="page" className="text-slate-200">
              {crumb}
            </li>
          </ol>
        </nav>

        <div className={aside ? 'grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]' : ''}>
          <div className="max-w-3xl motion-safe:animate-fade-up">
            <Eyebrow dark>{eyebrow}</Eyebrow>
            <h1 id="page-title" className="text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-[3.4rem]">
              {title}
              {highlight && (
                <>
                  {' '}
                  <span className="text-gradient-light">{highlight}</span>
                </>
              )}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">{lead}</p>
            {children && <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{children}</div>}
          </div>
          {aside && <div className="hidden lg:block">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
