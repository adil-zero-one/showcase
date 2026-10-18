import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { fmt, useI18n } from '../i18n';
import { CLIPS, formatTime } from '../data/showreel';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useLineReveal } from '../hooks/useLineReveal';
import { Pause, Play } from './Icons';
import './showreel.css';

/**
 * The frame starts as a small rounded window and opens to the full width as you scroll in.
 * Nothing downloads or plays until the play button is pressed (preload="none").
 */
export function Showreel() {
  const { t, lang } = useI18n();
  const R = t.showreel;
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [wantPlay, setWantPlay] = useState(false);
  const [time, setTime] = useState(0);
  const [error, setError] = useState(false);
  const clip = CLIPS[index];
  const text = R.clips[clip.id];
  useLineReveal(titleRef, [lang]);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      // Scale and corner radius only: no clip-path on a playing <video>, which some GPUs repaint badly.
      gsap.fromTo(frame.current, { scale: 0.78, borderRadius: 52 }, {
        scale: 1, borderRadius: 22, ease: 'none', force3D: true,
        scrollTrigger: { trigger: frame.current, start: 'top 95%', end: 'top 25%', scrub: 0.6 },
      });
      gsap.from('.pl__item', { y: 30, opacity: 0, stagger: 0.06, duration: 0.9, ease: 'expo.out',
        scrollTrigger: { trigger: '.pl', start: 'top 90%', once: true } });
    }, el);
    return () => ctx.revert();
  }, [reduced, lang]);

  // Clips always start muted (the visitor can switch sound on with the player's speaker button),
  // and a clip that scrolls out of view is paused so it never decodes behind other sections.
  useEffect(() => {
    const v = video.current, f = frame.current;
    if (!v || !f) return;
    v.muted = true;
    const io = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting && !v.paused) v.pause(); }, { threshold: 0.1 });
    io.observe(f);
    return () => io.disconnect();
  }, []);

  // when the clip changes, load it; start only if the visitor already pressed play
  useEffect(() => {
    const v = video.current;
    if (!v || !wantPlay) return;
    setError(false);
    v.src = CLIPS[index].src;
    v.load();
    v.play().catch(() => setPlaying(false));
  }, [index, wantPlay]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (!wantPlay) { setWantPlay(true); return; }
    if (v.paused) void v.play(); else v.pause();
  };
  const choose = (i: number) => {
    setIndex(i); setTime(0); setPlaying(false);
    setWantPlay(true);
  };

  return (
    <section id="showreel" ref={root} className="section showreel" aria-labelledby="sr-title">
      <div className="container showreel__head">
        <h2 key={lang} id="sr-title" ref={titleRef} className="showreel__title display">{R.title}</h2>
        <p className="lede">{R.intro}</p>
      </div>

      <div className="showreel__stage">
        <div ref={frame} className="sr-frame">
          <video
            ref={video}
            className="sr-frame__video"
            poster={clip.poster}
            preload="none"
            playsInline
            controls={wantPlay}
            width={clip.width}
            height={clip.height}
            aria-label={text.title}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onError={() => wantPlay && setError(true)}
            onEnded={() => index < CLIPS.length - 1 && choose(index + 1)}
          />
          {!playing && !error && (
            <button type="button" className="sr-play" data-cursor="play" onClick={toggle} aria-label={fmt(R.playClip, { title: text.title })}>
              <span className="sr-play__disc"><Play /></span>
            </button>
          )}
          {wantPlay && playing && (
            <button type="button" className="sr-pause" onClick={toggle} aria-label={R.pause}><Pause /></button>
          )}
          {error && (
            <p className="sr-error" role="alert">{R.error} <a href={clip.src}>{R.openFile}</a></p>
          )}
        </div>
      </div>

      <div className="container showreel__meta">
        <div>
          {/* every clip's text shares one grid cell: the block keeps the height of the longest, so switching clips never moves the page */}
          <div className="showreel__texts">
            {CLIPS.map((c, i) => (
              <div key={c.id} className="showreel__text" data-on={i === index} aria-hidden={i !== index}>
                <p className="showreel__now">{R.nowShowing}: {R.clips[c.id].title}</p>
                <p className="showreel__desc">{R.clips[c.id].description}</p>
              </div>
            ))}
          </div>
          <p className="showreel__time" aria-live="off">{formatTime(time)} / {formatTime(clip.duration)}</p>
          <p className="small">{R.soundNote}</p>
        </div>
        <ol className="pl" aria-label={R.chapters}>
          {CLIPS.map((c, i) => (
            <li key={c.id} className="pl__item">
              <button type="button" aria-current={i === index} onClick={() => choose(i)} aria-label={fmt(R.playClip, { title: R.clips[c.id].title })}>
                <img src={c.poster} alt="" width={120} height={70} loading="lazy" decoding="async" />
                <span className="pl__t">{R.clips[c.id].title}</span>
                <span className="pl__d">{formatTime(c.duration)}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
