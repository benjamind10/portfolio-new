import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown, Wifi, Activity, GitBranch } from 'lucide-react';
import { arc } from 'd3-shape';
import { PROFILE } from '../content/profile';
import { getLeaves, hasPayload, MQTT_TOPICS, UNS_ROOT } from '../content/uns';

// --- MQTT simulation data ---

type MqttMessage = {
  id: number;
  topic: string;
  state: 'RUNNING' | 'STOPPED' | 'IDLE' | 'ERROR';
  temp: number;
  cycleCount: number;
  ts: string;
};

// RUNNING appears 3x to simulate realistic production frequency
const STATES = [
  'RUNNING',
  'RUNNING',
  'RUNNING',
  'IDLE',
  'STOPPED',
  'ERROR',
] as const;

let msgIdCounter = 0;
const generateMqttMessage = (): MqttMessage => ({
  id: ++msgIdCounter,
  topic: MQTT_TOPICS[Math.floor(Math.random() * MQTT_TOPICS.length)],
  state: STATES[Math.floor(Math.random() * STATES.length)],
  temp: Math.round(60 + Math.random() * 30),
  cycleCount: Math.floor(1000 + Math.random() * 9000),
  ts: new Date().toISOString().slice(11, 19),
});

const stateColor = (s: MqttMessage['state']) =>
  s === 'RUNNING'
    ? 'text-status-running'
    : s === 'ERROR'
      ? 'text-status-error'
      : s === 'STOPPED'
        ? 'text-status-stopped'
        : 'text-status-idle';

// --- OEE data ---
const OEE_NODES = getLeaves(UNS_ROOT).filter(hasPayload);

const METRICS = [
  { key: 'availability', label: 'Avail' },
  { key: 'quality', label: 'Quali' },
  { key: 'performance', label: 'Perfo' },
] as const;

const buildArcPath = (value: number, outerR = 44, innerR = 32): string => {
  const startAngle = -Math.PI * 0.75;
  const endAngle = startAngle + Math.PI * 1.5 * value;
  return (
    arc()({ innerRadius: innerR, outerRadius: outerR, startAngle, endAngle }) ??
    ''
  );
};

const buildTrackPath = (outerR = 44, innerR = 32): string => {
  const startAngle = -Math.PI * 0.75;
  const endAngle = startAngle + Math.PI * 1.5;
  return (
    arc()({ innerRadius: innerR, outerRadius: outerR, startAngle, endAngle }) ??
    ''
  );
};

const oeeFillClass = (v: number) =>
  v >= 0.85
    ? 'fill-gauge-good'
    : v >= 0.75
      ? 'fill-gauge-warn'
      : 'fill-gauge-bad';

// --- Animated background ---
const BG_NODES = [
  { x: 10, y: 15 },
  { x: 30, y: 70 },
  { x: 50, y: 25 },
  { x: 70, y: 80 },
  { x: 85, y: 20 },
  { x: 20, y: 45 },
  { x: 60, y: 55 },
  { x: 90, y: 60 },
  { x: 40, y: 90 },
  { x: 75, y: 40 },
];

const BG_EDGES = [
  [0, 2],
  [2, 4],
  [1, 5],
  [5, 6],
  [6, 3],
  [7, 4],
  [8, 3],
  [9, 6],
  [2, 5],
  [7, 9],
];

