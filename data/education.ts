// Education articles for Explore. Every paragraph is copied word for word from reviewed content in
// docs/quiz-outcomes/ (the label explainer, answer-card explainers, safety lines and the every-skin-tone
// wording), so nothing here is new advice. DRAFT: the titles, the grouping into articles and the
// read times are new and need Alyssa and Esme's OK.

import type { CareArea } from '@/data/outcomeTypes';
import { emergencyLine } from '@/data/safety';
import { labelGuide } from '@/data/labelGuide';

export type ArticleKind = 'Article' | 'Tip' | 'Explainer';

export type Article = {
  id: string;
  title: string;
  area: CareArea;
  kind: ArticleKind;
  minutes: number;
  paragraphs: string[];
  // Kept visible on its own, never folded into the paragraphs
  safety?: string;
  // Where the lines came from, so the article can link its sources
  codes: string[];
  sources: { title: string; url: string }[];
};

export const articles: Article[] = [
  {
    id: 'read-a-label',
    title: 'How to read a product label',
    area: 'products',
    kind: 'Explainer',
    minutes: 2,
    paragraphs: [
      labelGuide,
      'Ingredient order has exceptions, and some familiar front-label terms are claims rather than standardized certifications.',
      'More ingredients, a shorter list, or an earlier position does not by itself establish a better product.',
      'Read the directions and warnings as well as the ingredient list.',
    ],
    codes: ['PR-P2-04', 'PR-P2-03', 'PR-P3-05'],
    sources: [
      { title: 'FDA · Cosmetics Labeling Guide', url: 'https://www.fda.gov/cosmetics/cosmetics-labeling-regulations/cosmetics-labeling-guide' },
      { title: 'FDA · Cosmetics Labeling Claims', url: 'https://www.fda.gov/cosmetics/cosmetics-labeling/cosmetics-labeling-claims' },
    ],
  },
  {
    id: 'ingredient-lists',
    title: 'Ingredient lists, in plain language',
    area: 'products',
    kind: 'Article',
    minutes: 2,
    paragraphs: [
      'A product’s ingredient list explains what is included, but it does not establish how it will feel or work for you.',
      'Ingredients may serve roles such as cleansing, preserving, coloring, scenting, or helping retain moisture.',
      'Ingredient names do not reveal the full formula, exact amounts, or your future response.',
      'Texture and finish depend on the complete formula; the ingredient list alone cannot promise the result.',
      'A grouped fragrance entry does not identify every component; ’unscented’ is not the same as fragrance-free.',
      'Cosmetics are not generally individually FDA-approved before sale; that is different from being subject to safety and labeling laws.',
    ],
    codes: ['PR-P1-01', 'PR-P1-04', 'PR-P2-02', 'PR-P3-03', 'PR-P3-04', 'PR-P2-01'],
    sources: [
      { title: 'FDA · Fragrances in Cosmetics', url: 'https://www.fda.gov/cosmetics/cosmetic-ingredients/fragrances-cosmetics' },
      {
        title: 'FDA · Not FDA-Approved, but FDA-Regulated',
        url: 'https://www.fda.gov/cosmetics/cosmetics-laws-regulations/fda-authority-over-cosmetics-how-cosmetics-are-not-fda-approved-are-fda-regulated',
      },
    ],
  },
  {
    id: 'new-product',
    title: 'Trying a new product',
    area: 'skin',
    kind: 'Tip',
    minutes: 1,
    paragraphs: [
      'Before using a new product widely, you may want to try it on a small area first. The American Academy of Dermatology suggests testing twice a day for seven to ten days. For a cleanser, follow its usual rinse-off directions. Stop if a reaction appears.',
      'On lighter skin, a reaction may look red. On deeper skin, it may look brown, purple or gray. It can also feel itchy, hot or swollen.',
      'On deeper skin, a test spot may look lighter or darker for a while. That usually fades on its own.',
    ],
    safety: emergencyLine,
    codes: ['Safety: new-product testing note', 'ST-09', 'ST-11'],
    sources: [
      {
        title: 'AAD · Patch testing can find what’s causing your rash',
        url: 'https://www.aad.org/public/diseases/eczema/types/contact-dermatitis/patch-testing-rash',
      },
    ],
  },
  {
    id: 'shades-every-tone',
    title: 'Shades for every skin tone',
    area: 'makeup',
    kind: 'Article',
    minutes: 2,
    paragraphs: [
      'Every depth has a range of undertones, from pink or red to golden, neutral and olive. Compare depth first, then color direction.',
      'These shades may not include a close match for you. That is a gap in this range, not something about your skin. You may want to explore lines with deeper or lighter options.',
      'Some sunscreens and powders leave a white or gray cast, which shows more on deeper skin. A tinted or sheer formula may blend better. Try a small amount on your own skin first.',
    ],
    codes: ['ST-03', 'ST-04', 'ST-07'],
    sources: [
      {
        title: 'Cosmetics & Toiletries · Color, Corrected: Perfectly Tuning to Black Skin Tones',
        url: 'https://www.cosmeticsandtoiletries.com/formulas-products/article/21836736/color-corrected-perfectly-tuning-to-black-skin-tones',
      },
    ],
  },
  {
    id: 'dye-and-heat',
    title: 'Hair dye and heat smoothing safety',
    area: 'hair',
    kind: 'Tip',
    minutes: 1,
    paragraphs: [
      'Before each dye use, follow the label’s skin-test instructions, even if you have used that dye before. FDA advises testing two days before use, including for salon coloring. If a reaction appears, do not use the dye.',
      'If a heated smoothing treatment causes eye irritation, coughing, wheezing, or other breathing symptoms, stop the exposure and seek medical advice. Trouble breathing calls for urgent medical help.',
    ],
    codes: ['Safety: dye note', 'Safety: heated-smoothing note'],
    sources: [
      { title: 'FDA · Hair Dyes', url: 'https://www.fda.gov/cosmetics/cosmetic-products/hair-dyes' },
      {
        title: 'FDA · Hair Smoothing Products That Release Formaldehyde When Heated',
        url: 'https://www.fda.gov/cosmetics/cosmetic-products/hair-smoothing-products-release-formaldehyde-when-heated',
      },
    ],
  },
  {
    id: 'body-new-product',
    title: 'Testing a new body product',
    area: 'body',
    kind: 'Tip',
    minutes: 1,
    paragraphs: [
      'Before using an unfamiliar skin-care product widely, you may want to test it on a small area first. AAD suggests testing twice a day for seven to ten days. Follow the product’s usual directions, including rinsing off a cleanser. Stop if a reaction appears.',
      'On lighter skin, a reaction may look red. On deeper skin, it may look brown, purple or gray. It can also feel itchy, hot or swollen.',
    ],
    safety: emergencyLine,
    codes: ['Safety: body new-product testing note', 'ST-09'],
    sources: [
      {
        title: 'AAD · Patch testing can find what’s causing your rash',
        url: 'https://www.aad.org/public/diseases/eczema/types/contact-dermatitis/patch-testing-rash',
      },
    ],
  },
];
