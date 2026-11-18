import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ListRow } from '@/components/ListRow';
import { Sheet } from '@/components/Sheet';
import { TextInput } from '@/components/TextInput';
import { Toast } from '@/components/Toast';
import { colors, space, type } from '@/constants/tokens';
import { savedCopy } from '@/data/draftCopy';
import { useBoards } from '@/hooks/useBoards';
import { addPin, createBoard, type PinKind } from '@/lib/boards';

type AddToBoardSheetProps = {
  visible: boolean;
  onClose: () => void;
  userId: string;
  kind: PinKind;
  pinRef: string;
};

// "Add to board", like Pinterest's save: pick a board, or name a new one and pin to it in one go
export function AddToBoardSheet({ visible, onClose, userId, kind, pinRef }: AddToBoardSheetProps) {
  const { state, reload } = useBoards(userId);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function pinTo(boardId: string, boardName: string) {
    setBusy(true);
    setNotice(null);
    const result = await addPin(userId, boardId, kind, pinRef);
    setBusy(false);
    setNotice(result.ok ? { type: 'success', message: savedCopy.pinned(boardName) } : { type: 'error', message: result.message });
    if (result.ok) reload();
  }

  async function createAndPin() {
    setBusy(true);
    setNotice(null);
    const made = await createBoard(userId, name);
    setBusy(false);
    if (!made.ok) {
      setNotice({ type: 'error', message: made.message });
      return;
    }
    const boardName = name.trim();
    setName('');
    await pinTo(made.id, boardName);
  }

  const boards = state.status === 'ready' ? state.boards : [];

  return (
    <Sheet visible={visible} title={savedCopy.addToBoard} onClose={onClose}>
      <View style={styles.body}>
        {notice ? <Toast type={notice.type} message={notice.message} /> : null}
        {boards.length ? <Text style={styles.heading}>{savedCopy.chooseBoard}</Text> : null}
        {boards.map((board) => {
          const already = board.pins.some((p) => p.kind === kind && p.ref === pinRef);
          return (
            <ListRow
              key={board.id}
              label={board.name}
              detail={already ? savedCopy.alreadyPinned : savedCopy.pinCount(board.pins.length)}
              onPress={() => (already || busy ? undefined : pinTo(board.id, board.name))}
            />
          );
        })}
        <Text style={styles.heading}>{savedCopy.newBoard}</Text>
        <TextInput label={savedCopy.boardName} helper={savedCopy.boardNameHelper} value={name} onChangeText={setName} maxLength={60} />
        <Button
          label={savedCopy.create}
          state={name.trim() ? undefined : 'disabled'}
          loading={busy}
          onPress={createAndPin}
        />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: space[12],
  },
  heading: {
    ...type.label,
    color: colors.light.ink,
  },
});
