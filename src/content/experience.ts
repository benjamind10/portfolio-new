/**
 * The work history the Experience section renders, told as the three-seat
 * arc (design summary): integrator, vendor, manufacturer. Titles are the
 * employers' titles of record, not positioning (design D1). Names employers,
 * technologies, and counts; never a plant, site code, host, database, or
 * person (design D2).
 */
export type Seat = 'integrator' | 'vendor' | 'manufacturer';

export interface SeatInfo {
  label: string;
  /** What that seat taught, in one sentence. */
  lesson: string;
}

export interface Job {
  id: string;
  /** Employer's title of record. */
  title: string;
  org: string;
  dates: string;
  /** Hybrid / Remote; omitted when on site. */
  mode?: string;
  summary: string;
  seat: Seat;
  tags: readonly string[];
}

export interface ExperienceCopy {
  title: string;
  /** The arc intro rendered under the section title. */
  subtitle: string;
  timelineLabel: string;
}

export const EXPERIENCE_COPY: ExperienceCopy = {
  title: 'Experience',
  subtitle:
    'Three seats on the same problem. As an integrator I delivered into other people\u2019s plants, as a vendor I built the MES platform plants adopt, and as a manufacturer I own the namespace end to end. Each seat shaped how the next one was done.',
  timelineLabel: 'Work History',
};

export const SEATS: Record<Seat, SeatInfo> = {
  integrator: {
    label: 'Integrator',
    lesson:
      'Every solution has to survive a customer\u2019s constraints, not just the lab: their network, their tag names, their operators.',
  },
  vendor: {
    label: 'Vendor',
    lesson:
      'A platform\u2019s data model either serves the plant that adopts it or fights it, and the fight shows up as workarounds in the field.',
  },
  manufacturer: {
    label: 'Manufacturer',
    lesson:
      'Owning the systems for the long run means owning the namespace, the contracts, and the discipline to remove your own workarounds.',
  },
};

export const JOBS: readonly Job[] = [
  {
    id: 'fbin-software-engineer',
    title: 'Software Engineer',
    org: 'Fortune Brands Innovations',
    dates: 'Jan 2025 \u2013 Present',
    mode: 'Hybrid',
    summary:
      'Architecting a production Unified Namespace from early design through multi-facility deployment, connecting MQTT, Ignition, and MES context while using agentic AI to accelerate delivery and automate repeatable manufacturing workflows.',
    seat: 'manufacturer',
    tags: [
      'UNS',
      'MQTT',
      'Ignition',
      'Agentic AI',
      'Python',
      'TypeScript',
      'React',
      'PostgreSQL',
      'MES',
      'TimescaleDB',
    ],
  },
  {
    id: 'fuuz-software-engineer',
    title: 'Software Engineer II',
    org: 'Fuuz',
    dates: 'Nov 2024 \u2013 Jan 2025',
    mode: 'Remote',
    summary:
      'Built MES front-end modules and API integrations for production tracking, scheduling, and operator-facing workflow screens in a manufacturing software platform.',
    seat: 'vendor',
    tags: ['TypeScript', 'React', 'MES', 'GraphQL APIs'],
  },
  {
    id: 'gpa-mi-solutions-specialist',
    title: 'MI Solutions Specialist I',
    org: 'GPA',
    dates: 'Jan 2024 \u2013 Oct 2024',
    mode: 'Hybrid',
    summary:
      'Designed MQTT data pipelines and Ignition Perspective views that turned equipment state and line context into real-time monitoring and OEE reporting surfaces.',
    seat: 'integrator',
    tags: [
      'Ignition',
      'MQTT',
      'UNS',
      'Python',
      'SQL Server',
      'OPC-UA',
      'Node.js',
    ],
  },
  {
    id: 'gpa-full-stack-developer',
    title: 'Full Stack Developer',
    org: 'GPA',
    dates: 'Jul 2022 \u2013 Jan 2024',
    summary:
      'Delivered custom MES applications, Ignition modules, Python and Node.js services, REST APIs, and Dockerized deployments for industrial automation support.',
    seat: 'integrator',
    tags: [
      'Python',
      'Node.js',
      'Ignition',
      'SQL',
      'MES',
      'REST APIs',
      'Docker',
    ],
  },
];
