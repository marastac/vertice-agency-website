// src/components/ui/CtaBand.tsx — Llamada a la acción de cierre de página (oscura, con WhatsApp como alternativa).
import { ArrowRight, WhatsappLogo } from 'phosphor-react';
import { whatsappUrl } from '../../config/contact';
import { trackWhatsAppClick } from '../../utils/events';
import { CtaLink } from './CtaLink';

export function CtaBand({
  title,
  text,
  href = '/contacto',
  label = 'Solicitar evaluación gratuita',
  cta,
  location,
  whatsappMessage = 'Hola, quiero solicitar una evaluación gratuita',
}: {
  title: string;
  text: string;
  href?: string;
  label?: string;
  cta: string;
  location: string;
  whatsappMessage?: string;
}) {
  return (
    <section className="bg-white py-16 md:py-20" aria-labelledby={`${cta}-title`}>
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-brand-dark px-6 py-12 text-white md:px-14 md:py-14">
          <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden="true" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 id={`${cta}-title`} className="text-2xl font-bold tracking-tight md:text-3xl">
                {title}
              </h2>
              <p className="mt-3 text-lg text-slate-300">{text}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <CtaLink href={href} cta={cta} variant="light" size="lg" contactIntent location={location}>
                {label}
                <ArrowRight size={18} weight="bold" aria-hidden="true" />
              </CtaLink>
              <CtaLink
                href={whatsappUrl(whatsappMessage)}
                cta={`${cta}_whatsapp`}
                variant="outline-light"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick(location)}
              >
                <WhatsappLogo size={20} weight="duotone" aria-hidden="true" />
                WhatsApp
              </CtaLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
