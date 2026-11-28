import type { PortfolioMode } from '../context/ThemeContext';

export interface ModeMusicSpec {
  mode: PortfolioMode;
  title: string;
  src: string;
  volume: number;
  loop: boolean;
}

export const MODE_MUSIC_MAP: Record<PortfolioMode, ModeMusicSpec> = {
  gdg: {
    mode: 'gdg',
    title: 'The Polished Canvas (GDG Bogor Mode)',
    src: '/audio/gdg-bogor.mp3',
    volume: 0.28,
    loop: true,
  },
  network: {
    mode: 'network',
    title: 'Protokol Terkunci (Network Mode)',
    src: '/audio/network.mp3',
    volume: 0.28,
    loop: true,
  },
};
