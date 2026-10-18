import type { Dict } from '../i18n/en';

/** Chronological, newest first. Text is in the dictionaries: experience.items.<id>. */
export type ExperienceId = keyof Dict['experience']['items'];
export interface ExperienceEntry {
  id: ExperienceId;
  kind: 'education' | 'work';
  current?: boolean;
}

export const EXPERIENCE: ExperienceEntry[] = [
  { id: 'daw', kind: 'education', current: true },
  { id: 'beach', kind: 'work' },
  { id: 'quattros', kind: 'work' },
  { id: 'navarro', kind: 'work' },
  { id: 'school', kind: 'education' },
];

export type LanguageLevel = 'native' | 'advanced' | 'intermediate' | 'basic';
export const LANGUAGES: { code: 'ar' | 'es' | 'en' | 'fr' | 'ca'; level: LanguageLevel; main: boolean }[] = [
  { code: 'ar', level: 'native', main: true },
  { code: 'es', level: 'advanced', main: true },
  { code: 'en', level: 'advanced', main: true },
  { code: 'fr', level: 'intermediate', main: true },
  { code: 'ca', level: 'basic', main: false },
];
