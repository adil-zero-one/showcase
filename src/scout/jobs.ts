/**
 * Example data for the ScoutWand replica. These offers and companies are invented for this page;
 * nothing here is scraped or live. The search below only filters this list.
 */
export type Board = 'linkedin' | 'indeed' | 'infojobs';
export type Within = '24h' | '7d';

export interface Job {
  id: string;
  title: string;
  company: string;
  place: string;
  board: Board;
  hours: number;
}

export const JOBS: Job[] = [
  { id: 'j1', title: 'Junior web developer', company: 'Brightfield Labs', place: 'Barcelona, hybrid', board: 'linkedin', hours: 5 },
  { id: 'j2', title: 'Web developer (React)', company: 'Pixel Orchard', place: 'Tarragona', board: 'indeed', hours: 20 },
  { id: 'j3', title: 'Motion designer', company: 'Studio Lantern', place: 'Barcelona', board: 'linkedin', hours: 9 },
  { id: 'j4', title: 'Motion graphics designer', company: 'Lumen Agency', place: 'Madrid', board: 'indeed', hours: 30 },
  { id: 'j5', title: 'Desarrollador/a backend junior (PHP)', company: 'Tecnos Norte', place: 'Barcelona', board: 'infojobs', hours: 12 },
  { id: 'j6', title: 'Video editor', company: 'Cobalt Media', place: 'Reus', board: 'infojobs', hours: 50 },
  { id: 'j7', title: 'Senior web developer, 5 years experience', company: 'Harbor Systems', place: 'Barcelona', board: 'linkedin', hours: 3 },
  { id: 'j8', title: 'Laravel developer', company: 'Mapleway', place: 'Remote (Spain)', board: 'linkedin', hours: 70 },
  { id: 'j9', title: 'Graphic and motion designer', company: 'Fábrica Creativa', place: 'Tarragona', board: 'infojobs', hours: 28 },
  { id: 'j10', title: 'Marketing assistant', company: 'Greenline', place: 'Barcelona', board: 'indeed', hours: 6 },
  { id: 'j11', title: 'Junior web developer', company: 'Olivar Soft', place: 'Reus', board: 'infojobs', hours: 15 },
  { id: 'j12', title: 'Motion designer, junior', company: 'Northgate Studio', place: 'Remote', board: 'indeed', hours: 100 },
  { id: 'j13', title: 'After Effects animator', company: 'Tidal Frames', place: 'Barcelona', board: 'linkedin', hours: 140 },
  { id: 'j14', title: 'Backend developer (Python)', company: 'Datacrest', place: 'Madrid', board: 'indeed', hours: 26 },
  { id: 'j15', title: 'QA tester, junior', company: 'Quill & Co', place: 'Barcelona', board: 'infojobs', hours: 40 },
  { id: 'j16', title: 'Full stack web developer', company: 'Basalt Digital', place: 'Tarragona', board: 'linkedin', hours: 18 },
];

export const BOARD_LABEL: Record<Board, string> = { linkedin: 'LINKEDIN', indeed: 'INDEED', infojobs: 'INFOJOBS' };

export const terms = (s: string): string[] => s.split(/[,;\n]/).map((x) => x.trim().toLowerCase()).filter(Boolean);

export interface Query {
  where: string;
  kind: string;
  exclude: string;
  sites: Record<Board, boolean>;
  within: Within;
}

/** Offers that match the form, freshest first. No job kind, no search. */
export function runSearch(q: Query): Job[] {
  const kinds = terms(q.kind), places = terms(q.where), out = terms(q.exclude);
  if (!kinds.length) return [];
  const limit = q.within === '24h' ? 24 : 168;
  return JOBS.filter((j) => {
    const title = j.title.toLowerCase();
    const hay = `${title} ${j.company.toLowerCase()}`;
    return q.sites[j.board]
      && j.hours <= limit
      && kinds.some((k) => k.split(/\s+/).every((w) => title.includes(w)))
      && (!places.length || places.some((p) => j.place.toLowerCase().includes(p)))
      && !out.some((x) => hay.includes(x));
  }).sort((a, b) => a.hours - b.hours);
}

export const agoLabel = (h: number): string => (h < 24 ? `${h} hours ago` : `${Math.round(h / 24)} days ago`);

/** How many "term in place" pairs the status line counts through. */
export const pairCount = (q: Pick<Query, 'where' | 'kind'>): number => Math.max(1, terms(q.kind).length * Math.max(1, terms(q.where).length));

export const SAMPLE_PERSON = {
  name: 'Alex Example',
  email: 'alex@example.com',
  phone: '+34 600 000 000',
  city: 'Tarragona, 43005',
  cv: 'Alex_Example_CV.pdf',
  links: 'linkedin.com/in/alex-example',
};
