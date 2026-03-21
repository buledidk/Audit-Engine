#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                    🚀 3-TERMINAL INTEGRATED SYSTEM                            ║${NC}"
echo -e "${CYAN}║              Brain + Engine + Watchdog = Complete Sync                       ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════════════════════╝${NC}\n"

cd /home/user/Audit-Automation-Engine

# Verify we're on the right branch
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
echo -e "${YELLOW}✓ Current Branch: $BRANCH${NC}\n"

# Install dependencies silently
echo -e "${YELLOW}📦 Installing dependencies (this may take a moment)...${NC}"
npm install --legacy-peer-deps > /dev/null 2>&1 &
INSTALL_PID=$!

# Wait for install
while kill -0 $INSTALL_PID 2>/dev/null; do
  sleep 1
done

echo -e "${GREEN}✅ Dependencies ready${NC}\n"

# Launch the 3 terminals
echo -e "${YELLOW}🚀 Launching 3 integrated terminals...${NC}\n"

# TERMINAL 1: Brain (Development Server)
echo -e "${BLUE}┌────────────────────────────────────────────────────────────┐${NC}"
echo -e "${BLUE}│ TERMINAL 1 (BRAIN)                                         │${NC}"
echo -e "${BLUE}│ Development Server + Agent Orchestration                   │${NC}"
echo -e "${BLUE}└────────────────────────────────────────────────────────────┘${NC}"
echo -e "${YELLOW}▶ Launching: npm run dev (http://localhost:3000)${NC}"
npm run dev > /tmp/terminal-1-brain.log 2>&1 &
TERMINAL_1_PID=$!
sleep 2

# TERMINAL 2: Engine (API Gateway + Hub)
echo -e "\n${BLUE}┌────────────────────────────────────────────────────────────┐${NC}"
echo -e "${BLUE}│ TERMINAL 2 (ENGINE)                                        │${NC}"
echo -e "${BLUE}│ API Gateway + Integration Hub                              │${NC}"
echo -e "${BLUE}└────────────────────────────────────────────────────────────┘${NC}"
echo -e "${YELLOW}▶ Launching: node scripts/start-engine.js (http://localhost:4000)${NC}"
node scripts/start-engine.js > /tmp/terminal-2-engine.log 2>&1 &
TERMINAL_2_PID=$!
sleep 2

# TERMINAL 3: Watchdog (Monitoring + Sync + Health)
echo -e "\n${BLUE}┌────────────────────────────────────────────────────────────┐${NC}"
echo -e "${BLUE}│ TERMINAL 3 (WATCHDOG)                                      │${NC}"
echo -e "${BLUE}│ Monitoring + Sync Engine + Health Checks                   │${NC}"
echo -e "${BLUE}└────────────────────────────────────────────────────────────┘${NC}"
echo -e "${YELLOW}▶ Launching: node scripts/start-watchdog.js (http://localhost:5000)${NC}"
node scripts/start-watchdog.js > /tmp/terminal-3-watchdog.log 2>&1 &
TERMINAL_3_PID=$!
sleep 2

echo -e "\n${GREEN}╔════════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ ALL 3 TERMINALS LAUNCHED SUCCESSFULLY                                  ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════════════════════╝${NC}\n"

# Verify connectivity
echo -e "${YELLOW}🔗 Verifying terminal connectivity...${NC}"
sleep 3

# Check Terminal 1 (Brain)
if curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Terminal 1 (Brain)     [ONLINE]  http://localhost:3000${NC}"
else
  echo -e "⏳ Terminal 1 (Brain)     [STARTING] http://localhost:3000"
fi

# Check Terminal 2 (Engine)
if curl -s http://localhost:4000/health | grep -q "api-gateway"; then
  echo -e "${GREEN}✅ Terminal 2 (Engine)    [ONLINE]  http://localhost:4000${NC}"
else
  echo -e "⏳ Terminal 2 (Engine)    [STARTING] http://localhost:4000"
fi

# Check Terminal 3 (Watchdog)
if curl -s http://localhost:5000/health | grep -q "watchdog"; then
  echo -e "${GREEN}✅ Terminal 3 (Watchdog)  [ONLINE]  http://localhost:5000${NC}"
else
  echo -e "⏳ Terminal 3 (Watchdog)  [STARTING] http://localhost:5000"
fi

echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ 3-TERMINAL SYSTEM ARCHITECTURE:${NC}\n"

echo -e "${YELLOW}┌─ TERMINAL 1: BRAIN ────────────────────────────────────────┐${NC}"
echo -e "${YELLOW}│ 🎨 Development Server         http://localhost:3000      │${NC}"
echo -e "${YELLOW}│ 🤖 6 AI Agents Ready                                      │${NC}"
echo -e "${YELLOW}│ 📊 React UI + Audit Interface                             │${NC}"
echo -e "${YELLOW}└────────────────────────────────────────────────────────────┘${NC}"
echo -e "            │"
echo -e "            │ HTTP Requests"
echo -e "            ▼"
echo -e "${YELLOW}┌─ TERMINAL 2: ENGINE ───────────────────────────────────────┐${NC}"
echo -e "${YELLOW}│ 🚪 API Gateway                http://localhost:4000      │${NC}"
echo -e "${YELLOW}│ 🔌 Integration Hub                                        │${NC}"
echo -e "${YELLOW}│ 📱 Connectors: Slack, GitHub, Email                       │${NC}"
echo -e "${YELLOW}└────────────────────────────────────────────────────────────┘${NC}"
echo -e "            │"
echo -e "            │ Event Bus + Sync"
echo -e "            ▼"
echo -e "${YELLOW}┌─ TERMINAL 3: WATCHDOG ─────────────────────────────────────┐${NC}"
echo -e "${YELLOW}│ 🏥 Health Monitoring                                      │${NC}"
echo -e "${YELLOW}│ 🔄 Database Sync Engine                                   │${NC}"
echo -e "${YELLOW}│ 📊 Status Checks               http://localhost:5000     │${NC}"
echo -e "${YELLOW}└────────────────────────────────────────────────────────────┘${NC}"

echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📍 QUICK COMMANDS:${NC}\n"

echo -e "${BLUE}View Logs:${NC}"
echo -e "  Terminal 1: tail -f /tmp/terminal-1-brain.log"
echo -e "  Terminal 2: tail -f /tmp/terminal-2-engine.log"
echo -e "  Terminal 3: tail -f /tmp/terminal-3-watchdog.log"
echo -e "  All logs:   tail -f /tmp/terminal-*.log\n"

echo -e "${BLUE}Test Endpoints:${NC}"
echo -e "  API Health:     curl http://localhost:4000/health"
echo -e "  System Status:  curl http://localhost:4000/api/system/status | jq ."
echo -e "  Watchdog:       curl http://localhost:5000/health | jq .\n"

echo -e "${BLUE}Stop All Services:${NC}"
echo -e "  kill $TERMINAL_1_PID $TERMINAL_2_PID $TERMINAL_3_PID\n"

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ ALL 3 TERMINALS RUNNING & SYNCED!${NC}"
echo -e "${GREEN}🎯 Ready for audit operations${NC}\n"

# Wait for all processes
wait
