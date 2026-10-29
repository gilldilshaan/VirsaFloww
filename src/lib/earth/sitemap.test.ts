import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

describe('generated public sitemap', () => {
  it('matches the current public route files and robots sitemap directive', () => {
    const result = execFileSync(process.execPath, ['scripts/generate-sitemap.mjs', '--check'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });

    expect(result).toMatch(/Sitemap check passed: \d+ indexable public routes\./);
  });
});
