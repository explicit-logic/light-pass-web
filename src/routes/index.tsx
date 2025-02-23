import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { MainPage } from '@/pages/MainPage';

export const Route = createFileRoute('/')({
  component: MainRoute,
});

function MainRoute() {
  const navigate = useNavigate();
  return <MainPage onStart={() => navigate({ to: '/quiz' })} />;
}
