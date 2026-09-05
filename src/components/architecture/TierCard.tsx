import React from 'react';
import { motion } from 'framer-motion';
import type { Tier, TierId } from '../../content/architecture';
import { cn } from '../../utils/cn';

interface TierCardProps {
  tier: Tier;
  selected: boolean;
  onSelect: (id: TierId) => void;
}

/**
 * One tier in the diagram. A toggle button so `aria-pressed` reports the
 * selection; the indigo ring is a shared-layout element that slides to
 * whichever card is selected.
 */
const TierCard: React.FC<TierCardProps> = ({ tier, selected, onSelect }) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={() => onSelect(tier.id)}
    className={cn(
      'relative w-full h-full text-left rounded-xl border p-3 lg:p-2.5 bg-white dark:bg-gray-900 transition-colors duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900',
      selected
        ? 'border-indigo-500 shadow-lg shadow-indigo-500/10'
        : 'border-gray-200 dark:border-gray-700 shadow-md shadow-indigo-500/5 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10'
    )}
  >
    {selected && (
      <motion.span
        layoutId="tier-selected-ring"
        aria-hidden="true"
        className="absolute inset-0 rounded-xl ring-2 ring-indigo-500 pointer-events-none"
        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      />
    )}
    <div className="flex items-center gap-2 lg:flex-col lg:items-start lg:gap-1">
      <span className="font-mono text-[11px] text-indigo-500 dark:text-indigo-400">
        {String(tier.index).padStart(2, '0')}
      </span>
      <span className="text-sm font-semibold leading-tight text-gray-900 dark:text-white">
        {tier.name}
      </span>
    </div>
    <p className="mt-1 font-mono text-[10px] text-gray-500 dark:text-gray-400 truncate">
      {tier.technologies[0]}
    </p>
  </button>
);

export default TierCard;
