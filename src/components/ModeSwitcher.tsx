import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, ChevronDown, Globe, Network } from 'lucide-react';
import { PortfolioMode, useTheme } from '../context/ThemeContext';

interface ModeSwitcherProps {
  variant?: 'desktop' | 'mobile';
}

interface ModeOption {
  id: PortfolioMode;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MODE_OPTIONS: ModeOption[] = [
  {
    id: 'gdg',
    label: 'GDG Bogor',
    shortLabel: 'GDG Bogor',
    description: 'Professional Community Experience',
    icon: Globe,
  },
  {
    id: 'network',
    label: 'Network Mode',
    shortLabel: 'Network Mode',
    description: 'Interactive Networking Experience',
    icon: Network,
  },
];

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ variant = 'desktop' }) => {
  const { mode, setMode, playTone } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const shouldReduceMotion = Boolean(useReducedMotion());

  const activeOption = MODE_OPTIONS.find((opt) => opt.id === mode) ?? MODE_OPTIONS[0];
  const ActiveIcon = activeOption.icon;

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectMode = (nextMode: PortfolioMode) => {
    setMode(nextMode);
    playTone('switch');
    setIsOpen(false);
  };

  const isMobile = variant === 'mobile';

  return (
    <div ref={containerRef} className={isMobile ? 'relative flex flex-1 justify-center' : 'relative'}>
      {isMobile ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-controls={menuId}
          aria-label={`Pilih mode tampilan, saat ini ${activeOption.label}`}
          className={`flex w-full flex-col items-center justify-center gap-0.5 rounded-lg py-1 text-[11px] transition-colors ${
            isOpen || mode === 'network'
              ? 'font-bold text-[var(--action)]'
              : 'font-medium text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          <ActiveIcon className="h-4 w-4" aria-hidden="true" />
          <span className="whitespace-nowrap">Mode</span>
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-controls={menuId}
          aria-label={`Mode tampilan: ${activeOption.label}. Klik untuk mengganti mode`}
          className="m3-btn inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--line)] bg-[var(--surface)]/75 px-3 text-xs font-semibold text-[var(--text)] hover:border-[var(--action)]/60 hover:bg-[var(--surface)]"
        >
          <ActiveIcon className="h-3.5 w-3.5 shrink-0 text-[var(--action)]" aria-hidden="true" />
          <span>{activeOption.shortLabel}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 text-[var(--muted)] transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={menuId}
            role="menu"
            aria-label="Pilihan mode pengalaman portofolio"
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: isMobile ? 6 : -6, scale: 0.97 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduceMotion
                ? undefined
                : { opacity: 0, y: isMobile ? 6 : -6, scale: 0.97 }
            }
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: [0.16, 1, 0.3, 1] }
            }
            className={`z-50 w-[268px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-elevated)] p-1.5 shadow-xl ${
              isMobile ? 'fixed bottom-[64px] right-3' : 'absolute right-0 top-full mt-2'
            }`}
          >
            <p className="px-2.5 pb-1.5 pt-1 text-[11px] font-bold text-[var(--muted)]">
              Pengalaman Visual
            </p>

            <div className="space-y-1">
              {MODE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isActive = option.id === mode;

                return (
                  <button
                    key={option.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={isActive}
                    onClick={() => handleSelectMode(option.id)}
                    className={`flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition-colors ${
                      isActive
                        ? 'bg-[var(--surface-tonal)] text-[var(--surface-tonal-text)]'
                        : 'text-[var(--text)] hover:bg-[var(--surface)]'
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border ${
                        isActive
                          ? 'border-[var(--action)]/40 bg-[var(--bg)]/60 text-[var(--action)]'
                          : 'border-[var(--line)] bg-[var(--bg)] text-[var(--muted)]'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span
                          className={`truncate text-xs font-bold ${
                            isActive ? 'text-[var(--text)]' : ''
                          }`}
                        >
                          {option.label}
                        </span>
                        {isActive && (
                          <Check
                            className="h-3.5 w-3.5 shrink-0 text-[var(--action)]"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-[var(--muted)]">
                        {option.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
