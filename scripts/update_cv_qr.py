"""Point the QR code and the portfolio link of the three CV PDFs at a web address.

    python3 scripts/update_cv_qr.py https://adil-zero-one.github.io/showcase/

Needs: pip install pypdf segno pillow reportlab
Always starts from the untouched PDFs in scripts/cv_originals/ and writes the results to public/docs/,
so it can be run again with another address. Three things change, everything else is kept as it is:
  1. the QR image,
  2. the portfolio link annotation (clickable area around the QR),
  3. one line of real, selectable text under the QR with the address (so people and parsers can read it).
"""
import io
import pathlib
import sys

import segno
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, TextStringObject
from PIL import Image
from reportlab.pdfgen import canvas

URL = sys.argv[1] if len(sys.argv) > 1 else "https://adil-zero-one.github.io/showcase/"
root = pathlib.Path(__file__).resolve().parent.parent
src_dir, out_dir = root / "scripts" / "cv_originals", root / "public" / "docs"
shown = URL.removeprefix("https://").removeprefix("http://").rstrip("/")

# Black modules on white with a 4-module quiet zone, 12 pixels per module (crisp at any print size).
buf = io.BytesIO()
segno.make(URL, error="m").save(buf, kind="png", scale=12, border=4, dark="#000000", light="#ffffff")
qr = Image.open(buf).convert("RGB")


def address_line(width: float, height: float) -> PdfReader:
    """A transparent page holding the visible address, under the QR block (bottom-left sidebar)."""
    b = io.BytesIO()
    c = canvas.Canvas(b, pagesize=(width, height))
    c.setFillColorRGB(0.62, 0.62, 0.6)
    c.setFont("Courier", 4.6)
    c.drawString(14.5, 14.2, shown)
    c.save()
    b.seek(0)
    return PdfReader(b)


for lang in ("Ca", "Es", "En"):
    reader = PdfReader(str(src_dir / f"Adil_Chainakh_CV_{lang}.pdf"))
    writer = PdfWriter(clone_from=reader)
    page = writer.pages[0]
    # the QR is the only small square image on the page (120x120); the portrait is much larger
    targets = [im for im in page.images if im.image.size == (120, 120)]
    assert len(targets) == 1, "expected exactly one 120x120 QR image"
    targets[0].replace(qr)
    changed = 0
    for ref in page.get("/Annots", []):
        a = ref.get_object()
        action = a.get("/A")
        if action is not None and str(action.get("/URI", "")).startswith("https://adil-zero-one.github.io/"):
            action[NameObject("/URI")] = TextStringObject(URL)
            changed += 1
    assert changed == 1, "expected exactly one portfolio link"
    page.merge_page(address_line(float(page.mediabox.width), float(page.mediabox.height)).pages[0])
    with open(out_dir / f"Adil_Chainakh_CV_{lang}.pdf", "wb") as f:
        writer.write(f)
    print(f"{lang}: QR replaced, link and address text updated -> {URL}")
