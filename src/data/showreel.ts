import { asset } from '../lib/asset';
import { clipMeta } from '../lib/media';

/** Clip order in the playlist. Text lives in the dictionaries: showreel.clips.<id>. */
export const CLIP_IDS = [
  'showreel',
  'scoutwand-demo',
  'beats-banner',
  'croissant-ad',
  'calamari-ad',
  'map-route',
  'presenter-3d',
  'ae-lighting',
  'truenas-tutorial',
] as const;
export type ClipId = (typeof CLIP_IDS)[number];

export interface Clip {
  id: ClipId;
  src: string;
  poster: string;
  /** shown as a badge in the list */
  badge?: 'featured' | 'demo';
  /** the clip carries a voice-over or music worth hearing */
  hasSound: boolean;
  /** WebVTT caption files, by language, when the clip has them */
  captions?: Partial<Record<'es' | 'en' | 'ca', string>>;
  duration: number;
  width: number;
  height: number;
}

export const CLIPS: Clip[] = CLIP_IDS.map((id) => {
  const m = clipMeta(id);
  return {
    id,
    src: asset(`media/showreel/${id}.mp4`),
    poster: asset(`media/showreel/${id}.webp`),
    badge: id === 'showreel' ? 'featured' : id === 'scoutwand-demo' ? 'demo' : undefined,
    hasSound: id === 'showreel' || id === 'scoutwand-demo',
    captions: id === 'showreel'
      ? { en: asset('media/captions/showreel.en.vtt'), es: asset('media/captions/showreel.es.vtt'), ca: asset('media/captions/showreel.ca.vtt') }
      : undefined,
    duration: m.duration,
    width: m.width,
    height: m.height,
  };
});

export const formatTime = (s: number): string => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};
