import { img, type Img } from '../lib/media';

/**
 * Typed project data. Text (names, descriptions, decisions) lives in the
 * translation files under `projects.items.<id>`; this file holds only facts
 * that don't change per language: links, tags, images.
 *
 * Add a project: 1) add its id here, 2) add text for it in en.ts / es.ts / ca.ts.
 */
export type ProjectId = 'supplier' | 'gym' | 'banners' | 'api' | 'venuepulse' | 'botradar';
export type ProjectKind = 'backend' | 'visual' | 'prototype';
export type ProjectStatus = 'project' | 'exercise' | 'prototype';

export interface Project {
  id: ProjectId;
  number: string;
  kind: ProjectKind;
  status: ProjectStatus;
  /** Shown in the featured sequence (case-study layout). */
  featured: boolean;
  stack: string[];
  repo?: string;
  live?: string;
  images: Img[];
  /** Only for projects with an API inspector. */
  api?: ApiSpec;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'DELETE';
  path: string;
  note: 'list' | 'available' | 'show' | 'create' | 'remove';
  status: string;
}
export interface ApiField {
  name: string;
  type: string;
  rule: string;
}
export interface ApiSpec {
  endpoints: ApiEndpoint[];
  fields: ApiField[];
}

// Everything below was read from routes/api.php, ApiController.php and the migration of
// github.com/adil-zero-one/apiVideoJoc. No sample responses are invented.
const apiSpec: ApiSpec = {
  endpoints: [
    { method: 'GET', path: '/api/videojocs', note: 'list', status: '200' },
    { method: 'GET', path: '/api/videojocs/disponibles', note: 'available', status: '200 · 404' },
    { method: 'GET', path: '/api/videojocs/{id}', note: 'show', status: '200 · 404' },
    { method: 'POST', path: '/api/videojocs', note: 'create', status: '201 · 500' },
    { method: 'DELETE', path: '/api/videojocs/{id}', note: 'remove', status: '200 · 404' },
  ],
  fields: [
    { name: 'titol', type: 'string', rule: 'required · max 100' },
    { name: 'any_llancament', type: 'integer', rule: 'required · 1950–2027' },
    { name: 'compatibilitat', type: 'string', rule: 'required' },
    { name: 'duracioJoc', type: 'integer', rule: 'required · 1–365' },
    { name: 'disponibilitat', type: 'boolean', rule: 'required' },
    { name: 'valoracion', type: 'numeric', rule: 'required · 0–9.9' },
    { name: 'tipus', type: 'string', rule: 'required · max 255' },
    { name: 'preu', type: 'numeric', rule: 'required · 0–99.99' },
  ],
};

export const PROJECTS: Project[] = [
  {
    id: 'supplier',
    number: '01',
    kind: 'backend',
    status: 'project',
    featured: true,
    stack: ['Symfony', 'PHP', 'Twig', 'Doctrine', 'MySQL', 'Docker'],
    repo: 'https://github.com/adil-zero-one/proveedores-symfony-viajespti',
    images: [img('projects/supplier/light-table.webp'), img('projects/supplier/dark-cards.webp')],
  },
  {
    id: 'gym',
    number: '02',
    kind: 'backend',
    status: 'project',
    featured: true,
    stack: ['PHP', 'Laravel', 'Eloquent', 'MySQL', 'Docker', 'Bootstrap'],
    repo: 'https://github.com/adil-zero-one/rutinas-gimnasio',
    images: [
      img('projects/gym/landing.webp'),
      img('projects/gym/dashboard.webp'),
      img('projects/gym/categories.webp'),
      img('projects/gym/categories-more.webp'),
      img('projects/gym/edit-category.webp'),
      img('projects/gym/exercises.webp'),
      img('projects/gym/login-dark.webp'),
    ],
  },
  {
    id: 'banners',
    number: '03',
    kind: 'visual',
    status: 'exercise',
    featured: true,
    stack: ['HTML', 'Bootstrap', 'Photoshop', 'After Effects'],
    repo: 'https://github.com/adil-zero-one/banners-bootstrap',
    live: 'https://adil-zero-one.github.io/banners-bootstrap/',
    images: [img('projects/banners/banner-1.webp'), img('projects/banners/banner-2.webp'), img('projects/banners/banner-3.webp')],
  },
  {
    id: 'api',
    number: '04',
    kind: 'backend',
    status: 'exercise',
    featured: true,
    stack: ['PHP', 'Laravel', 'Eloquent', 'REST', 'JSON'],
    repo: 'https://github.com/adil-zero-one/apiVideoJoc',
    images: [],
    api: apiSpec,
  },
  {
    id: 'venuepulse',
    number: '05',
    kind: 'prototype',
    status: 'prototype',
    featured: false,
    stack: ['UI prototype'],
    images: [1, 2, 3, 4, 5, 6].map((n) => img(`projects/venuepulse/${n}.webp`)),
  },
  {
    id: 'botradar',
    number: '06',
    kind: 'prototype',
    status: 'prototype',
    featured: false,
    stack: ['UI prototype'],
    images: [img('projects/botradar/1.webp'), img('projects/botradar/2.webp')],
  },
];

export const FEATURED = PROJECTS.filter((p) => p.featured);
export const getProject = (id: ProjectId): Project => PROJECTS.find((p) => p.id === id)!;
