import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useDragControls,
  useMotionValue,
  useReducedMotion,
  type PanInfo,
} from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { AccentColor, ProjectItem, ProjectScreenshot } from '../data/portfolioData';

interface ProjectCarouselProps {
  projects: ProjectItem[];
  onOpenDetail: (slug: string) => void;
  onPreviewScreenshot?: (shot: ProjectScreenshot & { projectTitle: string }) => void;
}

const ACCENT_MAP: Record<AccentColor, string> = {
  blue: '#4285f4',
  red: '#ea4335',
  yellow: '#fbbc04',
  green: '#34a853',
};

const SLIDE_GAP = 20;

export const ProjectCarousel: React.FC<ProjectCarouselProps> = ({
  projects,
  onOpenDetail,
  onPreviewScreenshot,
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const shouldReduceMotion = useReducedMotion();
  const dragControls = useDragControls();
  const x = useMotionValue(0);

  const slideStep = viewportWidth > 0 ? viewportWidth + SLIDE_GAP : 0;
  const maxOffset = Math.max(0, (projects.length - 1) * slideStep);

  // Measure carousel viewport width responsively for desktop & mobile
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const updateWidth = () => {
      setViewportWidth(el.clientWidth);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const snapToIndex = useCallback(
    (index: number, instant = false) => {
      const clamped = Math.max(0, Math.min(projects.length - 1, index));
      setActiveIndex(clamped);

      if (slideStep <= 0) return;
      const targetX = -clamped * slideStep;

      if (instant || shouldReduceMotion) {
        x.set(targetX);
      } else {
        animate(x, targetX, {
          type: 'spring',
          stiffness: 320,
          damping: 34,
          mass: 0.9,
        });
      }
    },
    [projects.length, shouldReduceMotion, slideStep, x]
  );

  // Keep slide position aligned when viewport resizes
  useEffect(() => {
    if (slideStep > 0) {
      x.set(-activeIndex * slideStep);
    }
  }, [activeIndex, slideStep, x]);

  // Reset to first slide smoothly when filter changes
  useEffect(() => {
    setActiveIndex(0);
    x.set(0);
  }, [projects.length, projects[0]?.slug, x]);

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (projects.length <= 1) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    const target = e.target as HTMLElement;
    if (target.closest('a, button, input, select, textarea, label, pre')) {
      return;
    }

    dragControls.start(e);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);

    const swipeThreshold = Math.min(80, Math.max(40, viewportWidth * 0.12));
    const velocityThreshold = 300;

    let nextIndex = activeIndex;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      nextIndex = activeIndex + 1;
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      nextIndex = activeIndex - 1;
    }

    snapToIndex(nextIndex);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      snapToIndex(activeIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      snapToIndex(activeIndex - 1);
    }
  };

  return (
    <div
      aria-label="Galeri geser project"
      aria-roledescription="carousel"
      role="region"
      className="mt-8"
    >
      {/* Horizontal Clipping Viewport */}
      <div
        ref={viewportRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="overflow-hidden rounded-3xl focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--action)]"
      >
        <motion.div
          style={{ x, gap: SLIDE_GAP }}
          drag={projects.length > 1 ? 'x' : false}
          dragControls={dragControls}
          dragListener={false}
          dragDirectionLock
          dragConstraints={{ left: -maxOffset, right: 0 }}
          dragElastic={0.16}
          dragMomentum={false}
          onPointerDown={handleTrackPointerDown}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className={`flex touch-pan-y will-change-transform ${
            projects.length > 1
              ? isDragging
                ? 'cursor-grabbing select-none'
                : 'cursor-grab'
              : ''
          }`}
        >
          {projects.map((project, idx) => (
            <motion.article
              key={project.slug}
              aria-label={`${idx + 1} dari ${projects.length}: ${project.title}`}
              aria-roledescription="slide"
              role="group"
              aria-hidden={idx !== activeIndex}
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      opacity: idx === activeIndex ? 1 : 0.72,
                      scale: idx === activeIndex ? 1 : 0.985,
                    }
              }
              transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
              style={{ width: viewportWidth > 0 ? viewportWidth : '100%' }}
              className="shrink-0 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-7"
            >
              {/* Ringkasan Singkat & Aksi */}
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                <div className="max-w-[58ch]">
                  <div
                    className="mb-3 h-1 w-12 rounded-full"
                    style={{ backgroundColor: ACCENT_MAP[project.accent] }}
                  />

                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[var(--muted)]">
                    <span className="font-bold text-[var(--text)]">
                      {project.tier === 'utama' ? 'Proyek Utama' : 'Eksperimen'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{project.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{project.year}</span>
                  </div>

                  <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--text)] sm:text-[1.75rem]">
                    {project.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                    {project.summary}
                  </p>

                  <p className="mt-3 font-mono text-xs text-[var(--muted)]">
                    {project.stack.join(' · ')}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2.5 lg:flex-col lg:items-stretch">
                  <button
                    type="button"
                    onClick={() => onOpenDetail(project.slug)}
                    className="m3-btn inline-flex min-h-[42px] items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[var(--action)] px-5 text-sm font-bold text-[var(--on-action)] hover:brightness-110"
                  >
                    <span>Studi Kasus</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="m3-btn inline-flex min-h-[42px] items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[var(--line)] bg-[var(--bg)] px-5 text-sm font-bold text-[var(--text)] no-underline hover:border-[var(--text)] hover:bg-[var(--surface-elevated)]"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Gambar Project (Diperkecil & Terlihat Semua) */}
              <div className="mt-5 border-t border-[var(--line)] pt-5">
                <div
                  className={`grid gap-3 sm:gap-3.5 ${
                    project.screenshots.length > 2
                      ? 'grid-cols-2 sm:grid-cols-4'
                      : 'max-w-[500px] grid-cols-2'
                  }`}
                >
                  {project.screenshots.map((shot) => (
                    <button
                      key={shot.src}
                      type="button"
                      onClick={() =>
                        onPreviewScreenshot?.({
                          ...shot,
                          projectTitle: project.title,
                        })
                      }
                      className="group text-left"
                    >
                      <div className="aspect-video w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[#0b1120] transition-colors group-hover:border-[var(--action)]">
                        <img
                          src={shot.src}
                          alt={shot.alt}
                          loading="lazy"
                          className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                      <p className="mt-1.5 truncate text-[11px] font-semibold text-[var(--muted)] transition-colors group-hover:text-[var(--text)] sm:text-xs">
                        {shot.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/* Controls: Prev/Next arrows + Slide indicator + Segmented color bars */}
      {projects.length > 1 && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => snapToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Project sebelumnya"
            className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line)] bg-[var(--bg)] text-[var(--text)] transition-colors hover:border-[var(--text)] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => snapToIndex(activeIndex + 1)}
            disabled={activeIndex === projects.length - 1}
            aria-label="Project berikutnya"
            className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line)] bg-[var(--bg)] text-[var(--text)] transition-colors hover:border-[var(--text)] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>

          <span className="ml-1 font-mono text-xs font-semibold tabular-nums text-[var(--muted)]">
            0{activeIndex + 1} / 0{projects.length} · Geser ke samping
          </span>

          <div className="ml-auto flex items-center gap-1.5">
            {projects.map((p, idx) => {
              const active = idx === activeIndex;
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => snapToIndex(idx)}
                  aria-label={`Lihat ${p.title}`}
                  aria-current={active ? 'true' : undefined}
                  className="grid h-9 w-10 place-items-center rounded-md sm:w-12"
                >
                  <span className="relative block h-1 w-full overflow-hidden rounded-full bg-[var(--line)]">
                    <motion.span
                      initial={false}
                      animate={{ scaleX: active ? 1 : 0 }}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { duration: 0.3, ease: [0.05, 0.7, 0.1, 1] }
                      }
                      className="absolute inset-0 origin-left"
                      style={{ backgroundColor: ACCENT_MAP[p.accent] }}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
