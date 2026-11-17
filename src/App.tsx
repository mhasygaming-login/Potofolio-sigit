import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Check,
  Command,
  Copy,
  Instagram,
  Layers,
  Mail,
  Palette,
  Shield,
  X,
} from 'lucide-react';
import {
  ACHIEVEMENT,
  AccentColor,
  PROFILE,
  PROJECTS,
  SKILL_GROUPS,
  TOOLS_AND_PLATFORMS,
} from './data/portfolioData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectCarousel } from './components/ProjectCarousel';
import { ProjectDetailPage } from './components/ProjectDetailPage';
import { GdgDeveloperCard } from './components/GdgDeveloperCard';
import { CommandPalette } from './components/CommandPalette';

const ACCENT_MAP: Record<AccentColor, string> = {
  blue: '#4285f4',
  red: '#ea4335',
  yellow: '#fbbc04',
  green: '#34a853',
};

const SectionHeading: React.FC<{ title: string; color: string; id?: string }> = ({
  title,
  color,
  id,
}) => (
  <div className="mb-6">
    <div className="flex items-center gap-3">
      {/* Geometric < > bracket motif echoing the Hero emblem */}
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
      aria-hidden="true"
      className="mt-3 h-1 w-14 rounded-full"
      style={{ backgroundColor: color }}
    />
  </div>
);

