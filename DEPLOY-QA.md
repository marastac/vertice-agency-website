# ✅ QA Post-Deploy — Vértice Agency

Checklist rápido para validar que todo funciona correctamente después de cada publicación en **Vercel**.

---

## 1. Funcionalidad de formularios

- [ ] **Formulario Contacto** (`#contact` → Formspree):
  - Envía datos correctamente.
  - Redirige a `/gracias.html?src=contact`.
- [ ] **Newsletter** (Mailchimp en hero, footer y popup):
  - Abre en nueva pestaña.
  - Redirige a `/gracias.html?src=newsletter`.
  - Aplica tags (`Newsletter`, `vertice-agency`, `welcome-sequence`).
- [ ] **Lead Magnets**:
  - Modal abre y se envía.
  - Descarga inicia correctamente.
  - Redirige a `/gracias.html?src=leadmagnet&name=...`.

---

## 2. Tracking / Analytics

- [ ] **Google Analytics 4 (Realtime)**:
  - Eventos: `form_submit`, `generate_lead`, `view_item`, `download`, `whatsapp_click`, `newsletter_modal_open`.
- [ ] **Meta Pixel Helper**:
  - Eventos: `PageView`, `Lead`, `CompleteRegistration`, `Subscribe`.
- [ ] **LinkedIn Insight (si aplica)**:
  - Evento de `Lead`.

---

## 3. Navegación y enlaces

- [ ] Todos los botones de CTA (`Auditoría Gratuita`, `Ver Recursos`, `Tips de IA Gratis`) hacen scroll correcto o abren modal.
- [ ] Links de WhatsApp y Email abren en apps externas.
- [ ] Menú móvil abre y cierra con **Esc**.

---

## 4. Responsividad

- [ ] Hero, CTAs y formularios legibles en **375px** (iPhone SE/12 Mini).
- [ ] Grid de logos y testimonios no se rompe en tablets.
- [ ] Newsletter footer no se desborda en pantallas pequeñas.

---

## 5. Accesibilidad

- [ ] Labels asociados correctamente a inputs.
- [ ] Modal newsletter y modal lead magnet enfocan correctamente al abrir.
- [ ] Se puede navegar con `Tab` y cerrar con `Esc`.

---

## 6. Archivos públicos

- [ ] `/sitemap.xml` accesible y actualizado.
- [ ] `/robots.txt` válido y sin bloqueos erróneos.
- [ ] `/gracias.html` personaliza mensajes según `?src=`.
- [ ] `/404.html` muestra correctamente en rutas inexistentes.

---

## 7. Performance (opcional)

- [ ] Lighthouse score **90+** en Performance y SEO.
- [ ] Imágenes optimizadas y sin cargas lentas.
- [ ] No hay errores en consola del navegador.

---

### 🚀 Resultado esperado

Si todo lo anterior pasa, la web está **lista para campañas activas** (Google Ads, Meta Ads, Email Marketing).
