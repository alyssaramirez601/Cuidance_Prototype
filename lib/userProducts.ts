import { supabase } from '@/lib/supabase';

export type Reflection = 'loved' | 'not_for_me' | 'testing';
export type UserProduct = { productId: string; saved: boolean; owned: boolean; reflection: Reflection | null; updatedAt: string };

export type ListResult = { ok: true; items: UserProduct[] } | { ok: false; message: string };
export type ActionResult = { ok: true } | { ok: false; message: string };

const LOAD_ERROR = 'We couldn’t load your products. Check your connection and try again.';
const SAVE_ERROR = 'We couldn’t save that. Check your connection and try again.';

type Row = { product_id: string; saved: boolean; owned: boolean; reflection: Reflection | null; updated_at: string };

export async function listUserProducts(userId: string): Promise<ListResult> {
  const { data, error } = await supabase
    .from('user_products')
    .select('product_id, saved, owned, reflection, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  if (error) return { ok: false, message: LOAD_ERROR };
  return {
    ok: true,
    items: (data as Row[]).map((r) => ({
      productId: r.product_id,
      saved: r.saved,
      owned: r.owned,
      reflection: r.reflection,
      updatedAt: r.updated_at,
    })),
  };
}

// Saving, owning and reflecting all update the same row; a row that is neither saved nor owned is removed
export async function updateUserProduct(
  userId: string,
  productId: string,
  change: Partial<Pick<UserProduct, 'saved' | 'owned' | 'reflection'>>,
  current: UserProduct | undefined,
): Promise<ActionResult> {
  const next = {
    saved: change.saved ?? current?.saved ?? false,
    owned: change.owned ?? current?.owned ?? false,
    reflection: change.reflection !== undefined ? change.reflection : (current?.reflection ?? null),
  };
  if (!next.saved && !next.owned) {
    const { error } = await supabase.from('user_products').delete().eq('user_id', userId).eq('product_id', productId);
    return error ? { ok: false, message: SAVE_ERROR } : { ok: true };
  }
  const { error } = await supabase
    .from('user_products')
    .upsert(
      { user_id: userId, product_id: productId, ...next, reflection: next.owned ? next.reflection : null },
      { onConflict: 'user_id,product_id' },
    );
  return error ? { ok: false, message: SAVE_ERROR } : { ok: true };
}
