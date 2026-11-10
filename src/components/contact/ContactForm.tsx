// src/components/contact/ContactForm.tsx — Formulario de evaluación (reutilizado en la home, las páginas de
// servicio, Lead AI y /contacto).
//
// ⚠️ FLUJO DE CONVERSIÓN (no cambiar sin revisar la medición de Google Ads/GA4/Meta):
//   1. POST a Formspree (mismo endpoint de siempre).
//   2. SOLO si Formspree responde OK → markLeadPending('contact') + form_submit (GA4).
//   3. Redirección a /gracias.html?src=contact, que consume la marca de un solo uso y envía
//      generate_lead (GA4) y Lead (Meta) según el consentimiento. Refrescar, volver atrás o abrir
//      /gracias.html directamente NO genera conversiones.
//   Doble clic / reintentos: bloqueo síncrono con submittingRef.
//
// Fuera de producción (local y vistas previas de Vercel) el formulario se valida igual, pero NO se envía:
// no hay petición a Formspree, ni marca de conversión, ni redirección (ver src/config/environment.ts).
//
// Dos niveles: lo mínimo para iniciar la conversación (nombre, email, qué necesita y una breve
// descripción) y detalles opcionales desplegables (teléfono, empresa y plazo).
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { CaretDown, CheckCircle, Info, PaperPlaneRight, Prohibit } from 'phosphor-react';
import { isProductionHost } from '../../config/environment';
import { trackEvent, trackFormSubmission } from '../../utils/analytics';
import { trackFormStart, trackServiceInterest } from '../../utils/events';
import { markLeadPending } from '../../utils/leadConversion';
import { INTEREST_EVENT, INTEREST_OPTIONS } from '../../utils/contactIntent';
import type { Interest } from '../../utils/contactIntent';

const FORMSPREE_URL = 'https://formspree.io/f/xvkzpjzb';

const TIMELINE_OPTIONS = [
  { value: 'pronto', label: 'Lo antes posible' },
  { value: '1_3_meses', label: 'En los próximos 1 a 3 meses' },
  { value: 'explorando', label: 'Estoy explorando opciones' },
];

// Parámetros de campaña de la URL actual (se envían a Formspree con la solicitud).
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
      landing: location.pathname + location.search,
    };
  } catch {
    return {};
  }
};

const isInterest = (v: string | null): v is Interest => !!v && INTEREST_OPTIONS.some((o) => o.value === v);

const EMPTY = {
  name: '',
  email: '',
  phone: '', // opcional
  company: '', // opcional
  timeline: '', // opcional
  interest: '',
  message: '',
  website: '', // honeypot (oculto)
};

const isValidEmail = (v: string) => /\S+@\S+\.\S+/.test(v.trim());
const isValidPhone = (v: string) => v.trim() === '' || /^[\d+\s()-]{7,}$/.test(v.trim());
const isValidName = (v: string) => v.trim().length >= 2;
const isFilled = (v: string) => v.trim().length > 0;

const inputClass =
  'block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 aria-[invalid=true]:border-red-400';
const labelClass = 'mb-1.5 block text-sm font-semibold text-slate-800';

function FieldError({ show, id, children }: { show: boolean; id: string; children: string }) {
  if (!show) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-red-600">
      {children}
    </p>
  );
}

