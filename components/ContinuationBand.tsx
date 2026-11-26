import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { layout, radius, sizes, space, stroke, type } from '@/constants/tokens';
import { usePressBounce } from '@/hooks/useMotion';
import { makeStyles, useColors } from '@/hooks/useTheme';
import { isFocused } from '@/lib/focus';

type ContinuationBandProps = {
  title: string;
  detail?: string;
  icon: IconName;
  onPress: () => void;
  // Words on a pill for something unfinished, like "Continue guidance". Leave out for an arrow
  actionLabel?: string;
  // A second, quieter row inside the band, like "Your attributes"
  secondary?: { label: string; detail?: string; onPress: () => void };
};

// "Pick up where you left off" (Home v2, Nov 25): a contrasting band with one clear action.
// Something unfinished gets a filled pill; a place to revisit gets an arrow, so they never look alike
export function ContinuationBand({ title, detail, icon, onPress, actionLabel, secondary }: ContinuationBandProps) {
  const styles = useStyles();
  const c = useColors();
  const main = usePressBounce(0.98);
  const label = [title, detail, actionLabel].filter(Boolean).join('. ');
  return (
    <View style={styles.band}>
      {/* A cut-paper wave in the corner, drawn in code so it follows the theme */}
      <View style={styles.wave} accessible={false} />
      <Animated.View style={main.bounceStyle}>
        <Pressable
          onPress={onPress}
          onPressIn={main.onPressIn}
          onPressOut={main.onPressOut}
          accessibilityRole="button"
          accessibilityLabel={label}
          style={(state) => [styles.main, isFocused(state) && styles.focused]}
        >
          <View style={styles.iconTile}>
            <Icon name={icon} size={sizes.icon.large} color={c.ink} />
          </View>
          <View style={styles.text}>
            <Text style={styles.title}>{title}</Text>
            {detail ? <Text style={styles.detail}>{detail}</Text> : null}
          </View>
          {actionLabel ? (
            <View style={styles.pill}>
              <Text style={styles.pillText}>{actionLabel}</Text>
            </View>
          ) : (
            <View style={styles.round}>
              <Icon name="arrow" size={sizes.icon.medium} color={c.onAccent} />
            </View>
          )}
        </Pressable>
      </Animated.View>
      {secondary ? (
        <Pressable
          onPress={secondary.onPress}
          accessibilityRole="button"
          accessibilityLabel={[secondary.label, secondary.detail].filter(Boolean).join('. ')}
          style={(state) => [styles.secondary, isFocused(state) && styles.focused]}
        >
          <View style={styles.text}>
            <Text style={styles.secondaryLabel}>{secondary.label}</Text>
            {secondary.detail ? <Text style={styles.detail}>{secondary.detail}</Text> : null}
          </View>
          <Icon name="arrow" size={sizes.icon.medium} color={c.accent} />
        </Pressable>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles((c, g) => StyleSheet.create({
  band: {
    overflow: 'hidden',
    gap: space[4],
    padding: space[16],
    borderRadius: radius.medium,
    backgroundColor: c.continueSurface,
  },
  wave: {
    position: 'absolute',
    left: -space[24],
    bottom: -space[24],
    width: space[48] * 2,
    height: space[48],
    borderTopRightRadius: radius.pill,
    backgroundColor: g.blueBold,
    opacity: 0.85,
  },
  // Wraps, so at large text sizes the pill drops under the words
  main: {
    minHeight: layout.minTouchTarget,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space[12],
    borderRadius: radius.small,
  },
  focused: {
    outlineColor: c.accent,
    outlineStyle: 'solid',
    outlineWidth: stroke.strong,
  },
  iconTile: {
    width: space[48],
    height: space[48],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: c.surface,
  },
  text: {
    flex: 1,
    minWidth: space[48] * 3,
    gap: space[4],
  },
  title: {
    ...type.editorialTitle,
    color: c.ink,
  },
  detail: {
    ...type.caption,
    color: c.inkMuted,
  },
  pill: {
    minHeight: layout.minTouchTarget,
    justifyContent: 'center',
    paddingHorizontal: space[16],
    borderRadius: radius.pill,
    backgroundColor: c.accent,
  },
  pillText: {
    ...type.label,
    color: c.onAccent,
  },
  round: {
    width: layout.minTouchTarget,
    height: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: c.accent,
  },
  secondary: {
    minHeight: layout.minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    marginLeft: space[48] + space[12],
    paddingTop: space[8],
    borderTopWidth: stroke.default,
    borderTopColor: c.border,
  },
  secondaryLabel: {
    ...type.label,
    color: c.ink,
  },
}));
