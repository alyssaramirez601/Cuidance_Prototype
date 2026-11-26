import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { ListRow } from '@/components/ListRow';
import { LoadError } from '@/components/LoadError';
import { LoadingState } from '@/components/LoadingState';
import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { TextInput } from '@/components/TextInput';
import { Toast } from '@/components/Toast';
import { letterSpacing, space, type } from '@/constants/tokens';
import { type AppearancePreference, makeStyles, useTheme } from '@/hooks/useTheme';
import { accountCopy, profileArt, profileCopy } from '@/data/profileCopy';
import { useAuth } from '@/hooks/useAuth';
import { useProfileData } from '@/hooks/useProfileData';
import { sendPasswordReset, updateDisplayName } from '@/lib/profile';

type Notice = { type: 'success' | 'error'; message: string } | null;

// Prototype screen 25. Email stays read-only for now: changing it needs a confirmation email flow
export default function AccountScreen() {
  const { session } = useAuth();
  if (!session) return <LoadingState label={profileCopy.loading} />;
  return <AccountContent userId={session.user.id} email={session.user.email ?? ''} />;
}

function AccountContent({ userId, email }: { userId: string; email: string }) {
  const styles = useStyles();
  const { preference, setPreference } = useTheme();
  const { state, retry } = useProfileData(userId);
  // null until the person types, so the field shows the saved name without copying it into state
  const [typed, setTyped] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const savedName = state.status === 'ready' ? state.data.profile.displayName : '';

  const name = typed ?? savedName;

  if (state.status === 'loading') return <LoadingState label={profileCopy.loading} />;

  const nameError = name.trim() ? '' : accountCopy.nameRequired;
  const canSave = !nameError && name.trim() !== savedName;

  async function saveName() {
    setNotice(null);
    setIsSaving(true);
    const result = await updateDisplayName(userId, name);
    setIsSaving(false);
    setNotice(result.ok ? { type: 'success', message: accountCopy.saved } : { type: 'error', message: result.message });
    if (result.ok) {
      setTyped(null);
      retry();
    }
  }

  async function resetPassword() {
    setNotice(null);
    setIsSending(true);
    const result = await sendPasswordReset(email);
    setIsSending(false);
    setNotice(result.ok ? { type: 'success', message: accountCopy.resetSent } : { type: 'error', message: result.message });
  }

  return (
    <Screen
      footer={
        <>
          {notice ? <Toast type={notice.type} message={notice.message} /> : null}
          <Button
            label={accountCopy.save}
            state={canSave ? undefined : 'disabled'}
            loading={isSaving}
            onPress={saveName}
          />
        </>
      }
    >
      <PageHeader title={accountCopy.title} art={profileArt.account} />

      {state.status === 'error' ? (
        <LoadError message={state.message} onRetry={retry} />
      ) : (
        <>
          <View style={styles.section}>
            <Text style={styles.eyebrow} accessibilityRole="header">
              {accountCopy.infoTitle}
            </Text>
            <TextInput
              label={accountCopy.name}
              value={name}
              onChangeText={setTyped}
              error={nameError}
              autoComplete="name"
              textContentType="name"
            />
            <TextInput label={accountCopy.email} value={email} state="disabled" />
          </View>

          <View style={styles.section}>
            <Text style={styles.eyebrow} accessibilityRole="header">
              {accountCopy.appearanceTitle}
            </Text>
            <View style={styles.chips} accessibilityRole="radiogroup">
              {APPEARANCE.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  state={preference === option.value ? 'selected' : 'default'}
                  onPress={() => setPreference(option.value)}
                />
              ))}
            </View>
            <Text style={styles.detail}>{accountCopy.appearanceDetail}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.eyebrow} accessibilityRole="header">
              {accountCopy.securityTitle}
            </Text>
            <ListRow label={isSending ? `${accountCopy.changePassword}…` : accountCopy.changePassword} onPress={resetPassword} />
          </View>

          <View style={styles.section}>
            <Text style={styles.eyebrow} accessibilityRole="header">
              {accountCopy.actionsTitle}
            </Text>
            {/* Deleting needs a server step that isn't built yet, so the button shows where it will live */}
            <Button label={accountCopy.deleteAccount} style="secondary" state="disabled" onPress={() => {}} />
            <Text style={styles.detail}>{accountCopy.deleteDetail}</Text>
          </View>
        </>
      )}
    </Screen>
  );
}

const APPEARANCE: { value: AppearancePreference; label: string }[] = [
  { value: 'system', label: accountCopy.appearanceSystem },
  { value: 'light', label: accountCopy.appearanceLight },
  { value: 'dark', label: accountCopy.appearanceDark },
];

const useStyles = makeStyles((c) => StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[8],
  },
  section: {
    gap: space[12],
  },
  eyebrow: {
    ...type.caption,
    fontFamily: type.label.fontFamily,
    color: c.highlight,
    textTransform: 'uppercase',
    letterSpacing: letterSpacing.eyebrow,
  },
  detail: {
    ...type.caption,
    color: c.inkMuted,
  },
}));
