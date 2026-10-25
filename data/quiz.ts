export type QuizOption = {
  id: string;
  label: string;
};

export type QuizQuestion = {
  // Saved as question_id in the quiz_answers table, so never rename it
  id: string;
  prompt: string;
  helper: string;
  note: string;
  options: QuizOption[];
  // Picking this option clears the others, and picking another option clears it
  exclusiveOptionId?: string;
};

export const q1Areas: QuizQuestion = {
  id: 'q1_areas',
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
};
