"""Save horizontal strips to locate section boundaries in the mockup."""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
src = Image.open(ROOT / "public" / "homeaibrain.png").convert("RGB")
W, H = src.size
out = ROOT / "public" / "home" / "_probe"
out.mkdir(parents=True, exist_ok=True)

# Save 5% tall strips every 5%
for i in range(0, 100, 5):
    t = i / 100
    b = min(1.0, (i + 5) / 100)
    strip = src.crop((0, int(t * H), W, int(b * H)))
    strip.save(out / f"strip_{i:02d}-{i+5:02d}.jpg", quality=85)

# Also save left/right halves of middle for how-it-works detection
mid = src.crop((0, int(0.45 * H), W, int(0.75 * H)))
mid.save(out / "mid_45-75.jpg", quality=90)
print("probes written", H, W)
