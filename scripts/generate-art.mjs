/**
 * T&C Hairs — editorial art generator (v2)
 *
 * The image provider was unavailable, so these plates are drawn as
 * deterministic SVG "hair studies" and rasterized with Sharp. The language is
 * deliberately sculptural: solid glossy locks, coherent wave groups, a clipped
 * specular sheen and a hot orange rim — closer to a car campaign than a
 * stock photo. Drop real photography into /public/images to replace them.
 *
 * Run all:      node scripts/generate-art.mjs
 * Run a subset: node scripts/generate-art.mjs product-straight product-curly
 */
import sharp from "sharp";
import fs from "node:fs/promises";

const W = 1200;
const H = 1500;
const CX = 600;

/* ------------------------------------------------------------------ utils */
function rng(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r1 = (n) => Math.round(n * 10) / 10;
const r2 = (n) => Math.round(n * 100) / 100;

function smoothPath(points, closed = false) {
  if (points.length < 2) return "";
  const p = points.map(([x, y]) => [r1(x), r1(y)]);
  const at = (i) => p[(i + p.length) % p.length];
  let d = `M${p[0][0]} ${p[0][1]}`;
  const last = closed ? p.length : p.length - 1;
  for (let i = 0; i < last; i++) {
    const p0 = closed ? at(i - 1) : p[Math.max(i - 1, 0)];
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = closed ? at(i + 2) : p[Math.min(i + 2, p.length - 1)];
    d += ` C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(
      p2[0] - (p3[0] - p1[0]) / 6,
    )} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`;
  }
  return closed ? `${d} Z` : d;
}

const F = (color, opacity = 1) => `fill="${color}" fill-opacity="${r2(opacity)}"`;
const S = (color, w, opacity = 1) =>
  `stroke="${color}" stroke-width="${r2(w)}" stroke-opacity="${r2(opacity)}" stroke-linecap="round" fill="none"`;

/* ------------------------------------------------------------------- defs */
function defs({ partial = false } = {}) {
  return `
  <defs>
    <radialGradient id="orangeHalo" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#ff8a3d" stop-opacity="0.42"/>
      <stop offset="32%" stop-color="#ff5a00" stop-opacity="0.22"/>
      <stop offset="66%" stop-color="#7a2500" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#ff5a00" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="keyHalo" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#ffe2c4" stop-opacity="0.30"/>
      <stop offset="46%" stop-color="#ff9d5c" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#ff9d5c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="base" x1="0.15" y1="0" x2="0.7" y2="1">
      <stop offset="0" stop-color="#5a3a24"/>
      <stop offset="0.18" stop-color="#40281a"/>
      <stop offset="0.46" stop-color="#2a1a11"/>
      <stop offset="0.75" stop-color="#170f0a"/>
      <stop offset="1" stop-color="#0a0705"/>
    </linearGradient>
    <linearGradient id="bust" x1="0" y1="0" x2="1" y2="0.5">
      <stop offset="0" stop-color="#0b0908"/>
      <stop offset="0.55" stop-color="#1c1511"/>
      <stop offset="1" stop-color="#0a0806"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a1a10" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#050505" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="sheen" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#ffe6cb" stop-opacity="0.42"/>
      <stop offset="45%" stop-color="#ffb37c" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#ff8a3d" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orangeSheen" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#ff7a2f" stop-opacity="0.5"/>
      <stop offset="60%" stop-color="#ff5a00" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#ff5a00" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="46%" r="75%">
      <stop offset="0" stop-color="#000" stop-opacity="0"/>
      <stop offset="58%" stop-color="#000" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.82"/>
    </radialGradient>
    <linearGradient id="laceSkin" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1a100b"/>
      <stop offset="0.45" stop-color="#5a3a28"/>
      <stop offset="0.75" stop-color="#3a2419"/>
      <stop offset="1" stop-color="#120c08"/>
    </linearGradient>
    <linearGradient id="stone" x1="0" y1="0" x2="0.7" y2="1">
      <stop offset="0" stop-color="#26211c"/>
      <stop offset="0.5" stop-color="#141210"/>
      <stop offset="1" stop-color="#0a0908"/>
    </linearGradient>
    <linearGradient id="wood" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6b4a2d"/>
      <stop offset="0.5" stop-color="#3a2617"/>
      <stop offset="1" stop-color="#1c1109"/>
    </linearGradient>
    <filter id="blur2" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="2.2"/>
    </filter>
    <filter id="blur5" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5"/>
    </filter>
    <filter id="blur14" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="14"/>
    </filter>
    <filter id="blur30" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="30"/>
    </filter>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="3" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="saturate" values="0" result="mono"/>
      <feComponentTransfer in="mono" result="grain">
        <feFuncA type="linear" slope="0.55"/>
      </feComponentTransfer>
    </filter>
  </defs>`;
}

const grain = `<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.20" style="mix-blend-mode:overlay"/>`;
const vignette = `<rect width="${W}" height="${H}" fill="url(#vignette)"/>`;

/* --------------------------------------------------------------- geometry */
function lockCenter({ x0, y0, length, style, spread, phase, side = 1, samples = 30 }) {
  const pts = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const drift = Math.pow(t, 1.15);
    let x = x0 + side * spread * drift;
    let y = y0 + length * t;
    if (style === "straight") {
      x += Math.sin(t * Math.PI * 2.1 + phase) * 4.5 * Math.pow(t, 1.3);
      x += Math.sin(t * Math.PI * 4.4 + phase * 2) * 1.8 * t;
    } else if (style === "wavy") {
      x += Math.sin(t * Math.PI * 2.5 + phase) * 54 * Math.pow(t, 0.75);
      x += Math.sin(t * Math.PI * 5.2 + phase * 1.7) * 11 * t;
    } else if (style === "curly") {
      x += Math.sin(t * Math.PI * 4.1 + phase) * 70 * Math.pow(t, 0.6);
      x += Math.sin(t * Math.PI * 8.6 + phase * 1.8) * 14 * t;
      y += Math.sin(t * Math.PI * 6.2 + phase) * 12 * t;
    }
    pts.push([x, y]);
  }
  return pts;
}