const Hero: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const [messages, setMessages] = useState<MqttMessage[]>(() => [
    generateMqttMessage(),
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages(prev => [...prev.slice(-2), generateMqttMessage()]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const [oeeIndex, setOeeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOeeIndex(i => (i + 1) % OEE_NODES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentNode = OEE_NODES[oeeIndex];

  const [unsIndex, setUnsIndex] = useState(2 % OEE_NODES.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setUnsIndex(i => (i + 1) % OEE_NODES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const currentUnsNode = OEE_NODES[unsIndex];
  const pathSegments = currentUnsNode.fullPath.split('/');
  const [firstName, ...restOfName] = PROFILE.name.split(' ');
  const [, site, area] = currentNode.fullPath.split('/');

  return (
    <section
      id="hero"
      className="scroll-mt-24 relative min-h-screen px-6 pt-24 pb-12 flex flex-col md:flex-row items-start justify-between max-w-6xl mx-auto"
    >
      {/* Animated background */}
      {shouldAnimate && (
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <svg
            className="w-full h-full opacity-[0.15] dark:opacity-[0.07]"
            xmlns="http://www.w3.org/2000/svg"
          >
            {BG_EDGES.map(([a, b], i) => (
              <motion.line
                key={i}
                x1={`${BG_NODES[a].x}%`}
                y1={`${BG_NODES[a].y}%`}
                x2={`${BG_NODES[b].x}%`}
                y2={`${BG_NODES[b].y}%`}
                className="stroke-accent-500"
                strokeWidth={1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: i * 0.12, ease: 'easeOut' }}
              />
            ))}
            {BG_NODES.map((node, i) => (
              <motion.circle
                key={i}
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r={3}
                className="fill-accent-500"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                transition={{
                  delay: 0.5 + i * 0.08,
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </svg>
        </div>
      )}

      {/* LEFT: Text */}
      <motion.div
        className="md:w-1/2 text-left"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="text-indigo-500 text-sm font-mono mb-2">Hello! I'm</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
          {firstName}{' '}
          <span className="text-indigo-600 dark:text-indigo-400">
            {restOfName.join(' ')}
          </span>
        </h1>
        <h2 className="text-xl md:text-2xl tracking-tight text-gray-700 dark:text-gray-300 mb-4">
          {PROFILE.headline}
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-md mb-6">
          {PROFILE.pitch}
        </p>
        <div className="flex gap-4">
          <a
            href={PROFILE.cta.primary.href}
            className="px-5 py-2 rounded-md bg-indigo-600 text-white font-semibold text-sm shadow-sm hover:bg-indigo-700 active:scale-95 transition"
          >
            {PROFILE.cta.primary.label}
          </a>
          <a
            href={PROFILE.cta.secondary.href}
            className="px-5 py-2 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white font-semibold text-sm shadow-sm hover:bg-gray-300 dark:hover:bg-gray-700 active:scale-95 transition"
          >
            {PROFILE.cta.secondary.label}
          </a>
        </div>
      </motion.div>

      {/* RIGHT: Dashboard cards column */}
      <motion.div
        className="md:w-1/2 mt-10 md:mt-0 md:pl-10 flex flex-col gap-4 w-full max-w-xs sm:max-w-sm mx-auto md:mx-0"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      >
        {/* MQTT Stream Card */}
        <motion.div
          whileHover={{
            y: -4,
            scale: 1.01,
            transition: { type: 'spring', stiffness: 220, damping: 18 },
          }}
        >
          <div className="bg-white dark:bg-surface-card rounded-xl border border-gray-200 dark:border-gray-600 p-4 font-mono text-xs shadow-lg shadow-indigo-500/10">
            {/* Terminal header */}
            <div className="flex items-center justify-between mb-3 text-gray-500">
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center gap-1.5 text-indigo-400">
                <Wifi size={11} />
                <span>mqtt.stream</span>
              </div>
            </div>
            {/* Message stream */}
            <div className="flex flex-col gap-1.5 h-[120px] overflow-hidden">
              <AnimatePresence initial={false}>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: shouldAnimate ? 0.3 : 0 }}
                    className="flex flex-col gap-0.5"
                  >
                    <span className="text-gray-500">
                      {msg.ts} ·{' '}
                      <span className="text-indigo-600 dark:text-indigo-300">
                        {msg.topic.split('/').slice(-2).join('/')}
                      </span>
                    </span>
                    <span className="pl-2">
                      state:{' '}
                      <span className={stateColor(msg.state)}>{msg.state}</span>
                      <span className="text-gray-500">
                        {' '}
                        · temp:{' '}
                        <span className="text-cyan-400">{msg.temp}°C</span> ·
                        cycles:{' '}
                        <span className="text-gray-700 dark:text-gray-300">
                          {msg.cycleCount}
                        </span>
                      </span>
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* OEE Gauge Card */}
        <motion.div
          className="bg-white dark:bg-surface-card rounded-xl border border-gray-200 dark:border-gray-600 p-4 shadow-lg shadow-indigo-500/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
          whileHover={{
            y: -4,
            scale: 1.01,
            transition: { type: 'spring', stiffness: 220, damping: 18 },
          }}
        >
          {/* Card header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-xs">
              <Activity size={11} />
              <span>oee.live</span>
            </div>
            <span className="text-gray-500 font-mono text-xs">
              {site} / {area}
            </span>
          </div>
          {/* Body: gauge left, metrics right */}
          <div className="flex items-center gap-4">
            {/* SVG arc gauge */}
            <div className="relative flex-shrink-0 w-[96px] h-[96px]">
              <AnimatePresence mode="wait">
                <motion.svg
                  key={currentNode.fullPath}
                  className="absolute inset-0"
                  width={96}
                  height={96}
                  viewBox="-50 -50 100 100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: shouldAnimate ? 0.4 : 0 }}
                >
                  <path
                    d={buildTrackPath()}
                    className="fill-gray-200 dark:fill-gauge-track"
                  />
                  <path
                    d={buildArcPath(currentNode.payload.oee)}
                    className={oeeFillClass(currentNode.payload.oee)}
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={14}
                    fontWeight="bold"
                    className="fill-gray-900 dark:fill-white"
                  >
                    {Math.round(currentNode.payload.oee * 100)}%
                  </text>
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={6}
                    className="fill-gauge-label"
                    y={14}
                  >
                    OEE
                  </text>
                </motion.svg>
              </AnimatePresence>
            </div>
            {/* Metric bar rows */}
            <div className="flex flex-col gap-1.5 font-mono text-xs flex-1">
              {METRICS.map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="text-gray-500">{label}</span>
                  <div className="flex-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-indigo-500"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.round(currentNode.payload[key] * 100)}%`,
                      }}
                      transition={{
                        duration: shouldAnimate ? 0.6 : 0,
                        ease: 'easeOut',
                      }}
                    />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 w-8 text-right">
                    {Math.round(currentNode.payload[key] * 100)}%
                  </span>
                </div>
              ))}
              <div className="mt-1 text-indigo-400 text-[10px] truncate">
                {currentNode.fullPath.split('/').slice(-2).join(' › ')}
              </div>
            </div>
          </div>
        </motion.div>

        {/* UNS Path Card */}
        <motion.div
          className="flex bg-white dark:bg-surface-card rounded-xl border border-gray-200 dark:border-gray-600 p-4 shadow-lg shadow-indigo-500/10 flex-col gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.6 }}
          whileHover={{
            y: -4,
            scale: 1.01,
            transition: { type: 'spring', stiffness: 220, damping: 18 },
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-xs">
            <GitBranch size={11} />
            <span>uns.path</span>
          </div>
          {/* Animated breadcrumb */}
          <div className="relative h-5 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentUnsNode.fullPath}
                className="absolute inset-x-0 flex flex-wrap items-center gap-1 font-mono text-xs"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: shouldAnimate ? 0.35 : 0 }}
              >
                {pathSegments.map((seg, i) => (
                  <React.Fragment key={i}>
                    <span
                      className={
                        i === pathSegments.length - 1
                          ? 'text-indigo-600 dark:text-indigo-300 font-semibold'
                          : 'text-gray-400'
                      }
                    >
                      {seg}
                    </span>
                    {i < pathSegments.length - 1 && (
                      <span className="text-gray-600">/</span>
                    )}
                  </React.Fragment>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          {/* OEE payload preview */}
          <div className="flex gap-3 font-mono text-[10px] text-gray-500 mt-1">
            <span>
              OEE{' '}
              <span className="text-indigo-400">
                {Math.round(currentUnsNode.payload.oee * 100)}%
              </span>
            </span>
            <span>
              Avail{' '}
              <span className="text-gray-700 dark:text-gray-300">
                {Math.round(currentUnsNode.payload.availability * 100)}%
              </span>
            </span>
            <span>
              Qual{' '}
              <span className="text-gray-700 dark:text-gray-300">
                {Math.round(currentUnsNode.payload.quality * 100)}%
              </span>
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500"
        initial={{ opacity: 0 }}
        animate={shouldAnimate ? { opacity: 1, y: [0, 6, 0] } : { opacity: 1 }}
        transition={{
          opacity: { delay: 1.2, duration: 0.6 },
          y: {
            delay: 1.8,
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        <span className="text-xs font-mono tracking-widest uppercase">
          scroll
        </span>
        <ChevronDown size={16} />
      </motion.div>
    </section>
  );
};

export default Hero;
