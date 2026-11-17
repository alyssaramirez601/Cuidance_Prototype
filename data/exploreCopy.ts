// Explore copy, from the clickable prototype screens 08 to 13 where it has words.
// Lines marked DRAFT are new and need Alyssa and Esme's OK.

export const exploreCopy = {
  title: 'Explore',
  searchLabel: 'Search',
  searchPlaceholder: 'Search products, ingredients, topics',
  shortcuts: { guidance: 'Guidance', products: 'Products', ingredients: 'Ingredients', education: 'Education' },
  guidanceTitle: 'Start from your guidance',
  guidanceBody: 'Browse products and topics filtered by your guidance.',
  usingDetails: 'Using your details:',
  startExploring: 'Start exploring',
  // DRAFT: for people who haven't taken the quiz yet
  noGuidance: 'Take the quiz so Explore can start from what you selected.',
  takeQuiz: 'Take the quiz',
  scan: 'Scan a product',
  // DRAFT: the short label on the button beside search
  scanShort: 'Scan',
  // From the Sephora app reference
  allCategories: 'All categories',
  // DRAFT: the scanner isn't built for the beta
  scanSoonTitle: 'Scanning is coming soon',
  scanSoonBody: 'For now, search for a product by name, or browse by category.',
  scanSoonButton: 'Got it',
  // DRAFT
  searchResults: (count: number, query: string) => `${count} ${count === 1 ? 'result' : 'results'} for “${query}”`,
  noResults: 'Nothing matches that yet. Try a product type, a brand or an ingredient.',
  productsHeading: 'Products',
  ingredientsHeading: 'Ingredients',
  articlesHeading: 'Education',
};

export const productsCopy = {
  title: 'Products',
  forYou: 'For you',
  all: 'All',
  // DRAFT: the prototype says "products that match your quiz answers"; this matches care areas only, so it says that
  forYouNote: 'Products in the care areas you picked.',
  forYouEmpty: 'Take the quiz to see products for the care areas you pick.',
  categoryEmpty: 'No products in this category yet.',
  viewProduct: 'View product',
};

export const productCopy = {
  notFoundTitle: 'Product not found',
  notFoundBody: 'This product is not in Cuidance yet.',
  searchInstead: 'Search instead',
  // DRAFT
  sizeLabel: 'Size',
  typeLabel: 'Type',
  keyTitle: 'Ingredients with notes',
  keyHelper: 'Ingredients on this label that Cuidance has a reviewed note for.',
  allTitle: 'Full ingredient list',
  show: 'Show full list',
  hide: 'Hide full list',
  mayContain: 'May contain, depending on shade:',
  listNote: 'As listed by the retailer. Ingredient lists can change, so check the package too.',
  // From docs/quiz-outcomes/10-every-skin-tone.md, ST-03
  shadeNote: 'Every depth has a range of undertones, from pink or red to golden, neutral and olive. Compare depth first, then color direction.',
  // DRAFT
  shadePick: 'Choose your own shade at the store. This link opens the product, not a shade.',
  whereTitle: 'Where to buy',
  // DRAFT
  whereNote: 'Cuidance doesn’t sell products or earn from these links. Stock and prices change, so check the store.',
  viewAt: (store: string) => `View at ${store}`,
  searchAt: (store: string) => `Search at ${store}`,
  // From the clickable prototype, screen 11
  infoOnly: 'Informational only. Not medical advice. Talk to a professional about skin concerns.',
};

export const ingredientsCopy = {
  title: 'Ingredient lookup',
  heading: 'What’s in it?',
  intro: 'Look up an ingredient to see what it does and how it relates to your guidance.',
  inputLabel: 'Ingredient name',
  disclaimer: 'Ingredient information is for learning only and is not medical advice.',
  // DRAFT
  withNotes: 'Ingredients with reviewed notes',
  resultTitle: 'Ingredient results',
  commonlyUsed: 'Commonly used for',
  noNote: 'Cuidance doesn’t have a reviewed note for this ingredient yet.',
  foundIn: (count: number) => `Found in ${count} ${count === 1 ? 'product' : 'products'}`,
  notFoundTitle: 'Ingredient not found',
  notFoundBody: 'No product in Cuidance lists this ingredient yet.',
  infoOnly: 'Informational only. Not medical advice. Talk to a professional about skin concerns.',
};

export const educationCopy = {
  title: 'Education',
  intro: 'Search articles, tips, and explainers',
  all: 'All',
  kinds: ['All', 'Articles', 'Tips', 'Explainers'],
  readTime: (minutes: number) => `${minutes} min read`,
  sourcesTitle: 'Sources',
  notFoundTitle: 'Article not found',
  notFoundBody: 'This article may have moved.',
  backToEducation: 'Back to Education',
};

// Tile art for the Explore grid. Alyssa's arch set covers the care areas; her ChatGPT scenes
// (Nov 17) cover fragrance, tools, ingredients and education
export const exploreArt: Record<string, number> = {
  makeup: require('@/assets/art-library/area-makeup.png'),
  skin: require('@/assets/art-library/area-skin.png'),
  hair: require('@/assets/art-library/area-hair.png'),
  fragrance: require('@/assets/art-library/type-fragrance.webp'),
  body: require('@/assets/art-library/area-body.png'),
  tools: require('@/assets/art-library/explore-tools.webp'),
  ingredients: require('@/assets/art-library/explore-ingredients.webp'),
  education: require('@/assets/art-library/explore-education.webp'),
};
