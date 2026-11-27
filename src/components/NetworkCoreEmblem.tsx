import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface NetworkCoreEmblemProps {
  className?: string;
}

interface CardinalNodeSpec {
  id: 'top' | 'right' | 'bottom' | 'left';
  bx: number;
  by: number;
  dx: number;
  dy: number;
}

const CARDINAL_NODES: CardinalNodeSpec[] = [
  { id: 'top', bx: 60, by: 20, dx: 0, dy: -1 },
  { id: 'right', bx: 100, by: 60, dx: 1, dy: 0 },
  { id: 'bottom', bx: 60, by: 100, dx: 0, dy: 1 },
  { id: 'left', bx: 20, by: 60, dx: -1, dy: 0 },
];

const CORE_X = 60;
const CORE_Y = 60;

export const NetworkCoreMiniMark: React.FC<{ className?: string }> = ({
  className = 'h-4 w-5 shrink-0',
}) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none">
    <line x1="12" y1="4.5" x2="12" y2="19.5" stroke="#2685FF" strokeWidth="1.6" strokeOpacity="0.7" />
    <line x1="4.5" y1="12" x2="19.5" y2="12" stroke="#2685FF" strokeWidth="1.6" strokeOpacity="0.7" />
    <circle cx="12" cy="4.2" r="2.1" fill="#07111F" stroke="#37DFFF" strokeWidth="1.5" />
    <circle cx="19.8" cy="12" r="2.1" fill="#07111F" stroke="#37DFFF" strokeWidth="1.5" />
    <circle cx="12" cy="19.8" r="2.1" fill="#07111F" stroke="#37DFFF" strokeWidth="1.5" />
    <circle cx="4.2" cy="12" r="2.1" fill="#07111F" stroke="#37DFFF" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="3.4" fill="#07111F" stroke="#37DFFF" strokeWidth="1.9" />
    <circle cx="12" cy="12" r="1.4" fill="#EAF4FF" />
  </svg>
);

