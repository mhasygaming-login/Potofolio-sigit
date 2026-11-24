import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { LightboxMedia } from '../data/portfolioData';

interface MediaLightboxProps {
  media: LightboxMedia | null;
  onClose: () => void;
}

export const MediaLightbox: React.FC<MediaLightboxProps> = ({ media, onClose }) => {
  useEffect(() => {
    if (!media) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [media, onClose]);

  if (!media) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={media.title}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-[var(--bg)] p-4 shadow-2xl"
      >
        <div className="mb-3 flex items-center justify-between gap-4 border-b border-[var(--line)] pb-3">
          <div>
            <p className="text-sm font-bold text-[var(--text)]">{media.title}</p>
            <p className="text-xs text-[var(--muted)]">{media.caption}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pratinjau gambar"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--line)] text-[var(--text)] hover:border-[var(--text)]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-xl bg-[var(--surface)] p-2">
          <img
            src={media.src}
            alt={media.alt}
            className="max-h-[74vh] w-auto max-w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};
