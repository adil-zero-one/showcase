import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { FEATURED, PROJECTS, type Project, type ProjectId } from '../data/projects';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { goTo } from '../lib/smooth';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useLineReveal } from '../hooks/useLineReveal';
import { ArrowUpRight } from './Icons';
import { CaseDialog } from './CaseDialog';
import { Shot } from './Shot';
import { WorkIndex } from './WorkIndex';
import './projects.css';

const THEMES = ['ink', 'cobalt', 'lime', 'white'] as const;
export const plainKicker = (k: string): string => k.replace(/ · /g, ', ');

export interface OpenArgs { id: ProjectId; index?: number }

/**
 * Selected work: four projects as cards that stack as you scroll. Each screenshot has a wand layer
 * underneath that shows how the project is built. Below the cards, an index of all the work.
 */
export function Projects() {
  const { t, lang } = useI18n();
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const [open, setOpen] = useState<OpenArgs | null>(null);
  useLineReveal(title, [lang]);

  const openCase = useCallback((a: OpenArgs) => setOpen(a), []);
  const closeCase = useCallback(() => setOpen(null), []);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        const wrap = el.querySelector<HTMLElement>('.pcards');
        const cards = gsap.utils.toArray<HTMLElement>('.pcard');
        if (!wrap || cards.length < 2) return;
        const dims = cards.map((c) => c.querySelector<HTMLElement>('.pcard__dim'));
        // The dimming of a card is read from where the next card really is on screen (0 while that card is
        // still below, 1 once it has slid over). Nothing is measured in advance, so a refresh, a language
        // change or a resize can never leave a card stuck dimmed.
        const apply = () => {
          const vh = window.innerHeight;
          for (let i = 0; i < cards.length - 1; i++) {
            const top = cards[i + 1].getBoundingClientRect().top;
            const p = gsap.utils.clamp(0, 1, (0.92 * vh - top) / (0.78 * vh));
            cards[i].style.scale = String(1 - 0.07 * p);
            const d = dims[i];
            if (d) d.style.opacity = String(0.6 * p);
          }
        };
        const st = ScrollTrigger.create({ trigger: wrap, start: 'top bottom', end: 'bottom top', onUpdate: apply, onRefresh: apply, onToggle: apply });
        apply();
        return () => {
          st.kill();
          cards.forEach((c, i) => { c.style.scale = ''; const d = dims[i]; if (d) d.style.opacity = ''; });
        };
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  const P = t.projects;
  return (
    <section id="projects" ref={root} className="section projects on-light" aria-labelledby="projects-title">
      <div className="container">
        <header className="projects__head">
          <h2 key={lang} id="projects-title" ref={title} className="display projects__title">{P.title}</h2>
          <p className="lede">{P.intro}</p>
        </header>

        <div className="pcards">
          {FEATURED.map((p, i) => (
            <Card key={p.id} project={p} index={i} theme={THEMES[i % THEMES.length]} onOpen={openCase} />
          ))}
        </div>

        <WorkIndex onOpen={openCase} />
      </div>
      {open && <CaseDialog project={PROJECTS.find((p) => p.id === open.id)!} startIndex={open.index ?? 0} onClose={closeCase} />}
    </section>
  );
}

function Card({ project, index, theme, onOpen }: { project: Project; index: number; theme: (typeof THEMES)[number]; onOpen: (a: OpenArgs) => void }) {
  const { t } = useI18n();
  const L = t.projects.labels;
  const txt = t.projects.items[project.id];
  return (
    <article className="pcard" data-theme={theme} style={{ ['--i' as string]: index }} aria-labelledby={`pc-${project.id}`}>
      <div className="pcard__dim" aria-hidden="true" />
      <div className="pcard__text">
        <p className="pcard__kicker">{plainKicker(txt.kicker)}</p>
        <h3 id={`pc-${project.id}`} className="pcard__title display">{txt.name}</h3>
        <p className="pcard__tag">{txt.tagline}</p>
        <ul className="pcard__stack">
          {project.stack.map((s) => (<li key={s} className="tag">{s}</li>))}
        </ul>
        <div className="pcard__actions">
          <button type="button" className="btn btn--accent" onClick={() => onOpen({ id: project.id })} data-magnetic>
            {L.openCase}
          </button>
          {project.repo && (
            <a className="btn" href={project.repo} target="_blank" rel="noopener noreferrer">
              {L.source}
              <ArrowUpRight />
              <span className="visually-hidden"> {t.a11y.newTab}</span>
            </a>
          )}
          {project.id === 'banners' && (
            <button type="button" className="tlink pcard__watch" onClick={() => { window.dispatchEvent(new CustomEvent('showreel:select', { detail: 'beats-banner' })); goTo('showreel'); }}>
              {L.watch}
            </button>
          )}
        </div>
      </div>
      <Shot project={project} />
    </article>
  );
}
