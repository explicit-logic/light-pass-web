import { useState, useEffect } from 'react';
import quizData from '@/data/quiz.json';
import { QuizState } from '@/types/quiz';

export function useQuiz() {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: {},
    timeRemaining: quizData.timeLimit,
    isComplete: false,
  });

  useEffect(() => {
    if (!quizState.isComplete) {
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
  }, [quizState.isComplete]);

  const handleAnswer = (answer: string | string[]) => {
    setQuizState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [quizData.questions[prev.currentQuestion].id]: answer,
      },
    }));
  };

  const handleNext = () => {
    if (quizState.currentQuestion === quizData.questions.length - 1) {
      setQuizState(prev => ({ ...prev, isComplete: true }));
    } else {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }));
    }
  };

  const handlePrev = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestion: Math.max(0, prev.currentQuestion - 1),
    }));
  };

  const resetQuiz = () => {
    setQuizState({
      currentQuestion: 0,
      answers: {},
      timeRemaining: quizData.timeLimit,
      isComplete: false,
    });
  };

  return {
    currentQuestion: quizState.currentQuestion,
    answers: quizState.answers,
    timeRemaining: quizState.timeRemaining,
    isComplete: quizState.isComplete,
    onAnswer: handleAnswer,
    onNext: handleNext,
    onPrev: handlePrev,
    resetQuiz,
  };
}
