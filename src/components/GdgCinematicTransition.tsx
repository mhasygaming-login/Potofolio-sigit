import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from 'motion/react';
import { BRAND_COLORS, PROFILE } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

const TITLE_WORDS = ['GDG', 'Bogor'] as const;

export const GdgCinematicTransition: React.FC = () => {
  const { mode, gdgTransitionId, dismissGdgTransition } = useTheme();
  const shouldReduceMotion = Boolean(useReducedMotion());
  const overlayRef = useRef<HTMLDivElement>(null);

  const isActive = mode === 'gdg' && gdgTransitionId > 0 && !shouldReduceMotion;

  useEffect(() => {
    if (!isActive || !overlayRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismissGdgTransition();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const ctx = gsap.context(() => {
      const root = overlayRef.current;
      if (!root) return;

      const strokePaths = root.querySelectorAll<SVGGeometryElement>('[data-gdg-stroke]');
      strokePaths.forEach((path) => {
        const length = typeof path.getTotalLength === 'function' ? path.getTotalLength() : 220;
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 1,
        });
      });

      const watermarkText = root.querySelectorAll<SVGTextElement>('[data-gdg-watermark]');
      gsap.set(watermarkText, {
        strokeDasharray: 480,
        strokeDashoffset: 480,
        opacity: 0,
      });

      const geoDots = root.querySelectorAll<SVGCircleElement>('[data-gdg-dot]');
      gsap.set(geoDots, { scale: 0, transformOrigin: 'center center', opacity: 0 });

      const maskWrap = root.querySelector<HTMLElement>('[data-gdg-mask]');
      if (maskWrap) {
        gsap.set(maskWrap, { clipPath: 'inset(0% 0% 100% 0%)' });
      }

      const chars = root.querySelectorAll<HTMLElement>('[data-gdg-char]');
      gsap.set(chars, {
        yPercent: 110,
        opacity: 0,
        scale: 0.92,
      });

      const bars = root.querySelectorAll<HTMLElement>('[data-gdg-bar]');
      gsap.set(bars, { scaleX: 0, transformOrigin: 'left center' });

      const subtitle = root.querySelector<HTMLElement>('[data-gdg-subtitle]');
      if (subtitle) {
        gsap.set(subtitle, { opacity: 0, y: 12 });
      }

      const tl = gsap.timeline({
        onComplete: () => {
          dismissGdgTransition();
        },
      });

      // Phase 1 — Opening (0.0–0.6s): overlay appears
      tl.fromTo(
        root,
        { opacity: 0 },
        { opacity: 1, duration: 0.45, ease: 'power2.out' },
        0
      )
        .to(
          watermarkText,
          {
            strokeDashoffset: 0,
            opacity: 0.14,
            duration: 1.45,
            ease: 'power2.out',
          },
          0.18
        )
        // Phase 2 — Typography Reveal (0.6–1.5s): strokes & letters form
        .to(
          strokePaths,
          {
            strokeDashoffset: 0,
            duration: 1.05,
            stagger: 0.09,
            ease: 'power3.out',
          },
          0.52
        );

      if (maskWrap) {
        tl.to(
          maskWrap,
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.72,
            ease: 'power3.out',
          },
          0.62
        );
      }

      tl.to(
        chars,
        {
          yPercent: 0,
          opacity: 1,
          scale: 1,
          duration: 0.82,
          stagger: 0.065,
          ease: 'expo.out',
        },
        0.66
      )
        // Phase 3 — Brand Reveal (1.5–3.2s): GDG BOGOR fully visible
        .to(
          geoDots,
          {
            scale: 1,
            opacity: 1,
            duration: 0.46,
            stagger: 0.07,
            ease: 'back.out(2)',
          },
          1.42
        )
        .to(
          bars,
          {
            scaleX: 1,
            duration: 0.65,
            stagger: 0.08,
            ease: 'power3.out',
          },
          1.52
        );

      if (subtitle) {
        tl.to(
          subtitle,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power2.out',
          },
          1.78
        );
      }

      // Phase 4 — Exit (3.2–4.2s): transition overlay clears out smoothly
      tl.to(
        root,
        {
          clipPath: 'inset(0% 0% 100% 0%)',
          opacity: 0,
          duration: 0.94,
          ease: 'power3.inOut',
        },
        3.26
      );
    }, overlayRef);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      ctx.revert();
    };
  }, [dismissGdgTransition, gdgTransitionId, isActive]);

  if (!isActive) return null;

  return (
    <div
      ref={overlayRef}
      key={gdgTransitionId}
      role="status"
      aria-live="polite"
      aria-label="Transisi menuju pengalaman visual GDG Bogor"
      onClick={dismissGdgTransition}
      className="fixed inset-0 z-[70] flex cursor-pointer items-center justify-center overflow-hidden bg-[var(--bg)] px-6 text-[var(--text)] select-none"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      {/* Code-generated geometric grid & SVG stroke watermark */}
      <div aria-hidden="true" className="dot-grid-canvas pointer-events-none absolute inset-0 opacity-80" />

      <svg
        aria-hidden="true"
        viewBox="0 0 960 420"
        className="pointer-events-none absolute h-auto w-[min(980px,96vw)] overflow-visible"
        fill="none"
      >
        {/* Programmatic SVG outline watermark behind main title */}
        <text
          data-gdg-watermark
          x="480"
          y="238"
          textAnchor="middle"
          fill="none"
          stroke="var(--text)"
          strokeWidth="1.35"
          className="font-sans text-[128px] font-extrabold tracking-[-0.04em] sm:text-[156px]"
        >
          GDG BOGOR
        </text>

        {/* Geometric concentric framing arc strokes */}
        <path
          data-gdg-stroke
          d="M 210 118 A 295 295 0 0 1 750 118"
          stroke={BRAND_COLORS[0]}
          strokeWidth="1.5"
          strokeOpacity="0.32"
          strokeLinecap="round"
        />
        <path
          data-gdg-stroke
          d="M 750 302 A 295 295 0 0 1 210 302"
          stroke={BRAND_COLORS[3]}
          strokeWidth="1.5"
          strokeOpacity="0.32"
          strokeLinecap="round"
        />

        {/* Four-color GDG < > bracket strokes */}
        <path
          data-gdg-stroke
          d="M 134 114 L 58 210"
          stroke={BRAND_COLORS[0]}
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          data-gdg-stroke
          d="M 58 210 L 134 306"
          stroke={BRAND_COLORS[1]}
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          data-gdg-stroke
          d="M 826 114 L 902 210"
          stroke={BRAND_COLORS[2]}
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          data-gdg-stroke
          d="M 902 210 L 826 306"
          stroke={BRAND_COLORS[3]}
          strokeWidth="16"
          strokeLinecap="round"
        />

        {/* Geometric accent nodes */}
        <circle data-gdg-dot cx="176" cy="96" r="5" fill={BRAND_COLORS[0]} />
        <circle data-gdg-dot cx="784" cy="96" r="5" fill={BRAND_COLORS[2]} />
        <circle data-gdg-dot cx="176" cy="324" r="5" fill={BRAND_COLORS[1]} />
        <circle data-gdg-dot cx="784" cy="324" r="5" fill={BRAND_COLORS[3]} />
      </svg>

      {/* Sharp accessible HTML typography reveal */}
      <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
        <div data-gdg-mask className="overflow-hidden py-1">
          <h2
            aria-label="GDG Bogor"
            className="flex flex-wrap items-baseline justify-center gap-x-4 text-4xl font-extrabold leading-none tracking-[-0.04em] text-[var(--text)] sm:gap-x-6 sm:text-6xl md:text-7xl"
          >
            {TITLE_WORDS.map((word, wordIdx) => (
              <span key={word} aria-hidden="true" className="inline-flex">
                {word.split('').map((char, charIdx) => (
                  <span
                    key={`${word}-${charIdx}`}
                    data-gdg-char
                    className={`inline-block will-change-transform ${
                      wordIdx === 0 ? 'text-[var(--text)]' : 'text-[var(--action)]'
                    }`}
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h2>
        </div>

        {/* Animated 4-color accent ribbon */}
        <div
          aria-hidden="true"
          className="mt-5 grid h-1 w-48 grid-cols-4 gap-1 overflow-hidden rounded-full sm:w-64"
        >
          {BRAND_COLORS.map((color) => (
            <span
              key={color}
              data-gdg-bar
              className="block h-full w-full rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <p
          data-gdg-subtitle
          className="mt-4 font-mono text-xs font-medium tracking-wide text-[var(--muted)] sm:text-sm"
        >
          {PROFILE.name} · GDG Bogor Mode
        </p>
      </div>
    </div>
  );
};
