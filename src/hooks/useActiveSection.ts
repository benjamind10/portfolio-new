import { useEffect, useState } from 'react';

interface UseActiveSectionOptions {
  /**
   * Passed straight to `IntersectionObserver`. The default shrinks the
   * viewport by the 96 px sticky nav so a section counts as visible only
   * once it clears the bar (the same 96 px offset the previous scroll library
   * applied).
   */
  rootMargin?: string;
}

const DEFAULT_ROOT_MARGIN = '-96px 0px 0px 0px';
const THRESHOLDS = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

/**
 * Returns the id of the most-visible element among `ids`, or `null` before
 * the first intersection callback. One observer watches every id; pass a
 * stable array (module constant or memoized) so the observer is not rebuilt
 * on every render.
 */
export function useActiveSection(
  ids: readonly string[],
  options: UseActiveSectionOptions = {}
): string | null {
  const { rootMargin = DEFAULT_ROOT_MARGIN } = options;
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const elements = ids
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          ratios.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0
          );
        }

        let bestId: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId !== null) setActiveId(bestId);
      },
      { rootMargin, threshold: THRESHOLDS }
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, rootMargin]);

  return activeId;
}
