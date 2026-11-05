export type QuizOption = {
  id: string;
  label: string;
};

export type QuizSection = 'start' | 'not_sure' | 'skin' | 'hair' | 'makeup' | 'body' | 'products';

export type QuizQuestion = {
  // Saved as question_id in the quiz_answers table, so never rename it
  id: string;
  // Exactly as written in docs/quiz-outcomes/01-quiz-content.md, for example "Getting started · 3 of 4"
  progress: string;
  // Which part of the quiz this belongs to. Branch sections only show for the areas someone picked
  section: QuizSection;
  // Position and size of the section, for the progress bar. Each section counts on its own, like its label
  step: number;
  total: number;
  // Optional questions can be passed with nothing picked; that saves as skipped, which stays unknown
  optional?: boolean;
  prompt: string;
  // The instruction line, for example "Choose one."
  helper: string;
  // Helper text under the choices. Only set where the content doc lists some
  note?: string;
  selectionMode: 'single' | 'multiple';
  options: QuizOption[];
  // Picking this option clears the others, and picking another option clears it
  exclusiveOptionId?: string;
  // For "Choose up to N". Once N are picked, the rest are turned off until one is unpicked
  maxSelections?: number;
  // The last screen of a section says Continue instead of Next question (docs/quiz-outcomes/01-quiz-content.md)
  nextLabel: 'Next question' | 'Continue';
};

export const q1Areas: QuizQuestion = {
  id: 'q1_areas',
  progress: 'Getting started · 1 of 4',
  step: 1,
  section: 'start',
  total: 4,
  selectionMode: 'multiple',
  prompt: 'What would you like help exploring today?',
  helper: 'Select all that apply.',
  note: 'Pick as many as you like. You can always explore other areas later.',
  options: [
    { id: 'hair', label: 'Hair care' },
    { id: 'skin', label: 'Skin care' },
    { id: 'makeup', label: 'Makeup' },
    { id: 'body', label: 'Body care' },
    { id: 'products', label: 'Products and ingredients' },
    { id: 'not_sure', label: 'I’m not sure yet' },
  ],
  exclusiveOptionId: 'not_sure',
  nextLabel: 'Next question',
};

export const u2Goal: QuizQuestion = {
  id: 'u2_goal',
  progress: 'Getting started · 2 of 4',
  step: 2,
  section: 'start',
  total: 4,
  selectionMode: 'single',
  prompt: 'What would you like to do today?',
  helper: 'Choose one.',
  note: 'Not sure is okay. We’ll help you find a place to start.',
  options: [
    { id: 'learn_needs', label: 'Learn more about my needs' },
    { id: 'find_products', label: 'Find products to explore' },
    { id: 'understand_product', label: 'Understand a product or ingredient' },
    { id: 'compare', label: 'Compare a few options' },
    { id: 'not_sure', label: 'I’m not sure yet' },
  ],
  nextLabel: 'Next question',
};

export const u3Confidence: QuizQuestion = {
  id: 'u3_confidence',
  progress: 'Getting started · 3 of 4',
  step: 3,
  section: 'start',
  total: 4,
  // Prototype wording until the team decides on the wireframe wording (docs/quiz-outcomes/11-decisions.md)
  prompt: 'How confident do you feel exploring the products or routines you selected?',
  helper: 'Choose a number from 1 to 5.',
  note: 'There’s no right answer. This only changes how much Cuidance explains.',
  selectionMode: 'single',
  options: [
    { id: '1', label: '1 · Not confident yet' },
    { id: '2', label: '2 · A little confident' },
    { id: '3', label: '3 · Somewhat confident' },
    { id: '4', label: '4 · Mostly confident' },
    { id: '5', label: '5 · Very confident' },
  ],
  nextLabel: 'Next question',
};

