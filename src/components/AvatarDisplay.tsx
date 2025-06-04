import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store';

type AvatarDisplayProps = {
  speaking: boolean;
};

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ speaking }) => {
  const { currentScene, accent } = useAppStore();
  
  // In a real implementation, we would have different avatars for different scenes and accents
  // For this prototype, we'll use placeholder images based on the accent
  const getAvatarUrl = () => {
    switch (accent) {
      case 'american':
        return 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600';
      case 'british':
        return 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=600';
      case 'indian':
        return 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=600';
      default:
        return 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600';
    }
  };

  if (!currentScene) return null;

  return (
    <div className="relative flex flex-col items-center">
      <div className="w-36 h-36 md:w-48 md:h-48 overflow-hidden rounded-full bg-gray-200 border-4 border-white shadow-md">
        <img 
          src={getAvatarUrl()} 
          alt={`${currentScene.aiRole} avatar`} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {speaking && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium"
        >
          Speaking...
        </motion.div>
      )}
      
      <div className="mt-3 text-center">
        <h3 className="font-medium text-gray-800">{currentScene.aiRole}</h3>
        <p className="text-sm text-gray-500 capitalize">{accent} Accent</p>
      </div>
    </div>
  );
};

export default AvatarDisplay;