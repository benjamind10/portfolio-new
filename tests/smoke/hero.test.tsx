import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import Hero from '../../src/components/Hero';
import { PROFILE } from '../../src/content/profile';
import { getLeaves, MQTT_TOPICS, UNS_ROOT } from '../../src/content/uns';

const LEAVES = getLeaves(UNS_ROOT);
const tail = (path: string) => path.split('/').slice(-2).join(' › ');

describe('Hero', () => {
  beforeEach(() => {
    // Fake only the interval clock so framer-motion's rAF keeps running.
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'Date'] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the profile headline as the h2', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      PROFILE.headline
    );
  });

  it('renders the name, pitch, and both CTAs from PROFILE', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      PROFILE.name
    );
    expect(screen.getByText(PROFILE.pitch)).toBeInTheDocument();
    for (const cta of [PROFILE.cta.primary, PROFILE.cta.secondary]) {
      expect(screen.getByRole('link', { name: cta.label })).toHaveAttribute(
        'href',
        cta.href
      );
    }
  });

  it('streams topics drawn from MQTT_TOPICS', () => {
    render(<Hero />);
    const shown = MQTT_TOPICS.map(t => t.split('/').slice(-2).join('/'));
    const stream = screen.getByText('mqtt.stream').closest('div.font-mono');
    expect(stream).not.toBeNull();
    expect(shown.some(s => stream!.textContent?.includes(s))).toBe(true);
  });

  it('advances the OEE card through UNS leaves without real time passing', () => {
    render(<Hero />);

    expect(screen.getByText(tail(LEAVES[0].fullPath))).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(screen.getByText(tail(LEAVES[1].fullPath))).toBeInTheDocument();
    expect(screen.queryByText(tail(LEAVES[0].fullPath))).toBeNull();
  });

  it('shows the site and area of the current node, never a real place', () => {
    render(<Hero />);
    const [, site, area] = LEAVES[0].fullPath.split('/');
    expect(screen.getByText(`${site} / ${area}`)).toBeInTheDocument();
  });
});
