/**
 * Audit Procedures Integration Tests
 * Verifies integration between auditProceduresService and AuditProceduresPanel
 */

describe('Audit Procedures System Integration', () => {
  test('auditProceduresService exports correctly', () => {
    const service = require('../../services/auditProceduresService').default;
    expect(service).toBeDefined();
    expect(service.registerProcedure).toBeDefined();
    expect(service.recordTestingResults).toBeDefined();
    expect(service.attachEvidence).toBeDefined();
  });

  test('service registers procedures correctly', () => {
    const service = require('../../services/auditProceduresService').default;
    service.registerProcedure('proc-001', {
      fsli: 'cash',
      description: 'Bank confirmations',
      complexity: 'medium'
    });
    expect(service.procedures.has('proc-001')).toBe(true);
  });

  test('service records testing results with professional judgment', () => {
    const service = require('../../services/auditProceduresService').default;
    const results = service.recordTestingResults('proc-001', {
      itemsTested: 50,
      itemsPassed: 50,
      itemsFailed: 0
    }, {
      auditorName: 'John Auditor',
      decision: 'Approved',
      reasoning: 'Testing adequate',
      riskLevel: 'Low'
    });

    expect(results.itemsTested).toBe(50);
    expect(results.auditorName).toBe('John Auditor');
    expect(results.decision).toBe('Approved');
  });

  test('service tracks evidence attachments', () => {
    const service = require('../../services/auditProceduresService').default;
    const evidence = service.attachEvidence('proc-001', {
      filename: 'bank-statement.pdf',
      fileType: 'pdf',
      size: 2048,
      description: 'Bank confirmation'
    });

    expect(evidence.filename).toBe('bank-statement.pdf');
    expect(evidence.id).toBeDefined();
  });

  test('AuditProceduresPanel component loads', () => {
    const Component = require('../../components/AuditProceduresPanel').default;
    expect(Component).toBeDefined();
  });
});
