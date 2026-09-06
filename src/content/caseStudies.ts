/**
 * The six case studies the Work section renders (design D5), each in the
 * Problem → Constraint → Decision → Result shape. Components only lay this
 * out. Names technologies, vendors, and counts; never a plant, site code,
 * host, database, or person (design D2).
 */
import type { Link } from './profile';
import sim1 from '../assets/uns-sim-1.png';
import sim2 from '../assets/uns-sim-2.png';
import sim3 from '../assets/uns-sim-3.png';
import sim4 from '../assets/uns-sim-4.png';
import sim5 from '../assets/uns-sim-5.png';
import profiler1 from '../assets/script-profiler-1.png';
import profiler2 from '../assets/script-profiler-2.png';

export type DiagramKind =
  'tier-stack' | 'agent-dag' | 'semantic-layer' | 'oee-forensics';

export interface CaseStudyImage {
  src: string;
  alt: string;
}

export type Media =
  | { kind: 'carousel'; images: readonly CaseStudyImage[] }
  | { kind: 'diagram'; diagram: DiagramKind };

export interface Metric {
  value: string;
  label: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  /** One-line card teaser. */
  summary: string;
  problem: string;
  constraint: string;
  decision: string;
  result: string;
  metrics: readonly Metric[];
  tags: readonly string[];
  media: Media;
  /** Public repos or write-ups, when they exist (outline Open Question 3). */
  links?: readonly Link[];
}

export interface WorkCopy {
  title: string;
  subtitle: string;
}

export const WORK_COPY: WorkCopy = {
  title: 'Work',
  subtitle:
    'Six pieces of work, each told as the problem, the constraint that shaped the answer, the decision made, and what it produced. Every number is an engineering count from the record. Select a card to read the study.',
};

