import { Animated, Pressable, StyleSheet, Text } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { radius, sizes, space, type } from '@/constants/tokens';
import { makeStyles, useColors } from '@/hooks/useTheme';
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
  const c = useColors();
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
      <Animated.View style={[styles.pill, isActive && styles.pillActive, isActive ? popStyle : bounceStyle]}>
        <Icon name={icon} size={sizes.icon.large} color={isActive ? c.selected : c.inkMuted} />
      </Animated.View>
      <Text style={[styles.label, { color: isActive ? c.selected : c.inkMuted }]}>{label}</Text>
    </Pressable>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  item: {
    width: sizes.tabItemWidth,
    minHeight: sizes.tabItemHeight,
    alignItems: 'center',
    gap: space[4],
  },
  pill: {
    width: sizes.tabPillWidth,
    height: sizes.tabPillHeight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space[4],
    paddingHorizontal: space[12],
    borderRadius: radius.pill,
  },
  pillActive: {
    backgroundColor: c.selectedSurface,
  },
  label: {
    ...type.caption,
  },
}));
