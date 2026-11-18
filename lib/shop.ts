import * as Clipboard from 'expo-clipboard';

import {
  partnerCollections,
  partnerProducts,
  type PartnerCollection,
  type PartnerProduct,
} from '@/data/partnerContent';

export function findPartnerProduct(id: string | undefined): PartnerProduct | undefined {
  return partnerProducts.find((product) => product.id === id);
}

// Saved partner products share user_products with catalog products, so their ids carry a
// prefix that can never clash with a catalog id
const PARTNER_PREFIX = 'partner:';

export function partnerRef(id: string): string {
  return PARTNER_PREFIX + id;
}

export function partnerFromRef(ref: string): PartnerProduct | undefined {
  return ref.startsWith(PARTNER_PREFIX) ? findPartnerProduct(ref.slice(PARTNER_PREFIX.length)) : undefined;
}

export function findCollection(id: string | undefined): PartnerCollection | undefined {
  return partnerCollections.find((collection) => collection.id === id);
}

export function collectionProducts(collection: PartnerCollection): PartnerProduct[] {
  return collection.productIds
    .map((id) => findPartnerProduct(id))
    .filter((product): product is PartnerProduct => Boolean(product));
}

// Copies the code so people can paste it on the partner's site
export async function copyCode(code: string): Promise<boolean> {
  try {
    return await Clipboard.setStringAsync(code);
  } catch {
    return false;
  }
}
