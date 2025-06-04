import React from 'react';
import Header from './components/Header';
import SceneSelector from './components/SceneSelector';
import Conversation from './components/Conversation';
import { useAppStore } from './store';

function App() {
  const { currentScene } = useAppStore();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 overflow-y-auto">
        {currentScene ? <Conversation /> : <SceneSelector />}
      </main>
    </div>
  );
}

export default App;