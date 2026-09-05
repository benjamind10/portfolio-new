import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileJson,
  ShieldCheck,
} from 'lucide-react';
import {
  getLeaves,
  hasPayload,
  type UnsLeaf,
  type UnsNode,
} from '../../content/uns';
import { cn } from '../../utils/cn';

interface UnsExplorerProps {
  root: UnsNode;
  /** The broker's validation rule, shown beside the selected payload. */
  schemaRule?: string;
  /** Nodes shallower than this start expanded; the selected leaf's ancestors always do. */
  initiallyExpandedDepth?: number;
}

const collectExpanded = (
  node: UnsNode,
  depth: number,
  maxDepth: number,
  into: Set<string>
): void => {
  if (!node.children) return;
  if (depth < maxDepth) into.add(node.fullPath);
  node.children.forEach(child =>
    collectExpanded(child, depth + 1, maxDepth, into)
  );
};

const ancestorPaths = (fullPath: string): string[] => {
  const segments = fullPath.split('/');
  return segments
    .slice(0, -1)
    .map((_, i) => segments.slice(0, i + 1).join('/'));
};

const ROW_CLASS =
  'flex items-center gap-1.5 w-full rounded px-1.5 py-1 text-left font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-900';

/**
 * Expandable topic tree over the same namespace the Hero streams. Branch
 * rows toggle; leaf rows select, and the selected leaf's payload renders
 * beside the tree with the schema rule that admitted it.
 */
const UnsExplorer: React.FC<UnsExplorerProps> = ({
  root,
  schemaRule,
  initiallyExpandedDepth = 3,
}) => {
  const [selected, setSelected] = useState<UnsLeaf | null>(
    () => getLeaves(root).find(hasPayload) ?? null
  );
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const set = new Set<string>();
    collectExpanded(root, 0, initiallyExpandedDepth, set);
    if (selected) ancestorPaths(selected.fullPath).forEach(p => set.add(p));
    return set;
  });

  const toggle = (path: string) =>
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });

  const renderNode = (node: UnsNode, depth: number): React.ReactNode => {
    const indent = { paddingLeft: `${depth * 0.75}rem` };

    if (node.children) {
      const isOpen = expanded.has(node.fullPath);
      return (
        <li key={node.fullPath}>
          <button
            type="button"
            aria-expanded={isOpen}
            onClick={() => toggle(node.fullPath)}
            style={indent}
            className={cn(
              ROW_CLASS,
              'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            {isOpen ? (
              <ChevronDown size={12} className="shrink-0 text-gray-400" />
            ) : (
              <ChevronRight size={12} className="shrink-0 text-gray-400" />
            )}
            <span>{node.name}</span>
            <span className="ml-auto text-[10px] text-gray-400">
              {node.children.length}
            </span>
          </button>
          {isOpen && (
            <ul>{node.children.map(child => renderNode(child, depth + 1))}</ul>
          )}
        </li>
      );
    }

    const isSelected = selected?.fullPath === node.fullPath;
    return (
      <li key={node.fullPath}>
        <button
          type="button"
          aria-pressed={isSelected}
          disabled={!hasPayload(node)}
          onClick={() => hasPayload(node) && setSelected(node)}
          style={indent}
          className={cn(
            ROW_CLASS,
            isSelected
              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
        >
          <FileJson size={12} className="shrink-0 ml-3 text-indigo-400" />
          <span>{node.name}</span>
        </button>
      </li>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-card p-2 max-h-72 overflow-auto">
        <ul>{renderNode(root, 0)}</ul>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-card p-3 font-mono text-xs">
        {selected ? (
          <motion.div
            key={selected.fullPath}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-gray-500 mb-1">topic</p>
            <p className="break-all text-indigo-600 dark:text-indigo-300 mb-3">
              {selected.fullPath}
            </p>
            <p className="text-gray-500 mb-1">payload</p>
            <pre className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {JSON.stringify(selected.payload, null, 2)}
            </pre>
            <p className="mt-2 flex items-center gap-1.5 text-status-running">
              <CheckCircle2 size={12} aria-hidden="true" />
              schema: valid
            </p>
          </motion.div>
        ) : (
          <p className="text-gray-500">Select a topic to inspect its payload.</p>
        )}

        {schemaRule && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex gap-2 text-gray-600 dark:text-gray-400">
            <ShieldCheck
              size={14}
              aria-hidden="true"
              className="shrink-0 mt-0.5 text-indigo-500"
            />
            <p className="font-sans text-xs leading-relaxed">{schemaRule}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnsExplorer;
