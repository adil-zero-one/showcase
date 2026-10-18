import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import type { Project } from '../data/projects';
import { gsap } from '../lib/gsap';

/**
 * A screenshot with a wand layer under it. Hovering (or tapping, or pressing the button) opens a lens that
 * shows how the project is built. The same text is the case study's "technical decisions".
 */
export function Shot({ project }: { project: Project }) {
  const { t } = useI18n();
  const L = t.projects.labels;
  const txt = t.projects.items[project.id];
  const box = useRef<HTMLDivElement>(null);
  const [forced, setForced] = useState(false);
  const fine = useRef(false);

  useEffect(() => {
    fine.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const el = box.current;
    if (!el || !fine.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const pos = { x: 0, y: 0, tx: 0, ty: 0 };
    let hovering = false;
    const radius = () => Math.min(190, Math.max(120, el.clientWidth * 0.24));
    const tick = () => {
      pos.x += (pos.tx - pos.x) * 0.2;
      pos.y += (pos.ty - pos.y) * 0.2;
      el.style.setProperty('--x', `${pos.x.toFixed(1)}px`);
      el.style.setProperty('--y', `${pos.y.toFixed(1)}px`);
    };
    const onEnter = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      pos.x = pos.tx = e.clientX - b.left; pos.y = pos.ty = e.clientY - b.top;
      hovering = true;
      gsap.ticker.add(tick);
      gsap.to(el, { '--r': `${radius()}px`, duration: 0.7, ease: 'expo.out', overwrite: true });
    };
    const onMove = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      pos.tx = e.clientX - b.left; pos.ty = e.clientY - b.top;
    };
    const onLeave = () => {
      if (!hovering) return;
      hovering = false;
      gsap.to(el, { '--r': '0px', duration: 0.6, ease: 'expo.inOut', overwrite: true, onComplete: () => gsap.ticker.remove(tick) });
    };
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      gsap.ticker.remove(tick);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const lines = txt.decisions.slice(0, 3);
  const images = project.images;

  return (
    <div className="shotwrap">
      <div
        ref={box}
        className="shot"
        data-open={forced}
        data-kind={project.id}
        data-cursor="none"
        onClick={(e) => { if ((e as unknown as PointerEvent).pointerType === 'touch' || !fine.current) setForced((f) => !f); }}
      >
        {/* base layer: what you see */}
        <div className="shot__base">
          {project.id === 'api' && project.api ? (
            <ul className="apiviz">
              {project.api.endpoints.map((e) => (
                <li key={e.method + e.path}>
                  <span className={`apiviz__m apiviz__m--${e.method}`}>{e.method}</span>
                  <code>{e.path}</code>
                  <span className="apiviz__s">{e.status}</span>
                </li>
              ))}
            </ul>
          ) : project.id === 'banners' ? (
            <div className="shot__banners">
              {images.map((im, i) => (<img key={im.src} src={im.src} width={im.width} height={im.height} alt={i === 0 ? txt.images[0] : ''} loading="lazy" decoding="async" />))}
            </div>
          ) : (
            <img src={images[0].src} width={images[0].width} height={images[0].height} alt={txt.images[0]} loading="lazy" decoding="async" />
          )}
        </div>

        {/* wand layer: how it is built */}
        <div className="shot__layer" aria-hidden={!forced}>
          <p className="shot__h">{'// '}{L.reveal}</p>
          <ul>
            {lines.map((d) => (<li key={d}>{d}</li>))}
          </ul>
        </div>
        <span className="shot__ring" aria-hidden="true" />
      </div>
      <div className="shotwrap__row">
        <button type="button" className="tlink shot__toggle" aria-pressed={forced} onClick={() => setForced((f) => !f)}>
          {forced ? L.hideBuilt : L.showBuilt}
        </button>
        <span className="shot__hint" aria-hidden="true">{L.hint}</span>
      </div>
    </div>
  );
}
