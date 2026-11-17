import { supabase } from '@/lib/supabase';

export type NewSubmission = { barcode?: string; productName: string; brand: string; ingredients?: string };
export type SubmitResult = { ok: true } | { ok: false; message: string };

const SUBMIT_ERROR = 'We couldn’t add that product. Check your connection and try again.';

// Goes to the review queue as pending. It doesn't show in Cuidance until it's approved in the Admin Web
export async function submitProduct(userId: string, entry: NewSubmission): Promise<SubmitResult> {
  const ingredients = entry.ingredients?.trim();
  const { error } = await supabase.from('product_submissions').insert({
    user_id: userId,
    barcode: entry.barcode?.trim() || null,
    product_name: entry.productName.trim(),
    brand: entry.brand.trim(),
    ingredients_text: ingredients ? ingredients : null,
  });
  return error ? { ok: false, message: SUBMIT_ERROR } : { ok: true };
}
