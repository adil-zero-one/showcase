import { useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { SITE } from '../data/site';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useLineReveal } from '../hooks/useLineReveal';
import { ArrowUpRight } from './Icons';
import './scoutwand.css';

const SITES = ['LinkedIn', 'Indeed', 'InfoJobs'];
const SAMPLE = { name: 'Alex Example', city: 'Tarragona', phone: '+34 600 000 000' };

/**
 * ScoutWand, shown as the flow it actually has: you type, it scouts, you apply.
 * On desktop the section pins and the scroll position plays an illustrated window;
 * on small screens the same sequence loops by itself while it is on screen.
 * The jobs and the person in the window are examples, and the caption says so.
 */
export function ScoutWand() {
  const { t, lang } = useI18n();
  const S = t.scout;
  const root = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const compact = useMediaQuery('(max-width: 899px)');
  const [step, setStep] = useState(reduced ? 2 : 0);
  useLineReveal(titleRef, [lang]);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const typed = el.querySelector<HTMLElement>('.sw-typed')!;
      const typed2 = el.querySelector<HTMLElement>('.sw-typed2')!;
      const q = S.mock.query, w = S.mock.where;
      const a = { n: 0 }, b = { n: 0 }, c = { n: 0 };
      typed.textContent = reduced ? q : '';
      typed2.textContent = reduced ? w : '';
      if (reduced) { setStep(2); return; }

      const count = el.querySelector<HTMLElement>('.sw-count')!;
      count.textContent = '0';
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
      // 1. you type
      tl.to(a, { n: q.length, duration: 0.55, onUpdate: () => { typed.textContent = q.slice(0, Math.round(a.n)); } }, 0)
        .to(b, { n: w.length, duration: 0.25, onUpdate: () => { typed2.textContent = w.slice(0, Math.round(b.n)); } }, 0.55)
        .to('.sw-scoutbtn', { scale: 0.9, duration: 0.06, yoyo: true, repeat: 1 }, 0.88)
        // 2. it scouts
        .fromTo('.sw-results', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 1)
        .fromTo('.sw-scanbar', { xPercent: -101 }, { xPercent: 0, duration: 0.6 }, 1)
        .to('.sw-site', { backgroundColor: '#d3ff3b', color: '#070a1c', borderColor: '#d3ff3b', stagger: 0.2, duration: 0.06 }, 1.02)
        .fromTo('.sw-row', { y: 26, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.11, duration: 0.2, ease: 'power2.out' }, 1.3)
        .to(c, { n: 4, duration: 0.5, onUpdate: () => { count.textContent = String(Math.round(c.n)); } }, 1.3)
        // 3. you apply
        .to('.sw-results', { xPercent: compact ? 0 : -3, scale: 0.95, opacity: compact ? 0.0 : 0.5, duration: 0.3 }, 2)
        .fromTo('.sw-form', { autoAlpha: 0, xPercent: 14 }, { autoAlpha: 1, xPercent: 0, duration: 0.3, ease: 'power2.out' }, 2)
        .fromTo('.sw-fill', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', stagger: 0.17, duration: 0.14 }, 2.25)
        .fromTo('.sw-val', { opacity: 0 }, { opacity: 1, stagger: 0.17, duration: 0.08 }, 2.36)
        .fromTo('.sw-cvchip', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 2.75)
        .fromTo('.sw-apply', { backgroundColor: 'rgba(211,255,59,0)', color: '#d3ff3b' }, { backgroundColor: '#d3ff3b', color: '#070a1c', duration: 0.1 }, 2.88);

      let last = -1;
      const setFromProgress = (p: number) => {
        const s = Math.min(2, Math.floor(p * 3));
        if (s !== last) { last = s; setStep(s); }
      };

      if (!compact) {
        ScrollTrigger.create({
          trigger: '.sw__stage', start: 'top top', end: '+=240%', pin: true, scrub: 0.7, animation: tl,
          onUpdate: (self) => setFromProgress(self.progress),
        });
      } else {
        tl.duration(9).repeat(-1).repeatDelay(1.4).eventCallback('onUpdate', () => setFromProgress(tl.progress()));
        ScrollTrigger.create({
          trigger: '.sw__win', start: 'top 85%', end: 'bottom 10%',
          onToggle: (self) => { if (self.isActive) tl.play(); else tl.pause(); },
        });
      }
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, compact, lang]);

  return (
    <section id="scoutwand" ref={root} className="sw" aria-labelledby="sw-title">
      <div className="sw__stage">
        <div className="sw__grid">
          <div className="sw__copy">
            <h2 key={lang} id="sw-title" ref={titleRef} className="sw__title display">{S.title}</h2>
            <p className="sw__lede">{S.lede}</p>
            <ol className="sw__steps">
              {S.steps.map((s, i) => (
                <li key={s.title} className="sw__step" data-active={step === i}>
                  <h3 className="sw__stepTitle display">{s.title}</h3>
                  <div className="sw__stepBody"><p>{s.text}</p></div>
                </li>
              ))}
            </ol>
          </div>

          <figure className="sw__figure">
            <div className="sw__win" role="img" aria-label={t.a11y.demo}>
              <div className="sw__bar" aria-hidden="true">
                <i /><i /><i />
                <span>ScoutWand</span>
              </div>
              <div className="sw__body" aria-hidden="true">
                <div className="sw-query">
                  <div className="sw-input sw-input--wide"><span className="sw-typed" /><span className="sw-caret" /></div>
                  <div className="sw-input"><span className="sw-typed2" /></div>
                  <span className="sw-scoutbtn">{S.mock.search}</span>
                </div>
                <div className="sw-sites">
                  {SITES.map((s) => (<span key={s} className="sw-site">{s}</span>))}
                  <span className="sw-found"><b className="sw-count">4</b> {S.mock.matches}</span>
                </div>
                <div className="sw-scan"><span className="sw-scanbar" /></div>
                <div className="sw-stack">
                  <ul className="sw-results">
                    {S.mock.titles.map((title, i) => (
                      <li key={title} className="sw-row">
                        <span className="sw-row__t">{title}</span>
                        <span className="sw-row__s">{SITES[i % 3]}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="sw-form">
                    <p className="sw-cvchip">{S.mock.fromCv}</p>
                    {[['name', SAMPLE.name], ['city', SAMPLE.city], ['phone', SAMPLE.phone]].map(([k, v]) => (
                      <div key={k} className="sw-field">
                        <span className="sw-field__l">{S.mock[k as 'name' | 'city' | 'phone']}</span>
                        <span className="sw-field__v"><span className="sw-fill" /><span className="sw-val">{v}</span></span>
                      </div>
                    ))}
                    <div className="sw-final">
                      <span className="sw-review">{S.mock.review}</span>
                      <span className="sw-apply">{S.mock.apply}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <figcaption className="sw__caption">{S.caption}</figcaption>
          </figure>
        </div>
      </div>

      <div className="sw__foot container">
        <ul className="sw__facts">
          {S.facts.map((f) => (<li key={f} className="tag">{f}</li>))}
        </ul>
        <dl className="sw__built">
          <div><dt>{S.built.site}</dt><dd>{S.built.siteTech}</dd></div>
          <div><dt>{S.built.app}</dt><dd>{S.built.appTech}</dd></div>
        </dl>
        <a className="btn btn--solid" href={SITE.scoutwand} target="_blank" rel="noopener noreferrer" data-magnetic>
          {S.cta}
          <ArrowUpRight />
          <span className="visually-hidden"> {t.a11y.newTab}</span>
        </a>
      </div>
    </section>
  );
}
