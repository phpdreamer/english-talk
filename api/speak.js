const axios = require('axios');

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
      
      return res.json({ 
        audio_url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAcBjuZ3/LDeS',
        message: 'Demo mode: Audio synthesis simulated' 
      });
    }

    // 真实API调用逻辑
    try {
      const sceneId = (scene && scene.id) ? scene.id : 'airport';
      const voiceId = SCENE_VOICES[sceneId] || SCENE_VOICES.airport;

      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          text: text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'xi-api-key': ELEVENLABS_API_KEY,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );

      const audioBuffer = Buffer.from(response.data);
      const base64Audio = audioBuffer.toString('base64');
      const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

      res.json({ audio_url: audioUrl });
    } catch (error) {
      console.error('ElevenLabs API error:', error);
      res.status(500).json({ error: 'Failed to synthesize speech' });
    }
  } catch (error) {
    console.error('Speak error:', error);
    res.status(500).json({ error: 'Failed to synthesize speech' });
  }
}; 