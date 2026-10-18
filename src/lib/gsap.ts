import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

// Register once; always import gsap from this module.
gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);
ScrollTrigger.config({ ignoreMobileResize: true });

let timer: number | undefined;
/** Debounced ScrollTrigger.refresh (fonts, images and language changes move things). */
export function refreshScroll(delay = 120): void {
  window.clearTimeout(timer);
  timer = window.setTimeout(() => ScrollTrigger.refresh(), delay);
}

export { gsap, ScrollTrigger, SplitText };
