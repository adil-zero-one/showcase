import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

/**
 * One Lenis instance drives the page scroll. GSAP's ticker feeds it, and ScrollTrigger
 * is updated from its scroll event, so scrubbed animations stay in sync with the eased scroll.
 * Not created at all when the visitor prefers reduced motion.
 */
let lenis: Lenis | null = null;
let velocity = 0;

export function startSmoothScroll(): () => void {
  if (lenis) return () => undefined;
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true });
  lenis.on('scroll', (l: Lenis) => {
    velocity = l.velocity;
    ScrollTrigger.update();
  });
  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

export const getLenis = (): Lenis | null => lenis;
export const scrollVelocity = (): number => (lenis ? velocity : 0);

export function stopScroll(): void {
  lenis?.stop();
  document.documentElement.classList.add('no-scroll');
}
export function resumeScroll(): void {
  lenis?.start();
  document.documentElement.classList.remove('no-scroll');
}

/** Scroll to a section id. Works with and without Lenis. */
export function goTo(id: string, immediate = false): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  if (lenis) lenis.scrollTo(el, { offset: id === 'hero' ? 0 : 0, duration: immediate ? 0 : 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  else el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth', block: 'start' });
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
  history.replaceState(null, '', `#${id}`);
  return true;
}

/** Same-page "#id" links go through goTo, so they work with the smooth scroller. */
export function installAnchorScroll(): () => void {
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a) return;
    const id = decodeURIComponent(a.getAttribute('href')!.slice(1));
    if (id && goTo(id)) e.preventDefault();
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}
