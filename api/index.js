export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  res.status(200).json({
    message: 'English AI Coach API',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/health',
      '/api/transcribe',
      '/api/chat',
      '/api/speak',
      '/api/clear-session'
    ]
  });
} 