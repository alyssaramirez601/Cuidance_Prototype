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

export type SubmissionStatus = 'pending' | 'approved' | 'declined';
export type Submission = { id: string; productName: string; brand: string; status: SubmissionStatus; createdAt: string };
export type SubmissionsResult = { ok: true; submissions: Submission[] } | { ok: false; message: string };

const LOAD_ERROR = 'We couldn’t load the products you added. Check your connection and try again.';

// Their own submissions only (row-level security), newest first, with the review status from the Admin Web
export async function listSubmissions(userId: string): Promise<SubmissionsResult> {
  const { data, error } = await supabase
    .from('product_submissions')
    .select('id, product_name, brand, status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error || !data) return { ok: false, message: LOAD_ERROR };
  return {
    ok: true,
    submissions: data.map((row) => ({
      id: row.id as string,
      productName: row.product_name as string,
      brand: row.brand as string,
      status: row.status as SubmissionStatus,
      createdAt: row.created_at as string,
    })),
  };
}
