import React from 'react';
import { scenes, getSceneIcon } from '../data/scenes';
import { useAppStore } from '../store';
import { motion } from 'framer-motion';

const SceneSelector: React.FC = () => {
  const { setCurrentScene, clearMessages } = useAppStore();

  const handleSelectScene = (scene: any) => {
    clearMessages();
    setCurrentScene(scene);
  };

  return (
    <div className="py-8 px-4 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">选择练习场景</h2>
        <p className="text-gray-600">选择一个真实生活场景来练习英语口语</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenes.map((scene) => {
          const Icon = getSceneIcon(scene.icon);
          
          return (
            <motion.div
              key={scene.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer border border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all"
              onClick={() => handleSelectScene(scene)}
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{scene.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{scene.description}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>你的角色：{scene.userRole}</span>
                  <span>AI角色：{scene.aiRole}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SceneSelector