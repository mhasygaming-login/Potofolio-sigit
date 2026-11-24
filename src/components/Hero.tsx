import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Command, Network } from 'lucide-react';
import { BRAND_COLORS, PROFILE } from '../data/portfolioData';

interface HeroProps {
  onExploreProjects: () => void;
  onContact: () => void;
  onOpenCommandPalette?: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  rotation: number;
  shape: number;
}

const NAME_LINES = ['Sigit', 'Hasyim', 'Nasution'];
const SMOOTH_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const DURATION = 0.4;
const STAGGER = 0.07;

export const Hero: React.FC<HeroProps> = ({
  onExploreProjects,
  onContact,
  onOpenCommandPalette,
}) => {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [rotorIdx, setRotorIdx] = useState(0);
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  // Draggable sticker offsets
  const [stickerOffsets, setStickerOffsets] = useState<Record<string, { x: number; y: number }>>({
    s1: { x: 0, y: 0 },
    s2: { x: 0, y: 0 },
  });
  const dragStateRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Calm opacity crossfade for focus lines
  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = window.setInterval(() => {
      setRotorIdx((prev) => (prev + 1) % PROFILE.focusLines.length);
    }, 3400);
    return () => window.clearInterval(interval);
  }, [shouldReduceMotion]);

  // Ensure parallax resets immediately if reduced motion is enabled
  useEffect(() => {
    if (shouldReduceMotion) {
      setPointerOffset({ x: 0, y: 0 });
    }
  }, [shouldReduceMotion]);

  const handleHeroPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (shouldReduceMotion || e.pointerType !== 'mouse' || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setPointerOffset({ x: nx, y: ny });
  };

  const handleHeroPointerLeave = () => {
    setPointerOffset({ x: 0, y: 0 });
  };

  const triggerConfetti = (e: React.MouseEvent<SVGSVGElement>) => {
    if (shouldReduceMotion) return;
    const baseX = e.clientX;
    const baseY = e.clientY;
    const pieces: ConfettiPiece[] = Array.from({ length: 24 }, (_, idx) => {
      const angle = ((-90 + (Math.random() * 140 - 70)) * Math.PI) / 180;
      const speed = 160 + Math.random() * 240;
      return {
        id: Date.now() + idx,
        x: baseX,
        y: baseY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: BRAND_COLORS[idx % BRAND_COLORS.length],
        rotation: Math.random() * 360,
        shape: idx % 3,
      };
    });
    setConfetti(pieces);
    window.setTimeout(() => setConfetti([]), 1200);
  };

  const onStickerPointerDown = (id: string, e: React.PointerEvent<HTMLDivElement>) => {
    const current = stickerOffsets[id] || { x: 0, y: 0 };
    dragStateRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: current.x,
      origY: current.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const onStickerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (!drag) return;
    const dx = Math.max(-140, Math.min(140, drag.origX + (e.clientX - drag.startX)));
    const dy = Math.max(-110, Math.min(110, drag.origY + (e.clientY - drag.startY)));
    setStickerOffsets((prev) => ({
      ...prev,
      [drag.id]: { x: dx, y: dy },
    }));
  };

  const onStickerPointerUp = () => {
    dragStateRef.current = null;
  };

  const fadeUpTransition = (step: number) =>
    shouldReduceMotion
      ? { duration: 0 }
      : { duration: DURATION, delay: step * STAGGER, ease: SMOOTH_EASE };

  return (
    <section
      id="atas"
      ref={heroRef}
      onPointerMove={handleHeroPointerMove}
      onPointerLeave={handleHeroPointerLeave}
      className="relative overflow-x-clip py-12 sm:py-16 lg:py-20"
    >
      {/* Tekstur latar dot-grid halus */}
      <div aria-hidden="true" className="dot-grid-canvas pointer-events-none absolute inset-0 -z-10" />
      {/* Confetti overlay */}
      {confetti.length > 0 && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {confetti.map((piece) => (
            <span
              key={piece.id}
              className="absolute block transition-all duration-1000 ease-out"
              style={{
                left: piece.x,
                top: piece.y,
                width: piece.shape === 2 ? 12 : 9,
                height: piece.shape === 2 ? 5 : 9,
                borderRadius: piece.shape === 1 ? '9999px' : '2px',
                backgroundColor: piece.color,
                transform: `translate(${piece.vx * 0.45}px, ${piece.vy * 0.45 + 140}px) rotate(${piece.rotation}deg)`,
                opacity: 0,
              }}
            />
          ))}
        </div>
      )}

      <div className="mx-auto grid w-[min(1120px,calc(100%-32px))] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Left Column: Parallel Balanced Entrance, Name Leads Immediately */}
        <div className="lg:col-span-7">
          {/* Step 1 (70ms): Role kicker */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={fadeUpTransition(1)}
            className="mb-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--action)]"
          >
            <Network className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{PROFILE.headlineRole}</span>
            <span aria-hidden="true" className="text-[var(--muted)]">
              ·
            </span>
            <span className="font-medium text-[var(--muted)]">{PROFILE.supportingRole}</span>
          </motion.div>

          {/* Step 0 (0ms): Primary identity "Sigit Hasyim Nasution" leads immediately */}
          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={fadeUpTransition(0)}
            aria-label={PROFILE.name}
            className="text-5xl font-extrabold leading-[0.96] tracking-[-0.04em] text-[var(--text)] sm:text-6xl lg:text-[5.25rem]"
          >
            {NAME_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </motion.h1>

          {/* Step 2 (140ms): Summary copy */}
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={fadeUpTransition(2)}
            className="mt-6 max-w-[54ch] text-base leading-relaxed text-[var(--muted)] sm:text-lg"
          >
            {PROFILE.heroSummary}
          </motion.p>

          {/* Step 3 (210ms): Calm focus line */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={fadeUpTransition(3)}
            className="mt-4 flex min-h-[2.2em] flex-wrap items-baseline gap-1.5 text-sm font-semibold text-[var(--text)] sm:text-base"
          >
            <span>Yang sering saya kerjakan:</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={rotorIdx}
                initial={shouldReduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                transition={
                  shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: SMOOTH_EASE }
                }
                className="font-mono text-[var(--text)]"
                style={{
                  borderBottom: `2px solid ${BRAND_COLORS[rotorIdx % BRAND_COLORS.length]}`,
                }}
              >
                {PROFILE.focusLines[rotorIdx]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* Step 4 (280ms): CTA buttons + M3 Command Palette shortcut */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={fadeUpTransition(4)}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#project"
              onClick={(e) => {
                e.preventDefault();
                onExploreProjects();
              }}
              className="m3-btn inline-flex min-h-[48px] items-center gap-2 whitespace-nowrap rounded-full bg-[var(--action)] px-6 text-sm font-bold text-[var(--on-action)] no-underline hover:brightness-110"
            >
              <span>Lihat Studi Kasus Project</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>

            <a
              href="#kontak"
              onClick={(e) => {
                e.preventDefault();
                onContact();
              }}
              className="m3-btn inline-flex min-h-[48px] items-center whitespace-nowrap rounded-full border border-[var(--line)] bg-[var(--bg)] px-6 text-sm font-bold text-[var(--text)] no-underline hover:border-[var(--text)] hover:bg-[var(--surface)]"
            >
              Hubungi Saya
            </a>

            {onOpenCommandPalette && (
              <button
                type="button"
                onClick={onOpenCommandPalette}
                className="m3-btn inline-flex min-h-[48px] items-center gap-2 whitespace-nowrap rounded-full bg-[var(--surface-tonal)] px-4 text-xs font-bold text-[var(--surface-tonal-text)] hover:brightness-95"
              >
                <Command className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Navigasi Cepat</span>
                <kbd className="font-mono text-[11px] opacity-80">Ctrl+K</kbd>
              </button>
            )}
          </motion.div>
        </div>

        {/* Right Column: Animates in Parallel with Left Column */}
        <div className="lg:col-span-5">
          <div className="relative mx-auto aspect-square w-full max-w-[380px] sm:max-w-[420px]">
            {/* Draggable Sticker 1 (Spark) — step 3 (210ms) */}
            <motion.div
              aria-hidden="true"
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={fadeUpTransition(3)}
              className="absolute right-[18%] -top-4 z-20 h-16 w-16 sm:h-20 sm:w-20"
            >
              <div
                onPointerDown={(e) => onStickerPointerDown('s1', e)}
                onPointerMove={onStickerPointerMove}
                onPointerUp={onStickerPointerUp}
                onPointerCancel={onStickerPointerUp}
                className="h-full w-full cursor-grab touch-none select-none drop-shadow-md active:cursor-grabbing"
                style={{
                  transform: `translate(${stickerOffsets.s1.x}px, ${stickerOffsets.s1.y}px) rotate(8deg)`,
                }}
              >
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <path
                    d="M50 6C54 34 66 46 94 50 66 54 54 66 50 94 46 66 34 54 6 50 34 46 46 34 50 6Z"
                    fill="#fbbc04"
                    paintOrder="stroke"
                    stroke="#fff"
                    strokeLinejoin="round"
                    strokeWidth="10"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Draggable Sticker 2 (Wave Badge) — step 4 (280ms) */}
            <motion.div
              aria-hidden="true"
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={fadeUpTransition(4)}
              className="absolute -right-2 top-[34%] z-20 h-14 w-14"
            >
              <div
                onPointerDown={(e) => onStickerPointerDown('s2', e)}
                onPointerMove={onStickerPointerMove}
                onPointerUp={onStickerPointerUp}
                onPointerCancel={onStickerPointerUp}
                className="h-full w-full cursor-grab touch-none select-none drop-shadow-md active:cursor-grabbing"
                style={{
                  transform: `translate(${stickerOffsets.s2.x}px, ${stickerOffsets.s2.y}px) rotate(-6deg)`,
                }}
              >
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="#4285f4"
                    paintOrder="stroke"
                    stroke="#fff"
                    strokeWidth="10"
                  />
                  <path
                    d="M26 56c6-8 12 8 18 0s12-8 18 0 8 4 12 0"
                    fill="none"
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeWidth="6"
                  />
                </svg>
              </div>
            </motion.div>

            {/* SMK Madinatul Quran TKJ Name Tag — step 2 (140ms): subtle entrance rotation without affecting layout */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: -5 }}
              transition={fadeUpTransition(2)}
              style={{ transformOrigin: '50% 0%' }}
              className="pointer-events-none absolute -bottom-5 -left-2 z-20 w-[164px] overflow-hidden rounded-2xl bg-white text-[#202124] shadow-lg ring-1 ring-black/10 sm:w-[178px]"
            >
              <div className="relative bg-[#1a73e8] px-3 pb-2.5 pt-5 text-center text-xs font-bold leading-tight text-white">
                <span className="absolute left-1/2 top-2 h-1.5 w-8 -translate-x-1/2 rounded-full bg-black/25" />
                {PROFILE.school}
              </div>
              <div className="px-3.5 pb-3 pt-3">
                <p className="text-base font-extrabold leading-tight tracking-tight">
                  Sigit Hasyim
                  <br />
                  Nasution
                </p>
                <p className="mt-1.5 text-[11px] font-medium leading-snug text-[#5f6368]">
                  Teknik Komputer &amp; Jaringan
                </p>
                <div aria-hidden="true" className="mt-2.5 flex gap-1.5">
                  {BRAND_COLORS.map((c) => (
                    <span key={c} className="h-2 w-2 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Four-Color < > Chevron Brackets — step 1 (70ms): fade-in & subtle scale */}
            <motion.svg
              aria-hidden="true"
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={fadeUpTransition(1)}
              onClick={triggerConfetti}
              viewBox="0 0 400 400"
              className="absolute inset-0 z-10 h-full w-full cursor-pointer overflow-visible"
            >
              <path
                d="M70 70 L10 200"
                stroke="#4285f4"
                strokeWidth="20"
                strokeLinecap="round"
                fill="none"
                style={{
                  transform: `translate(${pointerOffset.x * 14}px, ${pointerOffset.y * 14}px)`,
                }}
              />
              <path
                d="M10 200 L70 330"
                stroke="#ea4335"
                strokeWidth="20"
                strokeLinecap="round"
                fill="none"
                style={{
                  transform: `translate(${pointerOffset.x * 14}px, ${pointerOffset.y * 14}px)`,
                }}
              />
              <path
                d="M330 70 L390 200"
                stroke="#fbbc04"
                strokeWidth="20"
                strokeLinecap="round"
                fill="none"
                style={{
                  transform: `translate(${pointerOffset.x * 8}px, ${pointerOffset.y * 8}px)`,
                }}
              />
              <path
                d="M390 200 L330 330"
                stroke="#34a853"
                strokeWidth="20"
                strokeLinecap="round"
                fill="none"
                style={{
                  transform: `translate(${pointerOffset.x * 8}px, ${pointerOffset.y * 8}px)`,
                }}
              />
            </motion.svg>

            {/* Portrait Container — step 0 (0ms): enters immediately in parallel with left column */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={fadeUpTransition(0)}
              className="absolute inset-[6%_20%]"
            >
              <div
                className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface)]"
                style={{
                  transform: shouldReduceMotion
                    ? undefined
                    : `translate(${pointerOffset.x * -6}px, ${pointerOffset.y * -6}px)`,
                }}
              >
                {!photoError && (
                  <img
                    src="/assets/aistudio/Pemandangan_gunung_berkabut_di_ketinggian_967760b0.png"
                    alt="Foto setengah badan Sigit Hasyim Nasution"
                    onLoad={() => setPhotoLoaded(true)}
                    onError={() => setPhotoError(true)}
                    className={`absolute inset-0 h-full w-full origin-[50%_44%] scale-[1.58] object-cover object-center transition-opacity duration-300 ${
                      photoLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )}

                {(!photoLoaded || photoError) && (
                  <div className="flex flex-col items-center justify-center px-4 text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--bg)] shadow-sm">
                      <span className="text-3xl font-extrabold tracking-tight text-[var(--text)]">
                        {PROFILE.shortMark}
                      </span>
                    </div>
                    <span className="mt-3 text-xs font-semibold text-[var(--muted)]">
                      Siswa TKJ
                    </span>
                    <span className="mt-0.5 text-[11px] text-[var(--muted)]">
                      {PROFILE.school}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
