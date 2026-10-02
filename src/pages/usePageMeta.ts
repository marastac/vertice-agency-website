// src/pages/usePageMeta.ts — Título y robots por página (la web no usa router).
import { useEffect } from 'react';

export function usePageMeta(title: string, robots?: string) {
  useEffect(() => {
    document.title = title;
    if (!robots) return;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = robots;
  }, [title, robots]);
}
