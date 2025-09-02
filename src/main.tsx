// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { initWebVitals } from './utils/webvitals';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Core Web Vitals -> GA4/Pixel (seguro, no bloquea render)
if ('requestIdleCallback' in window) {
  (window as any).requestIdleCallback(() => initWebVitals());
} else {
  setTimeout(() => initWebVitals(), 1);
}