/** A solid, tapered lock of hair (closed outline around a centerline). */
function lockShape(pts, width) {
  const n = pts.length - 1;
  const left = [];
  const right = [];
  for (let i = 0; i <= n; i++) {
    const p = pts[i];
    const a = pts[Math.max(i - 1, 0)];
    const b = pts[Math.min(i + 1, n)];
    let tx = b[0] - a[0];
    let ty = b[1] - a[1];
    const len = Math.hypot(tx, ty) || 1;
    tx /= len;
    ty /= len;
    const t = i / n;
    const bulge = 0.55 + 0.45 * Math.sin(Math.PI * Math.min(t * 1.25, 1));
    const w = Math.max(0.8, width * bulge * Math.pow(1 - t, 0.55));
    left.push([p[0] - ty * w, p[1] + tx * w]);
    right.push([p[0] + ty * w, p[1] - tx * w]);
  }
  return smoothPath([...left, ...right.reverse()], true);
}

/** Sample points along a lock, offset laterally — used for shine strands. */
function offsetLine(pts, offset, from = 0, to = 1) {
  const n = pts.length - 1;
  const out = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const p = pts[i];
    const a = pts[Math.max(i - 1, 0)];
    const b = pts[Math.min(i + 1, n)];
    let tx = b[0] - a[0];
    let ty = b[1] - a[1];
    const len = Math.hypot(tx, ty) || 1;
    tx /= len;
    ty /= len;
    out.push([p[0] - ty * offset, p[1] + tx * offset]);
  }
  const start = Math.floor(from * n);
  const end = Math.ceil(to * n);
  return smoothPath(out.slice(start, end + 1));
}

