import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

/**
 * jsdom ships neither `matchMedia` nor `IntersectionObserver`. `useTheme`
 * and framer-motion's `useReducedMotion` read the former; `useActiveSection`
 * and framer-motion's `whileInView` need the latter.
 */

const matchMediaStub = (query: string): MediaQueryList => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(() => false),
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: vi.fn(matchMediaStub),
});

/**
 * Recording `IntersectionObserver` stub. Tests reach the instance a hook
 * created through `MockIntersectionObserver.instances` and push synthetic
 * entries into its callback with `trigger(entries)`.
 */
export class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  readonly root: Element | Document | null;
  readonly rootMargin: string;
  readonly thresholds: readonly number[];
  readonly observed: Element[] = [];
  private readonly callback: IntersectionObserverCallback;

  constructor(
    callback: IntersectionObserverCallback,
    options: IntersectionObserverInit = {}
  ) {
    this.callback = callback;
    this.root = options.root ?? null;
    this.rootMargin = options.rootMargin ?? '0px';
    const threshold = options.threshold ?? 0;
    this.thresholds = Array.isArray(threshold) ? threshold : [threshold];
    MockIntersectionObserver.instances.push(this);
  }

  observe(target: Element): void {
    this.observed.push(target);
  }

  unobserve(target: Element): void {
    const i = this.observed.indexOf(target);
    if (i !== -1) this.observed.splice(i, 1);
  }

  disconnect(): void {
    this.observed.length = 0;
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  trigger(entries: Partial<IntersectionObserverEntry>[]): void {
    this.callback(entries as IntersectionObserverEntry[], this);
  }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

beforeEach(() => {
  MockIntersectionObserver.instances = [];
});

afterEach(() => {
  cleanup();
});
