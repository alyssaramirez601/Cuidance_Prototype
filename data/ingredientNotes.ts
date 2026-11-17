// Reviewed ingredient notes for Explore's ingredient lookup. Each role line is copied word for word
// from an answer card in docs/quiz-outcomes/, and keeps that card's code and evidence label.
// `matches` lists the label spellings it covers, so "Ceramide NP" finds the ceramides note.
// Ingredients without a note still show which products list them, with no guessed role.

import type { Evidence } from '@/data/outcomeTypes';

export type IngredientNote = {
  name: string;
  matches: string[];
  role: string;
  evidence: Evidence;
  code: string;
};

export const ingredientNotes: IngredientNote[] = [
  { name: 'Glycerin', matches: ['glycerin'], role: 'Helps attract water into skin.', evidence: 'Strong', code: 'SK-S1-01' },
  { name: 'Petrolatum', matches: ['petrolatum'], role: 'Helps reduce water leaving skin.', evidence: 'Strong', code: 'SK-S1-01' },
  { name: 'Dimethicone', matches: ['dimethicone'], role: 'Helps limit moisture leaving skin.', evidence: 'Moderate', code: 'SK-S1-03' },
  { name: 'Ceramides', matches: ['ceramide'], role: 'Help support skin barrier lipids.', evidence: 'Moderate', code: 'SK-S2-02' },
  {
    name: 'Cetrimonium chloride',
    matches: ['cetrimonium chloride'],
    role: 'Helps reduce static and tangling.',
    evidence: 'Moderate',
    code: 'HR-H1-01',
  },
  {
    name: 'Behentrimonium chloride',
    matches: ['behentrimonium chloride'],
    role: 'Helps reduce friction during detangling.',
    evidence: 'Moderate',
    code: 'HR-H1-03',
  },
  { name: 'Cetyl alcohol', matches: ['cetyl alcohol'], role: 'Helps soften hair in conditioners.', evidence: 'Strong', code: 'HR-H2-01' },
  { name: 'Iron oxide pigments', matches: ['iron oxide'], role: 'Help create varied makeup shades.', evidence: 'Strong', code: 'MU-M1-01' },
  {
    name: 'Titanium dioxide pigment',
    matches: ['titanium dioxide'],
    role: 'Helps provide opacity in makeup.',
    evidence: 'Moderate',
    code: 'MU-M2-03',
  },
  {
    name: 'Aluminum-based antiperspirant actives',
    matches: ['aluminum chlorohydrate', 'aluminum zirconium'],
    role: 'Help temporarily reduce sweat flow.',
    evidence: 'Strong',
    code: 'BD-B1-07',
  },
];
