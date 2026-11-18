import type { MatrixLayoutNode, MemoryClusterId } from "./types";

type Vec3 = { x: number; y: number; z: number };

const CLUSTER_ORDER: MemoryClusterId[] = [
  "software",
  "ai_research",
  "entrepreneurship",
  "personal",
  "projects",
  "strategy",
  "learning",
  "conversations",
  "science",
];

/** Lobe directions — breaks the perfect sphere into a living intelligence silhouette. */
const LOBE_DIRS: Vec3[] = [
  { x: 1, y: 0.15, z: 0.2 },
  { x: -0.85, y: 0.35, z: 0.4 },
  { x: 0.2, y: 0.9, z: -0.15 },
  { x: 0.15, y: -0.75, z: 0.55 },
  { x: -0.3, y: -0.2, z: 0.95 },
  { x: 0.55, y: 0.1, z: -0.85 },
  { x: -0.6, y: 0.55, z: -0.55 },
  { x: 0.75, y: -0.45, z: -0.35 },
  { x: -0.1, y: 0.25, z: -0.1 },
].map((v) => {
  const l = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / l, y: v.y / l, z: v.z / l };
});

/**
 * Alternate 3D form: layered constellation — cluster columns with vertical
 * learning strata (not a sphere).
 */
export function projectToConstellation(
  nodes: MatrixLayoutNode[],
  radius = 14,
): MatrixLayoutNode[] {
  const maxPr = Math.max(...nodes.map((n) => n.pagerank), 0.0001);
  const clusterCount = CLUSTER_ORDER.length;

  return nodes.map((node, i) => {
    const ci = Math.max(0, CLUSTER_ORDER.indexOf(node.cluster));
    const angle = (ci / clusterCount) * Math.PI * 2;
    const n1 = (hash(node.id) % 1000) / 1000;
    const n2 = (hash(node.id + "b") % 1000) / 1000;
    const ring = radius * (0.35 + n1 * 0.75);
    const spread = (n2 - 0.5) * 4.5;
    const height =
      (node.importance - 0.5) * 10 +
      (node.pagerank / maxPr) * 6 +
      Math.sin(i * 0.37) * 2.2;

    return {
      ...node,
      x: Math.cos(angle) * ring + Math.cos(angle + 1.2) * spread,
      y: height,
      z: Math.sin(angle) * ring + Math.sin(angle + 1.2) * spread,
    };
  });
}

/**
 * Project memories onto an irregular Ultron-style intelligence volume —
 * lobed, gapped, not a clean sphere.
 */
export function projectToSphere(
  nodes: MatrixLayoutNode[],
  radius = 14,
): MatrixLayoutNode[] {
  const maxPr = Math.max(...nodes.map((n) => n.pagerank), 0.0001);
  const clusterCount = CLUSTER_ORDER.length;

  return nodes.map((node, i) => {
    const ci = Math.max(0, CLUSTER_ORDER.indexOf(node.cluster));
    const lobe = LOBE_DIRS[ci % LOBE_DIRS.length]!;

    // Base direction biased toward cluster lobe + noise
    const n1 = (hash(node.id) % 1000) / 1000;
    const n2 = (hash(node.id + "b") % 1000) / 1000;
    const n3 = (hash(node.id + "c") % 1000) / 1000;

    const lon = n1 * Math.PI * 2 + ci * 0.35;
    const lat = 0.18 + n2 * (Math.PI - 0.36);

    let dx = Math.sin(lat) * Math.cos(lon);
    let dy = Math.cos(lat);
    let dz = Math.sin(lat) * Math.sin(lon);

    // Pull toward lobe for organic, non-spherical silhouette
    const pull = 0.42 + node.importance * 0.25;
    dx = dx * (1 - pull) + lobe.x * pull;
    dy = dy * (1 - pull) + lobe.y * pull;
    dz = dz * (1 - pull) + lobe.z * pull;
    const dl = Math.hypot(dx, dy, dz) || 1;
    dx /= dl;
    dy /= dl;
    dz /= dl;

    // Shell depth: core = important; outer = peripheral
    const shell =
      0.22 +
      (1 - node.pagerank / maxPr) * 0.48 +
      (1 - node.importance) * 0.2 +
      ((i % 11) / 11) * 0.1;

    // Radial noise + lobe elongation (breaks circular outline)
    const radialNoise = 0.78 + n3 * 0.55 + Math.sin(lon * 3 + lat * 2) * 0.12;
    const lobeBoost = 1 + Math.max(0, dx * lobe.x + dy * lobe.y + dz * lobe.z) * 0.45;

    // Occasional spikes for high-activity memories
    const spike =
      node.activity > 0.85 && node.importance > 0.7 ? 1.18 + n1 * 0.22 : 1;

    // Carve gaps (learning intelligence has voids, not full shells)
    const gap =
      Math.sin(lon * 2.5 + ci) * Math.cos(lat * 3) > 0.72 ? 0.72 : 1;

    const r = radius * shell * radialNoise * lobeBoost * spike * gap;

    return {
      ...node,
      x: dx * r,
      y: dy * r * 0.88, // slight vertical squash — more brain-like
      z: dz * r,
    };
  });
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

class Vec {
  constructor(
    public x: number,
    public y: number,
    public z: number,
  ) {}
  length() {
    return Math.hypot(this.x, this.y, this.z);
  }
  normalize() {
    const l = this.length() || 1;
    this.x /= l;
    this.y /= l;
    this.z /= l;
    return this;
  }
  setLength(l: number) {
    this.normalize();
    this.x *= l;
    this.y *= l;
    this.z *= l;
    return this;
  }
  multiplyScalar(s: number) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }
  clone() {
    return new Vec(this.x, this.y, this.z);
  }
}

