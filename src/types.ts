export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface ModelResponse {
  modelId: string;
  displayName: string; // Short name for UI
  text: string;
  error?: string;
  isLoading?: boolean;
  latency?: number; // ms
  isWinner?: boolean; // User selected as best
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: number;
  modelResponses?: ModelResponse[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}
