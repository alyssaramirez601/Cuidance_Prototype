import { Redirect } from 'expo-router';

import { quizQuestions } from '@/data/quiz';

// Where signed-in people land. It sends them straight to the first quiz question,
// so they never see a question twice. Home replaces this once it exists
export default function StartScreen() {
  return <Redirect href={`/quiz/${quizQuestions[0].id}`} />;
}
