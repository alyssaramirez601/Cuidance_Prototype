import { Image, type ImageSource } from 'expo-image';
import { useRouter, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AnswerTag } from '@/components/AnswerTag';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { ArtTile } from '@/components/ArtTile';
import { ListRow } from '@/components/ListRow';
import { LoadError } from '@/components/LoadError';
import { LoadingState } from '@/components/LoadingState';
import { CollageHeader } from '@/components/CollageHeader';
import { Screen } from '@/components/Screen';
import { layout, radius, sizes, space, stroke, type } from '@/constants/tokens';
import { makeStyles, useColors } from '@/hooks/useTheme';
import { areaLabels } from '@/data/appCopy';
import { profileArt, profileCopy } from '@/data/profileCopy';
import { useAuth } from '@/hooks/useAuth';
import { useProfileData, type ProfileData } from '@/hooks/useProfileData';
import { firstNameFrom, signOut } from '@/lib/auth';
import { shortDate } from '@/lib/profile';
import { answerTagsByArea } from '@/lib/quizFlow';


// Prototype screen 20. Each row opens its own page in app/profile/
export default function ProfileScreen() {
  const { session } = useAuth();
  if (!session) {
    return <LoadingState label={profileCopy.loading} />;
  }
  return (
    <ProfileContent
      userId={session.user.id}
      email={session.user.email ?? ''}
      fallbackName={firstNameFrom(session.user.user_metadata)}
    />
  );
}

function ProfileContent({ userId, email, fallbackName }: { userId: string; email: string; fallbackName: string }) {
  const styles = useStyles();
  const router = useRouter();
  const { state, retry } = useProfileData(userId);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');

  async function handleSignOut() {
    setSignOutError('');
    setIsSigningOut(true);
    const result = await signOut();
    setIsSigningOut(false);
    if (!result.ok) setSignOutError(result.message);
  }

  if (state.status === 'loading') {
    return <LoadingState label={profileCopy.loading} />;
  }

  const rows: { label: string; art: ImageSource; to: Href }[] = [
    { label: profileCopy.rows.history, art: profileArt.history, to: '/profile/history' },
    { label: profileCopy.rows.products, art: profileArt.products, to: '/profile/products' },
    { label: profileCopy.rows.privacy, art: profileArt.privacy, to: '/profile/privacy' },
    { label: profileCopy.rows.notifications, art: profileArt.notifications, to: '/profile/notifications' },
    { label: profileCopy.rows.account, art: profileArt.account, to: '/profile/account' },
  ];

  return (
    <Screen>
      <CollageHeader variant="profile" title={profileCopy.title} art={profileArt.banner} />

      {state.status === 'error' ? (
        <LoadError message={state.message} onRetry={retry} />
      ) : (
        <>
          <PersonCard
            name={state.data.profile.displayName || fallbackName}
            email={email}
            onEdit={() => router.push('/profile/account')}
          />
          <AttributesCard data={state.data} />
          <View style={styles.rows}>
            {rows.map((row) => (
              <ListRow key={row.label} label={row.label} leading={<ArtTile art={row.art} />} onPress={() => router.push(row.to)} />
            ))}
          </View>
        </>
      )}

      <View style={styles.signOut}>
        {signOutError ? (
          <Text accessibilityLiveRegion="polite" style={styles.error}>
            {signOutError}
          </Text>
        ) : null}
        <Button
          label={isSigningOut ? profileCopy.signingOut : profileCopy.signOut}
          style="secondary"
          loading={isSigningOut}
          onPress={handleSignOut}
        />
      </View>
    </Screen>
  );
}

