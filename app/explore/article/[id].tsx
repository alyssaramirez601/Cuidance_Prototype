import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { AddToBoardSheet } from '@/components/AddToBoardSheet';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { layout, radius, sizes, space, type } from '@/constants/tokens';
import { makeStyles, useColors } from '@/hooks/useTheme';
import { areaLabels, savedCopy } from '@/data/appCopy';
import { educationCopy } from '@/data/exploreCopy';
import { useAuth } from '@/hooks/useAuth';
import { articleArt, findArticle } from '@/lib/explore';

// Prototype screen 13. The safety line sits in its own box, never inside the paragraphs
export default function ArticleScreen() {
  const styles = useStyles();
  const c = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const article = findArticle(id);
  const { session } = useAuth();
  const [boardOpen, setBoardOpen] = useState(false);

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
      <Image source={articleArt(article.id)} style={styles.hero} contentFit="cover" accessible={false} />
      {session ? (
        <>
          <Button label={savedCopy.addToBoard} style="secondary" onPress={() => setBoardOpen(true)} />
          <AddToBoardSheet
            visible={boardOpen}
            onClose={() => setBoardOpen(false)}
            userId={session.user.id}
            kind="article"
            pinRef={article.id}
          />
        </>
      ) : null}
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

const useStyles = makeStyles((c) => StyleSheet.create({
  hero: {
    width: '100%',
    aspectRatio: 3 / 2,
    borderRadius: radius.medium,
    backgroundColor: c.surfaceWarm,
  },
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
}));
