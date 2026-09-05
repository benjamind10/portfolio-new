import React, { useState } from 'react';
import UNSSimulatorDemo from './UNSSimulatorDemo';
import ScriptProfilerDemo from './ScriptProfilerDemo';
import SectionHeader from './common/SectionHeader';

const TABS = [
  { key: 'uns-sim', label: 'UNS Simulator', component: <UNSSimulatorDemo /> },
  {
    key: 'profiler',
    label: 'Ignition Java Module',
    component: <ScriptProfilerDemo />,
  },
];

const Demos: React.FC = () => {
  const [activeTab, setActiveTab] = useState('uns-sim');

  const active = TABS.find(tab => tab.key === activeTab)?.component;

  return (
    <section
      id="demos"
      className="scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <SectionHeader title="Projects" />

        {/* Tab headers */}
        <div className="flex space-x-4 mb-6">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded font-medium text-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 transition-all ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 border border-transparent hover:border-indigo-500/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active demo component */}
        <div>{active}</div>
      </div>
    </section>
  );
};

export default Demos;
