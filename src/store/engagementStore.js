// Zustand store for audit engagement state management
// Complete audit trail, phase gating, and working paper tracking

const engagementStore = {
  // ═════════════════════════════════════════════════════════════════
  // ENGAGEMENT MASTER DATA
  // ═════════════════════════════════════════════════════════════════
  engagement: {
    id: "",
    entityName: "",
    entityId: "",
    industryId: "",
    sector: "",
    framework: "FRS102", // FRS102 | IFRS | IFRS_SME
    entitySize: "medium", // micro | small | medium | large

    // Dates
    financialYearEnd: "",
    auditPeriodStart: "",
    auditPeriodEnd: "",
    createdDate: new Date().toISOString(),
    lastModified: new Date().toISOString(),

    // Team
    team: {
      partner: { name: "", email: "", role: "partner", signOffDate: null },
      manager: { name: "", email: "", role: "manager" },
      seniorAuditor: { name: "", email: "", role: "senior" },
      juniorAuditors: []
    },

    // Materiality & Risk Budgets
    materiality: {
      overall: 0,
      performance: 0, // typically 75% of OM
      trivial: 0, // typically 5% of OM
      basis: "5% PBT", // benchmarking basis
      justification: "",
      calculationWorkingPaper: "A3"
    },

    // Risk Assessment Results
    riskAssessment: {
      inherentRisk: 0, // 1-5 scale
      controlRisk: 0,
      detectionRisk: 0,
      combinedRisk: 0,
      significantRisks: [], // [{ id, description, isa, response }]
      fraudRisks: [],
      relatedParties: [],
      goingConcernAssessment: { risk: "LOW", justification: "" }
    },

    // Control Assessment (Interim Phase)
    controls: {
      designEffectiveness: "effective", // effective | ineffective | partial
      operatingEffectiveness: "effective",
      testingResults: [], // [{ controlId, procedure, result, exceptions }]
      reliedUpon: [] // [controlIds]
    },

    // Phase Progress
    phases: {
      planning: {
        status: "pending", // pending | in_progress | complete
        completionPercent: 0,
        startDate: null,
        endDate: null,
        workingPapers: {}
      },
      riskAssessment: {
        status: "pending",
        completionPercent: 0,
        startDate: null,
        endDate: null,
        workingPapers: {}
      },
      interim: {
        status: "pending",
        completionPercent: 0,
        startDate: null,
        endDate: null,
        workingPapers: {}
      },
      finalAudit: {
        status: "pending",
        completionPercent: 0,
        startDate: null,
        endDate: null,
        workingPapers: {}
      },
      completion: {
        status: "pending",
        completionPercent: 0,
        startDate: null,
        endDate: null,
        workingPapers: {}
      },
      reporting: {
        status: "pending",
        completionPercent: 0,
        startDate: null,
        endDate: null,
        workingPapers: {}
      }
    },

    // Issues & Findings
    issues: {
      openIssues: [],
      misstatements: [],
      adjustedMisstatements: 0,
      unadjustedMisstatements: 0,
      totalMisstatementPercent: 0
    },

    // Audit Trail (immutable log)
    auditTrail: [] // [{ timestamp, userId, action, phase, wpId, change }]
  },

  // ═════════════════════════════════════════════════════════════════
  // WORKING PAPER DEFINITIONS
  // ═════════════════════════════════════════════════════════════════
  workingPaperDefinitions: {
    // PLANNING PHASE
    "A1": {
      ref: "A1",
      label: "Engagement Letter",
      phase: "planning",
      isa: "ISA 210",
      description: "Terms of audit engagement",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "A2": {
      ref: "A2",
      label: "Client Risk Assessment",
      phase: "planning",
      isa: "ISA 315",
      description: "Entity and business risks",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "A3": {
      ref: "A3",
      label: "Materiality Calculation",
      phase: "planning",
      isa: "ISA 320",
      description: "Overall, Performance, Trivial thresholds",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "A4": {
      ref: "A4",
      label: "Audit Strategy",
      phase: "planning",
      isa: "ISA 200",
      description: "Audit scope and approach",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "A5": {
      ref: "A5",
      label: "Team Allocation",
      phase: "planning",
      isa: "ISA 220",
      description: "Audit team roles and responsibilities",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },

    // RISK ASSESSMENT PHASE
    "B1": {
      ref: "B1",
      label: "Risk Matrix",
      phase: "riskAssessment",
      isa: "ISA 315",
      description: "Inherent, Control, Detection risk assessment",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "B2": {
      ref: "B2",
      label: "Control Matrix",
      phase: "riskAssessment",
      isa: "ISA 315",
      description: "Control design and operating effectiveness",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "B3": {
      ref: "B3",
      label: "Significant Accounting Estimates",
      phase: "riskAssessment",
      isa: "ISA 540",
      description: "Accounting judgments and estimates",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "B4": {
      ref: "B4",
      label: "Fraud Risk Assessment",
      phase: "riskAssessment",
      isa: "ISA 240",
      description: "Management override, fraud opportunities",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "B5": {
      ref: "B5",
      label: "Going Concern & Related Parties",
      phase: "riskAssessment",
      isa: "ISA 570, ISA 550",
      description: "Going concern assessment and related parties",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },

    // INTERIM PHASE
    "D1": {
      ref: "D1",
      label: "Control Design Testing",
      phase: "interim",
      isa: "ISA 330",
      description: "Design effectiveness of key controls",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "D2": {
      ref: "D2",
      label: "Control Operating Testing",
      phase: "interim",
      isa: "ISA 330",
      description: "Operating effectiveness of controls",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },

    // FINAL AUDIT PHASE - FSLI LEAD SCHEDULES
    "C1": {
      ref: "C1",
      label: "Trial Balance Lead Schedule",
      phase: "finalAudit",
      isa: "ISA 500",
      description: "TB reconciliation and roll-forward",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "D3": {
      ref: "D3",
      label: "Revenue & Receivables (D3)",
      phase: "finalAudit",
      isa: "ISA 500, ISA 240, ISA 501, ISA 505",
      description: "Revenue testing and AR substantive procedures",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "D4": {
      ref: "D4",
      label: "Inventory & WIP (D4)",
      phase: "finalAudit",
      isa: "ISA 501",
      description: "Inventory attendance, NRV, cost allocation",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "D5": {
      ref: "D5",
      label: "Fixed Assets & Leases (D5)",
      phase: "finalAudit",
      isa: "ISA 500, ISA 540",
      description: "Asset additions, depreciation, impairment, lease classification",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "D6": {
      ref: "D6",
      label: "Payables & Accruals (D6)",
      phase: "finalAudit",
      isa: "ISA 500, ISA 501",
      description: "Payables confirmation, cut-off, accrual testing",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "D7": {
      ref: "D7",
      label: "Loans & Covenants (D7)",
      phase: "finalAudit",
      isa: "ISA 500, ISA 505",
      description: "Loan confirmations, covenant testing, repayment terms",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "D8": {
      ref: "D8",
      label: "Tax & Deferred Tax (D8)",
      phase: "finalAudit",
      isa: "ISA 500, ISA 540",
      description: "Provision adequacy, deferred tax, losses",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "D9": {
      ref: "D9",
      label: "Provisions & Contingencies (D9)",
      phase: "finalAudit",
      isa: "ISA 540",
      description: "Provision criteria, legal claims, onerous contracts",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "D10": {
      ref: "D10",
      label: "Equity (D10)",
      phase: "finalAudit",
      isa: "ISA 500",
      description: "Share capital, movements, dividend testing",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "D11": {
      ref: "D11",
      label: "Cash & Equivalents (D11)",
      phase: "finalAudit",
      isa: "ISA 500, ISA 505",
      description: "Bank confirmations, reconciliations, cash counts",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "D12": {
      ref: "D12",
      label: "Journal Entries & Consolidation (D12)",
      phase: "finalAudit",
      isa: "ISA 500, ISA 240",
      description: "JE testing, consolidation adjustments, intercompany",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "D13": {
      ref: "D13",
      label: "Post-Balance Sheet Events (D13)",
      phase: "finalAudit",
      isa: "ISA 560",
      description: "Events between year-end and report date",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "D14": {
      ref: "D14",
      label: "Related Party Transactions (D14)",
      phase: "finalAudit",
      isa: "ISA 550",
      description: "Related party testing, disclosures, arm's length",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },

    // COMPLETION PHASE
    "E1": {
      ref: "E1",
      label: "Completion Checklist",
      phase: "completion",
      isa: "ISA 500, ISA 220",
      description: "Final review, outstanding items",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "E2": {
      ref: "E2",
      label: "Going Concern Conclusion",
      phase: "completion",
      isa: "ISA 570",
      description: "Final going concern assessment and disclosure",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "E3": {
      ref: "E3",
      label: "Subsequent Events",
      phase: "completion",
      isa: "ISA 560",
      description: "Review of post year-end events",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "E4": {
      ref: "E4",
      label: "Management Representations Letter",
      phase: "completion",
      isa: "ISA 580",
      description: "Written representations from management",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "E5": {
      ref: "E5",
      label: "Disclosure Compliance Checklist",
      phase: "completion",
      isa: "ISA 500, FRS 102, IFRS",
      description: "FRS 102/IFRS disclosure requirements",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    },

    // REPORTING PHASE
    "F1": {
      ref: "F1",
      label: "Management Letter & KAMs",
      phase: "reporting",
      isa: "ISA 701, ISA 260",
      description: "Key audit matters and management letter",
      requiredSignOffs: ["preparedBy", "reviewedBy", "partnerApproval"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "F2": {
      ref: "F2",
      label: "Audit Report",
      phase: "reporting",
      isa: "ISA 700",
      description: "Final audit opinion and report",
      requiredSignOffs: ["preparedBy", "reviewedBy", "partnerApproval"],
      cellData: {},
      notes: "",
      status: "open"
    },
    "F3": {
      ref: "F3",
      label: "Governance Communications",
      phase: "reporting",
      isa: "ISA 260",
      description: "Communication with audit committee",
      requiredSignOffs: ["preparedBy", "reviewedBy"],
      cellData: {},
      notes: "",
      status: "open"
    }
  },

  // ═════════════════════════════════════════════════════════════════
  // PHASE GATING CONFIGURATION
  // ═════════════════════════════════════════════════════════════════
  phaseGating: {
    planning: {
      order: 1,
      requiredWPs: ["A1", "A2", "A3", "A4", "A5"],
      requiredSignOffs: 2, // Prepared + Reviewed
      gatingRule: "All planning WPs must be prepared and reviewed before advancing",
      canAdvanceTo: "riskAssessment",
      isLocked: false
    },
    riskAssessment: {
      order: 2,
      requiredWPs: ["B1", "B2", "B3", "B4", "B5"],
      requiredSignOffs: 2,
      gatingRule: "All risk WPs must be completed before advancing",
      canAdvanceTo: "interim",
      isLocked: true
    },
    interim: {
      order: 3,
      requiredWPs: ["D1", "D2"],
      requiredSignOffs: 2,
      gatingRule: "Control assessment must be finalized",
      canAdvanceTo: "finalAudit",
      isLocked: true
    },
    finalAudit: {
      order: 4,
      requiredWPs: ["C1", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13", "D14"],
      requiredSignOffs: 2,
      gatingRule: "All substantive testing must be complete",
      canAdvanceTo: "completion",
      isLocked: true
    },
    completion: {
      order: 5,
      requiredWPs: ["E1", "E2", "E3", "E4", "E5"],
      requiredSignOffs: 2,
      gatingRule: "All completion procedures must be signed off",
      canAdvanceTo: "reporting",
      isLocked: true
    },
    reporting: {
      order: 6,
      requiredWPs: ["F1", "F2", "F3"],
      requiredSignOffs: 3, // Partner approval required
      gatingRule: "Audit report must be partner-approved",
      canAdvanceTo: null,
      isLocked: true
    }
  },

  // ═════════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ═════════════════════════════════════════════════════════════════
  functions: {
    // Calculate phase completion percentage
    getPhaseCompletion: (phase, workingPapers) => {
      const phaseGate = engagementStore.phaseGating[phase];
      if (!phaseGate) return 0;

      const requiredWPs = phaseGate.requiredWPs;
      const completeCount = requiredWPs.filter(wpId => {
        const wp = workingPapers[wpId];
        return wp && wp.preparedBy && wp.reviewedBy;
      }).length;

      return Math.round((completeCount / requiredWPs.length) * 100);
    },

    // Check if phase can advance to next
    canAdvancePhase: (phase, workingPapers) => {
      const phaseGate = engagementStore.phaseGating[phase];
      if (!phaseGate) return false;

      return phaseGate.requiredWPs.every(wpId => {
        const wp = workingPapers[wpId];
        return wp && wp.preparedBy && wp.reviewedBy;
      });
    },

    // Record audit trail entry
    recordAuditTrail: (action, phase, wpId, userId, change) => {
      return {
        timestamp: new Date().toISOString(),
        userId: userId,
        action: action, // SIGNOFF, CREATE, UPDATE, DELETE, ADVANCE_PHASE
        phase: phase,
        wpId: wpId,
        change: change
      };
    }
  }
};

export default engagementStore;
