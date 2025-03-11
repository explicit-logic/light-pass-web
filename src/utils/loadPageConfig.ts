import { QUIZ_CACHE } from "@/config";
import type { PageConfig } from '@/types/quiz';

export async function loadPageConfig(path: string) {
  const cache = await caches.open(QUIZ_CACHE);
  const response = await cache.match(new Request(`/quiz/${path}`));

  if (response && response.ok) {
    const json = await response.json();

    return json as PageConfig;
  } else {
    throw new Error('Page config not found in cache');
  }
}
