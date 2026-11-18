"""
Extract clean atmospheric backgrounds from homeaibrain.png by removing
baked-in UI text/panels via edge+brightness masks and OpenCV inpainting.
"""

from pathlib import Path
import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "homeaibrain.png"
OUT = ROOT / "public" / "home"
OUT.mkdir(parents=True, exist_ok=True)

bgr = cv2.imread(str(SRC))
if bgr is None:
    raise SystemExit(f"Could not read {SRC}")
H, W = bgr.shape[:2]
hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)


def textish_mask(region_gray: np.ndarray, region_hsv: np.ndarray) -> np.ndarray:
    """Detect bright glyphs / UI chrome likely to be text or panels."""
    # Bright / near-white text
    bright = cv2.threshold(region_gray, 165, 255, cv2.THRESH_BINARY)[1]
    # High local contrast edges (glyphs, thin UI)
    edges = cv2.Canny(region_gray, 60, 160)
    edges = cv2.dilate(edges, np.ones((2, 2), np.uint8), iterations=1)
    # Saturated neon UI (cyan/magenta pills & labels)
    sat = region_hsv[:, :, 1]
    val = region_hsv[:, :, 2]
    neon = cv2.inRange(sat, 80, 255) & cv2.inRange(val, 90, 255)
    # Small connected bright blobs = likely text
    mask = cv2.bitwise_or(bright, edges)
    mask = cv2.bitwise_or(mask, neon)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8), iterations=2)
    mask = cv2.dilate(mask, np.ones((5, 5), np.uint8), iterations=2)
    return mask


def clean_band(y0f: float, y1f: float, name: str, extra_blur: int = 0) -> None:
    y0, y1 = int(y0f * H), int(y1f * H)
    band = bgr[y0:y1].copy()
    g = gray[y0:y1]
    h = hsv[y0:y1]
    mask = textish_mask(g, h)
    # Keep large dark scenic structure: reduce mask where very dark & low sat
    dark = (g < 55) & (h[:, :, 1] < 60)
    mask[dark] = 0
    cleaned = cv2.inpaint(band, mask, 5, cv2.INPAINT_TELEA)
    if extra_blur > 0:
        soft = cv2.GaussianBlur(cleaned, (0, 0), extra_blur)
        # Prefer soft atmosphere but keep some structure
        cleaned = cv2.addWeighted(cleaned, 0.55, soft, 0.45, 0)
    # Slight darken for text readability
    cleaned = cv2.convertScaleAbs(cleaned, alpha=0.88, beta=-8)
    path = OUT / name
    cv2.imwrite(str(path), cleaned, [int(cv2.IMWRITE_JPEG_QUALITY), 92])
    print(name, cleaned.shape[1], "x", cleaned.shape[0])


def scenic_hero_bg() -> None:
    """Hero background: sky/mountains/platform, UI chrome removed."""
    y0, y1 = int(0.04 * H), int(0.42 * H)
    band = bgr[y0:y1].copy()
    g = gray[y0:y1]
    h = hsv[y0:y1]
    mask = textish_mask(g, h)

    # Also wipe left sidebar strip
    mask[:, : int(0.07 * W)] = 255
    # Wipe top nav band inside this crop
    mask[: int(0.08 * band.shape[0]), :] = 255
    # Wipe central upper headline zone more aggressively (text-heavy)
    mask[: int(0.28 * band.shape[0]), int(0.15 * W) : int(0.85 * W)] = 255
    # Wipe bottom CTA / feature label zone
    mask[int(0.78 * band.shape[0]) :, :] = 255

    dark = (g < 40) & (h[:, :, 1] < 50)
    # Don't erase mountain silhouettes completely
    mask[dark & (np.arange(band.shape[0])[:, None] > band.shape[0] * 0.55)] = 0

    cleaned = cv2.inpaint(band, mask, 7, cv2.INPAINT_TELEA)
    soft = cv2.GaussianBlur(cleaned, (0, 0), 6)
    cleaned = cv2.addWeighted(cleaned, 0.65, soft, 0.35, 0)
    cleaned = cv2.convertScaleAbs(cleaned, alpha=0.9, beta=-10)
    cv2.imwrite(str(OUT / "bg-hero.jpg"), cleaned, [int(cv2.IMWRITE_JPEG_QUALITY), 93])
    print("bg-hero.jpg", cleaned.shape[1], "x", cleaned.shape[0])

    # Soft variant for overlays
    softer = cv2.GaussianBlur(cleaned, (0, 0), 18)
    softer = cv2.convertScaleAbs(softer, alpha=0.75, beta=-15)
    cv2.imwrite(str(OUT / "bg-hero-soft.jpg"), softer, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
    print("bg-hero-soft.jpg")


def clean_visual_crop(
    box: tuple[float, float, float, float],
    name: str,
    wipe_text: bool = True,
) -> None:
    l, t, r, b = box
    x0, y0, x1, y1 = int(l * W), int(t * H), int(r * W), int(b * H)
    crop = bgr[y0:y1, x0:x1].copy()
    if wipe_text:
        g = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
        h = cv2.cvtColor(crop, cv2.COLOR_BGR2HSV)
        mask = textish_mask(g, h)
        # Prefer keeping large glowing shapes (brains/dome): reduce mask on medium blobs
        mask = cv2.erode(mask, np.ones((2, 2), np.uint8), iterations=1)
        crop = cv2.inpaint(crop, mask, 4, cv2.INPAINT_TELEA)
    # Save PNG with mild alpha from darkness (optional RGB only for jpg)
    if name.endswith(".png"):
        rgba = cv2.cvtColor(crop, cv2.COLOR_BGR2BGRA)
        # Soft alpha: darker = more transparent around edges
        lum = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
        alpha = np.clip((lum.astype(np.int16) * 1.4 + 40), 0, 255).astype(np.uint8)
        rgba[:, :, 3] = alpha
        cv2.imwrite(str(OUT / name), rgba)
    else:
        cv2.imwrite(str(OUT / name), crop, [int(cv2.IMWRITE_JPEG_QUALITY), 92])
    print(name, crop.shape[1], "x", crop.shape[0])


# --- Clean section backgrounds ---
scenic_hero_bg()
clean_band(0.38, 0.48, "bg-features.jpg", extra_blur=8)
clean_band(0.45, 0.64, "bg-how.jpg", extra_blur=5)
clean_band(0.62, 0.80, "bg-usecases.jpg", extra_blur=5)
clean_band(0.78, 0.92, "bg-universe.jpg", extra_blur=5)
clean_band(0.90, 1.00, "bg-why.jpg", extra_blur=6)

# --- Visuals with text wiped ---
clean_visual_crop((0.12, 0.10, 0.88, 0.33), "visual-nexus.png", wipe_text=True)
clean_visual_crop((0.02, 0.46, 0.42, 0.605), "visual-how-layers.png", wipe_text=True)
clean_visual_crop((0.02, 0.805, 0.40, 0.90), "visual-globe.png", wipe_text=True)
clean_visual_crop((0.60, 0.81, 0.97, 0.91), "visual-graph.png", wipe_text=True)

# Use-case illustrations — crop art zone and wipe residual titles
for i, (xs, xe) in enumerate(
    [(0.035, 0.255), (0.27, 0.49), (0.505, 0.725), (0.74, 0.96)],
    start=1,
):
    clean_visual_crop((xs, 0.665, xe, 0.745), f"visual-usecase-{i}.jpg", wipe_text=True)

print("Clean backgrounds written to", OUT)
