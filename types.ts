
export enum AppMode {
  CHAT = 'chat',
  DEEP_THINK = 'deep-think',
  VOICE = 'voice'
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  onboarded?: boolean;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  modelQuality: 'fast' | 'high';
  showGrounding: boolean;
  clearHistoryOnLogout: boolean;
  snowEnabled: boolean;
  customCursorEnabled: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  groundingLinks?: GroundingLink[];
  images?: string[];
  thought?: string;
}

export interface GroundingLink {
  title: string;
  uri: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}
