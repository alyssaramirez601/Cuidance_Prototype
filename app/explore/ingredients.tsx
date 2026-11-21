import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ArtTile } from '@/components/ArtTile';
import { ListRow } from '@/components/ListRow';
import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { TextInput } from '@/components/TextInput';
import { space, type } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';
import { exploreCopy, ingredientsCopy } from '@/data/exploreCopy';
import { ingredientNotes } from '@/data/ingredientNotes';
import { ingredientArt, searchIngredients } from '@/lib/explore';

// Prototype screen 10. Before typing, it lists the ingredients Cuidance has reviewed notes for
export default function IngredientsScreen() {
  const styles = useStyles();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const results = searchIngredients(query);
  const open = (name: string) => router.push({ pathname: '/explore/ingredient/[name]', params: { name } });

  return (
    <Screen>
      <PageHeader title={ingredientsCopy.heading} intro={ingredientsCopy.intro} backTo="/explore" />
      <TextInput label={ingredientsCopy.inputLabel} value={query} onChangeText={setQuery} autoCorrect={false} returnKeyType="search" />

      {query.trim() ? (
        <View style={styles.list}>
          {results.length === 0 ? <Text style={styles.body}>{exploreCopy.noResults}</Text> : null}
          {results.slice(0, 30).map((name) => (
            <ListRow key={name} label={name} leading={<ArtTile art={ingredientArt(name)} />} onPress={() => open(name)} />
          ))}
        </View>
      ) : (
        <View style={styles.list}>
          <Text style={styles.heading} accessibilityRole="header">
            {ingredientsCopy.withNotes}
          </Text>
          {ingredientNotes.map((note) => (
            <ListRow
              key={note.name}
              label={note.name}
              detail={note.role}
              leading={<ArtTile art={ingredientArt(note.name)} />}
              onPress={() => open(note.name)}
            />
          ))}
        </View>
      )}

      <Text style={styles.caption}>{ingredientsCopy.disclaimer}</Text>
    </Screen>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  list: {
    gap: space[8],
  },
  heading: {
    ...type.title,
    color: c.ink,
  },
  body: {
    ...type.body,
    color: c.inkMuted,
  },
  caption: {
    ...type.caption,
    color: c.inkMuted,
  },
}));