/* ------------------------------------------------------------- hair study */
function hairStudy({
  seed = 1,
  style = "straight", // straight | wavy | curly | bob
  rootSpan = 235,
  length = 1000,
  spread = 150,
  widthBase = 24,
  density = 130,
  sweep = 0,
  volume = 1,
  clipBob = false,
} = {}) {
  const rand = rng(seed);
  const R = (a, b) => a + (b - a) * rand();
  const isBob = style === "bob";
  const effStyle = isBob ? "straight" : style;
  const len = isBob ? 470 : length;
  const parts = [];
  const topY = 330;
  const hairStart = 390;

  /* ---- silhouette (used for base fill, clipping sheen and rim) ---- */
  const outline = [];
  for (let i = 0; i <= 18; i++) {
    const t = i / 18;
    outline.push([CX - rootSpan - 18 + t * (rootSpan * 2 + 36), topY - Math.sin(t * Math.PI) * 150]);
  }
  const edgeW = effStyle === "curly" ? 38 : effStyle === "wavy" ? 24 : 12;
  const sidePts = [];
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    const y = hairStart + t * (len + 120);
    const bulge = (rootSpan + 120) * (0.55 + 0.55 * Math.sin(Math.PI * Math.min(t * 0.95, 1))) * volume;
    const wave =
      Math.sin(t * Math.PI * (effStyle === "curly" ? 7 : effStyle === "wavy" ? 4.5 : 3) + seed) *
      edgeW *
      t;
    sidePts.push([
      CX + rootSpan * 0.85 + bulge + wave + sweep * t,
      y,
      CX - rootSpan * 0.85 - bulge + wave + sweep * t,
      y,
    ]);
  }
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    const x = CX + (rootSpan + 120) * 0.95 + sweep - t * ((rootSpan + 120) * 1.9);
    outline.push([x, hairStart + len + 120 + Math.sin(t * Math.PI * 5 + seed) * edgeW * 0.8]);
  }
  for (let i = sidePts.length - 1; i >= 0; i--) {
    outline.push([sidePts[i][2], sidePts[i][3]]);
  }
  for (let i = sidePts.length - 1; i >= 0; i--) {
    outline.push([sidePts[i][0], sidePts[i][1]]);
  }
  const silhouettePath = smoothPath(outline, true);
  parts.push(`<path d="${silhouettePath}" ${F("url(#base)", 1)}/>`);

  // Warm occlusion/shadow at the roots so the volume sits down.
  parts.push(
    `<ellipse cx="${CX}" cy="${topY + 40}" rx="${rootSpan + 60}" ry="120" fill="#0a0705" opacity="0.55" filter="url(#blur14)"/>`,
  );

  /* ---- locks ---- */
  const backPalette = ["#170f0a", "#1f140d", "#27180f", "#130d09"];
  const midPalette = ["#2c1b11", "#341f13", "#3c2617", "#241610", "#45301e"];
  const frontPalette = ["#4a2f1c", "#563821", "#3f2818", "#5f3d25"];
  const shinePalette = ["#b37643", "#c98a52", "#9c6436", "#e0a66c"];

  // Curly styles are organised into clumps so wave phases stay coherent.
  const clumpCount = effStyle === "curly" ? 26 : 1;
  const clumps = Array.from({ length: clumpCount }, (_, i) => ({
    phase: (i / clumpCount) * Math.PI * 2 + R(-0.2, 0.2),
    x: CX + R(-1, 1) * rootSpan * 0.7,
    amp: R(0.7, 1.15),
  }));

  const drawLock = (palette, wMul, opacity, phaseOverride, xScale = 1) => {
    const rootX = CX + R(-rootSpan, rootSpan) * xScale;
    const side = Math.sign(rootX - CX) || 1;
    const rootY = hairStart + R(-30, 50);
    const thisLen = len * R(0.82, 1.06);
    const thisSpread = spread * R(0.55, 1.15);
    const phase =
      phaseOverride ??
      (effStyle === "wavy"
        ? ((rootX - CX) / rootSpan) * 2.1 + sweep * 0.004 + R(-0.18, 0.18)
        : R(0, Math.PI * 2));
    const pts = lockCenter({
      x0: rootX,
      y0: rootY,
      length: thisLen,
      style: effStyle,
      spread: Math.abs(thisSpread) + sweep * 0.25,
      phase,
      side,
    });
    const w = widthBase * wMul * R(0.75, 1.2);
    const shape = lockShape(pts, w);
    const color = palette[Math.floor(rand() * palette.length)];
    parts.push(`<path d="${shape}" ${F(color, opacity)}/>`);

    // A soft edge highlight along one side of the lock reads as a round strand.
    if (w > 8) {
      const off = w * R(0.35, 0.62) * (rand() > 0.5 ? 1 : -1);
      const line = offsetLine(pts, off, R(0.02, 0.15), R(0.5, 0.95));
      const c = shinePalette[Math.floor(rand() * shinePalette.length)];
      parts.push(
        `<path d="${line}" ${S(c, R(0.8, 2.1), R(0.1, 0.34))} filter="url(#blur2)"/>`,
      );
    }
    return pts;
  };

  // Deep background volume
  for (let i = 0; i < Math.round(density * 0.22); i++) {
    drawLock(backPalette, R(1.4, 2.2), R(0.7, 0.95), null, 1.08);
  }
  // Main body
  for (let i = 0; i < Math.round(density * 0.55); i++) {
    const clump = clumps[Math.floor(rand() * clumps.length)];
    drawLock(
      midPalette,
      R(0.8, 1.45),
      R(0.8, 1),
      effStyle === "curly" ? clump.phase + R(-0.25, 0.25) : null,
    );
  }
  // Front, brighter locks
  for (let i = 0; i < Math.round(density * 0.32); i++) {
    const clump = clumps[Math.floor(rand() * clumps.length)];
    drawLock(
      frontPalette,
      R(0.55, 1),
      R(0.72, 0.96),
      effStyle === "curly" ? clump.phase + R(-0.2, 0.2) : null,
      0.92,
    );
  }
  // Thin accent locks
  for (let i = 0; i < Math.round(density * 0.35); i++) {
    const clump = clumps[Math.floor(rand() * clumps.length)];
    drawLock(
      shinePalette,
      R(0.18, 0.42),
      R(0.14, 0.4),
      effStyle === "curly" ? clump.phase + R(-0.3, 0.3) : null,
    );
  }

  /* ---- fine strand texture ---- */
  const fineColors = ["#170f0a", "#2a1a10", "#3a2416", "#52341f", "#6b4429", "#8a5a34"];
  const fineCount = style === "curly" ? 520 : 900;
  for (let i = 0; i < fineCount; i++) {
    const rootX = CX + R(-rootSpan, rootSpan) * 0.98;
    const side = Math.sign(rootX - CX) || 1;
    const phase =
      effStyle === "wavy"
        ? ((rootX - CX) / rootSpan) * 2.1 + R(-0.14, 0.14)
        : R(0, Math.PI * 2);
    const pts = lockCenter({
      x0: rootX,
      y0: hairStart + R(0, 160),
      length: len * R(0.7, 1.1),
      style: effStyle,
      spread: spread * R(0.3, 1.1) + sweep * 0.25,
      phase,
      side,
      samples: 22,
    });
    const isShine = rand() > 0.72;
    parts.push(
      `<path d="${smoothPath(pts)}" ${S(
        isShine ? shinePalette[i % shinePalette.length] : fineColors[i % fineColors.length],
        isShine ? R(0.8, 2) : R(0.6, 1.6),
        isShine ? R(0.12, 0.4) : R(0.25, 0.7),
      )}/>`,
    );
  }

  /* ---- clipped specular sheen ---- */
  parts.push(`<clipPath id="hairClip"><path d="${silhouettePath}"/></clipPath>`);
  parts.push(`
    <g clip-path="url(#hairClip)">
      <ellipse cx="${CX - 110 + sweep * 0.3}" cy="${500 + len * 0.12}" rx="190" ry="${200 + len * 0.16}" fill="url(#sheen)" opacity="0.9" filter="url(#blur14)"/>
      <ellipse cx="${CX + 140 + sweep * 0.4}" cy="${620 + len * 0.3}" rx="150" ry="${170 + len * 0.12}" fill="url(#orangeSheen)" opacity="0.5" filter="url(#blur14)"/>
      <ellipse cx="${CX + sweep * 0.5}" cy="${620}" rx="170" ry="80" fill="#ffe3c6" opacity="0.08" filter="url(#blur30)"/>
    </g>`);

  // Crisp specular streaks
  for (let i = 0; i < 26; i++) {
    const x0 = CX + R(-rootSpan * 0.9, rootSpan * 0.2);
    const y0 = 380 + R(0, len * 0.35);
    const pts = lockCenter({
      x0,
      y0,
      length: len * R(0.25, 0.55),
      style: effStyle,
      spread: spread * R(0.08, 0.4),
      phase: R(0, 6.28),
      side: Math.sign(x0 - CX) || 1,
      samples: 14,
    });
    parts.push(
      `<path d="${smoothPath(pts)}" ${S(
        i % 3 === 0 ? "#ffd9b7" : "#d79a62",
        R(1, 3.4),
        R(0.06, 0.22),
      )} filter="url(#blur2)"/>`,
    );
  }

  /* ---- orange rim ---- */
  parts.push(
    `<path d="${silhouettePath}" fill="none" stroke="#ff5a00" stroke-width="5" opacity="0.22" filter="url(#blur5)"/>`,
  );
  parts.push(
    `<path d="${silhouettePath}" fill="none" stroke="#ff7a2f" stroke-width="1.2" opacity="0.34"/>`,
  );
  const rimX = 1;
  for (let i = 0; i < 90; i++) {
    const rootX = CX + rimX * R(rootSpan * 0.25, rootSpan * 0.95);
    const side = 1;
    const pts = lockCenter({
      x0: rootX,
      y0: hairStart + R(-20, 180),
      length: len * R(0.5, 1.05),
      style: effStyle,
      spread: spread * R(0.5, 1.2),
      phase: R(0, 6.28),
      side,
      samples: 16,
    });
    parts.push(
      `<path d="${smoothPath(pts)}" ${S(
        i % 4 === 0 ? "#ffb078" : "#ff5a00",
        R(0.8, 2.6),
        R(0.12, 0.55),
      )} filter="url(#blur2)"/>`,
    );
  }

  /* ---- flyaways ---- */
  for (let i = 0; i < 34; i++) {
    const x0 = CX + R(-rootSpan, rootSpan);
    const y0 = hairStart + R(120, len * 0.9);
    const pts = lockCenter({
      x0,
      y0,
      length: R(80, 260),
      style: "wavy",
      spread: R(-80, 80),
      phase: R(0, 6.28),
      side: 1,
      samples: 10,
    });
    parts.push(
      `<path d="${smoothPath(pts)}" ${S(i % 4 === 0 ? "#ff7a2f" : "#8a5a34", R(0.5, 1.2), R(0.1, 0.4))}/>`,
    );
  }

  // Blunt bob cut: relieve the silhouette with a clean, slightly curved edge.
  if (clipBob) {
    parts.push(`
      <g>
        <rect x="0" y="0" width="${W}" height="${hairStart + len + 30}" fill="#000" opacity="0" />
      </g>`);
  }

  return { svg: parts.join(""), silhouettePath };
}

