#!/usr/bin/env node
/**
 * Build the site's canonical image slots from the sourced photography in
 * assets/incoming/web/.
 *
 * The raw photos come from very different shoots (studio, shop, daylight), so
 * each one is cropped for its slot and then pushed through the same grade:
 * desaturated, slightly darkened, contrast-lifted and warmed toward the
 * site's #FF5A00 / bone palette. That is what makes a set of stock photos
 * read as one campaign.
 *
 *   npm run images:grade
 *
 * Output: public/images/<slot>.jpg — 1200×1500 (4:5), progressive JPEG.
 *
 * `extract` values are fractions of the source (0–1): x, y, w, h. They are
 * applied before the cover-resize, so they act as an art-direction crop.
 */
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "assets", "incoming", "web");
const OUT = path.join(ROOT, "public", "images");
const W = 1200;
const H = 1500;

/**
 * Per-slot art direction.
 * - extract: fractional crop of the source before the 4:5 cover resize
 * - position: cover anchor when no extract is given
 * - grade: saturation / brightness / contrast / warmth multipliers
 * - mono: neutral black & white (keeps the recomb tint off)
 */
const SLOTS = [
  {
    slot: "hero-editorial",
    src: "hero-editorial--34154663.jpg",
    // Terracotta studio portrait. Tighten slightly so the subject holds the frame.
    extract: { x: 0.05, y: 0.02, w: 0.9, h: 0.9 },
    grade: { saturation: 0.82, brightness: 0.9, contrast: 1.07, warmth: 1.02 },
  },
  {
    slot: "product-straight",
    src: "product-straight--17320162.jpg",
    // Hair-first mannequin crop: the face is almost entirely veiled by the wig.
    position: "north",
    grade: { saturation: 0.55, brightness: 0.74, contrast: 1.14, warmth: 1.08 },
  },
  {
    slot: "product-wavy",
    src: "product-wavy--14730872.jpg",
    // Blonde waves on pink. Trim the pink headroom, desaturate hard, warm to honey.
    extract: { x: 0, y: 0.14, w: 1, h: 0.835 },
    grade: { saturation: 0.42, brightness: 0.82, contrast: 1.07, warmth: 1.14 },
  },
  {
    slot: "product-curly",
    src: "product-curly--6923447.jpg",
    // Studio portrait in a black curl wig. Crop to the curls, hands and face so
    // the pastel blouse stops competing with the hair.
    extract: { x: 0.04, y: 0.03, w: 0.92, h: 0.5 },
    grade: { saturation: 0.28, brightness: 0.78, contrast: 1.1, warmth: 1.12 },
  },
  {
    slot: "product-bob",
    src: "product-bob--17135759.jpg",
    // Head-and-shoulders crop so the shirt's competitor logo is out of frame.
    extract: { x: 0.17, y: 0.02, w: 0.66, h: 0.66 },
    grade: { saturation: 0.78, brightness: 0.86, contrast: 1.08, warmth: 1.04 },
  },
  {
    slot: "extensions-bundles",
    src: "extensions-bundles--14730868.jpg",
    // Two tied bundles in a box. Crop away the empty pink headroom so the
    // bindings sit near the top of the frame.
    extract: { x: 0.05, y: 0.26, w: 0.9, h: 0.75 },
    grade: { saturation: 0.4, brightness: 0.82, contrast: 1.08, warmth: 1.18 },
  },
  {
    slot: "extensions-clipins",
    src: "extensions-clipins--18614263.jpg",
    // Mannequin hand holding a blonde hairpiece — sculptural and unbranded.
    position: "centre",
    grade: { saturation: 0.55, brightness: 0.84, contrast: 1.07, warmth: 1.12 },
  },
  {
    slot: "extensions-tapeins",
    src: "extensions-tapeins--14730864.jpg",
    // Flat-lay of wefts, keratin bonds and pliers.
    position: "centre",
    grade: { saturation: 0.55, brightness: 0.76, contrast: 1.1, warmth: 1.1 },
  },
  {
    slot: "quality-lace",
    src: "quality-lace--17362828.jpg",
    // Lace-front wig with the transparent mesh visible across the hairline.
    // Crop tight to the hairline so the busy salon background falls away.
    extract: { x: 0.18, y: 0.1, w: 0.64, h: 0.64 },
    grade: { saturation: 0.18, brightness: 0.8, contrast: 1.12, warmth: 1.2 },
  },
  {
    slot: "editorial-profile",
    src: "editorial-profile--5980902.jpg",
    // Already a studio B&W — just add contrast and a touch of grain-friendly lift.
    position: "centre",
    grade: { saturation: 0, brightness: 0.94, contrast: 1.14, warmth: 1 },
    mono: true,
  },
  {
    slot: "atelier",
    src: "atelier--17652444.jpg",
    // The wig wall — a full cast of crowns.
    position: "centre",
    grade: { saturation: 0.7, brightness: 0.86, contrast: 1.08, warmth: 1.04 },
  },
  {
    slot: "story-craft",
    src: "story-craft--15868319.jpg",
    // Wig shop / atelier, bundles on the wall. The orange dress is a happy accident.
    position: "centre",
    grade: { saturation: 0.86, brightness: 0.84, contrast: 1.06, warmth: 1.02 },
  },
  {
    slot: "story-source",
    src: "story-source--10224830.jpg",
    // 2:1 daylight landscape. Slice the centre to a 4:5 portrait of the hair.
    extract: { x: 0.3, y: 0, w: 0.4, h: 1 },
    grade: { saturation: 0.72, brightness: 0.8, contrast: 1.08, warmth: 1.05 },
  },
  {
    slot: "story-fit",
    src: "story-fit--11725269.jpg",
    // Copper bob in profile — the "measured to your crown" chapter.
    position: "centre",
    grade: { saturation: 0.72, brightness: 0.88, contrast: 1.07, warmth: 1.04 },
  },
];