export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    id: 'production-uns',
    title: 'Seven-tier production Unified Namespace',
    summary:
      'A reference architecture taken from first design to multi-plant deployment: edge transport, schema-validated broker, MES context, analytics, historian, warehouse, and governed egress.',
    problem:
      'Three plants in three states ran on two MES stacks, each with its own tag conventions, its own OEE arithmetic, and dashboards that disagreed about the same line. Nothing could be compared across sites, and nothing could be consumed by software without a person first explaining the shape of the data.',
    constraint:
      'Neither MES stack could be replaced, no plant could stop for a cut-over, and the model had to stay consumable by systems that did not exist yet, AI agents included. Everything had to be added around what was already running.',
    decision:
      'One ISA-95 namespace on an EMQX broker, with the payload contract enforced at the edge and validated again in broker rules. Every other capability is its own tier that publishes back into the namespace rather than a client that pulls from a database: Ignition for MES context, Flow Software for OEE, TimescaleDB and Timebase for history, Snowflake for the enterprise view, FastAPI for governed egress.',
    result:
      'Six extrusion lines and five packaging lines publish through the same contract; a new plant onboards by configuration, with site as a dimension, instead of by new tables; eight services per site sit behind one governed API; and the agentic layer reads the same model of the plant a person does. The Architecture section above is this design.',
    metrics: [
      { value: '7', label: 'tiers' },
      { value: '3', label: 'plants, 2 MES stacks' },
      { value: '6', label: 'extrusion lines' },
      { value: '8', label: 'services per site' },
    ],
    tags: [
      'EMQX',
      'Sparkplug B',
      'Ignition',
      'Flow Software',
      'TimescaleDB',
      'Snowflake',
      'FastAPI',
    ],
    media: { kind: 'diagram', diagram: 'tier-stack' },
  },
  {
    id: 'agent-reporting-dag',
    title: 'Multi-agent production reporting pipeline',
    summary:
      'Five specialised agents with typed handoffs turn a line and a shift into OEE, downtime, and edge-process reports, each number traceable to a governed source.',
    problem:
      'Weekly production reporting meant an engineer resolving object identifiers by hand, pulling OEE and downtime from the analytics tier, cross-checking edge and process data, and assembling a deck. Every report was a bespoke query session, and the reasoning behind it was gone by the following week.',
    constraint:
      'A single prompt that "writes the report" invents identifiers and arithmetic. Every number had to trace to a governed source, each step had to be re-runnable on its own, and the agents could reach data only through MCP servers over the API tier, never through a raw connection.',
    decision:
      'Model the workflow as a dataflow DAG: identifier resolution → OEE report → downtime report → edge and process report → orchestrator, with each stage a discrete skill that emits a typed artifact the next stage consumes. The pipeline itself was built the way I build software: a ticket, a research pass with file-and-line evidence, a plan, an implementation, and a verification step, each persisted as a reviewable document.',
    result:
      'A report for any line is one orchestrator invocation whose intermediate artifacts can be inspected; stage outputs are checked against the semantic layer before they are used; and the same five-stage skeleton has been ported across two agent runtimes without rewriting a stage.',
    metrics: [
      { value: '5', label: 'pipeline stages' },
      { value: '6', label: 'MCP connections' },
      { value: '2', label: 'agent runtimes' },
    ],
    tags: ['Claude Code', 'MCP', 'Python', 'Typed handoffs', 'Agent skills'],
    media: { kind: 'diagram', diagram: 'agent-dag' },
  },
  {
    id: 'semantic-layer',
    title: 'Semantic layer for machine consumers',
    summary:
      'Forty-seven named concepts generated once from a single definition and stamped onto eleven line instances, so an agent asks for a metric by name instead of composing a query.',
    problem:
      'Every agent, dashboard, and analyst asking what availability was on a line last shift had to know which event scheme, which measure, and which classification column encoded the answer. That knowledge lived in people, so each new consumer relearned it and each one encoded it slightly differently.',
    constraint:
      'Eleven packaging-line instances shared a definition but had drifted in detail, and a hand-maintained model per instance would drift again. The layer had to be regenerable from one source, validated against the live analytics model, and readable by a language model without a person in the loop.',
    decision:
      'Define the concepts once in a YAML semantic model and generate the per-instance layer from it: forty-seven concepts per instance, including a new event-classification measure that makes planned and unplanned downtime distinguishable to a machine. Package the generator as a reusable skill so it runs as part of the pipeline rather than as a one-off.',
    result:
      'Eleven instances × forty-seven concepts, validated against the analytics tier. The reporting agents resolve every metric through the layer, adding a concept is one edit followed by a regeneration, and the same question means the same thing at every plant.',
    metrics: [
      { value: '11', label: 'instances' },
      { value: '47', label: 'concepts each' },
      { value: '1', label: 'definition to maintain' },
    ],
    tags: ['Semantic layer', 'YAML', 'Flow Software', 'MCP', 'Code generation'],
    media: { kind: 'diagram', diagram: 'semantic-layer' },
  },
  {
    id: 'oee-forensics',
    title: 'OEE data-model forensics',
    summary:
      'Finding and fixing the defects that make an OEE number quietly wrong: inverted timestamps, duplicate attribute bindings, and stalled backfills.',
    problem:
      'Availability above one hundred percent, negative event durations, and a site-wide stretch in which machine events stopped being classified. None of it crashed anything. The numbers simply could not be trusted, and the dashboards on top of them kept rendering as though they could.',
    constraint:
      'The analytics tier is a vendor product with an opaque configuration tool and a live production database behind it. Fixes had to land in the model, not by editing history, and had to be proven against the MES source of truth rather than against the tier that was already wrong.',
    decision:
      'Treat it as forensics: reproduce each defect from raw MES SQL, then trace it to the model. The inversion came from an event end time bound to the wrong source column; the duplicate bindings from template redeployment cascades that re-attached attributes on every publish; the stalled backfills from a null retrieve-point default on twenty-five event schemes. Fix the bindings, normalise the retrieve point, and correct the timestamp format string to ISO 8601 so the inversion cannot recur.',
    result:
      'Availability is bounded by its definition again, durations are non-negative, twenty-five event schemes backfill across five lines, and a validation query set now compares the analytics tier to raw MES numbers so the next silent drift is caught by a check rather than by someone noticing.',
    metrics: [
      { value: '25', label: 'event schemes unblocked' },
      { value: '3', label: 'root causes fixed' },
      { value: '5', label: 'lines backfilled' },
    ],
    tags: ['Flow Software', 'SQL Server', 'OEE', 'Data quality', 'Ignition'],
    media: { kind: 'diagram', diagram: 'oee-forensics' },
  },
  {
    id: 'uns-simulator',
    title: 'UNS Simulator',
    summary:
      'A design tool for shaping Unified Namespace topic hierarchies, configuring MQTT broker flows, and exercising realistic industrial payloads before production deployment.',
    problem:
      'Namespace decisions were being made on whiteboards and discovered wrong on the plant floor: a topic level too deep for a consumer, a payload shape a broker rule rejected, a flow that fanned out further than anyone expected.',
    constraint:
      'Real equipment cannot be borrowed to test a topic tree, and a production broker is the wrong place to learn that a schema assumption fails. The tool had to be self-contained and realistic enough that what passed in it would pass in production.',
    decision:
      'Build a simulator that shapes the hierarchy, defines payload schemas, configures broker flows, and streams realistic industrial payloads through them, so structure and schema assumptions are validated as a design step.',
    result:
      'Namespace structure and schema assumptions are exercised before anything touches a plant. The five screens below walk the hierarchy editor, schema definition, and flow configuration.',
    metrics: [
      { value: '0', label: 'plant hardware required' },
      { value: '5', label: 'design surfaces' },
    ],
    tags: ['MQTT', 'UNS design', 'Schema validation', 'Simulation'],
    media: {
      kind: 'carousel',
      images: [
        { src: sim1, alt: 'UNS Simulator Screenshot 1' },
        { src: sim2, alt: 'UNS Simulator Screenshot 2' },
        { src: sim3, alt: 'UNS Simulator Screenshot 3' },
        { src: sim4, alt: 'UNS Simulator Screenshot 4' },
        { src: sim5, alt: 'UNS Simulator Screenshot 5' },
      ],
    },
  },
  {
    id: 'script-profiler',
    title: 'Ignition Script Profiler module',
    summary:
      'A custom Java module for Ignition 8.1 that makes shared script execution visible across gateway and client contexts, with per-function timing.',
    problem:
      'Shared Jython scripts run in gateway and client scopes, and when a production screen slowed down nobody could say which function, in which scope, was spending the time. Profiling meant sprinkling timers by hand and removing them afterwards.',
    constraint:
      'The instrumentation could not change the scripts operators depend on, had to run in every scope with negligible overhead, and had to install as a standard signed module rather than a patched gateway.',
    decision:
      'Write a Gateway module in Java that hooks the shared script execution path and records per-function timing across contexts, surfacing it in a gateway view so the bottleneck is read off a table instead of guessed at.',
    result:
      'Per-function timing is visible for the scripts production workflows rely on and bottlenecks are located without editing them. The two screens below show the module installed and the profile it produces.',
    metrics: [
      { value: '8.1', label: 'Ignition version' },
      { value: '2', label: 'execution contexts' },
    ],
    tags: ['Java', 'Ignition SDK', 'Jython', 'Performance'],
    media: {
      kind: 'carousel',
      images: [
        { src: profiler1, alt: 'Script Profiler Screenshot 1' },
        { src: profiler2, alt: 'Script Profiler Screenshot 2' },
      ],
    },
  },
];
