// src/components/HowWeWork.tsx — Proceso de trabajo
import { memo, useCallback } from 'react';
import type { ComponentType } from 'react';
import type { IconProps } from 'phosphor-react';
import { Path, MagnifyingGlass, Compass, Wrench, ArrowsClockwise, ArrowRight } from 'phosphor-react';

type Step = {
  title: string;
  description: string;
  Icon: ComponentType<IconProps>;
};

const STEPS: Step[] = [
  {
    title: 'Entendemos el problema',
    description:
      'Revisamos cómo trabajas hoy, qué herramientas usas y dónde se pierde tiempo o se escapan oportunidades.',
    Icon: MagnifyingGlass,
  },
  {
    title: 'Diseñamos la solución',
    description:
      'Te proponemos qué automatizar, construir o integrar primero, con un alcance claro antes de empezar.',
    Icon: Compass,
  },
  {
    title: 'Implementamos e integramos',
    description:
      'Desarrollamos la solución y la conectamos con tus herramientas, con entregas que puedes revisar.',
    Icon: Wrench,
  },
  {
    title: 'Medimos, mantenemos y mejoramos',
    description:
      'Revisamos que funcione como esperabas, damos soporte y ajustamos según los resultados.',
    Icon: ArrowsClockwise,
  },
];

const HowWeWork = memo(() => {
  const scrollToContact = useCallback(() => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section
      id="como-trabajamos"
      className="relative bg-white py-20 md:py-28 overflow-hidden"
      aria-labelledby="como-trabajamos-heading"
    >
      <div className="absolute top-10 right-20 w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 blur-xl" aria-hidden="true" />

      <div className="container relative">
        <div className="text-center mb-16">
          <div className="arc-pill inline-flex items-center gap-3 border-2 border-blue-200 bg-white/60 px-6 py-3 text-base font-semibold text-blue-700 mb-6">
            <Path size={22} weight="duotone" className="text-blue-600" aria-hidden="true" />
            Cómo trabajamos
          </div>
          <h2 id="como-trabajamos-heading" className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Un proceso simple,{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              de principio a fin
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empezamos por el problema de negocio, no por la tecnología.
          </p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {STEPS.map(({ title, description, Icon }, i) => (
            <li
              key={title}
              className="arc-card relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black flex items-center justify-center">
                  {i + 1}
                </span>
                <Icon size={28} weight="duotone" className="text-blue-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </li>
          ))}
        </ol>

        <div className="text-center">
          <button
            type="button"
            onClick={scrollToContact}
            className="arc-pill inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            data-cta="process_evaluacion"
          >
            Empezar con una evaluación gratuita
            <ArrowRight size={20} weight="bold" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
});

HowWeWork.displayName = 'HowWeWork';
export default HowWeWork;
