import { useEffect, useRef, useState } from 'react';
import { BOARD_LABEL, SAMPLE_PERSON, agoLabel, runSearch, terms, type Board, type Job } from './jobs';
import { FILL_STEPS, SCRIPT, blankState, statusLine, type AppState } from './tour';
import { Check, Close } from '../components/Icons';

interface Props {
  /** a snapshot played by the scroll tour; null once the visitor is in control */
  tour: AppState | null;
  initial: AppState;
  onTakeOver: () => void;
}

const BOARDS: { id: Board; label: string }[] = [
  { id: 'linkedin', label: 'LinkedIn (Global)' },
  { id: 'indeed', label: 'Indeed (USA/Global)' },
  { id: 'infojobs', label: 'Infojobs (Spain)' },
];

/**
 * A working replica of the ScoutWand window, drawn for this site from screenshots of the real app.
 * While the scroll tour plays it is inert (the pointer and the wheel go straight through to the page);
 * "Try it yourself" unlocks it and it becomes a small live app:
 * the form filters an invented list of offers, rows stream in, Auto-Fill fills an example profile.
 */
export function ScoutApp({ tour, initial, onTakeOver }: Props) {
  const [free, setFree] = useState<AppState>(initial);
  const [note, setNote] = useState('');
  const noteTimer = useRef<number | undefined>(undefined);
  const side = useRef<HTMLFormElement>(null);
  const v = tour ?? free;

  const act = (fn: (s: AppState) => AppState) => {
    if (tour) { setFree(fn(tour)); onTakeOver(); } else setFree(fn);
  };
  const say = (msg: string) => {
    setNote(msg);
    window.clearTimeout(noteTimer.current);
    noteTimer.current = window.setTimeout(() => setNote(''), 3600);
  };
  useEffect(() => () => window.clearTimeout(noteTimer.current), []);

  // offers stream in one by one
  useEffect(() => {
    if (tour || !free.running) return;
    const id = window.setInterval(() => {
      setFree((s) => {
        if (!s.running) return s;
        const all = runSearch(s);
        const next = all.find((j) => !s.shown.some((x) => x.id === j.id) && !s.gone.includes(j.id));
        if (!next) return { ...s, running: false };
        const shown = [...s.shown, next];
        const more = all.some((j) => !shown.some((x) => x.id === j.id) && !s.gone.includes(j.id));
        return { ...s, shown, running: more };
      });
    }, 320);
    return () => window.clearInterval(id);
  }, [tour, free.running]);

  // Auto-Fill ticks through its checklist
  const filling = !tour && free.fill !== null && free.fill.n < FILL_STEPS;
  useEffect(() => {
    if (!filling) return;
    const id = window.setInterval(() => {
      setFree((s) => (s.fill && s.fill.n < FILL_STEPS ? { ...s, fill: { ...s.fill, n: s.fill.n + 1 } } : s));
    }, 380);
    return () => window.clearInterval(id);
  }, [filling]);

  // during the tour, keep whatever is being used inside the side panel in view
  const target = v.typing ?? (v.exclude || v.pressed || v.within === '7d' ? 'end' : v.sites.linkedin || v.sites.indeed || v.sites.infojobs ? 'sites' : null);
  useEffect(() => {
    const box = side.current;
    if (!tour || !box) return;
    if (box.scrollHeight - box.clientHeight < 8) return;
    if (target === 'end') { box.scrollTo({ top: box.scrollHeight }); return; }
    const el = target ? box.querySelector<HTMLElement>(`[data-field="${target}"]`) : null;
    box.scrollTo({ top: el ? Math.max(0, el.offsetTop - 14) : 0 });
  }, [tour, target]);

  const finalCount = runSearch(v).length || v.shown.length || 1;
  const shown = v.shown.filter((j) => !v.gone.includes(j.id));
  const caret = (key: 'where' | 'kind' | 'exclude') => (tour && v.typing === key ? '▏' : '');

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (v.running) return;
    if (!terms(v.kind).length) { say('Type a kind of job first, for example “web developer”.'); return; }
    act((s) => ({ ...s, shown: [], gone: [], searched: true, running: true, tab: 'offers', panel: 'offers', fill: null, hot: null, pressed: null }));
  };

  // a plain function, not a component: a component declared here would remount (and lose focus) on every keystroke
  const field = (k: 'where' | 'kind' | 'exclude', n: number, label: string, hint: string, placeholder: string) => (
    <div key={k} className="sw-fieldbox" data-field={k} data-typing={v.typing === k}>
      <label htmlFor={`sw-${k}`} className="sw-lab">{n}. {label} <span className="sw-q" title={hint}>(?)</span></label>
      <textarea
        id={`sw-${k}`} rows={2} value={v[k] + caret(k)} placeholder={placeholder} readOnly={!!tour} spellCheck={false}
        onFocus={() => tour && act((s) => s)}
        onChange={(e) => act((s) => ({ ...s, [k]: e.target.value }))}
      />
    </div>
  );

  return (
    <div className="sw-wrap" inert={tour !== null}>
      <div className="sw-app" lang="en" role="group" aria-label="ScoutWand window, interactive example" data-panel={v.panel}>
        <div className="sw-app__bar" aria-hidden="true"><span>Scout Wand</span><i /><i /><i /></div>

        <div className="sw-app__body">
          <form ref={side} className="sw-side" onSubmit={submit} data-lenis-prevent>
            <div className="sw-cv">
              <p className="sw-lab">1. Your CV (PDF)</p>
              <p className="sw-file">{v.searched ? 'Alex_Example_CV.pdf' : 'No file selected'}</p>
              <div className="sw-cv__btns">
                <button type="button" className="sw-ghost" onClick={() => say('Example only: the real app reads your PDF here.')}>Upload CV</button>
                <button type="button" className="sw-ghost" onClick={() => say('Example only: the real app lets you edit your auto-fill details here.')}>Edit auto-fill info</button>
              </div>
            </div>
            {field('where', 2, 'Locations', 'Cities separated by commas', 'barcelona, tarragona, remote')}
            {field('kind', 3, 'What kind of job are you looking for', 'Job titles separated by commas', 'web developer, motion designer')}
            <fieldset className="sw-sites" data-field="sites">
              <legend className="sw-lab">4. Search on</legend>
              {BOARDS.map((b) => (
                <label key={b.id} className="sw-check">
                  <input type="checkbox" checked={v.sites[b.id]} onChange={(e) => act((s) => ({ ...s, sites: { ...s.sites, [b.id]: e.target.checked } }))} />
                  <span className="sw-box" aria-hidden="true"><Check /></span>
                  {b.label}
                </label>
              ))}
              <label className="sw-check sw-check--off"><input type="checkbox" disabled /><span className="sw-box" aria-hidden="true" />Glassdoor (Coming soon)</label>
            </fieldset>
            {field('exclude', 5, 'Exclude keywords (optional)', 'Offers containing these words are skipped', SCRIPT.exclude)}
            <div className="sw-within" role="group" aria-label="6. Posted within">
              <p className="sw-lab">6. Posted within</p>
              <div className="sw-seg">
                {(['24h', '7d'] as const).map((w) => (
                  <button key={w} type="button" aria-pressed={v.within === w} onClick={() => act((s) => ({ ...s, within: w }))}>{w === '24h' ? '24h' : '7 days'}</button>
                ))}
              </div>
            </div>
            <div className="sw-go">
              <button type="submit" className="sw-btn sw-btn--search" data-pressed={v.pressed === 'search'} disabled={v.running}>Search</button>
              <button type="button" className="sw-btn sw-btn--stop" disabled={!v.running} onClick={() => act((s) => ({ ...s, running: false }))}>Stop</button>
            </div>
          </form>

          <section className="sw-main" aria-label="Offers">
            <header className="sw-top">
              <p className="sw-status"><i data-on={v.running} aria-hidden="true" />{statusLine(v, finalCount)}</p>
              <p className="sw-count">{shown.length} offers found</p>
            </header>
            <div className="sw-tabs">
              <button type="button" aria-pressed={v.tab === 'offers'} onClick={() => act((s) => ({ ...s, tab: 'offers' }))}>Offers found</button>
              <button type="button" aria-pressed={v.tab === 'applied'} onClick={() => act((s) => ({ ...s, tab: 'applied' }))}>Jobs applied to</button>
              <button type="button" className="sw-clear" onClick={() => act((s) => ({ ...s, shown: [], gone: [], running: false, searched: false }))}>Clear section</button>
            </div>
            <ul className="sw-list" data-lenis-prevent aria-live="off">
              {v.tab === 'applied' && <li className="sw-empty">Jobs you apply to are listed here.</li>}
              {v.tab === 'offers' && shown.length === 0 && (
                <li className="sw-empty">{v.searched && !v.running ? 'No offers match. Try other words, more sites or 7 days.' : 'Fill in the search and press Search.'}</li>
              )}
              {v.tab === 'offers' && shown.map((j: Job) => (
                <li key={j.id} className="sw-row" data-hot={v.hot === j.id}>
                  <div className="sw-row__txt">
                    <p className="sw-row__t">{j.title}</p>
                    <p className="sw-row__m">{j.company} · {j.place} · {agoLabel(j.hours)}</p>
                  </div>
                  <span className={`sw-badge sw-badge--${j.board}`}>{BOARD_LABEL[j.board]}</span>
                  <div className="sw-row__act">
                    <button type="button" className="sw-ghost" onClick={() => say('In the real app this opens the listing page.')}>Manual</button>
                    <button type="button" className="sw-fillbtn" data-pressed={v.hot === j.id} onClick={() => act((s) => ({ ...s, fill: { job: j, n: 0 }, hot: null }))}>Auto-Fill <span aria-hidden="true">⚡</span></button>
                    <button type="button" className="sw-x" aria-label={`Remove ${j.title}`} onClick={() => act((s) => ({ ...s, gone: [...s.gone, j.id] }))}><Close /></button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {v.fill && (
            <div className="sw-fill" role="dialog" aria-label="Auto-fill progress">
              <div className="sw-fill__card">
                <header className="sw-fill__head">
                  <svg className="sw-ring" viewBox="0 0 36 36" aria-hidden="true">
                    <circle cx="18" cy="18" r="15" />
                    <circle cx="18" cy="18" r="15" className="sw-ring__v" style={{ strokeDashoffset: 94.2 * (1 - v.fill.n / FILL_STEPS) }} />
                  </svg>
                  <div>
                    <p className="sw-fill__t">Auto-fill <span>{v.fill.n}/{FILL_STEPS}</span></p>
                    <p className="sw-fill__s">{v.fill.n >= FILL_STEPS ? 'Done. Review the form, then press apply yourself.' : 'Scout Wand is filling the form…'}</p>
                  </div>
                  <button type="button" className="sw-x" aria-label="Close" onClick={() => act((s) => ({ ...s, fill: null }))}><Close /></button>
                </header>
                <p className="sw-fill__job">{v.fill.job.title} · {v.fill.job.company}</p>
                <ul className="sw-fill__list">
                  {[
                    ['Name', SAMPLE_PERSON.name],
                    ['Email', SAMPLE_PERSON.email],
                    ['Phone', SAMPLE_PERSON.phone],
                    ['City and postcode', SAMPLE_PERSON.city],
                    ['CV attached', SAMPLE_PERSON.cv],
                    ['Links', SAMPLE_PERSON.links],
                    ['Cover letter', `for ${v.fill.job.title} at ${v.fill.job.company}`],
                  ].map(([k, val], i) => (
                    <li key={k} data-done={i < v.fill!.n}>
                      <span className="sw-tick" aria-hidden="true"><Check /></span>
                      <span className="sw-fill__k">{k}</span>
                      <span className="sw-fill__v">{i < v.fill!.n ? val : ''}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <nav className="sw-switch" aria-label="Panels">
          <button type="button" aria-pressed={v.panel === 'form'} onClick={() => act((s) => ({ ...s, panel: 'form' }))}>Form</button>
          <button type="button" aria-pressed={v.panel === 'offers'} onClick={() => act((s) => ({ ...s, panel: 'offers' }))}>Offers ({shown.length})</button>
        </nav>
        <p className="sw-toast" role="status" data-on={note !== ''}>{note}</p>
      </div>
    </div>
  );
}

export { blankState };
