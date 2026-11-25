import * as THREE from "three";

export type HairStyle = "straight" | "wavy" | "curly";

export interface HairGeometryOptions {
  /** Number of strands (cards). */
  count: number;
  /** Segments along each strand. */
  segments: number;
  style: HairStyle;
  seed?: number;
  /** Global volume multiplier. */
  volume?: number;
  lengthScale?: number;
  widthScale?: number;
}

const HEAD = new THREE.Vector3(0, 0.42, 0);
const RX = 0.6;
const RY = 0.8;
const RZ = 0.62;
const GOLDEN = 2.399963229728653;

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = THREE.MathUtils.clamp;

/**
 * Builds a single BufferGeometry containing thousands of tapered hair cards.
 *
 * Each card is a ribbon with a precomputed tangent attribute. The vertex shader
 * anchors the root (uv.y = 0) and displaces the tips (uv.y = 1), so the wig can
 * breathe without any physics solve. Every 13th strand is a wide "volume" card
 * and gets a second, crossed ribbon so the silhouette stays opaque at any
 * rotation. Roots are distributed on an ellipsoid scalp with a face opening and
 * a centre part, then the path is pushed outside the skull, given gravity and
 * a style-specific wave/curl.
 */
export function createHairGeometry({
  count,
  segments,
  style,
  seed = 7,
  volume = 1,
  lengthScale = 1,
  widthScale = 1,
}: HairGeometryOptions): THREE.BufferGeometry {
  const rand = mulberry32(seed);
  const positions: number[] = [];
  const uvs: number[] = [];
  const tangents: number[] = [];
  const phases: number[] = [];
  const tints: number[] = [];
  const sways: number[] = [];
  const indices: number[] = [];

  const waveFreq = style === "curly" ? 5.1 : style === "wavy" ? 2.6 : 1.5;
  const waveAmp = (style === "curly" ? 0.15 : style === "wavy" ? 0.085 : 0.02) * volume;
  const maxAlpha = Math.cos(1.38);

  const normal = new THREE.Vector3(1, 0, 0);
  const tangent = new THREE.Vector3(0, -1, 0);
  const nProj = new THREE.Vector3();
  const side1 = new THREE.Vector3();
  const side2 = new THREE.Vector3();
  const p = new THREE.Vector3();
  const pts: THREE.Vector3[] = [];
  const tans: THREE.Vector3[] = [];

  let emitted = 0;
  let attempts = 0;
  const maxAttempts = count * 3;

  while (emitted < count && attempts < maxAttempts) {
    attempts += 1;

    const theta = emitted * GOLDEN + (rand() - 0.5) * 0.14;
    // Uniform-ish distribution over the upper scalp cap.
    const alpha = Math.acos(1 - rand() * (1 - maxAlpha));
    const sx = Math.sin(alpha) * Math.cos(theta);
    const sy = Math.cos(alpha);
    const sz = Math.sin(alpha) * Math.sin(theta);

    const rootX = HEAD.x + RX * sx * 1.015;
    const rootY = HEAD.y + RY * sy * 1.015;
    const rootZ = HEAD.z + RZ * sz * 1.015;

    // Hairline: leave the face (+Z) open below the forehead.
    if (rootY < 0.66 && sz > 0.12) continue;
    // Centre part: thin the roots right on the parting line.
    if (sz > 0.42 && Math.abs(sx) < 0.1 && rand() > 0.33) continue;

    const rootRad = Math.hypot(rootX, rootZ);
    const wide = emitted % 13 === 0;
    const front = sz > 0.18;
    const back = clamp(-sz, 0, 1);
    const rootDirX = rootRad < 0.06 ? Math.cos(theta) : rootX / rootRad;
    const rootDirZ = rootRad < 0.06 ? Math.sin(theta) : rootZ / rootRad;

    let dx = rootDirX;
    let dz = rootDirZ;
    const dl = Math.hypot(dx, dz) || 1;
    dx /= dl;
    dz /= dl;

    const length =
      (2.02 + back * 0.48 + rand() * 0.34) * (front ? 0.76 : 1) * lengthScale;
    const drift = (wide ? 0.2 : 0.09) + rand() * 0.24 + (style === "curly" ? 0.14 : 0);
    const facePush = front ? 0.2 : 0;
    const phase =
      style === "wavy"
        ? theta * 1.1 + rand() * 0.5
        : style === "curly"
          ? rand() * Math.PI * 2
          : rand() * Math.PI * 2;
    const amp = waveAmp * (0.72 + rand() * 0.7);
    const tint = clamp(0.16 + back * 0.42 + rand() * 0.45, 0, 1);
    const sway = wide ? 0.42 : 0.8 + rand() * 0.55;

    pts.length = 0;
    for (let s = 0; s <= segments; s++) {
      const t = s / segments;
      const swell = Math.sin(Math.PI * Math.min(t * 0.92, 1));
      const rad = rootRad + 0.045 + 0.17 * swell + drift * t;
      let x = dx * rad;
      let z = dz * rad;
      let y = rootY - length * t;

      if (front) {
        x += Math.sign(sx || dx) * facePush * t;
        z -= 0.17 * t;
      }

      // Coherent wave groups: tangential displacement + a smaller radial ripple.
      const wave = Math.sin(t * Math.PI * waveFreq + phase) * amp * Math.pow(t, 1.2);
      x += -dz * wave;
      z += dx * wave;
      const ripple =
        Math.cos(t * Math.PI * waveFreq * 1.35 + phase * 1.3) * amp * 0.55 * Math.pow(t, 1.3);
      x += dx * ripple;
      z += dz * ripple;

      if (style === "curly") {
        const coil =
          Math.sin(t * Math.PI * 10.5 + phase * 2.1) * 0.035 * Math.pow(t, 1.5);
        x += -dz * coil;
        z += dx * coil;
        y += Math.cos(t * Math.PI * 8 + phase) * 0.02 * t;
      }

      // Keep the strand outside the skull.
      if (t < 0.62) {
        const ny = (y - HEAD.y) / RY;
        const nx = x / RX;
        const nz = z / RZ;
        const d = Math.sqrt(nx * nx + ny * ny + nz * nz);
        if (d < 1.06 && d > 0.0001) {
          const k = 1.06 / d;
          x *= k;
          z *= k;
        }
      }

      pts.push(new THREE.Vector3(x, y, z));
    }

    tans.length = 0;
    for (let s = 0; s <= segments; s++) {
      const a = pts[Math.max(0, s - 1)];
      const b = pts[Math.min(segments, s + 1)];
      tans.push(new THREE.Vector3().subVectors(b, a).normalize());
    }

    normal.set(rootDirX, 0, rootDirZ);
    if (normal.lengthSq() < 1e-5) normal.set(1, 0, 0);
    normal.normalize();

    const widthRoot =
      (wide ? 0.062 : 0.026) * widthScale * (0.82 + rand() * 0.5) * (0.85 + back * 0.3);

    const emitCard = (useCross: boolean) => {
      const base = positions.length / 3;
      for (let s = 0; s <= segments; s++) {
        const t = s / segments;
        tangent.copy(tans[s]);
        nProj.copy(normal).addScaledVector(tangent, -normal.dot(tangent));
        if (nProj.lengthSq() < 1e-5) nProj.set(1, 0, 0);
        nProj.normalize();
        side1.crossVectors(tangent, nProj).normalize();
        side2.copy(useCross ? nProj : side1);

        const width =
          widthRoot * (1 - 0.8 * Math.pow(t, 0.85)) * (useCross ? 0.72 : 1) + 0.0014;

        for (const sign of [-1, 1]) {
          p.copy(pts[s]).addScaledVector(side2, width * sign);
          positions.push(p.x, p.y, p.z);
          uvs.push(sign < 0 ? 0 : 1, t);
          tangents.push(tans[s].x, tans[s].y, tans[s].z);
          phases.push(phase);
          tints.push(tint);
          sways.push(sway);
        }
      }
      for (let s = 0; s < segments; s++) {
        const a = base + s * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;
        indices.push(a, b, c, b, d, c);
      }
    };

    emitCard(false);
    if (wide || emitted % 23 === 0) emitCard(true);
    emitted += 1;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("aTangent", new THREE.Float32BufferAttribute(tangents, 3));
  geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
  geometry.setAttribute("aTint", new THREE.Float32BufferAttribute(tints, 1));
  geometry.setAttribute("aSway", new THREE.Float32BufferAttribute(sways, 1));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  return geometry;
}

/** Lathe profile for the atelier bust: shoulders, neck, featureless head. */
export function createBustGeometry() {
  const profile: Array<[number, number]> = [
    [0, -2.55],
    [0.92, -2.52],
    [1.06, -2.4],
    [0.98, -2.24],
    [0.78, -2.08],
    [0.55, -1.93],
    [0.38, -1.78],
    [0.3, -1.5],
    [0.27, -1.2],
    [0.29, -0.95],
    [0.36, -0.7],
    [0.46, -0.4],
    [0.55, -0.1],
    [0.59, 0.2],
    [0.6, 0.45],
    [0.57, 0.68],
    [0.5, 0.9],
    [0.38, 1.06],
    [0.2, 1.16],
    [0, 1.2],
  ];
  const points = profile.map(([x, y]) => new THREE.Vector2(x, y));
  const geometry = new THREE.LatheGeometry(points, 64);
  geometry.scale(1, 1, 0.82);
  geometry.computeVertexNormals();
  return geometry;
}
