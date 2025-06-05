// 存储会话上下文（注意：在serverless环境中这是临时的）
const conversations = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // 清除指定会话
    conversations.delete(sessionId);
    
    res.json({ 
      success: true, 
      message: 'Session cleared successfully',
      sessionId: sessionId
    });
  } catch (error) {
    console.error('Clear session error:', error);
    res.status(500).json({ error: 'Failed to clear session' });
  }
} 