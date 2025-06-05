// 存储会话上下文（在实际生产环境中应该使用数据库或Redis）
const conversations = new Map();

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // 清除会话历史
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
}; 