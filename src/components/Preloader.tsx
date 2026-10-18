import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { useI18n } from '../i18n';

/**
 * A short, honest loader: the counter follows real readiness (fonts + portrait + glyph atlas),
 * then the curtain lifts. It never waits longer than it needs to, and is skipped entirely
 * for visitors who prefer reduced motion.
 */
export function Preloader({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const { t } = useI18n();
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);
  const progress = useRef({ v: 0 });
  const done = useRef(false);

  // creep towards 85% while we wait
  useEffect(() => {
    const tw = gsap.to(progress.current, {
      v: 85, duration: 2.2, ease: 'power2.out',
      onUpdate: () => paint(),
    });
    function paint() {
      const v = Math.round(progress.current.v);
      if (num.current) num.current.textContent = String(v);
      if (bar.current) bar.current.style.transform = `scaleX(${progress.current.v / 100})`;
    }
    return () => { tw.kill(); };
  }, []);

  useEffect(() => {
    if (!ready || done.current) return;
    done.current = true;
    const el = root.current!;
    const tl = gsap.timeline({ onComplete: () => { setGone(true); onDone(); } });
    tl.to(progress.current, {
      v: 100, duration: 0.5, ease: 'power2.inOut',
      onUpdate: () => {
        if (num.current) num.current.textContent = String(Math.round(progress.current.v));
        if (bar.current) bar.current.style.transform = `scaleX(${progress.current.v / 100})`;
      },
    })
      .to('.preloader__inner', { yPercent: -30, opacity: 0, duration: 0.5, ease: 'power3.in' }, '+=0.12')
      // the curtain peels off upwards; its rounded bottom edge is the "reveal"
      .to(el, { yPercent: -101, duration: 1.0, ease: 'expo.inOut' }, '-=0.2');
    // let the hero start while the curtain is still moving
    tl.call(() => onDone(), undefined, '-=0.65');
    return () => { tl.kill(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  if (gone) return null;
  return (
    <div ref={root} className="preloader" role="status" aria-label={t.a11y.loading}>
      <div className="preloader__inner">
        <span className="preloader__num display"><span ref={num}>0</span></span>
        <span className="preloader__bar"><span ref={bar} /></span>
        <span className="small">{t.hero.loading}</span>
      </div>
    </div>
  );
}
