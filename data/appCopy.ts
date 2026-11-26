// App copy that docs/quiz-outcomes/ describes but doesn't give the words for. Written for the beta
// and approved by Alyssa (Nov 17). If the team rewrites a line, change it here and add the final
// wording to the outcome docs.

export const areaLabels: Record<string, string> = {
  skin: 'skin care',
  hair: 'hair care',
  makeup: 'makeup',
  body: 'body care',
  products: 'products and ingredients',
};

// Section titles come from the 8-section template in 08-results-delivery.md
export const sectionTitles = {
  exploration: 'Your exploration today',
  startHere: 'Start here',
  why: 'Why these may fit',
  byArea: 'Explore by care area',
  inContext: 'Products or ingredients in context',
  check: 'What to check',
  open: 'What remains open',
  evidence: 'Evidence and sources',
};

// Two areas without a written combined name: the first area names the result, the second joins the subtitle
export function twoAreaSubtitle(first: string, second: string): string {
  return `${capitalize(areaLabels[first])} guidance first, with ideas for ${areaLabels[second]} too.`;
}

export function explorationSentence(areas: string[]): string {
  if (areas.length === 0) {
    return 'You’re still finding a place to start, and that’s okay. Based on what you selected, here are a few gentle basics.';
  }
  return `Today you’re exploring ${joinList(areas.map((area) => areaLabels[area]))}. Based on what you selected, here’s where to start.`;
}

export const openLines = {
  skipped: (prompt: string) => `You skipped “${prompt}” That stays open, and nothing was guessed. You can answer it anytime.`,
  notSure: (prompt: string) => `You chose “I’m not sure yet” for “${prompt}” That’s a good answer, and it stays open for now.`,
};

export const evidenceIntro =
  'The dots next to each point show how well-studied that kind of advice is in general. They’re about the research, not about you.';

// What the dots mean, in plain words. The evidence labels themselves come from the outcome library
export const evidenceKey = {
  Strong: { title: 'Strong', meaning: 'Backed by dermatology groups, the FDA, or several studies.' },
  Moderate: { title: 'Moderate', meaning: 'Supported by some research or expert advice.' },
  Limited: { title: 'Limited', meaning: 'Common advice that hasn’t been studied much yet.' },
  Assumption: { title: 'Our idea', meaning: 'Our own idea, still being tested with people.' },
};

// "this path" in the outcome library reads as vague on its own, so the app says "your guidance" instead.
// The docs keep the original wording until the team updates them
export function clarify(text: string): string {
  return text.replace(/\bthis path\b/g, 'your guidance').replace(/\bThis path\b/g, 'Your guidance');
}

export const emptyResult = {
  title: 'Your result isn’t ready yet',
  body: 'Answer the quiz first, and your guidance will show up here.',
};

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('');
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

// Result screen labels
export const resultLabels = {
  screenTitle: 'Your result',
  // From the Week 8 hi-fi result screen
  basedOn: 'Based on what you selected',
  edit: 'Edit',
  editAnswers: 'Edit your answers',
  eyebrow: 'Your guidance',
  close: 'Close',
  showMore: (count: number) => `Show ${count} more`,
  showFewer: 'Show fewer',
  productTypes: 'Products that may fit',
  productTypesHelper: 'Product types, not brands.',
  ingredients: 'Ingredients that may help',
  skinTone: 'Every skin tone',
  labelGuide: 'How to read a label',
  meaning: 'What this may mean',
  areaInContext: 'This area shapes what the result shows below, rather than adding advice.',
  showSources: 'Show sources',
  hideSources: 'Hide sources',
  evidenceKeyTitle: 'What the dots mean',
  sourcesIntro: 'The guidance comes from dermatology groups, the FDA and CDC, peer-reviewed journals and EU law. No brand blogs or influencer posts.',
  tryTitle: 'What you could try',
  whyTitle: 'Why it may fit',
  watchTitle: 'Watch out for',
  ingredientRole: 'What it does',
  // Save confirmation sheet, from the clickable prototype (p2). The prototype also says
  // "and Guidance History"; left out until that Profile page exists
  savedTitle: 'Result saved',
  savedBody: (name: string) => `${name} is now in Saved.`,
  viewInSaved: 'View in Saved',
  continueHome: 'Continue to Home',
  save: 'Save result',
  saving: 'Saving',
  change: 'Change my answers',
  startOver: 'Start over',
  loading: 'Building your result',
  takeQuiz: 'Take the quiz',
};

