import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

const TITLE_CHARS = ['N', 'E', 'T', 'W', 'O', 'R', 'K'] as const;
const DECODE_GLYPHS = '01X7A9F4K2N8R';

interface NetworkNodeSpec {
  id: string;
  x: number;
  y: number;
  r: number;
  phase: 'boot' | 'activation';
  mobileVisible: boolean;
}

interface NetworkLinkSpec {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  tone: 'blue' | 'cyan';
  mobileVisible: boolean;
}

interface NetworkPulseSpec {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
  mobileVisible: boolean;
}

const HUB_X = 480;
const HUB_Y = 230;

// 7 outer nodes + 1 central hub echoing NetworkCoreEmblem's navy/cyan/ice-white visual language
const NETWORK_NODES: NetworkNodeSpec[] = [
  { id: 'n-nw', x: 184, y: 112, r: 5.5, phase: 'boot', mobileVisible: true },
  { id: 'n-ne', x: 776, y: 112, r: 5.5, phase: 'boot', mobileVisible: true },
  { id: 'n-sw', x: 204, y: 348, r: 5.5, phase: 'boot', mobileVisible: true },
  { id: 'n-se', x: 756, y: 348, r: 5.5, phase: 'activation', mobileVisible: true },
  { id: 'n-top', x: 480, y: 74, r: 4.8, phase: 'activation', mobileVisible: false },
  { id: 'n-w', x: 96, y: 230, r: 4.8, phase: 'activation', mobileVisible: false },
  { id: 'n-e', x: 864, y: 230, r: 4.8, phase: 'activation', mobileVisible: false },
];

const NETWORK_LINKS: NetworkLinkSpec[] = [
  { id: 'l-hub-nw', x1: HUB_X, y1: HUB_Y, x2: 184, y2: 112, tone: 'blue', mobileVisible: true },
  { id: 'l-hub-ne', x1: HUB_X, y1: HUB_Y, x2: 776, y2: 112, tone: 'blue', mobileVisible: true },
  { id: 'l-hub-sw', x1: HUB_X, y1: HUB_Y, x2: 204, y2: 348, tone: 'blue', mobileVisible: true },
  { id: 'l-hub-se', x1: HUB_X, y1: HUB_Y, x2: 756, y2: 348, tone: 'blue', mobileVisible: true },
  { id: 'l-hub-top', x1: HUB_X, y1: HUB_Y, x2: 480, y2: 74, tone: 'cyan', mobileVisible: false },
  { id: 'l-hub-w', x1: HUB_X, y1: HUB_Y, x2: 96, y2: 230, tone: 'cyan', mobileVisible: false },
  { id: 'l-hub-e', x1: HUB_X, y1: HUB_Y, x2: 864, y2: 230, tone: 'cyan', mobileVisible: false },
  { id: 'l-nw-top', x1: 184, y1: 112, x2: 480, y2: 74, tone: 'blue', mobileVisible: false },
  { id: 'l-top-ne', x1: 480, y1: 74, x2: 776, y2: 112, tone: 'blue', mobileVisible: false },
  { id: 'l-nw-w', x1: 184, y1: 112, x2: 96, y2: 230, tone: 'blue', mobileVisible: false },
  { id: 'l-w-sw', x1: 96, y1: 230, x2: 204, y2: 348, tone: 'blue', mobileVisible: false },
  { id: 'l-ne-e', x1: 776, y1: 112, x2: 864, y2: 230, tone: 'blue', mobileVisible: false },
  { id: 'l-e-se', x1: 864, y1: 230, x2: 756, y2: 348, tone: 'blue', mobileVisible: false },
];

// 4 data pulses traveling along selected hub-to-node links
const NETWORK_PULSES: NetworkPulseSpec[] = [
  { id: 'p-nw', x1: HUB_X, y1: HUB_Y, x2: 184, y2: 112, delay: 1.98, mobileVisible: true },
  { id: 'p-ne', x1: HUB_X, y1: HUB_Y, x2: 776, y2: 112, delay: 2.16, mobileVisible: true },
  { id: 'p-se', x1: HUB_X, y1: HUB_Y, x2: 756, y2: 348, delay: 2.34, mobileVisible: true },
  { id: 'p-w', x1: HUB_X, y1: HUB_Y, x2: 96, y2: 230, delay: 2.48, mobileVisible: false },
];

