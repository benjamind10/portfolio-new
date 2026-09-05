import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageCarousel from '../../src/components/common/ImageCarousel';

const images = [
  { src: 'one.png', alt: 'Shot 1' },
  { src: 'two.png', alt: 'Shot 2' },
];

describe('ImageCarousel lightbox', () => {
  it('opens as a modal dialog focused on the close button and returns focus on Escape', async () => {
    const user = userEvent.setup();
    render(<ImageCarousel images={images} label="Test gallery" />);

    expect(screen.queryByRole('dialog')).toBeNull();

    const opener = screen.getByRole('button', {
      name: /open shot 1 full size/i,
    });
    await user.click(opener);

    const dialog = screen.getByRole('dialog', { name: 'Test gallery' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    const close = within(dialog).getByRole('button', { name: 'Close' });
    expect(document.activeElement).toBe(close);

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it('keeps Tab and Shift+Tab inside the dialog', async () => {
    const user = userEvent.setup();
    render(<ImageCarousel images={images} label="Test gallery" />);

    await user.click(
      screen.getByRole('button', { name: /open shot 1 full size/i })
    );
    const dialog = screen.getByRole('dialog');
    const close = within(dialog).getByRole('button', { name: 'Close' });
    const next = within(dialog).getByRole('button', { name: 'Next image' });

    expect(document.activeElement).toBe(close);
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(next);
    await user.tab();
    expect(document.activeElement).toBe(close);
    await user.tab();
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  it('closes from the close button and returns focus', async () => {
    const user = userEvent.setup();
    render(<ImageCarousel images={images} label="Test gallery" />);

    const opener = screen.getByRole('button', {
      name: /open shot 1 full size/i,
    });
    await user.click(opener);
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Close' })
    );

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(opener);
  });

  it('steps through images and reports the position', async () => {
    const user = userEvent.setup();
    render(<ImageCarousel images={images} label="Test gallery" />);

    expect(screen.getByText('1 / 2')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next image' }));
    expect(await screen.findByAltText('Shot 2')).toBeInTheDocument();
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
  });
});
