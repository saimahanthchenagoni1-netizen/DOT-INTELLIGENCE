
export interface User {
  username: string;
  email: string;
}

export interface AppSettings {
  snowEffect: boolean;
  mouseInteraction: boolean;
  themeColor: 'cyan' | 'purple' | 'emerald' | 'gold';
}

export enum QuizDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum QuizType {
  MULTIPLE_CHOICE = 'multiple_choice',
  WRITING = 'writing'
}

export interface QuizQuestion {
  id: number;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface SavedQuiz {
  id: string;
  title: string;
  date: string;
  score: number;
  total: number;
  questions: QuizQuestion[];
  answers: Record<number, string>;
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
}

export interface SavedFlashcardSet {
  id: string;
  title: string;
  date: string;
  cards: Flashcard[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface SavedStudyGuide {
  id: string;
  title: string;
  date: string;
  content: string;
}
