import React from 'react';
import { Download, User } from 'lucide-react';
import profilePic from '../assets/profile_pic.jpg';
import { ABOUT_COPY, PROFILE } from '../content/profile';
import FadeInWrapper from './common/FadeInWrapper';
import SectionHeader from './common/SectionHeader';

const About: React.FC = () => {
  return (
    <section id="about" className="scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <FadeInWrapper>
          <SectionHeader title={ABOUT_COPY.title} />
        </FadeInWrapper>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          {/* Avatar */}
          <FadeInWrapper yOffset={10}>
            <div className="w-36 h-36 rounded-full overflow-hidden shadow-lg shadow-indigo-500/20 border-2 border-indigo-500">
              <img
                src={profilePic}
                alt={PROFILE.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </FadeInWrapper>

          {/* Bio + Skills + Resume */}
          <FadeInWrapper yOffset={20} delay={0.1}>
            <div>
              <div className="flex items-start gap-3 mb-4">
                <User className="text-indigo-500 mt-1 shrink-0" />
                <div className="space-y-4">
                  {PROFILE.bio.map(paragraph => (
                    <p
                      key={paragraph}
                      className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mt-4">
                {PROFILE.skills.map(skill => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-800 text-sm text-indigo-600 dark:text-indigo-100 font-medium hover:scale-105 hover:shadow-sm transition-all duration-200 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Resume: only when the PDF is a known deliverable (D8) */}
              {PROFILE.resume && (
                <a
                  href={PROFILE.resume.href}
                  className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-medium rounded shadow transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                  download
                >
                  <Download size={16} className="mr-2" />
                  {PROFILE.resume.label}
                </a>
              )}
            </div>
          </FadeInWrapper>
        </div>

        {/* Principles */}
        <FadeInWrapper delay={0.15}>
          <h3 className="mt-12 mb-4 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {ABOUT_COPY.principlesHeading}
          </h3>
          <ul className="grid gap-4 sm:grid-cols-2">
            {PROFILE.principles.map(principle => (
              <li
                key={principle.title}
                className="p-5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md shadow-indigo-500/5 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
              >
                <p className="font-semibold text-indigo-600 dark:text-indigo-300">
                  {principle.title}
                </p>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  {principle.evidence}
                </p>
              </li>
            ))}
          </ul>
        </FadeInWrapper>
      </div>
    </section>
  );
};

export default About;
