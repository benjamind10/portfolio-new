import { describe, expect, it } from 'vitest';
import { CASE_STUDIES } from '../../src/content/caseStudies';

const D5_ORDER = [
  'production-uns',
  'agent-reporting-dag',
  'semantic-layer',
  'oee-forensics',
  'uns-simulator',
  'script-profiler',
];

describe('CASE_STUDIES', () => {
  it('has six studies with unique ids in the D5 order', () => {
    expect(CASE_STUDIES).toHaveLength(6);
    const ids = CASE_STUDIES.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(D5_ORDER);
  });

  it.each(CASE_STUDIES)(
    '$id carries all four narrative fields, a metric, and a tag',
    study => {
      expect(study.title.trim()).not.toBe('');
      expect(study.summary.trim()).not.toBe('');
      expect(study.problem.trim()).not.toBe('');
      expect(study.constraint.trim()).not.toBe('');
      expect(study.decision.trim()).not.toBe('');
      expect(study.result.trim()).not.toBe('');
      expect(study.metrics.length).toBeGreaterThanOrEqual(1);
      for (const metric of study.metrics) {
        expect(metric.value.trim()).not.toBe('');
        expect(metric.label.trim()).not.toBe('');
      }
      expect(study.tags.length).toBeGreaterThanOrEqual(1);
    }
  );

  it('references 5 and 2 screenshots in the two carousel studies', () => {
    const carousels = CASE_STUDIES.flatMap(s =>
      s.media.kind === 'carousel' ? [s.media.images] : []
    );
    expect(carousels.map(images => images.length)).toEqual([5, 2]);
    for (const image of carousels.flat()) {
      expect(image.src).not.toBe('');
      expect(image.alt.trim()).not.toBe('');
    }
  });

  it('gives every text study a diagram', () => {
    const diagrams = CASE_STUDIES.filter(s => s.media.kind === 'diagram');
    expect(diagrams).toHaveLength(4);
  });
});
