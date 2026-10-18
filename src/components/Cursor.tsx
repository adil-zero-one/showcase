import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

/**
 * A two-part cursor (dot + ring) for precise pointers only; the native cursor stays on touch devices.
 * Elements opt in with data attributes:
 *   data-cursor="label" data-cursor-label="View"  → the ring becomes a lime disc carrying that label
 *   data-cursor="none"                            → plain ring
 * Links and buttons make the ring grow on their own.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const r = ring.current, d = dot.current;
    if (!fine || !r || !d) return;
    document.body.classList.add('has-cursor');
    const wrap = r.parentElement as HTMLElement;
    wrap.dataset.hidden = 'true';

    const dx = gsap.quickTo(d, 'x', { duration: reduced ? 0 : 0.08, ease: 'power3.out' });
    const dy = gsap.quickTo(d, 'y', { duration: reduced ? 0 : 0.08, ease: 'power3.out' });
    const rx = gsap.quickTo(r, 'x', { duration: reduced ? 0 : 0.45, ease: 'power3.out' });
    const ry = gsap.quickTo(r, 'y', { duration: reduced ? 0 : 0.45, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      wrap.dataset.hidden = 'false';
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    };
    const setState = (target: EventTarget | null) => {
      const t = (target as Element | null)?.closest?.('[data-cursor], a, button, input, textarea, summary') as HTMLElement | null;
      if (!t || t.dataset.cursor === 'none') { wrap.dataset.state = ''; return; }
      if (t.dataset.cursor === 'label') {
        wrap.dataset.state = 'label';
        if (label.current) label.current.textContent = t.dataset.cursorLabel ?? '';
      } else wrap.dataset.state = 'link';
    };
    const onOver = (e: PointerEvent) => setState(e.target);
    const onDown = () => { if (wrap.dataset.state !== 'label') wrap.dataset.state = 'down'; };
    const onUp = (e: PointerEvent) => setState(e.target);
    const onLeave = () => { wrap.dataset.hidden = 'true'; };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      document.body.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={ring} className="cursor__ring"><span ref={label} className="cursor__label" /></div>
      <div ref={dot} className="cursor__dot" />
    </div>
  );
}
