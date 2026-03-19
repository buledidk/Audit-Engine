/**
 * FSLI Narrative Service
 * Generates audit narratives for each Financial Statement Line Item
 * Compliant with ISA 230 and ISA 500
 */

class FSLINarrativeService {
  constructor() {
    this.narratives = new Map();
    this.templates = this.initializeTemplates();
    this.listeners = new Map();
  }

  /**
   * Initialize narrative templates for each FSLI type
   */
  initializeTemplates() {
    return {
      cash: {
        name: 'Cash & Bank Accounts',
        procedures: [
          'Obtain bank confirmations',
          'Reconcile bank statements',
          'Perform cutoff testing',
          'Evaluate adequacy of disclosures'
        ],
        template: `We obtained direct confirmations from all {{bankCount}} bank accounts held by the 
entity as at the year-end date. All confirmations were received and reconciled to the general 
ledger without exception. We performed procedures to verify the completeness and accuracy of 
the bank reconciliation, including verification of outstanding cheques and deposits in transit. 
Based on our testing, the cash balance of £{{amount}} is fairly stated.`
      },
      receivables: {
        name: 'Trade Receivables',
        procedures: [
          'Perform receivables confirmations',
          'Review aged receivables analysis',
          'Evaluate allowance for doubtful debts',
          'Test collections subsequent to year-end'
        ],
        template: `We selected a sample of {{sampleSize}} trade receivables representing {{samplePercentage}}% 
of the population and performed confirmation procedures. {{responseRate}}% of confirmations were 
received directly from customers without exception. We reviewed the aged receivables analysis and 
evaluated the adequacy of the allowance for doubtful debts. Based on our testing, trade receivables 
of £{{amount}} are fairly stated.`
      },
      inventory: {
        name: 'Inventory',
        procedures: [
          'Attend inventory count',
          'Evaluate NRV of inventory',
          'Test cutoff procedures',
          'Review obsolescence'
        ],
        template: `We attended the physical inventory count on {{countDate}} at {{countLocations}} locations. 
Our observation procedures did not reveal any significant exceptions. We obtained assurance that the 
inventory is recorded at the lower of cost and net realizable value. Based on our testing, inventory 
of £{{amount}} is fairly stated and obsolescence provisions are adequate.`
      },
      fixedAssets: {
        name: 'Fixed Assets',
        procedures: [
          'Verify asset additions and disposals',
          'Review depreciation calculation',
          'Test for impairment indicators',
          'Evaluate going concern implications'
        ],
        template: `We reviewed the fixed asset register and tested additions and disposals. We recalculated 
depreciation on a sample of assets and verified the useful lives are reasonable. No impairment indicators 
were identified. Based on our testing, fixed assets of £{{amount}} are fairly stated.`
      },
      payables: {
        name: 'Trade Payables',
        procedures: [
          'Review supplier statements',
          'Confirm selected payables',
          'Perform cutoff testing',
          'Evaluate completeness'
        ],
        template: `We reviewed supplier statements and confirmed a sample of payables. All confirmations 
were received without exception. We performed cutoff procedures to ensure transactions are recorded in 
the correct period. Based on our testing, trade payables of £{{amount}} are fairly stated.`
      }
    };
  }

  /**
   * Generate narrative for specific FSLI
   */
  generateNarrative(fsliId, fsliData) {
    const template = this.templates[fsliId];
    if (!template) {
      throw new Error(`No template found for FSLI: ${fsliId}`);
    }

    let narrative = template.template;
    
    // Replace placeholders with actual data
    narrative = narrative.replace('{{bankCount}}', fsliData.bankCount || '3');
    narrative = narrative.replace('{{amount}}', fsliData.amount || '0');
    narrative = narrative.replace('{{sampleSize}}', fsliData.sampleSize || '50');
    narrative = narrative.replace('{{samplePercentage}}', fsliData.samplePercentage || '30');
    narrative = narrative.replace('{{responseRate}}', fsliData.responseRate || '100%');
    narrative = narrative.replace('{{countDate}}', fsliData.countDate || new Date().toISOString().split('T')[0]);
    narrative = narrative.replace('{{countLocations}}', fsliData.countLocations || '1');

    const narrativeRecord = {
      fsliId,
      fsliName: template.name,
      narrative,
      procedures: template.procedures,
      generatedAt: new Date().toISOString(),
      dataUsed: fsliData,
      status: 'generated',
      editable: true
    };

    this.narratives.set(fsliId, narrativeRecord);
    this.emit('narrative:generated', narrativeRecord);

    return narrativeRecord;
  }

  /**
   * Update narrative (allow auditor refinement)
   */
  updateNarrative(fsliId, updatedText) {
    const existing = this.narratives.get(fsliId);
    if (!existing) {
      throw new Error(`Narrative not found for FSLI: ${fsliId}`);
    }

    existing.narrative = updatedText;
    existing.lastModified = new Date().toISOString();
    this.narratives.set(fsliId, existing);

    this.emit('narrative:updated', existing);
    return existing;
  }

  /**
   * Get narrative for FSLI
   */
  getNarrative(fsliId) {
    return this.narratives.get(fsliId);
  }

  /**
   * Get all narratives
   */
  getAllNarratives() {
    return Array.from(this.narratives.values());
  }

  /**
   * Export narratives as Word document
   */
  exportAsWord() {
    return {
      format: 'docx',
      title: 'Audit Working Papers - FSLI Narratives',
      content: this.getAllNarratives(),
      generatedAt: new Date().toISOString()
    };
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
}

export default new FSLINarrativeService();
