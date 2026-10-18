import { useEffect, useRef, useState } from 'react';
import { useI18n, LANGS, type Lang } from '../i18n';
import { NAV, SITE } from '../data/site';
import { asset } from '../lib/asset';
import { Close, Download, Menu } from './Icons';
import { stopScroll, resumeScroll } from '../lib/smooth';
import './nav.css';

/**
 * A floating pill. Active chapter is tracked from what crosses the middle of the screen.
 * On narrow screens the pill shrinks to a logo and a menu button that opens a full-screen list.
 */
export function Nav({ visible }: { visible: boolean }) {
  const { t, lang, setLang } = useI18n();
  const [active, setActive] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ids = ['hero', ...NAV.map((n) => n.id)];
    // 'stack' and 'journey' etc. are all real sections; hero clears the highlight
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
        const first = ids.find((id) => seen.get(id));
        if (first) setActive(first === 'hero' ? '' : first);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6) setActive('contact');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, []);

  useEffect(() => {
    if (!open) return;
    stopScroll();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); resumeScroll(); };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 960px)');
    const f = () => mq.matches && setOpen(false);
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);

  const links = NAV.map(({ id, key }) => (
    <li key={id}>
      <a href={`#${id}`} className="nav__link" aria-current={active === id ? 'true' : undefined} onClick={() => setOpen(false)}>
        {t.nav[key]}
      </a>
    </li>
  ));

  const langs = (
    <div className="nav__lang" role="group" aria-label={t.a11y.language}>
      {LANGS.map((l: Lang) => (
        <button key={l} type="button" lang={l} aria-pressed={lang === l} onClick={() => setLang(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <header className="nav" data-visible={visible} data-scrolled={scrolled} data-open={open}>
      <div className="nav__pill">
        <a className="nav__logo" href="#hero" aria-label="Adil Chainakh" onClick={() => setOpen(false)}>
          <span aria-hidden="true">AC</span>
        </a>
        <nav className="nav__desktop" aria-label={t.a11y.mainNav}>
          <ul>{links}</ul>
        </nav>
        {langs}
        <a className="nav__cv" href={asset(SITE.cv[lang])} download data-magnetic>
          <Download />
          <span>{t.nav.cv}</span>
        </a>
        <button ref={toggle} type="button" className="nav__toggle" aria-expanded={open} aria-controls="menu" aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu} onClick={() => setOpen((o) => !o)}>
          {open ? <Close /> : <Menu />}
        </button>
      </div>
      <div id="menu" className="nav__menu" hidden={!open}>
        <nav aria-label={t.a11y.mainNav}>
          <ul>{links}</ul>
        </nav>
        <a className="btn btn--solid" href={asset(SITE.cv[lang])} download>
          <Download />
          {t.contact.cv}
        </a>
      </div>
    </header>
  );
}
