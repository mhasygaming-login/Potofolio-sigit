import React from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { BRAND_COLORS } from '../data/portfolioData';

const GOOGLE_SEGMENTS = BRAND_COLORS.map((color, idx) => ({
  color,
  range: [idx * 0.25, (idx + 1) * 0.25] as [number, number],
}));

export const ScrollProgressBar: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 320,
    damping: 34,
    restDelta: 0.0005,
  });

  const activeProgress = shouldReduceMotion ? scrollYProgress : smoothProgress;

  const blueScale = useTransform(activeProgress, GOOGLE_SEGMENTS[0].range, [0, 1], { clamp: true });
  const redScale = useTransform(activeProgress, GOOGLE_SEGMENTS[1].range, [0, 1], { clamp: true });
  const yellowScale = useTransform(activeProgress, GOOGLE_SEGMENTS[2].range, [0, 1], { clamp: true });
  const greenScale = useTransform(activeProgress, GOOGLE_SEGMENTS[3].range, [0, 1], { clamp: true });

  const segmentScales = [blueScale, redScale, yellowScale, greenScale];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 top-0 z-[60] grid h-[3px] grid-cols-4 overflow-hidden bg-[var(--line)]/40"
    >
      {GOOGLE_SEGMENTS.map((segment, idx) => (
        <div key={segment.color} className="relative h-full w-full overflow-hidden">
          {/* Jejak warna samar saat diam di atas */}
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundColor: segment.color }}
          />
          {/* Segmen aktif terisi berurutan satu per satu dari kiri ke kanan */}
          <motion.div
            className="relative h-full w-full origin-left will-change-transform"
            style={{
              backgroundColor: segment.color,
              scaleX: segmentScales[idx],
            }}
          />
        </div>
      ))}
    </div>
  );
};
