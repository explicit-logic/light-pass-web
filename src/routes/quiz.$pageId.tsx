import { createFileRoute } from '@tanstack/react-router';
import { QuizPage } from '@/pages/QuizPage';
import { loadPageConfig } from '@/utils/loadPageConfig';
import { loadQuizManifest } from '@/utils/loadQuizManifest';

export const Route = createFileRoute('/quiz/$pageId')({
  component: QuizRoute,
  loader: async ({ params }) => {
    const { pageId } = params;
    const manifest = await loadQuizManifest();
    const { pageOrder } = manifest;

    const pageOrderItem = pageOrder.find((item) => item.id === pageId);
    if (!pageOrderItem) {
      throw new Error('Page not found');
    }
    const pageConfig = await loadPageConfig(pageOrderItem.configFile);
    document.title = pageOrderItem.title;

    return { manifest, pageConfig };
  },
});

function QuizRoute() {
  const { pageId } = Route.useParams();
  const { manifest, pageConfig } = Route.useLoaderData();
  const { pageOrder } = manifest;
  const currentPage = pageOrder.findIndex((item) => item.id === pageId);

  // Handle answer submission
  const handleAnswer = (questionId: string, answer: string | string[]) => {
    console.log(questionId, answer);
  };
  const onNextPage = () => {};
  const onPrevPage = () => {};
  const timeRemaining = 0;

  return (
    <QuizPage
      page={pageConfig}
      totalPages={manifest.totalPages}
      onAnswer={handleAnswer}
      onNextPage={onNextPage}
      onPrevPage={onPrevPage}
      timeRemaining={timeRemaining}
      currentPage={currentPage}
    />
  );
}
