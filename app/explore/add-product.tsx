import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { LoadingState } from '@/components/LoadingState';
import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { TextInput } from '@/components/TextInput';
import { Toast } from '@/components/Toast';
import { colors, space, type } from '@/constants/tokens';
import { scanCopy } from '@/data/exploreCopy';
import { useAuth } from '@/hooks/useAuth';
import { submitProduct } from '@/lib/submissions';

const c = colors.light;

// Prototype screen 08D. A form, so it fits one screen with the actions pinned at the bottom
export default function AddProductScreen() {
  const { session } = useAuth();
  if (!session) return <LoadingState label={scanCopy.addTitle} />;
  return <AddProductForm userId={session.user.id} />;
}

function AddProductForm({ userId }: { userId: string }) {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code?: string }>();
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [touched, setTouched] = useState({ name: false, brand: false });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const nameError = touched.name && !name.trim() ? scanCopy.nameRequired : undefined;
  const brandError = touched.brand && !brand.trim() ? scanCopy.brandRequired : undefined;
  const valid = name.trim().length > 0 && brand.trim().length > 0;

  async function add() {
    setNotice(null);
    setSaving(true);
    const result = await submitProduct(userId, { barcode: code, productName: name, brand, ingredients });
    setSaving(false);
    if (!result.ok) {
      setNotice({ type: 'error', message: result.message });
      return;
    }
    setNotice({ type: 'success', message: scanCopy.added });
    setName('');
    setBrand('');
    setIngredients('');
    setTouched({ name: false, brand: false });
  }

  return (
    <Screen
      compact
      footer={
        <>
          {notice ? <Toast type={notice.type} message={notice.message} /> : null}
          <Button label={scanCopy.addButton} state={valid ? undefined : 'disabled'} loading={saving} onPress={add} />
          <Button label={scanCopy.scanAgain} style="secondary" onPress={() => router.replace('/explore/scan')} />
        </>
      }
    >
      <PageHeader title={scanCopy.addTitle} intro={scanCopy.addIntro} backTo="/explore/scan" />
      {code ? <Text style={styles.caption}>{scanCopy.barcodeNote(code)}</Text> : null}
      <View style={styles.fields}>
        <TextInput
          label={scanCopy.nameLabel}
          value={name}
          onChangeText={setName}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          error={nameError}
          maxLength={200}
        />
        <TextInput
          label={scanCopy.brandLabel}
          value={brand}
          onChangeText={setBrand}
          onBlur={() => setTouched((t) => ({ ...t, brand: true }))}
          error={brandError}
          maxLength={120}
        />
        <TextInput
          label={scanCopy.ingredientsLabel}
          helper={scanCopy.ingredientsHelper}
          value={ingredients}
          onChangeText={setIngredients}
          multiline
          maxLength={5000}
        />
      </View>
      <Text style={styles.caption}>{scanCopy.reviewNote}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: space[12],
  },
  caption: {
    ...type.caption,
    color: c.inkMuted,
  },
});
