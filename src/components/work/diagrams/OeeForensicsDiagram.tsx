import React from 'react';

const STROKE_CLASS = 'stroke-gray-300 dark:stroke-gray-600';
const TEXT_CLASS = 'fill-gray-600 dark:fill-gray-300';
const MONO_CLASS = 'font-mono text-[9px] fill-gray-500 dark:fill-gray-400';

/**
 * Before/after timeline of the timestamp inversion: an event whose end
 * timestamp fell before its start produced a negative duration and an
 * availability above 100 %; after the binding fix the event reads forwards.
 */
const OeeForensicsDiagram: React.FC = () => (
  <svg
    viewBox="0 0 320 96"
    className="w-full max-w-md h-auto"
    role="img"
    aria-label="Before the fix an event's end timestamp preceded its start, giving a negative duration and availability above 100 percent; after the fix the event runs forwards and availability is bounded"
  >
    {/* Before */}
    <text x="0" y="14" className={`text-[10px] font-semibold ${TEXT_CLASS}`}>
      Before
    </text>
    <line
      x1="60"
      y1="20"
      x2="300"
      y2="20"
      className={STROKE_CLASS}
      strokeWidth="1"
    />
    <rect
      x="90"
      y="14"
      width="110"
      height="12"
      rx="2"
      className="fill-status-error opacity-80"
    />
    <text x="200" y="38" textAnchor="middle" className={MONO_CLASS}>
      start
    </text>
    <text x="90" y="38" textAnchor="middle" className={MONO_CLASS}>
      end
    </text>
    <text x="60" y="52" className={`text-[9px] ${TEXT_CLASS}`}>
      end &lt; start · duration &lt; 0 · availability &gt; 100 %
    </text>

    {/* After */}
    <text x="0" y="72" className={`text-[10px] font-semibold ${TEXT_CLASS}`}>
      After
    </text>
    <line
      x1="60"
      y1="78"
      x2="300"
      y2="78"
      className={STROKE_CLASS}
      strokeWidth="1"
    />
    <rect
      x="90"
      y="72"
      width="110"
      height="12"
      rx="2"
      className="fill-status-running opacity-80"
    />
    <text x="90" y="94" textAnchor="middle" className={MONO_CLASS}>
      start
    </text>
    <text x="200" y="94" textAnchor="middle" className={MONO_CLASS}>
      end
    </text>
    <text x="215" y="82" className={`text-[9px] ${TEXT_CLASS}`}>
      availability ≤ 100 %
    </text>
  </svg>
);

export default OeeForensicsDiagram;
