// ═══════════════════════════════════════════════════════════════
// Agent Definitions Index — Registry of all available agents
// ═══════════════════════════════════════════════════════════════

import { planningAgent } from './planningAgent.js';
import { riskAssessmentAgent } from './riskAssessmentAgent.js';
import { testingAgent } from './testingAgent.js';
import { completionAgent } from './completionAgent.js';
import { reviewAgent } from './reviewAgent.js';

export const AGENT_DEFINITIONS = {
  planning: planningAgent,
  riskAssessment: riskAssessmentAgent,
  testing: testingAgent,
  completion: completionAgent,
  review: reviewAgent,
};
