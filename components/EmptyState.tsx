import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { layout, radius, space, type } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';

type EmptyStateProps = {
  body: string;
  title?: string;
  // Optional small artwork above the text. Decorative only
  art?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
};

// The one "nothing here yet" panel (the audit found it rebuilt inside Saved). Always explains what
// is missing and offers a real next step. Saved can switch to it in a later phase
export function EmptyState({ body, title, art, actionLabel, onAction }: EmptyStateProps) {
  const styles = useStyles();
  return (
    <View style={styles.box}>
      {art}
      {title ? (
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
      ) : null}
      <Text style={styles.body}>{body}</Text>
      {actionLabel && onAction ? <Button label={actionLabel} style="secondary" onPress={onAction} /> : null}
    </View>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  box: {
    gap: space[12],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    backgroundColor: c.surfaceWarm,
  },
  title: {
    ...type.title,
    color: c.ink,
  },
  body: {
    ...type.body,
    color: c.ink,
  },
}));
