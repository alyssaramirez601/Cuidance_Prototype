import { StyleSheet, Text, View } from 'react-native';

import { space, type } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';

type ComingNextProps = {
  title: string;
  body: string;
};

// Temporary stand-in for a tab that's being built next, so the tab bar has no dead ends
export function ComingNext({ title, body }: ComingNextProps) {
  const styles = useStyles();
  return (
    <View style={styles.wrap}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  wrap: {
    gap: space[8],
  },
  title: {
    ...type.heading,
    color: c.ink,
  },
  body: {
    ...type.body,
    color: c.inkMuted,
  },
}));
