import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AddToBoardSheet } from '@/components/AddToBoardSheet';
import { Button } from '@/components/Button';
import { Toast } from '@/components/Toast';
import { space } from '@/constants/tokens';
import { savedCopy } from '@/data/draftCopy';
import { useUserProducts } from '@/hooks/useUserProducts';

type ProductActionsProps = {
  userId: string;
  productId: string;
  // Partner products only get Save, so partner content stays out of Owned and boards
  saveOnly?: boolean;
};

// Save, I own this and Add to board for a product page. Saving writes to user_products
export function ProductActions({ userId, productId, saveOnly = false }: ProductActionsProps) {
  const { state, find, update, actionError } = useUserProducts(userId);
  const [busy, setBusy] = useState<'saved' | 'owned' | null>(null);
  const [toast, setToast] = useState('');
  const [boardOpen, setBoardOpen] = useState(false);
  const mine = find(productId);
  const ready = state.status === 'ready';

  async function toggle(field: 'saved' | 'owned') {
    setToast('');
    setBusy(field);
    const turningOn = !mine?.[field];
    const ok = await update(productId, { [field]: turningOn });
    setBusy(null);
    if (ok && turningOn) setToast(field === 'saved' ? savedCopy.savedToast : savedCopy.ownedToast);
  }

  return (
    <View style={styles.actions}>
      <View style={styles.row}>
        <View style={styles.cell}>
          <Button
            label={mine?.saved ? savedCopy.savedButton : savedCopy.save}
            style={mine?.saved ? 'primary' : 'secondary'}
            state={ready ? undefined : 'disabled'}
            loading={busy === 'saved'}
            onPress={() => toggle('saved')}
          />
        </View>
        {saveOnly ? null : (
          <View style={styles.cell}>
            <Button
              label={mine?.owned ? savedCopy.ownedButton : savedCopy.own}
              style={mine?.owned ? 'primary' : 'secondary'}
              state={ready ? undefined : 'disabled'}
              loading={busy === 'owned'}
              onPress={() => toggle('owned')}
            />
          </View>
        )}
      </View>
      {saveOnly ? null : <Button label={savedCopy.addToBoard} style="ghost" onPress={() => setBoardOpen(true)} />}
      {toast ? <Toast type="success" message={toast} /> : null}
      {actionError ? <Toast type="error" message={actionError} /> : null}
      {saveOnly ? null : (
        <AddToBoardSheet visible={boardOpen} onClose={() => setBoardOpen(false)} userId={userId} kind="product" pinRef={productId} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: space[8],
  },
  row: {
    flexDirection: 'row',
    gap: space[8],
  },
  cell: {
    flex: 1,
  },
});
