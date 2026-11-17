import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { EvidenceDots } from '@/components/EvidenceDots';
import { ListRow } from '@/components/ListRow';
import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { colors, layout, radius, space, stroke, type } from '@/constants/tokens';
import { areaLabels } from '@/data/draftCopy';
import { ingredientsCopy } from '@/data/exploreCopy';
import { noteArea, notesFor, productArt, productsWithIngredient } from '@/lib/explore';

const c = colors.light;

// Prototype screen 11. Shows only reviewed notes (with their care area and evidence), never a guessed role
export default function IngredientScreen() {
  const router = useRouter();
  const { name = '' } = useLocalSearchParams<{ name: string }>();
  const notes = notesFor(name);
  const found = productsWithIngredient(name);

  if (!notes.length && !found.length) {
    return (
      <Screen>
        <PageHeader title={ingredientsCopy.notFoundTitle} intro={ingredientsCopy.notFoundBody} backTo="/explore/ingredients" />
        <Button label={ingredientsCopy.title} onPress={() => router.navigate('/explore/ingredients')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <PageHeader title={name} backTo="/explore/ingredients" />

      <View style={styles.section}>
        <Text style={styles.eyebrow} accessibilityRole="header">
          {ingredientsCopy.commonlyUsed}
        </Text>
        {notes.length ? (
          notes.map((note) => (
            <View key={note.code + note.name} style={styles.note}>
              <View style={styles.noteHead}>
                <Text style={styles.area}>{capitalize(areaLabels[noteArea(note)])}</Text>
                <EvidenceDots evidence={note.evidence} />
              </View>
              <Text style={styles.body}>{note.role}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.muted}>{ingredientsCopy.noNote}</Text>
        )}
      </View>

      {found.length ? (
        <View style={styles.section}>
          <Text style={styles.heading} accessibilityRole="header">
            {ingredientsCopy.foundIn(found.length)}
          </Text>
          {found.map((product) => (
            <ListRow
              key={product.id}
              label={product.name}
              detail={`${product.brand} · ${product.type}`}
              leading={<Image source={productArt(product)} style={styles.art} contentFit="contain" accessible={false} />}
              onPress={() => router.push(`/explore/product/${product.id}`)}
            />
          ))}
        </View>
      ) : null}

      <Text style={styles.caption}>{ingredientsCopy.infoOnly}</Text>
    </Screen>
  );
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const styles = StyleSheet.create({
  section: {
    gap: space[8],
  },
  eyebrow: {
    ...type.label,
    color: c.ink,
  },
  note: {
    gap: space[4],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  noteHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  area: {
    ...type.caption,
    color: c.inkMuted,
  },
  heading: {
    ...type.title,
    color: c.ink,
  },
  body: {
    ...type.body,
    color: c.ink,
  },
  muted: {
    ...type.body,
    color: c.inkMuted,
  },
  caption: {
    ...type.caption,
    color: c.inkMuted,
  },
  art: {
    width: space[32] + space[8],
    height: space[48],
  },
});
