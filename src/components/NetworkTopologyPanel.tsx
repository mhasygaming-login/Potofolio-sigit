import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Laptop,
  Network,
  Router,
  Server,
  Terminal,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  NETWORK_DEVICES,
  NetworkDeviceId,
  NetworkDeviceSpec,
} from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

const DEVICE_ICONS: Record<
  NetworkDeviceId,
  React.ComponentType<{ className?: string }>
> = {
  client: Laptop,
  switch: Network,
  router: Router,
  server: Server,
};

interface TerminalEntry {
  id: number;
  command?: string;
  lines: string[];
  tone?: 'normal' | 'accent' | 'error';
}

const INITIAL_TERMINAL: TerminalEntry[] = [
  {
    id: 1,
    lines: [
      'Simulasi CLI Edukatif TKJ — SMK Madinatul Quran',
      'Ketik "help" untuk melihat daftar perintah yang tersedia.',
    ],
    tone: 'accent',
  },
];

function evaluateAllowedCommand(rawInput: string): {
  clear?: boolean;
  lines: string[];
  tone: 'normal' | 'accent' | 'error';
} {
  const trimmed = rawInput.trim().toLowerCase();
  if (!trimmed) {
    return { lines: [], tone: 'normal' };
  }

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0];
  const arg = parts[1] ?? '';

  switch (cmd) {
    case 'help':
      return {
        tone: 'accent',
        lines: [
          'Perintah simulasi yang didukung:',
          '  ping [router|server|ip]  — Uji koneksi ke perangkat tujuan',
          '  ipconfig                 — Tampilkan konfigurasi IP client lokal',
          '  tracert [tujuan]         — Lacak jalur hop Client -> Server',
          '  hostname                 — Tampilkan nama host perangkat aktif',
          '  clear                    — Bersihkan riwayat layar terminal',
        ],
      };

    case 'hostname':
      return {
        tone: 'normal',
        lines: ['tkj-lab-sigit-debian12'],
      };

    case 'ipconfig':
      return {
        tone: 'normal',
        lines: [
          'Adapter Ethernet Lab-TKJ (Simulasi):',
          '  IPv4 Address    : 192.168.10.24',
          '  Subnet Mask     : 255.255.255.0',
          '  Default Gateway : 192.168.10.1 (MikroTik Router)',
          '  DNS Server      : 10.20.30.10 (Debian 12 Server)',
        ],
      };

    case 'ping': {
      const target =
        arg === 'router' || arg === '192.168.10.1'
          ? '192.168.10.1 (Router MikroTik)'
          : arg === 'switch'
            ? '192.168.10.2 (Switch VLAN 10)'
            : '10.20.30.10 (Server Debian 12)';
      return {
        tone: 'accent',
        lines: [
          `Pinging ${target} dengan 32 bytes data:`,
          '  Reply from host: bytes=32 time=1ms TTL=64',
          '  Reply from host: bytes=32 time=1ms TTL=64',
          '  Reply from host: bytes=32 time=2ms TTL=64',
          'Statistik: Sent = 3, Received = 3, Lost = 0 (0% loss)',
        ],
      };
    }

    case 'tracert':
      return {
        tone: 'normal',
        lines: [
          'Tracing route ke Server Layanan [10.20.30.10] (maks 4 hop):',
          '  1    <1 ms   Switch-Access-VLAN10 [192.168.10.2]',
          '  2     1 ms   Router-MikroTik-GW   [192.168.10.1]',
          '  3     2 ms   Server-Debian12      [10.20.30.10]',
          'Trace selesai.',
        ],
      };

    case 'clear':
      return { clear: true, lines: [], tone: 'normal' };

    default:
      return {
        tone: 'error',
        lines: [
          `Perintah "${cmd.slice(0, 24)}" tidak dikenali dalam simulasi allowlist.`,
          'Gunakan: ping, ipconfig, tracert, hostname, help, atau clear.',
        ],
      };
  }
}

