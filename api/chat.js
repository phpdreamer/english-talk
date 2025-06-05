// 模拟模式开关 - 如果API密钥无效则自动启用
const DEMO_MODE = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-or-v1-');

// 存储会话上下文（注意：在serverless环境中这是临时的）
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
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      return res.status(200).json({ 
        response: aiResponse,
        sessionId: sessionId,
        mode: 'demo'
      });
    }

    // 真实API调用逻辑
    try {
      // 这里需要实现OpenAI GPT API调用
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

      // 实际的OpenAI API调用会在这里
      const aiResponse = "OpenAI integration coming soon in production";
      conversationHistory.push({ role: 'assistant', content: aiResponse });
      conversations.set(sessionId, conversationHistory);

      res.status(200).json({ 
        response: aiResponse,
        sessionId: sessionId,
        mode: 'live'
      });
    } catch (error) {
      console.error('OpenAI API error:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
}; 