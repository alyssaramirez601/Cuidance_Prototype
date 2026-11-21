import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { LoadError } from '@/components/LoadError';
import { LoadingState } from '@/components/LoadingState';
import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { layout, radius, sizes, space, stroke, type } from '@/constants/tokens';
import { makeStyles, useColors } from '@/hooks/useTheme';
import { areaLabels } from '@/data/appCopy';
import { attributesCopy, profileArt, profileCopy } from '@/data/profileCopy';
import { AREA_ORDER, quizQuestions, type QuizQuestion } from '@/data/quiz';
import { useAuth } from '@/hooks/useAuth';
import { useProfileData } from '@/hooks/useProfileData';
import { shortDate } from '@/lib/profile';
import { visibleQuestionIds, type SavedAnswers } from '@/lib/quizFlow';
import { clearAnswers } from '@/lib/results';

const CONFIDENCE_ID = 'u3_confidence';

type Group = { key: string; title: string; questions: QuizQuestion[] };

// Every question this person saw, grouped the way the quiz asks them. Confidence gets its own box, like the prototype
function groupsFor(answers: SavedAnswers): Group[] {
  const shown = new Set(visibleQuestionIds(answers));
  const seen = quizQuestions.filter((q) => shown.has(q.id) && q.id !== CONFIDENCE_ID);
  const starting = seen.filter((q) => q.section === 'start' || q.section === 'not_sure');
  const groups: Group[] = starting.length ? [{ key: 'start', title: attributesCopy.startingTitle, questions: starting }] : [];
  for (const area of AREA_ORDER) {
    const questions = seen.filter((q) => q.section === area);
    if (questions.length) {
      const label = areaLabels[area];
      groups.push({ key: area, title: label.charAt(0).toUpperCase() + label.slice(1), questions });
    }
  }
  return groups;
}

function answerLabels(question: QuizQuestion, answers: SavedAnswers): string[] {
  return (answers[question.id] ?? [])
    .map((id) => question.options.find((option) => option.id === id)?.label)
    .filter((label): label is string => Boolean(label));
}

function answerText(question: QuizQuestion, answers: SavedAnswers): string {
  const labels = answerLabels(question, answers);
  return labels.length ? labels.join(', ') : attributesCopy.notShared;
}

// Prototype screen 21
export default function AttributesScreen() {
  const { session } = useAuth();
  if (!session) return <LoadingState label={profileCopy.loading} />;
  return <AttributesContent userId={session.user.id} />;
}

