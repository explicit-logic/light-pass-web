import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { QuestionPage } from '@/pages/QuestionPage';
import { useQuiz } from '@/hooks/useQuiz';
import { useEffect } from 'react';

export const Route = createFileRoute('/quiz')({
  component: QuizRoute,
});

function QuizRoute() {
  const navigate = useNavigate();
  const { 
    currentQuestion,
    onAnswer,
    onNext,
    onPrev,
    answers,
    timeRemaining,
    isComplete 
  } = useQuiz();

  useEffect(() => {
    if (isComplete) {
      navigate({ to: '/completion' });
    }
  }, [isComplete, navigate]);

  return (
    <QuestionPage
      currentQuestion={currentQuestion}
      onAnswer={onAnswer}
      onNext={onNext}
      onPrev={onPrev}
      answers={answers}
      timeRemaining={timeRemaining}
    />
  );
}
