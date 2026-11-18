// Shop and Partner Highlights content.
// SAMPLE ONLY: Cuidance has no real partnerships yet (team call, Nov 17). Every item below is
// copied from the clickable prototype's Shop screen (s19) and partner products (pa, pb, pc, pbo),
// with the expired October dates moved into December. Swap this file for a table that the
// Admin Web writes to once real partners sign on.
// Lines marked "New" aren't in the prototype (approved by Alyssa, Nov 17).

export type PartnerProduct = {
  id: string;
  brand: string;
  name: string;
  type: string;
  keyIngredients: string;
  fragrance: string;
  texture: string;
  image: number;
};

export type PartnerOffer = {
  id: string;
  kind: 'code' | 'sample';
  title: string;
  meta: string;
  code?: string;
  image: number;
};

export type PartnerCollection = {
  id: string;
  name: string;
  // The prototype's line after the product count, like "for cleansing and conditioning"
  detail: string;
  productIds: string[];
};

export type PartnerWorkshop = {
  id: string;
  title: string;
  meta: string;
  image: number;
};

export const partnerProducts: PartnerProduct[] = [
  {
    id: 'curl-cream',
    brand: 'Partner brand A',
    name: 'Curl Cream',
    type: 'Hair styling · 150 ml',
    keyIngredients: 'Glycerin, Shea butter',
    fragrance: 'None listed',
    texture: 'Light cream',
    image: require('@/assets/art-library/type-curl-cream.webp'),
  },
  {
    id: 'gel-cleanser',
    brand: 'Partner brand B',
    name: 'Gel Cleanser',
    type: 'Cleanser · 150 ml',
    keyIngredients: 'Glycerin, Aloe',
    fragrance: 'None listed',
    texture: 'Gel',
    image: require('@/assets/art-library/type-face-wash.webp'),
  },
  {
    id: 'lip-oil',
    brand: 'Partner brand C',
    name: 'Lip Oil',
    type: 'Lip care · 5 ml',
    keyIngredients: 'Jojoba oil, Tocopherol',
    fragrance: 'Light',
    texture: 'Oil',
    image: require('@/assets/art-library/type-lip-balm-oil.webp'),
  },
  {
    id: 'body-oil',
    brand: 'Partner brand B',
    name: 'Body Oil',
    type: 'Body · 100 ml',
    keyIngredients: 'Sunflower oil, Squalane',
    fragrance: 'None listed',
    texture: 'Oil',
    image: require('@/assets/art-library/type-body-oil.webp'),
  },
];

export const partnerOffers: PartnerOffer[] = [
  {
    id: 'first-order',
    kind: 'code',
    title: '15% off your first order',
    meta: 'From a partner brand · Ends Dec 15',
    code: 'CUIDANCE15',
    image: require('@/assets/art-library/type-moisturizer-jar.webp'),
  },
  {
    id: 'lotion-sample',
    kind: 'sample',
    title: 'Free travel-size body lotion',
    meta: 'With any body-care order from a partner brand · Ends Dec 31',
    image: require('@/assets/art-library/type-body-lotion.webp'),
  },
];

// The prototype's counts (8, 6 and 5 products) don't match the 4 sample products,
// so each collection shows the products it really holds
export const partnerCollections: PartnerCollection[] = [
  {
    id: 'fragrance-free',
    name: 'Fragrance-free picks',
    detail: 'from partner brands',
    productIds: ['body-oil', 'curl-cream', 'gel-cleanser'],
  },
  {
    id: 'wash-day',
    name: 'Wash-day essentials',
    detail: 'for cleansing and conditioning',
    productIds: ['curl-cream', 'gel-cleanser'],
  },
  {
    id: 'gentle-basics',
    name: 'Gentle basics for sensitive skin',
    detail: 'with short ingredient lists',
    productIds: ['gel-cleanser', 'lip-oil'],
  },
];

export const partnerWorkshops: PartnerWorkshop[] = [
  {
    id: 'wash-day-live',
    title: 'Live: Wash-day basics',
    meta: 'Thu, Dec 10 · 6 pm · Free',
    image: require('@/assets/art-library/type-shampoo.webp'),
  },
  {
    id: 'shade-matching',
    title: 'Shade matching across every skin tone',
    meta: 'Recorded · 20 min',
    image: require('@/assets/art-library/type-foundation.webp'),
  },
  {
    id: 'read-a-label',
    title: 'How to read a product label',
    meta: 'Recorded · 12 min',
    image: require('@/assets/art-library/article-read-a-label.webp'),
  },
];

export const shopCopy = {
  title: 'Shop',
  notice: 'Everything in Shop is paid or commercial content. Free guidance lives in Home and Explore.',
  // New: tells beta testers these partners are made up
  sampleNote: 'Sample partners for the beta. Cuidance has no real partnerships yet.',
  tabs: [
    { key: 'all', label: 'All' },
    { key: 'offers', label: 'Offers' },
    { key: 'collections', label: 'Collections' },
    { key: 'workshops', label: 'Workshops' },
  ],
  // New: row titles on the All tab
  productsRow: 'Partner products',
  offersRow: 'Offers',
  collectionsRow: 'Collections',
  workshopsRow: 'Workshops',
  seeAll: 'See all',
  collectionsIntro: 'Groups of partner products, put together by brands.',
  workshopsIntro: "Classes and how-tos hosted by partner brands. They open on the partner's site.",
  kinds: {
    code: 'Discount code',
    sample: 'Free sample',
    collection: 'Partner collection',
    workshop: 'Partner workshop',
  },
  codeLabel: 'Discount code',
  copyCode: 'Copy code · open partner site',
  openSite: 'Open partner site',
  opensSite: 'Opens partner site',
  collectionCount: (count: number, detail: string) => `${count} ${count === 1 ? 'product' : 'products'} ${detail}`,
  // Prototype toast, with the sample-partner line in place of "Opens partner site"
  codeCopied: (code: string) => `Code ${code} copied. This is a sample partner, so there is no partner site to open yet.`,
  // New: these partners are made up, so there is no site to open
  noSite: 'This is a sample partner, so there is no partner site to open yet.',
  // Partner product page (prototype 14B, from Shop)
  fromShop: 'From Shop · Partner content',
  partnerBox: 'From Shop · Partner content. Kept separate from your guidance.',
  notesTitle: 'Ingredient and product notes',
  keyIngredients: 'Key ingredients',
  fragrance: 'Fragrance',
  texture: 'Texture',
  siteHelper: "Opens the partner's site. No checkout in Cuidance.",
  // New: not found states
  productNotFoundTitle: 'Partner product not found',
  collectionNotFoundTitle: 'Collection not found',
  notFoundBody: 'It may have ended. Head back to Shop to see what is running now.',
  backToShop: 'Back to Shop',
};
