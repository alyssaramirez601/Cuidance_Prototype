export type QuizOption = {
  id: string;
  label: string;
};

export type QuizQuestion = {
  // Saved as question_id in the quiz_answers table, so never rename it
  id: string;
  // Exactly as written in docs/quiz-outcomes/01-quiz-content.md, for example "Getting started · 3 of 4"
  progress: string;
  // Position in the Getting started section, for the progress bar
  step: number;
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

// Everyone answers these four before any branch questions
export const CORE_QUESTION_COUNT = 4;

export const q1Areas: QuizQuestion = {
  id: 'q1_areas',
  progress: 'Getting started · 1 of 4',
  step: 1,
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

// In the order people answer them. Next question moves one step along this list
export const quizQuestions: QuizQuestion[] = [q1Areas, u2Goal, u3Confidence, u4Support];
