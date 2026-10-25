import { useCallback, useEffect, useRef, useState } from 'react';

import type { QuizQuestion } from '@/data/quiz';
import { loadAnswer, saveAnswer } from '@/lib/quizAnswers';

export type AnswerStatus = 'loading' | 'idle' | 'saving' | 'saved' | 'error';

function nextSelection(
  current: string[],
  optionId: string,
  selectionMode: QuizQuestion['selectionMode'],
  exclusiveOptionId?: string,
): string[] {
  // Choose one: tapping the chosen option again keeps it, so a number can't end up unanswered
  if (selectionMode === 'single') {
    return [optionId];
  }
  if (current.includes(optionId)) {
    return current.filter((id) => id !== optionId);
  }
  if (optionId === exclusiveOptionId) {
    return [optionId];
  }
  return [...current.filter((id) => id !== exclusiveOptionId), optionId];
}

export function useQuizAnswer(userId: string, question: QuizQuestion) {
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<AnswerStatus>('loading');
  const [message, setMessage] = useState('');
  const selectedRef = useRef<string[]>([]);
  // Saves run one after another, so a quick second tap can never be overwritten by a slower first one
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const latestSave = useRef(0);
  // Which step failed, so "Try again" repeats the right one
  const failedStep = useRef<'load' | 'save'>('save');

  const load = useCallback(async () => {
    setStatus('loading');
    const result = await loadAnswer(userId, question.id);
    if (result.ok) {
      selectedRef.current = result.optionIds;
      setSelected(result.optionIds);
      setStatus('idle');
    } else {
      failedStep.current = 'load';
      setMessage(result.message);
      setStatus('error');
    }
  }, [userId, question.id]);

  useEffect(() => {
    load();
  }, [load]);

  const persist = useCallback(
    (optionIds: string[]) => {
      setStatus('saving');
      const saveNumber = ++latestSave.current;
      saveQueue.current = saveQueue.current.then(async () => {
        const result = await saveAnswer(userId, question.id, optionIds);
        // A newer tap is still saving, so leave the status to it
        if (saveNumber !== latestSave.current) return;
        if (result.ok) {
          setStatus('saved');
        } else {
          failedStep.current = 'save';
          setMessage(result.message);
          setStatus('error');
        }
      });
    },
    [userId, question.id],
  );

  const toggle = useCallback(
    (optionId: string) => {
      const next = nextSelection(selectedRef.current, optionId, question.selectionMode, question.exclusiveOptionId);
      selectedRef.current = next;
      setSelected(next);
      persist(next);
    },
    [persist, question.selectionMode, question.exclusiveOptionId],
  );

  const retry = useCallback(() => {
    if (failedStep.current === 'load') {
      load();
    } else {
      persist(selectedRef.current);
    }
  }, [load, persist]);

  return { selected, status, message, toggle, retry };
}
