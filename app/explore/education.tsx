import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ArtTile } from '@/components/ArtTile';
import { Chip } from '@/components/Chip';
import { ListRow } from '@/components/ListRow';
import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { TextInput } from '@/components/TextInput';
import { colors, layout, space, type } from '@/constants/tokens';
import { areaLabels } from '@/data/draftCopy';
import { articles, type ArticleKind } from '@/data/education';
import { educationCopy, exploreCopy } from '@/data/exploreCopy';
import { articleArt, searchArticles } from '@/lib/explore';

const c = colors.light;

const KIND_FOR_CHIP: Record<string, ArticleKind | null> = { All: null, Articles: 'Article', Tips: 'Tip', Explainers: 'Explainer' };

// Prototype screens 12 and 12B in one: search, a type filter, and the article list
export default function EducationScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [chip, setChip] = useState('All');
  const kind = KIND_FOR_CHIP[chip];
  const base = query.trim() ? searchArticles(query) : articles;
  const list = base.filter((a) => !kind || a.kind === kind);

  return (
    <Screen>
      <PageHeader title={educationCopy.title} backTo="/explore" />
      <TextInput label={educationCopy.intro} value={query} onChangeText={setQuery} returnKeyType="search" />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.chipRow}>
        {educationCopy.kinds.map((k) => (
          <Chip key={k} label={k} state={chip === k ? 'selected' : 'default'} onPress={() => setChip(k)} />
        ))}
      </ScrollView>

      <View style={styles.list}>
        {list.length === 0 ? <Text style={styles.body}>{exploreCopy.noResults}</Text> : null}
        {list.map((article) => (
          <ListRow
            key={article.id}
            label={article.title}
            detail={`${capitalize(areaLabels[article.area])} · ${article.kind} · ${educationCopy.readTime(article.minutes)}`}
            leading={<ArtTile art={articleArt(article.id)} />}
            onPress={() => router.push(`/explore/article/${article.id}`)}
          />
        ))}
      </View>
    </Screen>
  );
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const styles = StyleSheet.create({
  // A sideways scroll row inside the page's scroll grows to fill the screen unless told not to
  bleed: {
    marginHorizontal: -layout.screenEdge,
    flexGrow: 0,
    flexShrink: 0,
  },
  chipRow: {
    gap: space[8],
    paddingHorizontal: layout.screenEdge,
  },
  list: {
    gap: space[8],
  },
  body: {
    ...type.body,
    color: c.inkMuted,
  },
});
