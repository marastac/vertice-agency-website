// src/components/LeadMagnetSection.tsx
import { useState, memo, useCallback, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Prohibit,
  FileText,
  HardDrive,
  Target,
  CheckCircle,
  EnvelopeSimple,
  DownloadSimple,
  Gift,
  ArrowRight, // ← reemplazo del cohete por flecha
} from 'phosphor-react';

interface LeadMagnetFormData {
  email: string;
  name: string;
  business_type: string;
}

interface LeadMagnet {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  downloadUrl: string;
  fileType: string;
  fileSize: string;
  benefits: string[];
}

interface LeadMagnetModalProps {
  magnet: LeadMagnet;
  isOpen: boolean;
  onClose: () => void;
}

const LEAD_MAGNETS: LeadMagnet[] = [
  {
    id: 'guia-branding-ia',
    title: 'Guía Completa: Branding Digital con IA 2025',
    description:
      'Crea una marca memorable con IA: posicionamiento, voz, identidad visual y workflows listos para implementar.',
    iconUrl: '/leadmagnets/branding-palette.png',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1ziAIIPewct4cIq5sZXA6ds0Gp7nX1hm9',
    fileType: 'PDF',
    fileSize: '2.8 MB',
    benefits: [
      'Framework de marca y prompts de IA',
      'Herramientas gratuitas y premium recomendadas',
      'Casos reales aplicados a LATAM y España',
      'Templates editables incluidos'
    ]
  },
  {
    id: 'checklist-optimizacion',
    title: 'Checklist: Optimización de Conversiones con IA',
    description:
      'Audita tu funnel en 30 minutos: 50+ checks prácticos para elevar tu tasa de conversión con automatización inteligente.',
    iconUrl: '/leadmagnets/checklist-pro.png',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1TS6vU4WgeqPHp80LRdAQ2_1rWtAV1yRz',
    fileType: 'PDF',
    fileSize: '1.5 MB',
    benefits: [
      'Checklist de 50+ puntos accionables',
      'Métricas clave y benchmarks',
      'Herramientas de IA recomendadas',
      'Scripts de automatización listos para usar'
    ]
  },
  {
    id: 'template-brief',
    title: 'Template: Brief Creativo para Proyectos de IA',
    description:
      'Planifica campañas y proyectos IA sin fricción: estructura, ejemplos y guía de uso paso a paso.',
    iconUrl: '/leadmagnets/brief-pencil.png',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1BvowhgodatIK7ULlgDFaeEh3KYnuuzM9',
    fileType: 'DOCX + PDF',
    fileSize: '850 KB',
    benefits: [
      'Template editable (Word / Google Docs)',
      'Secciones pre-estructuradas y checklist',
      'Ejemplos de briefings exitosos',
      'Guía rápida para validar entregables'
    ]
  }
];

