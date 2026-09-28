// src/components/Newsletter.tsx
import { memo, useCallback, useMemo, useState } from 'react';
import { trackEvent, trackFormSubmission } from '../utils/analytics';
import {
  EnvelopeSimple,
  Sparkle,
  PaperPlaneRight,
  ShieldCheck,
  Prohibit,
} from 'phosphor-react';

type NewsletterProps = {
  variant?: 'hero' | 'footer' | 'popup';
  onSuccess?: () => void;
};

interface NewsletterFormData {
  email: string;
  name: string;
  interests: string;
}

/** Mailchimp (ya configurado) */
const MAILCHIMP_ACTION = 'https://app.us16.list-manage.com/subscribe/post';
const MAILCHIMP_U = 'aac2f72631ef7a81172f12475';
const MAILCHIMP_ID = '98573a8f1b';
const HONEYPOT_NAME = `b_${MAILCHIMP_U}_${MAILCHIMP_ID}`;

// UTM/referrer/landing ligera
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

const Newsletter = memo(({ variant = 'hero', onSuccess }: NewsletterProps) => {
  const [formData, setFormData] = useState<NewsletterFormData>({
    email: '',
    name: '',
    interests: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const utm = useMemo(() => getLightUTM(), []);
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const firstName = (formData.name || '').trim().split(' ')[0] || '';
  const lastName  = (formData.name || '').trim().split(' ').slice(1).join(' ') || '';

  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      trackFormSubmission('newsletter', { variant, ...utm });
      trackEvent('newsletter_submit', { variant, ...utm });
    } catch {}

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ email: '', name: '', interests: '' });
      onSuccess?.();
      setTimeout(() => { window.location.href = '/gracias.html?src=newsletter'; }, 350);
    }, 800);
  }, [variant, onSuccess, utm, isSubmitting]);

  const styles = (() => {
    switch (variant) {
      case 'hero':
        return {
          container: 'bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 max-w-lg mx-auto',
          title: 'text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2',
          subtitle: 'text-gray-600 mb-6 text-center',
          button: 'arc-pill w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105',
        };
      case 'footer':
        return {
          container: 'bg-gray-800 rounded-xl p-6',
          title: 'text-xl font-bold text-white mb-2 flex items-center justify-center gap-2',
          subtitle: 'text-gray-300 mb-4 text-center',
          button: 'arc-pill w-full bg-blue-600 text-white py-3 px-4 font-semibold hover:bg-blue-700 transition-colors',
        };
      case 'popup':
        return {
          container: 'bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-auto',
          title: 'text-2xl font-bold text-gray-900 mb-2 text-center flex items-center justify-center gap-2',
          subtitle: 'text-gray-600 mb-6 text-center',
          button: 'arc-pill w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 font-bold text-lg hover:shadow-2xl transition-all duration-300',
        };
      default:
        return {
          container: 'bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 max-w-lg mx-auto',
          title: 'text-2xl font-bold text-gray-900 mb-2',
          subtitle: 'text-gray-600 mb-6',
          button: 'arc-pill w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105',
        };
    }
  })();

  return (
    <div className={styles.container}>
      <div className="text-center mb-6">
        <h3 className={styles.title}>
          {variant === 'hero'   && (<><Sparkle size={22} weight="duotone" className="text-blue-600" /> Ideas prácticas en tu email</>)}
          {variant === 'footer' && (<><EnvelopeSimple size={20} weight="duotone" className="text-blue-300" /> Newsletter</>)}
          {variant === 'popup'  && (<><Sparkle size={22} weight="duotone" className="text-purple-600" /> Ideas prácticas en tu email</>)}
        </h3>
        <p className={styles.subtitle}>
          {variant === 'hero'   && 'Automatización, webs e integraciones para negocios, sin spam'}
          {variant === 'footer' && 'Contenido práctico, sin spam'}
          {variant === 'popup'  && 'Automatización, webs e integraciones para negocios, sin spam'}
        </p>
      </div>

      {/* Mailchimp nativo */}
      <form
        action={`${MAILCHIMP_ACTION}?u=${encodeURIComponent(MAILCHIMP_U)}&id=${encodeURIComponent(MAILCHIMP_ID)}`}
        method="post"
        noValidate
        target="_blank"
        onSubmit={handleSubmit}
        className="space-y-4"
        aria-label="Formulario de suscripción al newsletter"
      >
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            placeholder="Tu nombre"
            autoComplete="name"
            aria-label="Nombre"
          />
        </div>

        <div>
          <input
            type="email"
            name="EMAIL"  // Mailchimp espera EMAIL
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            placeholder="tu@email.com"
            autoComplete="email"
            aria-label="Email"
          />
        </div>

        <div>
          <select
            name="INTERESTS" // si no existe merge en MC, lo ignora
            value={formData.interests}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 [&>option]:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            aria-label="Intereses"
          >
            <option value="">¿Qué te interesa más?</option>
            <option value="ia-automatizacion">Automatización e IA</option>
            <option value="desarrollo-web">Desarrollo web</option>
            <option value="integraciones">Integraciones y sistemas</option>
            <option value="lead-generation">Captación y gestión de leads</option>
            <option value="todo">Todo lo anterior</option>
          </select>
        </div>

        {/* Merge fields + tags */}
        <input type="hidden" name="FNAME" value={firstName} />
        <input type="hidden" name="LNAME" value={lastName} />
        <input type="hidden" name="tags" value={`Newsletter, ${variant}, vertice-agency`} />

        {/* UTM / Referrer / Landing */}
        <input type="hidden" name="utm_source" value={(utm as any).utm_source || ''} />
        <input type="hidden" name="utm_medium" value={(utm as any).utm_medium || ''} />
        <input type="hidden" name="utm_campaign" value={(utm as any).utm_campaign || ''} />
        <input type="hidden" name="utm_term" value={(utm as any).utm_term || ''} />
        <input type="hidden" name="utm_content" value={(utm as any).utm_content || ''} />
        <input type="hidden" name="referrer" value={(utm as any).referrer || ''} />
        <input type="hidden" name="landing" value={(utm as any).landing || ''} />

        {/* Honeypot anti-bots */}
        <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
          <input type="text" name={HONEYPOT_NAME} tabIndex={-1} defaultValue="" />
        </div>

        {/* Estado accesible */}
        <div className="sr-only" aria-live="polite">
          {submitStatus === 'success' ? 'Suscripción realizada correctamente'
            : submitStatus === 'error' ? 'Error al suscribirse' : ''}
        </div>

        {submitStatus === 'success' && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-green-800 text-center">
            <div className="font-bold mb-1">¡Bienvenido a la comunidad!</div>
            <div className="text-sm text-green-700">Revisa tu email para confirmar tu suscripción.</div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-800 text-center">
            <div className="font-semibold text-sm">Error al suscribirse. Por favor, intenta nuevamente.</div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.button + ' disabled:opacity-50 disabled:cursor-not-allowed'}
          data-cta={`newsletter_submit_${variant}`}
          aria-label="Suscribirme al newsletter"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Suscribiendo...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Suscribirse Gratis <PaperPlaneRight size={18} weight="duotone" />
            </span>
          )}
        </button>
      </form>

      {variant === 'hero' && (
        <div className="mt-4 text-center text-xs text-gray-500 flex items-center justify-center gap-4">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck size={14} weight="duotone" className="text-green-600" /> Datos protegidos
          </span>
          <span className="inline-flex items-center gap-1">
            <Prohibit size={14} weight="duotone" className="text-red-600" /> Unsubscribe cuando quieras
          </span>
        </div>
      )}
    </div>
  );
});

Newsletter.displayName = 'Newsletter';
export default Newsletter;
