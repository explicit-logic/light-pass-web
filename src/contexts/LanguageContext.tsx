import { createContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react';
import type { en } from '@/data/translations/en';

import { Route } from '@/routes/__root';

type TranslationKey = keyof typeof en;

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: TranslationKey) => string;
  isLoading: boolean;
}

const defaultValue: LanguageContextType = {
  language: 'en',
  setLanguage: () => {},
  t: (key: TranslationKey) => key,
  isLoading: true,
};

const LanguageContext = createContext<LanguageContextType>(defaultValue);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const search = Route.useSearch();
  const [currentTranslation, setCurrentTranslation] = useState<typeof en | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize language from URL query param or browser language
  const [language, setLanguage] = useState<string>(() => {
    const queryLang = search.lang;
    if (queryLang) {
      return queryLang;
    }
    const [browserLang] = navigator.language.split('-');

    return browserLang ? browserLang : 'en';
  });

  useEffect(() => {
    async function loadTranslation(lang: string) {
      setIsLoading(true);
      try {
        const module = await import(`@/data/translations/${lang}.ts`);
        setCurrentTranslation(module[lang]);
      } catch (error) {
        console.error(`Failed to load translations for ${lang}:`, error);
        // Fallback to English if translation loading fails
        if (lang !== 'en') {
          const enModule = await import('@/data/translations/en');
          setCurrentTranslation(enModule.en);
          setLanguage('en');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadTranslation(language);
  }, [language]);

  const t = useCallback((key: TranslationKey): string => {
    if (!currentTranslation) {
      return key;
    }
    return currentTranslation[key] || key;
  }, [currentTranslation]);

  const value = useMemo(() => ({ language, setLanguage, t, isLoading }), [language, t, isLoading]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export { LanguageContext };
