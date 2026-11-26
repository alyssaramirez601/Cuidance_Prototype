// Artwork slots for Home v2 (Nov 25, 2026). Each slot names the final file it is waiting for in
// assets/home/ (see docs/design-system/home-assets.md). Until a final file is approved, the slot
// points at an existing library illustration, marked TEMPORARY, or Home draws simple shapes in code.
// Swap a slot by changing only this file; layouts never depend on the picture's contents.

import type { QuizSection } from '@/data/quiz';
import { profileArt } from '@/data/profileCopy';

type ModeArt = { light: number; dark: number };

// TEMPORARY: the care-area arches from the art library (light palette, transparent outside the arch,
// so they read as framed prints in dark mode too). Final: assets/home/care-{area}-{light,dark}.png
const careInterim = (area: keyof typeof profileArt.areas): ModeArt => ({ light: profileArt.areas[area], dark: profileArt.areas[area] });

// Keyed by the department id in data/categories.ts, which never changes for art
export const careArt: Record<string, ModeArt> = {
  hair: careInterim('hair'),
  skin: careInterim('skin'),
  makeup: careInterim('makeup'),
  body: careInterim('body'),
};

// TEMPORARY: the feature card shows the care-area arch of the result's first care area.
// Final: assets/home/feature-general-{light,dark}.png, later feature-{area}-{light,dark}.png.
// null means no picture fits yet, and the card draws its code shapes instead
export function featureArt(area: QuizSection | null): ModeArt | null {
  if (area === 'skin' || area === 'hair' || area === 'makeup' || area === 'body') return careInterim(area);
  return null;
}

// The four care areas Home shows, in the approved order. Ids from data/categories.ts
export const homeCareDepartments = ['hair', 'skin', 'makeup', 'body'] as const;