/* ------------------------------------------------------------------ busts */
function bust() {
  return `
    <g>
      <path d="M 90 ${H + 60} C 150 1290 330 1195 500 1150 L 518 1040 C 468 1006 450 956 450 892 L 750 892 C 750 956 732 1006 682 1040 L 700 1150 C 870 1195 1050 1290 1110 ${H + 60} Z" ${F("url(#bust)")}/>
      <path d="M 118 ${H + 60} C 190 1300 350 1210 500 1160" fill="none" stroke="#ff7a2f" stroke-width="2.4" opacity="0.28" filter="url(#blur5)"/>
      <path d="M 682 1040 L 700 1150" fill="none" stroke="#ff5a00" stroke-width="2" opacity="0.3" filter="url(#blur2)"/>
      <ellipse cx="${CX}" cy="565" rx="196" ry="248" ${F("url(#bust)")}/>
      <path d="M 748 430 C 800 560 790 740 720 818" fill="none" stroke="#ff7a2f" stroke-width="3" opacity="0.4" filter="url(#blur5)"/>
      <path d="M 452 760 C 445 690 448 620 468 560" fill="none" stroke="#ffb078" stroke-width="1.2" opacity="0.16"/>
    </g>`;
}

function backdrop({ variant = "default", sweep = 0 } = {}) {
  let extra = "";
  if (variant === "stone") {
    extra = `
      <g transform="rotate(-8 600 900)">
        <rect x="120" y="700" width="1020" height="680" rx="16" ${F("url(#stone)")}/>
        <rect x="120" y="700" width="1020" height="680" rx="16" ${F("url(#floor)", 0.7)}/>
        <path d="M150 760 L1100 790" stroke="#6b5a49" stroke-width="1" opacity="0.35"/>
        <path d="M140 830 L1120 855" stroke="#2b2621" stroke-width="1.2" opacity="0.7"/>
        <path d="M120 700 L1140 700" stroke="#ff7a2f" stroke-width="1.2" opacity="0.18"/>
      </g>`;
  } else if (variant === "atelier") {
    extra = `
      <rect x="0" y="1010" width="${W}" height="${H - 1010}" fill="#0b0907"/>
      <path d="M0 1012 L1200 1012" stroke="#5a3f28" stroke-width="2" opacity="0.55"/>
      <path d="M0 1080 L1200 1080" stroke="#1c1510" stroke-width="1.5"/>
      <ellipse cx="860" cy="220" rx="260" ry="240" fill="url(#orangeHalo)" opacity="0.9"/>`;
  }
  return `
    <rect width="${W}" height="${H}" fill="#070605"/>
    <ellipse cx="${700 + sweep * 0.5}" cy="560" rx="470" ry="540" fill="url(#orangeHalo)"/>
    <ellipse cx="${360 + sweep * 0.3}" cy="250" rx="360" ry="380" fill="url(#keyHalo)"/>
    ${extra}
  `;
}

