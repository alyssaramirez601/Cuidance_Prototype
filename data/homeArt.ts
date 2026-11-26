// Artwork slots for Home v2 (Nov 25, 2026). This file is the only place Home's artwork is chosen.
// Each slot has a fixed shape (the final file's pixel size) so layouts never depend on what a
// picture contains, and every slot takes a light and a dark file.
//
// The seven compositions are approved as concepts (docs/design-system/home-assets.md). The final,
// production files are still being prepared, so slots below either point at TEMPORARY library art
// or are null, in which case Home draws simple TEMPORARY shapes in code. To integrate a final file:
// add it to assets/home/ and point its slot here. Nothing else changes.

import type { QuizSection } from '@/data/quiz';
import { profileArt } from '@/data/profileCopy';

export type ModeArt = { light: number; dark: number };

// Width / height of each final file, used as each slot's aspect ratio
export const homeArtRatio = {
  header: 288 / 288,
  feature: 288 / 330,
  care: 240 / 276,
  partner: 432 / 432,
} as const;

// Final: assets/home/header-accent-{light,dark}.png. null until approved files arrive
export const headerArt: ModeArt | null = null;

// Final: assets/home/partner-accent-{light,dark}.png. null until approved files arrive
export const partnerArt: ModeArt | null = null;

// TEMPORARY: the care-area arches from the art library (light palette, transparent outside the arch).
// Final: assets/home/care-{hair,skin,makeup,body}-{light,dark}.png
const careInterim = (area: keyof typeof profileArt.areas): ModeArt => ({ light: profileArt.areas[area], dark: profileArt.areas[area] });

// Keyed by the department id in data/categories.ts, which never changes for art
export const careArt: Record<string, ModeArt> = {
  hair: careInterim('hair'),
  skin: careInterim('skin'),
  makeup: careInterim('makeup'),
  body: careInterim('body'),
};

// TEMPORARY: the feature card shows the care-area arch of the result's first care area, or code shapes.
// Final: assets/home/feature-general-{light,dark}.png (the dark version is not approved yet)
export function featureArt(area: QuizSection | null): ModeArt | null {
  if (area === 'skin' || area === 'hair' || area === 'makeup' || area === 'body') return careInterim(area);
  return null;
}

// The four care areas Home shows, in the approved order. Ids from data/categories.ts
export const homeCareDepartments = ['hair', 'skin', 'makeup', 'body'] as const;
