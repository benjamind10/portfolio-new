import React from 'react';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { EXPERIENCE_COPY, JOBS, SEATS, type Seat } from '../content/experience';
import SectionHeader from './common/SectionHeader';
import FadeInWrapper from './common/FadeInWrapper';

const SEAT_ORDER: readonly Seat[] = ['integrator', 'vendor', 'manufacturer'];

const Experience: React.FC = () => {
  return (
    <section
      id="experience"
      className="scroll-mt-24 bg-gray-50/70 dark:bg-gray-800/30"
    >
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <FadeInWrapper>
          <SectionHeader
            title={EXPERIENCE_COPY.title}
            subtitle={EXPERIENCE_COPY.subtitle}
          />
        </FadeInWrapper>

        {/* The three seats, in the order they were held */}
        <FadeInWrapper delay={0.1}>
          <ul className="grid gap-4 sm:grid-cols-3 mb-8">
            {SEAT_ORDER.map(seat => (
              <li
                key={seat}
                className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-700/40 bg-white dark:bg-gray-900 shadow-md shadow-indigo-500/5"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                  {SEATS[seat].label}
                </p>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {SEATS[seat].lesson}
                </p>
              </li>
            ))}
          </ul>
        </FadeInWrapper>

        <div className="p-6 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md shadow-indigo-500/5 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6 text-indigo-500 font-semibold">
            <Briefcase size={20} />
            <span>{EXPERIENCE_COPY.timelineLabel}</span>
          </div>

          <div className="relative border-l border-indigo-500/40 pl-6">
            {JOBS.map((job, index) => (
              <motion.div
                key={job.id}
                className="relative mb-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: 'easeOut',
                }}
              >
                <div className="absolute -left-3 top-1.5 w-3 h-3 bg-indigo-500 rounded-full ring-2 ring-indigo-500/20"></div>
                <div className="ml-4">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h4 className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">
                      {job.title} — {job.org}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border border-indigo-500/40 text-indigo-600 dark:text-indigo-300">
                      {SEATS[job.seat].label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {job.mode ? `${job.dates} · ${job.mode}` : job.dates}
                  </p>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">
                    {job.summary}
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
