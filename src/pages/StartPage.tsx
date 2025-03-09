import React from 'react';
import { Clock, FileQuestion } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useQuiz } from '@/hooks/useQuiz';

interface StartPageProps {
  onStart: () => void;
}

export const StartPage: React.FC<StartPageProps> = ({ onStart }) => {
  const { t } = useLanguage();
  const { quizData } = useQuiz();

  // If quiz data is not loaded, show a loading message
  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-lg font-normal text-gray-500 dark:text-gray-400">
            {t('loading') || 'Loading quiz data...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 dark:text-white text-center">
          {quizData.title || t('title')}
        </h1>
        
        <p className="mb-8 text-lg font-normal text-gray-500 dark:text-gray-400 text-center">
          {quizData.description || t('description')}
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <FileQuestion className="w-5 h-5" />
            <span className="text-sm font-medium">{quizData.questions.length} {t('questions')}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">{Math.floor(quizData.timeLimit / 60)} {t('minutes')}</span>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 
                     font-medium rounded-lg text-lg px-5 py-4 text-center dark:bg-blue-600 
                     dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-all duration-200"
        >
          {t('startQuiz')}
        </button>
      </div>
    </div>
  );
};
