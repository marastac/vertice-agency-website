// src/pages/HomePage.tsx — Inicio: propuesta de valor, servicios, Lead AI, proceso, confianza y contacto.
//
// Anclas que se conservan por compatibilidad con enlaces ya publicados:
//   #home · #servicios · #lead-ai · #como-trabajamos · #capacidades · #nosotros · #contact
//   (+ alias antiguos como #services en src/routes.ts → HASH_ALIASES).
import { useCallback } from 'react';
import { ArrowRight, CheckCircle } from 'phosphor-react';
import Hero from '../components/Hero';
import ContactSection from '../components/contact/ContactSection';
import { Card, CheckList, FeatureIcon } from '../components/ui/Blocks';
import { CtaLink } from '../components/ui/CtaLink';
import { Section, SectionHeader } from '../components/ui/Section';
import { SERVICES } from '../config/services';
import type { Service } from '../config/services';
import { AREAS } from '../content/areas';
import { FOUNDER, LEAD_AI_CAPABILITIES, LEAD_AI_NOTICE, PRINCIPLES, PROCESS_STEPS, TECH_GROUPS } from '../content/company';
import { fbqEvent, gtagEvent, trackEvent } from '../utils/analytics';
import { selectContactInterest } from '../utils/contactIntent';
import { trackServiceInterest } from '../utils/events';

const OUTCOMES = [
  { before: 'Datos repartidos en hojas de cálculo, correos y chats', after: 'Una sola fuente de información, con roles y permisos' },
  { before: 'Horas copiando datos y enviando recordatorios', after: 'Flujos automáticos con control de errores' },
  { before: 'Herramientas que no se comunican entre sí', after: 'Integraciones que comparten los datos sin doble digitación' },
  { before: 'Consultas que se responden tarde o se pierden', after: 'Atención inicial ordenada y derivación a una persona' },
];