export const u4Support: QuizQuestion = {
  id: 'u4_support',
  progress: 'Getting started · 4 of 4',
  step: 4,
  section: 'start',
  total: 4,
  selectionMode: 'multiple',
  maxSelections: 3,
  prompt: 'How can Cuidance support you?',
  helper: 'Choose up to 3.',
  options: [
    { id: 'simple', label: 'Keep things simple' },
    { id: 'explain_terms', label: 'Explain unfamiliar terms' },
    { id: 'explain_why', label: 'Explain why something may fit' },
    { id: 'compare', label: 'Help me compare options' },
    { id: 'ingredients', label: 'Help me understand ingredients' },
    { id: 'own_products', label: 'Include products I already use' },
    { id: 'space', label: 'Give me space to explore' },
    { id: 'something_else', label: 'Something else' },
  ],
  nextLabel: 'Continue',
};


// Finding a start: only after "I’m not sure yet" on U1

export const n1Hoping: QuizQuestion = {
  id: 'n1_hoping',
  progress: 'Finding a start',
  section: 'not_sure',
  step: 1,
  total: 2,
  selectionMode: 'single',
  prompt: 'That’s okay. What are you hoping to figure out?',
  helper: 'Choose one.',
  note: 'There’s no wrong answer. You can change this later.',
  options: [
    { id: 'where_to_start', label: 'I need help choosing where to start' },
    { id: 'learn_product', label: 'I want to learn about a product or ingredient' },
    { id: 'what_may_work', label: 'I want to understand what may work for me' },
    { id: 'compare', label: 'I want to compare a few options' },
    { id: 'still_figuring', label: 'I’m still figuring it out' },
  ],
  nextLabel: 'Continue',
};

export const n2Start: QuizQuestion = {
  id: 'n2_start',
  progress: 'Finding a start',
  section: 'not_sure',
  step: 2,
  total: 2,
  selectionMode: 'single',
  prompt: 'Here are a few places to start.',
  helper: 'Pick one to explore. You can switch anytime.',
  note: 'You can also skip ahead and explore on your own.',
  options: [
    { id: 'hair', label: 'Hair care' },
    { id: 'skin', label: 'Skin care' },
    { id: 'makeup', label: 'Makeup' },
    { id: 'body', label: 'Body care' },
    { id: 'products', label: 'Products and ingredients' },
    { id: 'education', label: 'Browse education' },
  ],
  nextLabel: 'Continue',
};

// Skin care (these questions are about the face)

export const s1Midday: QuizQuestion = {
  id: 's1_midday',
  progress: 'Skin care · 1 of 3',
  section: 'skin',
  step: 1,
  total: 3,
  selectionMode: 'single',
  prompt: 'How does your skin usually feel by midday?',
  helper: 'Choose one.',
  note: 'Describe how it usually feels. Cuidance doesn’t scan or analyze skin.',
  options: [
    { id: 'tight_dry', label: 'Tight or dry' },
    { id: 'comfortable', label: 'Comfortable' },
    { id: 'shiny_some', label: 'Shiny in some areas' },
    { id: 'shiny_all', label: 'Shiny all over' },
    { id: 'changes', label: 'It changes depending on the day' },
    { id: 'still_figuring', label: 'I’m still figuring it out' },
  ],
  nextLabel: 'Next question',
};

export const s2Sensitivity: QuizQuestion = {
  id: 's2_sensitivity',
  progress: 'Skin care · 2 of 3',
  section: 'skin',
  step: 2,
  total: 3,
  optional: true,
  selectionMode: 'single',
  prompt: 'How would you describe your skin’s sensitivity?',
  helper: 'Choose one. This question is optional.',
  note: 'This is your own description, not a diagnosis. You can edit or remove it in Profile.',
  options: [
    { id: 'very', label: 'Very sensitive' },
    { id: 'sometimes', label: 'Sometimes sensitive' },
    { id: 'not_usually', label: 'Not usually sensitive' },
  ],
  nextLabel: 'Next question',
};

