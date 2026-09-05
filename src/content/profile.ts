/**
 * Who the site is about. The Hero reads `headline`, `pitch`, and the CTAs;
 * later phases add bio, skills, and principles for About, and Contact and
 * Footer read `links`.
 */
export interface Link {
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  /** Positioning line under the name (D1). Not the employer's job title. */
  headline: string;
  pitch: string;
  cta: { primary: Link; secondary: Link };
  links: { github: string; linkedin: string; email: string };
}

export const PROFILE: Profile = {
  name: 'Ben Duran',
  headline:
    'Manufacturing Systems Architect · Unified Namespace, MES, Agentic AI',
  pitch:
    'I design the data models that let manufacturing systems be reasoned about automatically: Unified Namespaces with contracts enforced at the edge, MES context on Ignition, and semantic layers built for machine consumers, so people and AI agents work from one trusted model of the plant.',
  cta: {
    primary: { label: 'View Demos', href: '#demos' },
    secondary: { label: 'Contact', href: '#contact' },
  },
  links: {
    github: 'https://github.com/benjamind10',
    linkedin: 'https://linkedin.com/in/benjamin-duran-3a880a1b9',
    email: 'ben.duran@proton.me',
  },
};
