module.exports = async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const DEMO_MODE = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-or-v1-');
    
    res.status(200).json({
      status: 'ok',
      mode: DEMO_MODE ? 'demo' : 'live',
      timestamp: new Date().toISOString(),
      environment: 'vercel',
      message: 'API is working!'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 