// src/components/Experience.tsx
import React from 'react';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeader from './common/SectionHeader';

const jobs = [
  {
    title: 'MES Engineer — Fortune Brands Innovations',
    dates: 'Jan 2025 – Present · Hybrid',
    desc: 'Architecting a production Unified Namespace from early design through multi-facility deployment, connecting MQTT, Ignition, and MES context while using agentic AI to accelerate delivery and automate repeatable manufacturing workflows.',
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
    ],
  },
  {
    title: 'Software Engineer II — Fuuz',
    dates: 'Nov 2024 – Jan 2025 · Remote',
    desc: 'Built MES front-end modules and API integrations for production tracking, scheduling, and operator-facing workflow screens in a manufacturing software platform.',
    tags: ['TypeScript', 'React', 'MES', 'GraphQL APIs'],
  },
  {
    title: 'MI Solutions Specialist I — GPA',
    dates: 'Jan 2024 – Oct 2024 · Hybrid',
    desc: 'Designed MQTT data pipelines and Ignition Perspective views that turned equipment state and line context into real-time monitoring and OEE reporting surfaces.',
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
    title: 'Full Stack Developer — GPA',
    dates: 'Jul 2022 – Jan 2024',
    desc: 'Delivered custom MES applications, Ignition modules, Python and Node.js services, REST APIs, and Dockerized deployments for industrial automation support.',
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

const Experience: React.FC = () => {
  return (
    <section
      id="experience"
      className="scroll-mt-24 bg-gray-50/70 dark:bg-gray-800/30"
    >
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <SectionHeader title="Experience" />

        <div className="p-6 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md shadow-indigo-500/5 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6 text-indigo-500 font-semibold">
            <Briefcase size={20} />
            <span>Work History</span>
          </div>

          <div className="relative border-l border-indigo-500/40 pl-6">
            {jobs.map((job, index) => (
              <motion.div
                key={index}
                className="relative mb-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
              >
                <div className="absolute -left-3 top-1.5 w-3 h-3 bg-indigo-500 rounded-full ring-2 ring-indigo-500/20"></div>
                <div className="ml-4">
                  <h4 className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">
                    {job.title}
                  </h4>
                  <p className="text-sm text-gray-500">{job.dates}</p>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">
                    {job.desc}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-200 dark:border-indigo-700/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
