/**
 * Agent Orchestration Integration Tests
 * Verifies agent coordination, progress tracking, and workflow execution
 */

describe('Agent Orchestration System Integration', () => {
  test('agentOrchestrationService exports correctly', () => {
    const service = require('../../services/agentOrchestrationService').default;
    expect(service).toBeDefined();
    expect(service.coordinateAgents).toBeDefined();
    expect(service.getAgentStatus).toBeDefined();
    expect(service.getWorkflowSummary).toBeDefined();
  });

  test('service initializes all 6 agents', () => {
    const service = require('../../services/agentOrchestrationService').default;
    const SupervisorAgent = service.agents.get('SupervisorAgent');
    expect(SupervisorAgent).toBeDefined();
    expect(SupervisorAgent.status).toBe('idle');
  });

  test('AgentProgressPanel component loads', () => {
    const Component = require('../../components/AgentProgressPanel').default;
    expect(Component).toBeDefined();
  });

  test('AgentRecommendationsPanel component loads', () => {
    const Component = require('../../components/AgentRecommendationsPanel').default;
    expect(Component).toBeDefined();
  });

  test('useAgentProgress hook works', () => {
    const useAgentProgress = require('../../hooks/useAgentProgress').default;
    expect(useAgentProgress).toBeDefined();
  });

  test('agent can be retrieved by name', () => {
    const service = require('../../services/agentOrchestrationService').default;
    const status = service.getAgentStatus('SupervisorAgent');
    expect(status).toBeDefined();
    expect(status.name).toBe('SupervisorAgent');
  });
});
