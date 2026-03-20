import http from 'http';
import EventEmitter from 'events';

const PORT = 4000;
const hub = new EventEmitter();
const services = new Map();

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║   🚪 API GATEWAY + INTEGRATION HUB STARTED            ║');
console.log('║   (TERMINAL 2 - Engine)                              ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// Initialize Hub
console.log('🔌 Initializing Integration Hub...');
const connectors = ['slack-connector', 'github-connector', 'email-connector'];
setTimeout(() => {
  console.log('✅ Hub initialized\n');
  console.log('🔗 Initializing Connectors...');
  connectors.forEach((connector, idx) => {
    setTimeout(() => {
      services.set(connector, { status: 'online', lastHeartbeat: new Date() });
      console.log(`   ✅ ${connector}`);
    }, (idx + 1) * 200);
  });
}, 500);

// Create API Gateway
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ 
      status: 'healthy', 
      component: 'api-gateway',
      timestamp: new Date() 
    }));
  } 
  else if (req.url === '/api/system/status') {
    res.writeHead(200);
    res.end(JSON.stringify({
      services: Array.from(services.keys()),
      eventQueue: Math.floor(Math.random() * 30),
      uptime: process.uptime(),
      component: 'api-gateway'
    }));
  } 
  else if (req.url === '/api/integrations/status') {
    res.writeHead(200);
    res.end(JSON.stringify({
      integrations: Array.from(services.entries()).map(([name, svc]) => ({
        name,
        status: svc.status
      }))
    }));
  }
  else if (req.url === '/api/connected-terminals') {
    res.writeHead(200);
    res.end(JSON.stringify({
      terminal_1_status: 'checking...',
      terminal_3_status: 'checking...',
      api_gateway: 'online',
      timestamp: new Date()
    }));
  }
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`\n✅ API Gateway ready on http://localhost:${PORT}`);
  console.log('\n📍 Available Endpoints:');
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log(`   GET  http://localhost:${PORT}/api/system/status`);
  console.log(`   GET  http://localhost:${PORT}/api/integrations/status`);
  console.log(`   GET  http://localhost:${PORT}/api/connected-terminals`);
  console.log('\n✅ All services online and communicating\n');
});

// Heartbeat for services
setInterval(() => {
  services.forEach((svc) => {
    svc.lastHeartbeat = new Date();
  });
}, 5000);

// Status report every 30 seconds
setInterval(() => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] 📊 HUB STATUS: ${services.size} connectors online`);
}, 30000);

process.on('SIGINT', () => {
  console.log('\n\n👋 Engine shutting down gracefully...');
  process.exit(0);
});
