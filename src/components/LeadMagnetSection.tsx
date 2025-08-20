import { useState, memo, useCallback } from 'react';

interface LeadMagnetFormData {
  email: string;
  name: string;
  business_type: string;
}

interface LeadMagnet {
  id: string;
  title: string;
  description: string;
  icon: string;
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
    description: 'Descubre cómo crear una marca memorable usando inteligencia artificial y herramientas automatizadas.',
    icon: '🎨',
    downloadUrl: 'https://drive.google.com/file/d/1ziAIIPewct4cIq5sZXA6ds0Gp7nX1hm9/view?usp=drive_link', // URL real del PDF
    fileType: 'PDF',
    fileSize: '2.8 MB',
    benefits: [
      'Estrategias de branding con IA paso a paso',
      'Herramientas gratuitas y premium recomendadas',
      'Ejemplos reales de casos de éxito',
      'Templates editables incluidos'
    ]
  },
  {
    id: 'checklist-optimizacion',
    title: 'Checklist: Optimización de Conversiones con IA',
    description: 'Lista de verificación completa para maximizar tus conversiones usando automatización inteligente.',
    icon: '📋',
    downloadUrl: 'https://drive.google.com/file/d/1TS6vU4WgeqPHp80LRdAQ2_1rWtAV1yRz/view?usp=drive_link',
    fileType: 'PDF',
    fileSize: '1.5 MB',
    benefits: [
      'Checklist de 50+ puntos de optimización',
      'Métricas clave para medir resultados',
      'Herramientas de IA recomendadas',
      'Scripts de automatización listos para usar'
    ]
  },
  {
    id: 'template-brief',
    title: 'Template: Brief Creativo para Proyectos de IA',
    description: 'Plantilla profesional para planificar y ejecutar proyectos de marketing digital con IA.',
    icon: '📝',
    downloadUrl: 'https://drive.google.com/file/d/1BvowhgodatIK7ULlgDFaeEh3KYnuuzM9/view?usp=drive_link',
    fileType: 'DOCX + PDF',
    fileSize: '850 KB',
    benefits: [
      'Template editable en Word y Google Docs',
      'Secciones pre-estructuradas',
      'Ejemplos de briefings exitosos',
      'Guía de uso paso a paso'
    ]
  }
];

const LeadMagnetModal = memo(({ magnet, isOpen, onClose }: LeadMagnetModalProps) => {
  const [formData, setFormData] = useState<LeadMagnetFormData>({
    email: '',
    name: '',
    business_type: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Envío a Formspree con información del lead magnet
      const response = await fetch('https://formspree.io/f/mdkzjjez', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        
        // 📊 Analytics tracking
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'download', {
            file_name: magnet.title,
            file_type: magnet.fileType,
            content_group1: 'Lead Magnet',
            value: 75
          });
        }

        // 📱 Facebook Pixel tracking
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'CompleteRegistration', {
            content_name: magnet.title,
            content_category: 'Lead Magnet',
            value: 75,
            currency: 'USD'
          });
        }

        // Simular descarga después de 2 segundos
        setTimeout(() => {
          // Aquí iría la lógica real de descarga
          console.log(`Descargando: ${magnet.title}`);
          // window.open(magnet.downloadUrl, '_blank');
        }, 2000);

      } else {
        throw new Error('Error en el envío');
      }
    } catch (error) {
      console.error('Error al solicitar descarga:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, magnet]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-2xl">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
          <div className="text-center">
            <div className="text-6xl mb-4">{magnet.icon}</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{magnet.title}</h2>
            <p className="text-blue-100 text-lg">{magnet.description}</p>
            <div className="mt-4 inline-flex items-center gap-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">
                📄 {magnet.fileType}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full">
                💾 {magnet.fileSize}
              </span>
            </div>
          </div>
        </div>

        <div className="p-8">
          
          {/* Beneficios */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              🎯 Lo que incluye este recurso:
            </h3>
            <ul className="space-y-3">
              {magnet.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-sm font-bold">✓</span>
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
              <div className="text-2xl font-bold text-green-800 mb-3">
                ¡Descarga en Progreso!
              </div>
              <div className="text-green-700 mb-4">
                Hemos enviado el enlace de descarga a tu email. 
                También te hemos agregado a nuestra newsletter con contenido exclusivo.
              </div>
              <div className="text-sm text-green-600">
                Si no recibes el email en 5 minutos, revisa tu carpeta de spam.
              </div>
              <button
                onClick={onClose}
                className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  📧 Acceso Inmediato y Gratuito
                </h3>
                <p className="text-gray-600">
                  Completa estos datos y recibe tu descarga al instante
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Tu nombre completo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="tu@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de negocio *
                </label>
                <select
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                >
                  <option value="">Selecciona tu tipo de negocio</option>
                  <option value="coach">Coach / Mentor</option>
                  <option value="consultor">Consultor</option>
                  <option value="creador">Creador de Contenido</option>
                  <option value="infoproductos">Infoproductos</option>
                  <option value="servicios">Servicios Profesionales</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              
              {submitStatus === 'error' && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">❌</span>
                    <div>
                      <div className="font-semibold">Error al procesar la solicitud</div>
                      <div className="text-sm text-red-600">
                        Por favor, intenta nuevamente o contáctanos directamente.
                      </div>
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
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Procesando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Descargar Gratis
                      <span className="text-lg">⬇️</span>
                    </span>
                  )}
                </button>
              </div>

              <div className="text-xs text-gray-500 text-center mt-4">
                🔒 Tus datos están protegidos • 📧 Sin spam • ❌ Unsubscribe cuando quieras
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
});

const LeadMagnetSection = memo(() => {
  const [selectedMagnet, setSelectedMagnet] = useState<LeadMagnet | null>(null);

  const openModal = useCallback((magnet: LeadMagnet) => {
    setSelectedMagnet(magnet);
    
    // Track modal open
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'view_item', {
        item_id: magnet.id,
        item_name: magnet.title,
        item_category: 'Lead Magnet'
      });
    }
  }, []);

  const closeModal = useCallback(() => {
    setSelectedMagnet(null);
  }, []);

  return (
    <>
      <section id="recursos" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 rounded-full border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-3 text-base font-semibold text-purple-700 mb-6">
                <span className="text-xl">🎁</span>
                Recursos Gratuitos
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
                Acelera tu Crecimiento con{" "}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Recursos Premium
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                Descarga gratis nuestras guías, templates y checklists creados por expertos en IA y marketing digital
              </p>
            </div>

            {/* Lead Magnets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {LEAD_MAGNETS.map((magnet) => (
                <div key={magnet.id} className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-4">{magnet.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{magnet.title}</h3>
                    <p className="text-gray-600 mb-4">{magnet.description}</p>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6">
                      <span>📄 {magnet.fileType}</span>
                      <span>💾 {magnet.fileSize}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => openModal(magnet)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Descargar Gratis 🚀
                  </button>
                </div>
              ))}
            </div>

            {/* CTA Bottom */}
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                ¿Necesitas una estrategia personalizada? Agenda tu auditoría gratuita
              </p>
              <button
                onClick={() => {
                  const element = document.getElementById('contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Solicitar Auditoría Gratuita
                <span className="text-xl">→</span>
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