export const NetworkCoreEmblem: React.FC<NetworkCoreEmblemProps> = ({ className = '' }) => {
  const { playTone } = useTheme();
  const shouldReduceMotion = Boolean(useReducedMotion());

  const containerRef = useRef<HTMLButtonElement>(null);
  const transformLayerRef = useRef<HTMLDivElement>(null);
  const coreHaloRef = useRef<SVGCircleElement>(null);
  const coreRingRef = useRef<SVGCircleElement>(null);
  const coreDotRef = useRef<SVGCircleElement>(null);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const outerNodeGroupRefs = useRef<(SVGGElement | null)[]>([]);
  const outerRingRefs = useRef<(SVGCircleElement | null)[]>([]);
  const pulseDotRef = useRef<SVGCircleElement>(null);

  const manualPulseTriggerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const container = containerRef.current;
    const transformLayer = transformLayerRef.current;
    if (!container || !transformLayer) return;

    let rafId = 0;
    let isPaused = document.hidden;
    let isCoarse = window.matchMedia('(pointer: coarse)').matches;

    const pointer = {
      clientX: 0,
      clientY: 0,
      active: false,
    };

    const anim = {
      tx: 0,
      ty: 0,
      rot: 0,
      scale: 1,
      proximity: 0,
      nx: 0,
      ny: 0,
      nodeShiftX: [0, 0, 0, 0],
      nodeShiftY: [0, 0, 0, 0],
      nodeScale: [1, 1, 1, 1],
      idlePhase: 0,
      pulseActive: false,
      pulseNodeIdx: 1,
      pulseProgress: 0,
      pulseCooldown: 70,
    };

    const triggerSignalPulse = (forcedIdx?: number) => {
      anim.pulseActive = true;
      anim.pulseProgress = 0;
      anim.pulseNodeIdx =
        typeof forcedIdx === 'number'
          ? forcedIdx
          : Math.floor(Math.random() * CARDINAL_NODES.length);
    };

    manualPulseTriggerRef.current = () => {
      triggerSignalPulse();
    };

    const step = () => {
      if (isPaused) return;

      const viewportW = window.innerWidth;
      const isMobile = viewportW < 768;
      const isTablet = viewportW >= 768 && viewportW < 1024;
      const interactionRadius = isTablet ? 165 : 220;
      const motionScale = isTablet ? 0.72 : 1;

      anim.idlePhase += 0.028;
      const idleBreath = Math.sin(anim.idlePhase) * 0.5 + 0.5; // 0..1

      let targetProx = 0;
      let targetNx = 0;
      let targetNy = 0;

      if (pointer.active && !isCoarse && !isMobile) {
        const rect = container.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = pointer.clientX - cx;
        const dy = pointer.clientY - cy;
        const dist = Math.hypot(dx, dy);

        if (dist < interactionRadius && dist > 0.01) {
          targetProx = 1 - dist / interactionRadius;
          const normScale = Math.min(1, dist / 64);
          targetNx = (dx / dist) * normScale;
          targetNy = (dy / dist) * normScale;
        }
      }

      anim.proximity += (targetProx - anim.proximity) * 0.1;
      anim.nx += (targetNx - anim.nx) * 0.1;
      anim.ny += (targetNy - anim.ny) * 0.1;

      // Bounded cursor transform strictly within container limits:
      // max translate +-3.5px, max rotation +-7.5deg, max scale 1.08
      const targetTx = Math.max(-3.5, Math.min(3.5, anim.nx * anim.proximity * 3.5 * motionScale));
      const targetTy = Math.max(-3.5, Math.min(3.5, anim.ny * anim.proximity * 3.5 * motionScale));
      const targetRot = Math.max(
        -7.5,
        Math.min(7.5, (anim.nx * 6.5 - anim.ny * 1.5) * anim.proximity * motionScale)
      );
      const targetScale = 1 + Math.min(0.08, anim.proximity * 0.075 * motionScale);

      anim.tx += (targetTx - anim.tx) * 0.12;
      anim.ty += (targetTy - anim.ty) * 0.12;
      anim.rot += (targetRot - anim.rot) * 0.12;
      anim.scale += (targetScale - anim.scale) * 0.12;

      transformLayer.style.transform = `translate3d(${anim.tx.toFixed(2)}px, ${anim.ty.toFixed(
        2
      )}px, 0) rotate(${anim.rot.toFixed(2)}deg) scale(${anim.scale.toFixed(3)})`;

      // Core node idle + proximity glow
      const glowStrength = Math.min(1, idleBreath * 0.28 + anim.proximity * 0.72);
      if (coreHaloRef.current) {
        coreHaloRef.current.setAttribute('r', (16 + glowStrength * 5).toFixed(2));
        coreHaloRef.current.setAttribute('opacity', (0.14 + glowStrength * 0.32).toFixed(3));
      }
      if (coreRingRef.current) {
        coreRingRef.current.setAttribute(
          'stroke',
          anim.proximity > 0.25 ? '#EAF4FF' : '#37DFFF'
        );
      }
      if (coreDotRef.current) {
        coreDotRef.current.setAttribute('r', (3.3 + glowStrength * 1.1).toFixed(2));
      }

      // Adaptive movement of the 4 cardinal outer nodes & connecting lines
      for (let i = 0; i < CARDINAL_NODES.length; i++) {
        const spec = CARDINAL_NODES[i];
        const alignment = Math.max(0, spec.dx * anim.nx + spec.dy * anim.ny);
        const nodeProx = anim.proximity * (0.25 + alignment * 0.75);

        const targetShiftX =
          (spec.dx * alignment * 3.6 + anim.nx * 1.2) * anim.proximity * motionScale;
        const targetShiftY =
          (spec.dy * alignment * 3.6 + anim.ny * 1.2) * anim.proximity * motionScale;

        anim.nodeShiftX[i] += (targetShiftX - anim.nodeShiftX[i]) * 0.14;
        anim.nodeShiftY[i] += (targetShiftY - anim.nodeShiftY[i]) * 0.14;
        anim.nodeScale[i] += (1 + nodeProx * 0.2 - anim.nodeScale[i]) * 0.14;

        const nodeX = spec.bx + anim.nodeShiftX[i];
        const nodeY = spec.by + anim.nodeShiftY[i];

        const groupEl = outerNodeGroupRefs.current[i];
        if (groupEl) {
          groupEl.setAttribute(
            'transform',
            `translate(${anim.nodeShiftX[i].toFixed(2)} ${anim.nodeShiftY[i].toFixed(2)})`
          );
        }

        const ringEl = outerRingRefs.current[i];
        if (ringEl) {
          ringEl.setAttribute('r', (6.2 * anim.nodeScale[i]).toFixed(2));
          ringEl.setAttribute('stroke', nodeProx > 0.38 ? '#EAF4FF' : '#37DFFF');
        }

        const lineEl = lineRefs.current[i];
        if (lineEl) {
          lineEl.setAttribute('x2', nodeX.toFixed(2));
          lineEl.setAttribute('y2', nodeY.toFixed(2));
          lineEl.setAttribute('stroke', nodeProx > 0.25 ? '#37DFFF' : '#2685FF');
          lineEl.setAttribute('stroke-opacity', (0.45 + nodeProx * 0.5).toFixed(3));
          lineEl.setAttribute('stroke-width', (1.8 + nodeProx * 0.8).toFixed(2));
        }
      }

      // Single controlled Signal Pulse traveling from Core to an outer node
      if (!anim.pulseActive) {
        anim.pulseCooldown -= 1;
        if (anim.pulseCooldown <= 0) {
          let preferredIdx: number | undefined;
          if (anim.proximity > 0.25) {
            let bestScore = -1;
            for (let i = 0; i < CARDINAL_NODES.length; i++) {
              const s = CARDINAL_NODES[i].dx * anim.nx + CARDINAL_NODES[i].dy * anim.ny;
              if (s > bestScore) {
                bestScore = s;
                preferredIdx = i;
              }
            }
          }
          triggerSignalPulse(preferredIdx);
        }
        if (pulseDotRef.current) {
          pulseDotRef.current.setAttribute('opacity', '0');
        }
      } else {
        anim.pulseProgress += anim.proximity > 0.2 ? 0.024 : 0.015;
        const spec = CARDINAL_NODES[anim.pulseNodeIdx];
        const endX = spec.bx + anim.nodeShiftX[anim.pulseNodeIdx];
        const endY = spec.by + anim.nodeShiftY[anim.pulseNodeIdx];

        if (anim.pulseProgress >= 1) {
          anim.pulseActive = false;
          anim.pulseCooldown = anim.proximity > 0.25 ? 65 : 155;
          if (pulseDotRef.current) {
            pulseDotRef.current.setAttribute('opacity', '0');
          }
        } else if (pulseDotRef.current) {
          const t = anim.pulseProgress;
          const px = CORE_X + (endX - CORE_X) * t;
          const py = CORE_Y + (endY - CORE_Y) * t;
          const fadeAlpha = t < 0.15 ? t / 0.15 : t > 0.85 ? (1 - t) / 0.15 : 1;
          pulseDotRef.current.setAttribute('cx', px.toFixed(2));
          pulseDotRef.current.setAttribute('cy', py.toFixed(2));
          pulseDotRef.current.setAttribute('opacity', (fadeAlpha * 0.95).toFixed(3));
        }
      }

      rafId = requestAnimationFrame(step);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointer.clientX = e.clientX;
      pointer.clientY = e.clientY;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handleResize = () => {
      isCoarse = window.matchMedia('(pointer: coarse)').matches;
    };

    const handleVisibilityChange = () => {
      isPaused = document.hidden;
      if (!isPaused) {
        rafId = requestAnimationFrame(step);
      } else if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    rafId = requestAnimationFrame(step);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      manualPulseTriggerRef.current = null;
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [shouldReduceMotion]);

  const handleEmblemClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    window.dispatchEvent(
      new CustomEvent('network-signal-ripple', {
        detail: {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          color: '#37DFFF',
        },
      })
    );
    playTone('node');
    manualPulseTriggerRef.current?.();
  };

  return (
    <motion.button
      ref={containerRef}
      type="button"
      onClick={handleEmblemClick}
      aria-label="Network Core Adaptive Nodes — klik untuk memancarkan pulsa sinyal"
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.92 }}
      transition={
        shouldReduceMotion ? { duration: 0 } : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
      }
      className={`group relative flex cursor-pointer items-center justify-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--action)] ${className}`}
    >
      <div
        ref={transformLayerRef}
        className="h-full w-full will-change-transform"
        style={{
          filter: 'drop-shadow(0 0 10px rgba(55, 223, 255, 0.28))',
        }}
      >
        <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible" fill="none">
          {/* Subtle geometric orbit guide */}
          <circle
            cx={CORE_X}
            cy={CORE_Y}
            r="40"
            stroke="#2685FF"
            strokeWidth="1"
            strokeOpacity="0.22"
            strokeDasharray="3 4"
          />

          {/* 4 thin connections from Core to outer nodes */}
          {CARDINAL_NODES.map((spec, idx) => (
            <line
              key={`line-${spec.id}`}
              ref={(el) => {
                lineRefs.current[idx] = el;
              }}
              x1={CORE_X}
              y1={CORE_Y}
              x2={spec.bx}
              y2={spec.by}
              stroke="#2685FF"
              strokeWidth="1.9"
              strokeOpacity="0.55"
              strokeLinecap="round"
            />
          ))}

          {/* Signal pulse particle */}
          <circle
            ref={pulseDotRef}
            cx={CORE_X}
            cy={CORE_Y}
            r="2.4"
            fill="#EAF4FF"
            opacity="0"
          />

          {/* 4 Adaptive Outer Nodes */}
          {CARDINAL_NODES.map((spec, idx) => (
            <g
              key={spec.id}
              ref={(el) => {
                outerNodeGroupRefs.current[idx] = el;
              }}
            >
              <circle
                ref={(el) => {
                  outerRingRefs.current[idx] = el;
                }}
                cx={spec.bx}
                cy={spec.by}
                r="6.2"
                fill="#07111F"
                stroke="#37DFFF"
                strokeWidth="2"
              />
              <circle cx={spec.bx} cy={spec.by} r="2.1" fill="#EAF4FF" opacity="0.9" />
            </g>
          ))}

          {/* Central Core Node */}
          <circle
            ref={coreHaloRef}
            cx={CORE_X}
            cy={CORE_Y}
            r="17"
            fill="#37DFFF"
            opacity="0.16"
          />
          <circle
            ref={coreRingRef}
            cx={CORE_X}
            cy={CORE_Y}
            r="10.5"
            fill="#07111F"
            stroke="#37DFFF"
            strokeWidth="2.4"
          />
          <circle ref={coreDotRef} cx={CORE_X} cy={CORE_Y} r="3.6" fill="#EAF4FF" />
        </svg>
      </div>
    </motion.button>
  );
};
