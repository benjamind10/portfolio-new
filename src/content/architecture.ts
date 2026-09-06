/**
 * The seven-tier reference architecture the Architecture section renders,
 * plus the agentic layer drawn as a consumer of tiers 4–7 (design D4). Every
 * string on that section comes from here; the components only lay it out.
 * Names technologies, vendors, and counts; never a plant, site code, host,
 * database, or person (design D2).
 */
export type TierId =
  | 'edge'
  | 'broker'
  | 'mes'
  | 'analytics'
  | 'historian'
  | 'warehouse'
  | 'api';

export interface Tier {
  id: TierId;
  index: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  name: string;
  /** What the tier does. */
  purpose: string;
  /** Why it is its own tier rather than folded into a neighbor. */
  whySeparate: string;
  /** The architectural decision the tier encodes. */
  decision: string;
  technologies: readonly string[];
  /** The rule the broker validates leaf payloads against; `broker` only. */
  schemaRule?: string;
}

export interface AgenticComponent {
  id: 'mcp' | 'semantic' | 'dag';
  name: string;
  purpose: string;
  /** Tiers this component consumes; always a subset of tiers 4–7. */
  readsFrom: readonly TierId[];
}

export interface ArchitectureCopy {
  title: string;
  subtitle: string;
  agentic: { name: string; summary: string };
}

export const ARCHITECTURE_COPY: ArchitectureCopy = {
  title: 'Architecture',
  subtitle:
    'A seven-tier production Unified Namespace as I build it: each tier owns one concern, publishes back into the namespace, and encodes a decision the tiers around it can rely on. Select a tier to read what it does, why it stands alone, and the decision it encodes.',
  agentic: {
    name: 'Agentic layer',
    summary:
      'AI agents are consumers of the architecture, not a tier of it. They read the enriched, historized, and governed tiers through typed tools and a shared semantic layer, so an agent answers from the same model of the plant a person would.',
  },
};

export const TIERS: readonly Tier[] = [
  {
    id: 'edge',
    index: 1,
    name: 'Edge transport',
    purpose:
      'PLCs, line controllers, and edge gateways publish into the namespace over MQTT with Sparkplug B, so every tag arrives typed, birth-certified, and stamped with its source.',
    whySeparate:
      'Transport is the only tier that talks to hardware. Isolating it means a PLC swap or a driver upgrade never changes a topic a consumer depends on.',
    decision:
      'Enforce the contract at the edge. A publisher that cannot meet the payload schema does not publish, rather than leaving the broker or a downstream consumer to clean up after it.',
    technologies: ['MQTT', 'Sparkplug B', 'Edge gateways', 'PLC drivers'],
  },
  {
    id: 'broker',
    index: 2,
    name: 'Broker and namespace',
    purpose:
      'An EMQX cluster hosts the Unified Namespace: an ISA-95 topic tree from Enterprise down to work cell, with broker rules that validate every payload against its schema before it is retained.',
    whySeparate:
      'The broker is the one place every producer and consumer meet. Keeping business logic out of it keeps it the neutral, single source of truth for the plant.',
    decision:
      'Validate schemas in broker rules, not in each client. Rejecting a malformed payload once, centrally, is cheaper than reconciling it in every consumer that would have read it.',
    technologies: ['EMQX', 'MQTT 5', 'Rule engine', 'JSON Schema'],
    schemaRule:
      'Leaf payloads carry oee, availability, performance, and quality as floats in [0, 1]; oee equals availability × performance × quality within rounding. Anything else is rejected before retention.',
  },
  {
    id: 'mes',
    index: 3,
    name: 'MES context',
    purpose:
      'Ignition adds the manufacturing context raw tags lack: which work order, product, shift, and operator a machine state belongs to, across three plants running two MES stacks.',
    whySeparate:
      'Context changes on a business cadence; transport changes on a machine cadence. Splitting them lets either evolve without republishing the other.',
    decision:
      'Model context as its own namespace branch that references equipment paths, instead of folding order and product data into equipment payloads.',
    technologies: ['Ignition', 'Perspective', 'Tag providers', 'SQL'],
  },
  {
    id: 'analytics',
    index: 4,
    name: 'Analytics enrichment',
    purpose:
      'Flow Software computes OEE, downtime, and event schemes from the contextualized stream and publishes the results back into the namespace as first-class topics.',
    whySeparate:
      'Derived numbers need one reproducible definition. Computing them once, in one tier, ends the disagreement between dashboards that each did their own math.',
    decision:
      'Publish calculations back to the UNS so every consumer, human or agent, reads the same OEE instead of recomputing it.',
    technologies: ['Flow Software', 'OEE models', 'Event schemes'],
  },
  {
    id: 'historian',
    index: 5,
    name: 'Historian',
    purpose:
      'TimescaleDB historizes the namespace straight from the broker, retaining the high-resolution time series in PostgreSQL, so trends, forensics, and backfills are answered from raw history in the same SQL the rest of the stack speaks, not from aggregates. If needed, Timebase keeps raw value-quality-timestamp history at the edge devices.',
    whySeparate:
      'A broker retains the latest value; a historian retains every value. Conflating the two either bloats the broker or loses history.',
    decision:
      'Historize from the namespace, not from the PLC, so what is stored is exactly what every consumer saw.',
    technologies: [
      'TimescaleDB',
      'Timebase',
      'PostgreSQL',
      'Time-series storage',
    ],
  },
  {
    id: 'warehouse',
    index: 6,
    name: 'Cloud warehouse',
    purpose:
      'Snowflake holds the enterprise view: historian and MES data landed per site, modelled once, and joined with business systems for reporting across plants.',
    whySeparate:
      'Plant systems answer plant questions. Enterprise questions need every plant in one place, under one model, on a query engine sized for it.',
    decision:
      'Land per-site data into one shared model with site as a dimension, so the next plant onboards by configuration rather than by new tables.',
    technologies: ['Snowflake', 'ELT pipelines', 'Shared data model'],
  },
  {
    id: 'api',
    index: 7,
    name: 'Governed API egress',
    purpose:
      'FastAPI services expose curated, versioned endpoints over the warehouse and the namespace, eight services per site, so consumers never query storage directly.',
    whySeparate:
      'Egress is where governance lives. Authentication, rate limits, versioning, and audit belong at one boundary, not scattered across consumers.',
    decision:
      'Every external consumer, AI agents included, goes through the API tier. The MCP servers in the agentic layer are API clients, never database clients.',
    technologies: ['FastAPI', 'OpenAPI', 'Versioned contracts', 'Auth'],
  },
];

export const AGENTIC_LAYER: readonly AgenticComponent[] = [
  {
    id: 'mcp',
    name: 'MCP servers',
    purpose:
      'Six MCP connections give agents typed tools over the API tier, the warehouse, and the historian, so an agent asks for a metric by name instead of composing a query.',
    readsFrom: ['api', 'warehouse', 'historian'],
  },
  {
    id: 'semantic',
    name: 'Semantic layer',
    purpose:
      'Eleven instances share forty-seven named concepts generated from one definition, so the same question means the same thing at every plant and to every agent.',
    readsFrom: ['analytics', 'warehouse'],
  },
  {
    id: 'dag',
    name: 'Multi-agent DAG',
    purpose:
      'A five-stage reporting pipeline with typed handoffs between agents. Each stage reads through the semantic layer and MCP tools, never raw storage, so its output can be verified against the model.',
    readsFrom: ['api', 'warehouse'],
  },
];
