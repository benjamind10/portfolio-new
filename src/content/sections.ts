/**
 * Single registry of page sections. `App` mounts them in this order,
 * `Navbar` renders the `inNav` entries as links, and `useActiveSection`
 * observes every id to drive the active-link indicator.
 *
 * Order follows design D3 (proof before biography).
 */
export type SectionId =
  'hero' | 'architecture' | 'work' | 'experience' | 'about' | 'contact';

export interface Section {
  id: SectionId;
  label: string;
  inNav: boolean;
}

export const SECTIONS: readonly Section[] = [
  { id: 'hero', label: 'Home', inNav: false },
  { id: 'architecture', label: 'Architecture', inNav: true },
  { id: 'work', label: 'Work', inNav: true },
  { id: 'experience', label: 'Experience', inNav: true },
  { id: 'about', label: 'About', inNav: true },
  { id: 'contact', label: 'Contact', inNav: true },
];

export const SECTION_IDS: readonly SectionId[] = SECTIONS.map(s => s.id);

export const NAV_SECTIONS: readonly Section[] = SECTIONS.filter(s => s.inNav);
