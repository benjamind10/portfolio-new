import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from '../../src/components/About';
import Experience from '../../src/components/Experience';
import { PROFILE } from '../../src/content/profile';
import { JOBS, SEATS } from '../../src/content/experience';

describe('About', () => {
  it('renders every bio paragraph, skill, and principle from PROFILE', () => {
    render(<About />);

    for (const paragraph of PROFILE.bio) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
    for (const skill of PROFILE.skills) {
      expect(screen.getByText(skill)).toBeInTheDocument();
    }
    for (const principle of PROFILE.principles) {
      expect(screen.getByText(principle.title)).toBeInTheDocument();
      expect(screen.getByText(principle.evidence)).toBeInTheDocument();
    }
  });

  it('shows the resume link exactly when PROFILE.resume is defined', () => {
    render(<About />);

    const link = screen.queryByRole('link', { name: /resume/i });
    if (PROFILE.resume) {
      expect(link).toHaveAttribute('href', PROFILE.resume.href);
      expect(link).toHaveTextContent(PROFILE.resume.label);
    } else {
      expect(link).toBeNull();
      expect(document.querySelector('a[href="/resume.pdf"]')).toBeNull();
    }
  });
});

describe('Experience', () => {
  it('renders every job with its title, employer, summary, and seat', () => {
    render(<Experience />);

    for (const job of JOBS) {
      expect(
        screen.getByRole('heading', {
          level: 4,
          name: `${job.title} — ${job.org}`,
        })
      ).toBeInTheDocument();
      expect(screen.getByText(job.summary)).toBeInTheDocument();
    }
  });

  it('introduces all three seats with their lessons', () => {
    render(<Experience />);

    for (const seat of Object.values(SEATS)) {
      expect(screen.getByText(seat.lesson)).toBeInTheDocument();
      expect(screen.getAllByText(seat.label).length).toBeGreaterThanOrEqual(1);
    }
  });
});
