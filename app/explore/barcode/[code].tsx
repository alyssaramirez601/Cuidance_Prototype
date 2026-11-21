import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ListRow } from '@/components/ListRow';
import { LoadError } from '@/components/LoadError';
import { LoadingState } from '@/components/LoadingState';
import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { layout, radius, space, stroke, type } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';
import { productCopy, scanCopy } from '@/data/exploreCopy';
import { lookupBarcode, type BarcodeLookup } from '@/lib/barcode';
import { searchStoreLinks } from '@/lib/explore';

// What a scanned or typed barcode turned up. A Cuidance product opens its own page instead
export default function BarcodeScreen() {
  const styles = useStyles();
  const router = useRouter();
  const { code = '' } = useLocalSearchParams<{ code: string }>();
  const [result, setResult] = useState<BarcodeLookup | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    lookupBarcode(code).then((next) => {
      if (!active) return;
      if (next.status === 'cuidance') {
        router.replace(`/explore/product/${next.product.id}`);
        return;
      }
      setResult(next);
    });
    return () => {
      active = false;
    };
  }, [code, attempt, router]);

  if (!result) return <LoadingState label={scanCopy.looking} />;

  if (result.status === 'error') {
    return (
      <Screen>
        <PageHeader title={scanCopy.title} backTo="/explore/scan" />
        <LoadError
          message={result.message}
          onRetry={() => {
            setResult(null);
            setAttempt((n) => n + 1);
          }}
        />
      </Screen>
    );
  }

  if (result.status !== 'open') {
    return (
      <Screen>
        <PageHeader title={scanCopy.notFoundTitle} backTo="/explore/scan" />
        <Image source={scanCopy.notFoundArt} style={styles.art} contentFit="contain" accessible={false} />
        <Text style={styles.body}>
          {scanCopy.notFoundBody} {scanCopy.notFoundAddBody}
        </Text>
        <Text style={styles.code}>{scanCopy.barcodeNote(code)}</Text>
        <Button
          label={scanCopy.addManually}
          onPress={() => router.push({ pathname: '/explore/add-product', params: { code } })}
        />
        <Button label={scanCopy.searchInstead} style="secondary" onPress={() => router.navigate('/explore')} />
        <Button label={scanCopy.scanAgain} style="ghost" onPress={() => router.replace('/explore/scan')} />
      </Screen>
    );
  }

  const product = result.product;
  return (
    <Screen>
      <PageHeader title={product.name} intro={product.brand || undefined} backTo="/explore/scan" />

      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>{scanCopy.openTitle}</Text>
        <Text style={styles.body}>{scanCopy.openBody}</Text>
      </View>

      {product.quantity ? (
        <View style={styles.fact}>
          <Text style={styles.caption}>{scanCopy.sizeLabel}</Text>
          <Text style={styles.factValue}>{product.quantity}</Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          {scanCopy.ingredientsTitle}
        </Text>
        <Text style={styles.body}>{product.ingredients.length ? product.ingredients.join(', ') : scanCopy.noIngredients}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          {productCopy.whereTitle}
        </Text>
        {searchStoreLinks(`${product.brand} ${product.name}`).map((link) => (
          <ListRow key={link.store} label={productCopy.searchAt(link.store)} onPress={() => Linking.openURL(link.url)} />
        ))}
        <Text style={styles.caption}>{productCopy.whereNote}</Text>
      </View>

      <Pressable
        onPress={() => Linking.openURL(scanCopy.openCreditUrl)}
        accessibilityRole="link"
        accessibilityLabel={scanCopy.openCredit}
        style={styles.credit}
      >
        <Text style={styles.link}>{scanCopy.openCredit}</Text>
      </Pressable>
      <Text style={styles.caption}>{productCopy.infoOnly}</Text>
      <Button label={scanCopy.scanAgain} style="secondary" onPress={() => router.replace('/explore/scan')} />
    </Screen>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  code: {
    ...type.caption,
    color: c.inkMuted,
  },
  art: {
    alignSelf: 'center',
    width: '70%',
    aspectRatio: 1,
  },
  notice: {
    gap: space[4],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    backgroundColor: c.infoSurface,
  },
  noticeTitle: {
    ...type.label,
    color: c.info,
  },
  fact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: space[8],
    borderTopWidth: stroke.default,
    borderTopColor: c.border,
  },
  factValue: {
    ...type.label,
    color: c.ink,
  },
  section: {
    gap: space[8],
  },
  sectionTitle: {
    ...type.title,
    color: c.ink,
  },
  body: {
    ...type.body,
    color: c.ink,
  },
  caption: {
    ...type.caption,
    color: c.inkMuted,
  },
  credit: {
    minHeight: layout.minTouchTarget,
    justifyContent: 'center',
  },
  link: {
    ...type.label,
    color: c.accent,
  },
}));
