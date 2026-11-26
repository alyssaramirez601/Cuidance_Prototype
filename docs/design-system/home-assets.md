# Home v2 artwork manifest

Home v2 "Editorial Care" (Nov 25, 2026). Every picture on Home sits in its own slot, separate from the live text, so a final file can replace a temporary one without touching any layout. Slots are wired in `data/homeArt.ts`; swap a slot there.

## Status (Nov 25, 2026, Checkpoint 3)

- All seven compositions are **approved as concepts** (Alyssa's "Cuidance Home v2 Approved Visuals" package): header accent, feature general (light only), four care tiles, partner accent.
- The package's PNGs are **opaque, resized reference renders**, not production files. They were tested in each slot locally and fit the slot sizes, but they are **not committed**.
- **Blockers before integration:**
  1. Header, feature and partner slots need **transparent** finals. The references' cream or green backgrounds show as visible squares on the page, the feature card and the partner band.
  2. **Feature general dark** has not been approved yet.
  3. Colors in the renders are generated approximations; finals should be rebuilt on the approved palette.
- **Care tiles are the exception:** their art fills its frame edge to edge, so an opaque file works there. The approved references could go in as-is once the team agrees they are final.
- **Header and feature slots are empty on purpose** (Alyssa, Nov 25): the temporary shapes were removed, and no stand-in is shown until the transparent finals arrive.
- To integrate a final file: add it to `assets/home/` under the name below and point its slot in `data/homeArt.ts`. No layout changes are needed.

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
| `header-accent-light.png`, `header-accent-dark.png` | 288 x 288 | Transparent | Flowing cut-paper shapes. Shown 120 x 120 beside the greeting (away from the bell and profile buttons), with the screen's right edge cropping its right 24 px. Fill the canvas: shapes drawn in only one corner will look very small here | Concept approved, final needed | None: the slot is empty until the final file arrives |
| `feature-general-light.png`, `feature-general-dark.png` | 288 x 330 | Transparent | Still life for the guidance feature card, works for any care area. Shown up to 144 wide in the card's bottom-right corner, running to its edges | Light concept approved, dark not yet; finals needed | None: the slot is empty until the final file arrives (no opaque background, it sits on the green card) |
| `care-hair-light.png`, `care-hair-dark.png` | 240 x 276 | Fills the frame (opaque is fine) | Hair textures, waves or a comb | Concept approved, final needed | `assets/art-library/area-hair.png` |
| `care-skin-light.png`, `care-skin-dark.png` | 240 x 276 | Fills the frame (opaque is fine) | Cream texture or gentle skincare shapes, no jar-and-leaf repeat | Concept approved, final needed | `assets/art-library/area-skin.png` |
| `care-makeup-light.png`, `care-makeup-dark.png` | 240 x 276 | Fills the frame (opaque is fine) | Compact or swatches across deep to light tones | Concept approved, final needed | `assets/art-library/area-makeup.png` |
| `care-body-light.png`, `care-body-dark.png` | 240 x 276 | Fills the frame (opaque is fine) | Folded linen or body-care objects | Concept approved, final needed | `assets/art-library/area-body.png` |
| `partner-accent-light.png`, `partner-accent-dark.png` | 432 x 432 | Transparent | Commercial still life, clearly different from guidance art. Shown at 72 x 72 beside the Partner Highlights title | Concept approved, final needed | A circle and arch drawn in code (`partnerSun`, `partnerArch` in `app/(tabs)/home.tsx`) |

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
