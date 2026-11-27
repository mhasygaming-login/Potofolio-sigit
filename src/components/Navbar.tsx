import React, { useEffect, useState } from 'react';
import { User, Layers, FolderKanban, Award, Mail } from 'lucide-react';
import { ModeSwitcher } from './ModeSwitcher';

interface NavbarProps {
  isDetailView: boolean;
  onNavigateHome: (sectionId?: string) => void;
}

const NAV_ITEMS = [
  { id: 'tentang', label: 'Tentang', icon: User },
  { id: 'skill', label: 'Keahlian', icon: Layers },
  { id: 'project', label: 'Project', icon: FolderKanban },
  { id: 'pencapaian', label: 'Pencapaian', icon: Award },
  { id: 'kontak', label: 'Kontak', icon: Mail },
];

export const Navbar: React.FC<NavbarProps> = ({ isDetailView, onNavigateHome }) => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    let rafId = 0;

    const updateActiveSection = () => {
      rafId = 0;

      if (isDetailView) {
        setActiveSection('project');
        return;
      }

      const threshold = window.innerHeight * 0.38;
      let current = '';
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= threshold) {
          current = item.id;
        }
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) {
        current = 'kontak';
      }
      setActiveSection(current);
    };

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isDetailView]);

  const handleLinkClick = (e: React.MouseEvent, id?: string) => {
    e.preventDefault();
    onNavigateHome(id);
  };

  return (
    <>
      <header className="theme-surface-transition sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--bg)]/95 pt-[3px] backdrop-blur-md">
        <div className="mx-auto flex h-16 w-[min(1120px,calc(100%-32px))] items-center justify-between gap-4 lg:gap-8">
          {/* Zone 1: Brand Title */}
          <a
            href="#atas"
            onClick={(e) => handleLinkClick(e, 'atas')}
            className="whitespace-nowrap shrink-0 text-base font-extrabold tracking-tight text-[var(--text)] no-underline sm:text-lg"
          >
            Sigit Hasyim Nasution
          </a>

          {/* Zone 2: 5 concise single-line nav links (desktop) */}
          <nav aria-label="Navigasi utama" className="hidden items-center gap-4 md:flex lg:gap-6">
            {NAV_ITEMS.map((item) => {
              const isCurrent = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleLinkClick(e, item.id)}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`whitespace-nowrap shrink-0 text-sm font-medium transition-colors duration-150 ${
                    isCurrent
                      ? 'text-[var(--text)] underline decoration-[var(--action)] decoration-2 underline-offset-8'
                      : 'text-[var(--muted)] hover:text-[var(--text)]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Mode Switcher (desktop) + Primary CTA */}
          <div className="flex shrink-0 items-center gap-2.5">
            <div className="hidden md:block">
              <ModeSwitcher variant="desktop" />
            </div>

            <a
              href="#kontak"
              onClick={(e) => handleLinkClick(e, 'kontak')}
              className="m3-btn whitespace-nowrap shrink-0 rounded-full bg-[var(--action)] px-4 py-2 text-xs font-bold text-[var(--on-action)] no-underline hover:brightness-110 sm:text-sm"
            >
              Hubungi Saya
            </a>
          </div>
        </div>
      </header>

      {/* Mobile compact bottom navigation (<= 15% viewport height) */}
      <nav
        aria-label="Navigasi mobile"
        className="theme-surface-transition fixed bottom-0 left-0 right-0 z-30 flex items-center border-t border-[var(--line)] bg-[var(--bg)]/95 px-1 py-1.5 backdrop-blur-md md:hidden"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isCurrent = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleLinkClick(e, item.id)}
              aria-current={isCurrent ? 'page' : undefined}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1 text-[11px] no-underline transition-colors ${
                isCurrent ? 'font-bold text-[var(--action)]' : 'font-medium text-[var(--muted)]'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span className="whitespace-nowrap">{item.label}</span>
            </a>
          );
        })}

        <ModeSwitcher variant="mobile" />
      </nav>
    </>
  );
};
