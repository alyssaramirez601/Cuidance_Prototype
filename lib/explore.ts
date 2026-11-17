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

// The illustration shown for a product until real photos are cleared: the arch art for its care area
export function productArt(product: Product) {
  return profileArt.areas[product.area] ?? profileArt.areas.products;
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
