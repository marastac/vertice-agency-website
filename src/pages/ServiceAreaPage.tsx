// src/pages/ServiceAreaPage.tsx — Plantilla de las páginas de servicio (/software/a-medida, /automatizacion-ia,
// /sistemas-integraciones). Pensadas también como landing pages de campañas: el formulario está en la misma
// página (#contacto), así que los parámetros utm_* de la URL de llegada se conservan en la solicitud.
import { ArrowRight, WhatsappLogo } from 'phosphor-react';
import ContactSection from '../components/contact/ContactSection';
import { Card, CheckList, FaqList, FeatureIcon } from '../components/ui/Blocks';
import { CtaLink } from '../components/ui/CtaLink';
import { PageHero } from '../components/ui/PageHero';
import { Section, SectionHeader } from '../components/ui/Section';
import { whatsappUrl } from '../config/contact';
import { SERVICES } from '../config/services';
import type { ServiceAreaId } from '../config/services';
import { AREAS, findArea } from '../content/areas';
import { PROCESS_STEPS } from '../content/company';
import { fbqEvent, trackEvent } from '../utils/analytics';
import { selectContactInterest } from '../utils/contactIntent';
import { trackServiceInterest, trackWhatsAppClick } from '../utils/events';

export default function ServiceAreaPage({ areaId }: { areaId: ServiceAreaId }) {
  const area = findArea(areaId);
  const services = SERVICES.filter((s) => s.area === area.id);
  const others = AREAS.filter((a) => a.id !== area.id);

  return (
    <>
      <PageHero
        eyebrow={area.eyebrow}
        title={area.title}
        highlight={area.titleHighlight}
        lead={area.lead}
        crumb={area.name}
        aside={
          <Card dark>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">Incluye</p>
            <ul className="space-y-4">
              {services.map((s) => (
                <li key={s.id} className="flex gap-3">
                  <FeatureIcon Icon={s.Icon} dark />
                  <span>
                    <span className="block font-semibold text-white">{s.name}</span>
                    <span className="block text-sm text-slate-400">{s.tagline}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        }
      >
        <CtaLink href="#contacto" cta={`${area.id}_hero_cta`} variant="primary" size="lg" contactIntent location={`${area.id}_hero`}>
          {area.ctaLabel}
          <ArrowRight size={18} weight="bold" aria-hidden="true" />
        </CtaLink>
        <CtaLink
          href={whatsappUrl(`Hola, quiero consultar sobre ${area.name.toLowerCase()}`)}
          cta={`${area.id}_hero_whatsapp`}
          variant="outline-light"
          size="lg"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick(`${area.id}_hero`)}
        >
          <WhatsappLogo size={20} weight="duotone" aria-hidden="true" />
          Escribir por WhatsApp
        </CtaLink>
      </PageHero>

      {/* Problemas */}
      <Section labelledBy="problemas-heading">
        <SectionHeader id="problemas-heading" eyebrow="El problema" title="¿Te suena familiar?" />
        <ul className="grid gap-5 md:grid-cols-3">
          {area.problems.map((p, i) => (
            <li key={p.title}>
              <Card className="h-full">
                <span className="text-sm font-semibold tabular-nums text-blue-700">0{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{p.text}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      {/* Servicios del área */}
      <Section tone="muted" labelledBy="servicios-area-heading">
        <SectionHeader
          id="servicios-area-heading"
          eyebrow="Qué hacemos"
          title="Servicios incluidos en"
          highlight={area.name}
          lead="El alcance exacto se define en la propuesta según tu caso."
        />
        <ul className={`grid gap-5 ${services.length === 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2'}`}>
          {services.map((s) => (
            <li key={s.id} className="flex">
              <article className="flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 md:p-7" aria-labelledby={`srv-${s.id}`}>
                <FeatureIcon Icon={s.Icon} />
                <h3 id={`srv-${s.id}`} className="mt-4 text-xl font-semibold text-slate-900">
                  {s.name}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{s.problem}</p>
                <p className="mb-3 mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500">Puede incluir</p>
                <CheckList items={s.includes} />
                {s.note && <p className="mt-4 text-sm leading-relaxed text-slate-500">{s.note}</p>}
                <a
                  href="#contacto"
                  className="mt-6 inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
                  data-cta={`service_cta_${s.id}`}
                  onClick={() => {
                    // Eventos existentes (se conservan) + service_interest.
                    trackEvent('service_cta_click', { service_name: s.name });
                    fbqEvent('trackCustom', 'ServiceCTA', { service_name: s.name });
                    trackServiceInterest(s.id, `${area.id}_page`);
                    selectContactInterest(s.id);
                  }}
                >
                  Consultar este servicio
                  <ArrowRight size={14} weight="bold" aria-hidden="true" />
                </a>
              </article>
            </li>
          ))}
        </ul>
      </Section>

      {/* Para quién y qué recibes */}
      <Section labelledBy="entregables-heading">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader id="entregables-heading" eyebrow="Qué recibes" title="Un trabajo ordenado," highlight="de principio a fin" />
            <CheckList items={area.deliverables} />
          </div>
          <div>
            <SectionHeader eyebrow="Para quién es" title="Pensado para" highlight="empresas como la tuya" />
            <CheckList items={area.audience} />
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <p className="mb-3 text-sm font-semibold text-slate-900">Casos de uso habituales</p>
              <ul className="flex flex-wrap gap-2">
                {area.useCases.map((u) => (
                  <li key={u} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700">
                    {u}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Proceso */}
      <Section tone="dark" labelledBy="proceso-heading">
        <SectionHeader id="proceso-heading" eyebrow="Cómo trabajamos" title="Cuatro pasos," highlight="sin sorpresas" dark />
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map(({ title, text, Icon }, i) => (
            <li key={title}>
              <Card dark className="h-full">
                <div className="mb-4 flex items-center justify-between">
                  <FeatureIcon Icon={Icon} dark />
                  <span className="text-sm font-semibold tabular-nums text-slate-500">0{i + 1}</span>
                </div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
              </Card>
            </li>
          ))}
        </ol>
      </Section>

      {/* Preguntas frecuentes */}
      <Section labelledBy="faq-heading">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            id="faq-heading"
            eyebrow="Preguntas frecuentes"
            title="Lo que suelen"
            highlight="preguntarnos"
            lead="¿Tienes otra duda? Escríbenos y te respondemos sin compromiso."
          />
          <FaqList faqs={area.faqs} />
        </div>
      </Section>

      <ContactSection
        id="contacto"
        location={area.id}
        defaultInterest={area.defaultInterest}
        eyebrow="Evaluación gratuita"
        title="Cuéntanos tu caso y te proponemos"
        highlight="por dónde empezar"
        submitLabel={area.ctaLabel}
      />

      {/* Otras áreas */}
      <Section labelledBy="otras-heading">
        <h2 id="otras-heading" className="mb-6 text-xl font-semibold text-slate-900">
          También te puede interesar
        </h2>
        <ul className="grid gap-5 md:grid-cols-2">
          {others.map((o) => (
            <li key={o.id}>
              <a
                href={o.path}
                className="group flex h-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
                data-cta={`${area.id}_cross_${o.id}`}
              >
                <FeatureIcon Icon={o.Icon} />
                <span>
                  <span className="flex items-center gap-2 font-semibold text-slate-900">
                    {o.name}
                    <ArrowRight size={14} weight="bold" className="text-slate-400 group-hover:text-blue-700" aria-hidden="true" />
                  </span>
                  <span className="mt-1 block text-[15px] text-slate-600">{o.summary}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
