import React from 'react';
import ImageCarousel from './common/ImageCarousel';
import profiler1 from '../assets/script-profiler-1.png';
import profiler2 from '../assets/script-profiler-2.png';

const images = [
  { src: profiler1, alt: 'Script Profiler Screenshot 1' },
  { src: profiler2, alt: 'Script Profiler Screenshot 2' },
];

const ScriptProfilerDemo: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white/80 p-5 shadow-md shadow-indigo-500/5 dark:border-gray-800 dark:bg-gray-900/70">
        <h3 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Ignition Java Module
        </h3>
        <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-300">
          A custom Java module for Ignition 8.1 that makes shared script
          execution visible across gateway and client contexts. It surfaces
          per-function timing so developers can find bottlenecks in the scripts
          operators and production workflows depend on.
        </p>
      </div>
      <ImageCarousel images={images} />
    </div>
  );
};

export default ScriptProfilerDemo;