function AttributesContent({ userId }: { userId: string }) {
  const styles = useStyles();
  const router = useRouter();
  // Set when someone taps one care area on Profile, so the page opens on just that area
  const { area } = useLocalSearchParams<{ area?: string }>();
  const { state, retry } = useProfileData(userId);
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState('');

  async function retake() {
    setError('');
    setIsClearing(true);
    const result = await clearAnswers(userId);
    setIsClearing(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.push('/quiz/q1_areas');
  }

  if (state.status === 'loading') return <LoadingState label={profileCopy.loading} />;

  const updated = state.status === 'ready' ? state.data.profile.quizCompletedAt : null;
  const intro = updated ? `${attributesCopy.intro} ${profileCopy.updated(shortDate(updated))}.` : attributesCopy.intro;

  return (
    <Screen>
      <PageHeader
        title={attributesCopy.title}
        intro={intro}
        art={(area && profileArt.areas[area]) || profileArt.attributes}
      />

      {state.status === 'error' ? (
        <LoadError message={state.message} onRetry={retry} />
      ) : (
        <>
          {Object.keys(state.data.answers).length === 0 ? <Text style={styles.empty}>{profileCopy.noAttributes}</Text> : null}
          {groupsFor(state.data.answers)
            .filter((group) => !area || group.key === area)
            .map((group) => (
              <View key={group.key} style={styles.group}>
                <View style={styles.groupHead}>
                  {profileArt.areas[group.key] ? (
                    <Image source={profileArt.areas[group.key]} style={styles.areaArt} contentFit="contain" accessible={false} />
                  ) : null}
                  <Text style={styles.groupTitle} accessibilityRole="header">
                    {group.title}
                  </Text>
                </View>
                <View style={styles.card}>
                  {group.questions.map((question, index) => (
                    <View key={question.id} style={[styles.row, index > 0 && styles.rowDivider]}>
                      <Text style={styles.prompt}>{question.prompt}</Text>
                      {answerLabels(question, state.data.answers).length === 0 ? (
                        <Text style={styles.answer}>{attributesCopy.notShared}</Text>
                      ) : (
                        answerLabels(question, state.data.answers).map((label) => (
                          <AnswerWithLinks
                            key={label}
                            label={label}
                            // The starting questions set up the quiz rather than describe the person, so they get no links
                            showLinks={group.key !== 'start'}
                            onExplore={() => router.navigate({ pathname: '/explore', params: { q: label } })}
                            onResult={() => router.push('/quiz/result')}
                          />
                        ))
                      )}
                    </View>
                  ))}
                </View>
              </View>
            ))}

          {area ? (
            <Button label={attributesCopy.showAll} style="ghost" onPress={() => router.setParams({ area: undefined })} />
          ) : null}

          <Text style={styles.note}>{attributesCopy.note}</Text>

          {!area && CONFIDENCE_ID in state.data.answers ? (
            <View style={styles.confidence}>
              <Text style={styles.groupTitle}>{attributesCopy.confidenceTitle}</Text>
              <Text style={styles.answer}>
                {answerText(quizQuestions.find((q) => q.id === CONFIDENCE_ID) as QuizQuestion, state.data.answers)}
              </Text>
              <Text style={styles.note}>{attributesCopy.confidenceNote}</Text>
            </View>
          ) : null}

          {error ? (
            <Text style={styles.error} accessibilityLiveRegion="polite">
              {error}
            </Text>
          ) : null}
          <View style={styles.actions}>
            <Button label={attributesCopy.editAttributes} onPress={() => router.push('/quiz/q1_areas')} />
            <Button label={attributesCopy.retake} style="secondary" loading={isClearing} onPress={retake} />
          </View>
        </>
      )}
    </Screen>
  );
}

function AnswerWithLinks({
  label,
  showLinks,
  onExplore,
  onResult,
}: {
  label: string;
  showLinks: boolean;
  onExplore: () => void;
  onResult: () => void;
}) {
  const styles = useStyles();
  return (
    <View style={styles.answerBlock}>
      <Text style={styles.answer}>{label}</Text>
      {showLinks ? (
        <View style={styles.answerLinks}>
          <SmallLink label={attributesCopy.explore} a11y={`${attributesCopy.explore}: ${label}`} onPress={onExplore} />
          <SmallLink label={attributesCopy.inResults} a11y={`${attributesCopy.inResults}: ${label}`} onPress={onResult} />
        </View>
      ) : null}
    </View>
  );
}

function SmallLink({ label, a11y, onPress }: { label: string; a11y: string; onPress: () => void }) {
  const styles = useStyles();
  const c = useColors();
  return (
    <Pressable onPress={onPress} accessibilityRole="link" accessibilityLabel={a11y} style={styles.smallLink}>
      <Text style={styles.linkText}>{label}</Text>
      <Icon name="arrow" size={sizes.icon.small} color={c.accent} />
    </Pressable>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  group: {
    gap: space[8],
  },
  groupHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
  },
  areaArt: {
    width: space[48] - space[8],
    height: space[48],
  },
  groupTitle: {
    ...type.title,
    color: c.ink,
  },
  card: {
    paddingHorizontal: layout.insideComponent,
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  row: {
    gap: space[4],
    paddingVertical: space[12],
  },
  rowDivider: {
    borderTopWidth: stroke.default,
    borderTopColor: c.border,
  },
  answerBlock: {
    gap: space[4],
  },
  answerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: space[16],
  },
  smallLink: {
    minHeight: layout.minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
  },
  linkText: {
    ...type.caption,
    fontFamily: type.label.fontFamily,
    color: c.accent,
  },
  prompt: {
    ...type.caption,
    color: c.inkMuted,
  },
  answer: {
    ...type.label,
    color: c.ink,
  },
  note: {
    ...type.caption,
    color: c.inkMuted,
  },
  confidence: {
    gap: space[8],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    backgroundColor: c.surfaceWarm,
  },
  actions: {
    gap: space[12],
  },
  error: {
    ...type.body,
    color: c.error,
  },
  empty: {
    ...type.body,
    color: c.inkMuted,
  },
}));
