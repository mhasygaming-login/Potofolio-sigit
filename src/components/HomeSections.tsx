import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Award,
  Check,
  Copy,
  ExternalLink,
  Instagram,
  Layers,
  Mail,
  Network,
  Palette,
  X,
} from 'lucide-react';
import {
  ACCENT_HEX_MAP,
  AccentColor,
  ACHIEVEMENT,
  CISCO_CERTIFICATE,
  LightboxMedia,
  PROFILE,
  ProjectItem,
  SKILL_GROUPS,
  TechFilterState,
  TOOLS_AND_PLATFORMS,
} from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';
import { SectionHeading } from './SectionHeading';
import { TkjIdentityCard } from './TkjIdentityCard';
import { ProjectCarousel } from './ProjectCarousel';

const NETWORK_ACCENT_HEX_MAP: Record<AccentColor, string> = {
  blue: '#2685FF',
  red: '#37DFFF',
  yellow: '#36D982',
  green: '#36D982',
};

interface HomeSectionsProps {
  projectFilter: 'utama' | 'semua' | 'eksperimen';
  onChangeFilter: (filter: 'utama' | 'semua' | 'eksperimen') => void;
  techFilter: TechFilterState | null;
  onClearTechFilter: () => void;
  onSwitchToAllProjects: () => void;
  visibleProjects: ProjectItem[];
  onOpenProjectDetail: (slug: string) => void;
  onOpenLightbox: (media: LightboxMedia) => void;
}

