import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { colors, layout, radius, space, type } from '@/constants/tokens';
import { findDepartment } from '@/data/categories';
import { departmentCopy, exploreArt } from '@/data/exploreCopy';
import { categoryArt, countFor } from '@/lib/explore';

const c = colors.light;

// A department's landing page, like tapping Makeup in the Ulta or Sephora app: each category is a
// heading with a grid of picture cards for its subcategories (Foundation, Blush, Mascara...)
export default function DepartmentScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const department = findDepartment(id);

  if (!department) {
    return (
      <Screen>
        <PageHeader title={departmentCopy.notFoundTitle} intro={departmentCopy.notFoundBody} backTo="/explore" />
        <Button label={departmentCopy.backToExplore} onPress={() => router.navigate('/explore')} />
      </Screen>
    );
  }

  const fallback = exploreArt[department.id];
  const open = (params: Record<string, string>) =>
    router.push({ pathname: '/explore/products', params: { department: department.id, ...params } });

  // Categories with no subcategories (Body makeup, Perfume...) share one grid at the end
  const withSubs = department.categories.filter((cat) => cat.subs.length > 0);
  const single = department.categories.filter((cat) => cat.subs.length === 0);

  return (
    <Screen>
      <PageHeader title={department.label} backTo="/explore" />
      <Button label={departmentCopy.shopAll(department.label)} style="secondary" onPress={() => open({})} />

      {withSubs.map((cat) => (
        <View key={cat.id} style={styles.section}>
          <View style={styles.head}>
            <Text style={styles.heading} accessibilityRole="header">
              {cat.label}
            </Text>
            <Pressable
              onPress={() => open({ category: cat.id })}
              accessibilityRole="link"
              accessibilityLabel={departmentCopy.seeAllIn(cat.label)}
              style={styles.seeAll}
            >
              <Text style={styles.link}>{departmentCopy.seeAll}</Text>
            </Pressable>
          </View>
          <View style={styles.grid}>
            {cat.subs.map((sub) => (
              <Tile
                key={sub.id}
                label={sub.label}
                art={categoryArt(department.id, cat.id, sub.id) ?? fallback}
                count={countFor({ department: department.id, category: cat.id, sub: sub.id })}
                onPress={() => open({ category: cat.id, sub: sub.id })}
              />
            ))}
          </View>
        </View>
      ))}

      {single.length ? (
        <View style={styles.section}>
          {withSubs.length ? (
            <Text style={styles.heading} accessibilityRole="header">
              {departmentCopy.more}
            </Text>
          ) : null}
          <View style={styles.grid}>
            {single.map((cat) => (
              <Tile
                key={cat.id}
                label={cat.label}
                art={categoryArt(department.id, cat.id) ?? fallback}
                count={countFor({ department: department.id, category: cat.id })}
                onPress={() => open({ category: cat.id })}
              />
            ))}
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

function Tile({ label, art, count, onPress }: { label: string; art: number; count: number; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${departmentCopy.count(count)}`}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
      <View style={styles.tileArt}>
        <Image source={art} style={StyleSheet.absoluteFill} contentFit="cover" accessible={false} />
      </View>
      <Text style={styles.tileLabel} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space[12],
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    ...type.title,
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
  // Three across, like the reference apps' category pictures
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: '3.5%',
    rowGap: space[16],
  },
  tile: {
    width: '31%',
    gap: space[8],
  },
  pressed: {
    opacity: 0.8,
  },
  tileArt: {
    aspectRatio: 1,
    borderRadius: radius.medium,
    overflow: 'hidden',
    backgroundColor: c.surfaceWarm,
  },
  tileLabel: {
    ...type.caption,
    color: c.ink,
    textAlign: 'center',
  },
});
