#!/usr/bin/env python3
"""
Media pipeline for the portfolio.

Turns the original assets (screenshots, banner PNGs, showreel MP4s) into
web-friendly files under public/ and writes src/data/mediaManifest.json
(image sizes, so <img width/height> prevents layout shift).

Usage:
    python3 scripts/process_media.py <old-portfolio-folder> <banners-bootstrap-folder>

  <old-portfolio-folder>        the previous portfolio repo (has gymApp/, proveedores/, VenuePulse/, botRadar/, vids/, docs/)
  <banners-bootstrap-folder>    the banners-bootstrap repo (has "Diw Banner N.png")

Needs: Python 3 + Pillow, and ffmpeg/ffprobe on PATH.
Original videos are never modified; re-encoded copies are written to public/media/showreel/.
"""
import json
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
MANIFEST = ROOT / "src" / "data" / "mediaManifest.json"

if len(sys.argv) != 3:
    sys.exit(__doc__)
OLD = Path(sys.argv[1])
BANNERS = Path(sys.argv[2])

manifest: dict[str, list[int]] = {}


def to_webp(src: Path, dest_rel: str, max_w: int = 1600, quality: int = 82) -> None:
    dest = PUBLIC / dest_rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(src).convert("RGB")
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    im.save(dest, "WEBP", quality=quality, method=6)
    manifest[dest_rel] = [im.width, im.height]
    print(f"  img  {dest_rel}  {im.width}x{im.height}  {dest.stat().st_size // 1024} KB")


# ---------------------------------------------------------------- screenshots
IMAGE_MAP = {
    # supplier manager (Symfony)
    "projects/supplier/dark-cards.webp": OLD / "proveedores" / "1 (1).png",
    "projects/supplier/light-table.webp": OLD / "proveedores" / "1 (2).png",
    # gym routine app (Laravel)
    "projects/gym/landing.webp": OLD / "gymApp" / "1 (7).png",
    "projects/gym/dashboard.webp": OLD / "gymApp" / "1 (5).png",
    "projects/gym/categories.webp": OLD / "gymApp" / "1 (3).png",
    "projects/gym/categories-more.webp": OLD / "gymApp" / "1 (2).png",
    "projects/gym/edit-category.webp": OLD / "gymApp" / "1 (1).png",
    "projects/gym/exercises.webp": OLD / "gymApp" / "1 (4).png",
    "projects/gym/login-dark.webp": OLD / "gymApp" / "1 (6).png",
    # animated banners
    "projects/banners/banner-1.webp": BANNERS / "Diw Banner 1.png",
    "projects/banners/banner-2.webp": BANNERS / "Diw Banner 2.png",
    "projects/banners/banner-3.webp": BANNERS / "Diw Banner 3.png",
    # prototypes (source not public)
    "projects/venuepulse/1.webp": OLD / "VenuePulse" / "1.png",
    "projects/venuepulse/2.webp": OLD / "VenuePulse" / "2.png",
    "projects/venuepulse/3.webp": OLD / "VenuePulse" / "3.png",
    "projects/venuepulse/4.webp": OLD / "VenuePulse" / "4.png",
    "projects/venuepulse/5.webp": OLD / "VenuePulse" / "5.png",
    "projects/venuepulse/6.webp": OLD / "VenuePulse" / "6.png",
    "projects/botradar/1.webp": OLD / "botRadar" / "1.png",
    "projects/botradar/2.webp": OLD / "botRadar" / "2.png",
}
print("Screenshots")
for rel, src in IMAGE_MAP.items():
    to_webp(src, rel)

# ------------------------------------------------------------------------ CVs
print("CVs (copied byte-for-byte, never regenerated)")
(PUBLIC / "docs").mkdir(parents=True, exist_ok=True)
for lang in ("Ca", "Es", "En"):
    shutil.copy2(OLD / "docs" / f"Adil_Chainakh_CV_{lang}.pdf", PUBLIC / "docs" / f"Adil_Chainakh_CV_{lang}.pdf")
    print(f"  docs/Adil_Chainakh_CV_{lang}.pdf")

# ------------------------------------------------------------------- showreel
CLIPS = {
    # id: original filename inside <old-portfolio>/vids
    "beats-banner": "Animacion Banner 1_1.mp4",
    "croissant-ad": "main comp.mp4",
    "calamari-ad": "squid.mp4",
    "map-route": "mapfx c_1.mp4",
    "presenter-3d": "Part2_1.mp4",
    "ae-lighting": "timer first scene_1.mp4",
    "truenas-tutorial": "TrueNAS_Tutorial_DASP_1.mp4",
}


def probe(path: Path) -> tuple[float, int, int]:
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width,height:format=duration", "-of", "json", str(path)]
    )
    data = json.loads(out)
    return float(data["format"]["duration"]), data["streams"][0]["width"], data["streams"][0]["height"]


print("Showreel (re-encoded copies)")
(PUBLIC / "media" / "showreel").mkdir(parents=True, exist_ok=True)
clip_info = {}
for cid, name in CLIPS.items():
    src = OLD / "vids" / name
    dur, w, h = probe(src)
    out_w = min(1280, w)
    out_h = round(h * out_w / w / 2) * 2
    mp4 = PUBLIC / "media" / "showreel" / f"{cid}.mp4"
    subprocess.check_call([
        "ffmpeg", "-v", "error", "-y", "-i", str(src),
        "-vf", f"scale={out_w}:{out_h}", "-c:v", "libx264", "-preset", "medium", "-crf", "26",
        "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", str(mp4),
    ])
    poster_rel = f"media/showreel/{cid}.webp"
    tmp = ROOT / f".poster_{cid}.png"
    subprocess.check_call([
        "ffmpeg", "-v", "error", "-y", "-ss", f"{dur * 0.4:.2f}", "-i", str(src),
        "-frames:v", "1", "-vf", f"scale={out_w}:{out_h}", str(tmp),
    ])
    to_webp(tmp, poster_rel, max_w=1280, quality=80)
    tmp.unlink()
    clip_info[cid] = {"duration": round(dur, 1), "width": out_w, "height": out_h}
    print(f"  clip {cid}  {dur:.1f}s  {out_w}x{out_h}  {mp4.stat().st_size // 1024} KB")

manifest["__clips__"] = clip_info  # type: ignore[assignment]
MANIFEST.parent.mkdir(parents=True, exist_ok=True)
MANIFEST.write_text(json.dumps(manifest, indent=1))
print(f"\nWrote {MANIFEST.relative_to(ROOT)}")
