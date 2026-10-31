import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { EXPERIENCE, LANGUAGES, type LanguageLevel } from '../data/experience';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useLineReveal } from '../hooks/useLineReveal';
import './journey.css';

type Code = (typeof LANGUAGES)[number]['code'];
/** How each of my languages says hello (what the card cycles through). */
const HELLO: Record<Code, { word: string; chars: string }> = {
  ar: { word: 'مرحبا', chars: 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي' },
  es: { word: 'Hola', chars: 'lowerCase' },
  en: { word: 'Hello', chars: 'lowerCase' },
  fr: { word: 'Bonjour', chars: 'lowerCase' },
  ca: { word: 'Bon dia', chars: 'lowerCase' },
};
const LEVEL_N: Record<LanguageLevel, number> = { native: 4, advanced: 3, intermediate: 2, basic: 1 };
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * On tall screens (phones in portrait included) the section pins and the scroll pulls the timeline sideways,
 * oldest to newest. Each card turns to face you as it arrives, its node on the rail lights up, its numeral
 * drifts and its dates scramble in. Cards tilt toward the pointer on hover. On short screens, or with reduced
 * motion, it is a plain vertical list.
 */
export function Journey() {
  const { t, lang } = useI18n();
  const E = t.experience;
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const items = [...EXPERIENCE].reverse();
  const total = items.length + 1;
  useLineReveal(titleRef, [lang]);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    const mm = gsap.matchMedia();
    mm.add('(min-height: 700px)', () => {
      el.dataset.fx = '1';
      const tr = track.current!;
      const pin = el.querySelector<HTMLElement>('.jr__pin')!;
      const dist = () => Math.max(0, tr.scrollWidth - pin.clientWidth);
      const tween = gsap.to(tr, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: pin, start: 'top top', end: () => `+=${dist() + 200}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
      });
      gsap.to('.jr__bar', { scaleX: 1, ease: 'none', transformOrigin: 'left center',
        scrollTrigger: { trigger: pin, start: 'top top', end: () => `+=${dist() + 200}`, scrub: 0.3, invalidateOnRefresh: true } });

      const cards = gsap.utils.toArray<HTMLElement>('.jr__item', tr);
      cards.forEach((item) => {
        const card = item.querySelector<HTMLElement>('.jr__fx')!;
        const base = { trigger: item, containerAnimation: tween };
        // arrives turned away, small and faint; faces you by the time it is two thirds of the way in
        gsap.fromTo(card, { rotateY: 26, scale: 0.88, opacity: 0.25, transformOrigin: '0% 50%' }, {
          rotateY: 0, scale: 1, opacity: 1, ease: 'none',
          scrollTrigger: { ...base, start: 'left 100%', end: 'left 60%', scrub: true },
        });
        // and eases back as it leaves on the left
        gsap.fromTo(card, { scale: 1, opacity: 1 }, {
          scale: 0.94, opacity: 0.55, ease: 'none', immediateRender: false,
          scrollTrigger: { ...base, start: 'right 35%', end: 'right 0%', scrub: true },
        });
        const no = item.querySelector('.jr__no');
        if (no) gsap.fromTo(no, { xPercent: 40 }, { xPercent: -40, ease: 'none', scrollTrigger: { ...base, start: 'left 100%', end: 'right 0%', scrub: true } });
        // the node on the rail lights once the card is well inside the screen
        ScrollTrigger.create({ ...base, start: 'left 72%', toggleClass: { targets: item, className: 'is-lit' } });
        // dates scramble in the first time they are seen
        const per = item.querySelector<HTMLElement>('.jr__period');
        if (per) {
          const final = per.textContent ?? '';
          ScrollTrigger.create({ ...base, start: 'left 85%', once: true, onEnter: () => {
            gsap.fromTo(per, { opacity: 0.4 }, { opacity: 1, duration: 0.5 });
            gsap.to(per, { duration: 0.9, scrambleText: { text: final, chars: '0123456789 -', speed: 0.5 } });
          } });
        }
      });
      return () => { delete el.dataset.fx; };
    });
    mm.add('(max-height: 699px)', () => {
      gsap.from('.jr__item', { y: 50, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.1,
        scrollTrigger: { trigger: track.current, start: 'top 85%', once: true } });
    });
    return () => mm.revert();
  }, [reduced, lang]);

  // Hover: the card tilts toward the pointer and a light follows it (mouse and pen only).
  useEffect(() => {
    const tr = track.current;
    if (!tr || reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const move = (e: PointerEvent) => {
      const card = (e.target as Element).closest<HTMLElement>('.jr__card');
      if (!card) return;
      const b = card.getBoundingClientRect();
      const x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
      card.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
      card.style.setProperty('--ry', `${((x - 0.5) * 9).toFixed(2)}deg`);
      card.style.setProperty('--rx', `${((0.5 - y) * 7).toFixed(2)}deg`);
    };
    const leave = (e: PointerEvent) => {
      const card = (e.target as Element).closest<HTMLElement>('.jr__card');
      if (!card) return;
      ['--ry', '--rx'].forEach((v) => card.style.setProperty(v, '0deg'));
    };
    tr.addEventListener('pointermove', move);
    tr.addEventListener('pointerout', leave);
    return () => { tr.removeEventListener('pointermove', move); tr.removeEventListener('pointerout', leave); };
  }, [reduced]);

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
            {items.map((e, i) => {
              const x = E.items[e.id];
              return (
                <li key={e.id} className="jr__item" data-current={e.current ? 'true' : undefined}>
                  <div className="jr__fx"><div className="jr__card">
                    <span className="jr__no" aria-hidden="true">{pad(i + 1)}</span>
                    <p className="jr__period">{x.period.replace(/Present|Actualidad|Actualitat/i, E.present)}</p>
                    <h3 className="jr__role">{x.role}</h3>
                    <p className="jr__org">{x.org}</p>
                    {x.text && <p className="jr__text">{x.text}</p>}
                    {e.current && <span className="jr__now" aria-hidden="true"><i />{E.present}</span>}
                  </div></div>
                </li>
              );
            })}
            <li className="jr__item jr__item--lang">
              <div className="jr__fx"><LangCard no={pad(total)} reduced={reduced} /></div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

/** The languages card: a greeting that cycles through them, and a four-step meter per language. */
function LangCard({ no, reduced }: { no: string; reduced: boolean }) {
  const { t } = useI18n();
  const E = t.experience;
  const ref = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLParagraphElement>(null);
  const [cur, setCur] = useState<Code>('ar');
  const [pinned, setPinned] = useState<Code | null>(null);
  const [seen, setSeen] = useState(false);
  const shown = pinned ?? cur;

  // only cycle while the card is on screen
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(([en]) => setSeen(en.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);
  useEffect(() => {
    if (!seen || pinned || reduced) return;
    const id = window.setInterval(() => {
      setCur((c) => LANGUAGES[(LANGUAGES.findIndex((l) => l.code === c) + 1) % LANGUAGES.length].code);
    }, 2300);
    return () => window.clearInterval(id);
  }, [seen, pinned, reduced]);

  // the greeting scrambles into the next one
  useEffect(() => {
    const w = word.current;
    if (!w) return;
    const h = HELLO[shown];
    w.lang = shown;
    if (reduced) { w.textContent = h.word; return; }
    const tw = gsap.to(w, { duration: 0.8, scrambleText: { text: h.word, chars: h.chars, speed: 0.6 } });
    return () => { tw.kill(); };
  }, [shown, reduced]);

  return (
    <div ref={ref} className="jr__card jr__card--lang">
      <span className="jr__no" aria-hidden="true">{no}</span>
      <h3 className="jr__role">{E.languages.title}</h3>
      <p ref={word} className="jr__hello" aria-hidden="true" dir={shown === 'ar' ? 'rtl' : 'ltr'}>{HELLO.ar.word}</p>
      <ul className="jr__langs">
        {LANGUAGES.map((l) => (
          <li
            key={l.code}
            data-active={shown === l.code}
            tabIndex={0}
            onPointerEnter={() => setPinned(l.code)}
            onPointerLeave={() => setPinned(null)}
            onFocus={() => setPinned(l.code)}
            onBlur={() => setPinned(null)}
          >
            <span className="jr__ln">{E.languages.names[l.code]}</span>
            <span className="jr__meter" aria-hidden="true">
              {[1, 2, 3, 4].map((n) => (<i key={n} className="jr__seg" data-on={n <= LEVEL_N[l.level]} style={{ transitionDelay: `${n * 110}ms` }} />))}
            </span>
            <span className="jr__ll">{l.code === 'ca' ? E.languages.catalanNote : E.languages.levels[l.level]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
