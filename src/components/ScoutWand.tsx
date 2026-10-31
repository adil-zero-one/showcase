import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { SITE } from '../data/site';
import { asset } from '../lib/asset';
import { clipMeta } from '../lib/media';
import { ScrollTrigger } from '../lib/gsap';
import { goTo, resumeScroll, stopScroll } from '../lib/smooth';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useLineReveal } from '../hooks/useLineReveal';
import { ScoutApp } from '../scout/ScoutApp';
import { CHECK, stepAt, tourAt, type AppState } from '../scout/tour';
import { ArrowUpRight, Close, Play } from './Icons';
import './scoutwand.css';

/** The tour's frame to start the live app from: whatever is typed stays, a started search is finished, overlays are closed. */
const unlock = (p: number): AppState => {
  const s = tourAt(p);
  return { ...s, shown: p >= CHECK.search ? tourAt(0.85).shown : s.shown, running: false, fill: null, hot: null, typing: null, pressed: null };
};

/**
 * ScoutWand: a working replica of the app window. The section pins and the scroll position plays a
 * typed search, the offers arriving and Auto-Fill. Touch the window and the tour stops: it is a small
 * live app (invented offers) until "Replay the tour" hands it back to the scroll.
 * Pinned on every screen size; phones get a single-panel layout.
 */
export function ScoutWand() {
  const { t, lang } = useI18n();
  const S = t.scout;
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const compact = useMediaQuery('(max-width: 899px)');
  const [p, setP] = useState(0);
  const [free, setFree] = useState(false);
  /** the tour's last frame, which the live app starts from when the visitor unlocks it */
  const [frozen, setFrozen] = useState<AppState | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  useLineReveal(titleRef, [lang, compact]);

  const interactive = free || reduced;
  const snapshot = interactive ? null : tourAt(p);
  const step = reduced ? -1 : stepAt(p);

  useLayoutEffect(() => {
    const el = stage.current;
    if (!el || reduced) return;
    el.style.setProperty('--in', '0');
    el.style.setProperty('--p', '0');
    let last = -1;
    const st = ScrollTrigger.create({
      trigger: el, start: 'top top', end: compact ? '+=260%' : '+=340%', pin: true, anticipatePin: 1,
      onUpdate: (self) => {
        const q = Math.round(self.progress * 400) / 400;
        el.style.setProperty('--p', String(self.progress));
        el.style.setProperty('--in', String(Math.min(1, self.progress / 0.07)));
        if (q !== last) { last = q; setP(q); }
      },
    });
    return () => { st.kill(); };
  }, [reduced, compact, lang]);

  const watchDemo = () => {
    window.dispatchEvent(new CustomEvent('showreel:select', { detail: 'scoutwand-demo' }));
    goTo('showreel');
  };

  const copy = (
    <>
      <h2 key={`${lang}-${compact}`} id="sw-title" ref={titleRef} className="sw__title display">{S.title}</h2>
      <p className="sw__lede">{S.lede}</p>
    </>
  );

  return (
    <section id="scoutwand" ref={root} className="sw" aria-labelledby="sw-title">
      {compact && <header className="sw__intro container">{copy}</header>}

      <div ref={stage} className="sw__stage" data-free={interactive} data-reduced={reduced}>
        <div className="sw__grid">
          {!compact ? (
            <div className="sw__copy">
              {copy}
              <ol className="sw__steps">
                {S.steps.map((s, i) => (
                  <li key={s.title} className="sw__step" data-active={reduced ? true : step === i}>
                    <h3 className="sw__stepTitle display">{s.title}</h3>
                    <div className="sw__stepBody"><p>{s.text}</p></div>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <ol className="sw__caps" aria-label={S.title}>
              {S.steps.map((s, i) => (
                <li key={s.title} className="sw__cap" data-active={reduced ? true : step === i}>
                  <h3 className="sw__capTitle display">{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          )}

          <figure className="sw__figure">
            <div className="sw__win">
              <ScoutApp key={interactive ? 'live' : 'tour'} tour={snapshot} initial={frozen ?? (reduced ? tourAt(0.86) : tourAt(0))} onTakeOver={() => undefined} />
            </div>
            <figcaption className="sw__caption">
              <span>{free && !reduced ? S.control : interactive ? S.tryIt : S.hint}</span>
              {!interactive && (
                <button type="button" className="sw__replay" onClick={() => { setFrozen(unlock(p)); setFree(true); }}>{S.tryBtn}</button>
              )}
              {free && !reduced && (
                <button type="button" className="sw__replay" onClick={() => { setFree(false); setFrozen(null); }}>{S.replay}</button>
              )}
              <span className="sw__eg">{S.caption}</span>
            </figcaption>
          </figure>
        </div>
        <div className="sw__glow" aria-hidden="true" />
        <div className="sw__rail" aria-hidden="true"><i /></div>
      </div>

      <div className="sw__foot container">
        <ul className="sw__facts">
          {S.facts.map((f) => (<li key={f} className="tag">{f}</li>))}
        </ul>
        <dl className="sw__built">
          <div><dt>{S.built.site}</dt><dd>{S.built.siteTech}</dd></div>
          <div><dt>{S.built.app}</dt><dd>{S.built.appTech}</dd></div>
        </dl>
        <div className="sw__ctas">
          <button type="button" className="btn" onClick={watchDemo} data-magnetic><Play />{S.watchDemo}</button>
          <button type="button" className="btn" onClick={() => setVideoOpen(true)} data-magnetic><Play />{S.realApp}</button>
          <a className="btn btn--solid" href={SITE.scoutwand} target="_blank" rel="noopener noreferrer" data-magnetic>
            {S.cta}
            <ArrowUpRight />
            <span className="visually-hidden"> {t.a11y.newTab}</span>
          </a>
        </div>
      </div>

      {videoOpen && <RealAppDialog onClose={() => setVideoOpen(false)} />}
    </section>
  );
}

/** The screen recording of the real app, on the native <dialog> (focus trap, Escape, restore). */
function RealAppDialog({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const S = t.scout;
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);
  const m = clipMeta('scoutwand-app');

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    opener.current = document.activeElement;
    if (!dlg.open) dlg.showModal();
    stopScroll();
    document.body.classList.add('dialog-open');
    return () => {
      document.body.classList.remove('dialog-open');
      resumeScroll();
      if (dlg.open) dlg.close();
      (opener.current as HTMLElement | null)?.focus?.({ preventScroll: true });
    };
  }, []);

  return (
    <dialog ref={ref} className="sw-vd" aria-labelledby="sw-vd-title" onClose={onClose} onClick={(e) => { if (e.target === e.currentTarget) ref.current?.close(); }}>
      <div className="sw-vd__inner">
        <header className="sw-vd__head">
          <h3 id="sw-vd-title" className="display">{S.realApp}</h3>
          <button type="button" className="cd__close" onClick={() => ref.current?.close()} aria-label={t.a11y.close}><Close /></button>
        </header>
        <video className="sw-vd__video" src={asset('media/showreel/scoutwand-app.mp4')} poster={asset('media/showreel/scoutwand-app.webp')}
          controls autoPlay muted playsInline preload="metadata" width={m.width} height={m.height} />
        <p className="small">{S.realAppNote}</p>
      </div>
    </dialog>
  );
}

