import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

interface UseSmoothScrollOptions {
  shouldReduceMotion: boolean;
  isOverlayOpen: boolean;
  activeSlug: string | null;
  projectFilter: string;
  techFilterKey?: string | null;
}

export function useSmoothScroll({
  shouldReduceMotion,
  isOverlayOpen,
  activeSlug,
  projectFilter,
  techFilterKey,
}: UseSmoothScrollOptions) {
  const lenisRef = useRef<Lenis | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  // Sinkronkan Lenis smooth scroll dengan GSAP ScrollTrigger
  useEffect(() => {
    if (shouldReduceMotion) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [shouldReduceMotion]);

  // Hentikan sementara scroll halaman saat dialog/lightbox aktif
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    if (isOverlayOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [isOverlayOpen]);

  // Perbarui titik trigger saat tampilan halaman atau filter project berubah
  useEffect(() => {
    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 80);
    return () => window.clearTimeout(timer);
  }, [activeSlug, projectFilter, techFilterKey]);

  // Animasi masuk konten per section secara bertahap dan halus saat digulir
  useEffect(() => {
    if (shouldReduceMotion || activeSlug || !mainRef.current) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('section');
      sections.forEach((sec) => {
        const fades = sec.querySelectorAll<HTMLElement>('[data-gsap-fade]');
        if (!fades.length) return;

        gsap.set(fades, { opacity: 0, y: 44 });

        let hasPlayed = false;
        const playSectionFade = () => {
          if (hasPlayed) return;
          hasPlayed = true;
          gsap.to(fades, {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.14,
            ease: 'expo.out',
            clearProps: 'transform,opacity',
          });
        };

        ScrollTrigger.create({
          trigger: sec,
          start: 'top 80%',
          onEnter: playSectionFade,
          onEnterBack: playSectionFade,
          onRefresh: (st) => {
            if (st.progress > 0) playSectionFade();
          },
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, [activeSlug, shouldReduceMotion]);

  const scrollToSection = useCallback(
    (sectionId?: string) => {
      const lenis = lenisRef.current;
      if (sectionId && sectionId !== 'atas') {
        const el = document.getElementById(sectionId);
        if (!el) return;
        if (lenis) {
          lenis.scrollTo(el, { offset: -72, duration: 1.05 });
        } else {
          el.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
        }
      } else if (lenis) {
        lenis.scrollTo(0, { duration: 1.05 });
      } else {
        window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
      }
    },
    [shouldReduceMotion]
  );

  const scrollToTopImmediate = useCallback(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, []);

  return {
    mainRef,
    scrollToSection,
    scrollToTopImmediate,
    refreshScrollTriggers: () => ScrollTrigger.refresh(),
  };
}
