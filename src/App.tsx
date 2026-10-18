import { useCallback, useEffect, useState } from 'react';
import { I18nProvider, useI18n } from './i18n';
import { useReducedMotion } from './hooks/useReducedMotion';
import { refreshScroll } from './lib/gsap';
import { installAnchorScroll, startSmoothScroll, stopScroll, resumeScroll } from './lib/smooth';
import { Cursor } from './components/Cursor';
import { Preloader } from './components/Preloader';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { Manifesto } from './components/Manifesto';
import { ScoutWand } from './components/ScoutWand';
import { Projects } from './components/Projects';
import { Showreel } from './components/Showreel';
import { Skills } from './components/Skills';
import { Journey } from './components/Journey';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { useMagneticAll } from './hooks/useMagneticAll';
import './components/preloader.css';

function Shell() {
  const { t, lang } = useI18n();
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(reduced);
  const onPortraitReady = useCallback(() => setReady(true), []);
  const onDone = useCallback(() => setEntered(true), []);

  // smooth scrolling (not for reduced motion), locked while the preloader is up
  useEffect(() => {
    if (!reduced) {
      const stop = startSmoothScroll();
      stopScroll();
      return stop;
    }
  }, [reduced]);
  useEffect(() => { if (entered) resumeScroll(); }, [entered]);
  useEffect(() => installAnchorScroll(), []);
  useMagneticAll();

  useEffect(() => {
    document.fonts?.ready.then(() => refreshScroll(80));
    const onLoad = () => refreshScroll(80);
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);
  useEffect(() => { refreshScroll(250); }, [lang]);

  return (
    <>
      <a className="skip-link" href="#main">{t.a11y.skipToContent}</a>
      {!reduced && <Preloader ready={ready} onDone={onDone} />}
      <Nav visible={entered} />
      <main id="main">
        <Hero entered={entered} onPortraitReady={onPortraitReady} />
        <Marquee />
        <Manifesto />
        <ScoutWand />
        <Projects />
        <Showreel />
        <Skills />
        <Journey />
        <Contact />
      </main>
      <Footer />
      <Cursor />
    </>
  );
}

export function App() {
  return (
    <I18nProvider>
      <Shell />
    </I18nProvider>
  );
}
