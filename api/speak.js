// 模拟模式开关 - 如果API密钥无效则自动启用
const DEMO_MODE = !process.env.ELEVENLABS_API_KEY || !process.env.ELEVENLABS_API_KEY.startsWith('sk_');

// ElevenLabs配置 - 为每个场景分配固定的语音，确保性别匹配
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const SCENE_VOICES = {
  airport: '21m00Tcm4TlvDq8ikWAM',    // Rachel - 专业女声，匹配女性机场工作人员头像
  hotel: '29vD33N1CtxCmqQRPOHJ',      // Drew - 温和男声，匹配男性酒店前台头像
  restaurant: 'EXAVITQu4vr4xnSDxMaL'  // Sarah - 友好女声，匹配女性餐厅服务员头像
};

module.exports = async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, scene } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (DEMO_MODE) {
      // 模拟语音合成 - 返回一个模拟的音频URL
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
      
      return res.status(200).json({ 
        audio_url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAcBjuZ3/LDeS',
        message: 'Demo mode: Audio synthesis simulated',
        mode: 'demo'
      });
    }

    // 真实API调用逻辑（暂时返回固定响应）
    res.status(200).json({ 
      audio_url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAcBjuZ3/LDeS',
      message: 'Production mode: ElevenLabs integration coming soon',
      mode: 'live'
    });
  } catch (error) {
    console.error('Speak error:', error);
    res.status(500).json({ error: 'Failed to synthesize speech' });
  }
}; 