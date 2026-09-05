import { describe, expect, it } from 'vitest';
import {
  getLeaves,
  hasPayload,
  MQTT_TOPICS,
  UNS_ROOT,
  type UnsNode,
} from '../../src/content/uns';

const walk = (
  node: UnsNode,
  visit: (node: UnsNode, parent: UnsNode | null) => void,
  parent: UnsNode | null = null
): void => {
  visit(node, parent);
  node.children?.forEach(child => walk(child, visit, node));
};

describe('UNS_ROOT', () => {
  it('is rooted at Enterprise with a non-place first child', () => {
    expect(UNS_ROOT.name).toBe('Enterprise');
    expect(UNS_ROOT.fullPath).toBe('Enterprise');
    expect(UNS_ROOT.children?.[0]?.name).toMatch(/^Plant-[A-Z]$/);
  });

  it("gives every node a fullPath equal to its parent's path plus /name", () => {
    walk(UNS_ROOT, (node, parent) => {
      const expected = parent ? `${parent.fullPath}/${node.name}` : node.name;
      expect(node.fullPath).toBe(expected);
    });
  });

  it('gives every leaf a payload with four values in [0, 1]', () => {
    const leaves = getLeaves(UNS_ROOT);
    expect(leaves.length).toBeGreaterThan(0);

    for (const leaf of leaves) {
      expect(hasPayload(leaf), `${leaf.fullPath} has a payload`).toBe(true);
      if (!hasPayload(leaf)) continue;

      const values = [
        leaf.payload.oee,
        leaf.payload.availability,
        leaf.payload.performance,
        leaf.payload.quality,
      ];
      expect(values).toHaveLength(4);
      for (const v of values) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    }
  });

  it('keeps payloads off intermediate nodes', () => {
    walk(UNS_ROOT, node => {
      if (node.children) expect(node.payload).toBeUndefined();
    });
  });
});

describe('MQTT_TOPICS', () => {
  it('has one topic per leaf, each rooted at that leaf', () => {
    const leaves = getLeaves(UNS_ROOT);
    expect(MQTT_TOPICS.length).toBe(leaves.length);
    leaves.forEach((leaf, i) => {
      expect(MQTT_TOPICS[i].startsWith(`${leaf.fullPath}/`)).toBe(true);
    });
  });
});
