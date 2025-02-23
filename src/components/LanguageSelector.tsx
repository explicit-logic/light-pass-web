import { Languages } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const LanguageSelector = () => {
  const { language, setLanguage, isLoading } = useLanguage();

  return (
    <div className="fixed top-4 left-4 flex items-center gap-2">
      <Languages className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'es' | 'fr' | 'uk')}
        className="bg-gray-100 dark:bg-gray-800 rounded-md px-2 py-1
                   border border-gray-300 dark:border-gray-700
                   disabled:opacity-50"
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
