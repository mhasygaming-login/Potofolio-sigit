import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useReducedMotion } from 'motion/react';

export type PortfolioMode = 'gdg' | 'network';

const STORAGE_KEY = 'sigit-portfolio-mode';

type ToneKind = 'switch' | 'node' | 'terminal';

interface ThemeContextValue {
  mode: PortfolioMode;
  isNetworkMode: boolean;
  setMode: (nextMode: PortfolioMode) => void;
  toggleMode: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  playTone: (kind?: ToneKind) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readInitialMode(): PortfolioMode {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-theme-mode');
    if (attr === 'network' || attr === 'gdg') return attr;
  }
  if (typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'network') return 'network';
    } catch {
      // Ignore storage access restriction
    }
  }
  return 'gdg';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<PortfolioMode>(readInitialMode);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const shouldReduceMotion = Boolean(useReducedMotion());
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme-mode', mode);

    if (mode === 'network') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Ignore storage write restriction
    }
  }, [mode]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        void audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const playTone = useCallback(
    (kind: ToneKind = 'node') => {
      if (!soundEnabled || shouldReduceMotion || typeof window === 'undefined') return;

      const AudioCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtor) return;

      try {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
          audioCtxRef.current = new AudioCtor();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          void ctx.resume();
        }

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = kind === 'terminal' ? 'triangle' : 'sine';
        const startFreq = kind === 'switch' ? 520 : kind === 'terminal' ? 680 : 600;
        const endFreq = kind === 'switch' ? 780 : kind === 'terminal' ? 840 : 720;

        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.055);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.032, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } catch {
        // Ignore audio playback errors
      }
    },
    [shouldReduceMotion, soundEnabled]
  );

  const setMode = useCallback((nextMode: PortfolioMode) => {
    setModeState(nextMode);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => (prev === 'gdg' ? 'network' : 'gdg'));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      isNetworkMode: mode === 'network',
      setMode,
      toggleMode,
      soundEnabled,
      setSoundEnabled,
      playTone,
    }),
    [mode, playTone, setMode, soundEnabled, toggleMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
