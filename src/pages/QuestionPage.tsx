import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Question } from '@/types/quiz';

interface QuestionPageProps {
  question: Question;
  onAnswer: (answer: string | string[]) => void;
  onNext: () => void;
  onPrev: () => void;
  answers: Record<string, string | string[]>;
  timeRemaining: number;
  currentQuestion: number;
  totalQuestions: number;
}

export const QuestionPage: React.FC<QuestionPageProps> = ({
  question,
  onAnswer,
  onNext,
  onPrev,
  answers,
  timeRemaining,
  currentQuestion,
  totalQuestions,
}) => {
  const { t } = useLanguage();
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const currentAnswer = answers[question.id] || (question.type === 'multiple-response' ? [] : '');

  const renderQuestion = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={currentAnswer === option}
                  onChange={(e) => onAnswer(e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 
                             dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 
                             dark:border-gray-600"
                />
                <label className="ml-2 w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case 'multiple-response':
        return (
          <div className="space-y-4">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  value={option}
                  checked={(currentAnswer as string[]).includes(option)}
                  onChange={(e) => {
                    const newAnswers = e.target.checked
                      ? [...(currentAnswer as string[]), option]
                      : (currentAnswer as string[]).filter(a => a !== option);
                    onAnswer(newAnswers);
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded 
                             focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 
                             dark:bg-gray-700 dark:border-gray-600"
                />
                <label className="ml-2 w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case 'fill-in-blank':
        return (
          <input
            type="text"
            value={currentAnswer as string}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder={t('question')}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                       focus:ring-blue-500 focus:border-blue-500 block w-full p-4
                       dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                       dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-base font-medium text-gray-900 dark:text-white">
            {t('question')} {currentQuestion + 1} {t('of')} {totalQuestions}
          </div>
          <div className="text-base font-medium text-gray-900 dark:text-white bg-gray-100 
                          dark:bg-gray-800 px-4 py-2 rounded-lg font-mono">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 
                        dark:border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {question.question}
          </h2>

          {question.imageUrl && (
            <img
              src={question.imageUrl}
              alt="Question illustration"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          {renderQuestion()}
        </div>

        <div className="flex justify-between">
          <button
            onClick={onPrev}
            disabled={currentQuestion === 0}
            className="flex items-center px-5 py-2.5 text-sm font-medium text-gray-900 
                       bg-white border border-gray-200 rounded-lg hover:bg-gray-100 
                       hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 
                       dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 
                       dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('previous')}
          </button>

          <button
            onClick={onNext}
            className="flex items-center px-5 py-2.5 text-sm font-medium text-white 
                       bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 
                       rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 
                       focus:outline-none dark:focus:ring-blue-800"
          >
            {currentQuestion === totalQuestions - 1 ? t('finish') : t('next')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};
