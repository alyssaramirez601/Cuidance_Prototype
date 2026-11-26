# Home v2 artwork manifest

Home v2 "Editorial Care" (Nov 25, 2026). Every picture on Home sits in its own slot, separate from the live text, so a final file can replace a temporary one without touching any layout. Slots are wired in `data/homeArt.ts`; swap a slot there.

## Status (Nov 25, 2026, Checkpoint 4): approved and integrated

All required artwork is in `assets/home/` and wired up in `data/homeArt.ts`. Each file was checked for size, real transparency and edge quality on its actual app surface in light and dark mode, and approved by Alyssa after the in-app test.

| File | Slot | Notes |
| --- | --- | --- |
| `header-accent-light.png`, `header-accent-dark.png` | Header, beside the greeting (120 x 120, right 24 px cropped by the screen edge) | Repaired raster cutouts with a curved top. Hidden for first names with a word over 11 letters |
| `feature-general.png` | Feature card, bottom-right corner, cropped by the card | One file for both modes (both card colors are deep green and it was tested on both). Trimmed so the art meets the slot's right and bottom edges; artwork pixels unchanged. A separate dark version can be added later |
| `care-{hair,skin,makeup,body}-{light,dark}.png` | Care tiles (240 x 276 frame) | Known minor issue: faint marks at the left edge of `care-hair-dark.png` |
| `partner-accent-light.png`, `partner-accent-dark.png` | Beside the Partner Highlights title (72 x 72) | Light file has a slightly ragged lower edge, not noticeable at 72 px |

These are raster cutouts, not layered source files. Keep the original sources for future edits.

## Rules for every file

- Flat screen-print, cut-paper style, matching the brand elements sheet (v03). No outlines, no gradients.
- No text, letters or numbers in the image.
- Light and dark versions at the same pixel size, so switching modes never moves the layout.
- Skin, where it appears, shows very deep to very light tones. Light skin is never the default.
- No people or portraits on Home (non-figurative decision, Week 11).
- PNG. Sizes below are 3x for a 390 px wide screen.

## Original file brief (14 files)

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
