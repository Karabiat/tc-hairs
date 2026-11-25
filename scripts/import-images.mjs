#!/usr/bin/env node
/**
 * Import your own hair photography into the site.
 *
 * Drop images into ./assets/incoming (or pass --dir "C:\path\to\photos")
 * and run:
 *
 *   npm run images:import
 *   npm run images:import -- --dir "C:\Users\you\Downloads\shoot" --dry-run
 *
 * Files are matched to a slot by filename, resized/cropped to 1200×1500
 * (4:5, the ratio used across the site) and written to public/images/.
 * Existing files are replaced. No image is invented — this script only
 * optimises and files what you give it.
 */
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "images");
const DEFAULT_IN = path.join(ROOT, "assets", "incoming");
const WIDTH = 1200;
const HEIGHT = 1500;
const QUALITY = 88;

/** Every visual surface on the site, with friendly filename aliases. */
const SLOTS = [
  {
    key: "hero-editorial",
    label: "Homepage hero / social share",
    aliases: ["hero", "hero-shot", "editorial", "cover", "campaign"],
  },
  {
    key: "product-straight",
    label: "Straight wig — Midnight Silk",
    aliases: ["straight", "silk", "midnight-silk", "straight-wig"],
  },
  {
    key: "product-wavy",
    label: "Wavy wig — Sienna Wave",
    aliases: ["wavy", "wave", "sienna", "sienna-wave", "wavy-wig", "body-wave"],
  },
  {
    key: "product-curly",
    label: "Curly wig — Onyx Curl",
    aliases: ["curly", "curl", "onyx", "onyx-curl", "curly-wig", "coils"],
  },
  {
    key: "product-bob",
    label: "Bob wig — Noir Bob",
    aliases: ["bob", "noir", "noir-bob", "bob-wig", "short"],
  },
  {
    key: "quality-lace",
    label: "Quality macro — HD lace / knots",
    aliases: ["lace", "hd-lace", "quality", "knots", "macro", "closeup"],
  },
  {
    key: "extensions-bundles",
    label: "Extensions — bundles / wefts",
    aliases: ["bundles", "bundle", "atelier-bundle", "wefts", "weft"],
  },
  {
    key: "extensions-clipins",
    label: "Extensions — clip-ins / tape-ins",
    aliases: ["clipins", "clip-ins", "seamless-clip-ins", "tape", "tape-ins", "invisible-tape-ins"],
  },
  {
    key: "atelier",
    label: "Brand story — atelier / styling",
    aliases: ["atelier", "studio", "story", "styling", "behind-the-scenes", "bts"],
  },
  {
    key: "editorial-profile",
    label: "Editorial portrait — profile",
    aliases: ["profile", "portrait", "editorial-profile", "side-profile", "model"],
  },
  {
    key: "story-craft",
    label: "Story chapter 01 — the atelier",
    aliases: ["story-craft", "craft", "bench", "making", "atelier-craft"],
  },
  {
    key: "story-source",
    label: "Story chapter 02 — the source",
    aliases: ["story-source", "source", "donor", "raw-hair", "hair-source"],
  },
  {
    key: "story-fit",
    label: "Story chapter 03 — the fitting",
    aliases: ["story-fit", "fit", "fitting", "measured"],
  },
];

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff", ".heic"]);

function parseArgs(argv) {
  const args = { dir: null, dryRun: false, map: null, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dir" || arg === "-d") args.dir = argv[i + 1];
    else if (arg === "--map" || arg === "-m") args.map = argv[i + 1];
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
    if (arg === "--dir" || arg === "-d" || arg === "--map" || arg === "-m") i += 1;
  }
  return args;
}

const normalise = (value) =>
  value
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function matchSlot(filename) {
  const name = normalise(filename);
  const exact = SLOTS.find(
    (slot) => slot.key === name || slot.aliases.includes(name) || `product-${name}` === slot.key,
  );
  if (exact) return { slot: exact, confidence: "exact" };

  // Forgiving contains-match (e.g. "TC-hero-01.jpg", "IMG-straight-front.png").
  const fuzzy = SLOTS.filter((slot) => {
    const names = [slot.key, ...slot.aliases];
    return names.some((token) => name.includes(token));
  });
  if (fuzzy.length === 1) return { slot: fuzzy[0], confidence: "fuzzy" };
  return null;
}

