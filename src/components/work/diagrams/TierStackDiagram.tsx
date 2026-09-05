import React from 'react';
import { ARCHITECTURE_COPY, TIERS } from '../../../content/architecture';

/**
 * The seven tiers as a stack, with the agentic layer bracketed against the
 * tiers it consumes (4–7). Reads the same `TIERS` the Architecture section
 * renders so the study and the centerpiece can never disagree.
 */
const TierStackDiagram: React.FC = () => (
  <div
    className="grid grid-cols-[1fr_auto] gap-1.5 text-xs"
    role="img"
    aria-label={`Stack of ${TIERS.length} tiers; the ${ARCHITECTURE_COPY.agentic.name.toLowerCase()} reads tiers 4 to 7`}
  >
    {TIERS.map(tier => (
      <div
        key={tier.id}
        className="col-start-1 flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5"
      >
        <span className="font-mono text-[11px] text-indigo-500 dark:text-indigo-400">
          {String(tier.index).padStart(2, '0')}
        </span>
        <span className="font-medium text-gray-900 dark:text-white">
          {tier.name}
        </span>
        <span className="ml-auto hidden sm:inline font-mono text-[10px] text-gray-500 dark:text-gray-400 truncate">
          {tier.technologies[0]}
        </span>
      </div>
    ))}
    <div className="col-start-2 row-start-4 row-span-4 flex items-center rounded-md border border-dashed border-indigo-500/60 bg-indigo-50/60 dark:bg-indigo-500/10 px-2">
      <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-600 dark:text-indigo-300 [writing-mode:vertical-rl] rotate-180">
        {ARCHITECTURE_COPY.agentic.name}
      </span>
    </div>
  </div>
);

export default TierStackDiagram;
