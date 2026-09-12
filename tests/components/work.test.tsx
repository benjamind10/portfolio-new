import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Work from '../../src/components/Work';
import { CASE_STUDIES } from '../../src/content/caseStudies';

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const cardButton = (title: string) =>
  screen.getByRole('button', { name: new RegExp(escape(title)) });

describe('Work', () => {
  it('renders one collapsed card per study and no narrative text', () => {
    render(<Work />);

    for (const study of CASE_STUDIES) {
      expect(cardButton(study.title)).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText(study.decision)).toBeNull();
    }
  });

  it('expands the selected study and collapses it when another is selected', async () => {
    const user = userEvent.setup();
    render(<Work />);
    const [first, second] = CASE_STUDIES;

    await user.click(cardButton(first.title));

    const firstCard = cardButton(first.title);
    expect(firstCard).toHaveAttribute('aria-expanded', 'true');
    const panelId = firstCard.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    expect(document.getElementById(panelId!)).toContainElement(
      screen.getByText(first.decision)
    );
    expect(screen.getByText(first.problem)).toBeInTheDocument();
    expect(screen.getByText(first.constraint)).toBeInTheDocument();
    expect(screen.getByText(first.result)).toBeInTheDocument();
    expect(screen.queryByText(second.decision)).toBeNull();

    await user.click(cardButton(second.title));

    expect(cardButton(first.title)).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(first.decision)).toBeNull();
    expect(cardButton(second.title)).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(second.decision)).toBeInTheDocument();
  });

  it('collapses an expanded study when its card is clicked again', async () => {
    const user = userEvent.setup();
    render(<Work />);
    const study = CASE_STUDIES[2];

    await user.click(cardButton(study.title));
    expect(screen.getByText(study.decision)).toBeInTheDocument();

    await user.click(cardButton(study.title));
    expect(cardButton(study.title)).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(study.decision)).toBeNull();
  });

  it('embeds the image carousel for screenshot studies', async () => {
    const user = userEvent.setup();
    render(<Work />);

    for (const study of CASE_STUDIES) {
      if (study.media.kind !== 'carousel') continue;
      await user.click(cardButton(study.title));
      const [firstImage] = study.media.images;
      expect(screen.getByAltText(firstImage.alt)).toBeInTheDocument();
      expect(
        screen.getByText(`1 / ${study.media.images.length}`)
      ).toBeInTheDocument();
    }
  });

  it('mounts the knowledge-graph diagram inside the i3X study panel', async () => {
    const user = userEvent.setup();
    render(<Work />);
    const study = CASE_STUDIES.find(s => s.id === 'i3x-knowledge-graph')!;

    await user.click(cardButton(study.title));

    const card = cardButton(study.title);
    expect(card).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(study.decision)).toBeInTheDocument();
    const panel = document.getElementById(card.getAttribute('aria-controls')!);
    expect(panel).toContainElement(
      screen.getByRole('img', { name: /knowledge graph/i })
    );
  });
});