export default function ContactForm({
  location: formLocation,
  defaultInterest,
  submitLabel = 'Solicitar evaluación gratuita',
}: {
  /** Dónde está el formulario (analítica): "home", "contacto", "software", … */
  location: string;
  defaultInterest?: Interest;
  submitLabel?: string;
}) {
  const [formData, setFormData] = useState({ ...EMPTY, interest: defaultInterest ?? '' });
  const [showDetails, setShowDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // invalid = datos incompletos; error = fallo de envío (red/servidor)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'invalid' | 'error' | 'preview'>('idle');
  // Se decide tras montar (en el prerender no hay dominio): evita desajustes al hidratar.
  const [previewMode, setPreviewMode] = useState(false);
  useEffect(() => setPreviewMode(!isProductionHost()), []);

  // Bloqueo síncrono contra envíos duplicados (dos clics en el mismo render).
  const submittingRef = useRef(false);
  const startedRef = useRef(false);
  const fid = (name: string) => `${formLocation}-${name}`;

  // Preselección desde la URL (/contacto?servicio=…) y desde CTAs de la misma página (evento global).
  useEffect(() => {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get('servicio');
      if (isInterest(fromUrl)) setFormData((prev) => ({ ...prev, interest: fromUrl }));
    } catch {
      // Sin preselección: el usuario elige la opción manualmente.
    }
    const onInterest = (e: Event) => {
      const interest = (e as CustomEvent<Interest>).detail;
      if (isInterest(interest)) setFormData((prev) => ({ ...prev, interest }));
    };
    window.addEventListener(INTEREST_EVENT, onInterest);
    return () => window.removeEventListener(INTEREST_EVENT, onInterest);
  }, []);

  const onFirstInteraction = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackFormStart(formLocation);
  }, [formLocation]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'interest' && value) trackServiceInterest(value, 'form');
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (submittingRef.current) return; // evita doble envío

      // Honeypot: si tiene algo, abortar silenciosamente
      if (formData.website) return;

      if (
        !isValidName(formData.name) ||
        !isValidEmail(formData.email) ||
        !isValidPhone(formData.phone) ||
        !formData.interest ||
        !isFilled(formData.message)
      ) {
        if (!isValidPhone(formData.phone)) setShowDetails(true);
        setSubmitStatus('invalid');
        return;
      }

      // Vista previa o local: validación correcta, pero sin envío real (ni lead, ni cuota, ni conversión).
      if (!isProductionHost()) {
        setSubmitStatus('preview');
        return;
      }

      submittingRef.current = true;
      setIsSubmitting(true);
      setSubmitStatus('idle');

      try {
        const utm = getLightUTM();
        const response = await fetch(FORMSPREE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            interest: formData.interest,
            timeline: formData.timeline,
            message: formData.message,
            // Asunto de la notificación de Formspree (campo "subject" admitido por Formspree).
            subject: 'Nueva solicitud de evaluación — MAASTAC',
            form_name: 'Evaluación Gratuita',
            form_location: formLocation,
            source: 'MAASTAC Website',
            timestamp: new Date().toISOString(),
            page_url: window.location.href,
            user_agent: navigator.userAgent,
            ...utm,
          }),
        });

        if (!response.ok) throw new Error('Error en el envío');

        // Marca de un solo uso: /gracias.html solo envía generate_lead / Lead si la encuentra.
        markLeadPending('contact');
        setSubmitStatus('success');
        const submittedInterest = formData.interest;
        setFormData({ ...EMPTY });

        try {
          window.lintrk?.('track', { conversion_id: 'lead_generation' }); // LinkedIn (si existe)
        } catch {
          // La medición nunca debe afectar al formulario.
        }

        // GA4 form_submit (solo con consentimiento analítico): interés, ubicación y parámetros utm.
        const campaign = Object.fromEntries(Object.entries(utm).filter(([key]) => key.startsWith('utm_')));
        trackFormSubmission('contact', {
          form_name: 'Evaluación Gratuita',
          form_location: formLocation,
          interest: submittedInterest,
          ...campaign,
        });

        setTimeout(() => {
          window.location.href = '/gracias.html?src=contact';
        }, 400);
      } catch (error: unknown) {
        console.error('Error al enviar formulario:', error);
        setSubmitStatus('error');
        try {
          trackEvent('form_error', { form_type: 'contact', error_type: error instanceof TypeError ? 'network' : 'server' });
        } catch {
          // La medición nunca debe afectar al formulario.
        }
      } finally {
        submittingRef.current = false;
        setIsSubmitting(false);
      }
    },
    [formData, formLocation],
  );

  const invalid = submitStatus === 'invalid';

  return (
    <form
      onSubmit={handleSubmit}
      onFocusCapture={onFirstInteraction}
      className="space-y-5"
      data-form-name="contact_audit"
      data-form-location={formLocation}
      noValidate
      aria-describedby={fid('status')}
    >
      {/* Honeypot (oculto a personas) */}
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={fid('name')} className={labelClass}>
            Nombre <span className="text-blue-700">*</span>
          </label>
          <input
            id={fid('name')}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            aria-invalid={invalid && !isValidName(formData.name)}
            aria-describedby={invalid && !isValidName(formData.name) ? fid('name-error') : undefined}
            className={inputClass}
            placeholder="Tu nombre"
            autoComplete="name"
          />
          <FieldError show={invalid && !isValidName(formData.name)} id={fid('name-error')}>
            Escribe tu nombre.
          </FieldError>
        </div>
        <div>
          <label htmlFor={fid('email')} className={labelClass}>
            Email <span className="text-blue-700">*</span>
          </label>
          <input
            id={fid('email')}
            type="email"
            name="email"
            inputMode="email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-invalid={invalid && !isValidEmail(formData.email)}
            aria-describedby={invalid && !isValidEmail(formData.email) ? fid('email-error') : undefined}
            className={inputClass}
            placeholder="tu@empresa.com"
            autoComplete="email"
          />
          <FieldError show={invalid && !isValidEmail(formData.email)} id={fid('email-error')}>
            Escribe un email válido.
          </FieldError>
        </div>
      </div>

      <div>
        <label htmlFor={fid('interest')} className={labelClass}>
          ¿Qué necesitas? <span className="text-blue-700">*</span>
        </label>
        <select
          id={fid('interest')}
          name="interest"
          value={formData.interest}
          onChange={handleChange}
          required
          aria-invalid={invalid && !formData.interest}
          aria-describedby={invalid && !formData.interest ? fid('interest-error') : undefined}
          className={inputClass}
        >
          <option value="">Selecciona una opción</option>
          {INTEREST_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <FieldError show={invalid && !formData.interest} id={fid('interest-error')}>
          Elige la opción más cercana; si dudas, marca «Otro / aún no lo sé».
        </FieldError>
      </div>

      <div>
        <label htmlFor={fid('message')} className={labelClass}>
          Cuéntanos brevemente tu caso <span className="text-blue-700">*</span>
        </label>
        <textarea
          id={fid('message')}
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          aria-invalid={invalid && !isFilled(formData.message)}
          aria-describedby={invalid && !isFilled(formData.message) ? fid('message-error') : undefined}
          className={`${inputClass} resize-y`}
          placeholder="Qué quieres construir, automatizar o integrar, y qué herramientas usas hoy"
        />
        <FieldError show={invalid && !isFilled(formData.message)} id={fid('message-error')}>
          Añade una breve descripción para preparar la evaluación.
        </FieldError>
      </div>

      {/* Segundo nivel: detalles opcionales */}
      <div className="rounded-xl border border-dashed border-slate-300">
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          aria-expanded={showDetails}
          aria-controls={fid('details')}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:text-blue-700"
          data-cta={`form_details_${formLocation}`}
        >
          Añadir teléfono, empresa y plazo (opcional)
          <CaretDown
            size={16}
            weight="bold"
            className={`shrink-0 transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {showDetails && (
          <div id={fid('details')} className="grid gap-5 border-t border-slate-200 px-4 pb-4 pt-4 sm:grid-cols-2">
            <div>
              <label htmlFor={fid('phone')} className={labelClass}>
                Teléfono o WhatsApp
              </label>
              <input
                id={fid('phone')}
                type="tel"
                name="phone"
                inputMode="tel"
                value={formData.phone}
                onChange={handleChange}
                aria-invalid={invalid && !isValidPhone(formData.phone)}
                aria-describedby={invalid && !isValidPhone(formData.phone) ? fid('phone-error') : undefined}
                className={inputClass}
                placeholder="+51 …"
                autoComplete="tel"
              />
              <FieldError show={invalid && !isValidPhone(formData.phone)} id={fid('phone-error')}>
                Revisa el número (mínimo 7 dígitos).
              </FieldError>
            </div>
            <div>
              <label htmlFor={fid('company')} className={labelClass}>
                Empresa o negocio
              </label>
              <input
                id={fid('company')}
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={inputClass}
                placeholder="Nombre de tu empresa"
                autoComplete="organization"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={fid('timeline')} className={labelClass}>
                ¿Cuándo te gustaría empezar?
              </label>
              <select id={fid('timeline')} name="timeline" value={formData.timeline} onChange={handleChange} className={inputClass}>
                <option value="">Sin preferencia</option>
                {TIMELINE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Estado accesible */}
      <div id={fid('status')} className="sr-only" aria-live="polite">
        {submitStatus === 'success'
          ? 'Solicitud enviada correctamente'
          : submitStatus === 'invalid'
            ? 'Faltan datos obligatorios'
            : submitStatus === 'error'
              ? 'No se pudo enviar la solicitud'
              : submitStatus === 'preview'
                ? 'Datos válidos. En la vista previa la solicitud no se envía'
                : ''}
      </div>

      {submitStatus === 'success' && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
          <CheckCircle size={22} weight="duotone" className="mt-0.5 shrink-0 text-green-600" aria-hidden="true" />
          <div>
            <p className="font-semibold">Solicitud enviada</p>
            <p className="text-sm">Revisaremos tu caso y te contactaremos para coordinar la evaluación.</p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          <Prohibit size={22} weight="duotone" className="mt-0.5 shrink-0 text-red-600" aria-hidden="true" />
          <div>
            <p className="font-semibold">No pudimos enviar tu solicitud</p>
            <p className="text-sm">Inténtalo de nuevo en unos minutos o escríbenos directamente por WhatsApp o email.</p>
          </div>
        </div>
      )}

      {previewMode && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900" role="note" data-preview-notice>
          <Info size={22} weight="duotone" className="mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-semibold">Vista previa: envíos desactivados</p>
            <p>
              {submitStatus === 'preview'
                ? 'Los datos son válidos. En esta vista previa la solicitud no se envía ni se registra.'
                : 'Puedes revisar el formulario y su validación. En esta versión de prueba no se envía ningún dato.'}
            </p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:from-blue-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        data-cta="contact_submit"
      >
        {isSubmitting ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
            Enviando…
          </>
        ) : (
          <>
            {submitLabel}
            <PaperPlaneRight size={18} weight="duotone" aria-hidden="true" />
          </>
        )}
      </button>

      {/* Información básica de privacidad (primera capa). La segunda capa es /privacidad. */}
      <p className="text-center text-xs leading-relaxed text-slate-500" data-privacy-notice>
        Usaremos los datos que nos envíes para atender y responder a tu solicitud. Consulta nuestra{' '}
        <a href="/privacidad" className="font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900">
          Política de Privacidad
        </a>
        .
      </p>
    </form>
  );
}