export default function App() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState<'utama' | 'semua' | 'eksperimen'>('utama');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState<{
    title: string;
    caption: string;
    src: string;
    alt: string;
  } | null>(null);

  // Pastikan setiap refresh/restart landing page selalu dimulai dari halaman utama paling atas
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });

    const onPopState = (e: PopStateEvent) => {
      const slug = e.state && typeof e.state.projectSlug === 'string' ? e.state.projectSlug : null;
      setSelectedSlug(slug && PROJECTS.some((p) => p.slug === slug) ? slug : null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Pintasan keyboard global Ctrl/Cmd + K untuk Command Palette
  useEffect(() => {
    const onGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setLightboxMedia(null);
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onGlobalKeyDown);
    return () => window.removeEventListener('keydown', onGlobalKeyDown);
  }, []);

  useEffect(() => {
    if (!lightboxMedia) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxMedia(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxMedia]);

  const activeProject = useMemo(
    () => (selectedSlug ? PROJECTS.find((p) => p.slug === selectedSlug) ?? null : null),
    [selectedSlug]
  );

  const visibleProjects = useMemo(() => {
    if (projectFilter === 'semua') return PROJECTS;
    return PROJECTS.filter((p) => p.tier === projectFilter);
  }, [projectFilter]);

  const openProjectDetail = (slug: string) => {
    window.history.pushState({ projectSlug: slug }, '', window.location.pathname + window.location.search);
    setSelectedSlug(slug);
  };

  const navigateHome = (sectionId?: string) => {
    if (selectedSlug) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      setSelectedSlug(null);
      window.setTimeout(() => {
        if (sectionId && sectionId !== 'atas') {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 40);
    } else if (sectionId && sectionId !== 'atas') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
    <div className="min-h-screen bg-[var(--bg)] pb-16 text-[var(--text)] md:pb-0">
      <Navbar isDetailView={Boolean(activeProject)} onNavigateHome={navigateHome} />

      {activeProject ? (
        <ProjectDetailPage
          project={activeProject}
          onBack={() => navigateHome('project')}
          onSelectProject={openProjectDetail}
          onPreviewScreenshot={(shot) =>
            setLightboxMedia({
              title: shot.projectTitle,
              caption: shot.label,
              src: shot.src,
              alt: shot.alt,
            })
          }
        />
      ) : (
        <main>
          <Hero
            onExploreProjects={() => navigateHome('project')}
            onContact={() => navigateHome('kontak')}
            onOpenCommandPalette={() => setIsCommandOpen(true)}
          />

          {/* TENTANG SAYA (termasuk Kartu ID Developer GDG Bogor interaktif) */}
          <section id="tentang" className="border-t border-[var(--line)] py-16 sm:py-24">
            <div className="mx-auto w-[min(1120px,calc(100%-32px))]">
              <SectionHeading title="Tentang saya" color={ACCENT_MAP.blue} />

              <div className="mt-8 grid grid-cols-1 items-start gap-8 md:grid-cols-12 md:gap-12">
                <div className="md:col-span-5">
                  <GdgDeveloperCard />
                </div>

                <div className="space-y-4 md:col-span-7">
                  {PROFILE.aboutParagraphs.map((paragraph, idx) => (
                    <p
                      key={idx}
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

          {/* KEAHLIAN & TOOLS (Ringkas & To The Point) */}
          <section id="skill" className="border-t border-[var(--line)] py-16 sm:py-24">
            <div className="mx-auto w-[min(1120px,calc(100%-32px))]">
              <SectionHeading title="Keahlian" color={ACCENT_MAP.red} />

              <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-3">
                {SKILL_GROUPS.map((group) => {
                  const Icon =
                    group.id === 'web-dev'
                      ? Layers
                      : group.id === 'ui-ux'
                        ? Palette
                        : Shield;

                  return (
                    <article key={group.id} className="relative pt-5">
                      <div
                        aria-hidden="true"
                        className="absolute left-0 right-0 top-0 h-[3px] rounded-full"
                        style={{ backgroundColor: ACCENT_MAP[group.accent] }}
                      />

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-[var(--text)]" aria-hidden="true" />
                          <h3 className="text-lg font-extrabold text-[var(--text)]">
                            {group.title}
                          </h3>
                        </div>
                        <span className="text-xs font-medium text-[var(--muted)]">
                          {group.roleTag}
                        </span>
                      </div>

                      <ul className="mt-4 space-y-3">
                        {group.items.map((item) => (
                          <li key={item.name}>
                            <p className="text-sm font-bold text-[var(--text)]">{item.name}</p>
                            <p className="text-xs text-[var(--muted)]">{item.detail}</p>
                          </li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>

              {/* Tools & Platform */}
              <div className="mt-10 border-t border-[var(--line)] pt-6">
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                  {TOOLS_AND_PLATFORMS.map((tool) => (
                    <div key={tool.name}>
                      <p className="text-xs text-[var(--muted)]">{tool.category}</p>
                      <p className="mt-0.5 text-sm font-bold text-[var(--text)]">{tool.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* PROJECT SHOWCASE (Horizontal Swipeable Carousel) */}
          <section id="project" className="border-t border-[var(--line)] py-16 sm:py-24">
            <div className="mx-auto w-[min(1120px,calc(100%-32px))]">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <SectionHeading title="Project & Studi Kasus" color={ACCENT_MAP.yellow} />
                  <p className="max-w-[54ch] text-sm text-[var(--muted)] sm:text-base">
                    Proyek web utama dan eksperimen pilihan. Geser kartu untuk melihat tampilan dan
                    ringkasan solusinya.
                  </p>
                </div>

                <div
                  role="group"
                  aria-label="Filter kategori project"
                  className="inline-flex shrink-0 self-start rounded-xl border border-[var(--line)] bg-[var(--surface)] p-1"
                >
                  {[
                    { key: 'utama' as const, label: 'Utama (3)' },
                    { key: 'semua' as const, label: 'Semua (4)' },
                    { key: 'eksperimen' as const, label: 'Eksperimen (1)' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setProjectFilter(tab.key)}
                      aria-pressed={projectFilter === tab.key}
                      className={`whitespace-nowrap shrink-0 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
                        projectFilter === tab.key
                          ? 'bg-[var(--bg)] text-[var(--text)] shadow-sm'
                          : 'text-[var(--muted)] hover:text-[var(--text)]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <ProjectCarousel
                projects={visibleProjects}
                onOpenDetail={openProjectDetail}
                onPreviewScreenshot={(shot) =>
                  setLightboxMedia({
                    title: shot.projectTitle,
                    caption: shot.label,
                    src: shot.src,
                    alt: shot.alt,
                  })
                }
              />
            </div>
          </section>

          {/* PENCAPAIAN */}
          <section id="pencapaian" className="border-t border-[var(--line)] py-16 sm:py-24">
            <div className="mx-auto w-[min(1120px,calc(100%-32px))]">
              <SectionHeading title="Pencapaian & Sertifikat" color={ACCENT_MAP.green} />

              <article className="mt-8 grid grid-cols-1 items-center gap-8 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8 lg:grid-cols-12">
                {/* Left: Ringkasan Singkat & Terstruktur */}
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
                      <dd className="font-semibold text-[var(--text)]">
                        Certificate of Completion
                      </dd>
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

                {/* Right: Bukti Visual Bersih (Klik untuk Perbesar) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 lg:col-span-7">
                  <button
                    type="button"
                    onClick={() => setLightboxMedia(ACHIEVEMENT.documents[0])}
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
                      Sertifikat Kelulusan <span className="font-normal text-[var(--muted)]">· Klik untuk perbesar</span>
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLightboxMedia(ACHIEVEMENT.documents[1])}
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
                    <p className="mt-2 text-xs font-semibold text-[var(--text)]">
                      Wisuda SBM ITB
                    </p>
                  </button>
                </div>
              </article>
            </div>
          </section>

          {/* KONTAK (Clean, minimal, hanya kanal aktif) */}
          <section
            id="kontak"
            className="relative overflow-x-clip border-t border-[var(--line)] py-16 sm:py-24"
          >
            <div aria-hidden="true" className="gdg-dot-grid pointer-events-none absolute inset-0 -z-10" />
            <div className="mx-auto grid w-[min(1120px,calc(100%-32px))] grid-cols-1 gap-10 md:grid-cols-12">
              <div className="md:col-span-5">
                <SectionHeading title="Mari terhubung" color={ACCENT_MAP.blue} />
                <p className="max-w-[44ch] text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                  Terbuka untuk diskusi proyek web development, desain UI/UX, atau kolaborasi belajar.
                  Seluruh jalur di samping aktif dan terhubung langsung.
                </p>
              </div>

              <div className="flex flex-col justify-center gap-6 md:col-span-7 md:border-l md:border-[var(--line)] md:pl-10">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-6">
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
                      className="m3-btn inline-flex min-h-[42px] items-center gap-2 whitespace-nowrap rounded-full border border-[var(--line)] bg-[var(--bg)] px-4 text-xs font-bold text-[var(--text)] hover:border-[var(--text)] hover:bg-[var(--surface)] sm:text-sm"
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

                <div className="flex flex-wrap items-center justify-between gap-4">
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
                    className="m3-btn inline-flex min-h-[42px] items-center gap-2 whitespace-nowrap rounded-full border border-[var(--line)] bg-[var(--bg)] px-4 text-xs font-bold text-[var(--text)] no-underline hover:border-[var(--text)] hover:bg-[var(--surface)] sm:text-sm"
                  >
                    <Instagram className="h-4 w-4 text-[#ea4335]" aria-hidden="true" />
                    <span>Buka Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Command Palette (Ctrl/Cmd + K) */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onNavigateSection={(id) => navigateHome(id)}
        onOpenProject={openProjectDetail}
        onOpenCertificate={() => setLightboxMedia(ACHIEVEMENT.documents[0])}
      />

      {/* Fullscreen Lightbox for Project Screenshots & Achievement Certificates */}
      {lightboxMedia && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxMedia.title}
          onClick={() => setLightboxMedia(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-[var(--bg)] p-4 shadow-2xl"
          >
            <div className="mb-3 flex items-center justify-between gap-4 border-b border-[var(--line)] pb-3">
              <div>
                <p className="text-sm font-bold text-[var(--text)]">{lightboxMedia.title}</p>
                <p className="text-xs text-[var(--muted)]">{lightboxMedia.caption}</p>
              </div>
              <button
                type="button"
                onClick={() => setLightboxMedia(null)}
                aria-label="Tutup pratinjau gambar"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--line)] text-[var(--text)] hover:border-[var(--text)]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-xl bg-[var(--surface)] p-2">
              <img
                src={lightboxMedia.src}
                alt={lightboxMedia.alt}
                className="max-h-[74vh] w-auto max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-[var(--line)] py-8 text-sm text-[var(--muted)]">
        <div className="mx-auto flex w-[min(1120px,calc(100%-32px))] flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {PROFILE.name} · {PROFILE.school}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs">
              {PROFILE.major}
            </span>
            <button
              type="button"
              onClick={() => setIsCommandOpen(true)}
              className="m3-btn inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--text)] hover:border-[var(--text)]"
            >
              <Command className="h-3 w-3 text-[var(--action)]" aria-hidden="true" />
              <span>Ctrl+K</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
