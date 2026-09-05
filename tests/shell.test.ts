/**
 * The HTML shell (design D9). `index.html` is outside the React tree, so its
 * social and search metadata is checked here against the same `PROFILE`
 * strings the Hero renders: the tags cannot drift from the page copy without
 * this test failing. `og:url`, a canonical tag, and `og:image` are deliberately
 * absent until the hosting target is named (structure Open Question 1).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { PROFILE } from '../src/content/profile';

const ROOT = join(__dirname, '..');
const OG_TITLE = `${PROFILE.name} — ${PROFILE.headline}`;

let head: HTMLHeadElement;

const content = (selector: string): string | null =>
  head.querySelector<HTMLMetaElement>(selector)?.getAttribute('content') ??
  null;

beforeAll(() => {
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  head = new DOMParser().parseFromString(html, 'text/html').head;
});

describe('index.html shell', () => {
  it('declares the language and a viewport', () => {
    expect(head.ownerDocument.documentElement.getAttribute('lang')).toBe('en');
    expect(content('meta[name="viewport"]')).toContain('width=device-width');
  });

  it('serves the PNG favicon with a matching type', () => {
    const icon = head.querySelector<HTMLLinkElement>('link[rel="icon"]');
    expect(icon).not.toBeNull();
    expect(icon?.getAttribute('type')).toBe('image/png');
    expect(icon?.getAttribute('href')).toMatch(/\.png$/);
  });

  it('carries a meta description equal to PROFILE.pitch', () => {
    expect(content('meta[name="description"]')).toBe(PROFILE.pitch);
  });

  it('carries Open Graph tags that mirror PROFILE', () => {
    expect(content('meta[property="og:type"]')).toBe('website');
    expect(content('meta[property="og:title"]')).toBe(OG_TITLE);
    expect(content('meta[property="og:description"]')).toBe(PROFILE.pitch);
  });

  it('carries Twitter card tags that mirror PROFILE', () => {
    expect(content('meta[name="twitter:card"]')).toBe('summary');
    expect(content('meta[name="twitter:title"]')).toBe(OG_TITLE);
    expect(content('meta[name="twitter:description"]')).toBe(PROFILE.pitch);
  });

  it('loads both typefaces from Google Fonts', () => {
    const fonts = head.querySelector<HTMLLinkElement>(
      'link[href*="fonts.googleapis.com/css2"]'
    );
    expect(fonts?.getAttribute('href')).toContain('family=Inter');
    expect(fonts?.getAttribute('href')).toContain('family=JetBrains+Mono');
  });
});
