"""Extract section backgrounds and visuals from homeaibrain.png."""

from pathlib import Path
from PIL import Image, ImageFilter, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
src = Image.open(ROOT / "public" / "homeaibrain.png").convert("RGBA")
W, H = src.size
out = ROOT / "public" / "home"
out.mkdir(parents=True, exist_ok=True)

# clean old non-probe files
for p in out.glob("*"):
    if p.is_file():
        p.unlink()


def crop(box: tuple[float, float, float, float], name: str) -> Image.Image:
    l, t, r, b = box
    im = src.crop((int(l * W), int(t * H), int(r * W), int(b * H)))
    path = out / name
    if name.endswith(".jpg"):
        im.convert("RGB").save(path, quality=92, optimize=True)
    else:
        im.save(path, optimize=True)
    print(f"{name}: {im.size}")
    return im


# --- Section backgrounds (full-bleed bands) ---
crop((0, 0.00, 1, 0.42), "bg-hero.jpg")
crop((0, 0.38, 1, 0.48), "bg-features.jpg")
crop((0, 0.45, 1, 0.64), "bg-how.jpg")
crop((0, 0.62, 1, 0.80), "bg-usecases.jpg")
crop((0, 0.78, 1, 0.92), "bg-universe.jpg")
crop((0, 0.90, 1, 1.00), "bg-why.jpg")

# Soft blurred hero atmosphere (text sits cleaner on this)
hero_atm = src.crop((0, int(0.05 * H), W, int(0.40 * H))).convert("RGB")
hero_atm = hero_atm.resize((1400, 900), Image.Resampling.LANCZOS)
hero_atm = hero_atm.filter(ImageFilter.GaussianBlur(radius=18))
hero_atm = ImageEnhance.Brightness(hero_atm).enhance(0.55)
hero_atm.save(out / "bg-hero-soft.jpg", quality=90, optimize=True)
print("bg-hero-soft.jpg:", hero_atm.size)

# --- Hero visuals ---
crop((0.10, 0.09, 0.90, 0.31), "visual-nexus.png")
crop((0.08, 0.10, 0.34, 0.27), "visual-jarvis-brain.png")
crop((0.66, 0.10, 0.92, 0.27), "visual-ultron-brain.png")
crop((0.28, 0.14, 0.72, 0.34), "visual-knowledge-dome.png")

# --- How it works ---
crop((0.02, 0.46, 0.50, 0.62), "visual-how-layers.png")

# --- Use cases (card art) ---
for i, (xs, xe) in enumerate(
    [(0.035, 0.255), (0.27, 0.49), (0.505, 0.725), (0.74, 0.96)],
    start=1,
):
    crop((xs, 0.665, xe, 0.785), f"visual-usecase-{i}.jpg")

# --- Knowledge universe ---
crop((0.02, 0.80, 0.42, 0.91), "visual-globe.png")
crop((0.60, 0.81, 0.97, 0.91), "visual-graph.png")

print("Done →", out)
