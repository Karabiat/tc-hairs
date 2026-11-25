# Image credits

All photography currently in `public/images/` is sourced from
[Pexels](https://www.pexels.com) and used under the
[Pexels license](https://www.pexels.com/license/): free to use, including
commercially, with no attribution required. The license does not permit
selling unaltered copies of the photos, or implying that the photographers
endorse T&C Hairs.

Each source image has been cropped, colour-graded and recompressed for the
site by `scripts/grade-web-images.mjs`. Replace any slot with your own
shoot via `npm run images:import` — see `scripts/import-images.mjs` for the
full slot list.

| Slot | Pexels ID | Source |
| --- | --- | --- |
| `hero-editorial` | 34154663 | https://www.pexels.com/photo/34154663/ |
| `product-straight` | 17320162 | https://www.pexels.com/photo/17320162/ |
| `product-wavy` | 14730872 | https://www.pexels.com/photo/14730872/ |
| `product-curly` | 6923447 | https://www.pexels.com/photo/6923447/ |
| `product-bob` | 17135759 | https://www.pexels.com/photo/17135759/ |
| `extensions-bundles` | 14730868 | https://www.pexels.com/photo/14730868/ |
| `extensions-clipins` | 18614263 | https://www.pexels.com/photo/18614263/ |
| `extensions-tapeins` | 14730864 | https://www.pexels.com/photo/14730864/ |
| `quality-lace` | 17362828 | https://www.pexels.com/photo/17362828/ |
| `editorial-profile` | 5980902 | https://www.pexels.com/photo/5980902/ |
| `atelier` | 17652444 | https://www.pexels.com/photo/17652444/ |
| `story-craft` | 15868319 | https://www.pexels.com/photo/15868319/ |
| `story-source` | 10224830 | https://www.pexels.com/photo/10224830/ |
| `story-fit` | 11725269 | https://www.pexels.com/photo/11725269/ |

## Rebuilding the slots

```bash
npm run images:grade
```

Originals live in `assets/incoming/web/` as `<slot>--<pexels-id>.jpg`.
The per-slot crop and grade are defined in `scripts/grade-web-images.mjs`.
