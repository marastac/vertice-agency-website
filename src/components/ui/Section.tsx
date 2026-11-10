// src/components/ui/Section.tsx — Secciones y encabezados con un ritmo visual común.
import type { ReactNode } from 'react';

type Tone = 'white' | 'muted' | 'dark';

const TONES: Record<Tone, string> = {
  white: 'bg-white',
  muted: 'bg-slate-50 border-y border-slate-100',
  dark: 'bg-brand-dark text-white',
};

export function Section({
  id,
  tone = 'white',
  labelledBy,
  className = '',
  children,
}: {
  id?: string;
  tone?: Tone;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`relative py-16 md:py-24 ${TONES[tone]} ${className}`}>
      {tone === 'dark' && <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden="true" />}
      <div className="container relative">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p
      className={`mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] ${
        dark ? 'text-sky-300' : 'text-blue-700'
      }`}
    >
      <span className={`h-px w-6 ${dark ? 'bg-sky-300/70' : 'bg-blue-600/60'}`} aria-hidden="true" />
      {children}
    </p>
  );
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  highlight,
  lead,
  align = 'left',
  dark = false,
  as: Heading = 'h2',
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  /** Parte final del título resaltada con el degradado de marca. */
  highlight?: string;
  lead?: ReactNode;
  align?: 'left' | 'center';
  dark?: boolean;
  as?: 'h1' | 'h2';
}) {
  const centered = align === 'center';
  return (
    <div className={`mb-10 md:mb-14 ${centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}>
      {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
      <Heading
        id={id}
        className={`text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-[2.75rem] ${
          dark ? 'text-white' : 'text-slate-900'
        }`}
      >
        {title}
        {highlight && (
          <>
            {' '}
            <span className={dark ? 'text-gradient-light' : 'text-gradient'}>{highlight}</span>
          </>
        )}
      </Heading>
      {lead && (
        <p className={`mt-5 text-lg leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{lead}</p>
      )}
    </div>
  );
}
