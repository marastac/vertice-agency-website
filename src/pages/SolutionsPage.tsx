// src/pages/SolutionsPage.tsx — Soluciones y proyectos propios (portafolio honesto).
// Solo proyectos propios verificables, identificados como tales. Sin casos de clientes hasta tener
// proyectos reales con autorización para mostrarlos.
import { ArrowRight, Info } from 'phosphor-react';
import { Card, FeatureIcon } from '../components/ui/Blocks';
import { CtaBand } from '../components/ui/CtaBand';
import { CtaLink } from '../components/ui/CtaLink';
import { PageHero } from '../components/ui/PageHero';
import { Section, SectionHeader } from '../components/ui/Section';
import { AREAS } from '../content/areas';
import { PROJECTS, TECH_GROUPS } from '../content/company';

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Soluciones"
        title="Lo que ya hemos construido,"
        highlight="sin adornos"
        lead="Proyectos propios que puedes conocer y las tecnologías con las que trabajamos. Preferimos mostrarte trabajo real en lugar de prometer cifras."
        crumb="Soluciones"
      >
        <CtaLink href="/contacto" cta="soluciones_hero_cta" variant="primary" size="lg" contactIntent location="soluciones_hero">
          Consultar mi proyecto
          <ArrowRight size={18} weight="bold" aria-hidden="true" />
        </CtaLink>
      </PageHero>

      <Section labelledBy="proyectos-heading">
        <SectionHeader id="proyectos-heading" eyebrow="Proyectos propios" title="Productos e integraciones" highlight="de MAASTAC" />
        <ul className="grid gap-5 lg:grid-cols-3">
          {PROJECTS.map(({ title, tag, text, stack, href, Icon }) => (
            <li key={title} className="flex">
              <article className="flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 md:p-7" aria-labelledby={`proy-${title}`}>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <FeatureIcon Icon={Icon} />
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">{tag}</span>
                </div>
                <h3 id={`proy-${title}`} className="text-xl font-semibold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{text}</p>
                <p className="mt-auto pt-5 text-sm font-medium text-slate-500">{stack}</p>
                {href && (
                  <a href={href} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900" data-cta="soluciones_lead_ai">
                    Ver Lead AI
                    <ArrowRight size={14} weight="bold" aria-hidden="true" />
                  </a>
                )}
              </article>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-[15px] text-slate-600" role="note">
          <Info size={22} weight="duotone" className="shrink-0 text-slate-500" aria-hidden="true" />
          <p>
            Todavía no publicamos casos de clientes. Cuando tengamos proyectos con autorización para mostrarlos, los
            encontrarás aquí identificados como tales.
          </p>
        </div>
      </Section>

      <Section tone="muted" labelledBy="tecnologias-heading">
        <SectionHeader
          id="tecnologias-heading"
          eyebrow="Tecnologías"
          title="Herramientas con las que"
          highlight="trabajamos hoy"
          lead="Elegimos la tecnología según el problema, priorizando soluciones mantenibles y documentadas."
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TECH_GROUPS.map(({ title, items, Icon }) => (
            <li key={title}>
              <Card className="h-full">
                <FeatureIcon Icon={Icon} />
                <h3 className="mb-3 mt-4 font-semibold text-slate-900">{title}</h3>
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
      </Section>

      <Section labelledBy="areas-heading">
        <SectionHeader id="areas-heading" eyebrow="Servicios" title="¿Qué podemos construir" highlight="para tu empresa?" />
        <ul className="grid gap-5 md:grid-cols-3">
          {AREAS.map((area) => (
            <li key={area.id}>
              <a href={area.path} className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md" data-cta={`soluciones_area_${area.id}`}>
                <FeatureIcon Icon={area.Icon} />
                <span className="mt-4 flex items-center gap-2 font-semibold text-slate-900">
                  {area.name}
                  <ArrowRight size={14} weight="bold" className="text-slate-400 group-hover:text-blue-700" aria-hidden="true" />
                </span>
                <span className="mt-1 text-[15px] text-slate-600">{area.summary}</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        title="¿Tienes un proceso que quieres mejorar?"
        text="Cuéntanos cómo trabajas hoy y te proponemos qué construir, automatizar o integrar primero."
        cta="soluciones_cta_band"
        location="soluciones"
      />
    </>
  );
}
