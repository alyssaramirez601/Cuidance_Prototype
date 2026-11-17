import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { LoadError } from '@/components/LoadError';
import { LoadingState } from '@/components/LoadingState';
import { ProfilePageHeader } from '@/components/ProfilePageHeader';
import { Screen } from '@/components/Screen';
import { colors, layout, radius, space, stroke, type } from '@/constants/tokens';
import { areaLabels } from '@/data/draftCopy';
import { attributesCopy, profileArt, profileCopy } from '@/data/profileCopy';
import { AREA_ORDER, quizQuestions, type QuizQuestion } from '@/data/quiz';
import { useAuth } from '@/hooks/useAuth';
import { useProfileData } from '@/hooks/useProfileData';
import { shortDate } from '@/lib/profile';
import { visibleQuestionIds, type SavedAnswers } from '@/lib/quizFlow';
import { clearAnswers } from '@/lib/results';

const c = colors.light;
const CONFIDENCE_ID = 'u3_confidence';

type Group = { title: string; questions: QuizQuestion[] };

// Every question this person saw, grouped the way the quiz asks them. Confidence gets its own box, like the prototype
function groupsFor(answers: SavedAnswers): Group[] {
  const shown = new Set(visibleQuestionIds(answers));
  const seen = quizQuestions.filter((q) => shown.has(q.id) && q.id !== CONFIDENCE_ID);
  const starting = seen.filter((q) => q.section === 'start' || q.section === 'not_sure');
  const groups: Group[] = starting.length ? [{ title: attributesCopy.startingTitle, questions: starting }] : [];
  for (const area of AREA_ORDER) {
    const questions = seen.filter((q) => q.section === area);
    if (questions.length) {
      const label = areaLabels[area];
      groups.push({ title: label.charAt(0).toUpperCase() + label.slice(1), questions });
    }
  }
  return groups;
}

function answerText(question: QuizQuestion, answers: SavedAnswers): string {
  const labels = (answers[question.id] ?? [])
    .map((id) => question.options.find((option) => option.id === id)?.label)
    .filter((label): label is string => Boolean(label));
  return labels.length ? labels.join(', ') : attributesCopy.notShared;
}

// Prototype screen 21
export default function AttributesScreen() {
  const { session } = useAuth();
  if (!session) return <LoadingState label={profileCopy.loading} />;
  return <AttributesContent userId={session.user.id} />;
}

function AttributesContent({ userId }: { userId: string }) {
  const router = useRouter();
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
      <ProfilePageHeader title={attributesCopy.title} intro={intro} art={profileArt.attributes} />

      {state.status === 'error' ? (
        <LoadError message={state.message} onRetry={retry} />
      ) : (
        <>
          {Object.keys(state.data.answers).length === 0 ? <Text style={styles.empty}>{profileCopy.noAttributes}</Text> : null}
          {groupsFor(state.data.answers).map((group) => (
            <View key={group.title} style={styles.group}>
              <Text style={styles.groupTitle} accessibilityRole="header">
                {group.title}
              </Text>
              <View style={styles.card}>
                {group.questions.map((question, index) => (
                  <View key={question.id} style={[styles.row, index > 0 && styles.rowDivider]}>
                    <Text style={styles.prompt}>{question.prompt}</Text>
                    <Text style={styles.answer}>{answerText(question, state.data.answers)}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          <Text style={styles.note}>{attributesCopy.note}</Text>

          {CONFIDENCE_ID in state.data.answers ? (
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

const styles = StyleSheet.create({
  group: {
    gap: space[8],
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
});
