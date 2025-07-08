import { useState, memo, useCallback } from 'react';

interface NewsletterFormData {
  email: string;
  name: string;
  interests: string;
}

interface NewsletterProps {
  variant?: 'hero' | 'footer' | 'popup';
  onSuccess?: () => void;
}

const Newsletter = memo(({ variant = 'hero', onSuccess }: NewsletterProps) => {
  const [formData, setFormData] = useState<NewsletterFormData>({
    email: '',
    name: '',
    interests: ''
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
      // 🎯 Doble envío: Mailchimp + Formspree para backup
      
      // 1. Envío a Mailchimp (sustituir con tu API key y list ID)
      const mailchimpData = {
        email_address: formData.email,
        status: "subscribed",
        merge_fields: {
          FNAME: formData.name.split(' ')[0] || '',
          LNAME: formData.name.split(' ').slice(1).join(' ') || '',
          INTERESTS: formData.interests
        },
        tags: [`newsletter-${variant}`, 'lead-magnet', 'vertice-agency']
      };

      // 2. Backup con Formspree (usando tu ID existente)
      const formspreeResponse = await fetch('https://formspree.io/f/mdkzjjez', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'newsletter_signup',
          email: formData.email,
          name: formData.name,
          interests: formData.interests,
          source: `Newsletter ${variant}`,
          timestamp: new Date().toISOString(),
          page_url: window.location.href
        }),
      });

      if (formspreeResponse.ok) {
        setSubmitStatus('success');
        setFormData({ email: '', name: '', interests: '' });
        
        // 📊 Analytics tracking
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'newsletter_signup', {
            method: variant,
            content_group1: 'Newsletter',
            value: 50
          });
        }

        // 📱 Facebook Pixel tracking
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Subscribe', {
            content_name: 'Newsletter Signup',
            content_category: 'Lead Generation',
            value: 50,
            currency: 'USD'
          });
        }

        onSuccess?.();
      } else {
        throw new Error('Error en el envío');
      }
    } catch (error) {
      console.error('Error al suscribirse:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, variant, onSuccess]);

  // 🎨 Estilos por variante
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
          button: 'w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300'
        };
      default:
        return getVariantStyles();
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            placeholder="Tu nombre"
          />
        </div>
        
        <div>
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
          <select
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
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
        
        {submitStatus === 'success' && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-green-800 text-center">
            <div className="text-2xl mb-2">🎉</div>
            <div className="font-bold mb-1">¡Bienvenido a la comunidad!</div>
            <div className="text-sm text-green-700">
              Revisa tu email para confirmar tu suscripción.
            </div>
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-800 text-center">
            <div className="text-xl mb-1">❌</div>
            <div className="font-semibold text-sm">
              Error al suscribirse. Por favor, intenta nuevamente.
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.button + " disabled:opacity-50 disabled:cursor-not-allowed"}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Suscribiendo...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Suscribirse Gratis
              <span className="text-lg">→</span>
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