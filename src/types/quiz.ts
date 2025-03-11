export type QuestionType = 'multiple-choice' | 'multiple-response' | 'fill-in-the-blank';

// Option interface for multiple choice and multiple response questions
export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

// Base question interface with common properties
export interface BaseQuestion {
  id: string;
  type: QuestionType;
  text: string;
  image: string | null;
  options: QuestionOption[];
}

// Multiple choice question
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
}

// Multiple response question
export interface MultipleResponseQuestion extends BaseQuestion {
  type: 'multiple-response';
}

// Fill in the blank question
export interface FillInTheBlankQuestion extends BaseQuestion {
  type: 'fill-in-the-blank';
  answer: string;
  options: []; // Empty array for fill-in-the-blank
}

// Union type for all question types
export type Question = MultipleChoiceQuestion | MultipleResponseQuestion | FillInTheBlankQuestion;

// Page config structure
export interface PageConfig {
  id: string;
  title: string;
  questions: Question[];
}

// Quiz metadata
export interface Quiz {
  title: string;
  description: string;
  timeLimit: number;
  pages: string[]; // Array of file paths to page config JSON files
}

// Complete quiz with loaded questions
export interface LoadedQuiz extends Omit<Quiz, 'pages'> {
  pages: PageConfig[];
}

// User's answers to questions
export type QuizAnswers = Record<string, string | string[]>;

export interface QuizState {
  currentPage: number;
  currentQuestion: number;
  answers: Record<string, string | string[]>;
  timeRemaining: number;
  isComplete: boolean;
}

export interface UserInfo {
  name: string;
  email: string;
}
