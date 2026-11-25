# Drop your hair photography here

Put your own JPG / PNG / WebP / AVIF images in this folder, then run:

```bash
npm run images:import
```

The importer crops each image to 4:5 (1200 × 1500), optimises it, and writes it to
`public/images/` under a fixed slot name. Nothing is generated — only your files are used.

## Easiest approach: name the files after the slots

| File name                 | Where it appears                                |
| ------------------------- | ----------------------------------------------- |
| `hero-editorial.jpg`      | Homepage campaign image / social share          |
| `product-straight.jpg`    | Midnight Silk straight wig                      |
| `product-wavy.jpg`        | Sienna Wave wavy wig                            |
| `product-curly.jpg`       | Onyx Curl curly wig                             |
| `product-bob.jpg`         | Noir Bob                                        |
| `quality-lace.jpg`        | Hairline study (HD lace, knots, hairline)       |
| `extensions-bundles.jpg`  | Atelier Bundle / Coil Bundle Trio               |
| `extensions-clipins.jpg`  | Seamless Clip-Ins                               |
| `extensions-tapeins.jpg`  | Invisible Tape-Ins                              |
| `story-craft.jpg`         | Story chapter 01 — the atelier                  |
| `story-source.jpg`        | Story chapter 02 — the source                   |
| `story-fit.jpg`           | Story chapter 03 — the fitting                  |
| `atelier.jpg`             | Brand story, menu preview, product gallery      |
| `editorial-profile.jpg`   | Editorial profile / testimonial portrait        |

Any common photo name also works: `midnight-silk.jpg`, `onyx-curl.jpg`,
`clip-ins.jpg`, `lace.jpg`, `portrait.jpg`, `bundles.jpg`, `bob.jpg`, and so on.

## Explicit mapping

If your camera names are unhelpful (`IMG_4021.jpg`), create a JSON file using
`assets/mapping.example.json` as a template and run:

```bash
npm run images:import -- --map ./assets/mapping.json
```

## Preview first

```bash
npm run images:import -- --dry-run
```

This prints the match table without touching `public/images/`.

## Shot guidance

- **Hero:** portrait crop, model or mannequin centred, dark background, space at the
  bottom for the oversized `HAIRS.` wordmark.
- **Products:** one subject per frame, shoulders-up or full wig silhouette, consistent
  lighting across the four wigs. 4:5 crop.
- **Lace study:** the hairline/frontal in sharp focus; this panel is displayed large.
- **Extensions:** bundles or wefts laid flat, overhead or 3/4 angle.
- **Story chapters:** three frames — the bench, the raw hair, the fitting. They
  crossfade as the pinned story scrolls.
- **Atelier / profile:** hands, tools, mirrors, movement. Dark and warm reads best.

Minimum useful size is 1600 × 2000 px; 2400 × 3000 px is ideal. The importer will
upscale but cannot add detail.
