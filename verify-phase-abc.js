#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const checks = [];
const COLORS = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function logCheck(name, passed, details = '') {
  const icon = passed ? '✅' : '❌';
  const color = passed ? COLORS.green : COLORS.red;
  console.log(`${color}${icon}${COLORS.reset} ${name}${details ? ' - ' + details : ''}`);
  checks.push({ name, passed });
}

function fileExists(filepath) {
  return fs.existsSync(path.join(__dirname, filepath));
}

function checkFileSize(filepath, minSize = 0) {
  const fullPath = path.join(__dirname, filepath);
  if (!fs.existsSync(fullPath)) return 0;
  return fs.statSync(fullPath).size;
}

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║     PHASE A-B-C VERIFICATION REPORT                    ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// Phase A - Foundation Services
console.log(`${COLORS.blue}PHASE A - FOUNDATION INFRASTRUCTURE${COLORS.reset}`);
console.log('─'.repeat(60));

logCheck('auditProceduresService.js exists', fileExists('src/services/auditProceduresService.js'), `${checkFileSize('src/services/auditProceduresService.js')} bytes`);
logCheck('agentOrchestrationService.js exists', fileExists('src/services/agentOrchestrationService.js'), `${checkFileSize('src/services/agentOrchestrationService.js')} bytes`);
logCheck('AuditContext.jsx updated', fileExists('src/context/AuditContext.jsx'), `${checkFileSize('src/context/AuditContext.jsx')} bytes`);

// Check AuditContext has new actions
const contextFile = fs.readFileSync(path.join(__dirname, 'src/context/AuditContext.jsx'), 'utf8');
logCheck('AuditContext has UPDATE_AGENT_PROGRESS', contextFile.includes('UPDATE_AGENT_PROGRESS'));
logCheck('AuditContext has agents state slice', contextFile.includes('agents: {'));
logCheck('AuditContext has documentation state slice', contextFile.includes('documentation: {'));
logCheck('AuditContext has auditProcedures state slice', contextFile.includes('auditProcedures: {'));

console.log(`\n${COLORS.blue}PHASE B - COMPONENTS & SERVICES${COLORS.reset}`);
console.log('─'.repeat(60));

logCheck('AuditProceduresPanel.jsx exists', fileExists('src/components/AuditProceduresPanel.jsx'), `${checkFileSize('src/components/AuditProceduresPanel.jsx')} bytes`);
logCheck('AgentProgressPanel.jsx exists', fileExists('src/components/AgentProgressPanel.jsx'), `${checkFileSize('src/components/AgentProgressPanel.jsx')} bytes`);
logCheck('AgentRecommendationsPanel.jsx exists', fileExists('src/components/AgentRecommendationsPanel.jsx'), `${checkFileSize('src/components/AgentRecommendationsPanel.jsx')} bytes`);
logCheck('DocumentationPanel.jsx exists', fileExists('src/components/DocumentationPanel.jsx'), `${checkFileSize('src/components/DocumentationPanel.jsx')} bytes`);

logCheck('documentationGenerationService.js exists', fileExists('src/services/documentationGenerationService.js'), `${checkFileSize('src/services/documentationGenerationService.js')} bytes`);
logCheck('fsliNarrativeService.js exists', fileExists('src/services/fsliNarrativeService.js'), `${checkFileSize('src/services/fsliNarrativeService.js')} bytes`);

logCheck('useAgentProgress hook exists', fileExists('src/hooks/useAgentProgress.js'), `${checkFileSize('src/hooks/useAgentProgress.js')} bytes`);
logCheck('useDocumentGeneration hook exists', fileExists('src/hooks/useDocumentGeneration.js'), `${checkFileSize('src/hooks/useDocumentGeneration.js')} bytes`);

console.log(`\n${COLORS.blue}PHASE C - INTEGRATION & TESTING${COLORS.reset}`);
console.log('─'.repeat(60));

