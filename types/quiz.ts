export interface Quiz {
  id: string;
  title: string;
  description?: string;
  shareId: string;
  questions: Question[];
  responses?: Response[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  quizId: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options: string[];
  correct: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Response {
  id: string;
  quizId: string;
  answers: Record<string, string | string[]>;
  score?: number;
  createdAt: Date;
}

export interface QuizGenerationOptions {
  count: number;
  difficulty: 'easy' | 'medium' | 'hard';
  types: ('multiple_choice' | 'true_false' | 'short_answer')[];
  customInstructions?: string;
}

export interface GeneratedQuestion {
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options?: string[];
  correct: string;
}

export interface QuizShareData {
  id: string;
  shareId: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface QuizTakerData {
  quizId: string;
  currentQuestion: number;
  answers: Record<string, string | string[]>;
  isComplete: boolean;
} 