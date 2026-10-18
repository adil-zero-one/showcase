import type { Dict } from '../i18n/en';

/**
 * The technical map. `status` is the honest part:
 *  - used     → visible in a public repository (or in this very site)
 *  - listed   → on the CV / profile, but nothing public demonstrates it yet
 *  - learning → currently being learned
 * The explanation text for each node is in the dictionaries: stack.items.<id>.
 */
export type StackStatus = 'used' | 'listed' | 'learning';
export type StackKey = keyof Dict['stack']['items'];
export type StackGroup = 'backend' | 'frontend' | 'tools';

export interface StackNode {
  id: StackKey;
  label: string;
  group: StackGroup;
  status: StackStatus;
}

export const STACK: StackNode[] = [
  { id: 'php', label: 'PHP', group: 'backend', status: 'used' },
  { id: 'laravel', label: 'Laravel', group: 'backend', status: 'used' },
  { id: 'symfony', label: 'Symfony', group: 'backend', status: 'used' },
  { id: 'sql', label: 'MySQL / SQL', group: 'backend', status: 'used' },
  { id: 'eloquent', label: 'Eloquent ORM', group: 'backend', status: 'used' },
  { id: 'doctrine', label: 'Doctrine', group: 'backend', status: 'used' },
  { id: 'rest', label: 'REST APIs', group: 'backend', status: 'used' },
  { id: 'docker', label: 'Docker', group: 'backend', status: 'used' },
  { id: 'mvc', label: 'MVC', group: 'backend', status: 'used' },
  { id: 'java', label: 'Java', group: 'backend', status: 'learning' },

  { id: 'html', label: 'HTML', group: 'frontend', status: 'used' },
  { id: 'css', label: 'CSS', group: 'frontend', status: 'used' },
  { id: 'js', label: 'JavaScript', group: 'frontend', status: 'used' },
  { id: 'bootstrap', label: 'Bootstrap', group: 'frontend', status: 'used' },
  { id: 'react', label: 'React', group: 'frontend', status: 'used' },
  { id: 'typescript', label: 'TypeScript', group: 'frontend', status: 'used' },

  { id: 'git', label: 'Git & GitHub', group: 'tools', status: 'used' },
  { id: 'linux', label: 'Linux CLI', group: 'tools', status: 'listed' },
  { id: 'postman', label: 'Postman', group: 'tools', status: 'listed' },
  { id: 'figma', label: 'Figma', group: 'tools', status: 'listed' },
  { id: 'photoshop', label: 'Photoshop', group: 'tools', status: 'used' },
  { id: 'aftereffects', label: 'After Effects', group: 'tools', status: 'used' },
  { id: 'premiere', label: 'Premiere Pro', group: 'tools', status: 'listed' },
  { id: 'motion', label: 'Motion graphics & video editing', group: 'tools', status: 'used' },
];
