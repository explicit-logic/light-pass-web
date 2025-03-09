import { QUIZ_CACHE } from "@/config";

interface PageOrder {
  id: string;
  title: string;
  configFile: string;
}

export interface QuizManifest {
  name: string;
  description?: string;
  totalPages: number;
  totalQuestions: number;
  globalTimeLimit?: number;
  pageTimeLimit?: number;
  pageOrder: PageOrder[];
}

export async function loadQuizManifest() {
  const cache = await caches.open(QUIZ_CACHE);
  const response = await cache.match(new Request('/quiz/manifest.json'));

  if (response && response.ok) {
    const json = await response.json();

    return json as QuizManifest;
  } else {
    throw new Error('manifest.json not found in cache');
  }
}
