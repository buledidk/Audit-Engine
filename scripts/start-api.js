import http from 'http';

const PORT = 4000;

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'healthy', timestamp: new Date() }));
  } else if (req.url === '/api/system/status') {
    res.writeHead(200);
    res.end(JSON.stringify({
      services: ['monitoring', 'sync-engine', 'slack-connector', 'github-connector'],
      eventQueue: Math.floor(Math.random() * 50),
      uptime: process.uptime()
    }));
  } else if (req.url === '/api/integrations/status') {
    res.writeHead(200);
    res.end(JSON.stringify({
      integrations: [
        { name: 'slack-connector', status: 'online' },
        { name: 'github-connector', status: 'online' },
        { name: 'email-connector', status: 'online' }
      ]
    }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║   🚪 API GATEWAY STARTED                               ║');
  console.log(`║   📍 Server running on http://localhost:${PORT}           ║`);
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  console.log('📍 Available Endpoints:');
  console.log(`   GET    http://localhost:${PORT}/health`);
  console.log(`   GET    http://localhost:${PORT}/api/system/status`);
  console.log(`   GET    http://localhost:${PORT}/api/integrations/status`);
  console.log('\n🔌 Ready to receive requests from UI\n');
});

process.on('SIGINT', () => {
  console.log('\n\n👋 API Gateway shutting down gracefully...');
  process.exit(0);
});
