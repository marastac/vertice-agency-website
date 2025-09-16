// src/components/Newsletter.tsx
import { memo, useCallback, useMemo, useState } from 'react';
import { trackEvent, trackFormSubmission } from '../utils/analytics';

type NewsletterProps = {
  variant?: 'hero' | 'footer' | 'popup';
  onSuccess?: () => void;
};

interface NewsletterFormData {
  email: string;
  name: string;
  interests: string;
}

/** Mailchimp (ya rellenado) */
const MAILCHIMP_ACTION = 'https://app.us16.list-manage.com/subscribe/post';
const MAILCHIMP_U = 'aac2f72631ef7a81172f12475';
const MAILCHIMP_ID = '98573a8f1b';
const HONEYPOT_NAME = `b_${MAILCHIMP_U}_${MAILCHIMP_ID}`;

// UTM/referrer/landing ligera (sin dependencia externa)
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

const Newsletter = memo(({ variant = 'hero', onSuccess }: NewsletterProps) => {
  const [formData, setFormData] = useState<NewsletterFormData>({
    email: '',
    name: '',
    interests: ''
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
    // No prevenimos el submit porque MC se envía en _blank.
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Tracking unificado (GA4 + Pixel) usando helpers
    try {
      trackFormSubmission('newsletter', { variant, ...utm });
      trackEvent('newsletter_submit', { variant, ...utm });
    } catch {}

    // Como el form abre MC en _blank, aquí redirigimos esta pestaña
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ email: '', name: '', interests: '' });
      onSuccess?.();
      setTimeout(() => { window.location.href = '/gracias.html?src=newsletter'; }, 350);
    }, 800);
  }, [variant, onSuccess, utm, isSubmitting]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'hero':
        return {
          container: 'bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 max-w-lg mx-auto',
          title: 'text-2xl font-bold text-gray-900 mb-4',
          subtitle: 'text-gray-600 mb-6',
          button: 'w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
        };
      case 'footer':
        return {
          container: 'bg-gray-800 rounded-xl p-6',
          title: 'text-xl font-bold text-white mb-3',
          subtitle: 'text-gray-300 mb-4',
          button: 'w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
        };
      case 'popup':
        return {
          container: 'bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-auto',
          title: 'text-2xl font-bold text-gray-900 mb-4 text-center',
          subtitle: 'text-gray-600 mb-6 text-center',
          button: 'w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300'
        };
      default:
        return {
          container: 'bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 max-w-lg mx-auto',
          title: 'text-2xl font-bold text-gray-900 mb-4',
          subtitle: 'text-gray-600 mb-6',
          button: 'w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={styles.container}>
      <div className="text-center mb-6">
        <h3 className={styles.title}>
          {variant === 'hero' && '🚀 Recibe Tips Exclusivos de IA'}
          {variant === 'footer' && '📧 Newsletter Semanal'}
          {variant === 'popup' && '✨ ¡No te pierdas nada!'}
        </h3>
        <p className={styles.subtitle}>
          {variant === 'hero' && 'Estrategias semanales de marketing digital e IA directo a tu email'}
          {variant === 'footer' && 'Mantente al día con las últimas tendencias'}
          {variant === 'popup' && 'Únete a +1,000 emprendedores que reciben contenido exclusivo'}
        </p>
      </div>

      {/* Mailchimp nativo (evita CORS). Abre en pestaña nueva; nosotros redirigimos a /gracias.html */}
      <form
        action={`${MAILCHIMP_ACTION}?u=${encodeURIComponent(MAILCHIMP_U)}&id=${encodeURIComponent(MAILCHIMP_ID)}`}
        method="post"
        noValidate
        target="_blank"
        onSubmit={handleSubmit}
        className="space-y-4"
        aria-label="Formulario de suscripción al newsletter"
      >
        {/* Campos visibles */}
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
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
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
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
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            aria-label="Intereses"
          >
            <option value="">¿Qué te interesa más?</option>
            <option value="ia-automatizacion">IA y Automatización</option>
            <option value="marketing-digital">Marketing Digital</option>
            <option value="lead-generation">Generación de Leads</option>
            <option value="conversion-optimization">Optimización de Conversiones</option>
            <option value="chatbots">Chatbots y Atención al Cliente</option>
            <option value="todo">Todo lo anterior</option>
          </select>
        </div>

        {/* Merge fields + tags */}
        <input type="hidden" name="FNAME" value={firstName} />
        <input type="hidden" name="LNAME" value={lastName} />
        <input type="hidden" name="tags" value={`Newsletter, ${variant}, vertice-agency`} />

        {/* UTM / Referrer / Landing (MC los ignora si no existen en la lista) */}
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
          {submitStatus === 'success' ? 'Suscripción realizada correctamente' :
           submitStatus === 'error'   ? 'Error al suscribirse' : ''}
        </div>

        {submitStatus === 'success' && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-green-800 text-center">
            <div className="text-2xl mb-2">🎉</div>
            <div className="font-bold mb-1">¡Bienvenido a la comunidad!</div>
            <div className="text-sm text-green-700">Revisa tu email para confirmar tu suscripción.</div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-800 text-center">
            <div className="text-xl mb-1">❌</div>
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
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Suscribiendo...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Suscribirse Gratis <span className="text-lg">→</span>
            </span>
          )}
        </button>
      </form>

      {variant === 'hero' && (
        <div className="mt-4 text-center text-xs text-gray-500">
          📧 Sin spam • ❌ Unsubscribe cuando quieras • 🔒 Datos protegidos
        </div>
      )}
    </div>
  );
});

Newsletter.displayName = 'Newsletter';
export default Newsletter;
