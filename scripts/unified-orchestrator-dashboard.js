#!/usr/bin/env node

/**
 * UNIFIED ORCHESTRATOR DASHBOARD
 * Real-time monitoring of all 9 Claude agents working together
 *
 * Shows:
 * - All agents status and metrics
 * - Request routing and execution
 * - Cache performance
 * - Coordination patterns
 */

import orchestrator from "../src/services/aiAgentOrchestrator.js";

const REFRESH_INTERVAL = 2000; // 2 seconds

// ASCII art
const BANNER = `
╔════════════════════════════════════════════════════════════════════════════╗
║                 🤖 AUDIT AUTOMATION ENGINE - ORCHESTRATOR DASHBOARD       ║
║                                                                            ║
║  All 9 Claude Agents Working Together in Real-Time Coordination           ║
╚════════════════════════════════════════════════════════════════════════════╝
`;

// Agent groups
const AGENT_GROUPS = {
  "Core Engines (4)": {
    procedures: "Procedure Suggestion Engine",
    exceptions: "Exception Prediction Engine",
    jurisdictions: "Jurisdiction Planning Engine",
    materiality: "Materiality Calculator Engine",
  },
  "Claude Agents (5)": {
    reports: "Report Generation Agent",
    risk: "Risk Assessment Agent",
    compliance: "Compliance Checking Agent",
    evidence: "Evidence Analysis Agent",
    workflow: "Workflow Assistant Agent",
  },
};

function clearScreen() {
  console.clear();
}

function displayBanner() {
  console.log(BANNER);
}

function displayAgentsStatus() {
  const metrics = orchestrator.getMetrics();

  console.log(
    "┌─────────────────────────────────────────────────────────────────────────┐"
  );
  console.log("│                        AGENT STATUS                                 │");
  console.log(
    "├─────────────────────────────────────────────────────────────────────────┤"
  );

  // Display each group
  for (const [groupName, agents] of Object.entries(AGENT_GROUPS)) {
    console.log(`│ ${groupName.padEnd(72)} │`);

    for (const [agentKey, agentName] of Object.entries(agents)) {
      const agentMetrics = metrics.agents[agentKey];
      const status = agentMetrics ? "✅" : "❌";
      const displayName = agentName.padEnd(50);

      console.log(`│   ${status} ${displayName} │`);
    }
    console.log(
      "├─────────────────────────────────────────────────────────────────────────┤"
    );
  }

  console.log("│                                                                     │");
}

function displayOrchestratorMetrics() {
  const metrics = orchestrator.getMetrics();
  const m = metrics.orchestrator;

  console.log(
    "┌─────────────────────────────────────────────────────────────────────────┐"
  );
  console.log("│                    ORCHESTRATOR METRICS                              │");
  console.log(
    "├─────────────────────────────────────────────────────────────────────────┤"
  );

  const metricsData = [
    [
      "Total Requests",
      "Success Rate",
      "Failed Requests",
      "Avg Latency",
      "Cache Hits",
      "Cache Size",
    ],
    [
      m.totalRequests.toString(),
      m.successRate,
      m.failedRequests.toString(),
      m.averageLatency,
      m.cachedResponses.toString(),
      m.cacheSize.toString(),
    ],
  ];

  for (let i = 0; i < metricsData[0].length; i++) {
    const label = metricsData[0][i].padEnd(14);
    const value = metricsData[1][i].padStart(12);
    console.log(`│  ${label} : ${value}                         │`);
  }

  console.log(
    "├─────────────────────────────────────────────────────────────────────────┤"
  );
}

