import React from 'react';
import { ArrowRight } from 'lucide-react';

/** The typed containment chain, enterprise down to the equipment that publishes. */
const HIERARCHY = [
  { name: 'Enterprise', type: 'enterprise' },
  { name: 'Plant-A', type: 'site' },
  { name: 'Extrusion', type: 'area' },
  { name: 'Line1', type: 'line' },
  { name: 'Extruder', type: 'equipment' },
] as const;

/** Relationships off the equipment node to the things that carry its values. */
const RELATIONS = [
  { edge: 'publishes', name: '…/Line1/Extruder/state', type: 'topic' },
  { edge: 'historized in', name: 'extruder_state hypertable', type: 'series' },
  {
    edge: 'contextualized by',
    name: 'work order · product · shift',
    type: 'mes',
  },
] as const;

/** What the i3X contract lets a consumer do with the graph. */
const SURFACE = [
  'discover',
  'explore types',
  'navigate relationships',
  'live and historical values',
] as const;

const CONSUMERS = ['Agents (MCP)', 'Dashboards', 'Warehouse'] as const;

const Arrow: React.FC = () => (
  <ArrowRight
    size={16}
    aria-hidden="true"
    className="shrink-0 rotate-90 sm:rotate-0 text-indigo-500 dark:text-indigo-400"
  />
);

const EdgeLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-center font-mono text-[9px] tracking-wider text-gray-500 dark:text-gray-400">
    {children}
  </span>
);

const Node: React.FC<{
  name: string;
  type: string;
  leaf?: boolean;
  mono?: boolean;
}> = ({ name, type, leaf = false, mono = false }) => (
  <span
    className={
      leaf
        ? 'flex items-center justify-between gap-2 rounded-md border border-indigo-500/60 bg-indigo-50 dark:bg-indigo-500/15 px-2.5 py-1 text-indigo-700 dark:text-indigo-300'
        : 'flex items-center justify-between gap-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2.5 py-1 text-gray-700 dark:text-gray-300'
    }
  >
    <span className={mono ? 'font-mono text-[10px]' : undefined}>{name}</span>
    <span className="font-mono text-[9px] uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
      {type}
    </span>
  </span>
);

/**
 * Typed ISA-95 objects contain one another down to the equipment, which is
 * related to the topic, series, and MES context that carry its values; every
 * consumer reads the graph through the i3X surface.
 */
const KnowledgeGraphDiagram: React.FC = () => (
  <div
    className="flex flex-col sm:flex-row items-center gap-3 text-xs"
    role="img"
    aria-label="A knowledge graph of typed ISA-95 objects, related to each other and to their namespace topic and historian series, read through the i3X surface by agents, dashboards, and the warehouse"
  >
    <ol className="flex flex-col gap-1">
      {HIERARCHY.map((node, i) => (
        <li key={node.name} className="flex flex-col gap-1">
          {i > 0 && <EdgeLabel>contains</EdgeLabel>}
          <Node
            name={node.name}
            type={node.type}
            leaf={i === HIERARCHY.length - 1}
          />
        </li>
      ))}
    </ol>
    <Arrow />
    <ul className="flex flex-col gap-1.5">
      {RELATIONS.map(rel => (
        <li key={rel.edge} className="flex flex-col gap-0.5">
          <EdgeLabel>{rel.edge}</EdgeLabel>
          <Node name={rel.name} type={rel.type} mono />
        </li>
      ))}
    </ul>
    <Arrow />
    <div className="flex flex-col gap-2">
      <div className="rounded-md border border-dashed border-indigo-500/60 bg-indigo-50 dark:bg-indigo-500/15 px-3 py-2">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-indigo-700 dark:text-indigo-300">
          i3X surface
        </p>
        <ul className="mt-1 grid gap-0.5 text-gray-700 dark:text-gray-300">
          {SURFACE.map(item => (
            <li key={item}>· {item}</li>
          ))}
        </ul>
      </div>
      <ul className="flex sm:flex-col gap-1.5">
        {CONSUMERS.map(consumer => (
          <li
            key={consumer}
            className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2.5 py-1 text-gray-700 dark:text-gray-300"
          >
            {consumer}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default KnowledgeGraphDiagram;