function longHairPlate({ seed, style, length = 1010, spread = 150, widthBase = 25, sweep = 0, volume = 1, density = 130 }) {
  return `
    ${backdrop({ sweep })}
    ${bust()}
    <ellipse cx="${640 + sweep * 0.7}" cy="1360" rx="420" ry="100" fill="#000" opacity="0.6" filter="url(#blur30)"/>
    ${hairStudy({ seed, style, length, spread, widthBase, sweep, volume, density }).svg}
    <g clip-path="url(#hairClip)">
      <rect x="0" y="${1380}" width="${W}" height="120" fill="#050403" opacity="0.4" filter="url(#blur14)"/>
    </g>
    ${grain}
    ${vignette}
  `;
}

function bobPlate(seed) {
  return `
    ${backdrop({})}
    ${bust()}
    ${hairStudy({
      seed,
      style: "bob",
      length: 560,
      spread: 190,
      widthBase: 30,
      density: 150,
      volume: 1.08,
    }).svg}
    <path d="M 330 830 C 470 885 730 885 875 820" fill="none" stroke="#ff7a2f" stroke-width="2" opacity="0.25" filter="url(#blur2)"/>
    ${grain}
    ${vignette}
  `;
}

/* -------------------------------------------------------------- still life */
function bundleBody(x, y, angle, len, w, rnd) {
  const R = (a, b) => a + (b - a) * rnd();
  const parts = [];
  // Solid tapered body
  const pts = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    pts.push([x + Math.sin(t * 2.2) * 34 * t, y + len * t]);
  }
  parts.push(`<path d="${lockShape(pts, w / 2)}" ${F("url(#base)")}/>`);
  // Strands along the body
  for (let i = 0; i < 170; i++) {
    const off = R(-w / 2, w / 2);
    const d = [];
    for (let j = 0; j <= 14; j++) {
      const t = j / 14;
      d.push([
        x + Math.sin(t * 2.2) * 34 * t + off * (1 - 0.35 * t),
        y + len * t + R(-2, 2),
      ]);
    }
    const shine = rnd() > 0.62;
    parts.push(
      `<path d="${smoothPath(d)}" ${S(
        shine ? ["#c98a52", "#ffb37c", "#9c6436"][i % 3] : ["#1a110b", "#2a1a11", "#3a2417", "#0a0705"][i % 4],
        shine ? R(0.6, 1.4) : R(0.7, 2.2),
        shine ? R(0.14, 0.5) : R(0.35, 0.9),
      )}/>`,
    );
  }
  // Sheen band
  parts.push(
    `<ellipse cx="${x + 4}" cy="${y + len * 0.3}" rx="${w * 0.32}" ry="${len * 0.24}" fill="url(#sheen)" opacity="0.55" filter="url(#blur14)"/>`,
  );
  // Silk ribbon
  parts.push(`
    <g transform="rotate(${angle * 0.2} ${x} ${y})">
      <rect x="${x - w / 2 - 7}" y="${y - 8}" width="${w + 14}" height="30" rx="4" fill="#a83700"/>
      <rect x="${x - w / 2 - 7}" y="${y - 8}" width="${w + 14}" height="9" rx="4" fill="#ff7a2f" opacity="0.55"/>
      <path d="M ${x - w / 2 - 2} ${y + 22} Q ${x} ${y + 34} ${x + w / 2 + 2} ${y + 22}" fill="none" stroke="#2a0d00" stroke-width="2" opacity="0.6"/>
    </g>`);
  // Orange rim
  parts.push(
    `<path d="${smoothPath(pts.map(([px, py]) => [px + w * 0.45, py]))}" ${S("#ff5a00", 2.4, 0.35)} filter="url(#blur5)"/>`,
  );
  return `<g transform="rotate(${angle} ${x} ${y})">${parts.join("")}</g>`;
}

