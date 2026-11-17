import { products, type Product } from '@/data/products';

// Barcode lookup for Scan. First Open Beauty Facts (free, open data under the ODbL), then a
// match against Cuidance's own products by brand and name. Nothing about the person is sent
const OBF_URL = (code: string) =>
  `https://world.openbeautyfacts.org/api/v2/product/${encodeURIComponent(code)}.json?fields=product_name,brands,ingredients_text,quantity`;

export type OpenProduct = { name: string; brand: string; quantity: string; ingredients: string[] };

export type BarcodeLookup =
  | { status: 'cuidance'; product: Product }
  | { status: 'open'; product: OpenProduct }
  | { status: 'missing' }
  | { status: 'error'; message: string };

const LOOKUP_ERROR = 'We couldn’t look that up. Check your connection and try again.';

function norm(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

// A loose match: same brand, and most words of our product name appear in theirs
function matchCuidance(open: OpenProduct): Product | undefined {
  const brand = norm(open.brand);
  const name = norm(open.name);
  return products.find((p) => {
    if (!brand || !norm(p.brand).split(' ').some((word) => word.length > 2 && brand.includes(word))) return false;
    const words = norm(p.name).split(' ').filter((w) => w.length > 3);
    const hits = words.filter((w) => name.includes(w)).length;
    return words.length > 0 && hits / words.length >= 0.6;
  });
}

// Barcodes are 8 to 14 digits (EAN-8, UPC-A, EAN-13, GTIN-14)
export function isBarcode(text: string): boolean {
  return /^\d{8,14}$/.test(text.trim());
}

export async function lookupBarcode(code: string): Promise<BarcodeLookup> {
  try {
    const response = await fetch(OBF_URL(code.trim()));
    if (response.status === 404) return { status: 'missing' };
    if (!response.ok) return { status: 'error', message: LOOKUP_ERROR };
    const json = (await response.json()) as {
      status?: number;
      product?: { product_name?: string; brands?: string; ingredients_text?: string; quantity?: string };
    };
    if (json.status !== 1 || !json.product?.product_name) return { status: 'missing' };
    const open: OpenProduct = {
      name: json.product.product_name.trim(),
      brand: (json.product.brands ?? '').split(',')[0].trim(),
      quantity: (json.product.quantity ?? '').trim(),
      ingredients: (json.product.ingredients_text ?? '')
        .split(/,(?![^(]*\))/)
        .map((i) => i.trim().replace(/\.$/, ''))
        .filter(Boolean),
    };
    const ours = matchCuidance(open);
    return ours ? { status: 'cuidance', product: ours } : { status: 'open', product: open };
  } catch {
    return { status: 'error', message: LOOKUP_ERROR };
  }
}
