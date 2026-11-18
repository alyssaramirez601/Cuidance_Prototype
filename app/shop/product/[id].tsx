import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DisclosureLabel } from '@/components/DisclosureLabel';
import { Note } from '@/components/Note';
import { PageHeader } from '@/components/PageHeader';
import { ProductActions } from '@/components/ProductActions';
import { Screen } from '@/components/Screen';
import { colors, layout, letterSpacing, radius, space, stroke, type } from '@/constants/tokens';
import { shopCopy } from '@/data/partnerContent';
import { useAuth } from '@/hooks/useAuth';
import { findPartnerProduct, partnerRef } from '@/lib/shop';

const c = colors.light;

// A partner product (prototype 14B, from Shop). Its own page, apart from the guidance
// product pages, so partner content never mixes with Cuidance's notes
export default function PartnerProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = findPartnerProduct(id);
  const [message, setMessage] = useState('');
  const { session } = useAuth();

  if (!product) {
    return (
      <Screen>
        <PageHeader title={shopCopy.productNotFoundTitle} intro={shopCopy.notFoundBody} backTo="/shop" />
        <Button label={shopCopy.backToShop} onPress={() => router.navigate('/shop')} />
      </Screen>
    );
  }

  const notes = [
    [shopCopy.keyIngredients, product.keyIngredients],
    [shopCopy.fragrance, product.fragrance],
    [shopCopy.texture, product.texture],
  ];

  return (
    <Screen
      footer={
        <View style={styles.footer}>
          <Button label={shopCopy.openSite} onPress={() => setMessage(shopCopy.noSite)} />
          <Text style={styles.helper}>{shopCopy.siteHelper}</Text>
        </View>
      }
    >
      <PageHeader title={product.name} backTo="/shop" />
      <Text style={styles.eyebrow}>{shopCopy.fromShop}</Text>
      <Image source={product.image} style={styles.hero} contentFit="cover" accessibilityLabel={product.name} />
      <View style={styles.facts}>
        <DisclosureLabel type="partner" />
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.detail}>{product.type}</Text>
      </View>
      {session ? <ProductActions userId={session.user.id} productId={partnerRef(product.id)} saveOnly /> : null}
      <View style={styles.box}>
        <Text style={styles.detail}>{shopCopy.partnerBox}</Text>
      </View>

      <Text style={styles.heading} accessibilityRole="header">
        {shopCopy.notesTitle}
      </Text>
      <View>
        {notes.map(([label, value]) => (
          <View key={label} style={styles.row}>
            <Text style={styles.detail}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>
      {message ? <Note text={message} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    ...type.caption,
    fontFamily: type.label.fontFamily,
    color: c.highlight,
    textTransform: 'uppercase',
    letterSpacing: letterSpacing.eyebrow,
  },
  hero: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.medium,
    backgroundColor: c.surfaceWarm,
  },
  facts: {
    gap: space[4],
  },
  brand: {
    ...type.label,
    color: c.ink,
  },
  detail: {
    ...type.caption,
    color: c.inkMuted,
  },
  box: {
    padding: layout.insideComponent,
    borderRadius: radius.small,
    borderWidth: stroke.default,
    borderColor: c.partner,
    backgroundColor: c.partnerSurface,
  },
  heading: {
    ...type.title,
    color: c.ink,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: space[16],
    paddingVertical: space[12],
    borderBottomWidth: stroke.default,
    borderBottomColor: c.border,
  },
  value: {
    ...type.label,
    color: c.ink,
    flexShrink: 1,
    textAlign: 'right',
  },
  footer: {
    gap: space[8],
  },
  helper: {
    ...type.caption,
    color: c.inkMuted,
    textAlign: 'center',
  },
});
