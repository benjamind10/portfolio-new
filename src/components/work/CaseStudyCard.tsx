import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { CaseStudy } from '../../content/caseStudies';
import { cn } from '../../utils/cn';

interface CaseStudyCardProps {
  study: CaseStudy;
  expanded: boolean;
  /** Id of the panel this card discloses; wired only while it is mounted. */
  panelId: string;
  onSelect: (id: string) => void;
}

/**
 * One study in the grid. A disclosure button: `aria-expanded` reports the
 * state and `aria-controls` points at the inline panel while it exists.
 * Only phrasing elements inside, since it is a `<button>`.
 */
const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  study,
  expanded,
  panelId,
  onSelect,
}) => (
  <button
    type="button"
    aria-expanded={expanded}
    aria-controls={expanded ? panelId : undefined}
    onClick={() => onSelect(study.id)}
    className={cn(
      'flex h-full w-full flex-col text-left rounded-xl border p-5 bg-white dark:bg-gray-900 transition-colors duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900',
      expanded
        ? 'border-indigo-500 shadow-lg shadow-indigo-500/10'
        : 'border-gray-200 dark:border-gray-700 shadow-md shadow-indigo-500/5 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10'
    )}
  >
    <span className="flex items-start justify-between gap-3">
      <span className="text-base font-semibold leading-snug text-gray-900 dark:text-white">
        {study.title}
      </span>
      <ChevronDown
        size={18}
        aria-hidden="true"
        className={cn(
          'mt-0.5 shrink-0 text-indigo-500 dark:text-indigo-400 transition-transform duration-200',
          expanded && 'rotate-180'
        )}
      />
    </span>
    <span className="mt-2 block text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      {study.summary}
    </span>
    <span className="mt-4 block font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">
      {study.metrics[0].value}
      <span className="ml-1 text-[11px] font-normal text-gray-500 dark:text-gray-400">
        {study.metrics[0].label}
      </span>
    </span>
    <span className="mt-3 flex flex-wrap gap-1.5">
      {study.tags.slice(0, 4).map(tag => (
        <span
          key={tag}
          className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 font-mono text-[10px] text-gray-600 dark:text-gray-300"
        >
          {tag}
        </span>
      ))}
    </span>
  </button>
);

export default CaseStudyCard;
