module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const DEMO_MODE = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-or-v1-');
  
  res.json({
    status: 'ok',
    mode: DEMO_MODE ? 'demo' : 'live',
    timestamp: new Date().toISOString(),
    environment: 'vercel'
  });
}; 