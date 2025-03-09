import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { StartPage } from '@/pages/StartPage';

export const Route = createFileRoute('/start')({
  component: StartRoute,
});

function StartRoute() {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate({ to: '/quiz/$questionId', params: { questionId: 'q1' } });
  };

  // If quiz data is loaded, show the main page
  return <StartPage onStart={handleStartQuiz} />;
}