function ServiceCard({ service }: { service: Service }) {
  const area = AREAS.find((a) => a.id === service.area);
  const onConsult = useCallback(() => {
    // Eventos existentes (se conservan): GA4 con consentimiento analítico y Meta con consentimiento de marketing.
    trackEvent('service_cta_click', { service_name: service.name });
    fbqEvent('trackCustom', 'ServiceCTA', { service_name: service.name });
    trackServiceInterest(service.id, 'home_service_card');
    selectContactInterest(service.id);
  }, [service]);

  return (
    <li className="flex">
      <article
        className="flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
        aria-labelledby={`servicio-${service.id}`}
        data-cta={`service_card_${service.id}`}
      >
        <div className="mb-4 flex items-center gap-3">
          <FeatureIcon Icon={service.Icon} />
          <h3 id={`servicio-${service.id}`} className="text-lg font-semibold leading-snug text-slate-900">
            {service.name}
          </h3>
        </div>
        <p className="mb-3 text-sm font-medium text-blue-700">{service.tagline}</p>
        <p className="mb-5 text-[15px] leading-relaxed text-slate-600">{service.problem}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-sm font-semibold">
          <a href="#contact" onClick={onConsult} className="text-blue-700 hover:text-blue-900" data-cta={`service_cta_${service.id}`}>
            Consultar este servicio
          </a>
          {area && (
            <a href={area.path} className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900" data-cta={`service_more_${service.id}`}>
              Más detalles
              <ArrowRight size={14} weight="bold" aria-hidden="true" />
            </a>
          )}
        </div>
      </article>
    </li>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Servicios */}
      <Section id="servicios" labelledBy="servicios-heading">
        <SectionHeader
          id="servicios-heading"
          eyebrow="Servicios"
          title="Tecnología aplicada a"
          highlight="problemas reales de tu negocio"
          lead="Siete servicios agrupados en tres áreas. El alcance de cada proyecto se define contigo en una propuesta antes de empezar."
        />

        <div className="mb-14 grid gap-5 lg:grid-cols-3">
          {AREAS.map((area) => (
            <a
              key={area.id}
              href={area.path}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-brand-dark p-7 text-white"
              data-cta={`home_area_${area.id}`}
            >
              <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" aria-hidden="true" />
              <div className="relative flex h-full flex-col">
                <FeatureIcon Icon={area.Icon} dark />
                <h3 className="mt-5 text-xl font-semibold">{area.name}</h3>
                <p className="mt-2 leading-relaxed text-slate-300">{area.summary}</p>
                <ul className="mt-5 space-y-1.5 text-sm text-slate-300">
                  {SERVICES.filter((s) => s.area === area.id).map((s) => (
                    <li key={s.id} className="flex gap-2">
                      <CheckCircle size={16} weight="duotone" className="mt-0.5 shrink-0 text-sky-300" aria-hidden="true" />
                      {s.name}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-sky-300 group-hover:text-white">
                  Ver detalles
                  <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </div>
            </a>
          ))}
        </div>

        <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Los 7 servicios en detalle</h3>
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Servicios de MAASTAC Agency">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </ul>
      </Section>

      {/* Problemas que resolvemos */}
      <Section tone="muted" labelledBy="resultados-heading">
        <SectionHeader
          id="resultados-heading"
          eyebrow="Qué cambia en tu operación"
          title="De procesos manuales a"
          highlight="sistemas que trabajan contigo"
          lead="No vendemos tecnología por sí misma: empezamos por el problema de negocio y elegimos la herramienta que lo resuelve."
        />
        <ul className="grid gap-4 md:grid-cols-2">
          {OUTCOMES.map((o) => (
            <li key={o.before} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <p className="text-[15px] text-slate-500">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Hoy</span>
                {o.before}
              </p>
              <ArrowRight size={18} weight="bold" className="hidden text-blue-600 sm:block" aria-hidden="true" />
              <p className="text-[15px] font-medium text-slate-900">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-blue-700">Con MAASTAC</span>
                {o.after}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Lead AI */}
      <Section id="lead-ai" tone="dark" labelledBy="lead-ai-heading">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              id="lead-ai-heading"
              eyebrow="Producto propio"
              title="Lead AI: capta, califica y organiza"
              highlight="a tus prospectos"
              lead="Combina formularios con puntuación, un asistente de chat con IA y un panel de gestión, y puede enviar cada lead a HubSpot."
              dark
            />
            <p className="-mt-6 mb-8 max-w-xl text-sm leading-relaxed text-slate-400" data-product-notice>
              {LEAD_AI_NOTICE}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <CtaLink href="/lead-ai" cta="home_lead_ai" variant="light" size="lg">
                Conocer Lead AI
                <ArrowRight size={18} weight="bold" aria-hidden="true" />
              </CtaLink>
              <CtaLink
                href="#contact"
                cta="lead_ai_info"
                variant="outline-light"
                size="lg"
                contactIntent
                location="home_lead_ai"
                onClick={() => {
                  gtagEvent('select_content', { content_type: 'cta', item_id: 'lead_ai_info' }); // evento existente
                  selectContactInterest('lead_ai_info');
                }}
              >
                Consultar disponibilidad
              </CtaLink>
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {LEAD_AI_CAPABILITIES.slice(0, 4).map(({ title, text, Icon }) => (
              <li key={title}>
                <Card dark className="h-full">
                  <FeatureIcon Icon={Icon} dark />
                  <h3 className="mt-4 font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Proceso */}
      <Section id="como-trabajamos" labelledBy="como-trabajamos-heading">
        <SectionHeader
          id="como-trabajamos-heading"
          eyebrow="Cómo trabajamos"
          title="Un proceso claro,"
          highlight="de principio a fin"
          lead="Empezamos por el problema de negocio, no por la tecnología."
        />
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map(({ title, text, Icon }, i) => (
            <li key={title} className="relative rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-5 flex items-center justify-between">
                <FeatureIcon Icon={Icon} />
                <span className="text-sm font-semibold tabular-nums text-slate-400">0{i + 1}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Por qué MAASTAC */}
      <Section tone="muted" labelledBy="porque-heading">
        <SectionHeader
          id="porque-heading"
          eyebrow="Por qué MAASTAC"
          title="Compromisos concretos,"
          highlight="no promesas"
          lead="Somos una agencia joven y técnica. Por eso preferimos mostrarte cómo trabajamos en lugar de cifras que no podríamos respaldar."
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

      {/* Capacidades */}
      <Section id="capacidades" labelledBy="capacidades-heading">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeader
              id="capacidades-heading"
              eyebrow="Capacidades"
              title="Tecnologías con las que"
              highlight="ya construimos"
              lead="Las usamos en nuestros propios productos, como Lead AI y esta web. Conoce los proyectos en detalle en Soluciones."
            />
            <CtaLink href="/soluciones" cta="home_soluciones" variant="secondary">
              Ver soluciones y proyectos propios
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </CtaLink>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {TECH_GROUPS.map(({ title, items, Icon }) => (
              <li key={title}>
                <Card className="h-full">
                  <div className="mb-4 flex items-center gap-3">
                    <FeatureIcon Icon={Icon} />
                    <h3 className="font-semibold text-slate-900">{title}</h3>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <li key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Nosotros (resumen) */}
      <Section id="nosotros" tone="muted" labelledBy="nosotros-heading">
        <div className="grid items-center gap-10 md:grid-cols-[auto_1fr]">
          <img
            src={FOUNDER.photo}
            alt={FOUNDER.name}
            width={224}
            height={224}
            loading="lazy"
            decoding="async"
            className="h-40 w-40 rounded-2xl object-cover shadow-lg ring-4 ring-white md:h-52 md:w-52"
          />
          <div className="max-w-2xl">
            <SectionHeader
              id="nosotros-heading"
              eyebrow="Nosotros"
              title="Un equipo pequeño y técnico,"
              highlight="cerca de cada proyecto"
            />
            <p className="-mt-6 text-lg leading-relaxed text-slate-600">
              {FOUNDER.name} ({FOUNDER.role}) lidera MAASTAC. {FOUNDER.bio}
            </p>
            <CheckList
              className="mt-6"
              items={['Hablas directamente con quien construye tu solución', 'Atención en español, de forma remota desde Perú']}
            />
            <CtaLink href="/nosotros" cta="home_nosotros" variant="secondary" className="mt-7">
              Conocer más sobre MAASTAC
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </CtaLink>
          </div>
        </div>
      </Section>

      <ContactSection id="contact" location="home" />
    </>
  );
}
