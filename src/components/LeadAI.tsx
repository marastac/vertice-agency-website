// src/components/LeadAI.tsx — Producto propio de MAASTAC
// Solo describe capacidades confirmadas en el producto (vertice-ai-suite/lead-ai).
// No añadir funciones que no existan (p. ej. widget embebible o sincronización automática con CRM).
import { memo, useCallback } from 'react';
import type { ComponentType } from 'react';
import type { IconProps } from 'phosphor-react';
import {
  Sparkle,
  ListChecks,
  ChatCircleDots,
  AddressBook,
  PlugsConnected,
  UsersThree,
  ArrowRight,
} from 'phosphor-react';
import { selectContactInterest } from '../utils/contactIntent';

type Capability = {
  title: string;
  description: string;
  Icon: ComponentType<IconProps>;
};

const CAPABILITIES: Capability[] = [
  {
    title: 'Formularios de calificación',
    description:
      'Crea formularios con tus propias preguntas y puntos. Cada respuesta genera un lead con una puntuación de 0 a 100, y el formulario se comparte con un enlace público.',
    Icon: ListChecks,
  },
  {
    title: 'Asistente de chat con IA',
    description:
      'Un chat público conversa con el interesado, le hace las preguntas de calificación y registra el lead cuando obtiene su email.',
    Icon: ChatCircleDots,
  },
  {
    title: 'Panel de leads',
    description:
      'Todos tus leads en un solo lugar, con búsqueda, filtros y acceso a la conversación que originó cada uno.',
    Icon: AddressBook,
  },
  {
    title: 'Integración con HubSpot',
    description:
      'Conecta tu cuenta de HubSpot y envía o actualiza cada lead como contacto en tu CRM.',
    Icon: PlugsConnected,
  },
];

const STEPS = [
  { title: 'Capta', text: 'Mediante formulario o chat' },
  { title: 'Califica', text: 'Con puntuación y preguntas clave' },
  { title: 'Gestiona', text: 'En el panel y en HubSpot' },
];

const LeadAI = memo(() => {
  const onCta = useCallback(() => {
    window.gtag?.('event', 'select_content', { content_type: 'cta', item_id: 'lead_ai_demo' });
    selectContactInterest('lead_ai_demo');
  }, []);

  return (
    <section
      id="lead-ai"
      className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-20 md:py-28 text-white"
      aria-labelledby="lead-ai-heading"
    >
      {/* decorativos */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl" aria-hidden="true" />

      <div className="container relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div>
            <div className="arc-pill mb-6 inline-flex items-center gap-3 border-2 border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-blue-100">
              <Sparkle size={20} weight="duotone" className="text-blue-200" aria-hidden="true" />
              Producto propio de MAASTAC
            </div>
            <h2 id="lead-ai-heading" className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Lead AI: capta, califica y organiza{' '}
              <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                tus leads
              </span>
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              Lead AI es la solución que desarrollamos en MAASTAC para la captación y calificación inicial de clientes
              potenciales. Combina formularios con puntuación, un asistente de chat con IA y un panel de gestión, y envía
              tus leads a HubSpot cuando lo necesitas. Puede formar parte de una implementación de MAASTAC o puedes
              solicitar una demo.
            </p>

            {/* Flujo */}
            <ol className="mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {STEPS.map((step, i) => (
                <li key={step.title} className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <div className="text-sm font-bold text-blue-200 mb-1">
                    {i + 1}. {step.title}
                  </div>
                  <div className="text-sm text-blue-100">{step.text}</div>
                </li>
              ))}
            </ol>

            <div className="flex flex-col gap-4 items-start">
              <a
                href="#contact"
                onClick={onCta}
                className="arc-pill inline-flex items-center justify-center gap-3 whitespace-nowrap bg-white text-blue-700 px-6 sm:px-8 py-4 font-bold text-base sm:text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                data-cta="lead_ai_demo"
              >
                Solicitar demo de Lead AI
                <ArrowRight size={20} weight="bold" aria-hidden="true" />
              </a>
              <p className="inline-flex items-center gap-2 text-sm text-blue-100">
                <UsersThree size={18} weight="duotone" aria-hidden="true" />
                Incluye trabajo en equipo con invitaciones y roles.
              </p>
            </div>
          </div>

          {/* Capacidades */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {CAPABILITIES.map(({ title, description, Icon }) => (
              <article
                key={title}
                className="arc-card rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm p-6 shadow-[0_10px_40px_rgba(2,6,23,.35)]"
              >
                <div className="mb-4 w-12 h-12 gloss-circle rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
                  <Icon size={24} weight="duotone" color="#fff" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-blue-100 leading-relaxed">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

LeadAI.displayName = 'LeadAI';
export default LeadAI;
