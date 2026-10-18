import manifest from '../data/mediaManifest.json';
import { asset } from './asset';

type Dims = [number, number];
const dims = manifest as unknown as Record<string, Dims | Record<string, unknown>>;

/** Image descriptor with intrinsic size (prevents layout shift). */
export interface Img {
  src: string;
  width: number;
  height: number;
}

export function img(path: string): Img {
  const d = dims[path] as Dims | undefined;
  if (!d) throw new Error(`Image not in media manifest: ${path} (run npm run media)`);
  return { src: asset(path), width: d[0], height: d[1] };
}

export interface ClipMeta {
  duration: number;
  width: number;
  height: number;
}
export const clipMeta = (id: string): ClipMeta => (manifest as unknown as { __clips__: Record<string, ClipMeta> }).__clips__[id];
