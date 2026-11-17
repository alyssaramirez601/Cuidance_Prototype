import { Image, type ImageSource } from 'expo-image';
import { useRouter, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AnswerTag } from '@/components/AnswerTag';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { ListRow } from '@/components/ListRow';
import { LoadError } from '@/components/LoadError';
import { LoadingState } from '@/components/LoadingState';
import { Screen } from '@/components/Screen';
import { colors, layout, radius, sizes, space, stroke, type } from '@/constants/tokens';
import { areaLabels } from '@/data/draftCopy';
import { profileArt, profileCopy } from '@/data/profileCopy';
import { useAuth } from '@/hooks/useAuth';
import { useProfileData, type ProfileData } from '@/hooks/useProfileData';
import { firstNameFrom, signOut } from '@/lib/auth';
import { shortDate } from '@/lib/profile';
import { answerTagsByArea } from '@/lib/quizFlow';

const c = colors.light;
const BANNER_RATIO = 1400 / 467;

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
    { label: profileCopy.rows.privacy, art: profileArt.privacy, to: '/profile/privacy' },
    { label: profileCopy.rows.notifications, art: profileArt.notifications, to: '/profile/notifications' },
    { label: profileCopy.rows.account, art: profileArt.account, to: '/profile/account' },
  ];

  return (
    <Screen>
      <Image source={profileArt.banner} style={styles.banner} contentFit="cover" accessible={false} />
      <Text style={styles.title} accessibilityRole="header">
        {profileCopy.title}
      </Text>

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
  return (
    <View style={styles.card}>
      <View style={styles.personRow}>
        <View style={styles.personIcon}>
          <Icon name="profile" size={sizes.icon.large} color={c.ink} />
        </View>
        <View style={styles.personText}>
          {name ? <Text style={styles.personName}>{name}</Text> : null}
          <Text style={styles.personEmail}>{email}</Text>
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
          <View key={group.area} style={styles.group}>
            <Text style={styles.groupTitle}>{capitalize(areaLabels[group.area])}</Text>
            <View style={styles.tags}>
              {group.tags.map((tag) => (
                <AnswerTag key={tag} label={tag} />
              ))}
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.body}>{profileCopy.noAttributes}</Text>
      )}

      <Text style={styles.meta}>{profileCopy.attributesHelper}</Text>

      <View style={styles.links}>
        <TextLink label={profileCopy.usedInExplore} onPress={() => router.navigate('/explore')} />
        <TextLink label={profileCopy.usedInResults} onPress={() => router.push('/quiz/result')} />
      </View>

      <Button label={profileCopy.viewAttributes} style="secondary" onPress={() => router.push('/profile/attributes')} />
    </View>
  );
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function TextLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="link" accessibilityLabel={label} style={styles.textLink}>
      <Text style={styles.link}>{label}</Text>
      <Icon name="arrow" size={sizes.icon.small} color={c.accent} />
    </Pressable>
  );
}

// A small piece of Esme's Week 12 art in place of a line icon, like the website and emails
function ArtTile({ art }: { art: ImageSource }) {
  return (
    <View style={styles.artTile}>
      <Image source={art} style={styles.artImage} contentFit="contain" accessible={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    aspectRatio: BANNER_RATIO,
    marginHorizontal: -layout.screenEdge,
    marginTop: -space[24],
  },
  title: {
    ...type.heading,
    color: c.ink,
  },
  card: {
    gap: space[12],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: c.border,
    backgroundColor: c.surface,
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
    gap: space[8],
    paddingTop: space[12],
    borderTopWidth: stroke.default,
    borderTopColor: c.border,
  },
  groupTitle: {
    ...type.label,
    color: c.ink,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[8],
  },
  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: space[16],
  },
  textLink: {
    minHeight: layout.minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
  },
  rows: {
    gap: space[8],
  },
  artTile: {
    width: space[48],
    height: space[48],
    borderRadius: radius.small,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.background,
  },
  artImage: {
    width: space[48] - space[4],
    height: space[48] - space[4],
  },
  signOut: {
    gap: space[12],
    marginTop: space[8],
  },
  error: {
    ...type.body,
    color: c.error,
  },
});
