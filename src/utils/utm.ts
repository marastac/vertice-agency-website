// src/utils/utm.ts
type UTM = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  landing?: string;
};

const KEY = 'va_utm';

const readSearchParams = (): UTM => {
  if (typeof window === 'undefined') return {};
  const qs = new URLSearchParams(window.location.search);
  const data: UTM = {
    utm_source: qs.get('utm_source') || undefined,
    utm_medium: qs.get('utm_medium') || undefined,
    utm_campaign: qs.get('utm_campaign') || undefined,
    utm_term: qs.get('utm_term') || undefined,
    utm_content: qs.get('utm_content') || undefined,
  };
  return data;
};

const capture = (): UTM => {
  if (typeof window === 'undefined') return {};
  const stored = sessionStorage.getItem(KEY);
  if (stored) return JSON.parse(stored);

  const base = readSearchParams();
  const data: UTM = {
    ...base,
    referrer: document.referrer || undefined,
    landing: window.location.href,
  };

  sessionStorage.setItem(KEY, JSON.stringify(data));
  return data;
};

export const getUTM = (): UTM => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return capture();
};
