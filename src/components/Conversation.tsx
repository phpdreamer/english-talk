import React, { useEffect } from 'react';
import AvatarDisplay from './AvatarDisplay';
import ConversationDisplay from './ConversationDisplay';
import ControlPanel from './ControlPanel';
import { useAppStore } from '../store';

const Conversation: React.FC = () => {
  const { currentScene, addMessage, conversationState } = useAppStore();

  // Initialize conversation with AI's initial prompt
  useEffect(() => {
    if (currentScene) {
      // Add initial AI message
      addMessage({
        content: currentScene.initialPrompt,
        sender: 'ai'
      });
    }
  }, [currentScene, addMessage]);

  if (!currentScene) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/3 p-6 flex items-center justify-center bg-gray-50">
          <AvatarDisplay speaking={conversationState === 'speaking'} />
        </div>
        
        <div className="flex-1 flex flex-col border-l border-gray-200">
          <div className="p-4 bg-white border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">{currentScene.name}</h2>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Your role: {currentScene.userRole}</span>
              <span>AI role: {currentScene.aiRole}</span>
            </div>
          </div>
          
          <ConversationDisplay />
          
          <ControlPanel />
        </div>
      </div>
    </div>
  );
};

export default Conversation;