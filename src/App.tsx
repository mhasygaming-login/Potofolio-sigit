import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Command } from 'lucide-react';
import {
  ACHIEVEMENT,
  CISCO_CERTIFICATE,
  LightboxMedia,
  PROFILE,
  PROJECTS,
  projectMatchesTechnology,
  TechFilterState,
} from './data/portfolioData';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HomeSections } from './components/HomeSections';
import { ProjectDetailPage } from './components/ProjectDetailPage';
import { CommandPalette } from './components/CommandPalette';
import { MediaLightbox } from './components/MediaLightbox';
import { NetworkBackground } from './components/NetworkBackground';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { mode } = useTheme();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState<'utama' | 'semua' | 'eksperimen'>('utama');
  const [techFilter, setTechFilter] = useState<TechFilterState | null>(null);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState<LightboxMedia | null>(null);
  const shouldReduceMotion = Boolean(useReducedMotion());

  const { mainRef, scrollToSection, scrollToTopImmediate, refreshScrollTriggers } = useSmoothScroll({
    shouldReduceMotion,
    isOverlayOpen: Boolean(isCommandOpen || lightboxMedia),
    activeSlug: selectedSlug,
    projectFilter,
    techFilterKey: techFilter ? `${techFilter.excludeSlug}:${techFilter.tech}` : null,
  });

  // Refresh ScrollTrigger measurements when mode toggles (e.g. topology panel height)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      refreshScrollTriggers();
    }, 120);
    return () => window.clearTimeout(timer);
  }, [mode, refreshScrollTriggers]);

  // Pastikan setiap refresh halaman dimulai dari atas serta dukung tombol Back/Forward browser
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

  const activeProject = useMemo(
    () => (selectedSlug ? PROJECTS.find((p) => p.slug === selectedSlug) ?? null : null),
    [selectedSlug]
  );

  const visibleProjects = useMemo(() => {
    if (techFilter) {
      return PROJECTS.filter(
        (p) =>
          p.slug !== techFilter.excludeSlug && projectMatchesTechnology(p, techFilter.tech)
      );
    }
    if (projectFilter === 'semua') return PROJECTS;
    return PROJECTS.filter((p) => p.tier === projectFilter);
  }, [projectFilter, techFilter]);

  const openProjectDetail = (slug: string) => {
    window.history.pushState(
      { projectSlug: slug },
      '',
      window.location.pathname + window.location.search
    );
    setSelectedSlug(slug);
    scrollToTopImmediate();
  };

  const navigateHome = (sectionId?: string) => {
    if (selectedSlug) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      setSelectedSlug(null);
      window.setTimeout(() => {
        refreshScrollTriggers();
        scrollToSection(sectionId);
      }, 60);
    } else {
      scrollToSection(sectionId);
    }
  };

  const handleFilterByTechnology = (tech: string, sourceProject: { slug: string; title: string }) => {
    setTechFilter({
      tech,
      excludeSlug: sourceProject.slug,
      sourceTitle: sourceProject.title,
    });
    navigateHome('project');
  };

  const handleChangeTierFilter = (filter: 'utama' | 'semua' | 'eksperimen') => {
    setTechFilter(null);
    setProjectFilter(filter);
  };

  return (
    <div className="theme-surface-transition relative min-h-screen bg-[var(--bg)] pb-16 text-[var(--text)] md:pb-0">
      <NetworkBackground isDetailView={Boolean(activeProject)} />

      <div className="relative z-10">
        <ScrollProgressBar />
        <Navbar isDetailView={Boolean(activeProject)} onNavigateHome={navigateHome} />

      {activeProject ? (
        <ProjectDetailPage
          project={activeProject}
          onBack={() => {
            setTechFilter(null);
            navigateHome('project');
          }}
          onSelectProject={openProjectDetail}
          onSelectTechnology={(tech) =>
            handleFilterByTechnology(tech, {
              slug: activeProject.slug,
              title: activeProject.title,
            })
          }
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
        <main ref={mainRef}>
          <Hero
            onExploreProjects={() => navigateHome('project')}
            onContact={() => navigateHome('kontak')}
            onOpenCommandPalette={() => setIsCommandOpen(true)}
          />
          <HomeSections
            projectFilter={projectFilter}
            onChangeFilter={handleChangeTierFilter}
            techFilter={techFilter}
            onClearTechFilter={() => setTechFilter(null)}
            onSwitchToAllProjects={() => {
              setTechFilter(null);
              setProjectFilter('semua');
            }}
            visibleProjects={visibleProjects}
            onOpenProjectDetail={openProjectDetail}
            onOpenLightbox={setLightboxMedia}
          />
        </main>
      )}

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onNavigateSection={(id) => navigateHome(id)}
        onOpenProject={openProjectDetail}
        onOpenCiscoCertificate={() => setLightboxMedia(CISCO_CERTIFICATE.previewImage)}
        onOpenCertificate={() => setLightboxMedia(ACHIEVEMENT.documents[0])}
      />

      <MediaLightbox media={lightboxMedia} onClose={() => setLightboxMedia(null)} />

      <footer className="border-t border-[var(--line)] py-8 text-sm text-[var(--muted)]">
        <div className="mx-auto flex w-[min(1120px,calc(100%-32px))] flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {PROFILE.name} · {PROFILE.school}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs">{PROFILE.major}</span>
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
    </div>
  );
}
