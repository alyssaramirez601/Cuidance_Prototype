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

// Scan, from the clickable prototype screens 08B and 08C. DRAFT lines are new
export const scanCopy = {
  title: 'Scan a product',
  aim: 'Point at barcode',
  intro: 'Scan while you shop or at home to look up ingredient and product notes.',
  // DRAFT
  permissionTitle: 'Camera access',
  permissionBody: 'Cuidance uses the camera only to read barcodes. Nothing is recorded or saved.',
  allowCamera: 'Allow camera',
  deniedBody: 'Camera access is turned off. You can turn it on in your phone’s settings, or type the barcode instead.',
  orType: 'Or type the barcode',
  barcodeLabel: 'Barcode number',
  barcodeHelper: 'The 8 to 14 digits under the barcode.',
  barcodeError: 'Enter the 8 to 14 digits under the barcode.',
  lookUp: 'Look up',
  looking: 'Looking up that barcode',
  // From prototype screen 08C
  notFoundTitle: 'Product not found',
  notFoundBody: 'This product is not in Cuidance yet.',
  searchInstead: 'Search instead',
  scanAgain: 'Scan again',
  addManually: 'Add manually',
  // From prototype screen 08C
  notFoundAddBody: 'You can add it manually so it can be reviewed before appearing in the app.',
  enterManually: 'Enter product manually',
  notFoundArt: require('@/assets/art-library/explore-not-found.webp'),
  // DRAFT: for products found in Open Beauty Facts but not in Cuidance
  openTitle: 'Found in Open Beauty Facts',
  openBody: 'This product isn’t in Cuidance yet, so these details come from Open Beauty Facts, a free product database anyone can edit. Check the package too.',
  // Add a product, from prototype screen 08D
  addTitle: 'Add a product manually',
  addIntro: 'Tell us what it is and Cuidance will look for ingredient and product notes.',
  nameLabel: 'Product name',
  brandLabel: 'Brand',
  // DRAFT: the prototype says "Ingredient list or photo (optional)"; photo upload isn't built yet
  ingredientsLabel: 'Ingredient list (optional)',
  ingredientsHelper: 'Copy it from the package if you have it.',
  reviewNote: 'Manual product entries go to admin review before they appear publicly.',
  addButton: 'Add product',
  // From the prototype's toast after adding
  added: 'Product added. Cuidance will look for notes.',
  // DRAFT
  nameRequired: 'Enter the product name.',
  brandRequired: 'Enter the brand.',
  barcodeNote: (code: string) => `Barcode ${code}`,
  openCredit: 'Product data: Open Beauty Facts, Open Database License',
  openCreditUrl: 'https://world.openbeautyfacts.org',
  noIngredients: 'No ingredient list on file for this product.',
  ingredientsTitle: 'Ingredients',
  sizeLabel: 'Size',
};

// DRAFT: a department's landing page (Nov 17), modeled on Ulta's and Sephora's category pages
export const departmentCopy = {
  shopAll: (department: string) => `Shop all ${department.toLowerCase()}`,
  seeAll: 'See all',
  seeAllIn: (category: string) => `See all ${category.toLowerCase()}`,
  more: 'More',
  count: (n: number) => (n === 1 ? '1 product' : `${n} products`),
  notFoundTitle: 'Category not found',
  notFoundBody: 'This category may have moved.',
  backToExplore: 'Back to Explore',
};