export const s3Goal: QuizQuestion = {
  id: 's3_goal',
  progress: 'Skin care · 3 of 3',
  section: 'skin',
  step: 3,
  total: 3,
  selectionMode: 'multiple',
  maxSelections: 2,
  prompt: 'What would you like help with most?',
  helper: 'Choose up to 2.',
  options: [
    { id: 'moisture', label: 'Moisture and dryness' },
    { id: 'cleansing', label: 'Cleansing' },
    { id: 'fragrance', label: 'Fragrance preferences' },
    { id: 'texture_finish', label: 'Texture or finish' },
    { id: 'simple_routine', label: 'Keeping my routine simple' },
    { id: 'understanding', label: 'Understanding products or ingredients' },
    { id: 'not_sure', label: 'I’m not sure yet' },
  ],
  exclusiveOptionId: 'not_sure',
  nextLabel: 'Continue',
};

// Hair care

export const h1Texture: QuizQuestion = {
  id: 'h1_texture',
  progress: 'Hair care · 1 of 3',
  section: 'hair',
  step: 1,
  total: 3,
  selectionMode: 'single',
  prompt: 'How would you describe your hair texture?',
  helper: 'Choose one.',
  options: [
    { id: 'straight', label: 'Straight' },
    { id: 'wavy', label: 'Wavy' },
    { id: 'curly', label: 'Curly' },
    { id: 'coily', label: 'Coily' },
    { id: 'mix', label: 'A mix of textures' },
  ],
  nextLabel: 'Next question',
};

export const h2Goal: QuizQuestion = {
  id: 'h2_goal',
  progress: 'Hair care · 2 of 3',
  section: 'hair',
  step: 2,
  total: 3,
  selectionMode: 'multiple',
  maxSelections: 2,
  prompt: 'What would you like help with most?',
  helper: 'Choose up to 2.',
  options: [
    { id: 'moisture', label: 'Moisture and dryness' },
    { id: 'definition', label: 'Definition' },
    { id: 'frizz', label: 'Frizz and manageability' },
    { id: 'wash_day', label: 'Cleansing and wash-day care' },
    { id: 'styling', label: 'Styling' },
    { id: 'heat_color', label: 'Heat or color-treated care' },
    { id: 'not_sure', label: 'I’m not sure yet' },
  ],
  exclusiveOptionId: 'not_sure',
  nextLabel: 'Next question',
};

export const h3Styling: QuizQuestion = {
  id: 'h3_styling',
  progress: 'Hair care · 3 of 3',
  section: 'hair',
  step: 3,
  total: 3,
  selectionMode: 'multiple',
  prompt: 'How do you usually wear or style your hair?',
  helper: 'Select all that apply.',
  options: [
    { id: 'natural', label: 'Natural texture' },
    { id: 'heat', label: 'Heat-styled' },
    { id: 'protective', label: 'Protective styles' },
    { id: 'color', label: 'Color-treated' },
    { id: 'change_it_up', label: 'I change it up' },
  ],
  nextLabel: 'Continue',
};

// Makeup

export const m1Area: QuizQuestion = {
  id: 'm1_area',
  progress: 'Makeup · 1 of 4',
  section: 'makeup',
  step: 1,
  total: 4,
  selectionMode: 'multiple',
  prompt: 'What kind of makeup are you exploring?',
  helper: 'Select all that apply.',
  options: [
    { id: 'base', label: 'Complexion or base' },
    { id: 'eyes', label: 'Eyes' },
    { id: 'brows', label: 'Brows' },
    { id: 'cheeks', label: 'Cheeks' },
    { id: 'lips', label: 'Lips' },
    { id: 'full_look', label: 'Full makeup look' },
    { id: 'techniques', label: 'Makeup techniques' },
    { id: 'education', label: 'Product and ingredient education' },
  ],
  nextLabel: 'Next question',
};

