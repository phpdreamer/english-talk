import axios from 'axios';

// 使用相对路径以支持本地开发和Vercel部署
const API_BASE = '/api';

// 语音转文字
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'audio.webm');

  const response = await axios.post(`${API_BASE}/transcribe`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.text;
};

// GPT对话
export const sendMessage = async (
  message: string, 
  sessionId: string, 
  scene?: any
): Promise<string> => {
  const response = await axios.post(`${API_BASE}/chat`, {
    message,
    sessionId,
    scene,
  });

  return response.data.response;
};

// 文字转语音 - 支持场景特定语音
export const textToSpeech = async (
  text: string, 
  scene?: any
): Promise<string> => {
  const response = await axios.post(`${API_BASE}/speak`, {
    text,
    scene,
  });

  return response.data.audio_url;
};

// 清除会话
export const clearSession = async (sessionId: string): Promise<void> => {
  await axios.post(`${API_BASE}/clear-session`, { sessionId });
};

// 生成会话ID
export const generateSessionId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}; 