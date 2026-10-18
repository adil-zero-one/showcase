import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { PortraitGL, type PortraitState } from './PortraitGL';
import { asset } from '../lib/asset';
import portrait from '../data/portrait.json';
import { ArrowDown } from './Icons';
import './hero.css';

const WORDS = ['ADIL', 'CHAINAKH'] as const;
const REST = { wdth: 75, wght: 640 };
const PEAK = { wdth: 100, wght: 800 };

interface Props {
  /** The preloader has lifted: play the entrance. */
  entered: boolean;
  onPortraitReady: () => void;
}

/**
 * Hero. A giant name sits behind the portrait. Each letter swells (variable-font width and weight)
 * as the pointer comes near. The portrait itself is a WebGL scene where the pointer is a "wand":
 * it turns the body into the code layer underneath.
 */
export function Hero({ entered, onPortraitReady }: Props) {
  const { t, lang } = useI18n();
  const reduced = useReducedMotion();
  const host = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const state = useMemo<PortraitState>(() => ({ assemble: reduced ? 1 : 0, grow: 0 }), [reduced]);
  const [fitted, setFitted] = useState(false);

  // ---- fit the name to the width, with fixed letter boxes so the layout never jiggles ----------
  useLayoutEffect(() => {
    const hero = host.current, name = nameRef.current;
    if (!hero || !name) return;
    let cancelled = false;
    const letters = Array.from(name.querySelectorAll<HTMLElement>('.hero__ch'));
    const fit = () => {
      const fs0 = 100;
      hero.style.setProperty('--fs', `${fs0}px`);
      hero.classList.add('hero--measure');
      const em = letters.map((l) => l.getBoundingClientRect().width / fs0);
      letters.forEach((l, i) => l.style.setProperty('--cw', em[i].toFixed(4)));
      hero.classList.remove('hero--measure');
      const sums = WORDS.map((w, wi) => {
        const start = WORDS.slice(0, wi).join('').length;
        return em.slice(start, start + w.length).reduce((a, b) => a + b, 0);
      });
      const avail = name.clientWidth;
      const wide = window.innerWidth >= 900;
      const gapEm = 0.2;
      const total = wide ? sums[0] + sums[1] + gapEm : Math.max(...sums);
      hero.style.setProperty('--fs', `${Math.floor(avail / total)}px`);
      hero.dispatchEvent(new Event('hero:fit'));
      setFitted(true);
    };
    const run = async () => {
      try { await document.fonts.load(`780 100px "Bricolage Grotesque Variable"`); await document.fonts.ready; } catch { /* ignore */ }
      if (!cancelled) fit();
    };
    run();
    const ro = new ResizeObserver(() => { if (!cancelled) fit(); });
    ro.observe(hero);
    return () => { cancelled = true; ro.disconnect(); };
  }, [lang]);

  // ---- letters react to the pointer ---------------------------------------------------------
  useEffect(() => {
    const hero = host.current, name = nameRef.current;
    if (!hero || !name || reduced) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const letters = Array.from(name.querySelectorAll<HTMLElement>('.hero__ch'));
    const cur = letters.map(() => 0);
    let mx = -9999, my = -9999, active = false, visible = true;
    const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; active = true; };
    const onLeave = () => { active = false; };
    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(hero);
    const tick = () => {
      if (!visible) return;
      const fs = parseFloat(getComputedStyle(hero).getPropertyValue('--fs')) || 200;
      const reach = fs * 0.85;
      letters.forEach((l, i) => {
        let target = 0;
        if (active) {
          const b = l.getBoundingClientRect();
          const d = Math.hypot(mx - (b.left + b.width / 2), my - (b.top + b.height / 2));
          target = Math.max(0, 1 - d / reach);
          target = target * target * (3 - 2 * target);
        }
        const next = cur[i] + (target - cur[i]) * 0.14;
        if (Math.abs(next - cur[i]) > 0.002) {
          cur[i] = next;
          l.style.fontVariationSettings = `'wdth' ${(REST.wdth + (PEAK.wdth - REST.wdth) * next).toFixed(1)}, 'wght' ${Math.round(REST.wght + (PEAK.wght - REST.wght) * next)}`;
        }
      });
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
      io.disconnect();
    };
  }, [reduced, lang]);

  // ---- entrance --------------------------------------------------------------------------------
  const played = useRef(false);
  useLayoutEffect(() => {
    if (reduced || played.current) return;
    const hero = host.current;
    if (!hero) return;
    gsap.set(hero.querySelectorAll('.hero__ch'), { yPercent: 108 });
    gsap.set(hero.querySelectorAll('.hero__fade'), { opacity: 0, y: 28 });
  }, [reduced]);

  useEffect(() => {
    if (!entered || reduced || played.current || !fitted) return;
    played.current = true;
    const hero = host.current!;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.to('.hero__ch', { yPercent: 0, duration: 1.5, stagger: { each: 0.05 } }, 0.05)
        .to(state, { assemble: 1, duration: 2.8, ease: 'power2.inOut' }, 0.1)
        .to('.hero__fade', { opacity: 1, y: 0, duration: 1.1, stagger: 0.1 }, 1.3);
    }, hero);
    return () => ctx.revert();
  }, [entered, reduced, fitted, state]);

  // reduced motion: everything is simply there
  useEffect(() => {
    if (reduced) onPortraitReady();
  }, [reduced, onPortraitReady]);

  // ---- leaving the hero: the lens grows until the whole portrait is code ---------------------------
  useEffect(() => {
    if (reduced) return;
    const hero = host.current!;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: hero, start: 'top top', end: 'bottom 20%', scrub: true,
        onUpdate: (self) => { state.grow = Math.min(1, Math.pow(self.progress, 1.4) * 1.25); },
      });
      gsap.to('.hero__parallax', {
        yPercent: -14, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hero__ui', {
        opacity: 0, y: -40, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: '45% top', scrub: true },
      });
    }, hero);
    return () => ctx.revert();
  }, [reduced, state]);

  return (
    <section id="hero" ref={host} className="hero" aria-label={t.hero.role}>
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__parallax">
        <h1 ref={nameRef} className="hero__name" data-name aria-label="Adil Chainakh">
          {WORDS.map((w) => (
            <span key={w} className="hero__word" aria-hidden="true">
              {w.split('').map((c, i) => (
                <span key={i} className="hero__ch" style={{ fontVariationSettings: `'wdth' ${REST.wdth}, 'wght' ${REST.wght}` }}>{c}</span>
              ))}
            </span>
          ))}
        </h1>
      </div>

      <div className="hero__portrait" role="img" aria-label={t.a11y.portrait}>
        {reduced ? (
          <img className="portrait-fallback" src={asset('portrait.webp')} width={portrait.w} height={portrait.h} alt="" />
        ) : (
          <PortraitGL state={state} host={host} onReady={onPortraitReady} />
        )}
      </div>

      <div className="hero__ui">
        <div className="hero__left">
          <p className="hero__role hero__fade">{t.hero.role}</p>
          <p className="hero__intro hero__fade">{t.hero.intro}</p>
          <div className="hero__cta hero__fade">
            <a className="btn btn--solid" href="#projects" data-magnetic>
              {t.hero.ctaWork}
              <ArrowDown />
            </a>
            <a className="btn" href="#contact" data-magnetic>{t.hero.ctaContact}</a>
          </div>
        </div>
        <div className="hero__right">
          <p className="hero__avail hero__fade">
            <span className="dot" aria-hidden="true" />
            {t.availability.short}
          </p>
          <p className="hero__place hero__fade">{t.hero.place}</p>
          <p className="hero__hint hero__fade" aria-hidden="true">{t.hero.hint}</p>
        </div>
      </div>
    </section>
  );
}
