/**
 * Branding Configuration
 * Industry-aligned colors, animations, and visual guidelines
 */

export const AUDIT_INDUSTRY_COLORS = {
  primary: {
    auditBlue: "#0052CC",
    complianceGreen: "#28A745",
    riskRed: "#DC3545",
    warningOrange: "#FFC107"
  },
  regulatory: {
    FCA: "#1E40AF",
    PRA: "#7C3AED",
    SEC: "#DC2626",
    ACCA: "#1F2937",
    ICAEW: "#0369A1"
  }
};

export const AUDIT_ANIMATIONS = {
  progress: {
    duration: "0.6s",
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)"
  },
  procedureExecution: {
    duration: "0.8s",
    easing: "ease-in-out"
  },
  findingAlert: {
    duration: "0.5s",
    easing: "ease-out"
  }
};

export const BUSINESS_CONTEXT_MAPPING = {
  narrowContext: {
    level: "Transaction",
    color: "#60A5FA",
    workflows: ["Transaction Testing", "Journal Review", "Exception ID"]
  },
  midContext: {
    level: "Account/FSLI",
    color: "#3B82F6",
    workflows: ["Balance Testing", "Account Reconciliation", "Procedures"]
  },
  broadContext: {
    level: "Statement",
    color: "#1D4ED8",
    workflows: ["Statement Review", "Analytical Procedures", "Opinion"]
  }
};

export default {
  AUDIT_INDUSTRY_COLORS,
  AUDIT_ANIMATIONS,
  BUSINESS_CONTEXT_MAPPING
};
