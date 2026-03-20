import EventEmitter from 'events';

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║   🔌 INTEGRATION HUB STARTUP                           ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

const hub = new EventEmitter();
const services = new Map();
const eventQueue = [];

// Simulate service registration
const connectors = ['slack-connector', 'github-connector', 'email-connector'];

console.log('📡 Initializing Integration Hub...');
setTimeout(() => console.log('✅ Core hub initialized\n'), 500);

console.log('🔗 Initializing External Connectors...');
connectors.forEach((connector, idx) => {
  setTimeout(() => {
    services.set(connector, { status: 'online', lastHeartbeat: new Date() });
    console.log(`  ✅ ${connector.padEnd(25)} [online]`);
  }, (idx + 1) * 300);
});

// Heartbeat loop
setInterval(() => {
  services.forEach((svc, name) => {
    svc.lastHeartbeat = new Date();
  });
}, 5000);

// Status report every 15 seconds
setTimeout(() => {
  setInterval(() => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`\n[${timestamp}] 📊 HUB STATUS:`);
    console.log(`   ✅ Services online: ${services.size}`);
    console.log(`   📬 Events queued: ${eventQueue.length}`);
    services.forEach((svc, name) => {
      console.log(`   ✅ ${name.padEnd(25)} [${svc.status}]`);
    });
  }, 15000);
}, 15000);

process.on('SIGINT', () => {
  console.log('\n\n👋 Integration Hub shutting down gracefully...');
  process.exit(0);
});
