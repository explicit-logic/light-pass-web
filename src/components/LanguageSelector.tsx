import { Languages } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const LanguageSelector = () => {
  const { language, setLanguage, isLoading } = useLanguage();

  return (
    <div className="fixed top-4 left-4 flex items-center gap-2">
      <Languages className={`w-5 h-5 text-gray-500 dark:text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'es' | 'fr' | 'uk')}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                   focus:ring-blue-500 focus:border-blue-500 block p-2.5 
                   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                   dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                   disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isLoading}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="uk">Українська</option>
      </select>
    </div>
  );
};
