# 📈 Vértice Agency — Growth & Marketing Setup

Este documento describe el setup técnico + marketing de la web de **Vértice Agency**, con foco en **tracking, SEO y conversiones**.

---

## 🚀 Stack Técnico

- **Framework:** Vite + React + TypeScript + TailwindCSS
- **Hosting:** Vercel
- **Optimización:**
  - Componentes memoizados y `useCallback`
  - Sin lazy-loading (rompe CSS en este stack)
  - Analytics diferidos (`analytics.ts`)
  - Web Vitals → GA4
  - UTM parser en `utils/utm.ts`

---

## 📊 Trackers Activos

- **Google Analytics 4 (GA4):** `G-YN77ENMF5B`
- **Meta Pixel:** `1419230625849117`
- **LinkedIn Insight Tag:** pendiente agregar (placeholder en `Contact.tsx`).

### Eventos enviados

- `form_submit` → Contact
- `download` → Lead Magnet
- `generate_lead` → Newsletter
- `whatsapp_click`
- `email_click`
- `thank_you_view`
- `web_vital`

---

## 📝 Formularios

- **Contact:** Formspree (`mdkzjjez`), redirige a `/gracias.html?src=contact`
- **Newsletter:** Mailchimp (U, ID ya configurados), variantes: `hero`, `footer`, `popup`
- **Lead Magnets:** Formspree + descarga + tracking GA4/Pixel, redirige a `/gracias.html?src=leadmagnet&name=...`

---

## 📂 Archivos clave

- `src/components/Hero.tsx` → Hero con CTAs + newsletter popup
- `src/components/ClientLogos.tsx` → Logos + testimonios + métricas
- `src/components/Footer.tsx` → Newsletter footer + links + contacto
- `src/components/LeadMagnetSection.tsx` → Recursos gratuitos con modal
- `src/components/Contact.tsx` → Formulario principal + WhatsApp/Email
- `src/components/Header.tsx` → Navegación sticky + CTA
- `src/components/Newsletter.tsx` → Form Mailchimp (3 variantes)

### Public

- `public/gracias.html` → Página dinámica de agradecimiento (según src)
- `public/404.html` → Página simple de error
- `public/robots.txt` → Permite todo + sitemap
- `public/sitemap.xml` → URLs principales

### Configuración

- `vercel.json` → rewrites, headers de seguridad (CSP pendiente)
- `package.json` → scripts (`dev`, `build`, `preview`, `lint`, `format`)

---

## 🔎 SEO & Metadatos

- `index.html` en raíz → incluye:
  - Open Graph (OG) básico
  - Twitter Card
  - JSON-LD (Organization + Website)

> ⚠️ Recordar actualizar `og:url` y `sitemap.xml` con el dominio final **verticeagency.com**.

---

## ✅ Checklist post-deploy

1. **GA4 Realtime**: verificar eventos `form_submit`, `download`, `generate_lead`, `whatsapp_click`.
2. **Pixel Helper**: confirmar eventos en Facebook.
3. **Responsive test**: 375px (móvil) → CTAs visibles, nada roto.
4. **Accesibilidad**: tab + ESC en modales funciona.
5. **SEO**: validar `/robots.txt` y `/sitemap.xml` en Google Search Console.
6. **Gracias.html**: probar con `?src=contact`, `?src=newsletter`, `?src=leadmagnet&name=Guía+IA`.

---

## 🚫 No tocar

- `vite.config.ts` (mantener básico)
- Lazy-loading de componentes (rompe CSS)

---

## 📬 Autoresponder Mailchimp

Archivo: `copy/email-sequence-mailchimp.md`

- Email 1 → Bienvenida + recurso gratis
- Email 2 → Valor educativo (tips IA)
- Email 3 → Caso práctico + CTA a auditoría

---

Made with ❤️ por el equipo de **Vértice Agency**.
