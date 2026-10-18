import { useLayoutEffect, useRef } from 'react';
import { useI18n } from '../i18n';
import { EXPERIENCE, LANGUAGES } from '../data/experience';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useLineReveal } from '../hooks/useLineReveal';
import './journey.css';

/**
 * On wide screens the section pins and the scroll pulls the timeline sideways (oldest to newest),
 * with a progress bar along the top. On narrow screens, or with reduced motion, it is a plain
 * vertical list.
 */
export function Journey() {
  const { t, lang } = useI18n();
  const E = t.experience;
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const items = [...EXPERIENCE].reverse();
  useLineReveal(titleRef, [lang]);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 960px) and (min-height: 640px)', () => {
      const tr = track.current!;
      const dist = () => Math.max(0, tr.scrollWidth - el.querySelector<HTMLElement>('.jr__pin')!.clientWidth);
      const tween = gsap.to(tr, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: el.querySelector('.jr__pin'), start: 'top top', end: () => `+=${dist() + 200}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
      });
      gsap.to('.jr__bar', { scaleX: 1, ease: 'none', transformOrigin: 'left center',
        scrollTrigger: { trigger: el.querySelector('.jr__pin'), start: 'top top', end: () => `+=${dist() + 200}`, scrub: 0.3, invalidateOnRefresh: true } });
      return () => { tween.kill(); };
    });
    mm.add('(max-width: 959px), (max-height: 639px)', () => {
      gsap.from('.jr__item', { y: 50, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.1,
        scrollTrigger: { trigger: track.current, start: 'top 85%', once: true } });
    });
    return () => mm.revert();
  }, [reduced, lang]);

  return (
    <section id="journey" ref={root} className="journey on-light" aria-labelledby="jr-title">
      <div className="jr__pin">
        <div className="jr__bar" aria-hidden="true" />
        <div className="jr__layout">
          <header className="jr__head">
            <h2 key={lang} id="jr-title" ref={titleRef} className="jr__title display">{E.title}</h2>
            <p className="lede">{E.intro}</p>
          </header>
          <ol ref={track} className="jr__track">
            {items.map((e) => {
              const x = E.items[e.id];
              return (
                <li key={e.id} className="jr__item" data-current={e.current ? 'true' : undefined}>
                  <p className="jr__period">{x.period.replace(/Present|Actualidad|Actualitat/i, E.present)}</p>
                  <h3 className="jr__role">{x.role}</h3>
                  <p className="jr__org">{x.org}</p>
                  {x.text && <p className="jr__text">{x.text}</p>}
                </li>
              );
            })}
            <li className="jr__item jr__item--lang">
              <h3 className="jr__role">{E.languages.title}</h3>
              <ul className="jr__langs">
                {LANGUAGES.map((l) => (
                  <li key={l.code}>
                    <span className="jr__ln">{E.languages.names[l.code]}</span>
                    <span className="jr__ll">{l.code === 'ca' ? E.languages.catalanNote : E.languages.levels[l.level]}</span>
                  </li>
                ))}
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
