"""Render public/og.png (1200x630) from scripts/og/og.html. Needs: pip install playwright (and a Chromium)."""
import pathlib
from playwright.sync_api import sync_playwright

root = pathlib.Path(__file__).resolve().parent.parent
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=__import__('os').environ.get('CHROMIUM_PATH'))
    pg = b.new_page(viewport={"width": 1200, "height": 630})
    pg.goto((root / "scripts/og/og.html").as_uri())
    pg.evaluate("document.fonts.ready")
    pg.wait_for_timeout(500)
    pg.screenshot(path=str(root / "public/og.png"))
    b.close()
