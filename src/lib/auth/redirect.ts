/**
 * Safe Local Redirect Sanitizer
 * 
 * Prevents Open Redirect Vulnerabilities (CWE-601):
 * - Guarantees destination is a relative path on the same origin.
 * - Rejects protocol-relative URLs (e.g., //evil.com).
 * - Rejects Windows path trickery (e.g., /\evil.com).
 * - Rejects explicit URL schemes (e.g., https://, javascript:, data:).
 */

export function isValidLocalRedirect(raw: unknown): boolean {
  if (typeof raw !== 'string') return false;
  const trimmed = raw.trim();
  if (!trimmed) return false;

  try {
    const decoded = decodeURIComponent(trimmed);
    // Must start with a single slash
    if (!decoded.startsWith('/')) return false;
    // Disallow protocol-relative //
    if (decoded.startsWith('//')) return false;
    // Disallow backslash trickery /\
    if (decoded.startsWith('/\\')) return false;
    // Disallow absolute schemes anywhere in path
    if (decoded.includes('://')) return false;
    // Disallow inline script schemes
    const lower = decoded.toLowerCase();
    if (lower.startsWith('/javascript:') || lower.startsWith('/data:') || lower.startsWith('/vbscript:')) {
      return false;
    }
    return true;
  } catch {
    // Decoding error -> reject
    return false;
  }
}

export function sanitizeRedirectPath(raw: unknown, fallback: string = '/'): string {
  if (isValidLocalRedirect(raw)) {
    try {
      return decodeURIComponent((raw as string).trim());
    } catch {
      return (raw as string).trim();
    }
  }
  return fallback;
}
