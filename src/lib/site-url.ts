export const PRODUCTION_SITE_URL = 'https://www.thecarboncredit.in';

/** Origin used in links sent by email (sign-up confirmation, password reset, invitations).
 *  Always the canonical production site, so a link created from a preview never points to it.
 *  Local development (localhost) keeps its own origin so flows can be tested. */
export function siteUrl(env: string | undefined = import.meta.env['VITE_SITE_URL'], currentOrigin?: string): string {
  const origin = currentOrigin ?? (typeof window !== 'undefined' ? window.location.origin : '');
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return origin;
  const base = (env && /^https:\/\//.test(env) ? env : PRODUCTION_SITE_URL).replace(/\/+$/, '');
  return base;
}

export const authLink = (path: string) => `${siteUrl()}${path.startsWith('/') ? path : `/${path}`}`;
