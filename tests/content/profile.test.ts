import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PROFILE } from '../../src/content/profile';

const ROOT = join(__dirname, '..', '..');

describe('PROFILE', () => {
  it('carries exactly four operating principles, each with evidence', () => {
    expect(PROFILE.principles).toHaveLength(4);
    for (const principle of PROFILE.principles) {
      expect(principle.title.trim()).not.toBe('');
      expect(principle.evidence.trim()).not.toBe('');
    }
  });

  it('has at least one bio paragraph and one skill', () => {
    expect(PROFILE.bio.length).toBeGreaterThanOrEqual(1);
    expect(PROFILE.skills.length).toBeGreaterThanOrEqual(1);
  });

  it('only advertises a resume when public/resume.pdf exists (D8)', () => {
    if (PROFILE.resume === undefined) return;
    expect(PROFILE.resume.href).toBe('/resume.pdf');
    expect(PROFILE.resume.label.trim()).not.toBe('');
    expect(
      existsSync(join(ROOT, 'public', 'resume.pdf')),
      'PROFILE.resume is set but public/resume.pdf is missing'
    ).toBe(true);
  });
});