function slerp(a: Vec, b: Vec, t: number): Vec {
  const aa = a.clone().normalize();
  const bb = b.clone().normalize();
  let dot = aa.x * bb.x + aa.y * bb.y + aa.z * bb.z;
  dot = Math.min(1, Math.max(-1, dot));
  const omega = Math.acos(dot);
  if (omega < 1e-4) {
    return new Vec(
      aa.x + (bb.x - aa.x) * t,
      aa.y + (bb.y - aa.y) * t,
      aa.z + (bb.z - aa.z) * t,
    );
  }
  const so = Math.sin(omega);
  const s0 = Math.sin((1 - t) * omega) / so;
  const s1 = Math.sin(t * omega) / so;
  return new Vec(
    aa.x * s0 + bb.x * s1,
    aa.y * s0 + bb.y * s1,
    aa.z * s0 + bb.z * s1,
  );
}

/** Arc strands that follow the irregular volume (bulge with midpoint radius). */
export function arcPoints(a: Vec3, b: Vec3, segments = 8): number[] {
  const va = new Vec(a.x, a.y, a.z);
  const vb = new Vec(b.x, b.y, b.z);
  const ra = va.length() || 1;
  const rb = vb.length() || 1;
  const out: number[] = [];
  for (let i = 0; i < segments; i++) {
    const t0 = i / segments;
    const t1 = (i + 1) / segments;
    const midR = (ra + rb) * 0.5;
    const bulge = 1.04 + Math.sin(((t0 + t1) / 2) * Math.PI) * 0.06;
    const p0 = slerp(va, vb, t0).setLength(midR * bulge);
    const p1 = slerp(va, vb, t1).setLength(midR * bulge);
    out.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);
  }
  return out;
}

/** Fragmented orbital arcs for the scaffold (not full circles). */
export function buildFragmentArcs(
  radius: number,
  count: number,
  segsPerArc = 40,
): Float32Array {
  const arr: number[] = [];
  for (let i = 0; i < count; i++) {
    const tilt = ((i * 37) % 180) * (Math.PI / 180);
    const yaw = ((i * 53) % 360) * (Math.PI / 180);
    const start = ((i * 97) % 360) * (Math.PI / 180);
    const span = Math.PI * (0.35 + ((i * 13) % 50) / 100);
    const rJitter = radius * (0.82 + ((i * 17) % 40) / 100);

    for (let s = 0; s < segsPerArc; s++) {
      const a0 = start + (span * s) / segsPerArc;
      const a1 = start + (span * (s + 1)) / segsPerArc;
      const p0 = orientRingPoint(rJitter, a0, tilt, yaw);
      const p1 = orientRingPoint(rJitter, a1, tilt, yaw);
      // Skip some segments → dashed / fragmented look
      if ((s + i) % 5 === 0) continue;
      arr.push(p0.x, p0.y * 0.88, p0.z, p1.x, p1.y * 0.88, p1.z);
    }
  }
  return new Float32Array(arr);
}

function orientRingPoint(
  r: number,
  angle: number,
  tilt: number,
  yaw: number,
): Vec3 {
  let x = r * Math.cos(angle);
  let y = 0;
  let z = r * Math.sin(angle);
  // tilt around X
  const y2 = y * Math.cos(tilt) - z * Math.sin(tilt);
  const z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
  y = y2;
  z = z2;
  // yaw around Y
  const x3 = x * Math.cos(yaw) + z * Math.sin(yaw);
  const z3 = -x * Math.sin(yaw) + z * Math.cos(yaw);
  return { x: x3, y, z: z3 };
}
