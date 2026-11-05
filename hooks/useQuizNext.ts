import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import type { QuizQuestion } from '@/data/quiz';
import { loadAllAnswers, skipAnswer } from '@/lib/quizAnswers';
import { nextQuestionId } from '@/lib/quizFlow';

// Works out the next question from everything saved so far, since the care areas picked on U1
// (or N2) decide which branch questions come next
export function useQuizNext(userId: string, question: QuizQuestion, hasAnswer: boolean) {
  const router = useRouter();
  const [isMoving, setIsMoving] = useState(false);
  const [message, setMessage] = useState('');

  const goNext = useCallback(async () => {
    setMessage('');
    setIsMoving(true);
    if (question.optional && !hasAnswer) {
      const skipped = await skipAnswer(userId, question.id);
      if (!skipped.ok) {
        setIsMoving(false);
        setMessage(skipped.message);
        return;
      }
    }
    const result = await loadAllAnswers(userId);
    setIsMoving(false);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    const nextId = nextQuestionId(question.id, result.answers);
    if (nextId) {
      router.push(`/quiz/${nextId}`);
    } else {
      // The result screen isn't built yet, so a finished quiz ends at the proof screen for now
      router.replace('/proof');
    }
  }, [userId, question.id, question.optional, hasAnswer, router]);

  return { goNext, isMoving, message };
}
