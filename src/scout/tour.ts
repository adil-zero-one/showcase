import { JOBS, pairCount, runSearch, terms, type Board, type Job, type Query, type Within } from './jobs';

export interface FillState { job: Job; n: number }
export const FILL_STEPS = 7;

export interface AppState extends Query {
  typing: 'where' | 'kind' | 'exclude' | null;
  pressed: 'search' | null;
  running: boolean;
  shown: Job[];
  /** offers the visitor dismissed with the × button */
  gone: string[];
  searched: boolean;
  tab: 'offers' | 'applied';
  /** narrow screens show one panel at a time */
  panel: 'form' | 'offers';
  fill: FillState | null;
  /** row that is being pressed in the tour */
  hot: string | null;
}

export const SCRIPT = {
  where: 'barcelona, tarragona, remote',
  kind: 'web developer, motion designer',
  exclude: 'senior, 5 years experience',
};

export const blankState = (): AppState => ({
  where: '', kind: '', exclude: '',
  sites: { linkedin: false, indeed: false, infojobs: false },
  within: '24h', typing: null, pressed: null, running: false, shown: [], gone: [], searched: false, tab: 'offers', panel: 'form', fill: null, hot: null,
});

const seg = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));
const slice = (s: string, f: number) => s.slice(0, Math.round(s.length * f));

/** Checkpoints along the pinned scroll: 0.68 the search is pressed, 0.88 Auto-Fill is pressed. */
export const CHECK = { search: 0.68, autofill: 0.88 };
export const stepAt = (p: number): 0 | 1 | 2 => (p < CHECK.search ? 0 : p < CHECK.autofill ? 1 : 2);

/** The whole demo as a pure function of scroll progress 0..1, so it plays forwards and backwards. */
export function tourAt(p: number): AppState {
  const s = blankState();
  const w = seg(p, 0.04, 0.2), k = seg(p, 0.2, 0.38), e = seg(p, 0.5, 0.62);
  s.where = slice(SCRIPT.where, w);
  s.kind = slice(SCRIPT.kind, k);
  s.exclude = slice(SCRIPT.exclude, e);
  s.typing = p < 0.04 ? null : w < 1 ? 'where' : k < 1 ? 'kind' : p >= 0.5 && e < 1 ? 'exclude' : null;
  const sites: Record<Board, boolean> = { linkedin: p >= 0.4, indeed: p >= 0.43, infojobs: p >= 0.46 };
  s.sites = sites;
  s.within = (p >= 0.64 ? '7d' : '24h') as Within;
  s.pressed = p >= 0.665 && p < 0.7 ? 'search' : null;
  const full = runSearch({ where: SCRIPT.where, kind: SCRIPT.kind, exclude: SCRIPT.exclude, sites, within: '7d' });
  if (p >= CHECK.search) {
    s.searched = true;
    const f = seg(p, 0.7, 0.84);
    const n = Math.floor(f * (full.length + 0.999));
    s.shown = full.slice(0, Math.min(full.length, n));
    s.running = f < 1;
    s.panel = 'offers';
  }
  if (p >= 0.86 && full[0]) s.hot = full[0].id;
  if (p >= CHECK.autofill && full[0]) {
    s.hot = null;
    s.fill = { job: full[0], n: Math.round(seg(p, 0.89, 0.98) * FILL_STEPS) };
  }
  return s;
}

/** "Searching 'web developer' in barcelona… (3/6)" from how many offers have arrived. */
export function statusLine(s: AppState, final: number): string {
  if (!s.running) return 'Ready to search.';
  const k = terms(s.kind), w = terms(s.where);
  const pairs = pairCount(s);
  const i = Math.min(pairs, Math.max(1, Math.ceil((s.shown.length / Math.max(1, final)) * pairs)));
  const ki = Math.min(k.length - 1, Math.floor((i - 1) / Math.max(1, w.length)));
  const wi = (i - 1) % Math.max(1, w.length);
  return `Searching ‘${k[ki] ?? ''}’ in ${w[wi] ?? 'anywhere'}… (${i}/${pairs})`;
}
export { JOBS };
