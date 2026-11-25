# T&C Hairs

Editorial ecommerce site for **T&C Hairs** — hand-finished HD lace wigs and
cuticle-aligned hair extensions, made in London.

Live design direction: soft rose-clay palette, Cormorant Garamond display type,
real campaign photography, and a gentle scroll-driven story.

## Stack

- Next.js 15 (App Router, static export-friendly)
- TypeScript, Tailwind CSS
- Framer Motion for reveals and overlays, GSAP ScrollTrigger for pinned sections
- Lenis smooth scroll
- React Context cart persisted to `localStorage`

## Getting started

```bash
npm install
npm run dev            # http://localhost:3000
npm run dev -- -p 3001 # if 3000 is taken
```

```bash
npm run build
npm run start -- -p 3210
npm run typecheck
```

Scripts call the local Next/TypeScript binaries directly, because the `&` in a
`T&C Hairs` folder path breaks npm's Windows shims.

## What's inside

| Route | Contents |
| --- | --- |
| `/` | Hero, pinned three-chapter story, quality study, filterable collection with pinned horizontal gallery, extensions configurator, testimonials, signup CTA |
| `/product/[slug]` | Product gallery, colour/length selection, details accordion, related pieces |
| `/checkout` | Contact → shipping → payment (demo), promo code, order confirmation |
| `/does-not-exist` | Styled 404 |

Features include a cart drawer with free-shipping progress, search overlay,
full-screen menu, keyboard/focus handling, reduced-motion support and
JSON-LD `Organization` / `Product` structured data.

### Demo behaviour

- Payment is **demo only** — no card details are collected or sent anywhere.
- Promo code `CROWN10` applies 10% off.
- Free express shipping over $300.

## Photography

All imagery is sourced from [Pexels](https://www.pexels.com) under the Pexels
license (free commercial use, no attribution required). Per-image IDs and the
grading pipeline are documented in
[`public/images/CREDITS.md`](public/images/CREDITS.md).

To swap in a real shoot:

```bash
npm run images:import   # drop files in assets/incoming, then re-run
npm run images:grade    # crops, colour grades and recompresses into public/images
```

## Structure

```
src/app          routes, layout, metadata, globals.css
src/components   sections, layout chrome, product, checkout, ui primitives
src/lib          products, cart, hooks, gsap setup
scripts          image import/grading, QA screenshots, GLB optimiser
public/images    graded campaign photography
shots            QA screenshots (git-ignored)
```

`src/components/three` holds the original real-time wig experiment. It is no
longer rendered by any route; remove it (and the `three` / `@react-three/*`
dependencies) if you want a leaner bundle.
