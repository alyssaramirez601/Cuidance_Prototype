import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { colors, layout, radius, sizes, space, type } from '@/constants/tokens';
import { areaLabels } from '@/data/draftCopy';
import { educationCopy } from '@/data/exploreCopy';
import { findArticle } from '@/lib/explore';

const c = colors.light;

// Prototype screen 13. The safety line sits in its own box, never inside the paragraphs
export default function ArticleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const article = findArticle(id);

  if (!article) {
    return (
      <Screen>
        <PageHeader title={educationCopy.notFoundTitle} intro={educationCopy.notFoundBody} backTo="/explore/education" />
        <Button label={educationCopy.backToEducation} onPress={() => router.navigate('/explore/education')} />
      </Screen>
    );
  }

  const label = areaLabels[article.area];
  return (
    <Screen>
      <PageHeader
        title={article.title}
        intro={`${label.charAt(0).toUpperCase() + label.slice(1)} · ${article.kind} · ${educationCopy.readTime(article.minutes)}`}
        backTo="/explore/education"
      />
      {article.paragraphs.map((paragraph) => (
        <Text key={paragraph.slice(0, 40)} style={styles.body}>
          {paragraph}
        </Text>
      ))}

      {article.safety ? (
        <View style={styles.safety} accessibilityRole="alert">
          <Icon name="alert" size={sizes.icon.medium} color={c.alert} />
          <Text style={styles.safetyText}>{article.safety}</Text>
        </View>
      ) : null}

      <View style={styles.sources}>
        <Text style={styles.heading} accessibilityRole="header">
          {educationCopy.sourcesTitle}
        </Text>
        {article.sources.map((source) => (
          <Pressable
            key={source.url}
            onPress={() => Linking.openURL(source.url)}
            accessibilityRole="link"
            accessibilityLabel={source.title}
            style={styles.source}
          >
            <Text style={styles.link}>{source.title}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    ...type.body,
    color: c.ink,
  },
  safety: {
    flexDirection: 'row',
    gap: space[12],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    backgroundColor: c.alertSurface,
  },
  safetyText: {
    ...type.body,
    color: c.ink,
    flex: 1,
  },
  sources: {
    gap: space[4],
  },
  heading: {
    ...type.title,
    color: c.ink,
  },
  source: {
    minHeight: layout.minTouchTarget,
    justifyContent: 'center',
  },
  link: {
    ...type.label,
    color: c.accent,
  },
});
