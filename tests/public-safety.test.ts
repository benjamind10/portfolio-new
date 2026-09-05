/**
 * Public-safety denylist (design D2). Nothing under `src/` or in
 * `index.html` may name an internal hostname, site code, database, employer
 * business unit, or colleague. The plaintext list is kept off-repo; this file
 * holds only SHA-256 hashes of lowercased tokens, so it never publishes the
 * names it guards against.
 *
 * Add a token:
 *   node -e "console.log(require('crypto').createHash('sha256').update(process.argv[1].toLowerCase()).digest('hex'))" -- '<token>'
 *
 * Tokens are compared three ways (all lowercased): single words `[a-z0-9]+`,
 * compound identifiers `[a-z0-9][a-z0-9._-]*[a-z0-9]` (hostnames, database
 * names, service names), and adjacent-word bigrams joined by one space
 * (full names). Hash the form you expect to match.
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(__dirname, '..');

export const DENY_TOKEN_HASHES: ReadonlySet<string> = new Set([
  // business-unit brands
  '45f91553737ff3040429d48ffcde0e5af208218ca7e5e9729b5c9f5050478763',
  '43163cef22e5d2d736b0a4d1d2f0ce10be1311a8d1094a982c69fb05eca2d68b',
  '835fb71167a13e2c234c3f13288e8570ef77196d3ad0046685823ae9ef875c25',
  '8ea0df6edc855cebe18713d0610a9acb7683ea8fda42e31976c6dc6de9012132',
  '5541f69c1fa89ae9d65cdfd4fffdc9f4a04c69efee6ab9516997fa68c61096a6',
  'fb288cd3bc92b3b7503f4f05ad77c02404e5da21abc869bba0850f9bdec355cc',
  '5b99a7e3d96a0697d8a224eebefc38734918e66dc4b16619538224ecfa6d2676',
  // colleague and manager names
  '540abb856918d8b8939e41104b2e9c0cadb970e4103cae10fc8100f2d6a5b445',
  'eae4612e028e512f5ef4da3a560b3b5ec4993db4d614c0ce0a267ed9a8321c15',
  '901be86d450c504e8555ffeeeab1e06b926c8785fd99ef382c1310b7c66bc167',
  '6c6e50419efb9c38c8dbbe7b3efbd0deb3cfad58ab6534bc574096861a0062eb',
  // site codes
  'e4694d00ec18a3085260dfb95751f24e8c5cdc734931966a8c55f066b0ee7375',
  '435b6874153bfdfeeed545867b39b1cb483dfffbc3733d12f7170142916dc6ec',
  // hostnames and domains
  'e2b505b65ccc43ff2958dda0b8876b3220836cdb018093dc6ba056d59a302293',
  '44a14de8d3189783933f3b66f58fdb70d2069606d158ac6d36fa5cafe9b972ee',
  'd8cd54404dc6328f1f81cbec0af2a5479eb5c298f3053c674d8c38f1055d781c',
  '65f99d7c2bbe8716adad850578e50afc368a08c52fcb03178186d4ea4015fddd',
  '4b3b260e8af2ba886f2b7ea93b41b8002315623bac50b8d6e6f763ffbc6b79e7',
  // database names
  'bc8f44d79c9b7082ac3e3bbb72d2f6cb24d7428112a2fb4634580bedef5dd4b6',
  '2866a228ea68cb65ff4eee76e0db70a1c84b252a8f34ae4ed862002e19da884a',
  'fd9ed7b3c31ee79055bea130c04895f6303876846f3694600dbd1b687961a95d',
  // MCP server connection names
  'a58a37f29ca4c34b31fc2282ac28be0c48ea8634fc60ea0793b14a99861052ea',
  'ccc499a983117ebfa91d55b8eec5c151c2c3d52eae06c220f2cee1923d6c3e80',
  '5201dce5c61805a0292da16ab9fa27ccb14bad31d4e7b085bff2d892026222c8',
  '68b32e4b93c24ebfd83bcca3e3e8371275861e08fbb4bdd31e4fdc9d256d8f20',
  'e51722d0083e211f620f15c2b6acc99c8dc845e379726b972b25dbc2968d25da',
  'bc461c30986180daa388e99f509b280e08bef5410ecdd0d3767f3764809c186f',
  // self-check decoy: sha256('denylist-selftest-token'); proves the hash path
  '6d072d54ffc6c61db413a91338ec4d247d46ec8bd4ba2070b586f113e56afc67',
]);

export const DENY_PATTERNS: readonly RegExp[] = [
  // internal hostname suffixes
  /\b[a-z0-9-]+\.(?:local|corp|internal|intranet|lan)\b/i,
  // IPv4 literals
  /\b(?:\d{1,3}\.){3}\d{1,3}\b/,
  // site-code shapes: three letters + two digits, or digit + two letters
  /\b[A-Z]{3}\d{2}\b/,
  /\b\d[A-Z]{2}\b/,
  // MES database-name shape: <site><yy>MES[_ENV]
  /\b[A-Z]{2,5}\d{2}MES(?:_[A-Z]{2,5})?\b/,
  // site-prefixed service host shape: <site>(uns|mes|sql)<n><nn>
  /\b[a-z]{2,3}(?:uns|mes|sql)[a-z]?\d{2}\b/i,
];

const SCAN_DIRS = ['src'];
const SCAN_FILES = ['index.html'];
const SCAN_EXT = /\.(?:ts|tsx|html)$/;

const sha256 = (s: string): string =>
  createHash('sha256').update(s).digest('hex');

const listFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return listFiles(path);
    return SCAN_EXT.test(name) ? [path] : [];
  });

export const scanTargets = (): string[] => [
  ...SCAN_DIRS.flatMap(d => listFiles(join(ROOT, d))),
  ...SCAN_FILES.map(f => join(ROOT, f)),
];

export interface Finding {
  file: string;
  line: number;
  reason: string;
}

const tokenCandidates = (line: string): string[] => {
  const lower = line.toLowerCase();
  const words = lower.match(/[a-z0-9]+/g) ?? [];
  const compounds = lower.match(/[a-z0-9][a-z0-9._-]*[a-z0-9]/g) ?? [];
  const bigrams = words.slice(1).map((w, i) => `${words[i]} ${w}`);
  return [...words, ...compounds, ...bigrams];
};

export const scanText = (text: string, file: string): Finding[] => {
  const findings: Finding[] = [];
  text.split(/\r?\n/).forEach((line, i) => {
    for (const candidate of tokenCandidates(line)) {
      if (DENY_TOKEN_HASHES.has(sha256(candidate))) {
        findings.push({
          file,
          line: i + 1,
          reason: `denylisted token (sha256 ${sha256(candidate).slice(0, 12)}…)`,
        });
      }
    }
    for (const pattern of DENY_PATTERNS) {
      const m = pattern.exec(line);
      if (m) {
        findings.push({
          file,
          line: i + 1,
          reason: `matches ${pattern} ("${m[0]}")`,
        });
      }
    }
  });
  return findings;
};

describe('public safety', () => {
  it('scans the source tree and the HTML shell', () => {
    const targets = scanTargets().map(p => relative(ROOT, p));
    expect(targets).toContain('index.html');
    expect(targets.some(p => /^src[\\/]content[\\/]/.test(p))).toBe(true);
    expect(targets.some(p => /^src[\\/]components[\\/]/.test(p))).toBe(true);
  });

  it('finds no denylisted token or shape in src/**/*.{ts,tsx} or index.html', () => {
    const findings = scanTargets().flatMap(path =>
      scanText(readFileSync(path, 'utf8'), relative(ROOT, path))
    );
    const report = findings
      .map(f => `${f.file}:${f.line} ${f.reason}`)
      .join('\n');
    expect(findings, report).toEqual([]);
  });

  it('self-check: catches a known-bad fixture through both paths', () => {
    const fixture = [
      'const host = "gateway.corp";',
      'const ip = "10.20.30.40";',
      'const svc = "denylist-selftest-token";',
      'const code = "ABC12";',
    ].join('\n');

    const findings = scanText(fixture, 'fixture.ts');
    const lines = findings.map(f => f.line);

    expect(lines).toContain(1);
    expect(lines).toContain(2);
    expect(lines).toContain(3);
    expect(lines).toContain(4);
    expect(
      findings.some(f => f.line === 3 && f.reason.startsWith('denylisted'))
    ).toBe(true);
  });

  it('self-check: a clean fixture produces no findings', () => {
    const fixture = 'Enterprise/Plant-A/Extrusion/Line1/Extruder/state';
    expect(scanText(fixture, 'fixture.ts')).toEqual([]);
  });
});
