// src/components/contact/ContactSection.tsx — Bloque de contacto: formulario + qué incluye la evaluación +
// contacto directo (WhatsApp y email). Datos de contacto centralizados en src/config/contact.ts.
import { EnvelopeSimple, WhatsappLogo } from 'phosphor-react';
import { CONTACT_EMAIL, WHATSAPP_DISPLAY, whatsappUrl } from '../../config/contact';
import { trackEmailClick, trackWhatsAppClick } from '../../utils/events';
import type { Interest } from '../../utils/contactIntent';
import { CheckList } from '../ui/Blocks';
import { SectionHeader } from '../ui/Section';
import ContactForm from './ContactForm';

const EVALUATION_INCLUDES = [
  'Revisión de tus procesos y de las herramientas que usas hoy.',
  'Oportunidades concretas para construir, automatizar o integrar.',
  'Recomendación de por dónde empezar.',
  'Propuesta con alcance, plazos y costo si decides avanzar.',
];

export function DirectContact({ location, whatsappMessage }: { location: string; whatsappMessage?: string }) {
  return (
    <ul className="space-y-3">
      <li>
        <a
          href={whatsappUrl(whatsappMessage ?? 'Hola, quiero solicitar una evaluación gratuita')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick(location)}
          data-cta={`${location}_whatsapp`}
          className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300" aria-hidden="true">
            <WhatsappLogo size={22} weight="duotone" />
          </span>
          <span>
            <span className="block text-sm text-slate-400">WhatsApp</span>
            <span className="block font-semibold text-white">{WHATSAPP_DISPLAY}</span>
          </span>
        </a>
      </li>
      <li>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          onClick={() => trackEmailClick(location)}
          data-cta={`${location}_email`}
          className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/15 text-sky-300" aria-hidden="true">
            <EnvelopeSimple size={22} weight="duotone" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm text-slate-400">Email</span>
            <span className="block break-words font-semibold text-white">{CONTACT_EMAIL}</span>
          </span>
        </a>
      </li>
    </ul>
  );
}

export default function ContactSection({
  id = 'contact',
  location,
  defaultInterest,
  eyebrow = 'Evaluación gratuita',
  title = 'Cuéntanos qué quieres',
  highlight = 'construir, automatizar o integrar',
  lead = 'Revisamos tu caso sin compromiso y te proponemos por dónde empezar. Respondemos personalmente cada solicitud.',
  submitLabel,
}: {
  id?: string;
  location: string;
  defaultInterest?: Interest;
  eyebrow?: string;
  title?: string;
  highlight?: string;
  lead?: string;
  submitLabel?: string;
}) {
  return (
    <section id={id} className="relative bg-slate-50 py-16 md:py-24" aria-labelledby={`${id}-heading`}>
      <div className="container">
        <SectionHeader id={`${id}-heading`} eyebrow={eyebrow} title={title} highlight={highlight} lead={lead} />

        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-9">
            <ContactForm location={location} defaultInterest={defaultInterest} submitLabel={submitLabel} />
          </div>

          <aside className="space-y-6" aria-label="Información de la evaluación y contacto directo">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-7">
              <h3 className="mb-4 text-lg font-bold text-slate-900">Qué incluye la evaluación</h3>
              <CheckList items={EVALUATION_INCLUDES} />
              <p className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-500">
                Sin costo ni compromiso. Si decides avanzar, el alcance se define por escrito antes de empezar.
              </p>
            </div>
            <div className="rounded-2xl bg-brand-dark p-6 text-white md:p-7">
              <h3 className="mb-1 text-lg font-bold">¿Prefieres hablar directamente?</h3>
              <p className="mb-5 text-sm text-slate-300">Escríbenos y te responde quien llevará tu proyecto.</p>
              <DirectContact location={location} />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
