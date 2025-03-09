import { createContext } from "react";
import { LoadedQuiz } from '@/types/quiz';

interface QuizContextType {
  quizData: LoadedQuiz | null;
  error: string | null;
  resetQuiz: () => Promise<void>;
  // Quiz state from useQuiz
  currentQuestion: number;
  answers: Record<string, string | string[]>;
  timeRemaining: number;
  isComplete: boolean;
  // Quiz methods from useQuiz
  onAnswer: (questionId: string, answer: string | string[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

const defaultValue: QuizContextType = {
  quizData: null,
  error: null,
  resetQuiz: () => Promise.resolve(),
  // Default quiz state
  currentQuestion: 0,
  answers: {},
  timeRemaining: 0,
  isComplete: false,
  // Default quiz methods
  onAnswer: () => {},
  onNext: () => {},
  onPrev: () => {},
};

export const QuizContext = createContext<QuizContextType>(defaultValue);
