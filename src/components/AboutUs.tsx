// src/components/AboutUs.tsx
// Solo personas reales del equipo. No añadir integrantes ficticios.
import { memo, useEffect, useRef, useState } from 'react';
import { UsersThree, CheckCircle } from 'phosphor-react';

type Member = {
  name: string;
  role: string;
  bio: string;
  photo: string;
  tags?: string[];
};

const FOUNDER: Member = {
  name: 'Mario Astonitas',
  role: 'CEO · Ing. de Software',
  bio: 'Estratega técnico con foco en automatización, integraciones y desarrollo web. Diseña y construye las soluciones que implementa MAASTAC.',
  photo: '/team/mario-astonitas.jpg',
  tags: ['Automatización', 'Integraciones', 'Desarrollo web']
};

const AboutUs = memo(() => {
  const [visible, setVisible] = useState(false);
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
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 border-2 border-blue-200 bg-white/70 px-6 py-3 rounded-full text-blue-700 font-semibold mb-6">
            <UsersThree size={22} weight="duotone" className="text-blue-600" />
            Nosotros
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Quién está detrás de{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MAASTAC
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            MAASTAC es un equipo pequeño y técnico. Hablas directamente con quien diseña y construye tu solución, con
            <strong> comunicación clara</strong> y foco en <strong>resolver problemas reales de tu negocio</strong>.
          </p>
        </div>

        {/* Perfil */}
        <div className="mx-auto w-full max-w-3xl flex flex-col items-center text-center px-4">
          <div className="relative group">
            <img
              src={FOUNDER.photo}
              alt={FOUNDER.name}
              width={224}
              height={224}
              loading="lazy"
              decoding="async"
              className="w-40 h-40 md:w-56 md:h-56 rounded-3xl object-cover shadow-2xl border-4 border-white transition-transform duration-700 group-hover:scale-105"
            />
            {/* Brillo */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              {visible ? <div className="shine-surface shine-auto" /> : null}
              <div className="shine-surface shine-hover" />
            </div>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-6">{FOUNDER.name}</h3>
          <p className="text-purple-700 font-medium mb-3">{FOUNDER.role}</p>
          <p className="max-w-xl text-gray-600 mb-6">{FOUNDER.bio}</p>

          {FOUNDER.tags && (
            <div className="flex flex-wrap gap-2 justify-center">
              {FOUNDER.tags.map((tag) => (
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
