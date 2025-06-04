import React from 'react';
import { Globe, Mic, Settings } from 'lucide-react';
import { useAppStore } from '../store';

const Header: React.FC = () => {
  const { accent, setAccent, toggleSubtitles, showSubtitles, subtitleLanguage, setSubtitleLanguage } = useAppStore();
  const [showSettings, setShowSettings] = React.useState(false);

  const getAccentName = (accent: string) => {
    const names = {
      american: '美式英语',
      british: '英式英语',
      indian: '印度英语'
    };
    return names[accent as keyof typeof names];
  };

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Mic className="h-6 w-6 text-blue-600" />
        <h1 className="text-xl font-semibold text-gray-800">英语AI对话教练</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => toggleSubtitles()}
          className={`text-sm px-3 py-1 rounded-full ${showSubtitles ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
        >
          {showSubtitles ? '字幕：开启' : '字幕：关闭'}
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
          
          {showSettings && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg p-4 z-10">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">口音选择</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['american', 'british', 'indian'].map((accentOption) => (
                      <button
                        key={accentOption}
                        onClick={() => setAccent(accentOption as any)}
                        className={`text-sm px-2 py-1 rounded ${
                          accent === accentOption ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {getAccentName(accentOption)}
                      </button>
                    ))}
                  </div>
                </div>
                
                {showSubtitles && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">字幕语言</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSubtitleLanguage('english')}
                        className={`text-sm px-2 py-1 rounded ${
                          subtitleLanguage === 'english' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        英文
                      </button>
                      <button
                        onClick={() => setSubtitleLanguage('chinese')}
                        className={`text-sm px-2 py-1 rounded ${
                          subtitleLanguage === 'chinese' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        中文
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header