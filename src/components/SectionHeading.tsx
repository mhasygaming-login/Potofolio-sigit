import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Network, RadioTower, Trophy, UserRound, Workflow } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

export type SectionKey = 'tentang' | 'keahlian' | 'project' | 'pencapaian' | 'kontak';

type LucideIconComponent = React.ComponentType<{
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}>;

const NETWORK_SECTION_ICON_MAP: Record<SectionKey, LucideIconComponent> = {
  tentang: UserRound,
  keahlian: Network,
  project: Workflow,
  pencapaian: Trophy,
  kontak: RadioTower,
};

interface SectionHeadingProps {
  title: string;
  color: string;
  sectionKey: SectionKey;
  id?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  color,
  sectionKey,
  id,
}) => {
  const { mode } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRowRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = Boolean(useReducedMotion());

  useEffect(() => {
    if (shouldReduceMotion || !containerRef.current || !titleRowRef.current || !barRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(titleRowRef.current, { opacity: 0, y: 48 });
      gsap.set(barRef.current, { scaleX: 0, opacity: 0, transformOrigin: 'left center' });

      let hasPlayed = false;
      const playReveal = () => {
        if (hasPlayed) return;
        hasPlayed = true;

        const tl = gsap.timeline();
        tl.to(titleRowRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.15,
          ease: 'expo.out',
          clearProps: 'transform,opacity',
        }).to(
          barRef.current,
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.9,
            ease: 'expo.out',
            clearProps: 'transform,opacity',
          },
          '-=0.8'
        );
      };

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 82%',
        onEnter: playReveal,
        onEnterBack: playReveal,
        onRefresh: (st) => {
          if (st.progress > 0) playReveal();
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [shouldReduceMotion]);

  const NetworkIcon = NETWORK_SECTION_ICON_MAP[sectionKey];

  return (
    <div ref={containerRef} className="mb-6">
      <div ref={titleRowRef} className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="relative grid h-5 w-7 shrink-0 place-items-center"
        >
          <AnimatePresence mode="wait" initial={false}>
            {mode === 'network' ? (
              <motion.span
                key="network-icon"
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.84 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.84 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
                }
                className="grid place-items-center"
              >
                <NetworkIcon
                  className="h-5 w-5 text-[#37DFFF]"
                  strokeWidth={2.2}
                  style={{ filter: 'drop-shadow(0 0 6px rgba(55, 223, 255, 0.34))' }}
                />
              </motion.span>
            ) : (
              <motion.svg
                key="gdg-icon"
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.84 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.84 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
                }
                viewBox="0 0 32 20"
                className="h-5 w-7"
                fill="none"
              >
                <path
                  d="M11 3L3 10L11 17"
                  stroke={color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-[stroke] duration-300"
                />
                <path
                  d="M21 3L29 10L21 17"
                  stroke={color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.45"
                  className="transition-[stroke] duration-300"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </span>
        <h2
          id={id}
          className="text-3xl font-extrabold tracking-[-0.025em] text-[var(--text)] sm:text-4xl"
        >
          {title}
        </h2>
      </div>
      <div
        ref={barRef}
        aria-hidden="true"
        className="mt-3 h-1 w-14 rounded-full transition-colors duration-300"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};
