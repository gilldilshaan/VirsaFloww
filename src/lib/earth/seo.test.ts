import { describe, expect, it } from 'vitest';
import { pageHead } from './content';

describe('public page SEO metadata', () => {
  it('uses absolute production canonicals and share metadata', () => {
    const head = pageHead('Agricultural MRV', 'MRV description.', '/agricultural-mrv');

    expect(head.links[0]?.href).toBe('https://www.thecarboncredit.in/agricultural-mrv');
    expect(head.meta).toContainEqual({ property: 'og:url', content: 'https://www.thecarboncredit.in/agricultural-mrv' });
    expect(head.meta).toContainEqual({ name: 'twitter:card', content: 'summary_large_image' });
    expect(head.scripts?.some((script) => script.children.includes('BreadcrumbList'))).toBe(true);
  });

  it('marks account pages noindex and omits their structured data', () => {
    const head = pageHead('Sign In', 'Account sign in.', '/auth', { indexable: false });

    expect(head.meta).toContainEqual({ name: 'robots', content: 'noindex, nofollow' });
    expect(head.scripts).toBeUndefined();
  });
});
