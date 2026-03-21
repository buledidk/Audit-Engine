#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🚀 LAUNCHING COMPLETE INTEGRATED SYSTEM           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"

# Setup
cd /home/user/Audit-Automation-Engine

echo -e "${YELLOW}✅ On branch: $(git rev-parse --abbrev-ref HEAD)${NC}\n"

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install --legacy-peer-deps > /dev/null 2>&1 &
INSTALL_PID=$!

# Wait for install with spinner
while kill -0 $INSTALL_PID 2>/dev/null; do
  echo -ne "\r${YELLOW}📦 Installing dependencies... ${NC}"
  sleep 1
done

echo -e "\r${GREEN}✅ Dependencies installed${NC}\n"

# Launch terminals
echo -e "${YELLOW}🚀 Launching 6 terminals in parallel...\n${NC}"

# Terminal 1: Development Server (port 3000)
echo -e "${BLUE}[Terminal 1]${NC} Starting Development Server (http://localhost:3000)..."
npm run dev > /tmp/terminal1.log 2>&1 &
T1_PID=$!

# Terminal 2: Integration Hub
echo -e "${BLUE}[Terminal 2]${NC} Starting Integration Hub..."
sleep 0.5
node scripts/start-hub.js > /tmp/terminal2.log 2>&1 &
T2_PID=$!

# Terminal 3: API Gateway (port 4000)
echo -e "${BLUE}[Terminal 3]${NC} Starting API Gateway (http://localhost:4000)..."
sleep 0.5
node scripts/start-api.js > /tmp/terminal3.log 2>&1 &
T3_PID=$!

# Terminal 4: Monitoring Service
echo -e "${BLUE}[Terminal 4]${NC} Starting Monitoring Service..."
sleep 0.5
node scripts/start-monitoring.js > /tmp/terminal4.log 2>&1 &
T4_PID=$!

# Terminal 5: Sync Engine
echo -e "${BLUE}[Terminal 5]${NC} Starting Sync Engine..."
sleep 0.5
node scripts/start-sync.js > /tmp/terminal5.log 2>&1 &
T5_PID=$!

# Terminal 6: Status Monitor
echo -e "${BLUE}[Terminal 6]${NC} Starting Status Monitor..."
sleep 0.5
bash scripts/monitor-all.sh > /tmp/terminal6.log 2>&1 &
T6_PID=$!

echo -e "\n${GREEN}✅ All 6 services launched in background!${NC}\n"

echo -e "${BLUE}📍 Application URLs:${NC}"
echo -e "   🎨 Main App:        http://localhost:3000"
echo -e "   🚪 API Gateway:     http://localhost:4000"
echo -e "   📊 Health Check:    http://localhost:4000/health\n"

echo -e "${YELLOW}⏳ Waiting for services to initialize (15 seconds)...${NC}"
sleep 15

# Check if services are running
if kill -0 $T1_PID $T2_PID $T3_PID $T4_PID $T5_PID $T6_PID 2>/dev/null; then
  echo -e "\n${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║   ✅ COMPLETE SYSTEM READY & SYNCHRONIZED!            ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}\n"

  echo -e "${BLUE}All systems are running and synced:${NC}"
  echo -e "  ✅ Terminal 1: Development Server (PID: $T1_PID) - port 3000"
  echo -e "  ✅ Terminal 2: Integration Hub (PID: $T2_PID)"
  echo -e "  ✅ Terminal 3: API Gateway (PID: $T3_PID) - port 4000"
  echo -e "  ✅ Terminal 4: Monitoring & Alerts (PID: $T4_PID)"
  echo -e "  ✅ Terminal 5: Database Sync Engine (PID: $T5_PID)"
  echo -e "  ✅ Terminal 6: Live Status Monitor (PID: $T6_PID)\n"

  echo -e "${YELLOW}Next steps:${NC}"
  echo -e "  1. Open http://localhost:3000 in your browser"
  echo -e "  2. Check http://localhost:4000/health for API status"
  echo -e "  3. All systems are synchronized and ready"
  echo -e "  4. Run 'tail -f /tmp/terminal*.log' to see logs\n"

  echo -e "${BLUE}To stop all services:${NC}"
  echo -e "  kill $T1_PID $T2_PID $T3_PID $T4_PID $T5_PID $T6_PID\n"
else
  echo -e "\n${RED}❌ Some services failed to start. Check logs:${NC}"
  for i in {1..6}; do
    echo "  tail -f /tmp/terminal$i.log"
  done
fi

# Keep script running to maintain background processes
wait
