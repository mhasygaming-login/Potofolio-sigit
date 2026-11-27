import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeftRight, Check, Copy, ExternalLink } from 'lucide-react';
import { BRAND_COLORS, NETWORK_BRAND_COLORS, PROFILE } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';
import { NetworkCoreMiniMark } from './NetworkCoreEmblem';

export const TkjIdentityCard: React.FC = () => {
  const { isNetworkMode } = useTheme();
  const [showBack, setShowBack] = useState(false);
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = Boolean(useReducedMotion());
  const palette = isNetworkMode ? NETWORK_BRAND_COLORS : BRAND_COLORS;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 46, scale: 0.975 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.14 }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : { y: -4, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.95, ease: [0.16, 1, 0.3, 1] }
      }
      className="theme-surface-transition relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)] transition-[border-color,box-shadow] duration-200 hover:border-[var(--action)]/45 hover:shadow-md"
    >
      {/* Header kartu identitas pelajar TKJ */}
      <div className="theme-surface-transition border-b border-[var(--line)] bg-[var(--surface-elevated)] px-5 pb-3.5 pt-4">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[var(--line)]" aria-hidden="true" />
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-[var(--text)]">
            <span aria-hidden="true" className="relative grid h-4 w-6 shrink-0 place-items-center">
              <AnimatePresence mode="wait" initial={false}>
                {isNetworkMode ? (
                  <motion.span
                    key="network-mini-mark"
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.85 }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                    }
                    className="grid place-items-center"
                  >
                    <NetworkCoreMiniMark className="h-4 w-5 shrink-0" />
                  </motion.span>
                ) : (
                  <motion.svg
                    key="gdg-mini-mark"
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.85 }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                    }
                    viewBox="0 0 28 16"
                    className="h-3.5 w-6 shrink-0"
                    fill="none"
                  >
                    <path
                      d="M9 2L3 8L9 14"
                      stroke={palette[0]}
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19 2L25 8L19 14"
                      stroke={palette[2]}
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                )}
              </AnimatePresence>
            </span>
            <span>{PROFILE.school} · TKJ</span>
          </div>
          <span className="font-mono text-[11px] font-semibold text-[var(--muted)]">TKJ PASS</span>
        </div>
      </div>

      {/* Garis aksen 4 segmen */}
      <div aria-hidden="true" className="flex h-[3px] w-full">
        {palette.map((color, idx) => (
          <div
            key={`${idx}-${color}`}
            className="flex-1 transition-colors duration-300"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Isi kartu interaktif */}
      <div className="p-5 sm:p-6">
        <AnimatePresence mode="wait">
          {!showBack ? (
            <motion.div
              key="front"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18 }}
            >
              <p className="text-xs font-semibold text-[var(--action)]">
                Pelajar Teknik Komputer &amp; Jaringan
              </p>
              <h3 className="mt-1 text-xl font-extrabold tracking-tight text-[var(--text)]">
                {PROFILE.name}
              </h3>

              <dl className="mt-4 space-y-2 border-t border-[var(--line)] pt-4 text-xs">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-[var(--muted)]">Sekolah</dt>
                  <dd className="text-right font-semibold text-[var(--text)]">{PROFILE.school}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-[var(--muted)]">Jurusan</dt>
                  <dd className="text-right font-semibold text-[var(--text)]">
                    Teknik Komputer &amp; Jaringan
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-[var(--muted)]">Minat Lain</dt>
                  <dd className="text-right font-semibold text-[var(--text)]">
                    UI/UX (Figma) &amp; Website
                  </dd>
                </div>
              </dl>
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18 }}
            >
              <p className="text-xs font-semibold text-[var(--action)]">
                Fokus Praktik &amp; Kontak
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted)]">
                MikroTik · Cisco Packet Tracer · Linux Debian 12 · Figma
              </p>

              <div className="mt-4 space-y-2.5 border-t border-[var(--line)] pt-4 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-mono font-semibold text-[var(--text)]">
                    {PROFILE.email}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="m3-btn inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--surface-tonal)] px-3 py-1.5 text-[11px] font-bold text-[var(--surface-tonal-text)] hover:brightness-95"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3" aria-hidden="true" />
                        <span>Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" aria-hidden="true" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[var(--muted)]">{PROFILE.instagram.handle}</span>
                  <a
                    href={PROFILE.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-[var(--action)] no-underline hover:underline"
                  >
                    <span>Instagram</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-5 border-t border-[var(--line)] pt-3.5">
          <button
            type="button"
            onClick={() => setShowBack((prev) => !prev)}
            className="m3-btn inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-xs font-bold text-[var(--text)] hover:border-[var(--text)]"
          >
            <ArrowLeftRight className="h-3.5 w-3.5 text-[var(--action)]" aria-hidden="true" />
            <span>{showBack ? 'Lihat Identitas Kartu' : 'Kontak Cepat & Fokus'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
