// src/pages/LeadAIPage.tsx — Producto propio Lead AI (separado de los servicios de la agencia).
// Solo capacidades confirmadas (ver src/content/company.ts). No prometer demos, pruebas ni precios.
import { ArrowRight, Info } from 'phosphor-react';
import ContactSection from '../components/contact/ContactSection';
import { Card, CheckList, FaqList, FeatureIcon } from '../components/ui/Blocks';
import { CtaLink } from '../components/ui/CtaLink';
import { PageHero } from '../components/ui/PageHero';
import { Section, SectionHeader } from '../components/ui/Section';
import { LEAD_AI_CAPABILITIES, LEAD_AI_NOTICE, LEAD_AI_STEPS } from '../content/company';
import { gtagEvent } from '../utils/analytics';

const FOR_WHO = [
  'Empresas que reciben consultas por la web y no saben cuáles atender primero.',
  'Equipos comerciales que quieren calificar a cada prospecto antes de llamarlo.',
  'Negocios que ya usan HubSpot y quieren que los leads lleguen ordenados.',
];

const FAQS = [
  {
    q: '¿Lead AI está incluido al contratar un servicio de MAASTAC?',
    a: 'No. Lead AI es un producto independiente: contratar un servicio de la agencia no incluye su uso ni su licencia.',
  },
  {
    q: '¿Cómo puedo usar Lead AI?',
    a: 'Su disponibilidad y sus condiciones se informan por consulta. Escríbenos y te explicamos cómo encaja en tu caso.',
  },
  {
    q: '¿Con qué CRM se integra?',
    a: 'Hoy se integra con HubSpot: envía o actualiza cada lead como contacto. Si usas otro CRM, lo revisamos contigo.',
  },
  {
    q: '¿Cómo se calcula la puntuación del lead?',
    a: 'Con las preguntas y los puntos que tú defines en el formulario. Cada respuesta genera un lead con una puntuación de 0 a 100.',
  },
];

const onConsult = () => gtagEvent('select_content', { content_type: 'cta', item_id: 'lead_ai_info' });

export default function LeadAIPage() {
  return (
    <>
      <PageHero
        eyebrow="Producto propio de MAASTAC"
        title="Lead AI: capta, califica y organiza"
        highlight="a tus prospectos"
        lead="Formularios con puntuación, un asistente de chat con IA y un panel de leads para saber a quién atender primero. Además, puede enviar cada lead a HubSpot."
        crumb="Lead AI"
        aside={
          <Card dark>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">Cómo funciona</p>
            <ol className="space-y-5">
              {LEAD_AI_STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-sky-300 ring-1 ring-white/15">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-semibold text-white">{step.title}</span>
                    <span className="block text-sm text-slate-400">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Card>
        }
      >
        <CtaLink href="#contacto" cta="lead_ai_info" variant="primary" size="lg" contactIntent location="lead_ai_hero" onClick={onConsult}>
          Consultar por Lead AI
          <ArrowRight size={18} weight="bold" aria-hidden="true" />
        </CtaLink>
        <CtaLink href="#funciones" cta="lead_ai_funciones" variant="outline-light" size="lg">
          Ver funciones
        </CtaLink>
      </PageHero>

      <Section id="funciones" labelledBy="funciones-heading">
        <SectionHeader
          id="funciones-heading"
          eyebrow="Funciones"
          title="Todo lo necesario para"
          highlight="calificar antes de vender"
          lead="Estas son las funciones disponibles hoy en Lead AI."
        />
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {LEAD_AI_CAPABILITIES.map(({ title, text, Icon }) => (
            <li key={title}>
              <Card className="h-full">
                <FeatureIcon Icon={Icon} />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{text}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="muted" labelledBy="para-quien-heading">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeader id="para-quien-heading" eyebrow="Para quién es" title="Pensado para equipos que" highlight="viven de sus prospectos" />
            <CheckList items={FOR_WHO} />
          </div>
          <div className="flex gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-blue-950" role="note" data-product-notice>
            <Info size={24} weight="duotone" className="shrink-0 text-blue-700" aria-hidden="true" />
            <div>
              <p className="font-semibold">Producto independiente</p>
              <p className="mt-1 text-[15px] leading-relaxed">{LEAD_AI_NOTICE}</p>
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="faq-heading">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader id="faq-heading" eyebrow="Preguntas frecuentes" title="Sobre" highlight="Lead AI" />
          <FaqList faqs={FAQS} />
        </div>
      </Section>

      <ContactSection
        id="contacto"
        location="lead_ai"
        defaultInterest="lead_ai_info"
        eyebrow="Consulta sin compromiso"
        title="¿Quieres saber si Lead AI"
        highlight="encaja en tu negocio?"
        lead="Cuéntanos cómo captas prospectos hoy y te explicamos su disponibilidad y sus condiciones."
        submitLabel="Consultar por Lead AI"
      />
    </>
  );
}