function PersonCard({ name, email, onEdit }: { name: string; email: string; onEdit: () => void }) {
  const styles = useStyles();
  const c = useColors();
  return (
    <View style={styles.card}>
      <View style={styles.personRow}>
        <View style={styles.personIcon}>
          <Icon name="profile" size={sizes.icon.large} color={c.ink} />
        </View>
        <View style={styles.personText}>
          {name ? <Text style={styles.personName}>{name}</Text> : null}
          {/* Long emails can break after the @ or a dot instead of in the middle of a word */}
          <Text style={styles.personEmail}>{email.replace(/([@.])/g, '$1\u200B')}</Text>
        </View>
        <Pressable
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel="Edit account"
          style={styles.editLink}
        >
          <Text style={styles.link}>{profileCopy.edit}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function AttributesCard({ data }: { data: ProfileData }) {
  const styles = useStyles();
  const c = useColors();
  const router = useRouter();
  const groups = answerTagsByArea(data.answers);
  const updated = data.profile.quizCompletedAt;

  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <Text style={styles.cardTitle} accessibilityRole="header">
          {profileCopy.attributesTitle}
        </Text>
        {updated ? <Text style={styles.meta}>{profileCopy.updated(shortDate(updated))}</Text> : null}
      </View>

      {groups.length > 0 ? (
        groups.map((group) => (
          <Pressable
            key={group.area}
            onPress={() => router.push({ pathname: '/profile/attributes', params: { area: group.area } })}
            accessibilityRole="button"
            accessibilityLabel={`${capitalize(areaLabels[group.area])}: ${group.tags.join(', ')}`}
            accessibilityHint="Opens your attributes for this area"
          >
            {({ pressed }) => (
              <View style={[styles.group, pressed && styles.groupPressed]}>
                <Image source={profileArt.areas[group.area]} style={styles.areaArt} contentFit="contain" accessible={false} />
                <View style={styles.groupBody}>
                  <View style={styles.groupHead}>
                    <Text style={styles.groupTitle}>{capitalize(areaLabels[group.area])}</Text>
                    <Icon name="arrow" size={sizes.icon.medium} color={c.accent} />
                  </View>
                  <View style={styles.tags}>
                    {group.tags.map((tag) => (
                      <AnswerTag key={tag} label={tag} />
                    ))}
                  </View>
                </View>
              </View>
            )}
          </Pressable>
        ))
      ) : (
        <Text style={styles.body}>{profileCopy.noAttributes}</Text>
      )}

      <Text style={styles.meta}>{profileCopy.attributesHelper}</Text>

      <Button label={profileCopy.viewAttributes} style="secondary" onPress={() => router.push('/profile/attributes')} />
    </View>
  );
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const useStyles = makeStyles((c, g) => StyleSheet.create({
  card: {
    gap: space[12],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    backgroundColor: c.surface,
    boxShadow: g.shadowLift,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
  },
  personIcon: {
    width: space[48],
    height: space[48],
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.surfaceWarm,
  },
  personText: {
    flex: 1,
    gap: space[4],
  },
  personName: {
    ...type.label,
    color: c.ink,
  },
  personEmail: {
    ...type.caption,
    color: c.inkMuted,
  },
  editLink: {
    minHeight: layout.minTouchTarget,
    minWidth: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    ...type.label,
    color: c.accent,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: space[8],
  },
  cardTitle: {
    ...type.title,
    color: c.ink,
  },
  meta: {
    ...type.caption,
    color: c.inkMuted,
  },
  body: {
    ...type.body,
    color: c.inkMuted,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[12],
    paddingTop: space[12],
    borderTopWidth: stroke.default,
    borderTopColor: c.border,
  },
  groupPressed: {
    backgroundColor: c.background,
  },
  // Big enough to read as the area's picture, with the tags beside it
  areaArt: {
    width: space[48] + space[24],
    height: space[48] + space[32],
  },
  groupBody: {
    flex: 1,
    gap: space[8],
  },
  groupHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[8],
  },
  groupTitle: {
    ...type.label,
    color: c.ink,
    flex: 1,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[8],
  },
  rows: {
    gap: space[8],
  },
  signOut: {
    gap: space[12],
    marginTop: space[8],
  },
  error: {
    ...type.body,
    color: c.error,
  },
}));
