import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { CompletionPage } from '../pages/CompletionPage';
import { useQuiz } from '../hooks/useQuiz';

export const Route = createFileRoute('/completion')({
  component: CompletionRoute,
});

function CompletionRoute() {
  const navigate = useNavigate();
  const { answers, resetQuiz } = useQuiz();

  const handleRestart = () => {
    resetQuiz();
    navigate({ to: '/' });
  };

  return (
    <CompletionPage
      answers={answers}
      onRestart={handleRestart}
    />
  );
}