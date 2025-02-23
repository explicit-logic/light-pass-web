import React from 'react';
import { Clock, FileQuestion } from 'lucide-react';
import quizData from '@/data/quiz.json';
import { useLanguage } from '@/hooks/useLanguage';

interface MainPageProps {
  onStart: () => void;
}

export const MainPage: React.FC<MainPageProps> = ({ onStart }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transform transition-all hover:scale-[1.02]">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          {t('title')}
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
          {t('description')}
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <FileQuestion className="w-5 h-5" />
            <span>{quizData.questions.length} {t('questions')}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Clock className="w-5 h-5" />
            <span>{Math.floor(quizData.timeLimit / 60)} {t('minutes')}</span>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 
                     text-white rounded-xl font-semibold text-lg
                     transform transition-all hover:scale-[1.02] active:scale-[0.98]
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {t('startQuiz')}
        </button>
      </div>
    </div>
  );
};
