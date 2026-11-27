import React from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { BRAND_COLORS, NETWORK_BRAND_COLORS } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

const SEGMENT_RANGES: [number, number][] = [
  [0, 0.25],
  [0.25, 0.5],
  [0.5, 0.75],
  [0.75, 1],
];

export const ScrollProgressBar: React.FC = () => {
  const { isNetworkMode } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 320,
    damping: 34,
    restDelta: 0.0005,
  });

  const activeProgress = shouldReduceMotion ? scrollYProgress : smoothProgress;
  const palette = isNetworkMode ? NETWORK_BRAND_COLORS : BRAND_COLORS;

  const seg0 = useTransform(activeProgress, SEGMENT_RANGES[0], [0, 1], { clamp: true });
  const seg1 = useTransform(activeProgress, SEGMENT_RANGES[1], [0, 1], { clamp: true });
  const seg2 = useTransform(activeProgress, SEGMENT_RANGES[2], [0, 1], { clamp: true });
  const seg3 = useTransform(activeProgress, SEGMENT_RANGES[3], [0, 1], { clamp: true });

  const segmentScales = [seg0, seg1, seg2, seg3];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 top-0 z-[60] grid h-[3px] grid-cols-4 overflow-hidden bg-[var(--line)]/40"
    >
      {palette.map((color, idx) => (
        <div key={`${idx}-${color}`} className="relative h-full w-full overflow-hidden">
          {/* Jejak warna samar saat diam di atas */}
          <div
            className="absolute inset-0 opacity-20 transition-colors duration-300"
            style={{ backgroundColor: color }}
          />
          {/* Segmen aktif terisi berurutan satu per satu dari kiri ke kanan */}
          <motion.div
            className="relative h-full w-full origin-left will-change-transform transition-colors duration-300"
            style={{
              backgroundColor: color,
              scaleX: segmentScales[idx],
            }}
          />
        </div>
      ))}
    </div>
  );
};