/* =========================
   Modal de Lead Magnet
========================= */
const LeadMagnetModal = memo(({ magnet, isOpen, onClose }: LeadMagnetModalProps) => {
  const [formData, setFormData] = useState<LeadMagnetFormData>({
    email: '',
    name: '',
    business_type: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const dialogRef = useRef<HTMLDivElement>(null);

  const isValidEmail = (v: string) => /\S+@\S+\.\S+/.test(v.trim());
  const isValidName = (v: string) => v.trim().length >= 2;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!isValidName(formData.name) || !isValidEmail(formData.email) || !formData.business_type) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('https://formspree.io/f/mdkzjjez', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          type: 'lead_magnet_download',
          email: formData.email,
          name: formData.name,
          business_type: formData.business_type,
          magnet_id: magnet.id,
          magnet_title: magnet.title,
          source: 'Lead Magnet Modal',
          timestamp: new Date().toISOString(),
          page_url: window.location.href
        })
      });

      if (response.ok) {
        setSubmitStatus('success');

        (window as any)?.gtag?.('event', 'form_submit', {
          form_id: 'lead_magnet',
          magnet_id: magnet.id,
          magnet_title: magnet.title
        });
        (window as any)?.gtag?.('event', 'generate_lead', { value: 1, currency: 'USD', method: 'lead_magnet' });
        (window as any)?.gtag?.('event', 'download', {
          file_name: magnet.title, file_type: magnet.fileType, content_group1: 'Lead Magnet', value: 75
        });
        (window as any)?.fbq?.('track', 'Lead', { content_name: magnet.title, content_category: 'Lead Magnet', value: 1, currency: 'USD' });
        (window as any)?.fbqq?.('track', 'CompleteRegistration', { content_name: magnet.title, content_category: 'Lead Magnet', value: 75, currency: 'USD' });

        setTimeout(() => {
          const link = document.createElement('a');
          link.href = magnet.downloadUrl;
          link.download = magnet.title;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, 900);

        setTimeout(() => {
          window.location.href = `/gracias.html?src=magnet&name=${encodeURIComponent(magnet.id)}`;
        }, 1400);
      } else {
        throw new Error('Error en el envío');
      }
    } catch (error) {
      console.error('Error al solicitar descarga:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, magnet, isSubmitting]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      aria-labelledby="lead-magnet-title"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto outline-none"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl font-bold"
            aria-label="Cerrar"
            type="button"
          >
            ×
          </button>
          <div className="text-center">
            <img
              src={magnet.iconUrl}
              alt=""
              className="mx-auto mb-6 h-20 w-20 object-contain"
            />
            <h2 id="lead-magnet-title" className="text-2xl md:text-3xl font-bold mb-3">{magnet.title}</h2>
            <p className="text-blue-100 text-lg">{magnet.description}</p>
            <div className="mt-4 inline-flex items-center gap-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full inline-flex items-center gap-2">
                <FileText size={18} weight="duotone" color="#fff" aria-hidden="true" /> {magnet.fileType}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full inline-flex items-center gap-2">
                <HardDrive size={18} weight="duotone" color="#fff" aria-hidden="true" /> {magnet.fileSize}
              </span>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Beneficios */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 inline-flex items-center gap-2">
              <Target size={22} weight="duotone" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600" aria-hidden="true" />
              Lo que incluye este recurso
            </h3>
            <ul className="space-y-3">
              {magnet.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-green-600">
                      <CheckCircle size={16} weight="duotone" color="#fff" aria-hidden="true" />
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Formulario */}
          {submitStatus === 'success' ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-2xl font-bold text-green-800 mb-3">¡Descarga en progreso!</div>
              <div className="text-green-700 mb-4">
                La descarga se abrirá en una nueva pestaña. Si no se abre, revisa que tu navegador no haya bloqueado la ventana emergente.
              </div>
              <button
                onClick={onClose}
                className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                type="button"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" data-form-name="lead_magnet" noValidate>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 inline-flex items-center gap-2">
                  <EnvelopeSimple size={22} weight="duotone" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600" aria-hidden="true" />
                  Acceso inmediato y gratuito
                </h3>
                <p className="text-gray-600">Completa tus datos y recibe la descarga al instante.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre completo *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Tu nombre completo"
                  aria-invalid={submitStatus === 'error' && !isValidName(formData.name)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="tu@email.com"
                  aria-invalid={submitStatus === 'error' && !isValidEmail(formData.email)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de negocio *</label>
                <select
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duración-300"
                  aria-invalid={submitStatus === 'error' && !formData.business_type}
                >
                  <option value="">Selecciona tu tipo de negocio</option>
                  <option value="empresa">Empresa / pyme</option>
                  <option value="servicios">Servicios profesionales</option>
                  <option value="negocio_digital">Negocio digital / e-commerce</option>
                  <option value="formacion">Formación / infoproductos</option>
                  <option value="independiente">Profesional independiente</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              {submitStatus === 'error' && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-800" aria-live="assertive">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">❌</span>
                    <div>
                      <div className="font-semibold">Revisa los datos e inténtalo nuevamente</div>
                      <div className="text-sm text-red-600">Email válido, nombre y tipo de negocio son obligatorios.</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-cta="leadmagnet_download_submit"
                  aria-label={`Descargar ${magnet.title} gratis`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Procesando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <DownloadSimple size={20} weight="duotone" color="#fff" aria-hidden="true" />
                      Descargar Gratis
                    </span>
                  )}
                </button>
              </div>

              <div className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-4">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck size={16} weight="duotone" className="text-green-600" aria-hidden="true" /> Tus datos están protegidos
                </span>
                <span className="inline-flex items-center gap-1">
                  <Gift size={16} weight="duotone" className="text-purple-600" aria-hidden="true" /> 100% gratis
                </span>
                <span className="inline-flex items-center gap-1">
                  <Prohibit size={16} weight="duotone" className="text-red-600" aria-hidden="true" /> Cancelas cuando quieras
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
});

/* =========================
   Sección de Lead Magnets
========================= */
const LeadMagnetSection = memo(() => {
  const [selectedMagnet, setSelectedMagnet] = useState<LeadMagnet | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const prefersNoMotion = () =>
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (window as any)?.gtag?.('event', 'view_item_list', {
              item_list_name: 'lead_magnets',
              section: 'recursos'
            });
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const openModal = useCallback((magnet: LeadMagnet) => {
    setSelectedMagnet(magnet);
    (window as any)?.gtag?.('event', 'view_item', {
      item_id: magnet.id,
      item_name: magnet.title,
      item_category: 'Lead Magnet'
    });
  }, []);

  const closeModal = useCallback(() => setSelectedMagnet(null), []);

  const scrollToContact = useCallback(() => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: prefersNoMotion() ? 'auto' : 'smooth' });
  }, []);

  return (
    <>
      <section
        id="recursos"
        ref={sectionRef}
        className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
        aria-labelledby="recursos-heading"
      >
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="arc-pill inline-flex items-center gap-3 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-3 text-base font-semibold text-purple-700 mb-6">
                <Gift size={20} weight="duotone" className="text-purple-700" aria-hidden="true" />
                Recursos Gratuitos
              </div>
              <h2 id="recursos-heading" className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
                Recursos{' '}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  gratuitos
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                Guías, plantillas y checklists gratuitos, listos para usar.
              </p>
            </div>

            {/* Trust strip */}
            <div
              className="mb-10 rounded-2xl border border-purple-200 bg-white/70 backdrop-blur-sm px-4 py-3 text-sm font-semibold text-purple-700 flex items-center justify-center gap-6"
              aria-label="Indicadores de confianza para descargas"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck size={18} weight="duotone" className="text-green-600" aria-hidden="true" />
                Descarga segura
              </span>
              <span className="flex items-center gap-2">
                <Gift size={18} weight="duotone" className="text-purple-600" aria-hidden="true" />
                100% gratis
              </span>
              <span className="flex items-center gap-2">
                <Prohibit size={18} weight="duotone" className="text-red-600" aria-hidden="true" />
                Sin spam
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {LEAD_MAGNETS.map((magnet) => (
                <article
                  key={magnet.id}
                  className="arc-card bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  aria-label={`Recurso: ${magnet.title}`}
                >
                  <div className="text-center mb-6">
                    <img
                      src={magnet.iconUrl}
                      alt=""
                      className="mx-auto mb-6 h-20 w-20 object-contain"
                    />
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{magnet.title}</h3>
                    <p className="text-gray-600 mb-4">{magnet.description}</p>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6">
                      <span className="inline-flex items-center gap-2">
                        <FileText size={18} weight="duotone" className="text-blue-700" aria-hidden="true" />
                        {magnet.fileType}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <HardDrive size={18} weight="duotone" className="text-purple-700" aria-hidden="true" />
                        {magnet.fileSize}
                      </span>
                    </div>
                  </div>

                  <ul className="mb-6 space-y-2 text-sm text-gray-700">
                    {magnet.benefits.slice(0, 3).map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle size={16} weight="duotone" className="text-green-600 mt-0.5" aria-hidden="true" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => openModal(magnet)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    data-cta={`leadmagnet_open_${magnet.id}`}
                    aria-label={`Abrir formulario para descargar ${magnet.title}`}
                  >
                    <span className="inline-flex items-center gap-2 justify-center">
                      <DownloadSimple size={20} weight="duotone" color="#fff" aria-hidden="true" />
                      Descargar Gratis
                    </span>
                  </button>
                </article>
              ))}
            </div>

            {/* CTA Bottom */}
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                ¿Prefieres una solución a medida para tu negocio? Solicita una evaluación gratuita.
              </p>
              <button
                onClick={scrollToContact}
                className="arc-pill inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                data-cta="leadmagnet_bottom_cta_audit"
                aria-label="Ir a contacto para solicitar una evaluación gratuita"
              >
                Solicitar evaluación gratuita
                <ArrowRight size={20} weight="duotone" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedMagnet && (
        <LeadMagnetModal
          magnet={selectedMagnet}
          isOpen={!!selectedMagnet}
          onClose={closeModal}
        />
      )}
    </>
  );
});

LeadMagnetModal.displayName = 'LeadMagnetModal';
LeadMagnetSection.displayName = 'LeadMagnetSection';

export default LeadMagnetSection;
