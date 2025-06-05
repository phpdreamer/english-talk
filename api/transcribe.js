const axios = require('axios');
const formidable = require('formidable');

// 模拟模式开关 - 如果API密钥无效则自动启用
const DEMO_MODE = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-or-v1-');

// 模拟语音识别响应
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

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (DEMO_MODE) {
      // 模拟语音识别 - 返回示例文本
      const randomText = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
      
      // 模拟处理延迟
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      return res.json({ text: randomText });
    }

    // 真实API调用逻辑
    const form = new formidable.IncomingForm();
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: 'Failed to parse form data' });
      }

      const audioFile = files.audio;
      if (!audioFile) {
        return res.status(400).json({ error: 'No audio file provided' });
      }

      try {
        // 这里需要实现OpenAI Whisper API调用
        // 由于Vercel的限制，可能需要使用不同的方式处理文件上传
        res.json({ text: "Audio transcription feature coming soon in production" });
      } catch (error) {
        console.error('Transcription error:', error);
        res.status(500).json({ error: 'Failed to transcribe audio' });
      }
    });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 