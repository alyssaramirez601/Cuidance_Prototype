import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HelpButton } from '@/components/HelpButton';
import { Icon } from '@/components/Icon';
import { layout, sizes, space, type } from '@/constants/tokens';
import { makeStyles, useColors } from '@/hooks/useTheme';

type TopBarProps = {
  onBack: () => void;
  // Leave out on screens with nothing to explain, like Create account
  onHelp?: () => void;
};

export function TopBar({ onBack, onHelp }: TopBarProps) {
  const styles = useStyles();
  const c = useColors();
  return (
    <View style={styles.bar}>
      <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Back" style={styles.back}>
        <Icon name="back" size={sizes.icon.large} color={c.ink} />
        <Text style={styles.backLabel}>Back</Text>
      </Pressable>
      {onHelp ? <HelpButton onPress={onHelp} /> : null}
    </View>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  bar: {
    minHeight: sizes.topBarHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space[8],
    paddingHorizontal: space[16],
    backgroundColor: c.background,
  },
  back: {
    minHeight: layout.minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
  },
  backLabel: {
    ...type.label,
    color: c.ink,
  },
}));
