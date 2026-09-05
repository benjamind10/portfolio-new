import React from 'react';
import { motion } from 'framer-motion';
import type { AgenticComponent, Tier } from '../../content/architecture';
import { ARCHITECTURE_COPY, TIERS } from '../../content/architecture';
import { UNS_ROOT } from '../../content/uns';
import UnsExplorer from './UnsExplorer';

/** Shared between the tier and agentic panels so selection morphs one panel. */
const PANEL_LAYOUT_ID = 'architecture-detail';

const PANEL_CLASS =
  'rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-md shadow-indigo-500/5';

const contentMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: 'easeOut' as const },
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div>
    <h4 className="font-mono text-[11px] uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-1">
      {label}
    </h4>
    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
      {children}
    </p>
  </div>
);

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
    {children}
  </span>
);

interface TierDetailProps {
  tier: Tier;
}

const TierDetail: React.FC<TierDetailProps> = ({ tier }) => (
  <motion.div
    layout
    layoutId={PANEL_LAYOUT_ID}
    className={PANEL_CLASS}
    aria-live="polite"
  >
    <motion.div key={tier.id} {...contentMotion}>
      <div className="flex items-baseline gap-3 mb-5">
        <span className="font-mono text-sm text-indigo-500 dark:text-indigo-400">
          {String(tier.index).padStart(2, '0')}
        </span>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {tier.name}
        </h3>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Purpose">{tier.purpose}</Field>
        <Field label="Why its own tier">{tier.whySeparate}</Field>
        <Field label="Decision it encodes">{tier.decision}</Field>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {tier.technologies.map(tech => (
          <Pill key={tech}>{tech}</Pill>
        ))}
      </div>

      {tier.id === 'broker' && (
        <div className="mt-6">
          <h4 className="font-mono text-[11px] uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-2">
            Namespace explorer
          </h4>
          <UnsExplorer root={UNS_ROOT} schemaRule={tier.schemaRule} />
        </div>
      )}
    </motion.div>
  </motion.div>
);

interface AgenticDetailProps {
  components: readonly AgenticComponent[];
}

const tierName = (id: Tier['id']) =>
  TIERS.find(t => t.id === id)?.name ?? id;

export const AgenticDetail: React.FC<AgenticDetailProps> = ({
  components,
}) => (
  <motion.div
    layout
    layoutId={PANEL_LAYOUT_ID}
    className={PANEL_CLASS}
    aria-live="polite"
  >
    <motion.div key="agentic" {...contentMotion}>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {ARCHITECTURE_COPY.agentic.name}
      </h3>
      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-5 max-w-3xl">
        {ARCHITECTURE_COPY.agentic.summary}
      </p>

      <div className="grid gap-5 md:grid-cols-3">
        {components.map(component => (
          <div key={component.id}>
            <Field label={component.name}>{component.purpose}</Field>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {component.readsFrom.map(id => (
                <Pill key={id}>{tierName(id)}</Pill>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

export default TierDetail;
