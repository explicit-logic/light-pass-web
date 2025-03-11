import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { CompletionPage } from '@/pages/CompletionPage';

export const Route = createFileRoute('/completion')({
  component: CompletionRoute,
});

function CompletionRoute() {
  const navigate = useNavigate();

  const handleRestart = () => {
    // resetQuizState();
    // resetQuizData();
    navigate({ to: '/' });
  };

  return (
    <CompletionPage
      answers={{}}
      onRestart={handleRestart}
    />
  );
}
