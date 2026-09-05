import React from 'react';
import { Bot } from 'lucide-react';
import type { AgenticComponent, Tier, TierId } from '../../content/architecture';
import { ARCHITECTURE_COPY } from '../../content/architecture';
import { cn } from '../../utils/cn';
import TierCard from './TierCard';

export type SelectionId = TierId | 'agentic';

interface ArchitectureDiagramProps {
  tiers: readonly Tier[];
  agentic: readonly AgenticComponent[];
  selectedId: SelectionId;
  onSelect: (id: SelectionId) => void;
}

const STROKE_CLASS = 'stroke-gray-300 dark:stroke-gray-600';

/** Arrow between adjacent tiers: horizontal from `lg`, vertical below it. */
const TierConnector: React.FC = () => (
  <>
    <svg
      aria-hidden="true"
      className="hidden lg:block absolute top-1/2 left-full -translate-y-1/2 w-6 h-4"
      viewBox="0 0 24 16"
      fill="none"
    >
      <line x1="0" y1="8" x2="19" y2="8" className={STROKE_CLASS} />
      <path d="M15 4 L20 8 L15 12" className={STROKE_CLASS} />
    </svg>
    <svg
      aria-hidden="true"
      className="lg:hidden absolute left-1/2 top-full -translate-x-1/2 w-4 h-6"
      viewBox="0 0 16 24"
      fill="none"
    >
      <line x1="8" y1="0" x2="8" y2="19" className={STROKE_CLASS} />
      <path d="M4 15 L8 20 L12 15" className={STROKE_CLASS} />
    </svg>
  </>
);

/**
 * Bus from tiers 4–7 down to the agentic block (`lg` only). One stub per
 * column plus a horizontal rail; the rail's inset is half a column, which
 * with a 24 px grid gap is `12.5% - 9px` of the four-column span.
 */
const AgenticBus: React.FC<{ columns: number }> = ({ columns }) => (
  <div aria-hidden="true" className="relative h-8">
    <div
      className="grid gap-6"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: columns }, (_, i) => (
        <svg key={i} className="mx-auto w-4 h-4" viewBox="0 0 16 16" fill="none">
          <line x1="8" y1="0" x2="8" y2="16" className={STROKE_CLASS} />
        </svg>
      ))}
    </div>
    <svg
      className="absolute top-4 left-[calc(12.5%-9px)] right-[calc(12.5%-9px)] w-auto h-px"
      preserveAspectRatio="none"
      viewBox="0 0 100 1"
      fill="none"
    >
      <line x1="0" y1="0.5" x2="100" y2="0.5" className={STROKE_CLASS} />
    </svg>
    <svg
      className="absolute left-1/2 top-4 -translate-x-1/2 w-4 h-4"
      viewBox="0 0 16 16"
      fill="none"
    >
      <line x1="8" y1="0" x2="8" y2="11" className={STROKE_CLASS} />
      <path d="M4 7 L8 12 L12 7" className={STROKE_CLASS} />
    </svg>
  </div>
);

/**
 * Seven tier cards in a grid with SVG connectors, and the agentic layer
 * drawn beneath tiers 4–7 as their consumer (design D4).
 */
const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({
  tiers,
  agentic,
  selectedId,
  onSelect,
}) => {
  const consumed = new Set(agentic.flatMap(c => c.readsFrom));
  const firstConsumed = tiers.findIndex(t => consumed.has(t.id));
  const consumedCount = tiers.length - firstConsumed;
  const agenticSelected = selectedId === 'agentic';

  return (
    <div>
      <ol
        className="grid grid-cols-1 lg:grid-cols-7 gap-6"
        aria-label="Architecture tiers"
      >
        {tiers.map((tier, i) => (
          <li key={tier.id} className="relative">
            <TierCard
              tier={tier}
              selected={selectedId === tier.id}
              onSelect={onSelect}
            />
            {i < tiers.length - 1 && <TierConnector />}
          </li>
        ))}
      </ol>

      <div className="mt-6 lg:mt-0 lg:grid lg:grid-cols-7 lg:gap-6">
        <div
          style={{ gridColumn: `${firstConsumed + 1} / span ${consumedCount}` }}
        >
          <div className="hidden lg:block">
            <AgenticBus columns={consumedCount} />
          </div>
          <button
            type="button"
            aria-pressed={agenticSelected}
            onClick={() => onSelect('agentic')}
            className={cn(
              'w-full text-left rounded-xl border border-dashed p-4 transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900',
              agenticSelected
                ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                : 'border-gray-300 dark:border-gray-600 bg-white/60 dark:bg-gray-900/60 hover:border-indigo-500/50'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Bot
                size={16}
                aria-hidden="true"
                className="text-indigo-500 dark:text-indigo-400"
              />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {ARCHITECTURE_COPY.agentic.name}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {agentic.map(component => (
                <span
                  key={component.id}
                  className="px-2 py-0.5 rounded-full font-mono text-[10px] bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {component.name}
                </span>
              ))}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