export const HomeSections: React.FC<HomeSectionsProps> = ({
  projectFilter,
  onChangeFilter,
  techFilter,
  onClearTechFilter,
  onSwitchToAllProjects,
  visibleProjects,
  onOpenProjectDetail,
  onOpenLightbox,
}) => {
  const { isNetworkMode } = useTheme();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const shouldReduceMotion = Boolean(useReducedMotion());
  const accentMap = isNetworkMode ? NETWORK_ACCENT_HEX_MAP : ACCENT_HEX_MAP;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      setCopiedEmail(false);
    }
  };

  return (
    <>
      {/* TENTANG SAYA */}
      <section id="tentang" className="border-t border-[var(--line)] py-16 sm:py-24">
        <div className="mx-auto w-[min(1120px,calc(100%-32px))]">
          <SectionHeading title="Tentang saya" color={accentMap.blue} sectionKey="tentang" />

          <div className="mt-8 grid grid-cols-1 items-start gap-8 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <TkjIdentityCard />
            </div>

            <div className="space-y-4 md:col-span-7">
              {PROFILE.aboutParagraphs.map((paragraph, idx) => (
                <p
                  key={idx}
                  data-gsap-fade
                  className={`max-w-[65ch] text-base leading-relaxed sm:text-lg ${
                    idx === 0 ? 'font-medium text-[var(--text)]' : 'text-[var(--muted)]'
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* KEAHLIAN & TOOLS */}
      <section id="skill" className="border-t border-[var(--line)] py-16 sm:py-24">
        <div className="mx-auto w-[min(1120px,calc(100%-32px))]">
          <SectionHeading title="Keahlian" color={accentMap.red} sectionKey="keahlian" />

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {SKILL_GROUPS.map((group, idx) => {
              const Icon =
                group.id === 'tkj-network'
                  ? Network
                  : group.id === 'ui-ux'
                    ? Palette
                    : Layers;

              return (
                <motion.article
                  key={group.id}
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
                      : { duration: 0.95, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }
                  }
                  className="theme-surface-transition relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]/95 p-6 transition-[border-color,background-color,box-shadow] duration-200 hover:border-[var(--action)]/60 hover:shadow-md"
                >
                  <div
                    aria-hidden="true"
                    className="absolute left-0 right-0 top-0 h-[3px] transition-colors duration-300"
                    style={{ backgroundColor: accentMap[group.accent] }}
                  />

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-[var(--text)]" aria-hidden="true" />
                      <h3 className="text-lg font-extrabold text-[var(--text)]">{group.title}</h3>
                    </div>
                    <span className="text-xs font-medium text-[var(--muted)]">{group.roleTag}</span>
                  </div>

                  <ul className="mt-4 space-y-3">
                    {group.items.map((item) => (
                      <li key={item.name}>
                        <p className="text-sm font-bold text-[var(--text)]">{item.name}</p>
                        <p className="text-xs text-[var(--muted)]">{item.detail}</p>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              );
            })}
          </div>

          {/* Tools & Platform */}
          <div className="mt-10 border-t border-[var(--line)] pt-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {TOOLS_AND_PLATFORMS.map((tool, idx) => (
                <motion.div
                  key={tool.name}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.16 }}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : { y: -2, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }
                  }
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 0.85, delay: idx * 0.09, ease: [0.16, 1, 0.3, 1] }
                  }
                  className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3.5 py-3 transition-colors hover:border-[var(--action)]/60"
                >
                  <p className="text-xs text-[var(--muted)]">{tool.category}</p>
                  <p className="mt-0.5 text-sm font-bold text-[var(--text)]">{tool.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT SHOWCASE */}
      <section id="project" className="border-t border-[var(--line)] py-16 sm:py-24">
        <div className="mx-auto w-[min(1120px,calc(100%-32px))]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionHeading
                title="Project & Studi Kasus"
                color={accentMap.yellow}
                sectionKey="project"
              />
              <p data-gsap-fade className="max-w-[54ch] text-sm text-[var(--muted)] sm:text-base">
                Kumpulan website latihan yang saya rancang terlebih dahulu di Figma lalu saya bangun
                sebagai sarana belajar di luar materi jaringan.
              </p>
            </div>

            <div
              data-gsap-fade
              role="group"
              aria-label="Filter kategori project"
              className="inline-flex shrink-0 self-start rounded-xl border border-[var(--line)] bg-[var(--surface)] p-1"
            >
              {[
                { key: 'utama' as const, label: 'Utama (3)' },
                { key: 'semua' as const, label: 'Semua (4)' },
                { key: 'eksperimen' as const, label: 'Eksperimen (1)' },
              ].map((tab) => {
                const isActive = !techFilter && projectFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => onChangeFilter(tab.key)}
                    aria-pressed={isActive}
                    className={`whitespace-nowrap shrink-0 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-[var(--bg)] text-[var(--text)] shadow-sm'
                        : 'text-[var(--muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {techFilter && (
            <div
              role="status"
              aria-live="polite"
              className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <span className="font-medium text-[var(--muted)]">Filter teknologi:</span>
                <span className="rounded-md bg-[var(--action)]/12 px-2 py-0.5 font-mono font-bold text-[var(--action)]">
                  {techFilter.tech}
                </span>
                <span className="text-[var(--muted)]">
                  · {visibleProjects.length} proyek lain ditemukan (selain{' '}
                  <span className="font-semibold text-[var(--text)]">{techFilter.sourceTitle}</span>)
                </span>
              </div>

              <button
                type="button"
                onClick={onClearTechFilter}
                className="m3-btn inline-flex min-h-[34px] items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--bg)] px-3.5 text-xs font-bold text-[var(--text)] hover:border-[var(--text)] hover:bg-[var(--surface-elevated)]"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Hapus filter</span>
              </button>
            </div>
          )}

          {visibleProjects.length > 0 ? (
            <ProjectCarousel
              projects={visibleProjects}
              activeTechFilter={techFilter?.tech ?? null}
              onOpenDetail={onOpenProjectDetail}
              onPreviewScreenshot={(shot) =>
                onOpenLightbox({
                  title: shot.projectTitle,
                  caption: shot.label,
                  src: shot.src,
                  alt: shot.alt,
                })
              }
            />
          ) : (
            <div className="mt-8 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center">
              <p className="text-base font-extrabold text-[var(--text)] sm:text-lg">
                Belum ada proyek lain yang menggunakan{' '}
                <span className="font-mono text-[var(--action)]">{techFilter?.tech}</span>
              </p>
              <p className="mx-auto mt-2 max-w-[50ch] text-sm text-[var(--muted)]">
                Saat ini hanya{' '}
                <span className="font-semibold text-[var(--text)]">{techFilter?.sourceTitle}</span>{' '}
                yang menggunakan teknologi tersebut di daftar portofolio ini.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onSwitchToAllProjects}
                  className="m3-btn inline-flex min-h-[40px] items-center rounded-full bg-[var(--action)] px-5 text-xs font-bold text-[var(--on-action)] hover:brightness-110 sm:text-sm"
                >
                  Tampilkan Semua Proyek
                </button>
                {techFilter && (
                  <button
                    type="button"
                    onClick={() => onOpenProjectDetail(techFilter.excludeSlug)}
                    className="m3-btn inline-flex min-h-[40px] items-center rounded-full border border-[var(--line)] bg-[var(--bg)] px-5 text-xs font-bold text-[var(--text)] hover:border-[var(--text)] sm:text-sm"
                  >
                    Kembali ke {techFilter.sourceTitle}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PENCAPAIAN & SERTIFIKAT */}
      <section id="pencapaian" className="border-t border-[var(--line)] py-16 sm:py-24">
        <div className="mx-auto w-[min(1120px,calc(100%-32px))]">
          <SectionHeading
            title="Pencapaian & Sertifikat"
            color={accentMap.green}
            sectionKey="pencapaian"
          />

          <div className="mt-8 space-y-6">
            {/* 1. Cisco Networking Academy — Networking Basics */}
            <motion.article
              initial={shouldReduceMotion ? false : { opacity: 0, y: 48, scale: 0.975 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.14 }}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : { y: -4, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }
              }
              transition={
                shouldReduceMotion ? { duration: 0 } : { duration: 0.95, ease: [0.16, 1, 0.3, 1] }
              }
              className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 transition-[border-color,box-shadow] duration-200 hover:border-[var(--action)]/45 hover:shadow-md sm:p-8 lg:grid-cols-12"
            >
              <div className="lg:col-span-5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[var(--muted)]">
                  <Award
                    className="h-4 w-4 shrink-0 text-[#1a73e8] dark:text-[#8ab4f8]"
                    aria-hidden="true"
                  />
                  <span>Cisco Networking Academy</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{CISCO_CERTIFICATE.issuedDate}</span>
                  <span aria-hidden="true">·</span>
                  <span>{CISCO_CERTIFICATE.totalHours}</span>
                </div>

                <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-[var(--text)]">
                  {CISCO_CERTIFICATE.title.split(' — ')[0]}
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                  {CISCO_CERTIFICATE.summary}
                </p>

                <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
                  <span className="font-semibold text-[var(--text)]">Materi:</span>{' '}
                  {CISCO_CERTIFICATE.skillsLine}
                </p>

                <dl className="mt-5 space-y-2.5 border-t border-[var(--line)] pt-5 text-xs sm:text-sm">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[var(--muted)]">Nama di Sertifikat</dt>
                    <dd className="font-semibold text-[var(--text)]">
                      {CISCO_CERTIFICATE.recipientName}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[var(--muted)]">Institusi</dt>
                    <dd className="text-right font-semibold text-[var(--text)]">
                      {PROFILE.school}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[var(--muted)]">Instruktur</dt>
                    <dd className="text-right font-semibold text-[var(--text)]">
                      {CISCO_CERTIFICATE.instructor}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="lg:col-span-7">
                <motion.button
                  type="button"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => onOpenLightbox(CISCO_CERTIFICATE.previewImage)}
                  className="group block w-full text-left"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-white transition-colors group-hover:border-[var(--action)]">
                    <img
                      src={CISCO_CERTIFICATE.previewImage.src}
                      alt={CISCO_CERTIFICATE.previewImage.alt}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.015]"
                    />
                  </div>
                </motion.button>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold text-[var(--text)]">
                    Sertifikat Kelulusan{' '}
                    <span className="font-normal text-[var(--muted)]">
                      · Klik gambar untuk perbesar
                    </span>
                  </p>

                  <a
                    href={CISCO_CERTIFICATE.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="m3-btn inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--bg)] px-3.5 text-xs font-bold text-[var(--text)] no-underline hover:border-[var(--text)] hover:bg-[var(--surface-elevated)]"
                  >
                    <span>Buka PDF Sertifikat</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </motion.article>

            {/* 2. Data Detective Bootcamp 2026 — SBM ITB */}
            <motion.article
              initial={shouldReduceMotion ? false : { opacity: 0, y: 48, scale: 0.975 }}
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
                  : { duration: 0.95, delay: 0.1, ease: [0.16, 1, 0.3, 1] }
              }
              className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 transition-[border-color,box-shadow] duration-200 hover:border-[var(--action)]/45 hover:shadow-md sm:p-8 lg:grid-cols-12"
            >
              <div className="lg:col-span-5">
                <div className="flex items-center gap-2.5 text-xs font-medium text-[var(--muted)]">
                  <Award className="h-4 w-4 shrink-0 text-[#34a853]" aria-hidden="true" />
                  <span>SSBDA SBM ITB · 12 Sep – 7 Nov 2026</span>
                </div>

                <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-[var(--text)]">
                  Data Detective Bootcamp 2026
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                  Menyelesaikan 6 modul pelatihan Business Analytics (Marketing, Finance, dan
                  Dashboard) hingga wisuda di SBM ITB, Bandung.
                </p>

                <dl className="mt-6 space-y-2.5 border-t border-[var(--line)] pt-5 text-xs sm:text-sm">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[var(--muted)]">Status</dt>
                    <dd className="font-semibold text-[var(--text)]">Certificate of Completion</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[var(--muted)]">Nama di Sertifikat</dt>
                    <dd className="font-semibold text-[var(--text)]">Tim Gokfive</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[var(--muted)]">Penyelenggara</dt>
                    <dd className="font-semibold text-[var(--text)]">SSBDA Lab, SBM ITB</dd>
                  </div>
                </dl>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 lg:col-span-7">
                <motion.button
                  type="button"
                  whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => onOpenLightbox(ACHIEVEMENT.documents[0])}
                  className="group text-left sm:col-span-8"
                >
                  <div className="aspect-[16/11] w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg)] transition-colors group-hover:border-[var(--action)]">
                    <img
                      src={ACHIEVEMENT.documents[0].src}
                      alt={ACHIEVEMENT.documents[0].alt}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-[var(--text)]">
                    Sertifikat Kelulusan{' '}
                    <span className="font-normal text-[var(--muted)]">· Klik untuk perbesar</span>
                  </p>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => onOpenLightbox(ACHIEVEMENT.documents[1])}
                  className="group text-left sm:col-span-4"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg)] transition-colors group-hover:border-[var(--action)]">
                    <img
                      src={ACHIEVEMENT.documents[1].src}
                      alt={ACHIEVEMENT.documents[1].alt}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-[var(--text)]">Wisuda SBM ITB</p>
                </motion.button>
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* KONTAK */}
      <section
        id="kontak"
        className="relative overflow-x-clip border-t border-[var(--line)] py-16 sm:py-24"
      >
        <div
          aria-hidden="true"
          className="dot-grid-canvas pointer-events-none absolute inset-0 -z-10"
        />
        <div className="mx-auto grid w-[min(1120px,calc(100%-32px))] grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeading title="Mari terhubung" color={accentMap.blue} sectionKey="kontak" />
            <p
              data-gsap-fade
              className="max-w-[44ch] text-sm leading-relaxed text-[var(--muted)] sm:text-base"
            >
              Terbuka untuk berdiskusi seputar jaringan komputer, desain UI/UX di Figma, maupun
              latihan pembuatan website. Anda dapat menghubungi saya langsung melalui email atau
              Instagram di samping.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-6 md:col-span-7 md:border-l md:border-[var(--line)] md:pl-10">
            <div
              data-gsap-fade
              className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-6"
            >
              <div>
                <p className="text-xs font-semibold text-[var(--muted)]">Email Aktif</p>
                <p className="mt-1 font-mono text-base font-bold text-[var(--text)]">
                  {PROFILE.email}
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="m3-btn inline-flex min-h-[42px] items-center gap-2 whitespace-nowrap rounded-full bg-[var(--action)] px-4 text-xs font-bold text-[var(--on-action)] no-underline hover:brightness-110 sm:text-sm"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <span>Kirim Email</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="m3-btn inline-flex min-h-[42px] items-center gap-2 whitespace-nowrap rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 text-xs font-bold text-[var(--text)] hover:border-[var(--text)] sm:text-sm"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="h-4 w-4 text-[#34a853]" aria-hidden="true" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div data-gsap-fade className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[var(--muted)]">Instagram</p>
                <p className="mt-1 font-mono text-base font-bold text-[var(--text)]">
                  {PROFILE.instagram.handle}
                </p>
              </div>

              <a
                href={PROFILE.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="m3-btn inline-flex min-h-[42px] items-center gap-2 whitespace-nowrap rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 text-xs font-bold text-[var(--text)] no-underline hover:border-[var(--text)] sm:text-sm"
              >
                <Instagram className="h-4 w-4 text-[#ea4335]" aria-hidden="true" />
                <span>Buka Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
