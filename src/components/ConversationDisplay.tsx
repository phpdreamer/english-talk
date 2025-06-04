import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store';

const ConversationDisplay: React.FC = () => {
  const { messages, showSubtitles, subtitleLanguage } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Translation simulation - in a real app, this would call a translation API
  const getTranslation = (text: string): string => {
    // Simple Chinese translations for demo purposes
    const translations: Record<string, string> = {
      'Hello there! Welcome to International Airport. How may I assist you today?': '您好！欢迎来到国际机场。我今天能为您提供什么帮助？',
      'Good evening and welcome to Grand Hotel. Do you have a reservation with us?': '晚上好，欢迎来到大酒店。您有预订吗？',
      'Hello! Welcome to our restaurant. Would you like to see the menu?': '你好！欢迎来到我们的餐厅。您想看菜单吗？',
      'Can you tell me where Gate B12 is?': '您能告诉我B12登机口在哪里吗？',
      'Gate B12 is on the second floor. Take the escalator up and turn right. It\'s about a 5-minute walk.': 'B12登机口在二楼。乘自动扶梯上楼后右转。大约需要5分钟步行时间。',
      'I need to check in for my flight to New York.': '我需要办理飞往纽约的航班登机手续。',
      'Yes, I have a reservation under the name Smith.': '是的，我有预订，姓名是史密斯。',
      'I\'d like to see the menu, please.': '我想看一下菜单，谢谢。',
    };
    
    return translations[text] || '(翻译不可用)';
  };

  if (messages.length === 0) return null;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
              }`}
            >
              <p className="text-sm md:text-base">{message.content}</p>
              
              {showSubtitles && message.sender === 'ai' && subtitleLanguage === 'chinese' && (
                <p className="text-xs mt-1 opacity-75">{getTranslation(message.content)}</p>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ConversationDisplay;