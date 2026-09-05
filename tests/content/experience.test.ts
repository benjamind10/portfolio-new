import { describe, expect, it } from 'vitest';
import { JOBS, SEATS, type Seat } from '../../src/content/experience';

const SEAT_KEYS = Object.keys(SEATS) as Seat[];

describe('JOBS', () => {
  it('has four jobs with unique ids, newest first', () => {
    expect(JOBS).toHaveLength(4);
    const ids = JOBS.map(j => j.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(JOBS[0].dates).toMatch(/Present/);
  });

  it('keeps the employer title of record on the current role (D1)', () => {
    expect(JOBS[0].title).toBe('Software Engineer');
  });

  it.each(JOBS)('$id has non-empty copy and a known seat', job => {
    expect(job.title.trim()).not.toBe('');
    expect(job.org.trim()).not.toBe('');
    expect(job.dates.trim()).not.toBe('');
    expect(job.summary.trim()).not.toBe('');
    expect(job.tags.length).toBeGreaterThanOrEqual(1);
    expect(SEAT_KEYS).toContain(job.seat);
  });

  it('covers all three seats at least once', () => {
    const seats = new Set(JOBS.map(j => j.seat));
    for (const seat of SEAT_KEYS) {
      expect(seats.has(seat), `no job in the ${seat} seat`).toBe(true);
    }
  });
});

describe('SEATS', () => {
  it('names exactly the three seats, each with a label and a lesson', () => {
    expect(SEAT_KEYS.sort()).toEqual(['integrator', 'manufacturer', 'vendor']);
    for (const seat of SEAT_KEYS) {
      expect(SEATS[seat].label.trim()).not.toBe('');
      expect(SEATS[seat].lesson.trim()).not.toBe('');
    }
  });
});
