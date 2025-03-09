import { createContext } from "react";
import { LoadedQuiz } from '@/types/quiz';

interface QuizContextType {
  quizData: LoadedQuiz | null;
  isLoading: boolean;
  error: string | null;
  loadQuizFromZip: (file: File) => Promise<void>;
  resetQuiz: () => void;
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
  isLoading: false,
  error: null,
  loadQuizFromZip: () => Promise.resolve(),
  resetQuiz: () => {},
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
