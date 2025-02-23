import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import quizData from '@/data/quiz.json';
import { useLanguage } from '@/hooks/useLanguage';

interface QuestionPageProps {
  currentQuestion: number;
  onAnswer: (answer: string | string[]) => void;
  onNext: () => void;
  onPrev: () => void;
  answers: Record<string, string | string[]>;
  timeRemaining: number;
}

export const QuestionPage: React.FC<QuestionPageProps> = ({
  currentQuestion,
  onAnswer,
  onNext,
  onPrev,
  answers,
  timeRemaining,
}) => {
  const { t } = useLanguage();
  const question = quizData.questions[currentQuestion];
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const currentAnswer = answers[question.id] || (question.type === 'multiple-response' ? [] : '');

  const renderQuestion = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            {question.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-center p-4 bg-white dark:bg-gray-700 rounded-lg
                           cursor-pointer transform transition-all hover:scale-[1.02]"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={currentAnswer === option}
                  onChange={(e) => onAnswer(e.target.value)}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="ml-3 text-gray-700 dark:text-gray-200">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'multiple-response':
        return (
          <div className="space-y-4">
            {question.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-center p-4 bg-white dark:bg-gray-700 rounded-lg
                           cursor-pointer transform transition-all hover:scale-[1.02]"
              >
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
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="ml-3 text-gray-700 dark:text-gray-200">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'fill-in-blank':
        return (
          <input
            type="text"
            value={currentAnswer as string}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-4 bg-white dark:bg-gray-700 rounded-lg
                       border border-gray-300 dark:border-gray-600
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            {t('question')} {currentQuestion + 1} {t('of')} {quizData.questions.length}
          </div>
          <div className="text-lg font-mono bg-white dark:bg-gray-800 px-4 py-2 rounded-lg">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
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
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700
                       rounded-lg font-semibold disabled:opacity-50
                       hover:bg-gray-300 dark:hover:bg-gray-600
                       transform transition-all hover:scale-[1.02]"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('previous')}
          </button>

          <button
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600
                       text-white rounded-lg font-semibold
                       hover:bg-indigo-700 transform transition-all
                       hover:scale-[1.02] active:scale-[0.98]"
          >
            {currentQuestion === quizData.questions.length - 1 ? t('finish') : t('next')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
