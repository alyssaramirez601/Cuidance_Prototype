import { Animated, Pressable, StyleSheet, Text } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { layout, radius, sizes, space, type } from '@/constants/tokens';
import { makeStyles, useTheme } from '@/hooks/useTheme';
import { usePop, usePressBounce } from '@/hooks/useMotion';

export type TabItemState = 'default' | 'active';

type TabItemProps = {
  label: string;
  icon: IconName;
  onPress: () => void;
  state?: TabItemState;
};

export function TabItem({ label, icon, onPress, state = 'default' }: TabItemProps) {
  const styles = useStyles();
  const { g } = useTheme();
  const isActive = state === 'active';
  const popStyle = usePop(isActive);
  const { bounceStyle, onPressIn, onPressOut } = usePressBounce(0.9);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: isActive }}
      style={styles.item}
    >
      {/* Floating bar (Nov 25 design): the current tab is a peach pill with its name, the rest are icons */}
      <Animated.View style={[styles.pill, isActive && styles.pillActive, isActive ? popStyle : bounceStyle]}>
        <Icon name={icon} size={sizes.icon.large} color={isActive ? g.navActiveInk : g.navInk} />
        {isActive ? <Text style={styles.label}>{label}</Text> : null}
      </Animated.View>
    </Pressable>
  );
}

const useStyles = makeStyles((_c, g) => StyleSheet.create({
  item: {
    minWidth: layout.minTouchTarget,
    minHeight: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    minWidth: layout.minTouchTarget,
    height: layout.minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[8],
    paddingHorizontal: space[12],
    borderRadius: radius.pill,
  },
  pillActive: {
    paddingHorizontal: space[16],
    backgroundColor: g.navActive,
  },
  label: {
    ...type.label,
    color: g.navActiveInk,
  },
}));
