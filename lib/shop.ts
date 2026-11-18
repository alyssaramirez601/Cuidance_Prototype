import { Platform } from 'react-native';

import {
  partnerCollections,
  partnerProducts,
  type PartnerCollection,
  type PartnerProduct,
} from '@/data/partnerContent';

export function findPartnerProduct(id: string | undefined): PartnerProduct | undefined {
  return partnerProducts.find((product) => product.id === id);
}

export function findCollection(id: string | undefined): PartnerCollection | undefined {
  return partnerCollections.find((collection) => collection.id === id);
}

export function collectionProducts(collection: PartnerCollection): PartnerProduct[] {
  return collection.productIds
    .map((id) => findPartnerProduct(id))
    .filter((product): product is PartnerProduct => Boolean(product));
}

// Copies the code where the browser allows it. On phones this needs expo-clipboard,
// which isn't approved yet, so the caller says the code wasn't copied instead of pretending
export async function copyCode(code: string): Promise<boolean> {
  if (Platform.OS !== 'web' || typeof navigator === 'undefined' || !navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(code);
    return true;
  } catch {
    return false;
  }
}
