// src/components/Contact.tsx
import { useState, memo, useCallback, useEffect, useRef } from 'react';
import { trackEvent, trackFormSubmission } from '../utils/analytics';
import { CONTACT_EMAIL, WHATSAPP_DISPLAY, whatsappUrl } from '../config/contact';
import { markLeadPending } from '../utils/leadConversion';
import { INTEREST_EVENT, INTEREST_OPTIONS } from '../utils/contactIntent';
import type { Interest } from '../utils/contactIntent';
import {
  Phone,
  Rocket,
  CheckCircle,
  WhatsappLogo,
  EnvelopeSimple,
  ShieldCheck,
  Prohibit,
  PaperPlaneRight,
  Target,
  ListChecks,
} from 'phosphor-react';

// Utilidad UTM ligera (sin dependencia externa)
const getLightUTM = () => {
  try {
    const qs = new URLSearchParams(location.search);
    return {
      utm_source: qs.get('utm_source') || '',
      utm_medium: qs.get('utm_medium') || '',
      utm_campaign: qs.get('utm_campaign') || '',
      utm_term: qs.get('utm_term') || '',
      utm_content: qs.get('utm_content') || '',
      referrer: document.referrer || '',
      landing: location.pathname + location.search
    };
  } catch {
    return {};
  }
};

