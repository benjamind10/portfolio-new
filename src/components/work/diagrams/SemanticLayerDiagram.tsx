import React from 'react';
import { ArrowRight } from 'lucide-react';

const INSTANCE_COUNT = 11;
const CONCEPT_COUNT = 47;
const CONSUMERS = ['Agents', 'Dashboards', 'People'] as const;

const Arrow: React.FC = () => (
  <ArrowRight
    size={16}
    aria-hidden="true"
    className="shrink-0 rotate-90 sm:rotate-0 text-indigo-500 dark:text-indigo-400"
  />
);

/**
 * One definition fans out to every instance, and every consumer reads the
 * instances through the same named concepts.
 */
const SemanticLayerDiagram: React.FC = () => (
  <div
    className="flex flex-col sm:flex-row items-center gap-3 text-xs"
    role="img"
    aria-label={`One definition generates ${CONCEPT_COUNT} concepts for each of ${INSTANCE_COUNT} instances, read by ${CONSUMERS.join(', ').toLowerCase()}`}
  >
    <div className="rounded-md border border-indigo-500/60 bg-indigo-50 dark:bg-indigo-500/15 px-3 py-2 text-center">
      <p className="font-mono text-lg font-semibold text-indigo-700 dark:text-indigo-300">
        1
      </p>
      <p className="text-indigo-700 dark:text-indigo-300">YAML definition</p>
    </div>
    <Arrow />
    <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2">
      <div className="grid grid-cols-6 gap-1" aria-hidden="true">
        {Array.from({ length: INSTANCE_COUNT }, (_, i) => (
          <span
            key={i}
            className="h-3 w-3 rounded-sm bg-indigo-500/70 dark:bg-indigo-400/70"
          />
        ))}
      </div>
      <p className="mt-1.5 font-mono text-[10px] text-gray-600 dark:text-gray-300">
        {INSTANCE_COUNT} instances × {CONCEPT_COUNT} concepts
      </p>
    </div>
    <Arrow />
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
);

export default SemanticLayerDiagram;
