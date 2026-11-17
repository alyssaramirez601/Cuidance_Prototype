import { articles, type Article } from '@/data/education';
import { profileArt } from '@/data/profileCopy';
import { ingredientNotes, type IngredientNote } from '@/data/ingredientNotes';
import type { CareArea } from '@/data/outcomeTypes';
import { products, type Product } from '@/data/products';

// Everything in Explore is local data for the beta (data/products.ts and friends), so these helpers
// are plain lookups. When products move to Supabase, only this file needs to change

function norm(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

export function findProduct(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export type ProductFilter = { department?: string; category?: string; sub?: string; areas?: string[] };

export function productsFor({ department, category, sub, areas }: ProductFilter): Product[] {
  return products.filter(
    (p) =>
      (!department || p.department === department) &&
      (!category || p.category === category) &&
      (!sub || p.sub === sub) &&
      (!areas || areas.includes(p.area)),
  );
}

// How many products sit under a department, category or subcategory, so empty ones can say so
export function countFor(filter: ProductFilter): number {
  return productsFor(filter).length;
}

// Product-type illustrations from Alyssa's ChatGPT set (Nov 17). A subcategory match wins over a
// category match; anything without one falls back to the arch art for its care area
const TYPE_ART: Record<string, number> = {
  'makeup/face/foundation': require('@/assets/art-library/type-foundation.png'),
  'makeup/face/concealer': require('@/assets/art-library/type-concealer.png'),
  'makeup/face/color-correct': require('@/assets/art-library/type-concealer.png'),
  'makeup/face/blush': require('@/assets/art-library/type-blush.png'),
  'makeup/face/bronzer': require('@/assets/art-library/type-bronzer.png'),
  'makeup/face/contour': require('@/assets/art-library/type-bronzer.png'),
  'makeup/face/highlighter': require('@/assets/art-library/type-highlighter.png'),
  'makeup/face/setting': require('@/assets/art-library/type-setting-spray.png'),
  'makeup/body-makeup': require('@/assets/art-library/type-highlighter.png'),
  'makeup/face/bb-cc': require('@/assets/art-library/type-foundation.png'),
  'makeup/face/tinted-moisturizer': require('@/assets/art-library/type-foundation.png'),
  'makeup/lips': require('@/assets/art-library/type-lipstick.png'),
  'skin/moisturizers': require('@/assets/art-library/type-moisturizer-jar.png'),
  'body/moisturizers/body-butters': require('@/assets/art-library/type-moisturizer-jar.png'),
  'hair/treatment/masks': require('@/assets/art-library/type-moisturizer-jar.png'),
  'skin/treatments/serums': require('@/assets/art-library/type-serum-dropper.png'),
  'skin/moisturizers/face-oils': require('@/assets/art-library/type-serum-dropper.png'),
  'hair/treatment/oils-serums': require('@/assets/art-library/type-serum-dropper.png'),
  'hair/treatment/thinning': require('@/assets/art-library/type-serum-dropper.png'),
  'hair/treatment/scalp': require('@/assets/art-library/type-serum-dropper.png'),
  'body/moisturizers/serums-oils': require('@/assets/art-library/type-serum-dropper.png'),
  'makeup/face/remover': require('@/assets/art-library/type-makeup-remover.png'),
  'skin/cleansers/remover': require('@/assets/art-library/type-makeup-remover.png'),
  'makeup/eyes/lashes': require('@/assets/art-library/type-false-lashes.png'),
  'makeup/eyes/mascara': require('@/assets/art-library/type-mascara.png'),
  'makeup/eyes/lash-serums': require('@/assets/art-library/type-mascara.png'),
  'makeup/eyes/eyeliner': require('@/assets/art-library/type-pencils.png'),
  'makeup/eyes/brows': require('@/assets/art-library/type-pencils.png'),
  'makeup/lips/liner': require('@/assets/art-library/type-pencils.png'),
  'makeup/lips/gloss': require('@/assets/art-library/type-lip-gloss.png'),
  'makeup/lips/liquid-lipstick': require('@/assets/art-library/type-lip-gloss.png'),
  'makeup/lips/plumper': require('@/assets/art-library/type-lip-gloss.png'),
  'makeup/lips/oil': require('@/assets/art-library/type-lip-balm-oil.png'),
  'makeup/lips/balm': require('@/assets/art-library/type-lip-balm-oil.png'),
  'skin/lips': require('@/assets/art-library/type-lip-balm-oil.png'),
  'makeup/nails': require('@/assets/art-library/type-nail-polish.png'),
  'makeup/nails/press-on': require('@/assets/art-library/type-press-on-nails.png'),
  'makeup/nails/nail-art': require('@/assets/art-library/type-press-on-nails.png'),
  'makeup/eyes': require('@/assets/art-library/type-eyeshadow-palette.png'),
  'makeup/palettes': require('@/assets/art-library/type-eyeshadow-palette.png'),
  fragrance: require('@/assets/art-library/type-fragrance.png'),
  tools: require('@/assets/art-library/explore-tools.png'),
};

// `scene` art is a full square picture that fills its tile; `arch` art sits inside a warm tile
export type ProductImage = { source: number; kind: 'scene' | 'arch' };

export function productImage(product: Product): ProductImage {
  const scene =
    TYPE_ART[`${product.department}/${product.category}/${product.sub}`] ??
    TYPE_ART[`${product.department}/${product.category}`] ??
    TYPE_ART[product.department];
  if (scene) return { source: scene, kind: 'scene' };
  return { source: profileArt.areas[product.area] ?? profileArt.areas.products, kind: 'arch' };
}

export function productArt(product: Product) {
  return productImage(product).source;
}

export function searchProducts(query: string): Product[] {
  const q = norm(query);
  if (!q) return [];
  return products.filter((p) =>
    [p.brand, p.name, p.type].some((field) => norm(field).includes(q)) || p.ingredients.some((i) => norm(i).includes(q)),
  );
}

export function searchArticles(query: string): Article[] {
  const q = norm(query);
  if (!q) return [];
  return articles.filter((a) => norm(a.title).includes(q) || a.paragraphs.some((p) => norm(p).includes(q)));
}

export function findArticle(id: string): Article | undefined {
  return articles.find((article) => article.id === id);
}

// Notes are written for one care area ("helps soften hair in conditioners" is a hair note), so they
// only show on products from that area. The answer-card code prefix says which area it is
const CODE_AREAS: Record<string, CareArea> = { SK: 'skin', HR: 'hair', MU: 'makeup', BD: 'body', PR: 'products' };

export function noteArea(note: IngredientNote): CareArea {
  return CODE_AREAS[note.code.slice(0, 2)] ?? 'products';
}

// The reviewed note whose spellings appear in this ingredient name, if any. Pass an area to only
// accept notes written for that area
export function noteFor(ingredient: string, area?: CareArea): IngredientNote | undefined {
  const n = norm(ingredient);
  return ingredientNotes.find((note) => (!area || noteArea(note) === area) && note.matches.some((m) => n.includes(m)));
}

// Every reviewed note that covers this ingredient, across areas, for the ingredient page
export function notesFor(ingredient: string): IngredientNote[] {
  const n = norm(ingredient);
  return ingredientNotes.filter((note) => norm(note.name) === n || note.matches.some((m) => n.includes(m)));
}

// Every ingredient name used by at least one product, plus every reviewed note, for the lookup list
export function allIngredientNames(): string[] {
  const names = new Map<string, string>();
  for (const note of ingredientNotes) names.set(norm(note.name), note.name);
  for (const p of products) for (const i of p.ingredients) if (!names.has(norm(i))) names.set(norm(i), i);
  return [...names.values()].sort((a, b) => a.localeCompare(b));
}

export function searchIngredients(query: string): string[] {
  const q = norm(query);
  if (!q) return [];
  return allIngredientNames().filter((name) => norm(name).includes(q));
}

// Products whose label lists this ingredient, or anything the same reviewed note covers
export function productsWithIngredient(name: string): Product[] {
  const notes = notesFor(name);
  const n = norm(name);
  return products.filter((p) =>
    p.ingredients.concat(p.mayContain ?? []).some((i) => {
      const ni = norm(i);
      return ni === n || notes.some((note) => note.matches.some((m) => ni.includes(m)));
    }),
  );
}

// Ingredients on a product's label that have a reviewed note, one row per note
export function notedIngredients(product: Product): { label: string; note: IngredientNote }[] {
  const seen = new Set<string>();
  const rows: { label: string; note: IngredientNote }[] = [];
  for (const ingredient of product.ingredients.concat(product.mayContain ?? [])) {
    const note = noteFor(ingredient, product.area);
    if (note && !seen.has(note.code + note.name)) {
      seen.add(note.code + note.name);
      rows.push({ label: ingredient, note });
    }
  }
  return rows;
}

// Where to buy: the retailer we checked gets a direct link; other stores get a search link,
// because we haven't confirmed they carry it
export type StoreLink = { store: string; url: string; checked: boolean };

const SEARCH_URLS: Record<string, (q: string) => string> = {
  Ulta: (q) => `https://www.ulta.com/search?search=${q}`,
  Sephora: (q) => `https://www.sephora.com/search?keyword=${q}`,
  Target: (q) => `https://www.target.com/s?searchTerm=${q}`,
  CVS: (q) => `https://www.cvs.com/search?searchTerm=${q}`,
  Walmart: (q) => `https://www.walmart.com/search?q=${q}`,
  Amazon: (q) => `https://www.amazon.com/s?k=${q}`,
};

export function storeLinks(product: Product): StoreLink[] {
  const q = encodeURIComponent(`${product.brand} ${product.name}`);
  const links: StoreLink[] = [{ store: product.retailer, url: product.url, checked: true }];
  for (const [store, build] of Object.entries(SEARCH_URLS)) {
    if (store !== product.retailer) links.push({ store, url: build(q), checked: false });
  }
  return links;
}