export const NetworkCinematicTransition: React.FC = () => {
  const { mode, networkTransitionId, dismissNetworkTransition } = useTheme();
  const shouldReduceMotion = Boolean(useReducedMotion());

  const overlayRef = useRef<HTMLDivElement>(null);
  const scanlineRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const topStatusRef = useRef<HTMLDivElement>(null);
  const bottomStatusRef = useRef<HTMLParagraphElement>(null);
  const accentBarRef = useRef<HTMLDivElement>(null);
  const orbitRingRef = useRef<SVGCircleElement>(null);
  const hubGroupRef = useRef<SVGGElement>(null);
  const bootNodeRefs = useRef<(SVGGElement | null)[]>([]);
  const activationNodeRefs = useRef<(SVGGElement | null)[]>([]);
  const linkRefs = useRef<(SVGLineElement | null)[]>([]);
  const pulseRefs = useRef<(SVGCircleElement | null)[]>([]);

  const isActive = mode === 'network' && networkTransitionId > 0;

  useEffect(() => {
    if (!isActive || !overlayRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismissNetworkTransition();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const ctx = gsap.context(() => {
      const root = overlayRef.current;
      if (!root) return;

      const chars = charRefs.current.filter((el): el is HTMLSpanElement => el !== null);
      const bootNodes = bootNodeRefs.current.filter((el): el is SVGGElement => el !== null);
      const activationNodes = activationNodeRefs.current.filter(
        (el): el is SVGGElement => el !== null
      );
      const links = linkRefs.current.filter((el): el is SVGLineElement => el !== null);
      const pulses = pulseRefs.current.filter((el): el is SVGCircleElement => el !== null);

      // Accessible reduced-motion path: clean static composition + quick opacity fade
      if (shouldReduceMotion) {
        chars.forEach((el, idx) => {
          el.textContent = TITLE_CHARS[idx];
        });
        gsap.set(root, { opacity: 0 });
        if (scanlineRef.current) gsap.set(scanlineRef.current, { opacity: 0 });
        if (watermarkRef.current) gsap.set(watermarkRef.current, { opacity: 0.08 });
        if (maskRef.current) gsap.set(maskRef.current, { clipPath: 'inset(0% 0% 0% 0%)' });
        if (topStatusRef.current) gsap.set(topStatusRef.current, { opacity: 1, y: 0 });
        if (bottomStatusRef.current) gsap.set(bottomStatusRef.current, { opacity: 1, y: 0 });
        if (accentBarRef.current) gsap.set(accentBarRef.current, { scaleX: 1, opacity: 1 });
        if (orbitRingRef.current) gsap.set(orbitRingRef.current, { opacity: 0.25 });
        if (hubGroupRef.current) gsap.set(hubGroupRef.current, { opacity: 0.45, scale: 1 });
        gsap.set(bootNodes, { opacity: 0.7, scale: 1 });
        gsap.set(activationNodes, { opacity: 0.7, scale: 1 });
        gsap.set(links, { strokeDasharray: 'none', strokeDashoffset: 0, opacity: 0.4 });
        gsap.set(pulses, { opacity: 0 });

        const reducedTl = gsap.timeline({
          onComplete: () => dismissNetworkTransition(),
        });
        reducedTl
          .to(root, { opacity: 1, duration: 0.14, ease: 'power1.out' })
          .to(root, { opacity: 0, duration: 0.22, ease: 'power1.inOut' }, '+=0.14');
        return;
      }

      // Initial animation setup
      gsap.set(root, { opacity: 0 });

      if (scanlineRef.current) {
        gsap.set(scanlineRef.current, { opacity: 0, y: '-34vh' });
      }
      if (watermarkRef.current) {
        gsap.set(watermarkRef.current, { opacity: 0, scale: 0.96, y: 0 });
      }
      if (titleWrapRef.current) {
        gsap.set(titleWrapRef.current, { x: 0, y: 0, opacity: 1 });
      }
      if (maskRef.current) {
        gsap.set(maskRef.current, { clipPath: 'inset(0% 100% 0% 0%)' });
      }

      chars.forEach((el, idx) => {
        el.textContent = TITLE_CHARS[idx];
      });
      gsap.set(chars, { opacity: 0, y: 12 });

      if (topStatusRef.current) {
        gsap.set(topStatusRef.current, { opacity: 0, y: 8 });
      }
      if (bottomStatusRef.current) {
        gsap.set(bottomStatusRef.current, { opacity: 0, y: 8 });
      }
      if (accentBarRef.current) {
        gsap.set(accentBarRef.current, {
          scaleX: 0,
          opacity: 0.95,
          transformOrigin: 'center center',
        });
      }

      if (orbitRingRef.current) {
        gsap.set(orbitRingRef.current, {
          opacity: 0,
          scale: 0.88,
          transformOrigin: `${HUB_X}px ${HUB_Y}px`,
        });
      }
      if (hubGroupRef.current) {
        gsap.set(hubGroupRef.current, {
          opacity: 0,
          scale: 0.5,
          transformOrigin: `${HUB_X}px ${HUB_Y}px`,
        });
      }

      bootNodes.forEach((node) => {
        const cx = Number(node.getAttribute('data-cx') ?? HUB_X);
        const cy = Number(node.getAttribute('data-cy') ?? HUB_Y);
        gsap.set(node, { opacity: 0, scale: 0.35, transformOrigin: `${cx}px ${cy}px` });
      });

      activationNodes.forEach((node) => {
        const cx = Number(node.getAttribute('data-cx') ?? HUB_X);
        const cy = Number(node.getAttribute('data-cy') ?? HUB_Y);
        gsap.set(node, { opacity: 0, scale: 0.35, transformOrigin: `${cx}px ${cy}px` });
      });

      links.forEach((line, idx) => {
        const spec = NETWORK_LINKS[idx];
        const length = spec ? Math.hypot(spec.x2 - spec.x1, spec.y2 - spec.y1) : 280;
        gsap.set(line, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0.52,
        });
      });

      gsap.set(pulses, { opacity: 0, x: 0, y: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          dismissNetworkTransition();
        },
      });

      // ================================================================
      // PHASE 1: SYSTEM BOOT (0.00 - 0.70s)
      // ================================================================
      tl.to(root, { opacity: 1, duration: 0.38, ease: 'power2.out' }, 0);

      if (scanlineRef.current) {
        tl.to(
          scanlineRef.current,
          { opacity: 0.9, duration: 0.16, ease: 'power2.out' },
          0.06
        ).to(
          scanlineRef.current,
          { y: '2vh', duration: 0.62, ease: 'power2.inOut' },
          0.08
        );
      }

      if (topStatusRef.current) {
        tl.to(
          topStatusRef.current,
          { opacity: 1, y: 0, duration: 0.36, ease: 'power2.out' },
          0.18
        );
      }

      if (bootNodes.length > 0) {
        tl.to(
          bootNodes,
          {
            opacity: 0.85,
            scale: 1,
            duration: 0.36,
            stagger: 0.11,
            ease: 'back.out(1.7)',
          },
          0.22
        );
      }

      // ================================================================
      // PHASE 2: DIGITAL FORMATION (0.70 - 1.70s)
      // ================================================================
      if (maskRef.current) {
        tl.to(
          maskRef.current,
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.56,
            ease: 'power3.out',
          },
          0.7
        );
      }

      tl.to(
        chars,
        {
          opacity: 1,
          y: 0,
          duration: 0.46,
          stagger: 0.052,
          ease: 'expo.out',
        },
        0.72
      );

      // Subtle deterministic character-decoding effect (zero React re-renders)
      const decodeState = { progress: 0 };
      let lastBucket = -1;
      tl.to(
        decodeState,
        {
          progress: 1,
          duration: 0.78,
          ease: 'none',
          onUpdate: () => {
            const bucket = Math.floor(decodeState.progress * 18);
            if (bucket === lastBucket) return;
            lastBucket = bucket;

            const settledCount = Math.floor(decodeState.progress * (TITLE_CHARS.length + 0.01));
            for (let i = 0; i < chars.length; i++) {
              const el = chars[i];
              if (i < settledCount) {
                if (el.textContent !== TITLE_CHARS[i]) {
                  el.textContent = TITLE_CHARS[i];
                }
              } else {
                const glyph = DECODE_GLYPHS[(bucket + i * 3) % DECODE_GLYPHS.length];
                if (el.textContent !== glyph) {
                  el.textContent = glyph;
                }
              }
            }
          },
          onComplete: () => {
            for (let i = 0; i < chars.length; i++) {
              chars[i].textContent = TITLE_CHARS[i];
            }
          },
        },
        0.74
      );

      // Exactly two controlled ±2-3px horizontal micro-glitches while keeping typography readable
      if (titleWrapRef.current) {
        tl.to(
          titleWrapRef.current,
          { x: -2.5, opacity: 0.88, duration: 0.045, ease: 'steps(1)' },
          1.06
        )
          .to(
            titleWrapRef.current,
            { x: 0, opacity: 1, duration: 0.045, ease: 'steps(1)' },
            1.105
          )
          .to(
            titleWrapRef.current,
            { x: 3, opacity: 0.9, duration: 0.045, ease: 'steps(1)' },
            1.38
          )
          .to(
            titleWrapRef.current,
            { x: 0, opacity: 1, duration: 0.05, ease: 'power2.out' },
            1.425
          );
      }

      // ================================================================
      // PHASE 3: NETWORK ACTIVATION (1.70 - 3.20s)
      // ================================================================
      if (scanlineRef.current) {
        tl.to(
          scanlineRef.current,
          { y: '34vh', opacity: 0.45, duration: 0.95, ease: 'power2.out' },
          1.7
        );
      }

      if (watermarkRef.current) {
        tl.to(
          watermarkRef.current,
          { opacity: 0.09, scale: 1, duration: 0.68, ease: 'power2.out' },
          1.72
        );
      }

      if (hubGroupRef.current) {
        tl.to(
          hubGroupRef.current,
          { opacity: 0.62, scale: 1, duration: 0.48, ease: 'back.out(1.6)' },
          1.74
        );
      }

      if (orbitRingRef.current) {
        tl.to(
          orbitRingRef.current,
          { opacity: 0.28, scale: 1, duration: 0.65, ease: 'power2.out' },
          1.78
        );
      }

      if (links.length > 0) {
        tl.to(
          links,
          {
            strokeDashoffset: 0,
            duration: 0.68,
            stagger: 0.035,
            ease: 'power2.out',
          },
          1.78
        );
      }

      if (activationNodes.length > 0) {
        tl.to(
          activationNodes,
          {
            opacity: 0.9,
            scale: 1,
            duration: 0.36,
            stagger: 0.08,
            ease: 'back.out(1.7)',
          },
          1.96
        );
      }

      // Animate 4 small data pulses along selected connection lines
      NETWORK_PULSES.forEach((pulseSpec, idx) => {
        const pulseEl = pulseRefs.current[idx];
        if (!pulseEl) return;
        const dx = pulseSpec.x2 - pulseSpec.x1;
        const dy = pulseSpec.y2 - pulseSpec.y1;

        tl.to(
          pulseEl,
          { opacity: 0.95, duration: 0.14, ease: 'power1.out' },
          pulseSpec.delay
        )
          .to(
            pulseEl,
            { x: dx, y: dy, duration: 0.68, ease: 'power1.inOut' },
            pulseSpec.delay
          )
          .to(
            pulseEl,
            { opacity: 0.28, duration: 0.22, ease: 'power1.out' },
            pulseSpec.delay + 0.54
          );
      });

      if (accentBarRef.current) {
        tl.to(
          accentBarRef.current,
          { scaleX: 1, duration: 0.48, ease: 'power3.out' },
          2.08
        );
      }

      if (bottomStatusRef.current) {
        tl.to(
          bottomStatusRef.current,
          { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out' },
          2.22
        );
      }

      // ================================================================
      // PHASE 4: SYSTEM ESTABLISHED (3.20 - 4.50s)
      // ================================================================
      if (scanlineRef.current) {
        tl.to(
          scanlineRef.current,
          { opacity: 0, duration: 0.38, ease: 'power2.out' },
          3.2
        );
      }

      if (pulses.length > 0) {
        tl.to(
          pulses,
          { opacity: 0, duration: 0.36, ease: 'power2.out' },
          3.22
        );
      }

      if (topStatusRef.current) {
        tl.to(
          topStatusRef.current,
          { opacity: 0, y: -4, duration: 0.42, ease: 'power2.inOut' },
          3.26
        );
      }

      if (bottomStatusRef.current) {
        tl.to(
          bottomStatusRef.current,
          { opacity: 0, y: 4, duration: 0.42, ease: 'power2.inOut' },
          3.26
        );
      }

      if (accentBarRef.current) {
        tl.to(
          accentBarRef.current,
          { opacity: 0, scaleX: 0.65, duration: 0.42, ease: 'power2.inOut' },
          3.28
        );
      }

      if (titleWrapRef.current) {
        tl.to(
          titleWrapRef.current,
          { y: -10, opacity: 0, duration: 0.62, ease: 'power2.inOut' },
          3.4
        );
      }

      if (watermarkRef.current) {
        tl.to(
          watermarkRef.current,
          { opacity: 0, y: -6, duration: 0.58, ease: 'power2.inOut' },
          3.42
        );
      }

      const svgFadeTargets = [
        hubGroupRef.current,
        orbitRingRef.current,
        ...bootNodes,
        ...activationNodes,
        ...links,
      ].filter(Boolean);

      if (svgFadeTargets.length > 0) {
        tl.to(
          svgFadeTargets,
          { opacity: 0, duration: 0.56, ease: 'power2.inOut' },
          3.42
        );
      }

      // Dissolve full-screen overlay cleanly by 4.50s to reveal Network Mode + particle background
      tl.to(
        root,
        { opacity: 0, duration: 0.78, ease: 'power2.inOut' },
        3.72
      );
    }, overlayRef);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      ctx.revert();
    };
  }, [dismissNetworkTransition, isActive, networkTransitionId, shouldReduceMotion]);

  if (!isActive) return null;

  let bootIdx = 0;
  let actIdx = 0;

  return (
    <div
      ref={overlayRef}
      key={networkTransitionId}
      role="status"
      aria-live="polite"
      aria-label="Network — System Initialization"
      onClick={dismissNetworkTransition}
      className="fixed inset-0 z-[70] flex cursor-pointer items-center justify-center overflow-hidden bg-[#07111F] px-4 text-[#EAF4FF] select-none sm:px-6"
      style={{ opacity: 0 }}
    >
      {/* Subtle technical dot-grid backing */}
      <div
        aria-hidden="true"
        className="dot-grid-canvas pointer-events-none absolute inset-0 opacity-75"
      />

      {/* Centered responsive background watermark */}
      <span
        ref={watermarkRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-sans text-[clamp(3.75rem,17vw,13.5rem)] leading-none font-medium tracking-[0.22em] text-[#37DFFF] uppercase opacity-0 sm:tracking-[0.28em]"
      >
        NETWORK
      </span>

      {/* Lightweight Network Core-inspired SVG topology */}
      <svg
        aria-hidden="true"
        viewBox="0 0 960 460"
        className="pointer-events-none absolute h-auto w-[min(980px,96vw)] overflow-visible"
        fill="none"
      >
        {/* Dashed orbital guide echoing Network Core geometry */}
        <circle
          ref={orbitRingRef}
          cx={HUB_X}
          cy={HUB_Y}
          r="138"
          stroke="#2685FF"
          strokeWidth="1.2"
          strokeDasharray="3 4"
        />

        {/* SVG connection lines animated via strokeDashoffset */}
        {NETWORK_LINKS.map((link, idx) => (
          <line
            key={link.id}
            ref={(el) => {
              linkRefs.current[idx] = el;
            }}
            x1={link.x1}
            y1={link.y1}
            x2={link.x2}
            y2={link.y2}
            stroke={link.tone === 'cyan' ? '#37DFFF' : '#2685FF'}
            strokeWidth={link.tone === 'cyan' ? '1.35' : '1.6'}
            strokeLinecap="round"
            className={link.mobileVisible ? undefined : 'hidden sm:block'}
          />
        ))}

        {/* Central hub node */}
        <g ref={hubGroupRef}>
          <circle cx={HUB_X} cy={HUB_Y} r="22" fill="#37DFFF" opacity="0.12" />
          <circle
            cx={HUB_X}
            cy={HUB_Y}
            r="11.5"
            fill="#07111F"
            stroke="#37DFFF"
            strokeWidth="2.1"
          />
          <circle cx={HUB_X} cy={HUB_Y} r="3.4" fill="#EAF4FF" />
        </g>

        {/* 7 surrounding network nodes */}
        {NETWORK_NODES.map((node) => {
          const isBoot = node.phase === 'boot';
          const refIndex = isBoot ? bootIdx++ : actIdx++;
          return (
            <g
              key={node.id}
              data-cx={node.x}
              data-cy={node.y}
              ref={(el) => {
                if (isBoot) {
                  bootNodeRefs.current[refIndex] = el;
                } else {
                  activationNodeRefs.current[refIndex] = el;
                }
              }}
              className={node.mobileVisible ? undefined : 'hidden sm:block'}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r + 5}
                fill="#37DFFF"
                opacity="0.1"
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill="#07111F"
                stroke="#37DFFF"
                strokeWidth="1.8"
              />
              <circle cx={node.x} cy={node.y} r="1.9" fill="#EAF4FF" />
            </g>
          );
        })}

        {/* 4 data pulses traveling along selected paths */}
        {NETWORK_PULSES.map((pulse, idx) => (
          <circle
            key={pulse.id}
            ref={(el) => {
              pulseRefs.current[idx] = el;
            }}
            cx={pulse.x1}
            cy={pulse.y1}
            r="2.8"
            fill="#EAF4FF"
            className={pulse.mobileVisible ? undefined : 'hidden sm:block'}
          />
        ))}
      </svg>

      {/* Subtle horizontal cyan scanning beam */}
      <div
        ref={scanlineRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 z-20 h-[2px] w-full will-change-transform"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(38,133,255,0.45) 18%, #37DFFF 50%, rgba(38,133,255,0.45) 82%, transparent 100%)',
          boxShadow: '0 0 14px rgba(55, 223, 255, 0.55)',
        }}
      />

      {/* Foreground accessible typography composition */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center">
        <div
          ref={topStatusRef}
          className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.26em] text-[#9BAFC4] uppercase sm:mb-4 sm:text-xs sm:tracking-[0.3em]"
        >
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#37DFFF]" />
          <span>SYSTEM ONLINE</span>
        </div>

        <div ref={titleWrapRef} className="w-full max-w-full will-change-transform">
          <div ref={maskRef} className="overflow-hidden py-1">
            <h2
              aria-label="Network"
              className="flex flex-nowrap items-center justify-center font-sans text-[clamp(2.5rem,11.5vw,6.25rem)] leading-none font-extrabold tracking-[0.14em] text-[#37DFFF] uppercase sm:tracking-[0.2em]"
              style={{
                textShadow: '0 0 22px rgba(55, 223, 255, 0.34)',
              }}
            >
              {TITLE_CHARS.map((char, idx) => (
                <span
                  key={`${char}-${idx}`}
                  ref={(el) => {
                    charRefs.current[idx] = el;
                  }}
                  aria-hidden="true"
                  className="inline-block will-change-transform"
                >
                  {char}
                </span>
              ))}
            </h2>
          </div>
        </div>

        <div
          ref={accentBarRef}
          aria-hidden="true"
          className="mt-4 h-[2px] w-36 rounded-full sm:mt-5 sm:w-56"
          style={{
            background: 'linear-gradient(90deg, #2685FF 0%, #37DFFF 55%, #EAF4FF 100%)',
          }}
        />

        <p
          ref={bottomStatusRef}
          className="mt-3 font-mono text-[11px] font-medium tracking-[0.2em] text-[#9BAFC4] uppercase sm:mt-4 sm:text-xs sm:tracking-[0.26em]"
        >
          NETWORK MODE INITIALIZED
        </p>
      </div>
    </div>
  );
};
