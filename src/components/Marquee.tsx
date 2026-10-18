import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { scrollVelocity } from '../lib/smooth';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './marquee.css';

const WORDS = ['PHP', 'Laravel', 'Symfony', 'Python', 'Tailwind CSS', 'Docker', 'MySQL', 'After Effects', 'Photoshop', 'ScoutWand'];

/** A lime band that cuts across the page. It speeds up and reverses with your scrolling. */
export function Marquee() {
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = track.current;
    if (!el || reduced) return;
    const tween = gsap.to(el, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
    let dir = 1;
    const tick = () => {
      const v = scrollVelocity();
      if (Math.abs(v) > 0.3) dir = v > 0 ? 1 : -1;
      const target = dir * (1 + Math.min(Math.abs(v) * 0.55, 7));
      tween.timeScale(tween.timeScale() + (target - tween.timeScale()) * 0.08);
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); tween.kill(); };
  }, [reduced]);

  const row = WORDS.map((w) => (
    <span className="marquee__item" key={w}>
      {w}
      <svg className="marquee__star" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
        <path d="M20 0c1.6 10.4 9.6 18.4 20 20-10.4 1.6-18.4 9.6-20 20-1.6-10.4-9.6-18.4-20-20C10.4 18.4 18.4 10.4 20 0z" fill="currentColor" />
      </svg>
    </span>
  ));

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__band">
        <div ref={track} className="marquee__track">
          <div className="marquee__row">{row}</div>
          <div className="marquee__row">{row}</div>
        </div>
      </div>
    </div>
  );
}
