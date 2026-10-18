/** Verified contact details and links (taken from the CV, the old portfolio and scoutwand.com). */
export const SITE = {
  name: 'Adil Chainakh',
  email: 'jnk-izzy@live.fr',
  phone: '698 686 436',
  phoneHref: 'tel:+34698686436',
  github: 'https://github.com/adil-zero-one',
  linkedin: 'https://www.linkedin.com/in/adilchainakh',
  scoutwand: 'https://www.scoutwand.com/',
  siteUrl: 'https://adil-zero-one.github.io/showcase/',
  timeZone: 'Europe/Madrid',
  cv: {
    ca: 'docs/Adil_Chainakh_CV_Ca.pdf',
    es: 'docs/Adil_Chainakh_CV_Es.pdf',
    en: 'docs/Adil_Chainakh_CV_En.pdf',
  },
} as const;

export const NAV = [
  { id: 'projects', key: 'work' },
  { id: 'scoutwand', key: 'scoutwand' },
  { id: 'showreel', key: 'showreel' },
  { id: 'stack', key: 'stack' },
  { id: 'journey', key: 'journey' },
  { id: 'contact', key: 'contact' },
] as const;
export type NavKey = (typeof NAV)[number]['key'];
