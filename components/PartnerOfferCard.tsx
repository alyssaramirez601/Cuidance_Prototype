import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DisclosureLabel } from '@/components/DisclosureLabel';
import { layout, letterSpacing, radius, space, stroke, type } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';

type PartnerOfferCardProps = {
  eyebrow: string;
  title: string;
  meta: string;
  image: number;
  actionLabel: string;
  onAction: () => void;
  // A discount code, shown in a dashed box like a coupon
  code?: string;
  codeLabel?: string;
};

// The big offer banner from the prototype's Shop, laid out like Ulta Deals: art on top, then the offer.
// Always labeled Partner content
export function PartnerOfferCard({ eyebrow, title, meta, image, actionLabel, onAction, code, codeLabel }: PartnerOfferCardProps) {
  const styles = useStyles();
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.art} contentFit="cover" accessible={false} />
      <View style={styles.body}>
        <View style={styles.labels}>
          <DisclosureLabel type="partner" />
          <Text style={styles.eyebrow}>{eyebrow}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>{meta}</Text>
        {code ? (
          <View style={styles.code}>
            <Text style={styles.codeText} selectable>
              {code}
            </Text>
            {codeLabel ? <Text style={styles.meta}>{codeLabel}</Text> : null}
          </View>
        ) : null}
        <Button label={actionLabel} onPress={onAction} />
      </View>
    </View>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: radius.medium,
    backgroundColor: c.surface,
    borderWidth: stroke.default,
    borderColor: c.border,
  },
  art: {
    width: '100%',
    aspectRatio: 2,
    backgroundColor: c.surfaceWarm,
  },
  body: {
    gap: space[8],
    padding: layout.insideComponent,
  },
  labels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space[8],
  },
  eyebrow: {
    ...type.caption,
    fontFamily: type.label.fontFamily,
    color: c.highlight,
    textTransform: 'uppercase',
    letterSpacing: letterSpacing.eyebrow,
  },
  title: {
    ...type.title,
    color: c.ink,
  },
  meta: {
    ...type.caption,
    color: c.inkMuted,
  },
  code: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[8],
    marginVertical: space[4],
    paddingVertical: space[12],
    paddingHorizontal: layout.insideComponent,
    borderRadius: radius.small,
    borderWidth: stroke.strong,
    borderStyle: 'dashed',
    borderColor: c.borderStrong,
  },
  codeText: {
    ...type.title,
    color: c.ink,
    letterSpacing: letterSpacing.eyebrow,
  },
}));