export const NetworkTopologyPanel: React.FC = () => {
  const { soundEnabled, setSoundEnabled, playTone } = useTheme();
  const shouldReduceMotion = Boolean(useReducedMotion());

  const [selectedDevice, setSelectedDevice] = useState<NetworkDeviceSpec | null>(null);
  const [hoveredId, setHoveredId] = useState<NetworkDeviceId | null>(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>(INITIAL_TERMINAL);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  const hoveredDevice = hoveredId
    ? NETWORK_DEVICES.find((d) => d.id === hoveredId) ?? null
    : null;

  const handleDeviceClick = (
    device: NetworkDeviceSpec,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    window.dispatchEvent(
      new CustomEvent('network-signal-ripple', {
        detail: {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          color: device.accentHex,
        },
      })
    );
    playTone('node');
    setSelectedDevice((prev) => (prev?.id === device.id ? null : device));
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next && typeof window !== 'undefined') {
      // Gentle confirmation tone right when user explicitly turns sound on
      const AudioCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtor) {
        try {
          const ctx = new AudioCtor();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(580, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(760, ctx.currentTime + 0.06);
          gain.gain.setValueAtTime(0.0001, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.085);
          window.setTimeout(() => void ctx.close().catch(() => {}), 140);
        } catch {
          // Ignore audio context restriction
        }
      }
    }
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = terminalInput.trim();
    if (!raw) return;

    playTone('terminal');
    const result = evaluateAllowedCommand(raw);
    setTerminalInput('');

    if (result.clear) {
      setTerminalHistory(INITIAL_TERMINAL);
      return;
    }

    setTerminalHistory((prev) => [
      ...prev.slice(-8),
      {
        id: Date.now(),
        command: raw,
        lines: result.lines,
        tone: result.tone,
      },
    ]);
  };

  const runQuickCommand = (cmd: string) => {
    playTone('terminal');
    const result = evaluateAllowedCommand(cmd);
    if (result.clear) {
      setTerminalHistory(INITIAL_TERMINAL);
      return;
    }
    setTerminalHistory((prev) => [
      ...prev.slice(-8),
      {
        id: Date.now(),
        command: cmd,
        lines: result.lines,
        tone: result.tone,
      },
    ]);
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
      transition={
        shouldReduceMotion ? { duration: 0 } : { duration: 0.42, ease: [0.16, 1, 0.3, 1] }
      }
      className="theme-surface-transition mt-12 rounded-3xl border border-[var(--line)] bg-[var(--surface)]/85 p-5 backdrop-blur-sm sm:p-6"
      aria-label="Topologi jaringan interaktif Client Switch Router Server"
    >
      {/* Header strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
        <div>
          <p className="text-xs font-bold text-[var(--action)]">
            Topologi Jaringan Interaktif
          </p>
          <p className="mt-0.5 text-xs text-[var(--muted)] sm:text-sm">
            Pilih perangkat untuk melihat peran dan jalur aliran paket data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const next = !showTerminal;
              setShowTerminal(next);
              playTone('terminal');
              if (next) {
                window.setTimeout(() => terminalInputRef.current?.focus(), 60);
              }
            }}
            aria-expanded={showTerminal}
            className={`m3-btn inline-flex min-h-[36px] items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-xs font-semibold transition-colors ${
              showTerminal
                ? 'border-[var(--action)] bg-[var(--surface-tonal)] text-[var(--surface-tonal-text)]'
                : 'border-[var(--line)] bg-[var(--surface-elevated)] text-[var(--text)] hover:border-[var(--action)]/60'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Terminal Simulasi</span>
          </button>

          <button
            type="button"
            onClick={handleToggleSound}
            aria-pressed={soundEnabled}
            aria-label={soundEnabled ? 'Matikan suara interaksi' : 'Aktifkan suara interaksi'}
            className="m3-btn inline-flex min-h-[36px] items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--line)] bg-[var(--surface-elevated)] px-3 text-xs font-semibold text-[var(--text)] hover:border-[var(--action)]/60"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="h-3.5 w-3.5 text-[var(--green)]" aria-hidden="true" />
                <span>Suara Aktif</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5 text-[var(--muted)]" aria-hidden="true" />
                <span>Suara Mati</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Client -> Switch -> Router -> Server Topology */}
      <div className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {NETWORK_DEVICES.map((device, idx) => {
          const Icon = DEVICE_ICONS[device.id];
          const isSelected = selectedDevice?.id === device.id;
          const isHovered = hoveredId === device.id;

          return (
            <div key={device.id} className="relative flex items-center">
              {/* Animated link connector between devices on sm+ screens */}
              {idx < NETWORK_DEVICES.length - 1 && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-4 top-1/2 z-0 hidden h-[2px] w-4 -translate-y-1/2 overflow-hidden bg-[var(--line)] sm:block"
                >
                  {!shouldReduceMotion && (
                    <motion.span
                      animate={{ x: [-6, 18] }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: idx * 0.45,
                      }}
                      className="block h-full w-2 rounded-full bg-[var(--action)]"
                    />
                  )}
                </div>
              )}

              <motion.button
                type="button"
                onClick={(e) => handleDeviceClick(device, e)}
                onMouseEnter={() => setHoveredId(device.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(device.id)}
                onBlur={() => setHoveredId(null)}
                whileHover={shouldReduceMotion ? undefined : { y: -3 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                aria-expanded={isSelected}
                className={`relative z-10 flex w-full flex-col items-start rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-[var(--action)] bg-[var(--surface-elevated)] shadow-[0_0_24px_var(--network-glow)]'
                    : isHovered
                      ? 'border-[var(--action)]/70 bg-[var(--surface-elevated)]/95'
                      : 'border-[var(--line)] bg-[var(--surface-elevated)]/70 hover:border-[var(--action)]/60'
                }`}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span
                    className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--line)] bg-[var(--bg)]"
                    style={{ color: device.accentHex }}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-[var(--muted)] tabular-nums">
                    0{idx + 1}
                  </span>
                </div>

                <p className="mt-3 text-sm font-extrabold text-[var(--text)]">{device.label}</p>
                <p className="mt-0.5 text-xs text-[var(--muted)]">{device.role}</p>
                <p className="mt-2 font-mono text-[11px] font-medium text-[var(--action)] tabular-nums">
                  {device.ipAddress}
                </p>
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* Subtle hover hint bar when hovering a node on desktop */}
      <AnimatePresence mode="wait">
        {hoveredDevice && hoveredDevice.id !== selectedDevice?.id && (
          <motion.p
            key={hoveredDevice.id}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="mt-3 text-xs text-[var(--muted)]"
          >
            <span className="font-bold text-[var(--text)]">{hoveredDevice.label}:</span>{' '}
            {hoveredDevice.description}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Clicked Device Information Panel */}
      <AnimatePresence>
        {selectedDevice && (
          <motion.div
            key={selectedDevice.id}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
            }
            role="region"
            aria-label={`Informasi perangkat ${selectedDevice.label}`}
            className="mt-4 flex flex-col justify-between gap-4 rounded-2xl border border-[var(--action)]/45 bg-[var(--surface-elevated)] p-4 sm:flex-row sm:items-center"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className="font-extrabold tracking-tight"
                  style={{ color: selectedDevice.accentHex }}
                >
                  {selectedDevice.label.toUpperCase()}
                </span>
                <span aria-hidden="true" className="text-[var(--muted)]">
                  ·
                </span>
                <span className="font-mono text-[var(--muted)]">{selectedDevice.ipAddress}</span>
                <span aria-hidden="true" className="text-[var(--muted)]">
                  ·
                </span>
                <span className="text-[var(--muted)]">{selectedDevice.protocolNote}</span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--text)]">
                {selectedDevice.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedDevice(null)}
              aria-label="Tutup panel informasi perangkat"
              className="m3-btn inline-flex h-9 w-9 shrink-0 items-center justify-center self-end rounded-full border border-[var(--line)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--action)] sm:self-center"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Educational Allowlisted Terminal Simulation (Optional toggle) */}
      <AnimatePresence>
        {showTerminal && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
            }
            className="mt-4 overflow-hidden rounded-2xl border border-[var(--line)] bg-[#07111F]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] bg-[#0B1728] px-4 py-2.5">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#EAF4FF]">
                <Terminal className="h-3.5 w-3.5 text-[#37DFFF]" aria-hidden="true" />
                <span>Simulasi CLI Jaringan (Read-Only Allowlist)</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {['ping router', 'ipconfig', 'tracert', 'help'].map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={() => runQuickCommand(cmd)}
                    className="rounded-md border border-[var(--line)] bg-[#102238] px-2 py-0.5 font-mono text-[11px] font-medium text-[#9BAFC4] transition-colors hover:border-[#37DFFF]/60 hover:text-[#37DFFF]"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-56 space-y-2.5 overflow-y-auto p-4 font-mono text-xs leading-relaxed">
              {terminalHistory.map((entry) => (
                <div key={entry.id}>
                  {entry.command && (
                    <p className="text-[#9BAFC4]">
                      <span className="text-[#36D982]">sigit@tkj-lab</span>
                      <span className="text-[#9BAFC4]">:~$ </span>
                      <span className="text-[#EAF4FF]">{entry.command}</span>
                    </p>
                  )}
                  {entry.lines.map((line, idx) => (
                    <p
                      key={`${entry.id}-${idx}`}
                      className={
                        entry.tone === 'error'
                          ? 'text-[#f87171]'
                          : entry.tone === 'accent'
                            ? 'text-[#37DFFF]'
                            : 'text-[#EAF4FF]/90'
                      }
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            <form
              onSubmit={handleTerminalSubmit}
              className="flex items-center gap-2 border-t border-[var(--line)] bg-[#0B1728] px-4 py-2.5"
            >
              <span className="font-mono text-xs font-bold text-[#36D982]" aria-hidden="true">
                $
              </span>
              <input
                ref={terminalInputRef}
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Ketik perintah: ping, ipconfig, tracert, hostname, help, clear"
                aria-label="Input perintah terminal simulasi TKJ"
                className="w-full bg-transparent font-mono text-xs text-[#EAF4FF] placeholder:text-[#9BAFC4]/70 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-[var(--action)] px-3 py-1 text-xs font-bold text-[var(--on-action)] hover:brightness-110"
              >
                Jalankan
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
