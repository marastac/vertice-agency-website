// src/components/AboutUs.tsx
import { memo, useEffect, useRef, useState } from 'react';
import { UsersThree, CheckCircle, ArrowLeft, ArrowRight } from 'phosphor-react';

type Member = {
  name: string;
  role: string;
  bio: string;
  photo: string;
  tags?: string[];
};

const TEAM: Member[] = [
  {
    name: 'Mario Astonitas',
    role: 'CEO · Ing. de Software',
    bio: 'Estratega técnico con foco en automatización, data y crecimiento. 7+ años creando sistemas que escalan.',
    photo: '/team/mario-astonitas.jpg',
    tags: ['IA aplicada', 'Automatización', 'Growth']
  },
  {
    name: 'Daniela Torres',
    role: 'Co-fundadora · Marketing',
    bio: 'Especialista en performance, contenidos y funnels. Convierte datos en crecimiento real.',
    photo: '/team/daniela-torres.jpg',
    tags: ['Performance', 'Contenido', 'Funnels']
  },
  {
    name: 'Sofía Quispe',
    role: 'Head of Strategy',
    bio: 'Diseña roadmaps de crecimiento basados en investigación, segmentación y propuesta de valor.',
    photo: '/team/sofia-quispe.jpg'
  },
  {
    name: 'Jorge Ramírez',
    role: 'Data & Analytics Lead',
    bio: 'Convierte métricas en decisiones. Implementa dashboards, tracking y modelos de atribución.',
    photo: '/team/jorge-ramirez.jpg'
  },
  {
    name: 'Mariana Paredes',
    role: 'Creative & Content',
    bio: 'Creativa orientada a conversión. Contenido que conecta marca, audiencia y ROI.',
    photo: '/team/mariana-paredes.jpg'
  }
];

const AboutUs = memo(() => {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [shineTick, setShineTick] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Fade-up al entrar
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.3 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // Rotación automática
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % TEAM.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Reinicia brillo en cada cambio
  useEffect(() => {
    setShineTick((t) => t + 1);
  }, [active]);

  return (
    <section
      id="nosotros"
      ref={sectionRef}
      className={`relative bg-gradient-to-br from-gray-50 via-blue-50/20 to-white py-24 overflow-hidden transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* decorativos */}
      <div className="absolute -top-10 -right-10 w-52 h-52 bg-gradient-to-r from-blue-400 to-purple-600 opacity-10 blur-3xl rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-500 opacity-10 blur-3xl rounded-full" />

      <div className="container relative">
        {/* Header */}
        <div className="text-center mb-16 md:mb-18">
          <div className="inline-flex items-center gap-3 border-2 border-blue-200 bg-white/70 px-6 py-3 rounded-full text-blue-700 font-semibold mb-6">
            <UsersThree size={22} weight="duotone" className="text-blue-600" />
            Nosotros
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Personas reales creando{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              impacto digital
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Nuestro equipo combina <strong>creatividad, estrategia y tecnología</strong> para impulsar el crecimiento de
            marcas y negocios. Trabajamos con pasión, transparencia y enfoque en <strong>resultados medibles</strong>.
          </p>
        </div>

        {/* Carrusel (espacio reservado para que NO se monte con el título) */}
        <div className="relative mx-auto mt-10 md:mt-12 w-full max-w-3xl min-h-[520px] md:min-h-[560px]">
          {/* Slides apiladas, centradas y absolutamente posicionadas DENTRO del contenedor de altura fija */}
          {TEAM.map((member, i) => (
            <div
              key={member.name}
              className={`absolute inset-0 flex flex-col items-center justify-start text-center px-4 transition-all duration-1000 ${
                i === active ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0'
              }`}
            >
              {/* Imagen */}
              <div className="relative group">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-40 h-40 md:w-56 md:h-56 rounded-3xl object-cover shadow-2xl border-4 border-white transition-transform duration-700 group-hover:scale-105"
                />
                {/* Brillo */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  {i === active ? <div key={`shine-${shineTick}`} className="shine-surface shine-auto" /> : null}
                  <div className="shine-surface shine-hover" />
                </div>
              </div>

              {/* Texto */}
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-6">{member.name}</h3>
              <p className="text-purple-700 font-medium mb-3">{member.role}</p>
              <p className="max-w-xl text-gray-600 mb-6">{member.bio}</p>

              {member.tags && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {member.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200"
                    >
                      <CheckCircle size={12} weight="duotone" className="inline mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Controles laterales, alineados al centro del contenedor del carrusel */}
          <button
            onClick={() => setActive((prev) => (prev - 1 + TEAM.length) % TEAM.length)}
            className="absolute left-[-6px] top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur border border-gray-200 hover:bg-white shadow-md"
            aria-label="Anterior"
            type="button"
          >
            <ArrowLeft size={22} weight="duotone" />
          </button>
          <button
            onClick={() => setActive((prev) => (prev + 1) % TEAM.length)}
            className="absolute right-[-6px] top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur border border-gray-200 hover:bg-white shadow-md"
            aria-label="Siguiente"
            type="button"
          >
            <ArrowRight size={22} weight="duotone" />
          </button>
        </div>

        {/* Indicador tubular elegante */}
        <div className="mt-14 mx-auto max-w-md h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-700 ease-out"
            style={{ width: `${((active + 1) / TEAM.length) * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
});

AboutUs.displayName = 'AboutUs';
export default AboutUs;

/* === CSS del brillo (inyectado de forma segura una sola vez) === */
(function injectShineCSS() {
  const ID = 'aboutus-shine-css';
  if (document.getElementById(ID)) return;
  const style = document.createElement('style');
  style.id = ID;
  style.textContent = `
  .shine-surface{position:absolute;inset:0;pointer-events:none}
  .shine-surface::before{
    content:'';position:absolute;top:0;left:-75%;width:50%;height:100%;
    background:linear-gradient(120deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.45) 50%,rgba(255,255,255,0) 100%);
    transform:skewX(-25deg);opacity:0
  }
  .shine-hover:hover::before{animation:about-shine 1.6s linear 0s 1 forwards;opacity:1}
  .shine-auto::before{animation:about-shine 1.6s linear 0s 1 forwards;opacity:1}
  @keyframes about-shine{0%{left:-75%;opacity:0}10%{opacity:1}100%{left:125%;opacity:0}}
  `;
  document.head.appendChild(style);
})();
