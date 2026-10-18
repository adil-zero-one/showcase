# Adil Chainakh, portfolio ("the wand")

Personal portfolio of Adil Chainakh (DAW student, Institut Baix Camp, Reus), built around one idea: a wand reveals the hidden layer.
Move the pointer over the portrait and the photo turns into the code that builds it. Every other section repeats that gesture.

**Stack:** React 19 + TypeScript + Vite, GSAP (ScrollTrigger, SplitText, ScrambleText), Lenis smooth scroll, one raw WebGL fragment shader (no three.js).
Fonts are self-hosted through Fontsource (Bricolage Grotesque, Newsreader, Geist Mono).
Published at <https://adil-zero-one.github.io/showcase/> (repository `adil-zero-one/showcase`).

## Scripts

```bash
npm install
npm run dev        # http://localhost:5173/showcase/
npm run build      # tsc --noEmit && vite build -> dist/
npm run preview    # serves dist/ at http://localhost:4173/showcase/
```

Node 20+ (CI uses 22).

## What moves, and why

| Where | Effect |
| --- | --- |
| Preloader | Counter and a wipe; the page starts only when the portrait texture is ready. |
| Hero | The portrait assembles out of code glyphs. A lens follows the pointer and shows the code layer, a click sends a shockwave, and the lens grows as you scroll away. Name letters swell near the pointer. |
| Cursor | Dot and ring, labelled on interactive things, with magnetic buttons. |
| Marquee | Speeds up and reverses with your scroll velocity. |
| Manifesto | The statement fills in word by word, scrubbed by scroll; four counted facts. |
| ScoutWand | Pinned on desktop: the scroll plays an illustrated flow (type, scout, auto-fill). |
| Work | Cards stack and dim as the next arrives; hover a screenshot to open a lens onto how it is built; an index with a hover preview; case studies in a native `<dialog>`. |
| Showreel | The video frame opens from a small window to full width on scroll. Nothing loads until Play. |
| Stack | A lime lens passes over the technology words; the border style tells you how much proof there is behind each one. |
| Journey | Pinned horizontal timeline (vertical list on narrow screens), progress bar on top. |
| Contact | Seven lines draw themselves and converge on the "Send an email" button. |

Fallbacks: touch devices get tap-to-reveal instead of hover lenses; `prefers-reduced-motion` turns off Lenis, the shader, pinning and scrubbing and renders a static portrait with every section in its final state.

## Project layout

```
src/
  App.tsx              page shell
  components/          one component (+ css) per section; PortraitGL.tsx is the WebGL hero
  data/                facts: projects.ts, stack.ts, showreel.ts, experience.ts, site.ts, mediaManifest.json
  i18n/                en.ts (reference), es.ts, ca.ts (typed against en.ts: a missing key is a build error)
  hooks/               line reveal, magnetic buttons, media queries, reduced motion
  lib/                 gsap registration, Lenis, asset() URL helper, media helpers
  styles/              tokens.css, global.css
public/                docs (3 CVs), media/showreel (7 clips + posters), projects (screenshots), og.png, 404.html
scripts/               process_media.py (assets -> web files), make_og.py + og/og.html (social image)
```

Files in `public/` must be referenced with `asset('path')` (it prefixes the deploy base); never write a root-absolute path.
The base is `/showcase/` by default; override it with `VITE_BASE=/other/ npm run build`.

## Editing content

* **Texts:** `src/i18n/{en,es,ca}.ts`. The default language is the saved choice, then the browser language, then Spanish.
* **Projects:** facts in `src/data/projects.ts`, text under `projects.items.<id>` in each dictionary. Only claim what the repository or README shows.
* **ScoutWand:** copy under `scout` in the dictionaries. The window is an illustration and says so; the jobs and the person shown are examples.
  To use a real screenshot, drop it in `public/projects/` and replace the mock window in `src/components/ScoutWand.tsx`.
* **Stack:** `src/data/stack.ts`; each item is `used` (visible in a public repo or this site), `listed` (CV only) or `learning`.
* **CV:** replace the PDFs in `public/docs/` keeping the names `Adil_Chainakh_CV_{Es,En,Ca}.pdf`. `python3 scripts/update_cv_qr.py <address>` rebuilds them from `scripts/cv_originals/` with a new QR code, portfolio link and a line of selectable text showing the address.
* **Social image:** `CHROMIUM_PATH=/path/to/chrome python3 scripts/make_og.py`.

## Deployment (GitHub Pages)

The code lives in the repository `adil-zero-one/showcase`; GitHub serves the built site at <https://adil-zero-one.github.io/showcase/>.
`.github/workflows/deploy.yml` builds and publishes `dist/` on every push to `main`.

1. Create the empty public repository `showcase` on GitHub (no README, no .gitignore, no license).
2. In this folder: `git init -b main`, `git add -A`, `git commit -m "Portfolio"`, `git remote add origin https://github.com/adil-zero-one/showcase.git`, `git push -u origin main`.
3. Repo Settings, Pages, Source: **GitHub Actions**. Re-run the workflow from the Actions tab if the first run finished before you changed the setting.
4. The site goes live at <https://adil-zero-one.github.io/showcase/> a minute later.

The repository address (`.git`) is only for `git`; the address people open, and the one in the CV QR code, is the site address above.
A different repository name needs `VITE_BASE=/name/` (default in `vite.config.ts`), the addresses in `index.html`, `src/data/site.ts` and `public/404.html`, and `python3 scripts/update_cv_qr.py <site address>`.

## Known limitations

* Needs JavaScript; `index.html` has a `<noscript>` fallback with email, GitHub, LinkedIn and CV links.
* WebGL is required for the shader portrait; without it the static photo is shown.
* The ES and CA texts should be proofread by a native speaker.
* ScoutWand has no real screenshots here, only the illustrated flow.
