import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  Check,
  Copy,
  ExternalLink,
  FolderKanban,
  Globe,
  Layers,
  Mail,
  Network,
  Search,
  User,
  X,
} from 'lucide-react';
import { BRAND_COLORS, NETWORK_BRAND_COLORS, PROFILE, PROJECTS } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenProject: (slug: string) => void;
  onOpenCiscoCertificate: () => void;
  onOpenCertificate: () => void;
}

interface CommandItem {
  id: string;
  group: 'Navigasi Bagian' | 'Studi Kasus Project' | 'Aksi Cepat';
  label: string;
  hint: string;
  keywords: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateSection,
  onOpenProject,
  onOpenCiscoCertificate,
  onOpenCertificate,
}) => {
  const { isNetworkMode, toggleMode } = useTheme();
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const topPalette = isNetworkMode ? NETWORK_BRAND_COLORS : BRAND_COLORS;

  const items = useMemo<CommandItem[]>(() => {
    const sectionItems: CommandItem[] = [
      {
        id: 'nav-atas',
        group: 'Navigasi Bagian',
        label: 'Halaman Utama (Hero)',
        hint: 'Bagian atas',
        keywords: 'hero home atas sigit',
        icon: ArrowRight,
        action: () => {
          onClose();
          onNavigateSection('atas');
        },
      },
      {
        id: 'nav-tentang',
        group: 'Navigasi Bagian',
        label: 'Tentang Saya',
        hint: '#tentang',
        keywords: 'tentang profil sekolah smk madinatul quran tkj teknik jaringan komputer',
        icon: User,
        action: () => {
          onClose();
          onNavigateSection('tentang');
        },
      },
      {
        id: 'nav-skill',
        group: 'Navigasi Bagian',
        label: 'Keahlian & Perangkat',
        hint: '#skill',
        keywords: 'keahlian skill tkj mikrotik cisco packet tracer linux debian 12 figma react',
        icon: Layers,
        action: () => {
          onClose();
          onNavigateSection('skill');
        },
      },
      {
        id: 'nav-project',
        group: 'Navigasi Bagian',
        label: 'Project & Studi Kasus',
        hint: '#project',
        keywords: 'project proyek studi kasus karya',
        icon: FolderKanban,
        action: () => {
          onClose();
          onNavigateSection('project');
        },
      },
      {
        id: 'nav-pencapaian',
        group: 'Navigasi Bagian',
        label: 'Pencapaian & Sertifikat',
        hint: '#pencapaian',
        keywords: 'pencapaian sertifikat itb sbm data detective',
        icon: Award,
        action: () => {
          onClose();
          onNavigateSection('pencapaian');
        },
      },
      {
        id: 'nav-kontak',
        group: 'Navigasi Bagian',
        label: 'Mari Terhubung (Kontak)',
        hint: '#kontak',
        keywords: 'kontak email instagram',
        icon: Mail,
        action: () => {
          onClose();
          onNavigateSection('kontak');
        },
      },
    ];

    const projectItems: CommandItem[] = PROJECTS.map((p) => ({
      id: `proj-${p.slug}`,
      group: 'Studi Kasus Project',
      label: p.title,
      hint: p.category,
      keywords: `${p.title} ${p.subtitle} ${p.stack.join(' ')}`,
      icon: FolderKanban,
      action: () => {
        onClose();
        onOpenProject(p.slug);
      },
    }));

    const quickActions: CommandItem[] = [
      {
        id: 'act-toggle-mode',
        group: 'Aksi Cepat',
        label: isNetworkMode
          ? 'Beralih ke GDG Bogor Mode'
          : 'Beralih ke Network Mode (Living Network)',
        hint: isNetworkMode ? 'GDG Bogor' : 'Network',
        keywords: 'mode theme tema gdg bogor network living jaringan dark light',
        icon: isNetworkMode ? Globe : Network,
        action: () => {
          toggleMode();
          onClose();
        },
      },
      {
        id: 'act-copy-email',
        group: 'Aksi Cepat',
        label: copied ? 'Email tersalin ke clipboard' : `Salin Email (${PROFILE.email})`,
        hint: 'Clipboard',
        keywords: 'salin copy email kontak',
        icon: copied ? Check : Copy,
        action: async () => {
          try {
            await navigator.clipboard.writeText(PROFILE.email);
            setCopied(true);
            window.setTimeout(() => {
              setCopied(false);
              onClose();
            }, 600);
          } catch {
            onClose();
          }
        },
      },
      {
        id: 'act-cisco-cert',
        group: 'Aksi Cepat',
        label: 'Lihat Sertifikat Cisco Networking Basics',
        hint: 'Pratinjau',
        keywords: 'sertifikat cisco networking basics jaringan tkj',
        icon: Award,
        action: () => {
          onClose();
          onOpenCiscoCertificate();
        },
      },
      {
        id: 'act-cert',
        group: 'Aksi Cepat',
        label: 'Lihat Sertifikat Data Detective SBM ITB',
        hint: 'Pratinjau',
        keywords: 'sertifikat itb sbm gokfive data detective',
        icon: Award,
        action: () => {
          onClose();
          onOpenCertificate();
        },
      },
      {
        id: 'act-ig',
        group: 'Aksi Cepat',
        label: `Buka Instagram (${PROFILE.instagram.handle})`,
        hint: 'Tab Baru',
        keywords: 'instagram sosial media',
        icon: ExternalLink,
        action: () => {
          onClose();
          window.open(PROFILE.instagram.url, '_blank', 'noopener,noreferrer');
        },
      },
    ];

    return [...sectionItems, ...projectItems, ...quickActions];
  }, [
    copied,
    isNetworkMode,
    onClose,
    onNavigateSection,
    onOpenCertificate,
    onOpenCiscoCertificate,
    onOpenProject,
    toggleMode,
  ]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.hint.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q)
    );
  }, [items, query]);

  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setActiveIdx(0);
    const t = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (activeIdx >= filteredItems.length) {
      setActiveIdx(Math.max(0, filteredItems.length - 1));
    }
  }, [activeIdx, filteredItems.length]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((prev) => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((prev) =>
          filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0
        );
      } else if (e.key === 'Enter' && filteredItems[activeIdx]) {
        e.preventDefault();
        filteredItems[activeIdx].action();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIdx, filteredItems, isOpen, onClose]);

  if (!isOpen) return null;

  const groups: CommandItem['group'][] = [
    'Navigasi Bagian',
    'Studi Kasus Project',
    'Aksi Cepat',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigasi cepat portofolio"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/65 px-4 pt-[10vh] backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface-elevated)] shadow-2xl"
      >
        {/* Top accent strip matching active mode */}
        <div aria-hidden="true" className="flex h-[3px] w-full">
          {topPalette.map((color, idx) => (
            <div key={`${idx}-${color}`} className="flex-1" style={{ backgroundColor: color }} />
          ))}
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-[var(--line)] px-4 py-3.5">
          <Search className="h-4 w-4 shrink-0 text-[var(--action)]" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIdx(0);
            }}
            placeholder="Cari bagian, studi kasus project, atau kontak..."
            aria-label="Cari navigasi atau proyek"
            className="w-full bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup navigasi cepat"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[var(--muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text)]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[56vh] overflow-y-auto p-2.5">
          {filteredItems.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-[var(--muted)]">
              Tidak ditemukan hasil untuk &ldquo;{query}&rdquo;.
            </p>
          ) : (
            groups.map((groupName) => {
              const groupItems = filteredItems.filter((item) => item.group === groupName);
              if (groupItems.length === 0) return null;

              return (
                <div key={groupName} className="mb-2 last:mb-0">
                  <p className="px-3 pb-1 pt-2 text-[11px] font-bold text-[var(--muted)]">
                    {groupName}
                  </p>
                  <ul className="space-y-0.5">
                    {groupItems.map((item) => {
                      const idx = filteredItems.indexOf(item);
                      const isActive = idx === activeIdx;
                      const Icon = item.icon;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onMouseEnter={() => setActiveIdx(idx)}
                            onClick={item.action}
                            className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                              isActive
                                ? 'bg-[var(--surface-tonal)] text-[var(--surface-tonal-text)]'
                                : 'text-[var(--text)] hover:bg-[var(--surface)]'
                            }`}
                          >
                            <span className="flex min-w-0 items-center gap-2.5">
                              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                              <span className="truncate font-semibold">{item.label}</span>
                            </span>
                            <span className="shrink-0 font-mono text-[11px] opacity-75">
                              {item.hint}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })
          )}
        </div>

        {/* Footer keyboard hints */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-[11px] text-[var(--muted)]">
          <div className="flex items-center gap-3 font-mono">
            <span>↑↓ Pilih</span>
            <span>↵ Buka</span>
            <span>ESC Tutup</span>
          </div>
          <span className="font-medium">Navigasi Cepat</span>
        </div>
      </div>
    </div>
  );
};
