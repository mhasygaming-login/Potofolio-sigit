import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

interface SectionHeadingProps {
  title: string;
  color: string;
  id?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ title, color, id }) => {
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

  return (
    <div ref={containerRef} className="mb-6">
      <div ref={titleRowRef} className="flex items-center gap-3">
        <svg aria-hidden="true" viewBox="0 0 32 20" className="h-5 w-7 shrink-0" fill="none">
          <path
            d="M11 3L3 10L11 17"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 3L29 10L21 17"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.45"
          />
        </svg>
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
        className="mt-3 h-1 w-14 rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};
