export type Accent = 'american' | 'british' | 'indian';

export type Scene = {
  id: string;
  name: string;
  description: string;
  icon: string;
  userRole: string;
  aiRole: string;
  initialPrompt: string;
};

export type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
};

export type ConversationState = 'idle' | 'listening' | 'processing' | 'speaking';

export type AppState = {
  currentScene: Scene | null;
  accent: Accent;
  showSubtitles: boolean;
  subtitleLanguage: 'english' | 'chinese';
  messages: Message[];
  conversationState: ConversationState;
  sessionId: string | null;
  isRecording: boolean;
  isPlaying: boolean;
  lastTranscription: string;
  errorMessage: string | null;
  
  // Actions
  setCurrentScene: (scene: Scene | null) => void;
  setAccent: (accent: Accent) => void;
  toggleSubtitles: () => void;
  setSubtitleLanguage: (language: 'english' | 'chinese') => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setConversationState: (state: ConversationState) => void;
  setIsRecording: (isRecording: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setLastTranscription: (transcription: string) => void;
  setErrorMessage: (message: string | null) => void;
  resetToSceneSelector: () => void;
};