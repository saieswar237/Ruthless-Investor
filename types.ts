
export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface StartupEvaluation {
  id: string;
  timestamp: number;
  idea: string;
  analysis: string;
  reportCard: ReportCardData;
  sources?: { uri: string; title: string }[];
  chatHistory: Message[];
}

export interface ReportCardData {
  feasibility: number;
  innovationScore: number;
  replicationRate: string;
  estimatedCost: string;
  mvpBudget: string;
  pricingStrategy: string;
  competition: string;
  marketFitValue: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string;
}

export enum EvaluationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  CHATTING = 'CHATTING'
}