function displaySystemStatus() {
  const status = orchestrator.getStatus();
  const uptime = Math.floor(status.uptime);
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = uptime % 60;

  const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;
  const memory = status.memory.heapUsed
    ? `${(status.memory.heapUsed / 1024 / 1024).toFixed(1)} MB / ${(status.memory.heapTotal / 1024 / 1024).toFixed(1)} MB`
    : "N/A";

  console.log(
    "┌─────────────────────────────────────────────────────────────────────────┐"
  );
  console.log("│                      SYSTEM STATUS                                   │");
  console.log(
    "├─────────────────────────────────────────────────────────────────────────┤"
  );
  console.log(
    `│  Status           : ${status.orchestrator.padEnd(58)} │`
  );
  console.log(
    `│  Agents Ready     : ${status.agentsReady}/${status.agents}` +
      " ".repeat(61 - (`${status.agentsReady}/${status.agents}`.length)) +
      "│"
  );
  console.log(
    `│  Uptime           : ${uptimeStr.padEnd(58)} │`
  );
  console.log(
    `│  Memory Usage     : ${memory.padEnd(58)} │`
  );
  console.log(
    "├─────────────────────────────────────────────────────────────────────────┤"
  );
}

function displayCoordinationExamples() {
  console.log("│                  AGENT COORDINATION PATTERNS                         │");
  console.log(
    "├─────────────────────────────────────────────────────────────────────────┤"
  );

  const patterns = [
    "1. FULL_ENGAGEMENT_ANALYSIS - All 5 agents in parallel for complete analysis",
    "2. EXCEPTION_HANDLING - Exception → Root Cause → Prevention workflow",
    "3. RISK_ASSESSMENT_SUITE - Inherent → Control → Overall risk assessment",
    "4. SMART_CACHING - 5-minute TTL with automatic cleanup",
    "5. FALLBACK_STRATEGY - Graceful degradation if rate limited",
  ];

  for (const pattern of patterns) {
    console.log(`│  ${pattern.padEnd(71)} │`);
  }

  console.log(
    "├─────────────────────────────────────────────────────────────────────────┤"
  );
}

function displayFooter() {
  const timestamp = new Date().toLocaleString();
  console.log("│                                                                     │");
  console.log(
    `│  Last Updated: ${timestamp.padEnd(55)} │`
  );
  console.log(
    "│  🟢 All Systems Operational | Press Ctrl+C to exit                      │"
  );
  console.log(
    "└─────────────────────────────────────────────────────────────────────────┘"
  );
}

function displayReferenceGuide() {
  console.log("\n");
  console.log(
    "═══════════════════════════════════════════════════════════════════════════"
  );
  console.log("API ENDPOINT EXAMPLES - To test agents:");
  console.log(
    "═══════════════════════════════════════════════════════════════════════════"
  );

  const examples = [
    {
      name: "Suggest Procedures",
      endpoint: "POST /api/orchestrator/request",
      body: '{ "type": "SUGGEST_PROCEDURES", "engagementId": "eng-123", "params": {...} }',
    },
    {
      name: "Predict Exceptions",
      endpoint: "POST /api/orchestrator/request",
      body: '{ "type": "PREDICT_EXCEPTIONS", "engagementId": "eng-123", "params": {...} }',
    },
    {
      name: "Full Analysis",
      endpoint: "POST /api/orchestrator/request",
      body: '{ "type": "FULL_ENGAGEMENT_ANALYSIS", "engagementId": "eng-123", "params": {...} }',
    },
    {
      name: "Get Metrics",
      endpoint: "GET /api/orchestrator/metrics",
      body: "Returns real-time orchestrator metrics",
    },
  ];

  for (const example of examples) {
    console.log(`\n  ${example.name}:`);
    console.log(`    Endpoint: ${example.endpoint}`);
    console.log(`    Body:     ${example.body}`);
  }

  console.log(
    "\n═══════════════════════════════════════════════════════════════════════════\n"
  );
}

function refresh() {
  clearScreen();
  displayBanner();
  displayAgentsStatus();
  displayOrchestratorMetrics();
  displaySystemStatus();
  displayCoordinationExamples();
  displayFooter();
}

// Main loop
console.log("Starting Unified Orchestrator Dashboard...");
refresh();

const interval = setInterval(refresh, REFRESH_INTERVAL);

// Cleanup on exit
process.on("SIGINT", () => {
  clearInterval(interval);
  console.log("\n\nDashboard closed. Goodbye!");
  process.exit(0);
});

// Display reference guide on startup
setTimeout(() => {
  console.log("\n");
  displayReferenceGuide();
}, 3000);
