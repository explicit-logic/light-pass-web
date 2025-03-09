import JSZip from 'jszip';
import { QUIZ_CACHE } from '@/config';
import { mimeTypes, type FileExtension } from '@/constants/mimeTypes';

export async function loadQuizFromZip(file: File) {
    const zip = new JSZip();
    const contents = await zip.loadAsync(file);
    
    // Look for quiz.json in the root of the ZIP
    const manifest = Object.values(contents.files).find(
      zipFile => zipFile.name === 'quiz/manifest.json' || zipFile.name.endsWith('/manifest.json')
    );

    if (!manifest) {
      throw new Error('No manifest file found in the ZIP archive');
    }

    // Load the quiz.json file
    const manifestJsonContent = await manifest.async('string');
    const manifestJson = JSON.parse(manifestJsonContent);

    // Validate the quiz structure
    if (!manifestJson.name || !Array.isArray(manifestJson.pageOrder)) {
      throw new Error('Invalid quiz.json format');
    }

    await caches.delete(QUIZ_CACHE);
    const cache = await caches.open(QUIZ_CACHE);

    // Store all files from the ZIP in the cache
    await Promise.all(
      Object.values(contents.files).map(async (zipFile) => {
        if (zipFile.dir) return;

        const fileContent = await zipFile.async('blob');
        const ext = zipFile.name.split('.').pop();
        const mimeType = mimeTypes[`.${ext}` as FileExtension] ?? mimeTypes._default;

        const headers = new Headers();
        headers.append('content-type', mimeType);
        headers.append('content-length', fileContent.size.toString());
  
        const response = new Response(fileContent, { headers });
  
        const url = new URL(`/${zipFile.name}`, location.origin).toString();
        const request = new Request(url, { cache: 'reload', headers });
        await cache.put(request, response);
      })
    );
};
