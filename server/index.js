const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');

dotenv.config();

const app = express();
const port = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 配置multer用于文件上传
const upload = multer({ storage: multer.memoryStorage() });

// 模拟模式开关 - 如果API密钥无效则自动启用
const DEMO_MODE = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-or-v1-');

// OpenAI设置
let openai = null;
if (!DEMO_MODE) {
  try {
    const { Configuration, OpenAIApi } = require('openai');
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    openai = new OpenAIApi(configuration);
  } catch (error) {
    console.log('OpenAI setup failed, using demo mode');
  }
}

// ElevenLabs配置 - 为每个场景分配固定的语音，确保性别匹配
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const SCENE_VOICES = {
  airport: '21m00Tcm4TlvDq8ikWAM',    // Rachel - 专业女声，匹配女性机场工作人员头像
  hotel: '29vD33N1CtxCmqQRPOHJ',      // Drew - 温和男声，匹配男性酒店前台头像
  restaurant: 'EXAVITQu4vr4xnSDxMaL'  // Sarah - 友好女声，匹配女性餐厅服务员头像
};

// 存储会话上下文
const conversations = new Map();

// 模拟响应数据
const mockResponses = {
  airport: [
    "Hello! Welcome to the airport. Gate B12 is located on the second floor. Please take the escalator up and turn right.",
    "May I see your passport and boarding pass please? I'll check you in right away.",
    "Your flight to New York is scheduled to depart at 3:45 PM from gate C22. It's currently on time.",
    "The baggage claim area is downstairs on level 1. Follow the signs for baggage claim.",
    "Security check is located just ahead. Please have your ID and boarding pass ready."
  ],
  hotel: [
    "Good evening! Welcome to Grand Hotel. Yes, I can see your reservation under Mr. Smith.",
    "Breakfast is served in our main restaurant on the first floor from 6:30 AM to 10:00 AM.",
    "I'll arrange for housekeeping to bring you extra towels right away.",
    "Check-out time is 11:00 AM. You can leave your luggage with our concierge if you need to.",
    "Our fitness center is open 24 hours and the pool closes at 10 PM."
  ],
  restaurant: [
    "Welcome to our restaurant! Here's our menu. Today's special is grilled salmon with lemon butter sauce.",
    "Would you prefer still water or sparkling water with your meal?",
    "Excellent choice! How would you like your steak cooked - rare, medium-rare, medium, or well-done?",
    "That will be ready in about 15 minutes. Can I get you anything to drink while you wait?",
    "Would you like to see our dessert menu, or would you prefer coffee or tea?"
  ]
};

console.log('🚀 Server starting in ' + (DEMO_MODE ? 'DEMO' : 'LIVE') + ' mode');

// API路由

// 1. 语音转文字 (Whisper) - 模拟版
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    if (DEMO_MODE) {
      // 模拟语音识别 - 返回示例文本
      const mockTranscriptions = [
        "Hello, can you help me find gate B12?",
        "I need to check in for my flight to New York.",
        "Where is the baggage claim area?",
        "I have a reservation under the name Smith.",
        "What time is breakfast served?",
        "Can I get extra towels for my room?",
        "Can I see the menu please?",
        "I'd like to order the salmon.",
        "How would you like your steak cooked?"
      ];
      
      const randomText = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
      
      // 模拟处理延迟
      setTimeout(() => {
        res.json({ text: randomText });
      }, 1000 + Math.random() * 1000);
      
      return;
    }

    // 真实API调用
    const tempFilePath = path.join(os.tmpdir(), 'audio_' + Date.now() + '.webm');
    fs.writeFileSync(tempFilePath, req.file.buffer);

    const response = await openai.createTranscription(
      fs.createReadStream(tempFilePath),
      'whisper-1',
      undefined,
      'json',
      0,
      'en'
    );

    fs.unlinkSync(tempFilePath);
    res.json({ text: response.data.text });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// 2. GPT对话
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId, scene } = req.body;
    
    if (!conversations.has(sessionId)) {
      conversations.set(sessionId, []);
    }
    
    const conversationHistory = conversations.get(sessionId);
    conversationHistory.push({ role: 'user', content: message });

    if (DEMO_MODE) {
      // 模拟AI回复
      const sceneId = (scene && scene.id) ? scene.id : 'airport';
      const responses = mockResponses[sceneId] || mockResponses.airport;
      const aiResponse = responses[Math.floor(Math.random() * responses.length)];
      
      conversationHistory.push({ role: 'assistant', content: aiResponse });
      conversations.set(sessionId, conversationHistory);

      // 模拟处理延迟
      setTimeout(() => {
        res.json({ 
          response: aiResponse,
          sessionId: sessionId
        });
      }, 1500 + Math.random() * 1000);
      
      return;
    }

    // 真实API调用
    let systemPrompt = 'You are an English conversation partner helping someone practice English. ';
    
    if (scene) {
      systemPrompt += 'Current scenario: ' + scene.name + '. You are playing the role of ' + scene.aiRole + ', and the user is ' + scene.userRole + '. ';
      systemPrompt += 'Setting: ' + scene.description + ' ';
      systemPrompt += 'Respond naturally and help the user practice English in this scenario. Keep responses conversational and not too long.';
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10)
    ];

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 150,
      temperature: 0.7
    });

    const aiResponse = completion.data.choices[0].message.content;
    conversationHistory.push({ role: 'assistant', content: aiResponse });
    conversations.set(sessionId, conversationHistory);

    res.json({ 
      response: aiResponse,
      sessionId: sessionId
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// 3. 文字转语音 (ElevenLabs) - 固定场景语音
app.post('/api/speak', async (req, res) => {
  try {
    const { text, sceneId = 'airport' } = req.body;
    
    if (DEMO_MODE) {
      // 模拟TTS - 返回成功响应
      res.status(200).json({ 
        message: 'Demo mode: TTS would play here',
        text: text,
        voice: SCENE_VOICES[sceneId] || SCENE_VOICES.airport
      });
      return;
    }

    // 根据场景选择固定的语音
    const voiceId = SCENE_VOICES[sceneId] || SCENE_VOICES.airport;
    
    const response = await axios.post(
      'https://api.elevenlabs.io/v1/text-to-speech/' + voiceId + '/stream',
      {
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': response.data.length
    });
    
    res.send(response.data);
  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

// 4. 清除会话
app.post('/api/clear-session', (req, res) => {
  try {
    const { sessionId } = req.body;
    conversations.delete(sessionId);
    res.json({ success: true });
  } catch (error) {
    console.error('Clear session error:', error);
    res.status(500).json({ error: 'Failed to clear session' });
  }
});

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mode: DEMO_MODE ? 'demo' : 'live',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log('🚀 Server running at http://localhost:' + port);
  console.log('📊 Mode: ' + (DEMO_MODE ? '🎭 DEMO (using mock responses)' : '🔥 LIVE (using real APIs)'));
  console.log('🎯 Test the API: http://localhost:' + port + '/api/health');
  console.log('🎤 Voice assignments:');
  console.log('   Airport: Rachel (Professional female)');
  console.log('   Hotel: Drew (Gentle male)'); 
  console.log('   Restaurant: Sarah (Friendly female)');
}); 