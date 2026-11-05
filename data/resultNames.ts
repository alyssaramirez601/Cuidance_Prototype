import type { ResultName } from '@/data/outcomeTypes';

// Copied from docs/quiz-outcomes/12-result-names.md. The name only labels the result; it never changes the advice

export const skinNames: Record<string, ResultName> = {
  tight_dry: { headline: 'Rich comfort, gentle steps', subtitle: 'A gentle wash, a creamier moisturizer, and nothing that strips.' },
  comfortable: { headline: 'Keep what works, add what helps', subtitle: 'Gentle basics you already like, plus everyday sun care.' },
  shiny_some: { headline: 'Calm hydration, less guesswork', subtitle: 'Light moisture, fragrance-free picks, and a short routine you can build on.' },
  shiny_all: { headline: 'Light layers, still hydrated', subtitle: 'Gel or lotion textures and a gentle wash that never feels heavy.' },
  changes: { headline: 'Flexible basics, day by day', subtitle: 'A steady gentle base, with a lighter or richer layer when you need it.' },
  still_figuring: { headline: 'Start simple, learn as you go', subtitle: 'Two gentle basics and one small thing to notice this week.' },
};

// "Very sensitive" takes over the skin name, because comfort comes first
export const verySensitiveName: ResultName = {
  headline: 'Gentle first, comfort always',
  subtitle: 'Fewer ingredients, fragrance-free picks, and a test spot before anything new.',
};

// Named from the hair goal answer. "your waves" and "your curls or waves" swap for the texture picked
export const hairNames: Record<string, ResultName> = {
  moisture: { headline: 'Moisture that sticks around', subtitle: 'Conditioner-first wash days and a leave-in made for your waves.' },
  definition: { headline: 'Your texture, front and center', subtitle: 'Styling steps that help your curls or waves hold their shape.' },
  frizz: { headline: 'Smoother days, less fuss', subtitle: 'Moisture, gentle drying, and a styler that keeps things in place.' },
  wash_day: { headline: 'Wash day, made easier', subtitle: 'A cleanser and conditioner rhythm that fits your texture and schedule.' },
  styling: { headline: 'Style it, keep it happy', subtitle: 'Heat-light options and protection steps for the looks you love.' },
  heat_color: { headline: 'Color and heat, handled gently', subtitle: 'Gentle washing, heat protection, and color-safe care.' },
  not_sure: { headline: 'Hair basics, no pressure', subtitle: 'A simple wash and condition routine to start, and what to notice next.' },
};

// From the styling answer
export const protectiveStylesName: ResultName = {
  headline: 'Protected style, happy scalp',
  subtitle: 'Comfortable tension, an easy scalp wash, and moisture for your lengths.',
};

export const hairTextureWords: Record<string, string> = {
  straight: 'straight hair',
  wavy: 'waves',
  curly: 'curls',
  coily: 'coils',
  mix: 'mixed textures',
};

// Named from the makeup goal answer
export const makeupNames: Record<string, ResultName> = {
  everyday: { headline: 'Your everyday, made easy', subtitle: 'A few easy steps and products that feel comfortable all day.' },
  shades: { headline: 'Shade matching, less guesswork', subtitle: 'Compare depth first, then undertone. No close match is an honest answer.' },
  coverage_finish: { headline: 'Your finish, your call', subtitle: 'Sheer to full and matte to radiant, explained side by side.' },
  techniques: { headline: 'Technique, one step at a time', subtitle: 'Simple how-tos for the area you picked, with tools you already have.' },
  compare: { headline: 'Side by side, no hype', subtitle: 'The same questions asked of each option, and nothing ranked for you.' },
  event: { headline: 'Ready for the big day', subtitle: 'Staying power, easy touch-ups, and a plan for taking it all off.' },
  ingredients: { headline: 'What’s inside your makeup', subtitle: 'Pigments, film formers and fragrance, in plain words.' },
};

// Named from the body care area answer. "Body-care products" and "Body-care ingredients" share one name
export const bodyNames: Record<string, ResultName> = {
  cleansing_moisture: { headline: 'Soft skin, simple steps', subtitle: 'A gentle body wash and a moisturizer used while skin is still damp.' },
  deodorant: { headline: 'Fresh, your way', subtitle: 'Odor control or less wetness, explained so you can choose.' },
  fragrance: { headline: 'Scent on your terms', subtitle: 'Fragrance-free or scented, with a heads-up on what to test first.' },
  hands_feet: { headline: 'Hands and feet, some TLC', subtitle: 'Richer creams, overnight care, and help for spots that crack.' },
  nails: { headline: 'Healthy nails, gentle removal', subtitle: 'Moisture for nails and cuticles, and safe ways to take off polish or gel.' },
  products: { headline: 'Body care, decoded', subtitle: 'What the label says, what each part does, and what to check.' },
  ingredients: { headline: 'Body care, decoded', subtitle: 'What the label says, what each part does, and what to check.' },
};

// From the body care task answer
export const bodyNotSureName: ResultName = { headline: 'Body basics, no pressure', subtitle: 'One comfortable place to start, and room to explore.' };

// Named from the product task answer
export const productNames: Record<string, ResultName> = {
  look_up: { headline: 'Get to know this product', subtitle: 'What it is made for, its key ingredients, and what to check.' },
  whats_in: { headline: 'Ingredients, in plain words', subtitle: 'What each key ingredient does, in the order the label lists it.' },
  compare: { headline: 'Fair comparisons, no hype', subtitle: 'The same details for each option, with gaps shown, not hidden.' },
  read_label: { headline: 'Label reading, made easy', subtitle: 'Where to look, what claims mean, and what they don’t promise.' },
  not_sure: { headline: 'Curious? Start here', subtitle: 'A quick tour of labels and ingredients, at your own pace.' },
};

// Mixed results
export const hairAndSkinName: ResultName = {
  headline: 'Calm hydration, less guesswork',
  subtitle: 'Light moisture for your skin, fragrance-free picks, and wash-day ideas for your waves.',
};
export const skinAndMakeupName: ResultName = {
  headline: 'Calm hydration, easy everyday',
  subtitle: 'Gentle moisture first, then a light base that sits well on top.',
};
export const threeOrMoreName: ResultName = {
  headline: 'Head to toe, no overwhelm',
  subtitle: 'Three places to start today, with a tab for each area you picked.',
};
export const threeOrMoreSimpleName: ResultName = {
  headline: 'A little care, everywhere',
  subtitle: 'One small step for each area you picked. Expand anything for more.',
};
export const notSureEverywhereName: ResultName = {
  headline: 'Start simple, learn as you go',
  subtitle: 'A few gentle basics and one thing to notice this week.',
};