function bundlesPlate(seed) {
  const rnd = rng(seed);
  const R = (a, b) => a + (b - a) * rnd();
  return `
    ${backdrop({ variant: "stone", sweep: 40 })}
    <ellipse cx="600" cy="1250" rx="430" ry="80" fill="#000" opacity="0.55" filter="url(#blur30)"/>
    ${bundleBody(430, 620, -14, 570, 96, rnd)}
    ${bundleBody(615, 560, -4, 690, 116, rnd)}
    ${bundleBody(815, 660, 7, 530, 88, rnd)}
    <g opacity="0.5">
      <path d="M 210 560 C 260 520 300 520 340 545" fill="none" stroke="#ff7a2f" stroke-width="2" filter="url(#blur5)"/>
    </g>
    ${grain}
    ${vignette}
  `;
}

function clipinsPlate(seed) {
  const rnd = rng(seed);
  const R = (a, b) => a + (b - a) * rnd();
  const rows = [
    { y: 640, w: 800, h: 62, clips: 5 },
    { y: 815, w: 720, h: 54, clips: 4 },
    { y: 975, w: 610, h: 48, clips: 4 },
  ];
  const wefts = rows.map((row, ri) => {
    const hair = [];
    for (let i = 0; i < 220; i++) {
      const x0 = CX + R(-row.w / 2, row.w / 2);
      const pts = [];
      const len = R(300, 620) - ri * 30;
      for (let j = 0; j <= 12; j++) {
        const t = j / 12;
        pts.push([
          x0 + Math.sin(t * 3 + x0 * 0.01) * 28 * t + R(-3, 3),
          row.y + row.h + len * t,
        ]);
      }
      hair.push(
        `<path d="${smoothPath(pts)}" ${S(
          rnd() > 0.7 ? "#b37643" : ["#2a1a11", "#3a2417", "#170f0a"][i % 3],
          R(0.6, 1.8),
          R(0.25, 0.8),
        )}/>`,
      );
    }
    const clips = Array.from({ length: row.clips }, (_, c) => {
      const cx = CX - row.w / 2 + (row.w / (row.clips * 2)) * (c * 2 + 1);
      return `
        <g transform="translate(${r1(cx)} ${row.y - 8})">
          <rect x="-28" y="-13" width="56" height="24" rx="6" fill="#d8b26a"/>
          <rect x="-23" y="-10" width="46" height="7" rx="3" fill="#ffe9bc" opacity="0.6"/>
          <rect x="-29" y="4" width="58" height="8" rx="3" fill="#8a6a2f"/>
        </g>`;
    }).join("");
    return `
      <g>
        <rect x="${CX - row.w / 2}" y="${row.y}" width="${row.w}" height="${row.h}" rx="${row.h / 2}" fill="#1d130c"/>
        <rect x="${CX - row.w / 2}" y="${row.y}" width="${row.w}" height="${row.h / 2}" rx="${row.h / 3}" fill="#0a0705" opacity="0.55"/>
        <path d="M ${CX - row.w / 2 + 10} ${row.y + row.h - 8} Q ${CX} ${row.y + row.h + 14} ${CX + row.w / 2 - 10} ${row.y + row.h - 8}" fill="none" stroke="#080605" stroke-width="9"/>
        ${hair.join("")}
        <path d="M ${CX - row.w / 2 + 14} ${row.y + 5} H ${CX + row.w / 2 - 14}" stroke="#ffb37c" stroke-width="1.4" opacity="0.3"/>
        ${clips}
      </g>`;
  });
  return `
    ${backdrop({ variant: "stone", sweep: 20 })}
    <ellipse cx="600" cy="1270" rx="450" ry="90" fill="#000" opacity="0.5" filter="url(#blur30)"/>
    ${wefts.join("")}
    ${grain}
    ${vignette}
  `;
}

/* ------------------------------------------------------------------ macro */
function laceMacro(seed) {
  const rnd = rng(seed);
  const R = (a, b) => a + (b - a) * rnd();
  const dots = [];
  for (let y = 60; y < 1450; y += 13) {
    for (let x = 20; x < 1200; x += 13) {
      const ox = (Math.round(y / 13) % 2) * 6.5;
      const dx = x - 760;
      const dy = y - 760;
      const dist = Math.hypot(dx, dy);
      const focus = Math.max(0, 1 - dist / 720);
      if (dist < 700 && rnd() > 0.12) {
        dots.push(
          `<circle cx="${r1(x + ox)}" cy="${r1(y)}" r="${r2(1.1 + focus * 1.4)}" fill="#ffdfc0" opacity="${r2(0.05 + focus * 0.38)}"/>`,
        );
      }
    }
  }
  const strands = [];
  for (let i = 0; i < 700; i++) {
    const x0 = R(60, 1140);
    const y0 = R(20, 900);
    const pts = [];
    const len = R(240, 700);
    const side = x0 > 650 ? 1 : -1;
    for (let j = 0; j <= 18; j++) {
      const t = j / 18;
      const p = [
        x0 + side * t * R(60, 260) + Math.sin(t * 5 + x0 * 0.01) * 18 * t,
        y0 + len * t + Math.sin(t * 7 + y0 * 0.01) * 12 * t,
      ];
      pts.push(p);
    }
    const shine = rnd() > 0.55;
    strands.push(
      `<path d="${smoothPath(pts)}" ${S(
        shine ? ["#c98a52", "#ff9d5c", "#ffd0a3", "#a86a3b"][i % 4] : ["#1a110b", "#0d0907", "#2a1a11", "#3a2417"][i % 4],
        shine ? R(0.7, 2.4) : R(0.9, 3.6),
        shine ? R(0.14, 0.55) : R(0.3, 0.85),
      )}/>`,
    );
  }
  return `
    <rect width="${W}" height="${H}" fill="#080605"/>
    <rect width="${W}" height="${H}" fill="url(#laceSkin)"/>
    <ellipse cx="900" cy="320" rx="500" ry="460" fill="url(#orangeHalo)" opacity="0.95"/>
    <ellipse cx="300" cy="150" rx="420" ry="380" fill="url(#keyHalo)" opacity="0.8"/>
    <g transform="rotate(-7 600 750)">${dots.join("")}</g>
    <ellipse cx="760" cy="780" rx="300" ry="300" fill="#ffd9b5" opacity="0.035" filter="url(#blur30)"/>
    <g>${strands.join("")}</g>
    <path d="M 940 120 C 1080 520 1100 980 900 1400" fill="none" stroke="#ff5a00" stroke-width="3" opacity="0.55" filter="url(#blur5)"/>
    <path d="M 940 120 C 1080 520 1100 980 900 1400" fill="none" stroke="#ffb37c" stroke-width="0.9" opacity="0.5"/>
    <g clip-path="url(#hairClip)"></g>
    ${grain}
    ${vignette}
  `;
}

