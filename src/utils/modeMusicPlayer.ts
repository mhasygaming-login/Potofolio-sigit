import type { PortfolioMode } from '../context/ThemeContext';
import { MODE_MUSIC_MAP } from '../audio/modeMusicConfig';

const CROSSFADE_MS = 340;

let activeAudio: HTMLAudioElement | null = null;
let outgoingAudio: HTMLAudioElement | null = null;
let activeSessionId = 0;
let crossfadeRafId = 0;

function stopCrossfadeLoop(): void {
  if (crossfadeRafId) {
    cancelAnimationFrame(crossfadeRafId);
    crossfadeRafId = 0;
  }
}

function teardownAudioElement(audio: HTMLAudioElement | null): void {
  if (!audio) return;
  try {
    audio.pause();
    audio.currentTime = 0;
  } catch {
    // Ignore reset errors if media was never loaded
  }
  audio.onended = null;
  audio.onerror = null;
  try {
    audio.removeAttribute('src');
    audio.load();
  } catch {
    // Ignore unload errors
  }
}

function forceStopOutgoing(): void {
  if (outgoingAudio) {
    const target = outgoingAudio;
    outgoingAudio = null;
    teardownAudioElement(target);
  }
}

export function stopModeTransitionMusic(): void {
  activeSessionId += 1;
  stopCrossfadeLoop();
  forceStopOutgoing();
  if (activeAudio) {
    const prev = activeAudio;
    activeAudio = null;
    teardownAudioElement(prev);
  }
}

function runCrossfade(
  incoming: HTMLAudioElement,
  incomingTargetVol: number,
  outgoing: HTMLAudioElement | null,
  sessionId: number
): void {
  stopCrossfadeLoop();

  if (!outgoing) {
    incoming.volume = incomingTargetVol;
    return;
  }

  const outgoingStartVol = outgoing.volume;
  const startTime = performance.now();

  const tick = (now: number) => {
    if (sessionId !== activeSessionId) {
      crossfadeRafId = 0;
      return;
    }

    const progress = Math.min(1, (now - startTime) / CROSSFADE_MS);
    const eased = 1 - Math.pow(1 - progress, 2);

    if (activeAudio === incoming) {
      incoming.volume = Math.max(0, Math.min(1, incomingTargetVol * eased));
    }

    if (outgoingAudio === outgoing) {
      outgoing.volume = Math.max(0, Math.min(1, outgoingStartVol * (1 - eased)));
    }

    if (progress < 1) {
      crossfadeRafId = requestAnimationFrame(tick);
    } else {
      crossfadeRafId = 0;
      if (activeAudio === incoming) {
        incoming.volume = incomingTargetVol;
      }
      if (outgoingAudio === outgoing) {
        forceStopOutgoing();
      }
    }
  };

  crossfadeRafId = requestAnimationFrame(tick);
}

/**
 * Starts the selected mode's dedicated looping soundtrack from 00:00 on an intentional
 * mode switch, crossfading briefly (340ms) from any previous mode track and unloading
 * the previous track cleanly without allowing overlap.
 */
export function playModeTransitionMusic(targetMode: PortfolioMode): void {
  if (typeof window === 'undefined' || typeof Audio === 'undefined') return;

  const spec = MODE_MUSIC_MAP[targetMode];
  if (!spec?.src) return;

  activeSessionId += 1;
  const sessionId = activeSessionId;
  const targetVolume = Math.max(0, Math.min(1, spec.volume));

  // Ensure no older fading-out track lingers during rapid mode switches
  stopCrossfadeLoop();
  forceStopOutgoing();

  const previous = activeAudio;
  activeAudio = null;
  if (previous && !previous.paused && !previous.ended) {
    outgoingAudio = previous;
  } else {
    teardownAudioElement(previous);
  }

  try {
    const audio = new Audio(spec.src);
    audio.loop = spec.loop;
    audio.preload = 'auto';
    audio.volume = outgoingAudio ? 0 : targetVolume;
    audio.currentTime = 0;

    audio.onerror = () => {
      if (sessionId !== activeSessionId) return;
      if (activeAudio === audio) {
        activeAudio = null;
      }
      teardownAudioElement(audio);
      forceStopOutgoing();
    };

    audio.onended = () => {
      if (sessionId !== activeSessionId || audio.loop) return;
      if (activeAudio === audio) {
        activeAudio = null;
      }
      teardownAudioElement(audio);
    };

    activeAudio = audio;

    // Trigger playback directly from the user's mode-switch interaction
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => {
          if (sessionId !== activeSessionId || activeAudio !== audio) {
            teardownAudioElement(audio);
            return;
          }
          runCrossfade(audio, targetVolume, outgoingAudio, sessionId);
        })
        .catch(() => {
          if (sessionId === activeSessionId) {
            stopModeTransitionMusic();
          } else {
            teardownAudioElement(audio);
          }
        });
    } else {
      runCrossfade(audio, targetVolume, outgoingAudio, sessionId);
    }
  } catch {
    stopModeTransitionMusic();
  }
}
