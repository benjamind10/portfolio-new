import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { CaseStudy, DiagramKind, Media } from '../../content/caseStudies';
import ImageCarousel from '../common/ImageCarousel';
import TierStackDiagram from './diagrams/TierStackDiagram';
import AgentDagDiagram from './diagrams/AgentDagDiagram';
import SemanticLayerDiagram from './diagrams/SemanticLayerDiagram';
import OeeForensicsDiagram from './diagrams/OeeForensicsDiagram';

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

const Diagram: React.FC<{ kind: DiagramKind }> = ({ kind }) => {
  switch (kind) {
    case 'tier-stack':
      return <TierStackDiagram />;
    case 'agent-dag':
      return <AgentDagDiagram />;
    case 'semantic-layer':
      return <SemanticLayerDiagram />;
    case 'oee-forensics':
      return <OeeForensicsDiagram />;
  }
};

const MediaBlock: React.FC<{ media: Media; label: string }> = ({
  media,
  label,
}) => {
  switch (media.kind) {
    case 'carousel':
      return <ImageCarousel images={media.images} label={label} />;
    case 'diagram':
      return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/40 p-4">
          <Diagram kind={media.diagram} />
        </div>
      );
  }
};

interface CaseStudyPanelProps {
  study: CaseStudy;
  /** Matches the owning card's `aria-controls`. */
  id: string;
}

/**
 * The expanded study: four narrative fields, metrics, media, tags, links.
 * Spans the full grid row directly below its card. Mount-only content motion
 * (no exit) so only one study's text is ever in the DOM.
 */
const CaseStudyPanel: React.FC<CaseStudyPanelProps> = ({ study, id }) => (
  <motion.div
    id={id}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="col-span-full rounded-xl border border-indigo-500/40 dark:border-indigo-500/30 bg-white dark:bg-gray-900 p-6 shadow-md shadow-indigo-500/5"
  >
    <div className="grid gap-5 md:grid-cols-2">
      <Field label="Problem">{study.problem}</Field>
      <Field label="Constraint">{study.constraint}</Field>
      <Field label="Decision">{study.decision}</Field>
      <Field label="Result">{study.result}</Field>
    </div>

    <ul
      className="mt-6 flex flex-wrap gap-x-8 gap-y-3"
      aria-label={`${study.title} metrics`}
    >
      {study.metrics.map(metric => (
        <li key={metric.label} className="flex flex-col">
          <span className="font-mono text-2xl font-semibold text-gray-900 dark:text-white">
            {metric.value}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {metric.label}
          </span>
        </li>
      ))}
    </ul>

    <div className="mt-6">
      <MediaBlock media={study.media} label={study.title} />
    </div>

    <div className="mt-5 flex flex-wrap gap-2">
      {study.tags.map(tag => (
        <Pill key={tag}>{tag}</Pill>
      ))}
    </div>

    {study.links && study.links.length > 0 && (
      <ul className="mt-4 flex flex-wrap gap-4">
        {study.links.map(link => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              {link.label}
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    )}
  </motion.div>
);

export default CaseStudyPanel;
