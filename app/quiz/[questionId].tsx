import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { LoadingState } from '@/components/LoadingState';
import { OptionRow } from '@/components/OptionRow';
import { QuizProgress } from '@/components/QuizProgress';
import { Screen } from '@/components/Screen';
import { colors, layout, radius, space, type } from '@/constants/tokens';
import { CORE_QUESTION_COUNT, quizQuestions } from '@/data/quiz';
import type { QuizQuestion } from '@/data/quiz';
import { useAuth } from '@/hooks/useAuth';
import { useQuizAnswer } from '@/hooks/useQuizAnswer';

export default function QuizQuestionScreen() {
  const { questionId } = useLocalSearchParams<{ questionId: string }>();
  const { session } = useAuth();
  const question = quizQuestions.find((item) => item.id === questionId);

  if (!question) {
    return <QuestionNotFound />;
  }
  if (!session) {
    return <LoadingState label="Loading your question" />;
  }
  return <QuestionContent userId={session.user.id} question={question} />;
}

function QuestionNotFound() {
  const router = useRouter();
  return (
    <Screen centered>
      <Text style={styles.prompt} accessibilityRole="header">
        We couldn’t find that question
      </Text>
      <Text style={styles.helper}>It may have moved. You can head back and try again.</Text>
      <Button label="Back" variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}

type QuestionContentProps = {
  userId: string;
  question: QuizQuestion;
};

function QuestionContent({ userId, question }: QuestionContentProps) {
  const router = useRouter();
  const { selected, status, message, toggle, retry } = useQuizAnswer(userId, question);
  const isSingle = question.selectionMode === 'single';

  if (status === 'loading') {
    return <LoadingState label="Loading your answers" />;
  }

  return (
    <Screen>
      <View style={styles.topBar}>
        {/* Help has no content yet, so it shows but stays inactive until the team decides what it opens */}
        <Pressable
          disabled
          accessibilityRole="button"
          accessibilityLabel="Help"
          accessibilityState={{ disabled: true }}
          style={styles.topButton}
        >
          <Text style={[styles.topLabel, styles.topLabelInactive]}>Help</Text>
        </Pressable>
        <Pressable
          onPress={() => router.replace('/proof')}
          accessibilityRole="button"
          accessibilityLabel="Save and exit"
          style={styles.topButton}
        >
          <Text style={styles.topLabel}>Save and exit</Text>
        </Pressable>
      </View>

      <QuizProgress label={question.progress} current={question.step} total={CORE_QUESTION_COUNT} />

      <View style={styles.header}>
        <Text style={styles.prompt} accessibilityRole="header">
          {question.prompt}
        </Text>
        <Text style={styles.helper}>{question.helper}</Text>
      </View>

      <View style={styles.options} accessibilityRole={isSingle ? 'radiogroup' : undefined}>
        {question.options.map((option) => (
          <OptionRow
            key={option.id}
            label={option.label}
            mode={question.selectionMode}
            selected={selected.includes(option.id)}
            onPress={() => toggle(option.id)}
          />
        ))}
      </View>

      {question.note ? <Text style={styles.note}>{question.note}</Text> : null}

      <View accessibilityLiveRegion="polite" style={styles.statusArea}>
        {status === 'saving' ? <Text style={styles.statusText}>Saving</Text> : null}
        {status === 'saved' ? (
          <View style={styles.savedChip}>
            <Text style={styles.savedText}>✓ Saved</Text>
          </View>
        ) : null}
        {status === 'error' ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{message}</Text>
            <Button label="Try again" variant="secondary" onPress={retry} />
          </View>
        ) : null}
      </View>

      <View style={styles.actions}>
        {/* U4 is not built yet, so Next question stays off until it exists */}
        <Button label="Next question" disabled onPress={() => {}} />
        <Button label="Back" variant="secondary" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topButton: {
    minHeight: layout.minTouchTarget,
    minWidth: layout.minTouchTarget,
    justifyContent: 'center',
  },
  topLabel: {
    ...type.label,
    color: colors.light.accent,
  },
  topLabelInactive: {
    color: colors.light.disabledInk,
  },
  header: {
    gap: space[8],
  },
  prompt: {
    ...type.heading,
    color: colors.light.ink,
  },
  helper: {
    ...type.body,
    color: colors.light.inkMuted,
  },
  options: {
    gap: space[12],
  },
  note: {
    ...type.body,
    color: colors.light.inkMuted,
  },
  statusArea: {
    minHeight: space[48],
    justifyContent: 'center',
  },
  statusText: {
    ...type.body,
    color: colors.light.inkMuted,
  },
  savedChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: space[16],
    paddingVertical: space[8],
    borderRadius: radius.pill,
    backgroundColor: colors.light.successSurface,
  },
  savedText: {
    ...type.label,
    color: colors.light.ink,
  },
  errorBox: {
    gap: space[12],
    padding: space[16],
    borderRadius: radius.medium,
    backgroundColor: colors.light.errorSurface,
  },
  errorText: {
    ...type.body,
    color: colors.light.error,
  },
  actions: {
    gap: space[12],
  },
});
