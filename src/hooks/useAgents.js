// ═══════════════════════════════════════════════════════════════
// useAgents Hook — React interface for the Agent Orchestrator
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback, useEffect, useRef } from 'react';
import { orchestrator } from '../agents/AgentOrchestrator.js';
import { useEngagement } from '../context/EngagementContext.jsx';

export function useAgents() {
  const engagement = useEngagement();
  const [agentStatus, setAgentStatus] = useState('idle'); // idle | running | complete | error
  const [agentResults, setAgentResults] = useState([]);
  const [currentStep, setCurrentStep] = useState(null);
  const [stepLog, setStepLog] = useState([]);
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [lastRunAgent, setLastRunAgent] = useState(null);
  const unsubRef = useRef(null);

  // Subscribe to orchestrator events
  useEffect(() => {
    unsubRef.current = orchestrator.subscribe((event) => {
      switch (event.type) {
        case 'started':
          setAgentStatus('running');
          setAgentResults([]);
          setStepLog([]);
          setTotalSteps(event.totalSteps);
          setCurrentStepIndex(0);
          setLastRunAgent(event.agentDef?.name || event.agentName);
          break;
        case 'step_start':
          setCurrentStep(event.step?.name || `Step ${event.stepIndex + 1}`);
          setCurrentStepIndex(event.stepIndex);
          break;
        case 'step_complete':
          setStepLog(prev => [...prev, {
            name: event.stepResult?.stepName || `Step ${event.stepIndex + 1}`,
            status: event.stepResult?.status || 'ok',
            suggestionsCount: event.stepResult?.suggestions?.length || 0,
          }]);
          break;
        case 'completed':
          setAgentStatus('complete');
          setAgentResults(event.results || []);
          setCurrentStep(null);
          break;
        case 'error':
          setAgentStatus('error');
          setCurrentStep(null);
          break;
        case 'aborted':
          setAgentStatus('idle');
          setCurrentStep(null);
          break;
      }
    });
    return () => { if (unsubRef.current) unsubRef.current(); };
  }, []);

  // Build engagement state for agents
  const getEngagementState = useCallback(() => ({
    cfg: engagement.cfg,
    cellData: engagement.cellData,
    signOffs: engagement.signOffs,
    wpNotes: engagement.wpNotes,
    tbData: engagement.tbData,
    tbMappings: engagement.tbMappings,
    customItems: engagement.customItems,
    ind: engagement.ind,
    fw: engagement.fw,
    sz: engagement.sz,
    allWPs: engagement.allWPs,
    visibleWPs: engagement.visibleWPs,
    archived: engagement.archived,
    reviewStatus: engagement.reviewStatus,
  }), [
    engagement.cfg, engagement.cellData, engagement.signOffs,
    engagement.wpNotes, engagement.tbData, engagement.tbMappings,
    engagement.customItems, engagement.ind, engagement.fw, engagement.sz,
    engagement.allWPs, engagement.visibleWPs, engagement.archived,
    engagement.reviewStatus,
  ]);

  // Run an agent
  const runAgent = useCallback(async (agentName, options = {}) => {
    if (agentStatus === 'running') return null;
    const state = getEngagementState();
    const result = await orchestrator.runAgent(agentName, state, options);

    // Log to AI audit trail
    if (result.success && engagement.setAiAuditTrail) {
      engagement.setAiAuditTrail(prev => [...prev, {
        id: result.runId,
        timestamp: result.timestamp,
        wpRef: `Agent: ${result.agentLabel}`,
        prompt: `Ran ${result.agentLabel} agent`,
        responseSummary: `${result.results.length} suggestions generated`,
        responseLength: result.results.length,
        approvedBy: engagement.cfg?.partner || '[Not set]',
        modifications: 'Pending user review',
        status: 'Agent run — pending review',
      }]);
    }

    return result;
  }, [agentStatus, getEngagementState, engagement.setAiAuditTrail, engagement.cfg?.partner]);

  // Accept a suggestion — apply it to cellData
  const acceptResult = useCallback((resultId) => {
    setAgentResults(prev => {
      const updated = prev.map(r => r.id === resultId ? { ...r, status: 'accepted' } : r);
      const accepted = updated.find(r => r.id === resultId);
      if (accepted && accepted.cellKey && accepted.value && engagement.setCellData) {
        engagement.setCellData(prevData => ({
          ...prevData,
          [accepted.cellKey]: accepted.value,
        }));
        if (engagement.showToast) {
          engagement.showToast(`Applied: ${accepted.cellKey}`);
        }
      }
      return updated;
    });
  }, [engagement.setCellData, engagement.showToast]);

  // Reject a suggestion
  const rejectResult = useCallback((resultId) => {
    setAgentResults(prev =>
      prev.map(r => r.id === resultId ? { ...r, status: 'rejected' } : r)
    );
  }, []);

  // Accept all pending suggestions
  const acceptAll = useCallback(() => {
    setAgentResults(prev => {
      const updates = {};
      const updated = prev.map(r => {
        if (r.status === 'pending' && r.cellKey && r.value) {
          updates[r.cellKey] = r.value;
          return { ...r, status: 'accepted' };
        }
        return r;
      });
      if (Object.keys(updates).length > 0 && engagement.setCellData) {
        engagement.setCellData(prevData => ({ ...prevData, ...updates }));
        if (engagement.showToast) {
          engagement.showToast(`Applied ${Object.keys(updates).length} suggestions`);
        }
      }
      return updated;
    });
  }, [engagement.setCellData, engagement.showToast]);

  // Abort current agent
  const abortAgent = useCallback(() => {
    orchestrator.abort();
  }, []);

  // Get available agents
  const getAgentList = useCallback(() => {
    return orchestrator.getAgentList();
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setAgentStatus('idle');
    setAgentResults([]);
    setStepLog([]);
    setCurrentStep(null);
  }, []);

  return {
    runAgent,
    abortAgent,
    agentStatus,
    agentResults,
    currentStep,
    stepLog,
    totalSteps,
    currentStepIndex,
    lastRunAgent,
    acceptResult,
    rejectResult,
    acceptAll,
    getAgentList,
    reset,
  };
}
