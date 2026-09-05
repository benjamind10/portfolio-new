import { describe, expect, it } from 'vitest';
import {
  AGENTIC_LAYER,
  ARCHITECTURE_COPY,
  TIERS,
} from '../../src/content/architecture';

const TIER_IDS = new Set(TIERS.map(t => t.id));

describe('TIERS', () => {
  it('has exactly seven tiers with unique ids', () => {
    expect(TIERS).toHaveLength(7);
    expect(TIER_IDS.size).toBe(7);
  });

  it('indexes them 1..7, unique and ascending', () => {
    expect(TIERS.map(t => t.index)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('gives every tier a name, purpose, whySeparate, and decision', () => {
    for (const tier of TIERS) {
      for (const field of [
        'name',
        'purpose',
        'whySeparate',
        'decision',
      ] as const) {
        expect(tier[field].trim(), `${tier.id}.${field}`).not.toBe('');
      }
      expect(tier.technologies.length, `${tier.id}.technologies`).toBeGreaterThan(
        0
      );
    }
  });

  it('carries the schema rule on the broker tier', () => {
    const broker = TIERS.find(t => t.id === 'broker');
    expect(broker?.schemaRule?.trim()).toBeTruthy();
  });

  it('keeps tier names distinct so the diagram buttons are unambiguous', () => {
    const names = TIERS.map(t => t.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe('AGENTIC_LAYER', () => {
  it('has the three components from design D4', () => {
    expect(AGENTIC_LAYER.map(c => c.id).sort()).toEqual([
      'dag',
      'mcp',
      'semantic',
    ]);
  });

  it('reads only from tiers that exist, all within tiers 4–7', () => {
    const byId = new Map(TIERS.map(t => [t.id, t]));
    for (const component of AGENTIC_LAYER) {
      expect(component.readsFrom.length, component.id).toBeGreaterThan(0);
      for (const id of component.readsFrom) {
        expect(TIER_IDS.has(id), `${component.id} reads ${id}`).toBe(true);
        expect(byId.get(id)?.index, `${component.id} reads ${id}`).toBeGreaterThanOrEqual(4);
      }
    }
  });

  it('gives every component a name and purpose', () => {
    for (const component of AGENTIC_LAYER) {
      expect(component.name.trim()).not.toBe('');
      expect(component.purpose.trim()).not.toBe('');
    }
  });
});

describe('ARCHITECTURE_COPY', () => {
  it('names the section and the agentic layer', () => {
    expect(ARCHITECTURE_COPY.title.trim()).not.toBe('');
    expect(ARCHITECTURE_COPY.subtitle.trim()).not.toBe('');
    expect(ARCHITECTURE_COPY.agentic.name.trim()).not.toBe('');
    expect(ARCHITECTURE_COPY.agentic.summary.trim()).not.toBe('');
  });
});
