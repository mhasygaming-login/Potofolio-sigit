import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeftRight, Check, Copy, ExternalLink } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

const GDG_COLORS = ['#4285f4', '#ea4335', '#fbbc04', '#34a853'];

export const GdgDeveloperCard: React.FC = () => {
  const [showBack, setShowBack] = useState(false);
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = Boolean(useReducedMotion());

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
    <div className="relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)]">
      {/* DevFest Lanyard Slot & 4-Color Google Bar */}
      <div className="border-b border-[var(--line)] bg-[var(--surface-elevated)] px-5 pb-3.5 pt-4">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[var(--line)]" aria-hidden="true" />
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-[var(--text)]">
            {/* Geometric < > GDG motif */}
            <svg aria-hidden="true" viewBox="0 0 28 16" className="h-3.5 w-6 shrink-0" fill="none">
              <path
                d="M9 2L3 8L9 14"
                stroke="#4285f4"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 2L25 8L19 14"
                stroke="#34a853"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{PROFILE.school} · TKJ</span>
          </div>
          <span className="font-mono text-[11px] font-semibold text-[var(--muted)]">DEV PASS</span>
        </div>
      </div>

      {/* 4-Color Divider */}
      <div aria-hidden="true" className="flex h-[3px] w-full">
        {GDG_COLORS.map((color) => (
          <div key={color} className="flex-1" style={{ backgroundColor: color }} />
        ))}
      </div>

      {/* Interactive Card Body */}
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
              <p className="text-xs font-semibold text-[var(--action)]">{PROFILE.headlineRole}</p>
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
                    Teknik Jaringan &amp; Komputer (TKJ)
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-[var(--muted)]">Fokus</dt>
                  <dd className="text-right font-semibold text-[var(--text)]">
                    Web Dev &amp; UI/UX
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
              <p className="text-xs font-semibold text-[var(--action)]">Fokus &amp; Kontak Cepat</p>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted)]">
                React · TypeScript · Figma · MikroTik &amp; Linux
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
    </div>
  );
};
