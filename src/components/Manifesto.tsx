import { useLayoutEffect, useRef } from 'react';
import { useI18n } from '../i18n';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './manifesto.css';

// Verifiable numbers only: languages from the CV, clips from the showreel, repos on GitHub, one live product.
const FACTS = [5, 7, 4, 1];

/** A statement that fills in word by word as you scroll, and four counted facts. */
export function Manifesto() {
  const { t, lang } = useI18n();
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const words = t.manifesto.statement.split(' ');

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.mf__w', { opacity: 0.14 }, {
        opacity: 1, ease: 'none', stagger: 0.12,
        scrollTrigger: { trigger: '.mf__text', start: 'top 78%', end: 'bottom 52%', scrub: 0.5 },
      });
      gsap.utils.toArray<HTMLElement>('.mf__n').forEach((n, i) => {
        const o = { v: 0 };
        gsap.to(o, {
          v: FACTS[i], duration: 1.8, ease: 'power3.out',
          scrollTrigger: { trigger: n, start: 'top 90%', once: true },
          onUpdate: () => { n.textContent = String(Math.round(o.v)); },
        });
      });
      gsap.from('.mf__fact', {
        yPercent: 40, opacity: 0, duration: 1, stagger: 0.12, ease: 'expo.out',
        scrollTrigger: { trigger: '.mf__facts', start: 'top 88%', once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced, lang]);

  return (
    <section id="manifesto" ref={root} className="section manifesto on-light">
      <div className="container">
        <p key={lang} className="mf__text display">
          {words.map((w, i) => (
            <span key={i} className="mf__w">{w}{' '}</span>
          ))}
        </p>
        <ul className="mf__facts">
          {t.manifesto.facts.map((label, i) => (
            <li key={label} className="mf__fact">
              <span className="mf__n display">{reduced ? FACTS[i] : 0}</span>
              <span className="mf__l">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
