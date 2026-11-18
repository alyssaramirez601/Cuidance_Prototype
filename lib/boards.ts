import { supabase } from '@/lib/supabase';

export type PinKind = 'product' | 'article' | 'result';
export type Pin = { id: string; kind: PinKind; ref: string; createdAt: string };
export type Board = { id: string; name: string; createdAt: string; pins: Pin[] };

export type BoardsResult = { ok: true; boards: Board[] } | { ok: false; message: string };
export type CreateResult = { ok: true; id: string } | { ok: false; message: string };
export type ActionResult = { ok: true } | { ok: false; message: string };

const LOAD_ERROR = 'We couldn’t load your boards. Check your connection and try again.';
const SAVE_ERROR = 'We couldn’t save that. Check your connection and try again.';

type Row = {
  id: string;
  name: string;
  created_at: string;
  board_pins: { id: string; kind: PinKind; ref: string; created_at: string }[];
};

// Newest board first, and newest pin first inside each board, like Pinterest
export async function listBoards(userId: string): Promise<BoardsResult> {
  const { data, error } = await supabase
    .from('boards')
    .select('id, name, created_at, board_pins(id, kind, ref, created_at)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) return { ok: false, message: LOAD_ERROR };
  return {
    ok: true,
    boards: (data as Row[]).map((row) => ({
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
      pins: (row.board_pins ?? [])
        .map((p) => ({ id: p.id, kind: p.kind, ref: p.ref, createdAt: p.created_at }))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    })),
  };
}

export async function createBoard(userId: string, name: string): Promise<CreateResult> {
  const { data, error } = await supabase.from('boards').insert({ user_id: userId, name: name.trim() }).select('id').single();
  return error || !data ? { ok: false, message: SAVE_ERROR } : { ok: true, id: data.id as string };
}

export async function deleteBoard(boardId: string): Promise<ActionResult> {
  const { error } = await supabase.from('boards').delete().eq('id', boardId);
  return error ? { ok: false, message: SAVE_ERROR } : { ok: true };
}

// Pinning the same thing twice is a no-op, so double taps don't create duplicates
export async function addPin(userId: string, boardId: string, kind: PinKind, ref: string): Promise<ActionResult> {
  const { error } = await supabase
    .from('board_pins')
    .upsert({ user_id: userId, board_id: boardId, kind, ref }, { onConflict: 'board_id,kind,ref', ignoreDuplicates: true });
  return error ? { ok: false, message: SAVE_ERROR } : { ok: true };
}

export async function removePin(pinId: string): Promise<ActionResult> {
  const { error } = await supabase.from('board_pins').delete().eq('id', pinId);
  return error ? { ok: false, message: SAVE_ERROR } : { ok: true };
}
