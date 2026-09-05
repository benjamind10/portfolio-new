import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Architecture from '../../src/components/Architecture';
import {
  AGENTIC_LAYER,
  ARCHITECTURE_COPY,
  TIERS,
} from '../../src/content/architecture';
import { getLeaves, UNS_ROOT } from '../../src/content/uns';

const tierButton = (name: string) =>
  screen.getByRole('button', { name: new RegExp(name) });

describe('Architecture', () => {
  it('selects the broker tier by default and shows only its decision', () => {
    render(<Architecture />);

    const broker = TIERS.find(t => t.id === 'broker')!;
    expect(tierButton(broker.name)).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(broker.decision)).toBeInTheDocument();
    for (const other of TIERS.filter(t => t.id !== 'broker')) {
      expect(screen.queryByText(other.decision)).toBeNull();
    }
  });

  it('renders one aria-pressed button per tier', () => {
    render(<Architecture />);
    for (const tier of TIERS) {
      expect(tierButton(tier.name)).toHaveAttribute(
        'aria-pressed',
        tier.id === 'broker' ? 'true' : 'false'
      );
    }
  });

  it.each(TIERS)(
    "clicking $name shows that tier's decision and no other tier's",
    async tier => {
      const user = userEvent.setup();
      render(<Architecture />);

      await user.click(tierButton(tier.name));

      expect(tierButton(tier.name)).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByText(tier.decision)).toBeInTheDocument();
      expect(screen.getByText(tier.purpose)).toBeInTheDocument();
      expect(screen.getByText(tier.whySeparate)).toBeInTheDocument();
      for (const other of TIERS.filter(t => t.id !== tier.id)) {
        expect(screen.queryByText(other.decision)).toBeNull();
      }
    }
  );

  it('opens the namespace explorer on the broker tier with a real leaf path', async () => {
    const user = userEvent.setup();
    render(<Architecture />);

    // Move away and back so the explorer is proven to follow selection.
    await user.click(tierButton(TIERS[0].name));
    expect(screen.queryByText('schema: valid')).toBeNull();

    const broker = TIERS.find(t => t.id === 'broker')!;
    await user.click(tierButton(broker.name));

    const leafPaths = getLeaves(UNS_ROOT).map(l => l.fullPath);
    const shown = screen.getByText(
      (_, el) =>
        el?.tagName === 'P' && leafPaths.includes(el.textContent ?? '')
    );
    expect(shown).toBeInTheDocument();
    expect(screen.getByText(broker.schemaRule!)).toBeInTheDocument();
    expect(screen.getByText('schema: valid')).toBeInTheDocument();
  });

  it('lets the explorer expand a line and select a different leaf', async () => {
    const user = userEvent.setup();
    render(<Architecture />);

    const leaves = getLeaves(UNS_ROOT);
    const target = leaves[leaves.length - 1];
    const [, , area, line] = target.fullPath.split('/');

    // Area rows start expanded (depth < 3); the line row does not.
    const areaRow = screen.getByRole('button', { name: new RegExp(`^${area}`) });
    expect(areaRow).toHaveAttribute('aria-expanded', 'true');

    // Line names repeat across areas; the target's line is last in tree order.
    const lineRows = screen.getAllByRole('button', {
      name: new RegExp(`^${line}`),
    });
    const collapsed = lineRows.filter(
      row => row.getAttribute('aria-expanded') === 'false'
    );
    await user.click(collapsed[collapsed.length - 1]);

    const leafRows = screen.getAllByRole('button', {
      name: new RegExp(`^${target.name}$`),
    });
    await user.click(leafRows[leafRows.length - 1]);

    expect(screen.getByText(target.fullPath)).toBeInTheDocument();
  });

  it('shows the agentic layer with the tiers each component reads from', async () => {
    const user = userEvent.setup();
    render(<Architecture />);

    await user.click(
      screen.getByRole('button', {
        name: new RegExp(ARCHITECTURE_COPY.agentic.name),
      })
    );

    expect(screen.getByText(ARCHITECTURE_COPY.agentic.summary)).toBeInTheDocument();
    for (const component of AGENTIC_LAYER) {
      expect(screen.getByText(component.purpose)).toBeInTheDocument();
    }
    for (const tier of TIERS) {
      expect(screen.queryByText(tier.decision)).toBeNull();
    }
  });
});