function printHelp() {
  console.log(`
T&C Hairs — image importer

Usage:
  npm run images:import
  npm run images:import -- --dir "C:\\path\\to\\photos" --dry-run
  npm run images:import -- --map ./assets/mapping.json

Options:
  --dir, -d    Folder containing your photos (default: assets/incoming)
  --map, -m    JSON map of { "slot-name": "filename.jpg" }
  --dry-run    Show matches without writing anything
  --help, -h   Show this message

Slots (use these names, or drop files named after them):
${SLOTS.map((s) => `  ${s.key.padEnd(20)} ${s.label}`).join("\n")}

Output: public/images/<slot>.jpg — 1200×1500, optimised JPEG.
`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) return printHelp();

  const inputDir = path.resolve(args.dir ? path.resolve(ROOT, args.dir) : DEFAULT_IN);
  await fs.mkdir(inputDir, { recursive: true });
  await fs.mkdir(OUT_DIR, { recursive: true });

  let entries;
  try {
    entries = await fs.readdir(inputDir, { withFileTypes: true });
  } catch (error) {
    console.error(`Could not read ${inputDir}: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  const files = entries
    .filter((entry) => entry.isFile() && IMAGE_EXT.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort();

  if (!files.length) {
    console.log(`\nNo images found in ${path.relative(ROOT, inputDir)}.`);
    console.log("Drop JPG/PNG/WebP files there (named hero.jpg, midnight-silk.jpg, …) and run again.");
    console.log("Run with --help to see every slot.\n");
    return;
  }

  let explicitMap = null;
  if (args.map) {
    const mapPath = path.resolve(ROOT, args.map);
    explicitMap = JSON.parse(await fs.readFile(mapPath, "utf8"));
  }

  const assignments = new Map(); // slot.key -> { file, confidence }
  const used = new Set();
  const unmatched = [];

  if (explicitMap) {
    for (const slot of SLOTS) {
      const value = explicitMap[slot.key];
      if (!value) continue;
      const filename = Array.isArray(value) ? value[0] : value;
      if (!files.includes(filename)) {
        console.warn(`! ${slot.key}: "${filename}" not found in ${path.relative(ROOT, inputDir)}`);
        continue;
      }
      assignments.set(slot.key, { file: filename, confidence: "mapped" });
      used.add(filename);
    }
  }

  for (const file of files) {
    if (used.has(file)) continue;
    const match = matchSlot(file);
    if (!match) {
      unmatched.push(file);
      continue;
    }
    if (assignments.has(match.slot.key)) {
      const existing = assignments.get(match.slot.key);
      console.warn(
        `! "${file}" also matches ${match.slot.key}, which is already using "${existing.file}". Skipping.`,
      );
      unmatched.push(file);
      continue;
    }
    assignments.set(match.slot.key, { file, confidence: match.confidence });
    used.add(file);
  }

  console.log(`\nImporting from ${path.relative(ROOT, inputDir)}`);
  console.log(`${files.length} image${files.length === 1 ? "" : "s"} found, ${assignments.size} slot(s) matched.\n`);

  for (const slot of SLOTS) {
    const assignment = assignments.get(slot.key);
    const output = path.join(OUT_DIR, `${slot.key}.jpg`);
    if (!assignment) {
      console.log(`  —  ${slot.key.padEnd(20)} (no image supplied — keeping current placeholder)`);
      continue;
    }
    const from = path.join(inputDir, assignment.file);
    const marker = assignment.confidence === "fuzzy" ? "~" : "✓";
    console.log(`  ${marker}  ${slot.key.padEnd(20)} ← ${assignment.file}`);
    if (args.dryRun) continue;

    try {
      const image = sharp(from, { failOn: "none" }).rotate();
      const meta = await image.metadata();
      if ((meta.width ?? 0) < 600 || (meta.height ?? 0) < 600) {
        console.warn(`     ! source is only ${meta.width}×${meta.height}px — may look soft on large screens.`);
      }
      await image
        .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre", withoutEnlargement: false })
        .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
        .toFile(output);
    } catch (error) {
      console.error(`     ✗ failed: ${error.message}`);
      process.exitCode = 1;
    }
  }

  if (unmatched.length) {
    console.log("\nUnmatched files (renamed and re-run, or use --map):");
    for (const file of unmatched) console.log(`  ?  ${file}`);
    console.log(
      '\nExample mapping file:\n  { "product-curly": "IMG_4021.jpg", "hero-editorial": "IMG_3990.jpg" }',
    );
  }

  if (args.dryRun) {
    console.log("\nDry run — nothing written.\n");
  } else {
    console.log("\nDone. Restart `npm run dev` if the dev server does not pick the new files up.\n");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
