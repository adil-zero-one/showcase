import { useLayoutEffect, useRef, useState } from 'react';
import { useI18n, LANGS } from '../i18n';
import { SITE } from '../data/site';
import { asset } from '../lib/asset';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useLineReveal } from '../hooks/useLineReveal';
import { ArrowUpRight, Check, Copy, Download, GitHub, LinkedIn, Mail } from './Icons';
import './contact.css';

type CopyState = 'idle' | 'ok' | 'fail';

async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch { return false; }
  }
}

// Seven curves that start spread along the top and converge on one point (bottom centre),
// drawn in real pixels so the stroke stays crisp at every size.
const FRACTIONS = [0, 0.15, 0.32, 0.5, 0.68, 0.85, 1];
const curves = (w: number, h: number) =>
  FRACTIONS.map((f) => {
    const x = f * w;
    return `M${x} 0 C${x} ${h * 0.45} ${w / 2 + (x - w / 2) * 0.18} ${h * 0.62} ${w / 2} ${h}`;
  });

export function Contact() {
  const { t, lang } = useI18n();
  const C = t.contact;
  const root = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const [size, setSize] = useState({ w: 1000, h: 160 });
  const [copied, setCopied] = useState<CopyState>('idle');
  useLineReveal(titleRef, [lang]);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const measure = () => {
      const w = Math.round(svg.clientWidth), h = Math.round(svg.clientHeight);
      setSize((p) => (p.w === w && p.h === h ? p : { w, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(svg);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      const paths = gsap.utils.toArray<SVGPathElement>('.converge path');
      paths.forEach((p) => { const len = p.getTotalLength(); gsap.set(p, { strokeDasharray: len, strokeDashoffset: len }); });
      gsap.to(paths, { strokeDashoffset: 0, ease: 'none', stagger: 0.04,
        scrollTrigger: { trigger: '.converge', start: 'top 85%', end: 'bottom 55%', scrub: 0.6 } });
      gsap.from('.converge__node', { scale: 0, opacity: 0, transformOrigin: 'center', ease: 'back.out(2.5)', duration: 0.7,
        scrollTrigger: { trigger: '.converge', start: 'bottom 70%', once: true } });
      gsap.from('.contact__main', { scale: 0.7, opacity: 0, duration: 1, ease: 'elastic.out(1, 0.55)',
        scrollTrigger: { trigger: '.contact__main', start: 'top 92%', once: true } });
    }, el);
    return () => ctx.revert();
  }, [reduced, size.w, size.h, lang]);

  const onCopy = async () => {
    const ok = await copyText(SITE.email);
    setCopied(ok ? 'ok' : 'fail');
    window.setTimeout(() => setCopied('idle'), 3200);
  };

  return (
    <section id="contact" ref={root} className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <header className="contact__head">
          <h2 key={lang} id="contact-title" ref={titleRef} className="contact__title display">{C.title}</h2>
          <p className="lede">{C.text}</p>
        </header>

        <svg ref={svgRef} className="converge" viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden="true" focusable="false">
          {curves(size.w, size.h).map((d, i) => (<path key={i} d={d} fill="none" stroke="var(--lime)" strokeWidth="2" />))}
        </svg>
        <span className="converge__node" aria-hidden="true" />

        <div className="contact__primary">
          <a className="contact__main" data-magnetic data-cursor="send" href={`mailto:${SITE.email}`}>
            <Mail /> {C.email}
          </a>
        </div>

        <div className="contact__actions">
          <button type="button" className="btn" onClick={onCopy}>{copied === 'ok' ? <Check /> : <Copy />} {C.copy}</button>
          <a className="btn" href={SITE.github} target="_blank" rel="noopener noreferrer"><GitHub /> {C.github}<ArrowUpRight /><span className="visually-hidden"> {t.a11y.newTab}</span></a>
          <a className="btn" href={SITE.linkedin} target="_blank" rel="noopener noreferrer"><LinkedIn /> {C.linkedin}<ArrowUpRight /><span className="visually-hidden"> {t.a11y.newTab}</span></a>
          <a className="btn" href={asset(SITE.cv[lang])} download><Download /> {C.cv}</a>
        </div>
        <p className="contact__feedback" role="status" aria-live="polite">
          {copied === 'ok' ? C.copied : copied === 'fail' ? C.copyFailed : ''}
        </p>

        <dl className="contact__details">
          <div><dt>{C.emailLabel}</dt><dd><a className="tlink" href={`mailto:${SITE.email}`}>{SITE.email}</a></dd></div>
          <div><dt>{C.phone}</dt><dd><a className="tlink" href={SITE.phoneHref}>{SITE.phone}</a></dd></div>
          <div>
            <dt>{C.cvLanguage}</dt>
            <dd className="contact__cvs">
              {LANGS.map((l) => (
                <a key={l} className="tlink" href={asset(SITE.cv[l])} download lang={l} aria-label={`${C.cv}, ${C.cvNames[l]}`}>{l.toUpperCase()}</a>
              ))}
            </dd>
          </div>
          <div><dt>{C.localTime}</dt><dd><LocalTime /></dd></div>
        </dl>
      </div>
    </section>
  );
}

function LocalTime() {
  const [now, setNow] = useState(() => new Date());
  useLayoutEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(id);
  }, []);
  const s = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: SITE.timeZone }).format(now);
  return <time dateTime={now.toISOString()}>{s}</time>;
}
