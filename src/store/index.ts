import { create } from 'zustand';
import { AppState, Message, Scene, Accent } from '../types';
import { generateSessionId } from '../utils/api';

export const useAppStore = create<AppState>((set, get) => ({
  currentScene: null,
  accent: 'american',
  showSubtitles: true,
  subtitleLanguage: 'english',
  messages: [],
  conversationState: 'idle',
  sessionId: null,
  isRecording: false,
  isPlaying: false,
  lastTranscription: '',
  errorMessage: null,

  // Actions
  setCurrentScene: (scene) => {
    const newSessionId = generateSessionId();
    set({ 
      currentScene: scene, 
      sessionId: newSessionId,
      messages: [], // 清空之前的消息
      conversationState: 'idle',
      errorMessage: null
    });
  },
  
  setAccent: (accent) => set({ accent }),
  
  toggleSubtitles: () => set((state) => ({ showSubtitles: !state.showSubtitles })),
  
  setSubtitleLanguage: (language) => set({ subtitleLanguage: language }),
  
  addMessage: (message) => set((state) => ({
    messages: [
      ...state.messages,
      {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        ...message,
      }
    ]
  })),
  
  clearMessages: () => set({ messages: [], sessionId: null }),
  
  setConversationState: (conversationState) => set({ conversationState }),

  setIsRecording: (isRecording) => set({ isRecording }),

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setLastTranscription: (lastTranscription) => set({ lastTranscription }),

  setErrorMessage: (errorMessage) => set({ errorMessage }),

  resetToSceneSelector: () => set({ 
    currentScene: null, 
    sessionId: null, 
    messages: [], 
    conversationState: 'idle',
    isRecording: false,
    isPlaying: false,
    lastTranscription: '',
    errorMessage: null
  }),
}));