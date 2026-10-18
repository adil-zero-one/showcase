import { useEffect } from 'react';
import { gsap } from '../lib/gsap';

/**
 * Elements with data-magnetic lean towards a nearby precise pointer and spring back.
 * One window listener serves all of them.
 */
export function useMagneticAll(): void {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const active = new Set<HTMLElement>();
    const onMove = (e: PointerEvent) => {
      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
        const b = el.getBoundingClientRect();
        const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
        const dx = e.clientX - cx, dy = e.clientY - cy;
        const reach = Math.max(b.width, b.height) * 0.75 + 20;
        if (Math.hypot(dx, dy) < reach) {
          active.add(el);
          gsap.to(el, { x: dx * 0.28, y: dy * 0.34, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
        } else if (active.has(el)) {
          active.delete(el);
          gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
        }
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
}
