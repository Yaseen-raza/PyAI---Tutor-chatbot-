export type TutorMode = 'tutor' | 'reviewer' | 'debug';
export type LanguagePref = 'english' | 'roman-urdu';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  xp: number;
  level: string;
  streakDays: number;
  lastActiveDate: string;
  executionQuotaUsed: number;
  executionQuotaMax: number;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  topicTag: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  messageCount?: number;
}

export interface MessageMetadata {
  tokenCount?: number;
  model?: string;
  topicTag?: string;
  difficulty?: 'Beginner' | 'Beginner-Intermediate' | 'Intermediate' | 'Advanced';
  runtimeCost?: string;
  environmentStatus?: string;
  pedagogicalCards?: Array<{
    title: string;
    description: string;
    icon: string;
    variant: 'primary' | 'secondary' | 'tertiary';
  }>;
  codeSnippet?: {
    filename: string;
    language: string;
    code: string;
  };
  lineBreakdown?: Array<{
    code: string;
    explanation: string;
  }>;
  memoryAnalysis?: {
    summary: string;
    leftLabel: string;
    leftSize: string;
    rightLabel: string;
    rightSize: string;
    percentageSaved: string;
  };
  quiz?: {
    id: string;
    question: string;
    options: Array<{
      id: string;
      label: string;
      text: string;
      isCorrect: boolean;
    }>;
    explanation: string;
    xpAward: number;
  };
  lessonTakeaways?: string[];
  aiPipelineNote?: {
    title: string;
    tag: string;
    content: string;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: MessageMetadata;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  conversationId?: string;
  messageId?: string;
  title: string;
  snippet?: string;
  note?: string;
  topicTag: string;
  createdAt: string;
}

export interface LearningTopic {
  id: string;
  category: 'Python Fundamentals' | 'ML & Neural Nets' | 'RAG & LLMs' | 'Agentic AI';
  title: string;
  difficulty: 'Beginner' | 'Beginner-Intermediate' | 'Intermediate' | 'Advanced';
  description: string;
  estimatedTime: string;
  masteryPercent: number;
  isCompleted: boolean;
  starterPrompt: string;
  defaultCode?: string;
  keyConcepts: string[];
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId?: string;
  question: string;
  selectedOption: string;
  isCorrect: boolean;
  xpEarned: number;
  explanation: string;
  createdAt: string;
}

export interface UserPreference {
  userId: string;
  tutorMode: TutorMode;
  languagePref: LanguagePref;
  theme: 'dark' | 'light';
  fontSize: 'sm' | 'md' | 'lg';
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
  memoryBytes?: number;
}
