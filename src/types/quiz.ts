export interface Question {
  id: string;
  type: 'multiple-choice' | 'multiple-response' | 'fill-in-blank';
  question: string;
  imageUrl?: string;
  options?: string[];
  correctAnswer: string | string[];
}

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