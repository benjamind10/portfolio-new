import { describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { useActiveSection } from '../../src/hooks/useActiveSection';
import { MockIntersectionObserver } from '../setup';

const IDS = ['alpha', 'beta'] as const;

function Probe({ rootMargin }: { rootMargin?: string }) {
  const active = useActiveSection(IDS, rootMargin ? { rootMargin } : {});
  return <output data-testid="active">{active ?? 'none'}</output>;
}

function renderProbe(rootMargin?: string) {
  render(
    <>
      <section id="alpha" />
      <section id="beta" />
      <Probe rootMargin={rootMargin} />
    </>
  );
  const observer = MockIntersectionObserver.instances[0];
  expect(observer, 'hook should create one observer').toBeDefined();
  return observer;
}

describe('useActiveSection', () => {
  it('observes every id with a single observer offset for the sticky nav', () => {
    const observer = renderProbe();

    expect(MockIntersectionObserver.instances).toHaveLength(1);
    expect(observer.observed.map(el => el.id)).toEqual([...IDS]);
    expect(observer.rootMargin).toBe('-96px 0px 0px 0px');
  });

  it('honors a custom rootMargin', () => {
    const observer = renderProbe('-10px 0px 0px 0px');
    expect(observer.rootMargin).toBe('-10px 0px 0px 0px');
  });

  it('returns null until the first intersection, then follows the most-visible section', () => {
    const observer = renderProbe();
    const alpha = document.getElementById('alpha')!;
    const beta = document.getElementById('beta')!;

    expect(screen.getByTestId('active')).toHaveTextContent('none');

    act(() => {
      observer.trigger([
        { target: alpha, isIntersecting: true, intersectionRatio: 0.8 },
        { target: beta, isIntersecting: true, intersectionRatio: 0.2 },
      ]);
    });
    expect(screen.getByTestId('active')).toHaveTextContent('alpha');

    act(() => {
      observer.trigger([
        { target: alpha, isIntersecting: true, intersectionRatio: 0.3 },
        { target: beta, isIntersecting: true, intersectionRatio: 0.7 },
      ]);
    });
    expect(screen.getByTestId('active')).toHaveTextContent('beta');
  });

  it('drops a section that stops intersecting even if its earlier ratio was higher', () => {
    const observer = renderProbe();
    const alpha = document.getElementById('alpha')!;
    const beta = document.getElementById('beta')!;

    act(() => {
      observer.trigger([
        { target: alpha, isIntersecting: true, intersectionRatio: 1 },
      ]);
    });
    // A later callback reporting only beta as visible must win, even though
    // alpha's earlier ratio was higher, because alpha is no longer visible.
    act(() => {
      observer.trigger([
        { target: alpha, isIntersecting: false, intersectionRatio: 0 },
        { target: beta, isIntersecting: true, intersectionRatio: 0.4 },
      ]);
    });
    expect(screen.getByTestId('active')).toHaveTextContent('beta');
  });
});
