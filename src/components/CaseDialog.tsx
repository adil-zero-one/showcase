import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import type { Project } from '../data/projects';
import { stopScroll, resumeScroll } from '../lib/smooth';
import { ArrowUpRight, Close } from './Icons';
import { plainKicker } from './Projects';
import './dialog.css';

/**
 * Case study on the native <dialog>: focus trap, Escape, inert background and focus restore come from the
 * browser. We add the close button, backdrop click and page scroll lock.
 */
export function CaseDialog({ project, startIndex, onClose }: { project: Project; startIndex: number; onClose: () => void }) {
  const { t } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);
  const [index, setIndex] = useState(startIndex);
  const txt = t.projects.items[project.id];
  const L = t.projects.labels;
  const notes: Record<string, string> = 'endpointNotes' in txt ? (txt.endpointNotes as Record<string, string>) : {};

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    opener.current = document.activeElement;
    if (!dlg.open) dlg.showModal();
    stopScroll();
    document.body.classList.add('dialog-open');
    return () => {
      document.body.classList.remove('dialog-open');
      resumeScroll();
      if (dlg.open) dlg.close();
      (opener.current as HTMLElement | null)?.focus?.({ preventScroll: true });
    };
  }, []);

  const img = project.images[index];
  const api = project.api;

  return (
    <dialog ref={ref} className="cd" aria-labelledby="cd-title" onClose={onClose} onClick={(e) => { if (e.target === e.currentTarget) ref.current?.close(); }}>
      <div className="cd__inner" data-lenis-prevent>
        <header className="cd__head">
          <div>
            <p className="cd__kicker">{plainKicker(txt.kicker)}</p>
            <h2 id="cd-title" className="cd__title display">{txt.name}</h2>
          </div>
          <button type="button" className="cd__close" onClick={() => ref.current?.close()} aria-label={t.a11y.close}><Close /></button>
        </header>

        <div className="cd__body">
          <div className="cd__media">
            {api ? (
              <div className="cd__api">
                <h3>{L.endpoints}</h3>
                <table>
                  <tbody>
                    {api.endpoints.map((e) => (
                      <tr key={e.method + e.path}>
                        <td><span className={`apiviz__m apiviz__m--${e.method}`}>{e.method}</span></td>
                        <td><code>{e.path}</code></td>
                        <td className="cd__note">{notes[e.note]}</td>
                        <td><code>{e.status}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <h3>{L.fields}</h3>
                <table>
                  <tbody>
                    {api.fields.map((f) => (
                      <tr key={f.name}><td><code>{f.name}</code></td><td>{f.type}</td><td className="cd__note">{f.rule}</td></tr>
                    ))}
                  </tbody>
                </table>
                <p className="cd__note">{L.noUpdate}</p>
              </div>
            ) : (
              img && (
                <>
                  <figure className="cd__figure">
                    <img src={img.src} width={img.width} height={img.height} alt={txt.images[index]} decoding="async" />
                    <figcaption>
                      {index + 1} / {project.images.length}{txt.annotations[index] ? `, ${txt.annotations[index]}` : ''}
                    </figcaption>
                  </figure>
                  {project.images.length > 1 && (
                    <ul className="cd__thumbs" aria-label={L.gallery}>
                      {project.images.map((im, i) => (
                        <li key={im.src}>
                          <button type="button" aria-current={i === index} aria-label={`${L.gallery} ${i + 1}: ${txt.images[i]}`} onClick={() => setIndex(i)}>
                            <img src={im.src} alt="" width={96} height={64} loading="lazy" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )
            )}
          </div>

          <div className="cd__text">
            <p className="cd__summary">{txt.summary}</p>
            <p className="cd__status" data-status={project.status}>{L.status}: {t.projects.statuses[project.status]}</p>
            <h3>{L.objective}</h3>
            <p>{txt.objective}</p>
            <h3>{L.role}</h3>
            <p>{txt.role}</p>
            <h3>{L.decisions}</h3>
            <ul className="cd__list">{txt.decisions.map((d) => (<li key={d}>{d}</li>))}</ul>
            <h3>{L.stack}</h3>
            <ul className="cd__tags">{project.stack.map((s) => (<li key={s} className="tag">{s}</li>))}</ul>
            {(project.repo || project.live) && (
              <div className="cd__links">
                {project.repo && (<a className="btn btn--solid" href={project.repo} target="_blank" rel="noopener noreferrer">{L.source}<ArrowUpRight /><span className="visually-hidden"> {t.a11y.newTab}</span></a>)}
                {project.live && (<a className="btn" href={project.live} target="_blank" rel="noopener noreferrer">{L.live}<ArrowUpRight /><span className="visually-hidden"> {t.a11y.newTab}</span></a>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