const Contact = memo(() => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '', // opcional
    company: '',
    interest: '', // qué necesita (preseleccionable desde los CTAs)
    message: '',
    website: '' // honeypot (no mostrar)
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  // invalid = datos incompletos; error = fallo de envío (red/servidor)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'invalid' | 'error'>('idle');

  const sectionRef = useRef<HTMLElement | null>(null);

  // Preselección de "¿Qué necesitas?" cuando el usuario llega desde un CTA de servicio / Lead AI
  useEffect(() => {
    const onInterest = (e: Event) => {
      const interest = (e as CustomEvent<Interest>).detail;
      if (INTEREST_OPTIONS.some((o) => o.value === interest)) {
        setFormData((prev) => ({ ...prev, interest }));
      }
    };
    window.addEventListener(INTEREST_EVENT, onInterest);
    return () => window.removeEventListener(INTEREST_EVENT, onInterest);
  }, []);

  // Vista de sección (view_item) con IntersectionObserver
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            trackEvent('view_item', {
              item_category: 'contact',
              section: 'contact',
              engagement_time_msec: 1000
            });
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const isValidEmail = (v: string) => /\S+@\S+\.\S+/.test(v.trim());
  // Teléfono opcional: solo se valida si se rellena
  const isValidPhone = (v: string) => v.trim() === '' || /^[\d+\s()-]{7,}$/.test(v.trim());
  const isValidName = (v: string) => v.trim().length >= 2;
  const isFilled = (v: string) => v.trim().length > 0;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitting) return; // evita doble envío

      // Honeypot: si tiene algo, abortar silenciosamente
      if (formData.website) return;

      // Validación básica en cliente
      if (
        !isValidName(formData.name) ||
        !isValidEmail(formData.email) ||
        !isValidPhone(formData.phone) ||
        !formData.interest ||
        !isFilled(formData.message)
      ) {
        setSubmitStatus('invalid');
        return;
      }

      setIsSubmitting(true);
      setSubmitStatus('idle');

      try {
        const FORMSPREE_URL = 'https://formspree.io/f/xvkzpjzb';
        const utm = getLightUTM();

        const response = await fetch(FORMSPREE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            interest: formData.interest,
            message: formData.message,
            form_name: 'Evaluación Gratuita',
            source: 'MAASTAC Website',
            timestamp: new Date().toISOString(),
            page_url: window.location.href,
            user_agent: navigator.userAgent,
            ...utm
          })
        });

        if (response.ok) {
          // Marca de un solo uso: /gracias.html solo envía generate_lead / Lead si la encuentra.
          markLeadPending('contact');
          setSubmitStatus('success');
          const submittedInterest = formData.interest;
          setFormData({ name: '', email: '', phone: '', company: '', interest: '', message: '', website: '' });

          // LinkedIn (si existe)
          try {
            (window as any)?.lintrk?.('track', { conversion_id: 'lead_generation' });
          } catch {}

          // GA4 form_submit (solo con consentimiento analítico). El Lead de Meta y la conversión
          // generate_lead se envían desde /gracias.html según el consentimiento.
          trackFormSubmission('contact', { form_name: 'Evaluación Gratuita', interest: submittedInterest, ...utm });

          // Redirección a página de gracias
          setTimeout(() => {
            window.location.href = '/gracias.html?src=contact';
          }, 400);
        } else {
          throw new Error('Error en el envío');
        }
      } catch (error: any) {
        console.error('Error al enviar formulario:', error);
        setSubmitStatus('error');
        try {
          trackEvent('form_error', { form_type: 'contact', error_message: error?.message || String(error) });
        } catch {}
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, isSubmitting]
  );

  const handleWhatsAppClick = useCallback(() => {
    trackEvent('whatsapp_click', {
      contact_method: 'whatsapp',
      page_location: window.location.href
    });
  }, []);

  const handleEmailClick = useCallback(() => {
    trackEvent('email_click', {
      contact_method: 'email',
      page_location: window.location.href
    });
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-white py-20 md:py-28"
      aria-labelledby="contact-heading"
    >
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 rounded-full border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 text-base font-semibold text-blue-700 mb-6">
              <Phone size={20} weight="duotone" aria-hidden="true" />
              Contacto
            </div>
            <h2
              id="contact-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6"
            >
              Cuéntanos qué quieres{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                automatizar, construir o integrar
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Solicita una <strong>evaluación gratuita y sin compromiso</strong>. Revisamos tu caso y te proponemos
              por dónde empezar.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulario */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-100">
              <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 inline-flex items-center gap-3">
                  <Rocket size={24} weight="duotone" className="text-blue-600" aria-hidden="true" />
                  Evaluación gratuita
                </h3>
                <p className="text-gray-600">
                  Completa el formulario: revisaremos tu solicitud y nos pondremos en contacto contigo. Sin compromiso.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
                data-form-name="contact_audit"
                noValidate
                aria-describedby="contact-status"
              >
                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div>
                  <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-700 mb-3">Nombre *</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    aria-invalid={submitStatus === 'invalid' && !isValidName(formData.name)}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                    placeholder="Tu nombre"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-700 mb-3">Email *</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    aria-invalid={submitStatus === 'invalid' && !isValidEmail(formData.email)}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                    placeholder="tu@empresa.com"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-semibold text-gray-700 mb-3">
                    Teléfono o WhatsApp <span className="font-normal text-gray-500">(opcional)</span>
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    aria-invalid={submitStatus === 'invalid' && !isValidPhone(formData.phone)}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                    placeholder="Incluye prefijo de país"
                    autoComplete="tel"
                  />
                </div>

                <div>
                  <label htmlFor="contact-company" className="block text-sm font-semibold text-gray-700 mb-3">
                    Empresa o negocio <span className="font-normal text-gray-500">(opcional)</span>
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                    placeholder="Tu empresa o negocio"
                    autoComplete="organization"
                  />
                </div>

                <div>
                  <label htmlFor="contact-interest" className="block text-sm font-semibold text-gray-700 mb-3">¿Qué necesitas? *</label>
                  <select
                    id="contact-interest"
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    required
                    aria-invalid={submitStatus === 'invalid' && !formData.interest}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                  >
                    <option value="">Selecciona una opción</option>
                    {INTEREST_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-700 mb-3">
                    Cuéntanos brevemente tu proyecto *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    aria-invalid={submitStatus === 'invalid' && !isFilled(formData.message)}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg resize-none"
                    placeholder="Qué quieres construir o mejorar y qué herramientas usas hoy"
                  ></textarea>
                </div>

                {/* Estado accesible */}
                <div id="contact-status" className="sr-only" aria-live="polite">
                  {submitStatus === 'success'
                    ? 'Solicitud enviada correctamente'
                    : submitStatus === 'invalid'
                    ? 'Faltan datos obligatorios'
                    : submitStatus === 'error'
                    ? 'No se pudo enviar la solicitud'
                    : ''}
                </div>

                {submitStatus === 'success' && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-green-800">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center mb-3">
                        <CheckCircle size={28} weight="duotone" className="text-green-600" aria-hidden="true" />
                      </div>
                      <div className="text-xl font-bold mb-2">¡Solicitud enviada con éxito!</div>
                      <div className="text-green-700">
                        Revisaremos tu solicitud y nos pondremos en contacto contigo para coordinar la evaluación.
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus === 'invalid' && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-800">
                    <div className="flex items-center gap-2">
                      <Prohibit size={20} weight="duotone" className="text-red-600" aria-hidden="true" />
                      <div>
                        <div className="font-semibold">Revisa tus datos e inténtalo de nuevo</div>
                        <div className="text-sm text-red-600">
                          Nombre, email válido, qué necesitas y una breve descripción son obligatorios.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-800">
                    <div className="flex items-center gap-2">
                      <Prohibit size={20} weight="duotone" className="text-red-600" aria-hidden="true" />
                      <div>
                        <div className="font-semibold">No pudimos enviar tu solicitud</div>
                        <div className="text-sm text-red-600">
                          Inténtalo de nuevo en unos minutos o escríbenos directamente por WhatsApp o email.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 px-6 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-cta="contact_submit"
                  aria-label="Enviar formulario para solicitar una evaluación gratuita"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Enviando...
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center gap-2">
                      Solicitar evaluación gratuita
                      <PaperPlaneRight size={20} weight="duotone" aria-hidden="true" />
                    </span>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-4">
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck size={14} weight="duotone" className="text-green-600" aria-hidden="true" /> Datos protegidos
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Prohibit size={14} weight="duotone" className="text-red-600" aria-hidden="true" /> Sin spam
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Target size={14} weight="duotone" className="text-blue-600" aria-hidden="true" /> Sin compromiso
                  </span>
                </p>

                {/* Información básica de privacidad (primera capa). Sin casilla obligatoria, sin consentimiento
                    de marketing y sin depender de las cookies. La segunda capa es /privacidad.
                    TODO(ANTES DEL LANZAMIENTO): revisar cuando /privacidad deje de ser borrador. */}
                <p className="text-xs leading-relaxed text-gray-500 text-center" data-privacy-notice>
                  Usaremos los datos que nos envíes para atender y responder a tu solicitud. Consulta nuestra{' '}
                  <a href="/privacidad" className="font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900">
                    Política de Privacidad
                  </a>
                  .
                </p>
              </form>
            </div>

            {/* Información lateral */}
            <div className="space-y-8">
              {/* Beneficios */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <ListChecks size={24} weight="duotone" className="text-green-600" aria-hidden="true" />
                  ¿Qué incluye la evaluación?
                </h3>
                <ul className="space-y-4">
                  {[
                    'Revisión de tus procesos y herramientas actuales',
                    'Oportunidades concretas de automatización e integración',
                    'Recomendación de por dónde empezar',
                    'Propuesta con alcance y plazos si decides avanzar'
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle size={14} weight="duotone" color="#FFFFFF" aria-hidden="true" />
                      </div>
                      <span className="text-gray-700 font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contacto directo */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Phone size={24} weight="duotone" aria-hidden="true" />
                  ¿Prefieres hablar directamente?
                </h3>
                <div className="space-y-4">
                  {/* Datos de contacto centralizados en src/config/contact.ts */}
                  <a
                    href={whatsappUrl('Hola, quiero solicitar una evaluación gratuita')}
                    className="flex items-center gap-4 hover:bg-white/10 rounded-xl p-3 transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatsAppClick}
                    data-cta="contact_whatsapp"
                    aria-label="Abrir WhatsApp para solicitar una evaluación"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <WhatsappLogo size={22} weight="duotone" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-semibold">WhatsApp</div>
                      <div className="text-blue-100">{WHATSAPP_DISPLAY}</div>
                    </div>
                  </a>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="flex items-center gap-4 hover:bg-white/10 rounded-xl p-3 transition-all duración-300"
                    onClick={handleEmailClick}
                    data-cta="contact_email"
                    aria-label="Abrir correo para escribir a MAASTAC"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <EnvelopeSimple size={22} weight="duotone" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-semibold">Email</div>
                      <div className="text-blue-100 text-sm sm:text-base break-words">{CONTACT_EMAIL}</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            {/* /Información lateral */}
          </div>
        </div>
      </div>
    </section>
  );
});

Contact.displayName = 'Contact';
export default Contact;
