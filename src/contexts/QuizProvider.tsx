import React, { useCallback, useMemo, useState, ReactNode, useEffect } from 'react';
import { LoadedQuiz, QuizState } from '@/types/quiz';
import { QuizContext } from './QuizContext';
import { QUIZ_CACHE } from '@/config';

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quizData, setQuizData] = useState<LoadedQuiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Quiz state from useQuiz
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: {},
    timeRemaining: 0,
    isComplete: false,
  });

  // Update time limit when quiz data changes
  useEffect(() => {
    if (quizData) {
      setQuizState(prev => ({
        ...prev,
        timeRemaining: quizData.timeLimit
      }));
    }
  }, [quizData]);

  // Timer effect
  useEffect(() => {
    if (!quizState.isComplete && quizData) {
      const timer = setInterval(() => {
        setQuizState(prev => {
          if (prev.timeRemaining <= 0) {
            clearInterval(timer);
            return { ...prev, isComplete: true };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizState.isComplete, quizData]);

  // Methods from useQuiz
  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setQuizState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer,
      },
    }));
  };

  const handleNext = useCallback(() => {
    if (quizData && quizState.currentQuestion === quizData.questions.length - 1) {
      setQuizState(prev => ({ ...prev, isComplete: true }));
    } else {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }));
    }
  }, [quizData, quizState.currentQuestion]);

  const handlePrev = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestion: Math.max(0, prev.currentQuestion - 1),
    }));
  };

  const resetQuiz = async () => {
    try {
      await caches.delete(QUIZ_CACHE);
    } catch (err) {
      console.error('Failed to delete quiz cache:', err);
    }
    setQuizData(null);
    setError(null);
    setQuizState({
      currentQuestion: 0,
      answers: {},
      timeRemaining: 0,
      isComplete: false,
    });
  };

  const value = useMemo(() => ({
    quizData,
    error,
    resetQuiz,
    // Quiz state
    currentQuestion: quizState.currentQuestion,
    answers: quizState.answers,
    timeRemaining: quizState.timeRemaining,
    isComplete: quizState.isComplete,
    // Quiz methods
    onAnswer: handleAnswer,
    onNext: handleNext,
    onPrev: handlePrev,
  }), [quizData, error, quizState.currentQuestion, quizState.answers, quizState.timeRemaining, quizState.isComplete, handleNext]);

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};
