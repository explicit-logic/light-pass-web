import { createFileRoute } from '@tanstack/react-router';
import { UploadPage } from '@/pages/UploadPage';

export const Route = createFileRoute('/')({
  component: MainRoute,
});

function MainRoute() {
  const handleUploadSuccess = () => {};

  return <UploadPage onUploadSuccess={handleUploadSuccess} />;
}
