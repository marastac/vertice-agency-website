// src/utils/utm.ts
export type UTMParams = Partial<{
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  ref: string;
}>;

export const getUTMParams = (): UTMParams => {
  if (typeof window === 'undefined') return {};
  const qs = new URLSearchParams(window.location.search);
  const out: UTMParams = {};
  ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','ref'].forEach((k) => {
    const v = qs.get(k);
    if (v) (out as any)[k] = v;
  });
  return out;
};

export const buildUTMQuery = (extra: Record<string,string> = {}) => {
  const params = new URLSearchParams();
  const utm = getUTMParams();
  Object.entries(utm).forEach(([k, v]) => v && params.append(k, String(v)));
  Object.entries(extra).forEach(([k, v]) => v && params.set(k, String(v)));
  const s = params.toString();
  return s ? `?${s}` : '';
};

// ✅ Compatibilidad con imports antiguos:
export const getUTM = getUTMParams;
