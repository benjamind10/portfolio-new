import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../src/App';
import { NAV_SECTIONS, SECTIONS } from '../../src/content/sections';

describe('App', () => {
  it('renders the nav and main landmarks', () => {
    render(<App />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('mounts exactly one section per SECTIONS id, in registry order', () => {
    render(<App />);

    const rendered = Array.from(
      document.querySelectorAll<HTMLElement>('main section[id]')
    ).map(el => el.id);

    expect(rendered).toEqual(SECTIONS.map(s => s.id));
    for (const { id } of SECTIONS) {
      expect(document.querySelectorAll(`#${id}`)).toHaveLength(1);
    }
  });

  it('renders one nav anchor per inNav section, plus the logo to #hero', () => {
    render(<App />);

    const nav = screen.getByRole('navigation');
    for (const { id, label } of NAV_SECTIONS) {
      const link = nav.querySelector(`a[href="#${id}"]`);
      expect(link, `nav link for #${id}`).not.toBeNull();
      expect(link).toHaveTextContent(label);
    }
    expect(nav.querySelector('a[href="#hero"]')).toHaveTextContent('BD');
  });
});
