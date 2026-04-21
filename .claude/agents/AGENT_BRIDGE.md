# Agent Bridge — .claude/ agents ↔ src/ definitions

Maps each Claude Code agent (used in Claude Code sessions) to its corresponding
source code agent (used by the in-app AgentOrchestrator and AgentFramework).

## Mapping Table

| Claude Code Agent | src/ Definition | src/ File | Orchestrator Type |
|-------------------|----------------|-----------|-------------------|
| audit-planner | planningAgent | `src/agents/definitions/planningAgent.js` | — (via AgentOrchestrator) |
| audit-risk-assessor | riskAssessmentAgent | `src/agents/definitions/riskAssessmentAgent.js` | `ASSESS_RISK` |
| audit-materiality-calculator | MaterialityEngine | `src/services/materialityEngine.js` | `CALCULATE_MATERIALITY` |
| audit-framework-advisor | — (no src equivalent) | — | — |
| audit-procedure-designer | AIProcedureEngine + SubstantiveProceduresAgent | `src/services/aiProcedureEngine.js`, `src/services/substantiveProceduresAgent.js` | `SUGGEST_PROCEDURES`, `GENERATE_SUBSTANTIVE_PROGRAMME` |
| audit-sampling-specialist | TransactionalTestingAgent | `src/agents/AuditSpecializedAgents.js` | — (via AuditSpecialistRegistry) |
| audit-going-concern-assessor | solvencyGoingConcernAgent | `src/agents/definitions/solvencyGoingConcernAgent.js` | — (via AgentOrchestrator) |
| audit-journal-entry-tester | testingAgent (JE subset) | `src/agents/definitions/testingAgent.js` | — (via AgentOrchestrator) |
| audit-analytics-specialist | — (partial in planning/completion) | `src/agents/definitions/planningAgent.js` (planning analytics), `src/agents/definitions/completionAgent.js` (final review) | — |
| audit-documentation-specialist | — (no src equivalent) | — | — |
| audit-file-review-manager | reviewAgent | `src/agents/definitions/reviewAgent.js` | — (via AgentOrchestrator) |

## Specialist Agents (src-only, no .claude/ pair)

| src/ Agent | File | Purpose |
|-----------|------|---------|
| TechnicalAccountingLead | `src/agents/AuditSpecializedAgents.js` | IFRS/FRS technical guidance |
| ControlsAndGovernanceAssessor | `src/agents/AuditSpecializedAgents.js` | COSO/ISA 330 controls testing |
| ComplianceAdvisor | `src/agents/AuditSpecializedAgents.js` | Regulatory compliance (CA06, FCA) |
| TransactionalTestingAgent | `src/agents/AuditSpecializedAgents.js` | Assertion-level testing |

## Analytical Agents (src-only, no .claude/ pair)

| Agent | File | Focus |
|-------|------|-------|
| capitalGearingAgent | `src/agents/definitions/capitalGearingAgent.js` | Debt/equity ratios |
| investorRatiosAgent | `src/agents/definitions/investorRatiosAgent.js` | EPS, P/E, dividend yield |
| bankLenderRatiosAgent | `src/agents/definitions/bankLenderRatiosAgent.js` | Interest cover, DSCR |
| marketCompetitiveAgent | `src/agents/definitions/marketCompetitiveAgent.js` | Market position analysis |
| fraudRiskAgent | `src/agents/definitions/fraudRiskAgent.js` | ISA 240 fraud indicators |
| regressionPredictiveAgent | `src/agents/definitions/regressionPredictiveAgent.js` | Statistical modelling |
| estimationValuationAgent | `src/agents/definitions/estimationValuationAgent.js` | ISA 540 estimates |

## How to use

**From Claude Code session:** Skills trigger agents by name (e.g., `audit-planner`).
The agent reads codebase data files (`StandardsLibrary.js`, `RegulatoryData.js`, etc.)
and produces ISA-compliant outputs as structured markdown.

**From the app UI:** AgentPanel calls `orchestrator.runAgent(agentName, state, options)`
which executes the definition agents through the step-based AgentOrchestrator.
Results appear as cell suggestions that can be accepted/rejected.

**From the backend API:** POST to `/api/orchestrator/request` with a valid `type`
routes through `aiAgentOrchestrator.js` to the appropriate engine or agent.

## Gaps to fill

Two .claude/ agents have no src/ equivalent:
1. **audit-framework-advisor** — FRS/IFRS framework selection. The data exists in
   `FRSEncyclopaedia.js` and `IFRSEncyclopaedia.js` but no agent definition consumes it.
2. **audit-documentation-specialist** — ISA 230 working paper formatting. The
   `auditDocumentationService.js` service exists but has no agent wrapper.
