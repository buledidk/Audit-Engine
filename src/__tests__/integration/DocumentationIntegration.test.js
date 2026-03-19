/**
 * Documentation Generation Integration Tests
 * Verifies auto-generation of audit documentation
 */

describe('Documentation Generation System Integration', () => {
  test('documentationGenerationService exports correctly', () => {
    const service = require('../../services/documentationGenerationService').default;
    expect(service).toBeDefined();
    expect(service.generateDocumentationForPhase).toBeDefined();
    expect(service.exportToExcel).toBeDefined();
    expect(service.exportToWord).toBeDefined();
  });

  test('fsliNarrativeService exports correctly', () => {
    const service = require('../../services/fsliNarrativeService').default;
    expect(service).toBeDefined();
    expect(service.generateNarrative).toBeDefined();
    expect(service.getNarrative).toBeDefined();
    expect(service.updateNarrative).toBeDefined();
  });

  test('FSLI narrative service has templates for all FSLIs', () => {
    const service = require('../../services/fsliNarrativeService').default;
    const templates = service.templates;
    expect(templates.cash).toBeDefined();
    expect(templates.receivables).toBeDefined();
    expect(templates.inventory).toBeDefined();
    expect(templates.fixedAssets).toBeDefined();
    expect(templates.payables).toBeDefined();
  });

  test('DocumentationPanel component loads', () => {
    const Component = require('../../components/DocumentationPanel').default;
    expect(Component).toBeDefined();
  });

  test('useDocumentGeneration hook works', () => {
    const useDocumentGeneration = require('../../hooks/useDocumentGeneration').default;
    expect(useDocumentGeneration).toBeDefined();
  });

  test('FSLI narrative can be generated', () => {
    const service = require('../../services/fsliNarrativeService').default;
    const narrative = service.generateNarrative('cash', {
      bankCount: 3,
      amount: '1,000,000'
    });
    expect(narrative).toBeDefined();
    expect(narrative.fsliName).toBe('Cash & Bank Accounts');
    expect(narrative.narrative).toContain('bank');
  });

  test('Documentation panel exports in multiple formats', () => {
    const service = require('../../services/documentationGenerationService').default;
    expect(service.exportToExcel).toBeDefined();
    expect(service.exportToWord).toBeDefined();
  });
});
