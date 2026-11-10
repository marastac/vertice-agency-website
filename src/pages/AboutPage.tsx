// src/pages/AboutPage.tsx — Nosotros: información transparente sobre MAASTAC.
// Solo personas reales del equipo y datos verificables (sin trayectoria, clientes ni cifras inventadas).
import { ArrowRight, CheckCircle } from 'phosphor-react';
import { Card, CheckList, FeatureIcon } from '../components/ui/Blocks';
import { CtaBand } from '../components/ui/CtaBand';
import { CtaLink } from '../components/ui/CtaLink';
import { PageHero } from '../components/ui/PageHero';
import { Section, SectionHeader } from '../components/ui/Section';
import { FOUNDER, PRINCIPLES, PROCESS_STEPS } from '../content/company';

const FOCUS = [
  'Desarrollo de software a medida y sistemas web empresariales.',
  'Automatización de procesos y aplicación práctica de inteligencia artificial.',
  'Integraciones entre herramientas, APIs y CRM.',
  'Lead AI, nuestro producto propio para captar y calificar prospectos.',
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Nosotros"
        title="Una agencia tecnológica"
        highlight="enfocada en problemas reales"
        lead="MAASTAC nace en Perú para ayudar a empresas a ordenar su operación con software, automatización e integraciones. Somos un equipo pequeño y técnico: hablas directamente con quien diseña y construye tu solución."
        crumb="Nosotros"
      >
        <CtaLink href="/contacto" cta="nosotros_hero_cta" variant="primary" size="lg" contactIntent location="nosotros_hero">
          Solicitar evaluación gratuita
          <ArrowRight size={18} weight="bold" aria-hidden="true" />
        </CtaLink>
      </PageHero>

      <Section labelledBy="equipo-heading">
        <div className="grid items-center gap-10 lg:grid-cols-[auto_1fr]">
          <img
            src={FOUNDER.photo}
            alt={FOUNDER.name}
            width={224}
            height={224}
            loading="lazy"
            decoding="async"
            className="h-48 w-48 rounded-2xl object-cover shadow-lg ring-4 ring-slate-100 md:h-56 md:w-56"
          />
          <div className="max-w-2xl">
            <SectionHeader id="equipo-heading" eyebrow="Quién está detrás" title={FOUNDER.name} />
            <p className="-mt-8 mb-4 font-medium text-blue-700">{FOUNDER.role}</p>
            <p className="text-lg leading-relaxed text-slate-600">{FOUNDER.bio}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {FOUNDER.tags.map((tag) => (
                <li key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800">
                  <CheckCircle size={14} weight="duotone" aria-hidden="true" />
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="muted" labelledBy="enfoque-heading">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader
              id="enfoque-heading"
              eyebrow="Enfoque"
              title="No somos una agencia de marketing:"
              highlight="construimos sistemas"
              lead="Nuestro trabajo es técnico. La web y la medición son herramientas al servicio de procesos comerciales y operativos que funcionen."
            />
          </div>
          <div className="lg:pt-10">
            <p className="mb-4 font-semibold text-slate-900">En qué nos especializamos</p>
            <CheckList items={FOCUS} />
            <p className="mt-6 text-[15px] text-slate-600">
              Atendemos principalmente a empresas de Lima y del resto del Perú, y trabajamos de forma remota, en español.
            </p>
          </div>
        </div>
      </Section>

      <Section labelledBy="compromisos-heading">
        <SectionHeader
          id="compromisos-heading"
          eyebrow="Compromiso con el cliente"
          title="Cómo te vamos a"
          highlight="tratar"
          lead="Son compromisos sobre la forma de trabajar, no promesas de resultados."
        />
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map(({ title, text, Icon }) => (
            <li key={title}>
              <Card className="h-full">
                <FeatureIcon Icon={Icon} />
                <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{text}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="dark" labelledBy="metodo-heading">
        <SectionHeader id="metodo-heading" eyebrow="Método de trabajo" title="De la primera conversación" highlight="a la entrega" dark />
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

      <CtaBand
        title="Hablemos de tu proyecto"
        text="Una evaluación inicial gratuita para entender tu caso y proponerte por dónde empezar."
        cta="nosotros_cta_band"
        location="nosotros"
      />
    </>
  );
}
