import React from 'react';
import ImageCarousel from './common/ImageCarousel';
import sim1 from '../assets/uns-sim-1.png';
import sim2 from '../assets/uns-sim-2.png';
import sim3 from '../assets/uns-sim-3.png';
import sim4 from '../assets/uns-sim-4.png';
import sim5 from '../assets/uns-sim-5.png';

const images = [
  { src: sim1, alt: 'UNS Simulator Screenshot 1' },
  { src: sim2, alt: 'UNS Simulator Screenshot 2' },
  { src: sim3, alt: 'UNS Simulator Screenshot 3' },
  { src: sim4, alt: 'UNS Simulator Screenshot 4' },
  { src: sim5, alt: 'UNS Simulator Screenshot 5' },
];

const UNSSimulatorDemo: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white/80 p-5 shadow-md shadow-indigo-500/5 dark:border-gray-800 dark:bg-gray-900/70">
        <h3 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          UNS Simulator
        </h3>
        <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-300">
          A design tool for shaping Unified Namespace topic hierarchies,
          configuring MQTT broker flows, and exercising realistic industrial
          payloads before production deployment. It makes namespace structure
          and schema assumptions easier to validate before they reach the plant
          floor.
        </p>
      </div>
      <ImageCarousel images={images} />
    </div>
  );
};

export default UNSSimulatorDemo;