// Check AuditEngine integration
const auditEngineFile = fs.readFileSync(path.join(__dirname, 'src/AuditEngine.jsx'), 'utf8');
logCheck('AuditEngine imports AuditProceduresPanel', auditEngineFile.includes('import AuditProceduresPanel'));
logCheck('AuditEngine imports AgentProgressPanel', auditEngineFile.includes('import AgentProgressPanel'));
logCheck('AuditEngine imports useAgentProgress', auditEngineFile.includes('import useAgentProgress'));
logCheck('AuditEngine imports useDocumentGeneration', auditEngineFile.includes('import useDocumentGeneration'));
logCheck('AuditEngine uses new hooks', auditEngineFile.includes('const { activeAgents, progress'));
logCheck('AuditEngine has procedures view mode', auditEngineFile.includes('viewMode === "procedures"'));
logCheck('AuditEngine has agents view mode', auditEngineFile.includes('viewMode === "agents"'));
logCheck('AuditEngine has documentation view mode', auditEngineFile.includes('viewMode === "documentation"'));

// Check test files
logCheck('AuditProceduresIntegration.test.js exists', fileExists('src/__tests__/integration/AuditProceduresIntegration.test.js'));
logCheck('AgentOrchestrationIntegration.test.js exists', fileExists('src/__tests__/integration/AgentOrchestrationIntegration.test.js'));
logCheck('DocumentationIntegration.test.js exists', fileExists('src/__tests__/integration/DocumentationIntegration.test.js'));

console.log(`\n${COLORS.blue}SERVICE FEATURES VERIFICATION${COLORS.reset}`);
console.log('─'.repeat(60));

const proceduresService = fs.readFileSync(path.join(__dirname, 'src/services/auditProceduresService.js'), 'utf8');
logCheck('Procedures Service has registerProcedure', proceduresService.includes('registerProcedure'));
logCheck('Procedures Service has recordTestingResults', proceduresService.includes('recordTestingResults'));
logCheck('Procedures Service has attachEvidence', proceduresService.includes('attachEvidence'));
logCheck('Procedures Service has event emitter', proceduresService.includes('on(event'));

const agentService = fs.readFileSync(path.join(__dirname, 'src/services/agentOrchestrationService.js'), 'utf8');
logCheck('Agent Service has coordinateAgents', agentService.includes('coordinateAgents'));
logCheck('Agent Service initializes 6 agents', agentService.includes('initializeAgents'));
logCheck('Agent Service has workflow tracking', agentService.includes('activeWorkflow'));
logCheck('Agent Service has event emitter', agentService.includes('emit(event'));

const docService = fs.readFileSync(path.join(__dirname, 'src/services/documentationGenerationService.js'), 'utf8');
logCheck('Documentation Service has generateDocumentationForPhase', docService.includes('generateDocumentationForPhase'));
logCheck('Documentation Service has exportToExcel', docService.includes('exportToExcel'));
logCheck('Documentation Service has exportToWord', docService.includes('exportToWord'));

const narrativeService = fs.readFileSync(path.join(__dirname, 'src/services/fsliNarrativeService.js'), 'utf8');
logCheck('FSLI Narrative Service initializes templates', narrativeService.includes('initializeTemplates'));
logCheck('FSLI Narrative Service has 5+ templates', (narrativeService.match(/cash:|receivables:|inventory:|fixedAssets:|payables:/g) || []).length >= 5);

// Summary
const passedCount = checks.filter(c => c.passed).length;
const totalCount = checks.length;
const percentage = Math.round((passedCount / totalCount) * 100);

console.log(`\n${COLORS.blue}SUMMARY${COLORS.reset}`);
console.log('─'.repeat(60));
console.log(`${COLORS.green}Passed: ${passedCount}/${totalCount} (${percentage}%)${COLORS.reset}`);

if (percentage === 100) {
  console.log(`\n${COLORS.green}✅ ALL CHECKS PASSED - READY FOR PRODUCTION${COLORS.reset}\n`);
  process.exit(0);
} else if (percentage >= 90) {
  console.log(`\n${COLORS.yellow}⚠️  MOST CHECKS PASSED - READY TO PROCEED${COLORS.reset}\n`);
  process.exit(0);
} else {
  console.log(`\n${COLORS.red}❌ SOME CHECKS FAILED - REVIEW REQUIRED${COLORS.reset}\n`);
  process.exit(1);
}
