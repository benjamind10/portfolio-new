/**
 * Fictional but ISA-95-shaped Unified Namespace used by the Hero cards and
 * the Architecture section's explorer. Enterprise → Site → Area → Line →
 * Work cell; every leaf carries an OEE payload. Nothing here names a real
 * place, plant, or machine.
 */
export interface UnsPayload {
  /** Overall equipment effectiveness, 0–1. */
  oee: number;
  availability: number;
  performance: number;
  quality: number;
}

export interface UnsNode {
  name: string;
  /** Slash-joined path from the root, e.g. `Enterprise/Plant-A/Extrusion`. */
  fullPath: string;
  payload?: UnsPayload;
  children?: readonly UnsNode[];
}

/** A node that carries a payload; `getLeaves` + `hasPayload` narrow to it. */
export type UnsLeaf = UnsNode & { payload: UnsPayload };

interface UnsSpec {
  name: string;
  payload?: UnsPayload;
  children?: readonly UnsSpec[];
}

const payload = (
  availability: number,
  performance: number,
  quality: number
): UnsPayload => ({
  oee: Number((availability * performance * quality).toFixed(4)),
  availability,
  performance,
  quality,
});

const cell = (name: string, p: UnsPayload): UnsSpec => ({ name, payload: p });

const SPEC: UnsSpec = {
  name: 'Enterprise',
  children: [
    {
      name: 'Plant-A',
      children: [
        {
          name: 'Extrusion',
          children: [
            {
              name: 'Line1',
              children: [
                cell('Extruder', payload(0.92, 0.95, 0.98)),
                cell('Puller', payload(0.88, 0.94, 0.96)),
              ],
            },
            {
              name: 'Line2',
              children: [
                cell('Extruder', payload(0.95, 0.97, 0.99)),
                cell('Puller', payload(0.91, 0.95, 0.95)),
              ],
            },
            {
              name: 'Line3',
              children: [
                cell('Extruder', payload(0.85, 0.93, 0.97)),
                cell('Saw', payload(0.93, 0.98, 0.98)),
              ],
            },
          ],
        },
        {
          name: 'Assembly',
          children: [
            {
              name: 'Line1',
              children: [
                cell('Packager', payload(0.9, 0.95, 0.97)),
                cell('Palletizer', payload(0.87, 0.94, 0.95)),
              ],
            },
            {
              name: 'Line2',
              children: [
                cell('Packager', payload(0.94, 0.96, 0.99)),
                cell('Palletizer', payload(0.89, 0.95, 0.96)),
              ],
            },
          ],
        },
      ],
    },
  ],
};

const materialize = (spec: UnsSpec, parentPath?: string): UnsNode => {
  const fullPath = parentPath ? `${parentPath}/${spec.name}` : spec.name;
  return {
    name: spec.name,
    fullPath,
    ...(spec.payload ? { payload: spec.payload } : {}),
    ...(spec.children
      ? { children: spec.children.map(c => materialize(c, fullPath)) }
      : {}),
  };
};

export const UNS_ROOT: UnsNode = materialize(SPEC);

export function getLeaves(node: UnsNode): UnsNode[] {
  return node.children ? node.children.flatMap(getLeaves) : [node];
}

export const hasPayload = (node: UnsNode): node is UnsLeaf =>
  node.payload !== undefined;

/** One `state` topic per leaf, in tree order. */
export const MQTT_TOPICS: readonly string[] = getLeaves(UNS_ROOT).map(
  leaf => `${leaf.fullPath}/state`
);
