import React from 'react';
import { User } from 'lucide-react';
import profilePic from '../assets/profile_pic.jpg';
import FadeInWrapper from './common/FadeInWrapper';
import SectionHeader from './common/SectionHeader';

const About: React.FC = () => {
  return (
    <section
      id="about"
      className="scroll-mt-24 bg-gray-50/70 dark:bg-gray-800/30"
    >
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        {/* Section Title */}
        <FadeInWrapper>
          <SectionHeader title="About Me" />
        </FadeInWrapper>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          {/* Avatar */}
          <FadeInWrapper yOffset={10}>
            <div className="w-36 h-36 rounded-full overflow-hidden shadow-lg shadow-indigo-500/20 border-2 border-indigo-500">
              <img
                src={profilePic}
                alt="Ben Duran"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </FadeInWrapper>

          {/* Bio + Skills + Resume */}
          <FadeInWrapper yOffset={20} delay={0.1}>
            <div>
              <div className="flex items-start gap-3 mb-4">
                <User className="text-indigo-500 mt-1" />
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  I work on the systems layer where plant-floor signals become
                  useful manufacturing context: UNS topic structures, MQTT flows,
                  Ignition projects, MES workflows, and the analytics that make
                  OEE and equipment state visible. I also use agentic AI as part
                  of that engineering workflow, helping accelerate code,
                  automation, and process orchestration without losing the
                  practical constraints of production systems.
                </p>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mt-4">
                {[
                  'UNS Architecture',
                  'MQTT / Sparkplug B',
                  'Ignition Platform',
                  'Agentic AI',
                  'Python',
                  'TypeScript',
                  'Java',
                  'React',
                  'SQL',
                ].map(skill => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-800 text-sm text-indigo-600 dark:text-indigo-100 font-medium hover:scale-105 hover:shadow-sm transition-all duration-200 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Resume Button */}
              {/* <a
                href="/resume.pdf"
                className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-medium rounded shadow transition"
                download
              >
                <Download size={16} className="mr-2" />
                Download Resume
              </a> */}
            </div>
          </FadeInWrapper>
        </div>
      </div>
    </section>
  );
};

export default About;
