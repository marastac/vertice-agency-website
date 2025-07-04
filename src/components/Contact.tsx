import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // 🔥 REEMPLAZA 'TU-FORM-ID' con tu ID real de Formspree
      const FORMSPREE_URL = 'https://formspree.io/f/mdkzjjez';
      
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          business: formData.business,
          message: formData.message,
          source: 'Vértice Agency Website',
          timestamp: new Date().toISOString(),
          page_url: window.location.href
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', business: '', message: '' });
        
        // Track successful submission with Google Analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'form_submit', {
            form_type: 'contact_audit',
            form_name: 'Auditoría Gratuita',
            page_location: window.location.href,
            value: 100
          });
        }

        // Track with Facebook Pixel
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Lead', {
            content_name: 'Auditoría Gratuita',
            content_category: 'Lead Generation',
            value: 100,
            currency: 'USD'
          });
        }

        // Track with LinkedIn Insight Tag
        if (typeof window !== 'undefined' && (window as any).lintrk) {
          (window as any).lintrk('track', { conversion_id: 'lead_generation' });
        }

      } else {
        throw new Error('Error en el envío');
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-white py-20 md:py-28">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 rounded-full border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 text-base font-semibold text-blue-700 mb-6">
              <span className="text-xl">📞</span>
              Contacto
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              ¿Listo para{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Transformar tu Negocio?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Agenda tu auditoría gratuita y descubre cómo la IA puede multiplicar tus resultados
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Formulario */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-100">
              <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  🚀 Auditoría Gratuita con IA
                </h3>
                <p className="text-gray-600">
                  Completa el formulario y recibe tu análisis personalizado en 24 horas
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                    placeholder="Tu nombre completo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Email empresarial *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                    placeholder="tu@empresa.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                    placeholder="+51 999 999 999"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Tipo de negocio *
                  </label>
                  <select
                    name="business"
                    value={formData.business}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                  >
                    <option value="">Selecciona tu tipo de negocio</option>
                    <option value="coach">Coach / Mentor</option>
                    <option value="consultor">Consultor</option>
                    <option value="creador">Creador de Contenido</option>
                    <option value="infoproductos">Infoproductos</option>
                    <option value="servicios">Servicios Profesionales</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Cuéntanos tu desafío principal *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg resize-none"
                    placeholder="Describe tu mayor desafío en marketing digital..."
                  ></textarea>
                </div>
                
                {submitStatus === 'success' && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-green-800">
                    <div className="text-center">
                      <div className="text-4xl mb-3">🎉</div>
                      <div className="text-xl font-bold mb-2">¡Solicitud enviada con éxito!</div>
                      <div className="text-green-700 mb-4">
                        Te contactaremos en las próximas 24 horas para agendar tu auditoría gratuita.
                      </div>
                      <div className="text-sm text-green-600">
                        Revisa tu email (incluyendo spam) para la confirmación.
                      </div>
                    </div>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">❌</span>
                      <div>
                        <div className="font-semibold">Error al enviar el formulario</div>
                        <div className="text-sm text-red-600">
                          Por favor, intenta nuevamente o contáctanos directamente por WhatsApp.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 px-6 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Enviando...
                    </span>
                  ) : (
                    "Solicitar Auditoría Gratuita 🚀"
                  )}
                </button>
              </form>
            </div>

            {/* Información lateral */}
            <div className="space-y-8">
              
              {/* Beneficios */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-3xl">🎯</span>
                  ¿Qué incluye tu auditoría gratuita?
                </h3>
                <ul className="space-y-4">
                  {[
                    "Análisis completo de tu estrategia actual",
                    "Identificación de oportunidades con IA",
                    "Plan de acción personalizado",
                    "Proyección de resultados esperados",
                    "Propuesta de automatización específica"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <span className="text-gray-700 font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contacto directo */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="text-3xl">💬</span>
                  ¿Prefieres hablar directamente?
                </h3>
                <div className="space-y-4">
                  <a 
                    href="https://wa.me/51999999999?text=Hola%2C%20quiero%20solicitar%20mi%20auditor%C3%ADa%20gratuita%20de%20IA"
                    className="flex items-center gap-4 hover:bg-white/10 rounded-xl p-3 transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      // Track WhatsApp click
                      if (typeof window !== 'undefined' && (window as any).gtag) {
                        (window as any).gtag('event', 'whatsapp_click', {
                          contact_method: 'whatsapp',
                          page_location: window.location.href
                        });
                      }
                    }}
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xl">📱</span>
                    </div>
                    <div>
                      <div className="font-semibold">WhatsApp</div>
                      <div className="text-blue-100">+51 999 999 999</div>
                    </div>
                  </a>
                  <a 
                    href="mailto:hola@verticeagency.com"
                    className="flex items-center gap-4 hover:bg-white/10 rounded-xl p-3 transition-all duration-300"
                    onClick={() => {
                      // Track email click
                      if (typeof window !== 'undefined' && (window as any).gtag) {
                        (window as any).gtag('event', 'email_click', {
                          contact_method: 'email',
                          page_location: window.location.href
                        });
                      }
                    }}
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xl">📧</span>
                    </div>
                    <div>
                      <div className="font-semibold">Email</div>
                      <div className="text-blue-100">hola@verticeagency.com</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;