import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { ListRow } from '@/components/ListRow';
import { LoadingState } from '@/components/LoadingState';
import { PrivacySheet } from '@/components/PrivacySheet';
import { ProfilePageHeader } from '@/components/ProfilePageHeader';
import { Screen } from '@/components/Screen';
import { Toast } from '@/components/Toast';
import { colors, layout, radius, space, stroke, type } from '@/constants/tokens';
import { privacyCopy, profileArt, profileCopy } from '@/data/profileCopy';
import { useAuth } from '@/hooks/useAuth';
import { useDeviceSettings } from '@/hooks/useDeviceSettings';

const c = colors.light;

// Prototype screen 23
export default function PrivacyScreen() {
  const { session } = useAuth();
  if (!session) return <LoadingState label={profileCopy.loading} />;
  return <PrivacyContent userId={session.user.id} />;
}

function PrivacyContent({ userId }: { userId: string }) {
  const { values, toggle, persist, save } = useDeviceSettings('privacy', userId);
  const [sheetOpen, setSheetOpen] = useState(false);

  if (!values) return <LoadingState label={profileCopy.loading} />;

  return (
    <Screen
      footer={
        <>
          {save.status === 'saved' ? <Toast type="success" message={privacyCopy.saved} /> : null}
          {save.status === 'error' ? <Toast type="error" message={save.message} /> : null}
          <Button label={privacyCopy.review} loading={save.status === 'saving'} onPress={persist} />
        </>
      }
    >
      <ProfilePageHeader title={privacyCopy.title} intro={privacyCopy.intro} art={profileArt.privacy} />

      <View style={styles.card}>
        {privacyCopy.toggles.map((label, index) => (
          <Checkbox key={label} label={label} state={values[index] ? 'checked' : 'unchecked'} onPress={() => toggle(index)} />
        ))}
      </View>

      <Text style={styles.sectionTitle} accessibilityRole="header">
        {privacyCopy.trustTitle}
      </Text>
      <ListRow label={privacyCopy.privacyPolicy} onPress={() => setSheetOpen(true)} />

      <PrivacySheet visible={sheetOpen} onClose={() => setSheetOpen(false)} onUnderstand={() => setSheetOpen(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: space[16],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  sectionTitle: {
    ...type.title,
    color: c.ink,
  },
});
