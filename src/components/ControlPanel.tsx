import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, ArrowLeft, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store';
import { AudioRecorder, AudioPlayer } from '../utils/audio';
import { transcribeAudio, sendMessage, textToSpeech } from '../utils/api';

const ControlPanel: React.FC = () => {
  const { 
    conversationState, 
    setConversationState,
    addMessage, 
    currentScene, 
    resetToSceneSelector,
    sessionId,
    isRecording,
    setIsRecording,
    isPlaying,
    setIsPlaying,
    lastTranscription,
    setLastTranscription,
    errorMessage,
    setErrorMessage,
    accent,
    showSubtitles
  } = useAppStore();
  
  const [recordingTime, setRecordingTime] = useState(0);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioPlayerRef = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    audioRecorderRef.current = new AudioRecorder();
    audioPlayerRef.current = new AudioPlayer();
    
    return () => {
      // 清理资源
      if (audioPlayerRef.current) {
        audioPlayerRef.current.stop();
      }
    };
  }, []);
  
  useEffect(() => {
    let interval: any = null;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleStartRecording = async () => {
    try {
      setErrorMessage(null);
      setConversationState('listening');
      setIsRecording(true);
      
      if (audioRecorderRef.current) {
        await audioRecorderRef.current.startRecording();
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      setErrorMessage('无法开始录音，请检查麦克风权限');
      setConversationState('idle');
      setIsRecording(false);
    }
  };

  const handleStopRecording = async () => {
    try {
      setIsRecording(false);
      setConversationState('processing');

      if (!audioRecorderRef.current) {
        throw new Error('No audio recorder available');
      }

      // 停止录音并获取音频数据
      const audioBlob = await audioRecorderRef.current.stopRecording();
      
      // 转录音频
      const transcription = await transcribeAudio(audioBlob);
      setLastTranscription(transcription);

      // 添加用户消息
      addMessage({
        content: transcription,
        sender: 'user'
      });

      // 发送到GPT获取回复
      if (!sessionId) {
        throw new Error('No session ID available');
      }

      const aiResponse = await sendMessage(transcription, sessionId, currentScene);

      // 添加AI回复消息
      addMessage({
        content: aiResponse,
        sender: 'ai'
      });

      // 将AI回复转换为语音并播放
      setConversationState('speaking');
      setIsPlaying(true);

      const audioBlob_tts = await textToSpeech(aiResponse, currentScene?.id || 'airport');
      
      if (audioPlayerRef.current) {
        await audioPlayerRef.current.playAudio(audioBlob_tts);
      }

      setIsPlaying(false);
      setConversationState('idle');

    } catch (error) {
      console.error('Recording processing failed:', error);
      setErrorMessage('处理录音时出错，请重试');
      setConversationState('idle');
      setIsRecording(false);
      setIsPlaying(false);
    }
  };

  const handleMicPress = () => {
    if (conversationState === 'idle') {
      handleStartRecording();
    } else if (conversationState === 'listening') {
      handleStopRecording();
    }
  };

  const handleExitConversation = () => {
    // 停止所有正在进行的音频操作
    if (audioRecorderRef.current && isRecording) {
      audioRecorderRef.current.stopRecording();
    }
    if (audioPlayerRef.current && isPlaying) {
      audioPlayerRef.current.stop();
    }
    
    resetToSceneSelector();
  };

  const getStatusText = () => {
    if (isRecording) return `录音中 ${formatTime(recordingTime)}`;
    if (conversationState === 'processing') return '处理中...';
    if (conversationState === 'speaking') return 'AI回答中...';
    return '按住说话';
  };

  const getButtonStyle = () => {
    if (isRecording) return 'bg-red-500 animate-pulse';
    if (conversationState === 'processing' || conversationState === 'speaking') {
      return 'bg-gray-300 cursor-not-allowed';
    }
    return 'bg-blue-600 hover:bg-blue-700';
  };

  const isDisabled = conversationState === 'processing' || conversationState === 'speaking';

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      {/* 错误消息显示 */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700 text-sm">{errorMessage}</span>
          <button 
            onClick={() => setErrorMessage(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* 最后的转录文本 */}
      {showSubtitles && lastTranscription && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-700">
            <strong>你说:</strong> {lastTranscription}
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto flex items-center justify-between">
        <button
          onClick={handleExitConversation}
          className="p-3 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        
        <div className="flex flex-col items-center">
          <div className="mb-2 text-sm font-medium text-gray-600 h-5">
            {getStatusText()}
          </div>
          
          <motion.button
            whileHover={{ scale: isDisabled ? 1 : 1.05 }}
            whileTap={{ scale: isDisabled ? 1 : 0.95 }}
            onClick={handleMicPress}
            disabled={isDisabled}
            className={`w-16 h-16 rounded-full flex items-center justify-center ${getButtonStyle()} transition-colors shadow-lg`}
          >
            {isRecording ? (
              <Square className="h-6 w-6 text-white" />
            ) : (
              <Mic className="h-6 w-6 text-white" />
            )}
          </motion.button>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            {isRecording ? '松开停止' : '按住录音'}
          </div>
        </div>
        
        <div className="w-10">
          {/* Placeholder to maintain centering */}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;