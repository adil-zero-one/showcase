import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { STACK, type StackGroup, type StackNode } from '../data/stack';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useLineReveal } from '../hooks/useLineReveal';
import './skills.css';

const GROUPS: StackGroup[] = ['backend', 'frontend', 'tools'];

/**
 * Every technology is a button. A lime lens follows the pointer across the words (a duplicate layer
 * clipped to a circle); the border style says how much proof there is behind each word.
 */
export function Skills() {
  const { t, lang } = useI18n();
  const S = t.stack;
  const root = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState<StackNode | null>(null);
  useLineReveal(titleRef, [lang]);

  // pointer lens: write the pointer position, relative to each word, into CSS variables
  useEffect(() => {
    const el = root.current;
    if (!el || reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let raf = 0;
    let px = -9999, py = -9999;
    const words = () => Array.from(el.querySelectorAll<HTMLElement>('.sk__w'));
    const paint = () => {
      raf = 0;
      for (const w of words()) {
        const b = w.getBoundingClientRect();
        w.style.setProperty('--mx', `${px - b.left}px`);
        w.style.setProperty('--my', `${py - b.top}px`);
      }
    };
    const onMove = (e: PointerEvent) => { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(paint); };
    const onLeave = () => { px = py = -9999; if (!raf) raf = requestAnimationFrame(paint); };
    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);
    return () => { el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', onLeave); cancelAnimationFrame(raf); };
  }, [reduced]);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      gsap.from('.sk__w', {
        yPercent: 90, opacity: 0, duration: 1, ease: 'expo.out', stagger: { each: 0.03, from: 'random' },
        scrollTrigger: { trigger: '.sk__groups', start: 'top 85%', once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced, lang]);

  return (
    <section id="stack" ref={root} className="section skills" aria-labelledby="sk-title">
      <div className="container">
        <header className="skills__head">
          <h2 key={lang} id="sk-title" ref={titleRef} className="skills__title display">{S.title}</h2>
          <p className="lede">{S.intro}</p>
          <ul className="skills__legend" aria-label="Legend">
            {(['used', 'listed', 'learning'] as const).map((k) => (
              <li key={k}><span className={`sk__sw sk__sw--${k}`} aria-hidden="true" />{S.legend[k]}</li>
            ))}
          </ul>
        </header>

        <div className="sk__groups">
          {GROUPS.map((g) => (
            <div key={g} className="sk__group" role="group" aria-label={S.groups[g]}>
              <h3 className="sk__gh">{S.groups[g]}</h3>
              <ul className="sk__list">
                {STACK.filter((n) => n.group === g).map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      className={`sk__w sk__w--${n.status}`}
                      data-active={active?.id === n.id}
                      onMouseEnter={() => setActive(n)}
                      onFocus={() => setActive(n)}
                      onClick={() => setActive(n)}
                    >
                      <span className="sk__base">{n.label}</span>
                      <span className="sk__lit" aria-hidden="true">{n.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* All details share one grid cell, so the panel is always as tall as the longest one.
            If it resized on hover, everything below would shift and the pinned Journey section would misalign. */}
        <div className="sk__detail">
          <div className="sk__sizer" aria-hidden="true">
            <p className="sk__dt sk__dt--idle">{S.detailPrompt}</p>
            {STACK.map((n) => (
              <div key={n.id}>
                <p className="sk__dn display">{n.label}</p>
                <p className="sk__ds"><span className="sk__sw" />{S.statusLabel[n.status]}</p>
                <p className="sk__dt">{S.items[n.id]}</p>
              </div>
            ))}
          </div>
          <div className="sk__live" role="status" aria-live="polite">
            {active ? (
              <>
                <p className="sk__dn display">{active.label}</p>
                <p className="sk__ds"><span className={`sk__sw sk__sw--${active.status}`} aria-hidden="true" />{S.statusLabel[active.status]}</p>
                <p className="sk__dt">{S.items[active.id]}</p>
              </>
            ) : (
              <p className="sk__dt sk__dt--idle">{S.detailPrompt}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
