# Home v2 artwork manifest

Home v2 "Editorial Care" (Nov 25, 2026). Every picture on Home sits in its own slot, separate from the live text, so a final file can replace a temporary one without touching any layout. Slots are wired in `data/homeArt.ts`; swap a slot there.

## Rules for every file

- Flat screen-print, cut-paper style, matching the brand elements sheet (v03). No outlines, no gradients.
- No text, letters or numbers in the image.
- Light and dark versions at the same pixel size, so switching modes never moves the layout.
- Skin, where it appears, shows very deep to very light tones. Light skin is never the default.
- No people or portraits on Home (non-figurative decision, Week 11).
- PNG. Sizes below are 3x for a 390 px wide screen.

## Required files (14)

| File in `assets/home/` | Size (px) | Background | What it shows | Status | Temporary stand-in |
| --- | --- | --- | --- | --- | --- |
| `header-accent-light.png`, `header-accent-dark.png` | 288 x 288 | Transparent | Small cut-paper cluster: sun, arch, one complementary shape. No products | Missing | Shapes drawn in code (`HeaderAccent` in `components/HomeHeader.tsx`) |
| `feature-general-light.png`, `feature-general-dark.png` | 288 x 330 | Transparent | Still life for the guidance feature card, works for any care area | Missing | The result's care-area arch from `assets/art-library/area-*.png`, or shapes drawn in code when there is no result |
| `care-hair-light.png`, `care-hair-dark.png` | 240 x 276 | Transparent, arch-topped | Hair textures, waves or a comb | Missing | `assets/art-library/area-hair.png` |
| `care-skin-light.png`, `care-skin-dark.png` | 240 x 276 | Transparent, arch-topped | Cream texture or gentle skincare shapes, no jar-and-leaf repeat | Missing | `assets/art-library/area-skin.png` |
| `care-makeup-light.png`, `care-makeup-dark.png` | 240 x 276 | Transparent, arch-topped | Compact or swatches across deep to light tones | Missing | `assets/art-library/area-makeup.png` |
| `care-body-light.png`, `care-body-dark.png` | 240 x 276 | Transparent, arch-topped | Folded linen or body-care objects | Missing | `assets/art-library/area-body.png` |
| `partner-accent-light.png`, `partner-accent-dark.png` | 432 x 432 | Transparent | Commercial still life, clearly different from guidance art | Missing | One circle drawn in code (`partnerShape` in `app/(tabs)/home.tsx`) |

## Later (nice to have)

| File | Size (px) | Notes |
| --- | --- | --- |
| `feature-{hair,skin,makeup,body}-{light,dark}.png` | 288 x 330 | Feature art matched to the result's first care area |
| `empty-continue-{light,dark}.png`, `error-{light,dark}.png` | 432 x 324 | Optional art for empty and error states |
| Dark versions of the 6 `article-*.webp` covers | Same as originals | Until then they sit in `ArtFrame` on dark pages |

## Already in use, no change needed

- `assets/logo/logo-horizontal-green.png` (light) and `logo-horizontal-light.png` (dark): header logo, 160 px wide.
- `assets/art-library/article-*.webp`: guide covers, framed by `ArtFrame`.
- Product art from `lib/explore.ts` (`productImage`): For you cards.
- `data/partnerContent.ts` images: partner cards.
