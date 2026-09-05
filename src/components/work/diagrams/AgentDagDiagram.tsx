import React from 'react';
import { ArrowRight } from 'lucide-react';

/** The five reporting stages, in dataflow order; each hands a typed artifact on. */
const STAGES = [
  'Resolve identifiers',
  'OEE report',
  'Downtime report',
  'Edge / process report',
  'Orchestrate',
] as const;

/** How the pipeline itself was built: the same shape, one level up. */
const BUILD_STEPS = [
  'ticket',
  'research',
  'plan',
  'execute',
  'verify',
] as const;

const Chain: React.FC<{
  items: readonly string[];
  itemClass: string;
  arrowClass: string;
}> = ({ items, itemClass, arrowClass }) => (
  <ol className="flex flex-wrap items-center gap-y-2">
    {items.map((item, i) => (
      <li key={item} className="flex items-center">
        <span className={itemClass}>{item}</span>
        {i < items.length - 1 && (
          <ArrowRight
            size={14}
            aria-hidden="true"
            className={`mx-1.5 shrink-0 ${arrowClass}`}
          />
        )}
      </li>
    ))}
  </ol>
);

const AgentDagDiagram: React.FC = () => (
  <div className="space-y-4 text-xs">
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400">
        Pipeline · typed handoffs
      </p>
      <Chain
        items={STAGES}
        itemClass="rounded-md border border-indigo-500/50 bg-indigo-50 dark:bg-indigo-500/15 px-2.5 py-1 font-medium text-indigo-700 dark:text-indigo-300"
        arrowClass="text-indigo-500 dark:text-indigo-400"
      />
    </div>
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400">
        How it was built
      </p>
      <Chain
        items={BUILD_STEPS}
        itemClass="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-0.5 font-mono text-gray-700 dark:text-gray-300"
        arrowClass="text-gray-400 dark:text-gray-500"
      />
    </div>
  </div>
);

export default AgentDagDiagram;
