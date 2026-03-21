/**
 * Audit Procedures Service
 * Manages audit procedure execution, testing, professional judgment, and evidence attachment
 * Compliant with ISA 500 (Audit Evidence) and ISA 220 (Quality Control)
 */

class AuditProceduresService {
  constructor() {
    this.procedures = new Map();
    this.testingResults = new Map();
    this.evidenceAttachments = new Map();
    this.professionalJudgments = new Map();
    this.listeners = new Map();
  }

  /**
   * Register procedure for FSLI
   */
  registerProcedure(procedureId, procedure) {
    this.procedures.set(procedureId, {
      id: procedureId,
      fsli: procedure.fsli,
      description: procedure.description,
      complexity: procedure.complexity || 'medium',
      estimatedHours: procedure.estimatedHours || 2,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    this.emit('procedure:registered', { procedureId });
  }

  /**
   * Record testing results with professional judgment
   */
  recordTestingResults(procedureId, results, auditorJudgment) {
    const testingData = {
      procedureId,
      itemsTested: results.itemsTested || 0,
      itemsPassed: results.itemsPassed || 0,
      itemsFailed: results.itemsFailed || 0,
      exceptionDetails: results.exceptions || [],
      testingApproach: results.approach || 'substantive',
      samplingMethod: results.samplingMethod || 'statistical',
      timestamp: new Date().toISOString(),
      auditor: auditorJudgment.auditorName || 'Unspecified',
      decision: auditorJudgment.decision || 'pending',
      reasoning: auditorJudgment.reasoning || '',
      riskAssessment: auditorJudgment.riskLevel || 'medium',
      conclusion: auditorJudgment.conclusion || 'pending'
    };

    this.testingResults.set(procedureId, testingData);
    this.professionalJudgments.set(procedureId, auditorJudgment);
    this.emit('procedure:tested', { procedureId, results: testingData });
    return testingData;
  }

  /**
   * Attach evidence to procedure
   */
  attachEvidence(procedureId, evidence) {
    if (!this.evidenceAttachments.has(procedureId)) {
      this.evidenceAttachments.set(procedureId, []);
    }
    const evidenceRecord = {
      id: `EVD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      filename: evidence.filename,
      fileType: evidence.fileType,
      size: evidence.size,
      description: evidence.description || '',
      uploadedAt: new Date().toISOString(),
      attachedBy: evidence.attachedBy || 'System',
      relationshipToFinding: evidence.relationshipToFinding || 'supporting'
    };

    this.evidenceAttachments.get(procedureId).push(evidenceRecord);
    this.emit('evidence:attached', { procedureId, evidence: evidenceRecord });
    return evidenceRecord;
  }

  /**
   * Get complete procedure with all details
   */
  getProcedureComplete(procedureId) {
    return {
      procedure: this.procedures.get(procedureId),
      testingResults: this.testingResults.get(procedureId),
      evidence: this.evidenceAttachments.get(procedureId) || [],
      professionalJudgment: this.professionalJudgments.get(procedureId),
      status: this.getProcedureStatus(procedureId)
    };
  }

  /**
   * Get procedure status
   */
  getProcedureStatus(procedureId) {
    if (!this.testingResults.has(procedureId)) return 'pending';
    const results = this.testingResults.get(procedureId);
    if (results.itemsFailed > 0) return 'exceptions-identified';
    return results.decision === 'approved' ? 'approved' : 'under-review';
  }

  /**
   * Export procedures to Excel/Word format
   */
  exportProcedures(format = 'excel') {
    const exportData = {
      format,
      generatedAt: new Date().toISOString(),
      procedures: Array.from(this.procedures.values()).map(proc => {
        const complete = this.getProcedureComplete(proc.id);
        return {
          ...proc,
          testing: complete.testingResults,
          evidence: complete.evidence,
          judgment: complete.professionalJudgment,
          status: complete.status
        };
      })
    };
    return exportData;
  }

  /**
   * Event emitter methods
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  /**
   * Get all procedures by FSLI
   */
  getProceduresByFSLI(fsli) {
    return Array.from(this.procedures.values()).filter(p => p.fsli === fsli);
  }

  /**
   * Get completion statistics
   */
  getCompletionStats() {
    const total = this.procedures.size;
    const completed = Array.from(this.testingResults.keys()).length;
    const withExceptions = Array.from(this.testingResults.values()).filter(r => r.itemsFailed > 0).length;

    return {
      totalProcedures: total,
      completedProcedures: completed,
      completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      proceduresWithExceptions: withExceptions,
      pendingProcedures: total - completed
    };
  }
}

export default new AuditProceduresService();
