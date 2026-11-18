"""Extract exact Knowledge Universe assets from homeaibrain.png."""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
src = Image.open(ROOT / "public" / "homeaibrain.png").convert("RGBA")
W, H = src.size
out = ROOT / "public" / "home"
out.mkdir(parents=True, exist_ok=True)


def crop(box: tuple[float, float, float, float], name: str) -> None:
    l, t, r, b = box
    im = src.crop((int(l * W), int(t * H), int(r * W), int(b * H)))
    path = out / name
    if name.endswith(".jpg"):
        im.convert("RGB").save(path, quality=94, optimize=True)
    else:
        im.save(path, optimize=True)
    print(f"{name}: {im.size}")


# Full Knowledge Universe card plate (exact mockup section)
crop((0.025, 0.728, 0.975, 0.882), "bg-universe.jpg")

# Left globe only
crop((0.04, 0.742, 0.325, 0.872), "visual-globe.jpg")

# Right graph card only (avoid center text bleed)
crop((0.695, 0.752, 0.955, 0.872), "visual-graph.jpg")

print("Done")
