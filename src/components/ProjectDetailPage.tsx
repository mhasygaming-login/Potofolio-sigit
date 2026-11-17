import React, { useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Wrench,
  ShieldAlert,
} from 'lucide-react';
import { ProjectItem, PROJECTS, ProjectScreenshot } from '../data/portfolioData';
import { ProjectVisualPreview } from './ProjectVisualPreview';

interface ProjectDetailPageProps {
  project: ProjectItem;
  onBack: () => void;
  onSelectProject: (slug: string) => void;
  onPreviewScreenshot?: (shot: ProjectScreenshot & { projectTitle: string }) => void;
}

const ACCENT_HEX: Record<ProjectItem['accent'], string> = {
  blue: '#4285f4',
  red: '#ea4335',
  yellow: '#fbbc04',
  green: '#34a853',
};

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  onBack,
  onSelectProject,
  onPreviewScreenshot,
}) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    headingRef.current?.focus();
  }, [project.slug]);

  const currentIdx = PROJECTS.findIndex((p) => p.slug === project.slug);
  const prevProject = currentIdx > 0 ? PROJECTS[currentIdx - 1] : null;
  const nextProject = currentIdx < PROJECTS.length - 1 ? PROJECTS[currentIdx + 1] : null;

  return (
    <main className="mx-auto w-[min(1040px,calc(100%-32px))] py-10 pb-24 sm:py-14">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
        <button
          type="button"
          onClick={onBack}
          className="m3-btn inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg)] px-4 text-sm font-semibold text-[var(--text)] hover:border-[var(--text)] hover:bg-[var(--surface)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Kembali ke Portofolio</span>
        </button>

        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="m3-btn inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[var(--action)] px-5 text-sm font-bold text-[var(--on-action)] no-underline hover:brightness-110"
        >
          <span>Buka Live Demo</span>
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>

      {/* Header & Unboxed Metadata */}
      <header className="mt-8">
        <div
          className="mb-4 h-1 w-16 rounded-full"
          style={{ backgroundColor: ACCENT_HEX[project.accent] }}
        />

        <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
          <span className="font-semibold text-[var(--text)]">
            {project.tier === 'utama' ? 'Proyek Utama' : 'Proyek Eksperimental'}
          </span>
          <span aria-hidden="true">·</span>
          <span>{project.category}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{project.year}</span>
          <span aria-hidden="true">·</span>
          <span>{project.demoStatusNote}</span>
        </div>

        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--text)] outline-none sm:text-5xl"
        >
          {project.title}
        </h1>
        <p className="mt-3 max-w-[68ch] text-lg font-medium text-[var(--muted)]">
          {project.subtitle}
        </p>

        <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-[var(--text)]">
          {project.summary}
        </p>

        <p className="mt-4 text-sm text-[var(--muted)]">
          <span className="font-semibold text-[var(--text)]">Teknologi:</span>{' '}
          {project.stack.join(' · ')}
        </p>

        {/* Gambar Tampilan Project (Compact & Click-to-Zoom) */}
        <div
          className={`mt-6 grid gap-3 sm:gap-3.5 ${
            project.screenshots.length > 2
              ? 'grid-cols-2 sm:grid-cols-4'
              : 'max-w-[520px] grid-cols-2'
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
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <p className="mt-1.5 truncate text-xs font-semibold text-[var(--muted)] transition-colors group-hover:text-[var(--text)]">
                {shot.label}
              </p>
            </button>
          ))}
        </div>
      </header>

      {/* Single-elevation interactive preview */}
      <section
        aria-label="Pratinjau Interaktif dan Arsitektur"
        className="mt-10 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-7"
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
          <h2 className="text-sm font-bold text-[var(--text)] sm:text-base">
            Demonstrasi Interaktif &amp; Transparansi Sistem
          </h2>
          <span className="text-xs text-[var(--muted)]">Dapat diuji langsung</span>
        </div>
        <ProjectVisualPreview slug={project.slug} mode="detail" />
      </section>

      {/* Problem & Solution */}
      <section className="mt-12 grid grid-cols-1 gap-8 border-t border-[var(--line)] pt-10 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-[var(--text)]">
            Masalah yang Diselesaikan
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            {project.problem}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-[var(--text)]">
            Pendekatan Solusi
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            {project.solutionApproach}
          </p>
        </div>
      </section>

      {/* MY ROLE & CONTRIBUTION */}
      <section
        aria-labelledby="role-heading"
        className="mt-12 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8"
      >
        <div className="border-b border-[var(--line)] pb-4">
          <p className="text-xs font-bold text-[var(--action)]">Akuntabilitas Pengerjaan</p>
          <h2
            id="role-heading"
            className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--text)]"
          >
            My Role &amp; Contribution
          </h2>
          <p className="mt-1 text-sm font-medium text-[var(--muted)]">
            Peran: <span className="text-[var(--text)]">{project.myRole.roleTitle}</span> ·{' '}
            {project.myRole.collaboration}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-[var(--text)]">
              <CheckCircle2 className="h-4 w-4 text-[#34a853]" aria-hidden="true" />
              Bagian yang Dikerjakan Sendiri
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
              {project.myRole.doneByMe.map((item) => (
                <li key={item} className="leading-relaxed">
                  — {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-[var(--text)]">
              <Sparkles className="h-4 w-4 text-[#4285f4]" aria-hidden="true" />
              Bagian yang Dibantu AI
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
              {project.myRole.aiAssisted.map((item) => (
                <li key={item} className="leading-relaxed">
                  — {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 border-t border-[var(--line)] pt-6 md:grid-cols-3">
          <div>
            <h3 className="flex items-center gap-1.5 text-sm font-bold text-[var(--text)]">
              <Wrench className="h-4 w-4 text-[#ea4335]" aria-hidden="true" />
              Kesulitan Teknis
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {project.myRole.technicalChallenge}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text)]">Cara Menyelesaikan</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {project.myRole.resolution}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text)]">Hasil Akhir</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {project.myRole.outcome}
            </p>
          </div>
        </div>
      </section>

      {/* Architecture & Flow (Clean flat columns separated by hairline dividers) */}
      <section className="mt-12 border-t border-[var(--line)] pt-10">
        <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text)]">
          Arsitektur &amp; Alur Penggunaan
        </h2>
        <p className="mt-2 max-w-[68ch] text-sm text-[var(--muted)] sm:text-base">
          {project.architectureSummary}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 border-t border-[var(--line)] pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {project.architectureSteps.map((step) => (
            <div key={step.step}>
              <p className="font-mono text-xs font-bold text-[var(--action)]">{step.step}.</p>
              <h3 className="mt-1.5 text-sm font-bold text-[var(--text)]">{step.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Matrix & Disclaimer / Privacy */}
      <section className="mt-12 grid grid-cols-1 gap-10 border-t border-[var(--line)] pt-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="text-xl font-extrabold tracking-tight text-[var(--text)]">
            Status Setiap Fitur
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Pemetaan jujur mengenai fitur yang sudah berjalan, simulasi antarmuka, eksperimen, atau
            belum selesai.
          </p>

          <div className="mt-4 overflow-x-auto border-t border-b border-[var(--line)]">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] text-xs font-bold text-[var(--text)]">
                  <th className="py-3 pr-4">Fitur</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="py-3 pl-4">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {project.featureMatrix.map((row) => (
                  <tr key={row.name} className="border-b border-[var(--line)] last:border-b-0">
                    <td className="py-3 pr-4 font-medium text-[var(--text)]">{row.name}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-bold">
                      <span
                        className={
                          row.status === 'Berjalan'
                            ? 'text-[#188038] dark:text-[#81c995]'
                            : row.status === 'Simulasi'
                              ? 'text-[#1a73e8] dark:text-[#8ab4f8]'
                              : row.status === 'Eksperimen'
                                ? 'text-[#b06000] dark:text-[#fdd663]'
                                : 'text-[var(--muted)]'
                        }
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-xs text-[var(--muted)]">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8 lg:col-span-5">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-[var(--text)]">
              <ShieldAlert className="h-4 w-4 text-[var(--action)]" aria-hidden="true" />
              {project.privacyOrDisclaimer.heading}
            </h3>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
              {project.privacyOrDisclaimer.points.map((pt) => (
                <li key={pt}>— {pt}</li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[var(--line)] pt-6">
            <h3 className="text-sm font-bold text-[var(--text)]">
              Perbaikan Teknis &amp; Konten pada Revisi Ini
            </h3>
            <ul className="mt-2.5 space-y-1.5 text-xs leading-relaxed text-[var(--muted)]">
              {project.auditImprovements.map((imp) => (
                <li key={imp}>• {imp}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Bottom Prev / Next Project Links */}
      <nav
        aria-label="Navigasi antar project"
        className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-8"
      >
        {prevProject ? (
          <button
            type="button"
            onClick={() => onSelectProject(prevProject.slug)}
            className="m3-btn inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg)] px-4 text-sm font-semibold text-[var(--text)] hover:border-[var(--text)] hover:bg-[var(--surface)]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>{prevProject.title}</span>
          </button>
        ) : (
          <div />
        )}

        {nextProject && (
          <button
            type="button"
            onClick={() => onSelectProject(nextProject.slug)}
            className="m3-btn inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg)] px-4 text-sm font-semibold text-[var(--text)] hover:border-[var(--text)] hover:bg-[var(--surface)]"
          >
            <span>{nextProject.title}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </nav>
    </main>
  );
};