export const m2Goal: QuizQuestion = {
  id: 'm2_goal',
  progress: 'Makeup · 2 of 4',
  section: 'makeup',
  step: 2,
  total: 4,
  selectionMode: 'multiple',
  maxSelections: 2,
  prompt: 'What would you like help with most?',
  helper: 'Choose up to 2.',
  options: [
    { id: 'everyday', label: 'Building an everyday look' },
    { id: 'shades', label: 'Finding shades or colors' },
    { id: 'coverage_finish', label: 'Choosing coverage or finish' },
    { id: 'techniques', label: 'Learning application techniques' },
    { id: 'compare', label: 'Comparing products' },
    { id: 'event', label: 'Creating a look for an event' },
    { id: 'ingredients', label: 'Understanding ingredients' },
  ],
  nextLabel: 'Next question',
};

export const m3Look: QuizQuestion = {
  id: 'm3_look',
  progress: 'Makeup · 3 of 4',
  section: 'makeup',
  step: 3,
  total: 4,
  selectionMode: 'single',
  prompt: 'What kind of look are you interested in?',
  helper: 'Choose one. Examples explain terms; none is better.',
  options: [
    { id: 'light_natural', label: 'Light and natural' },
    { id: 'buildable', label: 'Buildable' },
    { id: 'medium', label: 'Medium coverage' },
    { id: 'full', label: 'Full coverage' },
    { id: 'matte', label: 'Matte finish' },
    { id: 'radiant', label: 'Radiant finish' },
    { id: 'exploring', label: 'I’m exploring different options' },
  ],
  nextLabel: 'Next question',
};

export const m4Priority: QuizQuestion = {
  id: 'm4_priority',
  progress: 'Makeup · 4 of 4',
  section: 'makeup',
  step: 4,
  total: 4,
  selectionMode: 'multiple',
  maxSelections: 3,
  prompt: 'What matters most to you when exploring makeup?',
  helper: 'Choose up to 3.',
  options: [
    { id: 'easy', label: 'Easy to use' },
    { id: 'comfortable', label: 'Comfortable to wear' },
    { id: 'long_lasting', label: 'Long-lasting' },
    { id: 'simple_remove', label: 'Simple to remove' },
    { id: 'natural_finish', label: 'A natural-looking finish' },
    { id: 'specific_shade', label: 'A specific color or shade' },
    { id: 'info', label: 'Product and ingredient information' },
    { id: 'something_else', label: 'Something else' },
  ],
  nextLabel: 'Continue',
};

// Body care

export const b1Area: QuizQuestion = {
  id: 'b1_area',
  progress: 'Body care · 1 of 3',
  section: 'body',
  step: 1,
  total: 3,
  selectionMode: 'multiple',
  prompt: 'What kind of body care are you exploring?',
  helper: 'Select all that apply.',
  options: [
    { id: 'cleansing_moisture', label: 'Cleansing and moisture' },
    { id: 'deodorant', label: 'Deodorant or antiperspirant' },
    { id: 'fragrance', label: 'Fragrance' },
    { id: 'hands_feet', label: 'Hands and feet' },
    { id: 'nails', label: 'Nail care' },
    { id: 'products', label: 'Body-care products' },
    { id: 'ingredients', label: 'Body-care ingredients' },
  ],
  nextLabel: 'Next question',
};

export const b2Task: QuizQuestion = {
  id: 'b2_task',
  progress: 'Body care · 2 of 3',
  section: 'body',
  step: 2,
  total: 3,
  selectionMode: 'single',
  prompt: 'What would you like help with today?',
  helper: 'Choose one.',
  options: [
    { id: 'learn', label: 'Learn about body care' },
    { id: 'find_product', label: 'Find a body-care product to explore' },
    { id: 'ingredient', label: 'Understand a body-care ingredient' },
    { id: 'compare', label: 'Compare body-care products' },
    { id: 'deodorant', label: 'Learn about deodorant or antiperspirant' },
    { id: 'nails', label: 'Learn about nail care' },
    { id: 'not_sure', label: 'I’m not sure yet' },
  ],
  nextLabel: 'Next question',
};

