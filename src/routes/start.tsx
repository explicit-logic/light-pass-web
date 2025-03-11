import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { StartPage } from '@/pages/StartPage';
import { loadQuizManifest } from '@/utils/loadQuizManifest';

export const Route = createFileRoute('/start')({
  component: StartRoute,
  loader: async () => {
    const manifest = await loadQuizManifest();

    return { manifest };
  }
});

function StartRoute() {
  const { manifest } = Route.useLoaderData();
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    const { pageOrder } = manifest;
    const [first] = pageOrder;
    navigate({ to: '/quiz/$pageId', params: { pageId: first.id } });
  };

  // If quiz data is loaded, show the main page
  return <StartPage onStart={handleStartQuiz} />;
}
