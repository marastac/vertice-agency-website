// src/pages/ContactPage.tsx — /contacto: formulario de evaluación, WhatsApp y email.
// Admite /contacto?servicio=<id> para preseleccionar "¿Qué necesitas?" (ids estables de contactIntent).
import { Clock, FileText, ChatsCircle } from 'phosphor-react';
import ContactForm from '../components/contact/ContactForm';
import { DirectContact } from '../components/contact/ContactSection';
import { FaqList, FeatureIcon } from '../components/ui/Blocks';
import { Eyebrow, Section } from '../components/ui/Section';

const NEXT_STEPS = [
  { title: 'Revisamos tu solicitud', text: 'Leemos tu caso y, si hace falta, te pedimos algún detalle adicional.', Icon: FileText },
  { title: 'Conversamos', text: 'Coordinamos una llamada o videollamada para entender tu proceso y tus herramientas.', Icon: ChatsCircle },
  { title: 'Te proponemos por dónde empezar', text: 'Si decides avanzar, recibes una propuesta con alcance, plazos y costo.', Icon: Clock },
];

const FAQS = [
  { q: '¿La evaluación inicial tiene costo?', a: 'No. La evaluación inicial es gratuita y sin compromiso.' },
  {
    q: '¿Qué información necesito tener?',
    a: 'Basta con contarnos qué quieres mejorar y qué herramientas usas hoy. Si tienes documentos o ejemplos, puedes compartirlos después.',
  },
  {
    q: '¿Trabajan con empresas fuera de Lima?',
    a: 'Sí. Trabajamos de forma remota, en español, con empresas de todo el Perú.',
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-dark pb-40 pt-28 text-white md:pt-36" aria-labelledby="page-title">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden="true" />
        <div className="container relative max-w-3xl text-center">
          <Eyebrow dark>Contacto</Eyebrow>
          <h1 id="page-title" className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Solicita tu <span className="text-gradient-light">evaluación gratuita</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
            Cuéntanos qué quieres construir, automatizar o integrar. Revisamos tu caso y te proponemos por dónde empezar,
            sin compromiso.
          </p>
        </div>
      </section>

      <div className="container relative -mt-28 pb-16 md:pb-24">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10 md:p-9">
            <h2 className="mb-1 text-xl font-semibold text-slate-900">Cuéntanos tu caso</h2>
            <p className="mb-6 text-[15px] text-slate-600">Solo te pedimos lo mínimo para empezar la conversación.</p>
            <ContactForm location="contacto" />
          </div>

          <aside className="space-y-6" aria-label="Contacto directo y próximos pasos">
            <div className="rounded-2xl bg-ink p-6 text-white shadow-xl shadow-slate-900/10 md:p-7">
              <h2 className="mb-1 text-lg font-semibold">Contacto directo</h2>
              <p className="mb-5 text-sm text-slate-300">Te responde quien llevará tu proyecto.</p>
              <DirectContact location="contacto" />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-7">
              <h2 className="mb-5 text-lg font-semibold text-slate-900">Qué pasa después</h2>
              <ol className="space-y-5">
                {NEXT_STEPS.map(({ title, text, Icon }) => (
                  <li key={title} className="flex gap-4">
                    <FeatureIcon Icon={Icon} />
                    <span>
                      <span className="block font-semibold text-slate-900">{title}</span>
                      <span className="block text-[15px] leading-relaxed text-slate-600">{text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>

      <Section tone="muted" labelledBy="faq-contacto">
        <div className="mx-auto max-w-3xl">
          <h2 id="faq-contacto" className="mb-6 text-2xl font-bold tracking-tight text-slate-900">
            Preguntas frecuentes
          </h2>
          <FaqList faqs={FAQS} />
        </div>
      </Section>
    </>
  );
}
