import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { CompletionPage } from '../pages/CompletionPage';
import { useQuiz } from '@/hooks/useQuiz';
import { useEffect } from 'react';

export const Route = createFileRoute('/completion')({
  component: CompletionRoute,
});

function CompletionRoute() {
  const navigate = useNavigate();
  const { quizData, resetQuiz: resetQuizData, answers, resetQuiz: resetQuizState } = useQuiz();

  // If quiz data is not loaded, redirect to home
  useEffect(() => {
    if (!quizData) {
      navigate({ to: '/' });
    }
  }, [quizData, navigate]);

  const handleRestart = () => {
    resetQuizState();
    resetQuizData();
    navigate({ to: '/' });
  };

  if (!quizData) {
    return null;
  }

  return (
    <CompletionPage
      answers={answers}
      onRestart={handleRestart}
    />
  );
}
