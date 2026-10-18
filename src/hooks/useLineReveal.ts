import { useLayoutEffect, type RefObject } from 'react';
import { gsap, SplitText } from '../lib/gsap';
import { useReducedMotion } from './useReducedMotion';

/**
 * Splits a heading into masked lines and slides them up when the heading scrolls into view.
 * `autoSplit` re-splits when the font loads or the width changes, so lines never break wrongly.
 * The element must be remounted when its text changes (give it key={lang}).
 */
export function useLineReveal(ref: RefObject<HTMLElement | null>, deps: unknown[] = [], start = 'top 88%') {
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        linesClass: 'rv-line',
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 112,
            duration: 1.25,
            ease: 'expo.out',
            stagger: 0.09,
            scrollTrigger: { trigger: el, start, once: true },
          }),
      });
    }, el);
    return () => {
      try { split?.revert(); } catch { /* DOM already replaced by React */ }
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);
}