/* ---------------------------------------------------------------- atelier */
function atelierPlate(seed) {
  const rnd = rng(seed);
  const R = (a, b) => a + (b - a) * rnd();
  const hair = [];
  for (let i = 0; i < 650; i++) {
    const x0 = 600 + R(-175, 175);
    const pts = [];
    const len = R(220, 620);
    for (let j = 0; j <= 14; j++) {
      const t = j / 14;
      pts.push([x0 + Math.sin(t * 4 + x0 * 0.02) * 14 * t, 470 + len * t]);
    }
    const shine = i % 5 === 0;
    hair.push(
      `<path d="${smoothPath(pts)}" ${S(
        shine ? "#d79a62" : ["#170f0a", "#241610", "#2e1c12", "#3a2417"][i % 4],
        shine ? R(0.7, 1.8) : R(0.6, 2),
        shine ? R(0.14, 0.4) : R(0.3, 0.8),
      )}/>`,
    );
  }
  return `
    ${backdrop({ variant: "atelier", sweep: 20 })}
    <ellipse cx="580" cy="1050" rx="370" ry="70" fill="#000" opacity="0.6" filter="url(#blur30)"/>
    <g transform="translate(-20 0)">
      <ellipse cx="600" cy="1040" rx="300" ry="44" fill="#000" opacity="0.5" filter="url(#blur14)"/>
      <path d="M 430 1010 L 468 560 C 472 470 530 430 600 430 C 670 430 728 470 732 560 L 770 1010 Z" ${F("url(#wood)")}/>
      <path d="M 468 560 C 472 470 530 430 600 430 C 670 430 728 470 732 560" fill="none" stroke="#c08a56" stroke-width="2" opacity="0.4"/>
      <path d="M 430 1010 L 468 560" fill="none" stroke="#ff5a00" stroke-width="2.6" opacity="0.4" filter="url(#blur5)"/>
      <path d="M 600 430 L 600 500" stroke="#1a0f08" stroke-width="4" opacity="0.5"/>
      <ellipse cx="600" cy="452" rx="150" ry="42" fill="#120c08"/>
      <g>${hair.join("")}</g>
      <ellipse cx="560" cy="720" rx="120" ry="250" fill="url(#sheen)" opacity="0.35" filter="url(#blur30)"/>
      <g transform="rotate(-16 870 900)">
        <rect x="852" y="770" width="13" height="340" rx="6" fill="#d6cfc0"/>
        <circle cx="858" cy="758" r="10" fill="none" stroke="#efe8d9" stroke-width="2"/>
        <path d="M 865 1110 C 950 1150 960 1210 890 1250" fill="none" stroke="#f0d3ae" stroke-width="1.4" opacity="0.8"/>
      </g>
      <g transform="translate(1010 850)">
        <ellipse cx="0" cy="0" rx="52" ry="34" fill="#5a2a10" opacity="0.9"/>
        <ellipse cx="0" cy="-7" rx="52" ry="28" fill="#a83700" opacity="0.7"/>
        <ellipse cx="0" cy="0" rx="26" ry="14" fill="#160b05"/>
      </g>
      <path d="M 440 950 C 360 1080 350 1200 380 1320" fill="none" stroke="#ff7a2f" stroke-width="1.6" opacity="0.35" filter="url(#blur2)"/>
    </g>
    ${Array.from({ length: 46 }, () => {
      const x = R(280, 1080);
      const y = R(120, 940);
      return `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r2(R(0.5, 2))}" fill="#ffd2a3" opacity="${r2(R(0.05, 0.35))}"/>`;
    }).join("")}
    <rect width="${W}" height="${H}" fill="url(#keyHalo)" opacity="0.8"/>
    ${grain}
    ${vignette}
  `;
}

/* ---------------------------------------------------------------- profile */
function profilePlate(seed) {
  const rnd = rng(seed);
  const R = (a, b) => a + (b - a) * rnd();
  const strands = [];
  for (let i = 0; i < 800; i++) {
    const x0 = R(360, 900);
    const y0 = R(240, 520);
    const pts = [];
    const len = R(250, 760);
    const side = x0 < 620 ? -1 : 1;
    for (let j = 0; j <= 16; j++) {
      const t = j / 16;
      pts.push([
        x0 + side * t * R(10, 160) + Math.sin(t * 4 + x0 * 0.01) * 16 * t,
        y0 + len * t,
      ]);
    }
    const shine = rnd() > 0.62;
    strands.push(
      `<path d="${smoothPath(pts)}" ${S(
        shine ? ["#c98a52", "#ff9d5c", "#ffb37c"][i % 3] : ["#120c08", "#1d120c", "#2a1a11", "#3a2417"][i % 4],
        shine ? R(0.7, 2) : R(0.8, 2.8),
        shine ? R(0.12, 0.45) : R(0.3, 0.85),
      )}/>`,
    );
  }
  return `
    ${backdrop({ sweep: 30 })}
    <g transform="translate(70 0)">
      <path d="M 170 1500 C 190 1300 330 1200 500 1150 L 522 1040 C 470 1008 450 950 450 870 L 780 870 C 780 950 752 1010 700 1042 L 720 1150 C 850 1200 950 1290 990 1420 L 1000 1500 Z" ${F("url(#bust)")}/>
      <path d="M 500 330 C 660 320 770 410 782 570 C 792 700 752 790 700 860 L 500 860 C 448 800 432 690 438 560 C 444 440 478 350 500 330 Z" ${F("url(#laceSkin)")}/>
      <path d="M 760 450 C 812 540 812 680 770 780" fill="none" stroke="#ff7a2f" stroke-width="3.4" opacity="0.45" filter="url(#blur5)"/>
      <path d="M 780 570 C 810 480 806 410 780 350" fill="none" stroke="#ff5a00" stroke-width="2" opacity="0.3" filter="url(#blur5)"/>
      <g>${strands.join("")}</g>
      <path d="M 450 380 C 390 540 380 760 420 980" fill="none" stroke="#ff7a2f" stroke-width="2.2" opacity="0.3" filter="url(#blur5)"/>
      <path d="M 700 880 C 730 930 735 980 720 1020" fill="none" stroke="#ffb37c" stroke-width="1.2" opacity="0.25"/>
    </g>
    ${grain}
    ${vignette}
  `;
}

/* ------------------------------------------------------------- hero plate */
function heroPlate(seed) {
  return `
    ${backdrop({ sweep: 60 })}
    <g>
      <path d="M 120 ${H + 60} C 180 1300 350 1200 500 1150 L 520 1040 C 470 1008 452 956 452 892 L 748 892 C 748 956 730 1008 680 1040 L 700 1150 C 850 1200 1020 1300 1080 ${H + 60} Z" ${F("url(#bust)")}/>
      <path d="M 150 ${H + 60} C 210 1320 360 1215 500 1160" fill="none" stroke="#ff5a00" stroke-width="2.4" opacity="0.3" filter="url(#blur5)"/>
      <ellipse cx="600" cy="570" rx="196" ry="248" ${F("url(#bust)")}/>
    </g>
    <ellipse cx="650" cy="1400" rx="440" ry="110" fill="#000" opacity="0.6" filter="url(#blur30)"/>
    ${hairStudy({
      seed,
      style: "straight",
      length: 1120,
      spread: 210,
      widthBase: 27,
      sweep: 170,
      volume: 1.05,
      density: 160,
    }).svg}
    <rect width="${W}" height="${H}" fill="url(#keyHalo)" opacity="0.55"/>
    ${grain}
    ${vignette}
  `;
}

/* ---------------------------------------------------------------- plates */
const plates = {
  "hero-editorial": heroPlate(11),
  "product-straight": longHairPlate({
    seed: 21,
    style: "straight",
    length: 1040,
    spread: 130,
    widthBase: 25,
    density: 140,
  }),
  "product-wavy": longHairPlate({
    seed: 32,
    style: "wavy",
    length: 1000,
    spread: 290,
    widthBase: 27,
    sweep: 90,
    volume: 1.05,
    density: 140,
  }),
  "product-curly": longHairPlate({
    seed: 44,
    style: "curly",
    length: 900,
    spread: 300,
    widthBase: 25,
    sweep: 40,
    volume: 1.1,
    density: 120,
  }),
  "product-bob": bobPlate(57),
  "quality-lace": laceMacro(66),
  "extensions-bundles": bundlesPlate(77),
  "extensions-clipins": clipinsPlate(88),
  atelier: atelierPlate(99),
  "editorial-profile": profilePlate(101),
};

/* ---------------------------------------------------------------- output */
const requested = process.argv.slice(2);
const names = requested.length ? requested : Object.keys(plates);
await fs.mkdir("public/images", { recursive: true });
for (const name of names) {
  const body = plates[name];
  if (!body) {
    console.warn(`skip unknown plate: ${name}`);
    continue;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${defs()}
    ${body}
  </svg>`;
  const file = `public/images/${name}.jpg`;
  const info = await sharp(Buffer.from(svg), { density: 144 })
    .resize(W, H)
    .jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: "4:2:0" })
    .toFile(file);
  console.log(`${file}  ${(info.size / 1024).toFixed(0)}kb`);
}
console.log("done");