/**
 * Warm/desaturate matrix. Slight red lift, blue pull — keeps skin believable
 * while pulling pastel studio backdrops toward bone.
 */
const warmMatrix = (warmth) => [
  [1 + 0.04 * warmth, 0.015, 0],
  [0.008, 1, 0],
  [0, 0.004, 1 - 0.08 * warmth],
];

function toExtractRegion(meta, frac) {
  const width = Math.round(meta.width * frac.w);
  const height = Math.round(meta.height * frac.h);
  const left = Math.min(meta.width - width, Math.round(meta.width * frac.x));
  const top = Math.min(meta.height - height, Math.round(meta.height * frac.y));
  return { left, top, width, height };
}

async function run() {
  await fs.mkdir(OUT, { recursive: true });
  const report = [];

  for (const config of SLOTS) {
    const from = path.join(SRC, config.src);
    const to = path.join(OUT, `${config.slot}.jpg`);
    const g = { saturation: 1, brightness: 1, contrast: 1, warmth: 1, ...config.grade };

    try {
      const base = sharp(from, { failOn: "none" }).rotate();
      const meta = await base.metadata();
      let pipeline = sharp(from, { failOn: "none" }).rotate();

      if (config.extract) {
        pipeline = pipeline.extract(toExtractRegion(meta, config.extract));
      }

      pipeline = pipeline
        .resize(W, H, {
          fit: "cover",
          position: config.position ?? "centre",
          withoutEnlargement: false,
        })
        .modulate({ saturation: g.saturation, brightness: g.brightness })
        .linear(g.contrast, -(128 * g.contrast - 128) - 6);

      if (config.mono) {
        pipeline = pipeline.grayscale();
      } else {
        pipeline = pipeline.recomb(warmMatrix(g.warmth));
      }

      await pipeline
        .sharpen({ sigma: 0.6 })
        .jpeg({ quality: 86, mozjpeg: true, progressive: true, chromaSubsampling: "4:4:4" })
        .toFile(to);

      const out = await fs.stat(to);
      report.push(`  ✓ ${config.slot.padEnd(20)} ← ${config.src}  (${Math.round(out.size / 1024)} KB)`);
    } catch (error) {
      report.push(`  ✗ ${config.slot.padEnd(20)} ${error.message}`);
      process.exitCode = 1;
    }
  }

  console.log(`\nGraded ${SLOTS.length} slots into public/images/\n`);
  console.log(report.join("\n"));
  console.log("");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
