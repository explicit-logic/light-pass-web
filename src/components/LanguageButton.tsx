import { useLanguage } from '@/hooks/useLanguage';

interface LanguageButtonProps {
  lang: 'en' | 'uk';
  label: string;
}

export const LanguageButton = ({ lang, label }: LanguageButtonProps) => {
  const { language, setLanguage, isLoading } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(lang)}
      disabled={isLoading}
      className={`px-3 py-1.5 text-sm rounded-lg
        ${language === lang
          ? 'border border-blue-500 bg-blue-500 text-white dark:bg-blue-600'
          : 'bg-gray-50 border border-gray-300 text-gray-900 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
        }
        disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {label}
    </button>
  );
}; 
