import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { layout, letterSpacing, sizes, space, stroke, type } from '@/constants/tokens';
import { makeStyles, useColors } from '@/hooks/useTheme';
import { isFocused } from '@/lib/focus';

type SectionHeaderProps = {
  title: string;
  // A short caps line above the title
  eyebrow?: string;
  // A link on the right, like "See all"
  actionLabel?: string;
  onAction?: () => void;
  // `partnerBand` for text on the Partner Highlights band
  tone?: 'page' | 'partnerBand';
};

// The editorial section title used down Home (Home v2, Nov 25): a Newsreader heading with an optional
// eyebrow and link. Built to be shared by Explore, Saved, Shop and Profile later
export function SectionHeader({ title, eyebrow, actionLabel, onAction, tone = 'page' }: SectionHeaderProps) {
  const styles = useStyles();
  const c = useColors();
  const onBand = tone === 'partnerBand';
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        {eyebrow ? <Text style={[styles.eyebrow, onBand && styles.onBand]}>{eyebrow}</Text> : null}
        <Text style={[styles.title, onBand && styles.onBand]} accessibilityRole="header">
          {title}
        </Text>
      </View>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="link"
          accessibilityLabel={`${actionLabel}: ${title}`}
          style={(state) => [styles.action, isFocused(state) && styles.focused]}
        >
          <Text style={[styles.link, onBand && styles.onBand]}>{actionLabel}</Text>
          <Icon name="arrow" size={sizes.icon.medium} color={onBand ? c.onPartnerBand : c.accent} />
        </Pressable>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  // Wraps, so at large text sizes the link drops under the title instead of squeezing it
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    columnGap: space[12],
  },
  text: {
    flexShrink: 1,
    gap: space[4],
  },
  eyebrow: {
    ...type.eyebrow,
    color: c.highlight,
    textTransform: 'uppercase',
    letterSpacing: letterSpacing.eyebrow,
  },
  title: {
    ...type.heading,
    color: c.ink,
  },
  action: {
    minHeight: layout.minTouchTarget,
    minWidth: layout.minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
  },
  link: {
    ...type.label,
    color: c.accent,
  },
  onBand: {
    color: c.onPartnerBand,
  },
  focused: {
    outlineColor: c.accent,
    outlineStyle: 'solid',
    outlineWidth: stroke.strong,
  },
}));
