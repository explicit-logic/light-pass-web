import { createRootRoute, stripSearchParams } from '@tanstack/react-router';
import { z } from 'zod';
import { zodValidator } from '@tanstack/zod-adapter'
import App from '@/App';

const defaultValues = {
  lang: 'en',
}

const searchSchema = z.object({
  lang: z.string().default(defaultValues.lang),
});

export const Route = createRootRoute({
  component: App,
  validateSearch: zodValidator(searchSchema),
  search: {
    middlewares: [stripSearchParams(defaultValues)],
  },
});
