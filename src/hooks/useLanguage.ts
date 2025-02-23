import { useContext } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  return context;
};
