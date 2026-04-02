/**
 * IndustryWorkingPapers — adapter layer exposing industry data
 * from the master industries.js in the shape expected by tests and WP generator.
 */
import { I } from './index.js';

export const INDUSTRY_KEYS = Object.keys(I);
export const INDUSTRY_COUNT = INDUSTRY_KEYS.length;

/** Get full industry object by key, normalised for WP consumption */
export function getIndustry(key) {
  if (!key || !I[key]) return null;
  const ind = I[key];
  return {
    key,
    label: ind.l,
    icon: ind.ic,
    color: ind.ac,
    sectors: ind.s || [],
    risks: ind.r || [],
    procs: ind.p || [],
    kpis: ind.k || [],
    disc: ind.d || [],
    controls: ind.ct || [],
    gc: ind.gc || [],
    legislation: ind.lw || [],
    fsliMap: ind.f || {},
    // WP-specific fields expected by tests
    acceptance: (ind.r || []).filter(r => r.lv === 'SIGNIFICANT' || r.lv === 'ELEVATED').map(r => r.t),
    understanding: ind.s ? ind.s.slice(0, 5).map(s => `Understanding ${s} sector`) : [],
    fraud: (ind.r || []).filter(r => r.isa && r.isa.includes('240')).map(r => r.t).concat([
      'Management override of controls',
      'Revenue manipulation risk',
      'Fraudulent financial reporting',
    ]),
    sigRisks: [
      // ISA 240.31-33 irrebuttable significant risk (required for ALL industries)
      { id: 'ISA240', risk: 'Management override of controls', resp: 'Test journal entries, review estimates, evaluate business rationale of unusual transactions', isa: 'ISA 240.31-33' },
      // ISA 240.26 presumed revenue recognition risk (all except rebutted industries)
      ...(!['financial_services', 'professional_services', 'charities'].includes(key)
        ? [{ id: 'ISA240R', risk: 'Revenue recognition — presumed significant risk', resp: 'Extended substantive testing of revenue transactions and cut-off', isa: 'ISA 240.26' }]
        : []),
      // Industry-specific significant risks
      ...(ind.r || []).filter(r => r.lv === 'SIGNIFICANT').map(r => ({ id: r.id, risk: r.t, resp: r.rs, isa: r.isa })),
    ],
    leads: ind.f || {},
    ml: [
      { label: 'Materiality benchmark', value: key === 'financial_services' ? 'Total Assets' : key === 'charities' ? 'Total Income' : 'Revenue', isa: 'ISA 320' },
      { label: 'Risk multiplier', value: 'medium', isa: 'ISA 320.A13' },
      { label: 'PM factor', value: '0.75', isa: 'ISA 320.A14' },
    ],
  };
}

/** Get industry risks structured for risk assessment */
export function getIndustryRisks(key) {
  const ind = getIndustry(key);
  if (!ind) return null;
  return {
    significantRisks: ind.sigRisks,
    risks: ind.risks,
    fraudRisks: ind.fraud,
  };
}

/** Get industry procedures */
export function getIndustryProcedures(key) {
  const ind = getIndustry(key);
  if (!ind) return null;
  return ind.procs;
}

/** Get industry materiality benchmarks for WP generator (returns {b, p, r, alts}) */
export function getIndustryMateriality(key) {
  if (!key || !I[key]) return null;
  const benchmark = key === 'financial_services' ? 'Total Assets' : key === 'charities' ? 'Total Income' : 'Revenue';
  return {
    b: benchmark,
    p: '1-2%',
    r: `${benchmark} selected as primary benchmark per ISA 320.A3-A7.`,
    alts: [
      { benchmark: 'Profit Before Tax', percentage: '5-10%', isa: 'ISA 320.A4' },
      { benchmark: 'Total Assets', percentage: '1-2%', isa: 'ISA 320.A5' },
      { benchmark: 'Equity', percentage: '2-5%', isa: 'ISA 320.A6' },
    ],
  };
}

/** Get industry labels for dropdown display */
export function getIndustryLabels() {
  return INDUSTRY_KEYS.map(k => ({
    key: k,
    label: I[k].l,
    icon: I[k].ic,
    color: I[k].ac,
  }));
}

export default I;
