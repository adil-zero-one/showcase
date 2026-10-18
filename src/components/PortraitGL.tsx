import { useEffect, useRef, useState } from 'react';
import { asset } from '../lib/asset';
import portrait from '../data/portrait.json';

/** Values the hero timeline animates; the render loop reads them every frame. */
export interface PortraitState {
  /** 0 → the portrait is made of code, 1 → fully resolved. */
  assemble: number;
  /** 0..1 → the wand lens grows until it covers everything (used while scrolling out of the hero). */
  grow: number;
}

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform sampler2D uPhoto;
uniform sampler2D uAtlas;
uniform vec2 uRes;
uniform vec4 uRect;      // image rect in canvas px: x, y (top-left), w, h
uniform vec3 uLens;      // lens centre x, y and radius (px)
uniform float uCell;
uniform float uDpr;
uniform float uTime;
uniform float uAssemble;
uniform float uGlyphN;
uniform vec4 uRip[3];    // x, y, start time, active

const vec3 LIME = vec3(0.827, 1.0, 0.231);
const vec3 INK = vec3(0.027, 0.039, 0.110);

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main(){
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);

  // Click shockwaves: push the photo outwards and flip the cells on the wave front to code.
  vec2 disp = vec2(0.0);
  float rippleCode = 0.0;
  for (int i = 0; i < 3; i++) {
    vec4 r = uRip[i];
    if (r.w > 0.5) {
      float age = uTime - r.z;
      if (age > 0.0 && age < 2.2) {
        float d = distance(p, r.xy);
        float R = age * uRes.x * 0.42;
        float w = uCell * 6.0;
        float band = exp(-pow((d - R) / w, 2.0));
        float fade = 1.0 - age / 2.2;
        vec2 dir = (p - r.xy) / max(d, 1.0);
        disp += dir * band * fade * uCell * 2.4;
        rippleCode = max(rippleCode, step(0.30, band * fade));
      }
    }
  }

  vec2 cellId = floor(p / uCell);
  vec2 cc = (cellId + 0.5) * uCell;
  vec2 local = fract(p / uCell);

  vec2 uvP = (p - disp - uRect.xy) / uRect.zw;
  vec2 uvC = (cc - uRect.xy) / uRect.zw;
  float inP = step(0.0, uvP.x) * step(uvP.x, 1.0) * step(0.0, uvP.y) * step(uvP.y, 1.0);
  float inC = step(0.0, uvC.x) * step(uvC.x, 1.0) * step(0.0, uvC.y) * step(uvC.y, 1.0);
  vec4 ph = texture2D(uPhoto, clamp(uvP, 0.0, 1.0)) * inP;
  vec4 pc = texture2D(uPhoto, clamp(uvC, 0.0, 1.0)) * inC;

  float lum = dot(pc.rgb / max(pc.a, 0.001), vec3(0.299, 0.587, 0.114));
  float bodyCell = step(0.4, pc.a);
  float density = bodyCell * clamp(0.1 + pow(clamp((lum - 0.05) / 0.5, 0.0, 1.0), 1.15) * 0.9, 0.0, 1.0);
  float inBody = smoothstep(0.35, 0.65, ph.a);

  // Lens (the wand): a wobbling disc that shows the code layer.
  float d = distance(p, uLens.xy);
  float ang = atan(p.y - uLens.y, p.x - uLens.x);
  float wob = sin(ang * 5.0 + uTime * 1.7) * uCell * 0.35 + sin(ang * 9.0 - uTime * 2.3) * uCell * 0.2;
  float lensMask = (uLens.z > 1.0) ? 1.0 - smoothstep(uLens.z - uCell * 1.2, uLens.z, d + wob) : 0.0;

  // Assembly: the portrait resolves from code, top to bottom, with a bright scan edge.
  float s = clamp((cc.y - uRect.y) / uRect.w, 0.0, 1.0);
  float v = s * 0.78 + hash(cellId) * 0.28;
  float assembleCode = step(uAssemble * 1.1, v);
  float edge = 1.0 - smoothstep(0.0, 0.05, abs(v - uAssemble * 1.1));
  edge *= step(uAssemble, 0.995) * step(0.001, uAssemble);

  float cellCode = max(assembleCode, rippleCode) * bodyCell;
  float codeAmt = max(cellCode, lensMask);

  // glyph choice, with a slow flicker so the code layer feels alive
  float fl = hash(cellId + floor(uTime * 4.0));
  float idx = clamp(floor(density * (uGlyphN - 1.0) + 0.5 + (fl - 0.5) * 1.3 * codeAmt), 0.0, uGlyphN - 1.0);
  idx = density > 0.0 ? max(idx, 1.0) : 0.0;
  float ga = texture2D(uAtlas, vec2((idx + local.x * 0.84 + 0.08) / uGlyphN, local.y * 0.84 + 0.08)).a;

  vec4 col = ph;
  col *= (1.0 - cellCode * inBody);
  // dark backing under the lens so glyphs read as light on ink
  col = mix(col, vec4(INK * ph.a, ph.a), lensMask * 0.95);
  col += vec4(INK, 1.0) * 0.30 * lensMask * (1.0 - ph.a) * (1.0 - col.a);

  float gA = ga * (0.5 + 0.5 * density) * inBody * codeAmt;
  vec3 gcol = mix(LIME, vec3(1.0), edge * 0.85);
  col = col * (1.0 - gA) + vec4(gcol * gA, gA);

  // grid dots over empty space inside the lens
  float dotA = lensMask * (1.0 - inBody) * 0.38 * (1.0 - smoothstep(0.07, 0.14, length(local - 0.5)));
  col = col * (1.0 - dotA) + vec4(LIME * dotA, dotA);

  // lens ring: a hairline plus a slowly turning dashed ring
  float ring = (uLens.z > 1.0) ? 1.0 - smoothstep(0.0, 1.6 * uDpr, abs(d + wob - uLens.z)) : 0.0;
  float dash = step(0.5, fract(ang * 3.8197 + uTime * 0.12));
  float ring2 = (uLens.z > 1.0) ? (1.0 - smoothstep(0.0, 1.2 * uDpr, abs(d - (uLens.z + 11.0 * uDpr)))) * dash * 0.7 : 0.0;
  float ringA = max(ring * 0.95, ring2);
  col = col * (1.0 - ringA) + vec4(LIME * ringA, ringA);

  gl_FragColor = col;
}
`;

const CANDIDATES = ' .,:;-~+=*/\\|(){}[]<>$#&@%?!0123456789xzXZ';
const LEVELS = 14;
const CELL_PX = 32;

async function buildAtlas(): Promise<{ canvas: HTMLCanvasElement; count: number }> {
  try {
    await document.fonts.load(`700 ${CELL_PX}px "Geist Mono Variable"`);
  } catch {
    /* fall back to the system monospace font */
  }
  const measure = document.createElement('canvas');
  measure.width = measure.height = CELL_PX;
  const mctx = measure.getContext('2d', { willReadFrequently: true })!;
  const font = `700 ${CELL_PX * 0.92}px "Geist Mono Variable", ui-monospace, monospace`;
  const scored: { ch: string; cov: number }[] = [];
  for (const ch of CANDIDATES) {
    mctx.clearRect(0, 0, CELL_PX, CELL_PX);
    mctx.font = font;
    mctx.textAlign = 'center';
    mctx.textBaseline = 'middle';
    mctx.fillStyle = '#fff';
    mctx.fillText(ch, CELL_PX / 2, CELL_PX / 2 + 1);
    const data = mctx.getImageData(0, 0, CELL_PX, CELL_PX).data;
    let sum = 0;
    for (let i = 3; i < data.length; i += 4) sum += data[i];
    scored.push({ ch, cov: sum / (255 * CELL_PX * CELL_PX) });
  }
  scored.sort((a, b) => a.cov - b.cov);
  const picked: string[] = [' '];
  for (let k = 1; k < LEVELS; k++) {
    const i = Math.round((k / (LEVELS - 1)) * (scored.length - 1));
    const ch = scored[i].ch;
    if (!picked.includes(ch)) picked.push(ch);
  }
  const atlas = document.createElement('canvas');
  atlas.width = CELL_PX * picked.length;
  atlas.height = CELL_PX;
  const actx = atlas.getContext('2d')!;
  actx.font = font;
  actx.textAlign = 'center';
  actx.textBaseline = 'middle';
  actx.fillStyle = '#fff';
  picked.forEach((ch, i) => actx.fillText(ch, i * CELL_PX + CELL_PX / 2, CELL_PX / 2 + 1));
  return { canvas: atlas, count: picked.length };
}

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? 'shader error');
  return sh;
}

interface Props {
  state: PortraitState;
  /** Called once the texture and glyph atlas are uploaded (or if WebGL is unavailable). */
  onReady: () => void;
  /** The element whose pointer events drive the lens (the hero). */
  host: React.RefObject<HTMLElement | null>;
}

/**
 * The hero portrait, drawn in one WebGL fragment shader.
 * Normally it is the photograph. Under the cursor "wand" it turns into the code layer: the same
 * picture rendered as glyphs. Clicking sends a shockwave; the portrait first assembles itself from code.
 */
export function PortraitGL({ state, onReady, host }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    const canvas = canvasRef.current;
    const hostEl = host.current;
    if (!canvas || !hostEl) return;
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'high-performance' });
    if (!gl) {
      setFailed(true);
      readyRef.current();
      return;
    }

    let disposed = false;
    let raf = 0;
    let visible = true;
    let cleanup = () => undefined as void;

    (async () => {
      try {
        const prog = gl.createProgram()!;
        gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? 'link error');
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, 'a');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        const img = new Image();
        img.decoding = 'async';
        img.src = asset('portrait.webp');
        const [atlasInfo] = await Promise.all([buildAtlas(), img.decode()]);
        if (disposed) return;

        const makeTex = (unit: number, src: TexImageSource, premultiply: boolean) => {
          const tex = gl.createTexture();
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiply);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          return tex;
        };
        makeTex(0, img, true);
        makeTex(1, atlasInfo.canvas, true);

        const U = (n: string) => gl.getUniformLocation(prog, n);
        const uni = {
          photo: U('uPhoto'), atlas: U('uAtlas'), res: U('uRes'), rect: U('uRect'), lens: U('uLens'),
          cell: U('uCell'), dpr: U('uDpr'), time: U('uTime'), assemble: U('uAssemble'), glyphN: U('uGlyphN'), rip: U('uRip'),
        };
        gl.uniform1i(uni.photo, 0);
        gl.uniform1i(uni.atlas, 1);
        gl.uniform1f(uni.glyphN, atlasInfo.count);
        gl.clearColor(0, 0, 0, 0);

        // ---- layout -------------------------------------------------------
        const aspect = portrait.w / portrait.h;
        let W = 1, H = 1, dpr = 1, cellCss = 9;
        let rect = { x: 0, y: 0, w: 1, h: 1 }; // css px, top-left origin
        const resize = () => {
          const b = hostEl.getBoundingClientRect();
          W = Math.max(1, b.width);
          H = Math.max(1, b.height);
          dpr = Math.min(window.devicePixelRatio || 1, 1.5);
          canvas.width = Math.round(W * dpr);
          canvas.height = Math.round(H * dpr);
          canvas.style.width = `${W}px`;
          canvas.style.height = `${H}px`;
          gl.viewport(0, 0, canvas.width, canvas.height);
          cellCss = W < 700 ? 7 : W < 1800 ? 8 : 9;
          // The head should overlap the lower part of the giant name, so measure where the name sits.
          const nameEl = hostEl.querySelector<HTMLElement>('[data-name]');
          const nTop = nameEl ? nameEl.offsetTop : H * 0.12;
          const nH = nameEl ? nameEl.offsetHeight : H * 0.25;
          const wide = W >= 900;
          const desiredY = nTop + nH * (wide ? 0.66 : 0.64);
          let h = Math.min(H - desiredY, H * 0.97);
          let w = h * aspect;
          const maxW = wide ? W * 0.7 : W * 1.15;
          if (w > maxW) {
            w = maxW;
            h = w / aspect;
          }
          rect = { x: W * 0.5 - w / 2, y: H - h, w, h };
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(hostEl);
        hostEl.addEventListener('hero:fit', resize);

        // ---- pointer ------------------------------------------------------
        const ptr = { x: 0, y: 0, nx: 0, ny: 0, active: false, last: -1e9 };
        const lens = { x: W * 0.5, y: H * 0.35, r: 0 };
        let down = false;
        const local = (e: PointerEvent) => {
          const b = hostEl.getBoundingClientRect();
          return { x: e.clientX - b.left, y: e.clientY - b.top, b };
        };
        const onMove = (e: PointerEvent) => {
          const { x, y, b } = local(e);
          ptr.x = x; ptr.y = y;
          ptr.nx = (x / b.width) * 2 - 1;
          ptr.ny = (y / b.height) * 2 - 1;
          ptr.active = true;
          ptr.last = performance.now();
        };
        const ripples = [{ x: 0, y: 0, t: -10, on: 0 }, { x: 0, y: 0, t: -10, on: 0 }, { x: 0, y: 0, t: -10, on: 0 }];
        let ripIdx = 0;
        let t0 = performance.now();
        const addRipple = (x: number, y: number) => {
          const r = ripples[ripIdx++ % 3];
          r.x = x * dpr; r.y = y * dpr; r.t = (performance.now() - t0) / 1000; r.on = 1;
        };
        const onDown = (e: PointerEvent) => {
          if ((e.target as Element).closest('a, button, input')) return;
          onMove(e);
          down = true;
          addRipple(ptr.x, ptr.y);
        };
        const onUp = () => { down = false; };
        const onLeave = () => { ptr.active = false; };
        hostEl.addEventListener('pointermove', onMove);
        hostEl.addEventListener('pointerdown', onDown);
        window.addEventListener('pointerup', onUp);
        hostEl.addEventListener('pointerleave', onLeave);

        const io = new IntersectionObserver(([en]) => {
          visible = en.isIntersecting;
          if (visible && !raf && !disposed) raf = requestAnimationFrame(frame);
        });
        io.observe(hostEl);

        // ---- frame loop ---------------------------------------------------
        let prev = performance.now();
        let px = 0, py = 0, nextPing = 6;
        const ripArr = new Float32Array(12);
        const baseR = () => Math.min(Math.max(Math.min(W, H) * 0.17, 92), 175);
        const frame = (now: number): void => {
          raf = 0;
          if (disposed || !visible) return;
          const dt = Math.min((now - prev) / 1000, 0.05);
          prev = now;
          const t = (now - t0) / 1000;
          const idle = !ptr.active || now - ptr.last > 3000;

          // lens target: pointer, or a lazy drift across the body when nobody is steering
          let tx = ptr.x, ty = ptr.y;
          if (idle) {
            tx = rect.x + rect.w * (0.5 + Math.sin(t * 0.55) * 0.3);
            ty = rect.y + rect.h * (0.34 + Math.sin(t * 0.8 + 1.2) * 0.2);
            if (t > nextPing && state.assemble > 0.99) { addRipple(tx, ty); nextPing = t + 7; }
          }
          const k = 1 - Math.exp(-dt * (idle ? 3 : 10));
          lens.x += (tx - lens.x) * k;
          lens.y += (ty - lens.y) * k;
          const appear = Math.min(Math.max((state.assemble - 0.82) / 0.18, 0), 1);
          const want = (baseR() * (down ? 1.55 : 1) + state.grow * Math.hypot(W, H)) * appear;
          lens.r += (want - lens.r) * (1 - Math.exp(-dt * 8));

          // gentle parallax of the photograph; the name behind it moves the other way
          px += ((idle ? 0 : ptr.nx) - px) * (1 - Math.exp(-dt * 4));
          py += ((idle ? 0 : ptr.ny) - py) * (1 - Math.exp(-dt * 4));
          hostEl.style.setProperty('--px', px.toFixed(4));
          hostEl.style.setProperty('--py', py.toFixed(4));

          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.uniform2f(uni.res, canvas.width, canvas.height);
          gl.uniform4f(uni.rect, (rect.x - px * 12) * dpr, (rect.y - py * 6) * dpr, rect.w * dpr, rect.h * dpr);
          gl.uniform3f(uni.lens, lens.x * dpr, lens.y * dpr, lens.r * dpr);
          gl.uniform1f(uni.cell, cellCss * dpr);
          gl.uniform1f(uni.dpr, dpr);
          gl.uniform1f(uni.time, t);
          gl.uniform1f(uni.assemble, state.assemble);
          ripples.forEach((r, i) => { ripArr.set([r.x, r.y, r.t, r.on], i * 4); });
          gl.uniform4fv(uni.rip, ripArr);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
          raf = requestAnimationFrame(frame);
        };
        t0 = performance.now();
        raf = requestAnimationFrame(frame);
        readyRef.current();

        cleanup = () => {
          ro.disconnect();
          io.disconnect();
          hostEl.removeEventListener('hero:fit', resize);
          hostEl.removeEventListener('pointermove', onMove);
          hostEl.removeEventListener('pointerdown', onDown);
          window.removeEventListener('pointerup', onUp);
          hostEl.removeEventListener('pointerleave', onLeave);
        };
      } catch (err) {
        console.warn('Portrait shader unavailable, using the plain photo.', err);
        if (!disposed) {
          setFailed(true);
          readyRef.current();
        }
      }
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanup();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [host, state]);

  if (failed) {
    return <img className="portrait-fallback" src={asset('portrait.webp')} width={portrait.w} height={portrait.h} alt="" />;
  }
  return <canvas ref={canvasRef} className="portrait-gl" aria-hidden="true" />;
}
