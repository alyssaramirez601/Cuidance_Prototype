import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { LoadingState } from '@/components/LoadingState';
import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { Toast } from '@/components/Toast';
import { layout, radius, sizes, space, stroke, type } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';
import { notificationsCopy, profileArt, profileCopy } from '@/data/profileCopy';
import { useAuth } from '@/hooks/useAuth';
import { useDeviceSettings } from '@/hooks/useDeviceSettings';

// Prototype screen 24. Nothing sends notifications in the beta yet; this records the choice
export default function NotificationsScreen() {
  const { session } = useAuth();
  if (!session) return <LoadingState label={profileCopy.loading} />;
  return <NotificationsContent userId={session.user.id} />;
}

function NotificationsContent({ userId }: { userId: string }) {
  const styles = useStyles();
  const { values, toggle, persist, save } = useDeviceSettings('notifications', userId);

  if (!values) return <LoadingState label={profileCopy.loading} />;

  return (
    <Screen
      footer={
        <>
          {save.status === 'saved' ? <Toast type="success" message={notificationsCopy.saved} /> : null}
          {save.status === 'error' ? <Toast type="error" message={save.message} /> : null}
          <Button label={notificationsCopy.save} loading={save.status === 'saving'} onPress={persist} />
        </>
      }
    >
      <PageHeader title={notificationsCopy.title} intro={notificationsCopy.intro} art={profileArt.notifications} />

      <View style={styles.card}>
        {notificationsCopy.toggles.map((item, index) => (
          <View key={item.title} style={styles.item}>
            <Checkbox label={item.title} state={values[index] ? 'checked' : 'unchecked'} onPress={() => toggle(index)} />
            <Text style={styles.detail}>{item.detail}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.note}>{notificationsCopy.note}</Text>
    </Screen>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  card: {
    gap: space[16],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  item: {
    gap: space[4],
  },
  // Lines up under the label, past the checkbox and its gap
  detail: {
    ...type.caption,
    color: c.inkMuted,
    paddingLeft: sizes.checkboxBox + space[12],
  },
  note: {
    ...type.caption,
    color: c.inkMuted,
  },
}));