// Home, from the Week 8 Step 5 Home hi-fi (07 and 07B). "Good afternoon" and "Good evening"
// follow "Good morning" from the design
export const homeCopy = {
  loading: 'Loading Home',
  loadError: 'We couldn’t load your Home screen. Check your connection and try again.',
  morning: 'Good morning',
  afternoon: 'Good afternoon',
  evening: 'Good evening',
  resumeEyebrow: 'Pick up where you left off',
  resumeTitle: 'Your guidance quiz',
  questionsLeft: (count: number) => (count === 1 ? '1 question left' : `${count} questions left`),
  resumeButton: 'Continue guidance',
  updatesTitle: 'Guidance updates',
  yourResult: 'Your result',
  revisit: 'Ready to revisit anytime',
  getGuidance: 'Get your guidance',
  getGuidanceDetail: 'Take the quiz to see what may fit you',
  // New: the Ulta and Sephora style Home (Nov 17)
  searchHint: 'Search products, ingredients, topics',
  attributesTitle: 'Your attributes',
  attributesDetail: 'See what shapes your guidance',
  guidesTitle: 'Guides and tips',
  seeAll: 'See all',
  readTime: (minutes: number) => `${minutes} min read`,
  // Home v2 (Alyssa, Nov 25, 2026)
  careTitle: 'Your care, at a glance',
  viewAll: 'View all',
  viewResult: 'View your result',
  // Feature card eyebrows and the new-user action (Alyssa, Nov 25, Checkpoint 3)
  continueEyebrow: 'Continue your guidance',
  startEyebrow: 'Get started',
  startGuidance: 'Start guidance',
};

// Partner Highlights copy from the Week 8 Home hi-fi. The products come from data/partnerContent.ts.
// The note line makes sure nobody mistakes these for real products
export const partnerPlaceholders = {
  title: 'Partner Highlights',
  filters: ['Today’s trends', 'Best sellers', 'New arrivals'],
  note: 'Sample partner content. Cuidance has no real partnerships yet.',
  seeAll: 'See all in Shop',
};

// Saved, from the Week 8 Step 5 Saved hi-fi (15 to 18)
export const savedCopy = {
  title: 'Saved',
  intro: 'Your guidance, products and boards in one place.',
  loading: 'Loading your saved guidance',
  tabs: [
    { key: 'guidance', label: 'Guidance' },
    { key: 'products', label: 'Products' },
    { key: 'owned', label: 'Owned' },
    { key: 'boards', label: 'Boards' },
  ],
  guidanceIntro: 'Saved results and explainers you want to return to.',
  resultLine: (date: string) => `Result · saved ${date}`,
  savedTag: 'Saved',
  emptyTitle: 'Nothing saved yet',
  emptyBody: 'When you save a result or an article, it will show up here.',
  emptyButton: 'Take the guidance quiz',
  ownedEmptyTitle: 'Nothing here yet',
  ownedEmptyBody: 'Add products you already use to track how they work for you.',
  addOwned: 'Add a product you own',
  // From the clickable prototype, screen 16
  productsEmptyTitle: 'No saved products yet',
  productsEmptyBody: 'Tap Save on any product to keep it here.',
  // New: marks a saved partner product in Saved > Products
  partnerTag: 'Partner content',
  ownedTag: 'Owned',
  viewProduct: 'View product',
  // From the clickable prototype, screen 17
  ownedCount: (n: number) => (n === 1 ? '1 product you own' : `${n} products you own`),
  addReflection: 'Add a reflection',
  reflectionQuestion: 'How is it working for you?',
  reflections: { loved: 'Tried it, loved it', not_for_me: 'Tried it, did not work for me', testing: 'Still testing' },
  reflectionSaved: 'Reflection saved',
  productsLoading: 'Loading your products',
  // New: product page buttons
  save: 'Save',
  savedButton: 'Saved',
  own: 'I own this',
  ownedButton: 'Owned',
  savedToast: 'Saved to your Saved area',
  ownedToast: 'Added to Owned',
  // Boards replace Routines (Nov 17). Lines adapted from the prototype's routine boards (18 to 18C)
  boardsIntro: 'Collect products, guides and results in boards, like a routine or a wishlist.',
  boardsEmptyTitle: 'No boards yet',
  boardsEmptyBody: 'Create one to keep your steps and products in one place.',
  createBoard: 'Create a board',
  newBoard: 'New board',
  boardName: 'Board name',
  boardNameHelper: 'For example: Morning skin care, Wash day, Wishlist',
  boardNameError: 'Give the board a name.',
  create: 'Create board',
  pinCount: (n: number) => (n === 1 ? '1 pin' : `${n} pins`),
  boardsLoading: 'Loading your boards',
  addToBoard: 'Add to board',
  chooseBoard: 'Choose a board',
  pinned: (board: string) => `Added to ${board}`,
  alreadyPinned: 'On this board',
  boardEmpty: 'Nothing pinned yet. Use Add to board on a product or guide.',
  removePin: 'Remove',
  deleteBoard: 'Delete board',
  confirmDelete: 'Tap again to delete this board',
  boardNotFoundTitle: 'Board not found',
  boardNotFoundBody: 'It may have been deleted.',
  resultPin: 'Your result',
  backToSaved: 'Back to Saved',
  notFoundTitle: 'We couldn’t find that saved result',
  notFoundBody: 'It may have been removed. Head back to Saved to see what’s there.',
};
