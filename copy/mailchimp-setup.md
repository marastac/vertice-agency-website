# Mailchimp Setup — Vértice Agency

## 1. Lista y Campos

- Crear una **Audience** única llamada `Vértice Agency Newsletter`.
- Merge fields requeridos:
  - `EMAIL` (email principal, obligatorio)
  - `FNAME` (nombre)
  - `LNAME` (apellido, opcional)
  - `INTERESTS` (campo de selección: IA, Marketing, Leads, Conversiones, Chatbots, Todo)
- Tags iniciales:
  - `Newsletter`
  - `vertice-agency`
  - `welcome-sequence`

## 2. Formularios

- Integración nativa vía `<form>` en el sitio (Mailchimp action + u + id).
- Todos los forms abren en `_blank` y luego redirigen a `/gracias.html?src=newsletter`.
- Honeypot activado (`b_U+ID`).
- Campos ocultos:
  - Tags (`Newsletter, variant, vertice-agency`)
  - UTM/referrer/landing (se ignoran si no están en la lista, pero no rompen).

## 3. Automation

- **Workflow: Welcome Series**
  1. Trigger: Nueva suscripción con tag `Newsletter`.
  2. Email 1 (Inmediato): Bienvenida.
  3. Email 2 (+2–3 días): Valor.
  4. Email 3 (+5–7 días): Caso práctico.
- Objetivo: mover a CTA `Auditoría Gratuita`.

## 4. Tracking

- Activar **Google Analytics link tracking**.
- Activar **Facebook Pixel tracking** desde integraciones de Mailchimp.
- Revisar en GA4 → Realtime los eventos:
  - `generate_lead`
  - `form_submit`
  - `newsletter_subscribe`

## 5. QA Checklist

- [ ] Email 1 se envía al suscribirse.
- [ ] Merge fields funcionan (`Hola {{FNAME}}`).
- [ ] Links redirigen a `/gracias.html?src=newsletter`.
- [ ] Pixel y GA4 capturan evento `subscribe`.
- [ ] Botón de `Unsubscribe` visible en footer.
