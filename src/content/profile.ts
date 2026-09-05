/**
 * Who the site is about. The Hero reads `headline`, `pitch`, and the CTAs;
 * About reads `bio`, `skills`, `principles`, and the optional `resume`;
 * Contact and Footer read `links`. Names technologies and counts; never a
 * plant, site code, host, database, or person (design D2).
 */
export interface Link {
  label: string;
  href: string;
}

export interface Principle {
  title: string;
  /** The piece of work that backs the principle, in one sentence. */
  evidence: string;
}

export interface Resume {
  /** Served from `public/resume.pdf`; the profile test checks the file exists. */
  href: '/resume.pdf';
  label: string;
}

export interface AboutCopy {
  title: string;
  principlesHeading: string;
}

export interface ContactCopy {
  title: string;
  subtitle: string;
  infoHeading: string;
  connectHeading: string;
  /** Rendered in place of the form when the EmailJS keys are absent (D8). */
  mailto: { lead: string; label: string };
}

export interface Profile {
  name: string;
  /** Positioning line under the name (D1). Not the employer's job title. */
  headline: string;
  pitch: string;
  cta: { primary: Link; secondary: Link };
  /** Canonical social links; Contact and Footer render only these. */
  links: {
    github: string;
    linkedin: string;
    email: string;
    /** Region only, never a plant or site (D2). */
    location?: string;
  };
  /** About paragraphs, in order. */
  bio: readonly string[];
  skills: readonly string[];
  /** The four operating principles from the design, each tied to evidence. */
  principles: readonly Principle[];
  /** Set only when `public/resume.pdf` is present (design D8). */
  resume?: Resume;
}

export const ABOUT_COPY: AboutCopy = {
  title: 'About Me',
  principlesHeading: 'Operating principles',
};

export const CONTACT_COPY: ContactCopy = {
  title: 'Get In Touch',
  subtitle:
    "Have a plant-floor data, Ignition, or MES challenge worth talking through? Let's connect.",
  infoHeading: 'Contact Information',
  connectHeading: 'Connect with me',
  mailto: {
    lead: 'The quickest way to reach me is email. I read every message and reply within a couple of days.',
    label: 'Email me',
  },
};

export const PROFILE: Profile = {
  name: 'Ben Duran',
  headline:
    'Manufacturing Systems Architect · Unified Namespace, MES, Agentic AI',
  pitch:
    'I design the data models that let manufacturing systems be reasoned about automatically: Unified Namespaces with contracts enforced at the edge, MES context on Ignition, and semantic layers built for machine consumers, so people and AI agents work from one trusted model of the plant.',
  cta: {
    primary: { label: 'Explore the Architecture', href: '#architecture' },
    secondary: { label: 'Contact', href: '#contact' },
  },
  links: {
    github: 'https://github.com/benjamind10',
    linkedin: 'https://linkedin.com/in/benjamin-duran-3a880a1b9',
    email: 'ben.duran@proton.me',
    location: 'Richmond, VA',
  },
  bio: [
    'I work on the systems layer where plant-floor signals become useful manufacturing context: UNS topic structures, MQTT flows, Ignition projects, MES workflows, and the analytics that make OEE and equipment state visible. I also use agentic AI as part of that engineering workflow, helping accelerate code, automation, and process orchestration without losing the practical constraints of production systems.',
    'The through-line is architecture: deciding where a contract is enforced, which tier owns which context, and what a downstream consumer, human or agent, can trust without asking. The principles below are the ones that work has held me to.',
  ],
  skills: [
    'UNS Architecture',
    'MQTT / Sparkplug B',
    'Ignition Platform',
    'Agentic AI',
    'Python',
    'TypeScript',
    'Java',
    'React',
    'SQL',
  ],
  principles: [
    {
      title: 'Enforce contracts at the edge',
      evidence:
        'Schema-validated broker rules reject a malformed payload before it reaches MES, historian, or warehouse, so every tier downstream reads one shape.',
    },
    {
      title: 'Design for non-human consumers',
      evidence:
        'A semantic layer of 11 instances and 47 concepts each exists so agents and services can query the plant model without a person translating for them.',
    },
    {
      title: 'Remove your own workarounds',
      evidence:
        'The OEE forensics work unblocked 25 event schemes by fixing three root causes in the model instead of layering another patch on the symptoms.',
    },
    {
      title: 'Persist every decision',
      evidence:
        'Ticket, research, plan, execute, verify: each step leaves a written artifact, so a decision can be audited later by someone, or something, that was not in the room.',
    },
  ],
};
