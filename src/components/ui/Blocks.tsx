// src/components/ui/Blocks.tsx — Piezas visuales reutilizables: icono, lista de verificación, tarjeta y FAQ.
import type { ComponentType, ReactNode } from 'react';
import type { IconProps } from 'phosphor-react';
import { CheckCircle, Plus } from 'phosphor-react';

export function FeatureIcon({ Icon, dark = false }: { Icon: ComponentType<IconProps>; dark?: boolean }) {
  return (
    <span
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
        dark ? 'bg-white/10 text-sky-300 ring-1 ring-white/15' : 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'
      }`}
      aria-hidden="true"
    >
      <Icon size={22} weight="duotone" />
    </span>
  );
}

export function CheckList({ items, dark = false, className = '' }: { items: ReactNode[]; dark?: boolean; className?: string }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <CheckCircle
            size={20}
            weight="duotone"
            className={`mt-0.5 shrink-0 ${dark ? 'text-sky-300' : 'text-blue-600'}`}
            aria-hidden="true"
          />
          <span className={dark ? 'text-slate-200' : 'text-slate-700'}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Card({ children, className = '', dark = false }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <div
      className={`rounded-2xl p-6 md:p-7 ${
        dark
          ? 'border border-white/10 bg-white/[0.04]'
          : 'border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.03]'
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** Preguntas frecuentes con <details>: accesibles con teclado y legibles sin JavaScript. */
export function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
      {faqs.map((faq) => (
        <details key={faq.q} className="group px-5 md:px-7">
          <summary className="flex items-center justify-between gap-4 py-5 text-left font-semibold text-slate-900 hover:text-blue-700">
            {faq.q}
            <Plus
              size={18}
              weight="bold"
              className="shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-45"
              aria-hidden="true"
            />
          </summary>
          <p className="pb-5 pr-8 leading-relaxed text-slate-600">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}
