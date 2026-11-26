import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { layout, space, type } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';

type SwipeRowProps = {
  title: string;
  children: ReactNode;
  // Shown on the right of the title when there is a page with everything
  seeAllLabel?: string;
  onSeeAll?: () => void;
  // Replaces the default title row, for example with SectionHeader (Home v2). Shop keeps the default
  header?: ReactNode;
};

// A titled row of cards you swipe sideways, like the rows on Ulta and Sephora. Used on Home and Shop
export function SwipeRow({ title, children, seeAllLabel, onSeeAll, header }: SwipeRowProps) {
  const styles = useStyles();
  return (
    <View style={styles.section}>
      {header ?? (
      <View style={styles.head}>
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        {onSeeAll && seeAllLabel ? (
          <Pressable onPress={onSeeAll} accessibilityRole="link" accessibilityLabel={`${seeAllLabel}: ${title}`} style={styles.seeAll}>
            <Text style={styles.link}>{seeAllLabel}</Text>
          </Pressable>
        ) : null}
      </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.content}>
        {children}
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  section: {
    gap: space[12],
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...type.heading,
    color: c.ink,
  },
  seeAll: {
    minHeight: layout.minTouchTarget,
    justifyContent: 'center',
  },
  link: {
    ...type.label,
    color: c.accent,
  },
  // A sideways row inside the page scroll grows to fill the screen unless told not to
  bleed: {
    marginHorizontal: -layout.screenEdge,
    flexGrow: 0,
    flexShrink: 0,
  },
  content: {
    gap: space[12],
    paddingHorizontal: layout.screenEdge,
  },
}));
