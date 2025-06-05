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
    // 在演示模式下直接返回模拟结果
    if (DEMO_MODE) {
      // 模拟语音识别 - 返回示例文本
      const randomText = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
      
      // 模拟处理延迟
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      return res.status(200).json({ 
        text: randomText,
        mode: 'demo' 
      });
    }

    // 真实API调用逻辑（暂时返回固定响应）
    res.status(200).json({ 
      text: "Audio transcription feature coming soon in production",
      mode: 'live'
    });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 