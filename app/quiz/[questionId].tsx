import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Note } from '@/components/Note';
import { LoadingState } from '@/components/LoadingState';
import { AnswerOption, type AnswerOptionState } from '@/components/AnswerOption';
import { QuizProgress } from '@/components/QuizProgress';
import { Screen } from '@/components/Screen';
import { colors, layout, radius, sizes, space, type } from '@/constants/tokens';
import { quizQuestions } from '@/data/quiz';
import type { QuizQuestion } from '@/data/quiz';
import { useAuth } from '@/hooks/useAuth';
import { useGoBack } from '@/hooks/useGoBack';
import { useQuizAnswer } from '@/hooks/useQuizAnswer';
import { useQuizNext } from '@/hooks/useQuizNext';

// Collage strip under the buttons, cut from the Week 8 chosen hi-fi quiz screen
const footerArt = require('@/assets/images/quiz-footer.png');
const FOOTER_ART_HEIGHT = space[48];
// Below this window height (a phone browser with its toolbars), the strip is hidden so the
// question, answers and buttons still fit in one view
const FOOTER_ART_MIN_WINDOW = 700;

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
  const goBack = useGoBack();
  return (
    <Screen centered>
      <Text style={styles.prompt} accessibilityRole="header">
        We couldn’t find that question
      </Text>
      <Text style={styles.helper}>It may have moved. You can head back and try again.</Text>
      <Button label="Back" style="secondary" onPress={goBack} />
    </Screen>
  );
}

type QuestionContentProps = {
  userId: string;
  question: QuizQuestion;
};

function QuestionContent({ userId, question }: QuestionContentProps) {
  const router = useRouter();
  const goBack = useGoBack();
  const { height: windowHeight } = useWindowDimensions();
  const showFooterArt = windowHeight >= FOOTER_ART_MIN_WINDOW;
  const { selected, status, message, toggle, retry } = useQuizAnswer(userId, question);
  const isSingle = question.selectionMode === 'single';
  const { goNext, isMoving, message: moveMessage } = useQuizNext(userId, question, selected.length > 0);
  const atLimit = question.maxSelections !== undefined && selected.length >= question.maxSelections;
  const hasAnswerOrCanSkip = selected.length > 0 || question.optional === true;
  const canContinue = hasAnswerOrCanSkip && status !== 'saving' && status !== 'error' && !isMoving;

  function optionState(optionId: string): AnswerOptionState {
    if (selected.includes(optionId)) return 'selected';
    return atLimit ? 'disabled' : 'default';
  }

  if (status === 'loading') {
    return <LoadingState label="Loading your answers" />;
  }

  const footer = (
    <>
      {moveMessage || status === 'error' ? (
        <View accessibilityLiveRegion="polite" style={styles.errorBox}>
          <Text style={styles.errorText}>{moveMessage || message}</Text>
          <Button label="Try again" style="secondary" onPress={moveMessage ? goNext : retry} />
        </View>
      ) : null}
      {/* Side by side, like the approved hi-fi quiz screen, so both stay in reach without scrolling */}
      <View style={styles.actions}>
        <View style={styles.actionBack}>
          <Button label="Back" style="secondary" onPress={goBack} />
        </View>
        <View style={styles.actionNext}>
          {/* Stays off until something is picked and saved (or the question is optional), so nobody moves on with an unsaved answer */}
          <Button
            label={question.nextLabel}
            state={canContinue ? undefined : 'disabled'}
            loading={isMoving}
            onPress={goNext}
          />
        </View>
      </View>
      {showFooterArt ? (
        <Image source={footerArt} style={styles.footerArt} contentFit="cover" contentPosition="top" accessible={false} />
      ) : null}
    </>
  );

  return (
    <Screen compact footer={footer} footerDivider={false}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.replace('/home')}
          accessibilityRole="button"
          accessibilityLabel="Save and exit"
          style={styles.saveExit}
        >
          <Icon name="back" size={sizes.icon.large} color={colors.light.ink} />
          <Text style={styles.saveExitLabel}>Save and exit</Text>
        </Pressable>
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
      </View>

      <View style={styles.progressRow}>
        <View style={styles.flex}>
          <QuizProgress label={question.progress} current={question.step} total={question.total} />
        </View>
        {/* Sits beside the progress label instead of taking its own row */}
        <Text accessibilityLiveRegion="polite" style={styles.statusText}>
          {status === 'saving' ? 'Saving' : status === 'saved' ? '✓ Saved' : ''}
        </Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.prompt} accessibilityRole="header">
          {question.prompt}
        </Text>
        <Text style={styles.helper}>{question.helper}</Text>
      </View>

      <View style={styles.options} accessibilityRole={isSingle ? 'radiogroup' : undefined}>
        {question.options.map((option) => (
          <AnswerOption
            key={option.id}
            label={option.label}
            indicator={isSingle ? 'radio' : 'checkbox'}
            state={optionState(option.id)}
            onPress={() => toggle(option.id)}
          />
        ))}
      </View>

      {question.note ? <Note text={question.note} /> : null}
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
  saveExit: {
    minHeight: layout.minTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
    // Lines the chevron up with the screen edge, like the hi-fi
    marginLeft: -space[4],
  },
  saveExitLabel: {
    ...type.label,
    color: colors.light.ink,
  },
  footerArt: {
    height: FOOTER_ART_HEIGHT,
    marginHorizontal: -layout.screenEdge,
    marginBottom: -space[8],
  },
  topLabel: {
    ...type.label,
    color: colors.light.accent,
  },
  topLabelInactive: {
    color: colors.light.disabledInk,
  },
  header: {
    gap: space[4],
  },
  // Newsreader heading, like the Week 8 hi-fi question
  prompt: {
    ...type.heading,
    color: colors.light.ink,
  },
  helper: {
    ...type.body,
    color: colors.light.inkMuted,
  },
  options: {
    gap: space[4],
  },
  flex: {
    flex: 1,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[12],
  },
  statusText: {
    ...type.caption,
    color: colors.light.inkMuted,
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
    flexDirection: 'row',
    gap: space[12],
  },
  actionBack: {
    flex: 1,
  },
  actionNext: {
    flex: 2,
  },
});
