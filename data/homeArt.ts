// Artwork slots for Home v2 (Nov 25, 2026). This file is the only place Home's artwork is chosen.
// Each slot has a fixed shape (the final file's pixel size) so layouts never depend on what a
// picture contains, and every slot takes a light and a dark file.
//
// Approved artwork (Alyssa, Nov 25, 2026): all seven compositions live in assets/home/, listed in
// docs/design-system/home-assets.md. To replace a file, add it to assets/home/ and point its slot
// here. Nothing else changes.

import type { QuizSection } from '@/data/quiz';

export type ModeArt = { light: number; dark: number };

// Width / height of each final file, used as each slot's aspect ratio
export const homeArtRatio = {
  header: 288 / 288,
  feature: 288 / 330,
  care: 240 / 276,
  partner: 432 / 432,
} as const;

export const headerArt: ModeArt | null = { light: require('@/assets/home/header-accent-light.png'), dark: require('@/assets/home/header-accent-dark.png') };

export const partnerArt: ModeArt | null = { light: require('@/assets/home/partner-accent-light.png'), dark: require('@/assets/home/partner-accent-dark.png') };

// Keyed by the department id in data/categories.ts, which never changes for art
export const careArt: Record<string, ModeArt> = {
  hair: { light: require('@/assets/home/care-hair-light.png'), dark: require('@/assets/home/care-hair-dark.png') },
  skin: { light: require('@/assets/home/care-skin-light.png'), dark: require('@/assets/home/care-skin-dark.png') },
  makeup: { light: require('@/assets/home/care-makeup-light.png'), dark: require('@/assets/home/care-makeup-dark.png') },
  body: { light: require('@/assets/home/care-body-light.png'), dark: require('@/assets/home/care-body-dark.png') },
};

// One approved file for both modes: it sits on the feature card, which is deep green in both, and was
// checked on both card colors. A separate dark version can replace `dark` later
const featureFile = require('@/assets/home/feature-general.png');
const featureGeneral: ModeArt | null = { light: featureFile, dark: featureFile };

// Takes the result's first care area so per-area art can be added later without touching Home
export function featureArt(area: QuizSection | null): ModeArt | null {
  void area;
  return featureGeneral;
}

// The four care areas Home shows, in the approved order. Ids from data/categories.ts
export const homeCareDepartments = ['hair', 'skin', 'makeup', 'body'] as const;
