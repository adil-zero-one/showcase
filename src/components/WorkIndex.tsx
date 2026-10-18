import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { PROJECTS, type ProjectId } from '../data/projects';
import { gsap } from '../lib/gsap';
import type { OpenArgs } from './Projects';
import { plainKicker } from './Projects';
import { ArrowUpRight } from './Icons';

/**
 * An index of all work. On a precise pointer, a preview card follows the cursor between rows and tilts
 * with its speed. Every row opens the case study.
 */
export function WorkIndex({ onOpen }: { onOpen: (a: OpenArgs) => void }) {
  const { t } = useI18n();
  const peek = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<ProjectId | null>(null);

  useEffect(() => {
    const el = peek.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const pos = { x: 0, y: 0 };
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    const rTo = gsap.quickTo(el, 'rotation', { duration: 0.5, ease: 'power3.out' });
    const onMove = (e: PointerEvent) => {
      const vx = e.clientX - pos.x;
      pos.x = e.clientX; pos.y = e.clientY;
      xTo(e.clientX); yTo(e.clientY);
      rTo(Math.max(-14, Math.min(14, vx * 0.5)));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useEffect(() => {
    const el = peek.current;
    if (!el) return;
    gsap.to(el, { scale: hover ? 1 : 0.6, opacity: hover ? 1 : 0, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
  }, [hover]);

  const cur = PROJECTS.find((p) => p.id === hover);
  const first = cur?.images[0];

  return (
    <div className="windex">
      <h3 className="windex__title display">{t.projects.index.title}</h3>
      <ul className="windex__list">
        {PROJECTS.map((p) => {
          const txt = t.projects.items[p.id];
          return (
            <li key={p.id}>
              <button
                type="button"
                className="windex__row"
                onClick={() => onOpen({ id: p.id })}
                onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHover(p.id); }}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(p.id)}
                onBlur={() => setHover(null)}
                data-cursor="none"
              >
                <span className="windex__name display">{txt.name}</span>
                <span className="windex__meta">
                  <span>{plainKicker(txt.kicker)}</span>
                  <span className="windex__status" data-status={p.status}>{t.projects.statuses[p.status]}</span>
                </span>
                <ArrowUpRight />
                <span className="visually-hidden"> — {t.projects.index.open}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div ref={peek} className="peek" aria-hidden="true">
        {first ? <img src={first.src} alt="" /> : <div className="peek__api">{'{ }'}</div>}
      </div>
    </div>
  );
}