export const b3Priority: QuizQuestion = {
  id: 'b3_priority',
  progress: 'Body care · 3 of 3',
  section: 'body',
  step: 3,
  total: 3,
  selectionMode: 'multiple',
  maxSelections: 3,
  prompt: 'What matters most to you?',
  helper: 'Choose up to 3.',
  options: [
    { id: 'fragrance_free', label: 'Fragrance-free' },
    { id: 'specific_scent', label: 'A specific scent' },
    { id: 'simple', label: 'Simple to use' },
    { id: 'comfortable', label: 'Comfortable to use' },
    { id: 'quick_absorb', label: 'Quick to absorb' },
    { id: 'own_products', label: 'Products I already use' },
    { id: 'no_preference', label: 'No strong preference' },
    { id: 'something_else', label: 'Something else' },
  ],
  nextLabel: 'Continue',
};

// Products and ingredients

export const p1Explore: QuizQuestion = {
  id: 'p1_explore',
  progress: 'Products and ingredients · 1 of 3',
  section: 'products',
  step: 1,
  total: 3,
  selectionMode: 'multiple',
  prompt: 'What would you like to explore?',
  helper: 'Select all that apply.',
  options: [
    { id: 'considering', label: 'A product I’m considering' },
    { id: 'own', label: 'A product I already own' },
    { id: 'compare', label: 'Comparing products' },
    { id: 'whats_in', label: 'Understanding what is in a product' },
  ],
  nextLabel: 'Next question',
};

export const p2Task: QuizQuestion = {
  id: 'p2_task',
  progress: 'Products and ingredients · 2 of 3',
  section: 'products',
  step: 2,
  total: 3,
  selectionMode: 'single',
  prompt: 'What would you like help with today?',
  helper: 'Choose one.',
  options: [
    { id: 'look_up', label: 'Look up a product' },
    { id: 'whats_in', label: 'Understand what is in a product' },
    { id: 'compare', label: 'Compare product options' },
    { id: 'read_label', label: 'Learn how to read a product label' },
    { id: 'not_sure', label: 'I’m not sure yet' },
  ],
  nextLabel: 'Next question',
};

export const p3Info: QuizQuestion = {
  id: 'p3_info',
  progress: 'Products and ingredients · 3 of 3',
  section: 'products',
  step: 3,
  total: 3,
  selectionMode: 'multiple',
  maxSelections: 3,
  prompt: 'What information would be most useful?',
  helper: 'Choose up to 3.',
  options: [
    { id: 'key_ingredients', label: 'Key ingredients' },
    { id: 'made_for', label: 'What the product is made for' },
    { id: 'texture_finish', label: 'Product texture or finish' },
    { id: 'fragrance', label: 'Fragrance information' },
    { id: 'read_label', label: 'How to read the label' },
    { id: 'other_notes', label: 'Other product notes' },
    { id: 'no_preference', label: 'No strong preference' },
  ],
  nextLabel: 'Continue',
};

// Every question, in quiz order. Which ones a person sees is worked out in lib/quizFlow.ts
export const quizQuestions: QuizQuestion[] = [
  q1Areas,
  u2Goal,
  u3Confidence,
  u4Support,
  n1Hoping,
  n2Start,
  s1Midday,
  s2Sensitivity,
  s3Goal,
  h1Texture,
  h2Goal,
  h3Styling,
  m1Area,
  m2Goal,
  m3Look,
  m4Priority,
  b1Area,
  b2Task,
  b3Priority,
  p1Explore,
  p2Task,
  p3Info,
];

// The fixed order care areas run in after Getting started (docs/quiz-outcomes/01-quiz-content.md, Flow)
export const AREA_ORDER: QuizSection[] = ['skin', 'hair', 'makeup', 'body', 'products'];
