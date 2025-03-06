export type QuestionType = 'multiple-choice' | 'multiple-response' | 'fill-in-blank';

// Base question interface with common properties
export interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: string;
  imageUrl?: string;
  correctAnswer: string | string[];
}

// Multiple choice question
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: string;
}

// Multiple response question
export interface MultipleResponseQuestion extends BaseQuestion {
  type: 'multiple-response';
  options: string[];
  correctAnswer: string[];
}

// Fill in the blank question
export interface FillInBlankQuestion extends BaseQuestion {
  type: 'fill-in-blank';
  correctAnswer: string;
}

// Union type for all question types
export type Question = MultipleChoiceQuestion | MultipleResponseQuestion | FillInBlankQuestion;

// Quiz metadata
export interface Quiz {
  title: string;
  description: string;
  timeLimit: number;
  questions: string[]; // Array of file paths to question JSON files
}

// Complete quiz with loaded questions
export interface LoadedQuiz extends Omit<Quiz, 'questions'> {
  questions: Question[];
}

// User's answers to questions
export type QuizAnswers = Record<string, string | string[]>;

export interface QuizState {
  currentQuestion: number;
  answers: Record<string, string | string[]>;
  timeRemaining: number;
  isComplete: boolean;
}

export interface UserInfo {
  name: string;
  email: string;
}
