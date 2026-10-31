import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { fmt, useI18n } from '../i18n';
import { CLIPS, formatTime } from '../data/showreel';
import { gsap } from '../lib/gsap';
import { getLenis } from '../lib/smooth';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useLineReveal } from '../hooks/useLineReveal';
import { Pause, Play, SkipBack, SkipForward, Volume, VolumeOff } from './Icons';
import './showreel.css';

/**
 * A theatre: the player stays in view while the visitor chooses a clip.
 * Wide screens: player on the left, clip list on the right, both inside one screen.
 * Narrow screens: the player sticks under the navigation while the list scrolls past it.
 * Nothing downloads until a clip is chosen (preload="none").
 */
export function Showreel() {
  const { t, lang } = useI18n();
  const R = t.showreel;
  const root = useRef<HTMLElement>(null);
  const theatre = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [wantPlay, setWantPlay] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const [error, setError] = useState(false);
  // captions: on by default in the visitor's language, except Spanish (the voice-over already is); the visitor's choice wins
  const [cap, setCap] = useState<'es' | 'en' | 'ca' | null>(lang === 'es' ? null : lang);
  const [capTouched, setCapTouched] = useState(false);
  useEffect(() => { if (!capTouched) setCap(lang === 'es' ? null : lang); }, [lang, capTouched]);
  const clip = CLIPS[index];
  const text = R.clips[clip.id];
  useLineReveal(titleRef, [lang]);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      // Scale and corner radius only: no clip-path on a playing <video>, which some GPUs repaint badly.
      gsap.fromTo(frame.current, { scale: 0.88, borderRadius: 44 }, {
        scale: 1, borderRadius: 22, ease: 'none', force3D: true,
        scrollTrigger: { trigger: theatre.current, start: 'top 98%', end: 'top 55%', scrub: 0.6 },
      });
      gsap.from('.pl__item', { y: 24, opacity: 0, stagger: 0.05, duration: 0.8, ease: 'expo.out',
        scrollTrigger: { trigger: '.pl', start: 'top 92%', once: true } });
    }, el);
    return () => ctx.revert();
  }, [reduced, lang]);

  // A clip that scrolls out of view is paused so it never decodes behind other sections.
  useEffect(() => {
    const v = video.current, th = theatre.current;
    if (!v || !th) return;
    const io = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting && !v.paused) v.pause(); }, { threshold: 0 });
    io.observe(th);
    return () => io.disconnect();
  }, []);

  useEffect(() => { if (video.current) video.current.muted = muted; }, [muted]);

  // show the chosen caption track (the <track> elements are re-created for each clip)
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const apply = () => { for (const tt of Array.from(v.textTracks)) tt.mode = cap && tt.language === cap ? 'showing' : 'disabled'; };
    apply();
    v.textTracks.addEventListener('addtrack', apply);
    return () => v.textTracks.removeEventListener('addtrack', apply);
  }, [cap, clip.id, wantPlay]);

  // Caption height: a little above the bottom edge while the player controls are hidden; while the controls are
  // showing (pointer moving over the video, or paused) the browser's own spot, just above the control bar, is used.
  useEffect(() => {
    const v = video.current, box = frame.current;
    if (!v || !box) return;
    let controls = v.paused;
    let timer = 0;
    const place = () => {
      for (const tt of Array.from(v.textTracks)) {
        if (tt.mode !== 'showing') continue;
        const cues = tt.cues ? Array.from(tt.cues) : [];
        for (const c of cues as VTTCue[]) { c.snapToLines = true; c.line = controls ? 'auto' : -3; }
      }
    };
    const set = (on: boolean) => { if (on !== controls) { controls = on; place(); } };
    const wake = () => {
      set(true);
      window.clearTimeout(timer);
      if (!v.paused) timer = window.setTimeout(() => set(false), 2800);
    };
    const onPause = () => { window.clearTimeout(timer); set(true); };
    const onPlay = () => wake();
    const onLeave = () => { window.clearTimeout(timer); if (!v.paused) set(false); };
    const tracks = v.textTracks;
    const onTrack = () => { place(); for (const tt of Array.from(tracks)) tt.addEventListener('cuechange', place); };
    place(); onTrack();
    box.addEventListener('pointermove', wake);
    box.addEventListener('pointerleave', onLeave);
    box.addEventListener('focusin', wake);
    v.addEventListener('pause', onPause);
    v.addEventListener('play', onPlay);
    tracks.addEventListener('addtrack', onTrack);
    return () => {
      window.clearTimeout(timer);
      box.removeEventListener('pointermove', wake);
      box.removeEventListener('pointerleave', onLeave);
      box.removeEventListener('focusin', wake);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('play', onPlay);
      tracks.removeEventListener('addtrack', onTrack);
      for (const tt of Array.from(tracks)) tt.removeEventListener('cuechange', place);
    };
  }, [cap, clip.id, wantPlay]);

  // Leaving full screen must put the page back exactly where it was (the viewport resizes twice on the way,
  // and the scroller and the pinned sections would otherwise land at the top).
  useEffect(() => {
    let last = window.scrollY;
    let saved: number | null = null;
    let timers: number[] = [];
    const stopRestore = () => { timers.forEach((t) => window.clearTimeout(t)); timers = []; };
    const track = () => { if (saved === null) last = window.scrollY; };
    const isFull = () => !!(document.fullscreenElement || (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement);
    const put = (y: number) => {
      const l = getLenis();
      if (l) l.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    };
    const onChange = () => {
      if (isFull()) { saved = last; return; }
      if (saved === null) return;
      const y = saved;
      saved = null;
      stopRestore();
      [0, 60, 200, 500, 1000].forEach((ms) => timers.push(window.setTimeout(() => put(y), ms)));
    };
    const onUser = () => stopRestore();
    const v = video.current;
    const begin = () => { saved = last; };
    window.addEventListener('scroll', track, { passive: true });
    window.addEventListener('wheel', onUser, { passive: true });
    window.addEventListener('touchstart', onUser, { passive: true });
    window.addEventListener('keydown', onUser);
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    v?.addEventListener('webkitbeginfullscreen', begin);
    v?.addEventListener('webkitendfullscreen', onChange);
    return () => {
      stopRestore();
      window.removeEventListener('scroll', track);
      window.removeEventListener('wheel', onUser);
      window.removeEventListener('touchstart', onUser);
      window.removeEventListener('keydown', onUser);
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
      v?.removeEventListener('webkitbeginfullscreen', begin);
      v?.removeEventListener('webkitendfullscreen', onChange);
    };
  }, []);

  // other sections can ask for a clip (ScoutWand's "Watch the demo")
  useEffect(() => {
    const on = (e: Event) => {
      const i = CLIPS.findIndex((c) => c.id === (e as CustomEvent<string>).detail);
      if (i < 0) return;
      setIndex(i); setTime(0); setPlaying(false); setWantPlay(true);
    };
    window.addEventListener('showreel:select', on);
    return () => window.removeEventListener('showreel:select', on);
  }, []);

  // when the clip changes, load it; start only if the visitor already asked for playback
  useEffect(() => {
    const v = video.current;
    if (!v || !wantPlay) return;
    setError(false);
    v.src = CLIPS[index].src;
    v.muted = muted;
    v.load();
    v.play().catch(() => setPlaying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, wantPlay]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (!wantPlay) { setWantPlay(true); return; }
    if (v.paused) void v.play(); else v.pause();
  };
  const choose = (i: number) => {
    if (i === index) { toggle(); return; }
    setIndex(i); setTime(0); setPlaying(false); setWantPlay(true);
  };
  const step = (d: number) => choose((index + d + CLIPS.length) % CLIPS.length);

  return (
    <section id="showreel" ref={root} className="section showreel" aria-labelledby="sr-title">
      <div className="container showreel__head">
        <h2 key={lang} id="sr-title" ref={titleRef} className="showreel__title display">{R.title}</h2>
        <p className="lede">{R.intro}</p>
      </div>

      <div ref={theatre} className="container sr-theatre">
        <div className="sr-main">
          <div className="sr-sticky">
            <div ref={frame} className="sr-frame">
              <video
                ref={video}
                className="sr-frame__video"
                poster={clip.poster}
                preload="none"
                playsInline
                muted
                controls={wantPlay}
                width={clip.width}
                height={clip.height}
                aria-label={text.title}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
                onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
                onError={() => wantPlay && setError(true)}
                onEnded={() => index < CLIPS.length - 1 && choose(index + 1)}
              >
                {clip.captions && (['en', 'es', 'ca'] as const).map((l) => (
                  <track key={`${clip.id}-${l}`} kind="captions" srcLang={l} label={R.capNames[l]} src={clip.captions![l]} />
                ))}
              </video>
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

            <div className="sr-bar">
              {/* every title shares one grid cell, so the bar keeps one height whatever is playing */}
              <div className="sr-bar__titles">
                {CLIPS.map((c, i) => (
                  <p key={c.id} className="sr-bar__t" data-on={i === index} aria-hidden={i !== index}>{R.clips[c.id].title}</p>
                ))}
              </div>
              <p className="sr-bar__time" aria-hidden="true">{formatTime(time)} / {formatTime(clip.duration)}</p>
              <div className="sr-bar__ctl">
                <button type="button" className="sr-btn" onClick={() => step(-1)} aria-label={R.prev}><SkipBack /></button>
                <button type="button" className="sr-btn" onClick={() => step(1)} aria-label={R.next}><SkipForward /></button>
                {clip.captions && (
                  <div className="sr-cc" role="group" aria-label={R.captions}>
                    <span className="sr-cc__l" aria-hidden="true">CC</span>
                    {(['en', 'es', 'ca'] as const).map((l) => (
                      <button key={l} type="button" className="sr-btn sr-btn--cc" aria-pressed={cap === l} title={R.capNames[l]}
                        aria-label={`${R.captions}: ${R.capNames[l]}`} onClick={() => { setCapTouched(true); setCap(cap === l ? null : l); }}>
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
                <button type="button" className="sr-btn sr-btn--sound" aria-pressed={!muted} aria-label={muted ? R.soundOn : R.soundOff} onClick={() => setMuted((m) => !m)}>
                  {muted ? <VolumeOff /> : <Volume />}
                  <span aria-hidden="true">{muted ? R.soundOn : R.soundOff}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="sr-info">
            {CLIPS.map((c, i) => (
              <p key={c.id} className="sr-info__d" data-on={i === index} aria-hidden={i !== index}>{R.clips[c.id].description}</p>
            ))}
          </div>
          <p className="small sr-note">{R.soundNote}</p>
        </div>

        <ol className="pl" aria-label={R.listLabel} data-lenis-prevent>
          {CLIPS.map((c, i) => (
            <li key={c.id} className="pl__item" data-badge={c.badge}>
              <button type="button" aria-current={i === index} onClick={() => choose(i)} aria-label={fmt(R.playClip, { title: R.clips[c.id].title })}>
                <img src={c.poster} alt="" width={160} height={90} loading="lazy" decoding="async" />
                <span className="pl__body">
                  {c.badge && (
                    <span className="pl__badge">
                      {c.badge === 'featured' ? `${R.featured} · ${R.inSpanish}` : R.appDemo}
                    </span>
                  )}
                  <span className="pl__t">{R.clips[c.id].title}</span>
                </span>
                <span className="pl__d">{formatTime(c.duration)}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
