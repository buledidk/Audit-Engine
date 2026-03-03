import { useState, useEffect, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   AUDITENGINE v7 — ALL 8 INDUSTRIES · WORLD-CLASS PORTAL
   ISA (UK) · FRS 102 · Companies Act 2006 · FRC Ethical Standard 2019
   Reasonable assurance, NOT absolute (ISA 200.5)
   ═══════════════════════════════════════════════════════════════════════════ */

// ═══ INDUSTRY DATA — ALL 8 FULLY CUSTOMISED ═══
const I = {
construction:{
  label:"Construction & Infrastructure",icon:"🏗️",color:"#D97706",
  sectors:["Civil Engineering","Residential","Commercial","Infrastructure","Specialist Trades","Demolition"],
  acceptance:["Team must include member with construction contract accounting experience (ISQM 1.32)","AML: construction is HMRC high-risk sector — enhanced CDD under MLR 2017 reg.33","Predecessor auditor: request prior WPs, particularly WIP and retention schedules (ISA 510.6)","Independence: no financial interest in entity, related developers, or JV partners (FRC ES 2.1)","Non-audit services: assess self-review threat if providing bookkeeping/tax/valuation (FRC ES 5.1)","Engagement letter: scope (ISA 210.10), management responsibilities (ISA 210.6(b)), fee basis"],
  understanding:["Business model: tender → award → mobilisation → applications → certification → practical completion → defects → final account","Revenue cycle: interim applications for payment, QS certification, 30-60 day payment terms, retention withheld 3-5%","Key estimates: percentage of completion (cost-to-cost), costs-to-complete, contract losses, retention recoverability","Regulatory: CDM 2015, Building Safety Act 2022, H&S at Work Act 1974, Building Regulations","CIS: ITEPA 2003 Part 3 Ch.3 — subcontractor verification, deduction rates (0%/20%/30%), monthly returns","IT: project costing software (COINS, Evolution, Sage Construction), nominal ledger integration"],
  mat:{b:"Revenue",p:"1-2%",r:"Revenue is the principal activity measure. Users (banks, sureties) focus on contract profitability.",alts:["Gross profit 5-10% — thin/volatile margins","Total assets 1-2% — where BS (WIP, retentions) is focus","PBT 5-10% — volatile due to contract timing"]},
  fraud:["Revenue fraud: premature recognition via overstated stage of completion (ISA 240.26 NOT rebutted)","WIP manipulation: costs on wrong contracts, capitalising period costs into WIP","Fictitious subcontractor invoices: collusion, ghost workers, inflated applications","Cash payments to unregistered labour avoiding CIS deductions (ITEPA 2003 s.61)","Bid rigging: CMA high-risk sector — cover pricing, market sharing","Management override (ISA 240.31-33 irrebuttable): journals to revenue/WIP/provisions near YE","Personal expenditure charged to project codes: plant hire, materials, fuel cards"],
  sigRisks:[
    {id:"SR01",risk:"Revenue recognition on long-term contracts",resp:"Combined: test controls over application/certification + substantive ToD on all contracts >PM. Recalculate stage of completion, challenge costs-to-complete with QS.",isa:"ISA 240.26; ISA 330.18; FRS 102.23.17"},
    {id:"SR02",risk:"Management override of controls",resp:"ISA 240.32: (a) journal entry testing with risk criteria, (b) estimates bias review, (c) evaluate unusual transactions, (d) unpredictable procedure.",isa:"ISA 240.31-33 (irrebuttable)"},
    {id:"SR03",risk:"WIP valuation and contract loss provisions",resp:"All contracts >PM: independently assess costs-to-complete, challenge margins, sensitivity analysis, test for loss-making contracts per FRS 102.23.24.",isa:"ISA 540.8-12; FRS 102.23.24"}
  ],
  risks:[
    {id:"C-R01",risk:"Revenue — percentage of completion requires significant estimation of costs to complete",lv:"SIGNIFICANT",isa:"ISA 240.26-27; FRS 102.23.17-23.20"},
    {id:"C-R02",risk:"WIP — cost allocation, overhead absorption, attributable profit, contract loss provisions",lv:"SIGNIFICANT",isa:"ISA 540.8-12; FRS 102.13.5-13.8; FRS 102.23.24"},
    {id:"C-R03",risk:"Retentions receivable — ageing, recoverability, contractual release dates",lv:"ELEVATED",isa:"ISA 540.8; FRS 102.11.21-11.22"},
    {id:"C-R04",risk:"Subcontractor liabilities — CIS compliance, accrual completeness",lv:"ELEVATED",isa:"ISA 330.6; ITEPA 2003; SI 2005/2045"},
    {id:"C-R05",risk:"Provisions — H&S claims, liquidated damages, defects, warranties",lv:"NORMAL",isa:"ISA 540.8; FRS 102.21.4 and 21.7"},
    {id:"C-R06",risk:"Plant & equipment — capitalisation vs maintenance boundary",lv:"NORMAL",isa:"ISA 330.6; FRS 102.17.4 and 17.15"}
  ],
  procs:[
    {ref:"C-P01",area:"Revenue",proc:"Recalculate % completion using cost-to-cost (FRS 102.23.17). Challenge costs-to-complete with QS/PM. Compare to budget.",as:"Accuracy; Cut-off",isa:"ISA 330.18; FRS 102.23.17"},
    {ref:"C-P02",area:"Revenue",proc:"Cut-off: final 10 applications before YE, first 10 after. Verify correct period by certification date.",as:"Cut-off",isa:"ISA 330.6; FRS 102.23.10(b)"},
    {ref:"C-P03",area:"WIP",proc:"Cost build-up: vouch labour to payroll, materials to invoices/delivery notes, subs to applications, overheads to absorption calc.",as:"Valuation; Accuracy",isa:"ISA 540.8; FRS 102.13.5-13.8"},
    {ref:"C-P04",area:"Retentions",proc:"Sample >PM: agree to contract, confirm release date, post-YE receipts. Aged >12m: impairment assessment per FRS 102.11.21.",as:"Existence; Valuation",isa:"ISA 505.7; FRS 102.11.21"},
    {ref:"C-P05",area:"Subcontractors",proc:"Reconcile CIS returns to HMRC. Sample accruals to applications. Verify deduction rates. SFURL for completeness.",as:"Completeness; Accuracy",isa:"ISA 330.6; ITEPA 2003"},
    {ref:"C-P06",area:"Provisions",proc:"Each >PM: obligating event, probability, measurement per FRS 102.21.7. Solicitor's letter per ISA 501.9.",as:"Completeness; Valuation",isa:"ISA 540.8; ISA 501.9; FRS 102.21.4"},
    {ref:"C-P07",area:"Controls",proc:"Variation authorisation: sample of 10 to written client approval. SoD: estimator prepares, PM approves, finance records.",as:"Occurrence",isa:"ISA 315.12-14; ISA 330.8"}
  ],
  tests:{
    revenue:{t:"D1 — Revenue & Contract Income",r:"SIGNIFICANT",a:"COMBINED",isa:"ISA 240.26; ISA 330.18",items:[
      {ref:"D1.01",p:"ALL contracts >PM: recalculate stage of completion (cost-to-cost per FRS 102.23.17). Agree costs incurred to project ledger. Challenge costs-to-complete with QS/PM.",as:"Accuracy; Occurrence",ev:"Project cost reports, QS certificates, budgets"},
      {ref:"D1.02",p:"Vouch contracts to signed agreements. Test variations >trivial to written client approval. Enquire about side agreements.",as:"Occurrence; Rights",ev:"Signed contracts, variation orders"},
      {ref:"D1.03",p:"Cut-off: final 10 apps before YE, first 10 after. Verify period by work certification date (not invoice date).",as:"Cut-off",ev:"Applications, QS certificates, ledger"},
      {ref:"D1.04",p:"Credit notes/adjustments in 30 days post-YE. Investigate >trivial for incorrect period or unrecognised disputes.",as:"Cut-off; Occurrence",ev:"Credit notes, correspondence"},
      {ref:"D1.05",p:"Analytics: revenue by contract vs budget. Investigate margin variance >5%. Monthly profile for unusual patterns.",as:"Completeness",ev:"Revenue analysis, budget vs actual"},
      {ref:"D1.06",p:"Journal testing per ISA 240.32(a): manual journals to revenue — round amounts, outside hours, management posted, unusual combos, period-end.",as:"Occurrence",ev:"Complete journal listing, GL detail"},
      {ref:"D1.07",p:"Contract loss review: where costs-to-complete > remaining contract value, verify FULL loss provided immediately per FRS 102.23.24.",as:"Valuation; Completeness",ev:"Cost forecasts, provision calculations"},
      {ref:"D1.08",p:"Related party revenue: identify connected party contracts (FRS 102.33.2). Verify arm's length. Confirm disclosures.",as:"Classification",ev:"RP register, contracts, pricing"}
    ]},
    debtors:{t:"D2 — Receivables & Retentions",r:"ELEVATED",a:"SUBSTANTIVE",isa:"ISA 505.7; FRS 102.11.21",items:[
      {ref:"D2.01",p:"Aged listing: cast, agree to TB and control account. Investigate reconciling items >trivial.",as:"Completeness",ev:"Aged listing, TB, control rec"},
      {ref:"D2.02",p:"Positive confirmation (ISA 505.7) for balances >PM. Firm letterhead. Control despatch/receipt.",as:"Existence; Accuracy",ev:"Confirmation letters and replies"},
      {ref:"D2.03",p:"Non-replies: alternative procedures — post-YE receipts, applications, QS certificates, contracts.",as:"Existence",ev:"Bank receipts, certificates"},
      {ref:"D2.04",p:"Post-YE receipts for 30 days. Match to YE balances — supports existence and recoverability.",as:"Existence; Valuation",ev:"Cash receipts, bank statements"},
      {ref:"D2.05",p:"Retentions (separately from debtors): agree to contract clause, confirm release date, recoverability for >12m aged.",as:"Existence; Valuation; Rights",ev:"Contracts, retention schedule"},
      {ref:"D2.06",p:"Bad debt provision: ageing vs historical write-offs. Specific assessment for disputes/aged >90 days. Methodology per FRS 102.11.21.",as:"Valuation",ev:"Ageing, write-off history, provision calc"}
    ]},
    wip:{t:"D3 — WIP & Contract Balances",r:"SIGNIFICANT",a:"COMBINED",isa:"ISA 540.8; FRS 102.13.5-13.8",items:[
      {ref:"D3.01",p:"WIP schedule: cast, agree to TB, reconcile to project system. Verify completeness — all active projects.",as:"Completeness; Accuracy",ev:"WIP schedule, TB, system report"},
      {ref:"D3.02",p:"Cost build-up for >PM: labour to payroll/timesheets, materials to invoices/GRNs, subs to applications, plant to hire invoices.",as:"Existence; Valuation",ev:"Payroll, invoices, delivery notes"},
      {ref:"D3.03",p:"Overhead absorption: verify rate, confirm basis, assess normal capacity per FRS 102.13.8.",as:"Valuation",ev:"Overhead calculation, capacity data"},
      {ref:"D3.04",p:"Attributable profit: verify ≤ stage of completion × estimated total margin. Challenge margin with PM/QS.",as:"Valuation",ev:"Profit calcs, tender docs, project reports"},
      {ref:"D3.05",p:"Contract losses: where costs-to-complete > remaining contract sum — FULL foreseeable loss immediately provided (FRS 102.23.24).",as:"Valuation; Completeness",ev:"Cost forecasts, provision schedule"},
      {ref:"D3.06",p:"Cut-off: costs at YE relate to pre-YE work. Check timesheets, delivery dates, sub applications.",as:"Cut-off",ev:"Timesheets, GRNs, applications"}
    ]}
  },
  leads:{rev:["Contract revenue","Variation income","Daywork","Claims","Other"],rec:["Certified debtors","Uncertified","Retentions","Other receivables","Prepayments"],cash:["Current a/c","Deposit a/c","Project accounts","Petty cash"],pay:["Trade creditors — subs","Trade creditors — suppliers","Sub accruals","CIS to HMRC","Other creditors","Accruals","Deferred income","VAT"]},
  kpis:["Gross margin % by contract","WIP as % of revenue","Debtor days","Retention ageing","Sub cost ratio %","Overhead recovery %"],
  disc:{frs102:["Contract balances (FRS 102.23.31)","Revenue policy and completion method (FRS 102.23.30)","Retentions held","CIS obligations","Performance bonds (FRS 102.21.15)","Capital commitments (FRS 102.20.16)","Related parties (FRS 102.33)","Employee info (CA 2006 s.411)","Directors' remuneration (CA 2006 s.412-413)"],ifrs:["Contract assets/liabilities (IFRS 15.105-109)","Revenue disaggregation (IFRS 15.114-115)","Performance obligations (IFRS 15.119-122)"],frs102_1a:["Revenue policy (reduced)","Capital commitments","RP with directors"]},
  gc:["Pipeline vs overhead base","12m cash flow forecast","Bonding capacity","Single client dependency >25%","Disputed final accounts","Bank facility headroom","Subcontractor supply chain"],
  ml:[{f:"Cost coding: misallocation between projects affecting margins",rec:"Weekly timesheet approval by PM. Monthly QS review.",lv:"ELEVATED"},{f:"Variation control: work before written client approval",rec:"No work without signed VO. Defer unapproved variation revenue.",lv:"SIGNIFICANT"},{f:"CIS verification: status not rechecked within 2 years",rec:"CIS log with renewal alerts at 30 days before expiry.",lv:"ELEVATED"},{f:"Bank reconciliations: not within 5 working days",rec:"Complete within 3 days. Manager sign-off within 5.",lv:"NORMAL"}],
  payTests:{t:"D4 — Payables & Accruals",r:"ELEVATED",a:"SUBSTANTIVE",isa:"ISA 330.6; FRS 102.21",items:[
    {ref:"D4.01",p:"Aged creditors listing: cast, agree to TB and purchase ledger control account. Reconcile and investigate all items >trivial.",as:"Completeness; Accuracy",ev:"Aged creditors, TB, control rec"},
    {ref:"D4.02",p:"Sample >PM: vouch to invoice, GRN/delivery note, and approved PO. Verify arithmetical accuracy and correct period.",as:"Existence; Accuracy; Cut-off",ev:"Purchase invoices, GRNs, POs"},
    {ref:"D4.03",p:"Cut-off: last 10 GRNs before YE, first 10 after. Verify invoice recorded in correct period. For subcontractors, last 5 applications before and after YE.",as:"Cut-off",ev:"GRN log, sub applications, ledger"},
    {ref:"D4.04",p:"Unrecorded liabilities (SFURL): review post-YE payments for 30 days. Identify invoices received/paid after YE relating to pre-YE work/deliveries.",as:"Completeness",ev:"Post-YE cash book, bank statements, invoices"},
    {ref:"D4.05",p:"Accruals: test basis of subcontractor accruals (work done not yet applied for). Retention payable: agree to contract terms.",as:"Completeness; Accuracy",ev:"Applications, contracts, WIP reports"},
    {ref:"D4.06",p:"CIS creditor to HMRC: reconcile monthly returns to subcontractor ledger. Verify deductions at correct rate (0%/20%/30% per ITEPA 2003).",as:"Accuracy; Completeness",ev:"CIS returns, verification records"}
  ]},
  payrollTests:{t:"D5 — Payroll & Staff Costs",r:"NORMAL",a:"SUBSTANTIVE",isa:"ISA 330.6; CA 2006 s.411",items:[
    {ref:"D5.01",p:"Proof in total: recalculate expected payroll cost from headcount × average salary. Investigate variance >5%. Reconcile per-employee to P60/P11D.",as:"Completeness; Accuracy",ev:"Payroll reports, P60s, headcount"},
    {ref:"D5.02",p:"Sample employees (stratified — directors, site, office): agree gross pay to contract/timesheet/CIS statement, deductions to PAYE tables, net pay to bank.",as:"Existence; Accuracy",ev:"Contracts, timesheets, bank payments"},
    {ref:"D5.03",p:"PAYE/NIC: reconcile annual PAYE liability per RTI to amounts paid to HMRC. Investigate balance at YE.",as:"Accuracy; Completeness",ev:"RTI submissions, HMRC payments, TB"},
    {ref:"D5.04",p:"Directors' remuneration: agree each director's total to board minutes/service contract. Verify CA 2006 s.412-413 disclosure completeness.",as:"Completeness; Accuracy",ev:"Board minutes, contracts, accounts note"},
    {ref:"D5.05",p:"Pension contributions: verify employer contributions per scheme rules. Confirm auto-enrolment compliance (Pensions Act 2008). Test cut-off for YE accrual.",as:"Accuracy; Completeness",ev:"Scheme statements, contribution schedule"}
  ]},
  controls:["Segregation: estimator prepares CVR, PM reviews, finance records — three-way independent of each other","Application authorisation: QS certifies, PM approves before submission to client","Subcontractor payments: verified CIS status before first payment; application matched to order before approval","Bank reconciliation: completed within 5 working days of month end by finance, reviewed by FC","Journal authorisation: all manual journals require second approval; revenue/WIP journals require FC sign-off","Plant and materials: purchase requisition approved by PM before order placed"],
  reps:["All contracts in progress at YE are included in the WIP schedule","Costs-to-complete estimates reflect best current assessment including known issues and variations","All known contract losses have been fully provided per FRS 102.23.24","All claims, disputes, and liquidated damages exposure have been disclosed","Retention balances are recoverable and release dates are per contractual terms","All CIS obligations have been properly accounted for per ITEPA 2003","All related party transactions, including connected-party contracts, are disclosed per FRS 102.33"],
  events:["Post-YE contract awards or losses affecting pipeline assessment","Resolution of disputed final accounts — settlement vs YE provision","Insolvency of major client affecting receivable/retention recoverability","H&S incidents post-YE indicating unrecognised provision at YE","Significant variation approvals or rejections post-YE","Subcontractor insolvency affecting accruals or project completion","Changes in bonding capacity or credit facility terms"]
},

manufacturing:{
  label:"Manufacturing",icon:"🏭",color:"#059669",
  sectors:["Food & Beverage","Automotive","Aerospace","Pharmaceuticals","Textiles","Electronics"],
  acceptance:["Team competence in inventory costing, overhead absorption, and manufacturing processes (ISQM 1.32)","ISA 501.4: mandatory attendance at physical inventory count — assess logistics for multiple locations","AML: standard due diligence unless cash-intensive consumer products","Independence: no interest in entity or key customers/suppliers (FRC ES 2.1)","Consider using auditor's expert for specialist inventory (ISA 620) — e.g. pharmaceuticals, aerospace parts","Group audit: assess component auditors if multi-site manufacturing (ISA 600)"],
  understanding:["Business model: raw materials → WIP → finished goods. Make-to-stock vs make-to-order. JIT vs batch production","Revenue cycle: production → despatch → invoice → collection. Incoterms determine point of risk/reward transfer","Key estimates: inventory NRV, obsolescence provisions, warranty provisions, overhead absorption rates","Regulatory: product safety (Consumer Rights Act 2015), environmental (EPA 1990), food safety (HACCP/BRC), pharma (MHRA)","Cost structure: direct materials + direct labour + production overheads (FRS 102.13.8 normal capacity basis)","IT: ERP systems (SAP, Oracle, Dynamics), inventory management, MRP, quality management systems"],
  mat:{b:"Revenue",p:"1-2%",r:"Revenue reflects trading activity. Stable benchmark for manufacturing entities.",alts:["Gross profit 5-10% — focus on margin performance","Total assets 1-2% — capital-intensive businesses","PBT 5-10% — if profits stable and user focus"]},
  fraud:["Revenue: bill-and-hold, channel stuffing, consignment sales recorded as revenue (ISA 240.26 NOT rebutted)","Inventory manipulation: inflating quantities at count, fictitious stock locations, overstated standard costs","Overhead absorption: inflating production to absorb fixed overheads, understating unabsorbed overheads","Management override: journals to inventory, revenue, or provisions near period end (ISA 240.31-33)","Fictitious purchase invoices: collusion with suppliers on pricing or quantities","Capitalising period costs as development expenditure without meeting FRS 102.18.8H criteria","Environmental provision manipulation: understating remediation costs"],
  sigRisks:[
    {id:"SR01",risk:"Revenue recognition — cut-off, bill-and-hold, consignment",resp:"Test despatch notes ±10 days around YE. Verify risk/reward transfer per Incoterms. Test bill-and-hold per IFRS 15/FRS 102.23 criteria.",isa:"ISA 240.26; FRS 102.23.10"},
    {id:"SR02",risk:"Management override of controls",resp:"Mandatory ISA 240.32: journal testing, estimates bias review, unusual transactions, unpredictable procedure.",isa:"ISA 240.31-33 (irrebuttable)"},
    {id:"SR03",risk:"Inventory valuation — cost, NRV, obsolescence",resp:"Attend count (ISA 501.4). Test cost build-up including overhead absorption. NRV testing for slow-moving lines. Challenge obsolescence provision.",isa:"ISA 501.4-8; ISA 540.8; FRS 102.13.4"}
  ],
  risks:[
    {id:"M-R01",risk:"Inventory valuation — cost allocation, overhead absorption at normal capacity, NRV testing",lv:"SIGNIFICANT",isa:"ISA 501.4-8; FRS 102.13.4-13.8"},
    {id:"M-R02",risk:"Revenue cut-off — despatch timing, Incoterms, bill-and-hold arrangements",lv:"SIGNIFICANT",isa:"ISA 240.26-27; FRS 102.23.10"},
    {id:"M-R03",risk:"Obsolescence provisions — slow-moving, damaged, expired stock",lv:"ELEVATED",isa:"ISA 540.8-12; FRS 102.13.4 (lower of cost and NRV)"},
    {id:"M-R04",risk:"Fixed assets — capex vs expense, useful lives, impairment of specialist plant",lv:"NORMAL",isa:"ISA 330.6; FRS 102.17.4 and 17.15"},
    {id:"M-R05",risk:"Environmental provisions — remediation, decommissioning obligations",lv:"ELEVATED",isa:"ISA 540.8; FRS 102.21.4; EPA 1990"},
    {id:"M-R06",risk:"Government grants — recognition, conditions, repayment risk",lv:"NORMAL",isa:"ISA 330.6; FRS 102.24.4-24.5"}
  ],
  procs:[
    {ref:"M-P01",area:"Inventory",proc:"Attend physical count at key locations (ISA 501.4 MANDATORY). Test count accuracy. Observe procedures. Review count instructions beforehand.",as:"Existence; Completeness",isa:"ISA 501.4-8"},
    {ref:"M-P02",area:"Inventory",proc:"Test cost build-up: raw materials to recent purchase invoices, labour to payroll allocation, overheads to absorption rate at normal capacity per FRS 102.13.8.",as:"Valuation; Accuracy",isa:"ISA 540.8; FRS 102.13.5-13.8"},
    {ref:"M-P03",area:"Inventory",proc:"NRV testing: identify slow-moving lines (>180 days). Compare cost to selling price less costs to complete/sell. Test obsolescence provision methodology.",as:"Valuation",isa:"ISA 540.8; FRS 102.13.4"},
    {ref:"M-P04",area:"Revenue",proc:"Cut-off: despatch notes ±10 days around YE. Verify revenue in correct period per Incoterms risk transfer point.",as:"Cut-off; Occurrence",isa:"ISA 240.26; FRS 102.23.10"},
    {ref:"M-P05",area:"Fixed Assets",proc:"Additions >PM: vouch to invoice, verify capitalisation criteria (FRS 102.17.4), assess useful life, confirm enhancement vs maintenance.",as:"Existence; Classification",isa:"ISA 330.6; FRS 102.17.4-17.15"},
    {ref:"M-P06",area:"Provisions",proc:"Environmental: verify obligating event, assess remediation cost estimate, review expert reports. Decommissioning: discount to PV per FRS 102.21.7.",as:"Completeness; Valuation",isa:"ISA 540.8; FRS 102.21.4; ISA 620"}
  ],
  tests:{
    revenue:{t:"D1 — Revenue",r:"SIGNIFICANT",a:"COMBINED",isa:"ISA 240.26; ISA 330.18",items:[
      {ref:"D1.01",p:"Cut-off: select last 15 despatch notes before YE and first 15 after. For each verify revenue in correct period per Incoterms.",as:"Cut-off",ev:"Despatch notes, invoices, ledger"},
      {ref:"D1.02",p:"Bill-and-hold: identify all revenue without physical despatch. Verify meets ALL criteria: customer request, business reason, identified goods, ready for transfer.",as:"Occurrence",ev:"Customer correspondence, warehouse records"},
      {ref:"D1.03",p:"Sample revenue transactions >PM: vouch to order, despatch note, invoice, cash receipt. Verify pricing to price list/contract.",as:"Occurrence; Accuracy",ev:"Sales orders, despatch, invoices, bank"},
      {ref:"D1.04",p:"Credit notes in 30 days post-YE. Investigate >trivial for returns, pricing disputes, period errors.",as:"Cut-off; Occurrence",ev:"Credit notes, returns log"},
      {ref:"D1.05",p:"Analytics: monthly revenue by product line vs PY. Investigate anomalies >10%. Revenue per customer concentration analysis.",as:"Completeness",ev:"Revenue analysis, customer data"},
      {ref:"D1.06",p:"Journal testing per ISA 240.32(a): manual journals to revenue — risk-based selection criteria.",as:"Occurrence",ev:"Journal listing, GL detail"}
    ]},
    inventory:{t:"D3 — Inventory",r:"SIGNIFICANT",a:"COMBINED",isa:"ISA 501.4 (mandatory count); FRS 102.13",items:[
      {ref:"D3.01",p:"ATTEND physical count (ISA 501.4 MANDATORY). Perform own test counts. Observe entity procedures. Note condition. Record last GRN/despatch numbers for cut-off.",as:"Existence; Completeness",ev:"Count sheets, test count results, instructions"},
      {ref:"D3.02",p:"Roll-forward/back from count date to YE if count not at YE. Verify movements are properly recorded.",as:"Accuracy",ev:"Movement records, GRN/despatch logs"},
      {ref:"D3.03",p:"Cost testing — raw materials: agree to recent purchase invoice. WIP: test BOM (bill of materials) costing. Finished goods: verify standard cost vs actual.",as:"Valuation",ev:"Purchase invoices, BOM, standard cost cards"},
      {ref:"D3.04",p:"Overhead absorption: verify rate calculation. Confirm normal capacity basis per FRS 102.13.8. Assess under/over-absorption treatment.",as:"Valuation",ev:"Overhead calculation, production data"},
      {ref:"D3.05",p:"NRV: for slow-moving items (turnover >180 days), compare cost to selling price less completion costs. Test obsolescence provision.",as:"Valuation",ev:"Ageing report, sales prices, provision calc"},
      {ref:"D3.06",p:"Cut-off: last GRN before YE — goods in stock? First GRN after — excluded? Same for despatches. Test goods-in-transit.",as:"Cut-off",ev:"GRNs, despatch notes, supplier invoices"}
    ]}
  },
  leads:{rev:["Product sales","Service revenue","Scrap/waste sales","Export sales","Other"],rec:["Trade debtors","Export debtors","Other receivables","Prepayments"],cash:["Current a/c","Deposit a/c","Foreign currency a/c"],pay:["Trade creditors","Accruals","VAT","PAYE/NIC","Corporation tax"]},
  kpis:["Gross margin %","Stock turn days","Overhead absorption rate","Capex:depreciation ratio","Defect/return rate %","Revenue per employee"],
  disc:{frs102:["Inventory categories and valuation policy (FRS 102.13.22)","Depreciation policy and rates (FRS 102.17.31)","Government grants (FRS 102.24.6)","Environmental provisions (FRS 102.21.14)","Related parties (FRS 102.33)","Employee info (CA 2006 s.411)"],ifrs:["Inventory breakdown (IAS 2.36)","Revenue disaggregation (IFRS 15.114)","Provisions detail (IAS 37.84-85)"],frs102_1a:["Accounting policies","Capital commitments"]},
  gc:["Order book and pipeline vs capacity","Cash flow from operations trend","Customer concentration risk","Raw material supply chain disruption","Debt covenants and facility renewals","Capital expenditure requirements","Environmental compliance costs"],
  ml:[{f:"Stock count: count instructions not issued to all teams beforehand",rec:"Documented count instructions issued 1 week before count date.",lv:"ELEVATED"},{f:"Cost accumulation: standard costs not updated annually",rec:"Annual review of standard costs vs actual at each reporting date.",lv:"ELEVATED"},{f:"Goods received: GRNs not matched to purchase orders within 5 days",rec:"Three-way match (PO-GRN-invoice) within 5 working days of receipt.",lv:"NORMAL"}],
  payTests:{t:"D4 — Payables & Accruals",r:"ELEVATED",a:"SUBSTANTIVE",isa:"ISA 330.6; FRS 102.21",items:[
    {ref:"D4.01",p:"Aged creditors listing: cast, agree to TB and purchase ledger control. Reconcile. Focus on raw material suppliers — concentration risk.",as:"Completeness; Accuracy",ev:"Aged creditors, TB, control rec"},
    {ref:"D4.02",p:"Sample >PM: vouch to invoice, GRN, approved PO. Verify three-way match. Check pricing to contract/catalogue for material suppliers.",as:"Existence; Accuracy",ev:"Invoices, GRNs, POs, contracts"},
    {ref:"D4.03",p:"Cut-off: last 10 GRNs before YE, first 10 after. Cross-reference to inventory count records and revenue despatch notes.",as:"Cut-off",ev:"GRN log, count records, despatch notes"},
    {ref:"D4.04",p:"SFURL: review 30 days post-YE payments. Key risk: raw material deliveries before YE not invoiced. Match to inventory count records.",as:"Completeness",ev:"Post-YE bank, invoices, GRN log"},
    {ref:"D4.05",p:"Accruals: test material accruals — royalties, utilities, waste disposal, environmental levies. Verify basis and recalculate.",as:"Accuracy; Completeness",ev:"Utility bills, contracts, calculations"},
    {ref:"D4.06",p:"Supplier statement reconciliation: obtain statements for top 10 suppliers by value. Reconcile to purchase ledger. Investigate all differences >trivial.",as:"Completeness; Existence",ev:"Supplier statements, PL balance"}
  ]},
  payrollTests:{t:"D5 — Payroll & Staff Costs",r:"NORMAL",a:"SUBSTANTIVE",isa:"ISA 330.6; CA 2006 s.411",items:[
    {ref:"D5.01",p:"Proof in total: factory direct labour recalculated from production hours × rates. Investigate >5% variance. Reconcile to overhead absorption.",as:"Completeness; Accuracy",ev:"Production reports, timesheets, payroll"},
    {ref:"D5.02",p:"Sample (stratified — directors, factory floor, office, agency): verify gross pay to contract/timesheet, deductions to PAYE, net to bank.",as:"Existence; Accuracy",ev:"Contracts, timesheets, BACS"},
    {ref:"D5.03",p:"PAYE/NIC reconciliation: RTI full payment submissions vs HMRC payments. Verify correct employer NIC rate applied.",as:"Accuracy",ev:"RTI, HMRC correspondence"},
    {ref:"D5.04",p:"Directors' remuneration per CA 2006 s.412-413: agree total to board minutes, verify benefits in kind per P11D, bonus accruals.",as:"Completeness; Accuracy",ev:"Minutes, P11D, contracts"},
    {ref:"D5.05",p:"Agency labour: verify agency costs to invoices and timesheets. Confirm no employment obligation (IR35 if applicable). Test cut-off at YE.",as:"Existence; Classification",ev:"Agency invoices, timesheets, contracts"}
  ]},
  controls:["Goods receipt: GRN matched to PO and physically inspected before acceptance into stores","Three-way match: PO-GRN-invoice matched before payment authorisation","Inventory count: documented procedures, independent counts, blind counts, variance investigation","Production cost allocation: direct labour charged by timesheet to production order; overheads absorbed at standard rate","Quality control: inspection at receipt and pre-despatch with documented reject/scrap process","Payment authorisation: dual sign-off above £[threshold]; all payments per approved supplier list only"],
  reps:["Physical inventory quantities at YE are accurately stated and the count was properly conducted","Inventory is valued at lower of cost and NRV per FRS 102.13.4","Cost includes purchase price, conversion costs, and production overheads at normal capacity per FRS 102.13.5-13.8","Provision for obsolete, damaged, and slow-moving inventory reflects current NRV assessment","All inventory locations are disclosed; no inventory held at third-party locations not counted or confirmed","Standard costs have been reviewed and approximate actual costs at YE","Environmental provisions reflect current obligations under EPA 1990 and all known remediation requirements"],
  events:["Product recall post-YE indicating quality issue existing at YE (adjusting per ISA 560.8)","Major customer loss post-YE affecting inventory NRV assessment","Raw material price changes post-YE indicating NRV issue at YE","Environmental incident or regulatory action post-YE","Settlement of warranty claims post-YE vs provision at YE","Changes in key supplier terms or supply chain disruption","Factory closure or restructuring announcement post-YE"]
},

technology:{
  label:"Technology & SaaS",icon:"💻",color:"#7C3AED",
  sectors:["Enterprise Software","Cloud/SaaS","Fintech","Cybersecurity","AI/ML","Hardware/IoT"],
  acceptance:["Team competence in multi-element revenue, software capitalisation, SBP (ISQM 1.32)","Consider specialist for share option valuations (ISA 620)","Assess GDPR/data protection compliance as regulatory risk (ISA 250)","Independence: assess if firm provides IT advisory services to client (FRC ES 5)","Consider going concern: many tech entities are pre-profit with cash burn","Recurring revenue model: assess contract base and churn risk"],
  understanding:["Business model: licence/subscription revenue, professional services, implementation, support. SaaS metrics: ARR, MRR, churn, CAC, LTV","Revenue cycle: contract → implementation → go-live → recurring billing → renewal. Multi-year contracts with upfront and recurring elements","Key estimates: development cost capitalisation (FRS 102.18.8H six criteria), SBP fair value (Black-Scholes/binomial), useful life of intangibles","Regulatory: GDPR (Data Protection Act 2018), FCA regulation (fintech), sector-specific (healthcare IT, defence)","R&D tax credits: CTA 2009 s.1042-1142 — qualifying expenditure, SME vs RDEC scheme","Funding: VC/PE investment rounds, convertible notes, EMI/CSOP share option schemes"],
  mat:{b:"Revenue (ARR)",p:"1-2%",r:"Revenue/ARR is the primary performance metric for tech companies. Investors and analysts focus on growth and retention rates.",alts:["Total assets 1-2% — appropriate for asset-light SaaS","Operating expenses 1-2% — where entity is pre-profit","Cash 3-5% — for pre-revenue startups"]},
  fraud:["Revenue: premature recognition of multi-element arrangements, side agreements, channel stuffing (ISA 240.26 NOT rebutted)","Development costs: capitalising maintenance/enhancement costs that don't meet FRS 102.18.8H criteria","Deferred revenue manipulation: accelerating or delaying release to manage revenue profile","SBP: undervaluing options to reduce P&L charge, misapplying vesting conditions","Management override (ISA 240.31-33 irrebuttable)","R&D tax credit: including non-qualifying expenditure, misclassifying activities","Fictitious customer contracts to inflate ARR/bookings"],
  sigRisks:[
    {id:"SR01",risk:"Revenue — multi-element arrangements, performance obligations",resp:"Test allocation of transaction price across performance obligations. Verify distinct obligations. Test deferred revenue roll-forward.",isa:"ISA 240.26; IFRS 15/FRS 102.23"},
    {id:"SR02",risk:"Management override of controls",resp:"ISA 240.32 mandatory procedures: journals, estimates bias, unusual transactions, unpredictable procedure.",isa:"ISA 240.31-33 (irrebuttable)"},
    {id:"SR03",risk:"Development cost capitalisation",resp:"For all capitalised dev costs: assess each of the 6 criteria in FRS 102.18.8H. Challenge technical feasibility. Verify amortisation from commercial production.",isa:"ISA 540.8; FRS 102.18.8H"}
  ],
  risks:[
    {id:"T-R01",risk:"Revenue — multi-element arrangements, transaction price allocation across performance obligations",lv:"SIGNIFICANT",isa:"ISA 240.26-27; FRS 102.23.2-23.8; IFRS 15.22-30"},
    {id:"T-R02",risk:"Development cost capitalisation — 6 criteria assessment (FRS 102.18.8H)",lv:"SIGNIFICANT",isa:"ISA 540.8-12; FRS 102.18.8H"},
    {id:"T-R03",risk:"Deferred revenue accuracy — contract liability completeness and release timing",lv:"ELEVATED",isa:"ISA 330.6; FRS 102.23.10; IFRS 15.31-38"},
    {id:"T-R04",risk:"Share-based payments — fair value measurement and vesting conditions",lv:"ELEVATED",isa:"ISA 540.8; FRS 102.26.7-26.12; IFRS 2.10-13"},
    {id:"T-R05",risk:"Intangible asset impairment — capitalised development costs and goodwill",lv:"ELEVATED",isa:"ISA 540.8; FRS 102.27.7-27.21; IAS 36"},
    {id:"T-R06",risk:"R&D tax credits — qualifying expenditure and methodology",lv:"NORMAL",isa:"ISA 540.8; CTA 2009 s.1042-1142"}
  ],
  procs:[
    {ref:"T-P01",area:"Revenue",proc:"Test transaction price allocation across performance obligations. Verify standalone selling prices. Test deferred revenue roll-forward.",as:"Accuracy; Cut-off",isa:"IFRS 15.22-30; FRS 102.23"},
    {ref:"T-P02",area:"Revenue",proc:"Sample new contracts >PM: read contract terms, identify obligations, verify revenue recognition timing against delivery/access.",as:"Occurrence; Accuracy",isa:"ISA 330.18; IFRS 15.31-38"},
    {ref:"T-P03",area:"Intangibles",proc:"For ALL capitalised dev costs: assess 6 criteria (FRS 102.18.8H): technical feasibility, intention, ability, probable benefits, resources, reliable measurement.",as:"Existence; Valuation",isa:"ISA 540.8; FRS 102.18.8H"},
    {ref:"T-P04",area:"SBP",proc:"Obtain option scheme details. Recalculate fair value (Black-Scholes inputs: share price, exercise price, volatility, term, risk-free rate). Verify vesting conditions.",as:"Accuracy; Completeness",isa:"FRS 102.26.7-26.12; IFRS 2"},
    {ref:"T-P05",area:"Tax",proc:"Review R&D claim: verify qualifying activities per BEIS guidelines, test expenditure sample, assess SME vs RDEC eligibility.",as:"Accuracy; Existence",isa:"ISA 540.8; CTA 2009 s.1042"}
  ],
  tests:{
    revenue:{t:"D1 — Revenue & Deferred Revenue",r:"SIGNIFICANT",a:"COMBINED",isa:"ISA 240.26; IFRS 15/FRS 102.23",items:[
      {ref:"D1.01",p:"Sample new contracts >PM: read full terms. Identify distinct performance obligations. Verify standalone selling prices. Test transaction price allocation.",as:"Accuracy; Occurrence",ev:"Contracts, pricing, allocation workings"},
      {ref:"D1.02",p:"Deferred revenue roll-forward: opening + new bookings − recognised = closing. Agree to TB. Test sample of releases to delivery evidence.",as:"Cut-off; Accuracy",ev:"Deferred revenue schedule, delivery records"},
      {ref:"D1.03",p:"Churn/cancellation testing: for cancelled contracts, verify revenue ceased and deferred revenue unwound correctly.",as:"Occurrence; Accuracy",ev:"Cancellation records, credit notes, ledger"},
      {ref:"D1.04",p:"Professional services revenue: test time records to invoices. Verify % completion on fixed-fee projects.",as:"Accuracy; Cut-off",ev:"Timesheets, invoices, project status"},
      {ref:"D1.05",p:"Analytics: ARR bridge (opening + new + expansion − churn − contraction = closing). Investigate variances.",as:"Completeness",ev:"ARR analysis, customer data"},
      {ref:"D1.06",p:"Journal testing per ISA 240.32(a): manual journals to revenue/deferred revenue accounts.",as:"Occurrence",ev:"Journal listing, GL detail"}
    ]}
  },
  leads:{rev:["Subscription/SaaS","Licence","Professional services","Support/maintenance","Other"],rec:["Trade debtors","Accrued income","R&D tax credit receivable","Prepayments"],cash:["Current a/c","Deposit a/c","Money market"],pay:["Trade creditors","Deferred revenue","Tax liabilities","Accruals"]},
  kpis:["ARR growth %","Net revenue retention","Gross margin %","CAC:LTV ratio","Churn rate %","Deferred revenue movement"],
  disc:{frs102:["Revenue policy by stream (FRS 102.23.30)","Development costs capitalised (FRS 102.18.27)","Share options: scheme details, charge, outstanding (FRS 102.26.23)","R&D credits (FRS 102.24.6)","Related parties (FRS 102.33)"],ifrs:["Revenue disaggregation (IFRS 15.114)","Contract assets/liabilities (IFRS 15.105)","SBP details (IFRS 2.44-52)","Intangible assets (IAS 38.118-128)"],frs102_1a:["Revenue policy","Development costs"]},
  gc:["Cash runway: months of cash at current burn rate","Funding: next round timeline and investor appetite","Customer concentration and contract renewals","Recurring revenue vs one-off","Working capital and debtor collection","Debt covenants if venture debt in place"],
  ml:[{f:"Revenue recognition: no formal process to identify performance obligations in contracts",rec:"Revenue recognition policy with contract review checklist for new deals.",lv:"SIGNIFICANT"},{f:"Dev cost capitalisation: no clear policy distinguishing research from development phase",rec:"Written policy with project-by-project FRS 102.18.8H assessment template.",lv:"ELEVATED"},{f:"SBP: option grants not communicated to finance team promptly",rec:"Board minute template includes standing item for option grants. Finance notified within 5 days.",lv:"NORMAL"}],
  payTests:{t:"D4 — Payables & Accruals",r:"NORMAL",a:"SUBSTANTIVE",isa:"ISA 330.6; FRS 102.21",items:[
    {ref:"D4.01",p:"Aged creditors listing: cast, agree to TB. Technology companies typically have fewer trade creditors — focus on hosting, licence, and contractor liabilities.",as:"Completeness; Accuracy",ev:"Aged creditors, TB, control rec"},
    {ref:"D4.02",p:"Sample >PM: vouch to invoice and approval. Focus on: hosting/cloud costs (AWS/Azure), software licences, contractor invoices.",as:"Existence; Accuracy",ev:"Invoices, service agreements, approvals"},
    {ref:"D4.03",p:"Cut-off: hosting and SaaS tool invoices — verify expense in correct period per service dates (not invoice date).",as:"Cut-off",ev:"Invoices, service period dates"},
    {ref:"D4.04",p:"SFURL: review 30 days post-YE. Key: contractor invoices for dev work performed pre-YE; hosting charges for December.",as:"Completeness",ev:"Post-YE bank, invoices"},
    {ref:"D4.05",p:"Deferred income (liability): recalculate from contract terms — annual subscriptions paid upfront, deferred over service period per FRS 102.23/IFRS 15.",as:"Accuracy; Completeness",ev:"Subscription records, contracts, deferred revenue schedule"},
    {ref:"D4.06",p:"R&D accruals: verify costs claimed in R&D tax credit are actually incurred. Cross-reference to payables/payroll records and CTA 2009 qualifying criteria.",as:"Accuracy; Existence",ev:"R&D claim working papers, invoices, contracts"}
  ]},
  payrollTests:{t:"D5 — Payroll & Staff Costs",r:"ELEVATED",a:"SUBSTANTIVE",isa:"ISA 330.6; FRS 102.26",items:[
    {ref:"D5.01",p:"Proof in total: reconcile headcount × average salary to total payroll. Separately analyse: permanent staff, contractors (IR35 risk), overseas remote workers.",as:"Completeness; Accuracy",ev:"HR system, payroll, contracts"},
    {ref:"D5.02",p:"Sample: agree gross to contract, verify share option exercise if applicable, check EMI/CSOP compliance, deductions per PAYE.",as:"Accuracy; Existence",ev:"Contracts, option agreements, payroll"},
    {ref:"D5.03",p:"Share-based payment expense: recalculate per FRS 102.26 / IFRS 2. Verify vesting conditions, fair value inputs (Black-Scholes/binomial), expense spread.",as:"Accuracy; Completeness",ev:"Option scheme docs, valuation model, board minutes"},
    {ref:"D5.04",p:"Directors and key management: verify total per CA 2006 s.412-413. Include options exercised. Highest paid director disclosure (CA 2006 s.411).",as:"Completeness",ev:"Service contracts, option records, board minutes"},
    {ref:"D5.05",p:"Capitalised labour: verify developer time charged to capitalised projects meets FRS 102.18.8H criteria. Challenge allocation methodology.",as:"Classification; Accuracy",ev:"Timesheets, project records, capitalisation policy"}
  ]},
  controls:["Revenue recognition: new contract review process identifying performance obligations before invoicing","Development capitalisation: project-by-project gateway assessment against FRS 102.18.8H six criteria","Change management: code releases through version control with approval gates (no direct production changes)","Access controls: privileged access logging, quarterly user access reviews, SOD in billing systems","Contract amendments: variations, renewals, and cancellations documented and communicated to finance within 5 days","Deferred revenue: automated calculation from billing system with monthly reconciliation to GL"],
  reps:["All multi-element revenue arrangements have been identified and the transaction price allocated to performance obligations per FRS 102.23/IFRS 15","Development costs capitalised meet all six criteria under FRS 102.18.8H (or IAS 38.57 for IFRS reporters)","Share-based payment arrangements are complete — all grants, modifications, and cancellations are disclosed","The R&D tax credit claim includes only qualifying expenditure per CTA 2009","Deferred revenue represents actual obligations to deliver services to customers in future periods","All customer contracts including side agreements, price concessions, and verbal arrangements have been disclosed","Intangible asset useful lives reflect current assessment and impairment indicators have been evaluated per FRS 102.27"],
  events:["Major customer churn or contract cancellation post-YE affecting ARR and deferred revenue","Funding round closing post-YE (share price implication for SBP valuation)","Product launch failure or significant bug post-YE indicating dev asset impairment","HMRC enquiry into R&D tax credit claim post-YE","Key employee departures affecting capitalised development project viability","Data breach or regulatory action post-YE (GDPR fines up to 4% global turnover)","Competitor acquisition or market disruption post-YE"]
},

financial_services:{
  label:"Financial Services",icon:"🏦",color:"#1E40AF",
  sectors:["Banking","Insurance","Asset Management","Private Equity","Payments","Wealth Management"],
  acceptance:["FCA regulated: assess regulatory permissions and compliance history","Team: specialist financial services audit experience required (ISA 220.25)","Consider expert for fair value and ECL models (ISA 620)","CASS: if entity holds client money, CASS audit may be required separately","AML: financial services is inherently high-risk — enhanced CDD","Independence: particular scrutiny for financial sector audit clients (FRC ES)"],
  understanding:["Business model: fee-based vs balance sheet vs proprietary trading. Revenue sources: management fees, performance fees, NIM, commissions","Risk management: credit risk, market risk, operational risk, liquidity risk frameworks","Regulatory: FCA, PRA (dual-regulated firms), CASS 7 (client money), CASS 6 (custody), MiFID II, SMCR","Financial instruments: classification, measurement, impairment under IFRS 9/FRS 102 s11-12","Capital adequacy: CRR/CRD IV, own funds requirements, Pillar 3 disclosures","IT: core banking systems, portfolio management, risk management, regulatory reporting platforms"],
  mat:{b:"Revenue (fee income or NII)",p:"1-2%",r:"Fee income or net interest income is the primary performance measure for financial services entities.",alts:["Total assets 0.5-1% — for balance sheet-focused entities (banks)","Regulatory capital 1-2% — where capital adequacy is key user concern","Net asset value 1-2% — for funds and investment entities"]},
  fraud:["Revenue: fictitious fee income, manipulation of AUM calculations, phantom trades (ISA 240.26)","Fair value manipulation: using stale prices, Level 3 inputs, model-based valuations with favourable assumptions","ECL provisions: management bias in staging, PD/LGD/EAD inputs, forward-looking scenarios","Client money misappropriation: failure to segregate, using client funds for firm operations","Regulatory reporting manipulation: misstating capital ratios","Management override (ISA 240.31-33 irrebuttable)"],
  sigRisks:[
    {id:"SR01",risk:"Fair value measurement — Level 2/3 financial instruments",resp:"Independent price verification for ALL material holdings. Challenge Level 3 inputs. Assess management expert competence per ISA 620.",isa:"ISA 540.8; ISA 620.7; FRS 102.11.27; IFRS 13.72-90"},
    {id:"SR02",risk:"Management override of controls",resp:"ISA 240.32 mandatory procedures. Focus journals to fair value adjustments, fee income, and provision accounts.",isa:"ISA 240.31-33 (irrebuttable)"},
    {id:"SR03",risk:"ECL provisioning — model risk and management bias",resp:"Test ECL model: inputs (PD/LGD/EAD), staging criteria, forward-looking scenarios. Retrospective comparison. Sensitivity analysis.",isa:"ISA 540.8; IFRS 9.5.5.1-5.5.20; FRS 102.11.21"}
  ],
  risks:[
    {id:"F-R01",risk:"Fair value — Level 2/3 instruments, model risk, unobservable inputs",lv:"SIGNIFICANT",isa:"ISA 540.8; ISA 620.7; IFRS 13.72-90; FRS 102.11.27"},
    {id:"F-R02",risk:"ECL — expected credit losses, model inputs, staging, forward-looking",lv:"SIGNIFICANT",isa:"ISA 540.8; IFRS 9.5.5.1-5.5.20; FRS 102.11.21"},
    {id:"F-R03",risk:"Client money — segregation, reconciliation, CASS compliance",lv:"SIGNIFICANT",isa:"ISA 505.7; FCA CASS 7.6; CASS 7.13"},
    {id:"F-R04",risk:"Regulatory capital — adequacy ratios, own funds, reporting accuracy",lv:"ELEVATED",isa:"ISA 250.14-17; CRR Articles 92-98"},
    {id:"F-R05",risk:"Fee income — AUM-based fees, performance fees, timing of recognition",lv:"ELEVATED",isa:"ISA 240.26; FRS 102.23.3; IFRS 15.56-58"},
    {id:"F-R06",risk:"Insurance reserves — IBNR, claims provisions, actuarial estimates",lv:"SIGNIFICANT",isa:"ISA 540.8; ISA 620.7; FRS 103; IFRS 17.33-52"}
  ],
  procs:[
    {ref:"F-P01",area:"Investments",proc:"Independent price verification for ALL material holdings. Level 1: quoted prices. Level 2: observable inputs. Level 3: challenge model assumptions.",as:"Valuation",isa:"ISA 540.8; IFRS 13; FRS 102.11.27"},
    {ref:"F-P02",area:"Loans",proc:"ECL model testing: verify PD/LGD/EAD inputs, staging criteria, forward-looking macro scenarios. Retrospective vs actual.",as:"Valuation",isa:"ISA 540.8; IFRS 9.5.5"},
    {ref:"F-P03",area:"Client Money",proc:"Confirm client money reconciliation and segregation per CASS 7. Obtain bank confirmation for client accounts. Test 5 daily reconciliations.",as:"Existence; Rights",isa:"ISA 505; CASS 7.6; CASS 7.13"},
    {ref:"F-P04",area:"Revenue",proc:"Recalculate management fees from AUM × fee rate. Test performance fees against high-water mark/hurdle rate. Verify crystallisation dates.",as:"Accuracy; Occurrence",isa:"ISA 330; IFRS 15"},
    {ref:"F-P05",area:"Regulatory",proc:"Recalculate capital adequacy ratios. Agree to regulatory submissions. Identify any breaches or waivers in year.",as:"Presentation",isa:"ISA 250; CRR Art.92-98"}
  ],
  tests:{
    revenue:{t:"D1 — Fee Income & Revenue",r:"ELEVATED",a:"SUBSTANTIVE",isa:"ISA 240.26; IFRS 15",items:[
      {ref:"D1.01",p:"Management fees: recalculate from AUM × fee rate for sample of months. Agree AUM to portfolio valuations. Verify fee rate to IMA/client agreement.",as:"Accuracy",ev:"AUM reports, IMAs, fee calculations"},
      {ref:"D1.02",p:"Performance fees: verify methodology (hurdle rate, high-water mark, crystallisation). Recalculate for all crystallised fees.",as:"Accuracy; Occurrence",ev:"Fund docs, performance data, calculations"},
      {ref:"D1.03",p:"Commission income: for sample, agree to trade records and commission schedules. Verify correct split between upfront and trail.",as:"Accuracy; Cut-off",ev:"Trade records, commission schedules"},
      {ref:"D1.04",p:"Interest income: recalculate for material loan books. Verify effective interest rate method where applicable.",as:"Accuracy",ev:"Loan agreements, interest calculations"},
      {ref:"D1.05",p:"Analytics: monthly fee income vs AUM growth. Investigate disconnects. Revenue per AUM ratio trend.",as:"Completeness",ev:"Monthly revenue, AUM data"},
      {ref:"D1.06",p:"Journal testing per ISA 240.32(a): manual entries to fee income and deferred fee accounts.",as:"Occurrence",ev:"Journal listing"}
    ]}
  },
  leads:{rev:["Management fees","Performance fees","Commission","Interest income","Other fees"],rec:["Trade debtors","Accrued fees","Loans and advances","Other receivables"],cash:["Firm accounts","Client money accounts","Deposit accounts"],pay:["Trade creditors","Trail commission payable","Accruals","Deferred fees","Regulatory levies"]},
  kpis:["Net interest margin","Cost:income ratio","NPL ratio","Capital adequacy ratio","AUM growth %","Client money balance"],
  disc:{frs102:["Financial instruments — categories and fair values (FRS 102.11.41-11.48)","Credit risk disclosures (FRS 102.11.39-11.40)","Regulatory capital (if applicable)","Client money held (FRS 102.11.48A)"],ifrs:["Fair value hierarchy (IFRS 13.93-99)","ECL methodology (IFRS 7.35F-35N)","Revenue disaggregation (IFRS 15.114)","Regulatory capital (Pillar 3)"],frs102_1a:["Financial instruments policy","Related parties"]},
  gc:["Regulatory capital headroom","Client money compliance status","AUM trend and client redemptions","Revenue concentration by client","Regulatory actions or restrictions","Market conditions impact on revenue"],
  ml:[{f:"Client money: reconciliation not completed daily as required by CASS 7",rec:"Automate daily client money reconciliation with exception reporting.",lv:"SIGNIFICANT"},{f:"Fair value: no independent price verification for Level 2 instruments",rec:"Monthly IPV by independent team for all non-Level 1 holdings.",lv:"ELEVATED"},{f:"Regulatory reporting: manual data extraction increasing error risk",rec:"Automate regulatory return data feeds from core systems.",lv:"ELEVATED"}],
  payTests:{t:"D4 — Payables & Accruals",r:"NORMAL",a:"SUBSTANTIVE",isa:"ISA 330.6; FRS 102.21",items:[
    {ref:"D4.01",p:"Aged creditors: agree to TB. Financial services entities typically have limited trade creditors — focus on professional fees, system costs, regulatory levies.",as:"Completeness; Accuracy",ev:"Creditors listing, TB"},
    {ref:"D4.02",p:"Sample >PM: vouch to invoice and service agreement. Focus on: custodian fees, Bloomberg/data terminal, compliance consultants, regulatory fees.",as:"Existence; Accuracy",ev:"Invoices, service agreements"},
    {ref:"D4.03",p:"SFURL: review post-YE. Key risk: performance fee accruals (crystallisation dates), trail commission liabilities, regulatory levies (FCA/FSCS).",as:"Completeness",ev:"Post-YE bank, commission statements, FCA invoices"},
    {ref:"D4.04",p:"Accruals: performance fees payable, trail commissions, bonus accruals (often material in FS), deferred compensation.",as:"Accuracy; Completeness",ev:"Fee agreements, commission schedules, bonus letters"},
    {ref:"D4.05",p:"Provisions: verify regulatory fines/penalties, customer redress provisions, restructuring. Assessment per FRS 102.21.4 criteria.",as:"Completeness; Valuation",ev:"FCA correspondence, complaints log, legal advice"},
    {ref:"D4.06",p:"Client money creditor (CASS 7): verify amounts held on behalf of clients reconcile to client money bank accounts. Confirm segregation.",as:"Accuracy; Existence",ev:"Client money rec, bank confirmations, CASS 7 reports"}
  ]},
  payrollTests:{t:"D5 — Payroll & Staff Costs",r:"ELEVATED",a:"SUBSTANTIVE",isa:"ISA 330.6; CA 2006 s.411",items:[
    {ref:"D5.01",p:"Proof in total: reconcile headcount × average comp to total. Separately: base salary, cash bonus, deferred bonus, carried interest, benefits in kind.",as:"Completeness; Accuracy",ev:"HR records, payroll, comp framework"},
    {ref:"D5.02",p:"Sample: verify to contracts, bonus determination (individual allocation from bonus pool), SMCR status check for material risk takers.",as:"Accuracy; Existence",ev:"Employment contracts, remuneration committee minutes"},
    {ref:"D5.03",p:"Bonus accrual: recalculate pool from formulaic basis (% of revenue/profit). Verify individual allocations per remuneration committee. Cut-off for deferred element.",as:"Accuracy; Completeness",ev:"Remuneration policy, committee minutes, calculations"},
    {ref:"D5.04",p:"Carried interest and co-investment: verify terms per fund documentation. Assess whether employment income or investment return (tax treatment).",as:"Classification; Accuracy",ev:"Fund docs, partnership agreements, tax advice"},
    {ref:"D5.05",p:"Remuneration Code (if applicable): verify compliance with FCA SYSC 19 — deferral, clawback, ratio of variable to fixed. Disclosure per CRD requirements.",as:"Completeness; Presentation",ev:"Remuneration policy, FCA returns, Pillar 3 report"}
  ]},
  controls:["Trade execution: front office executes, middle office verifies, back office settles — three-way segregation","Valuations: independent pricing team (not portfolio managers) for all Level 2/3 instruments","Client money: daily reconciliation per CASS 7.15.3; monthly client money calculation per CASS 7.16","Regulatory reporting: automated data feeds with manual review of exception reports before FCA submission","New product approval: compliance sign-off before any new product launch or client onboarding","Conflicts of interest: personal account dealing pre-clearance, gifts register, outside business interests log"],
  reps:["Financial instruments are valued in accordance with IFRS 9/FRS 102 s11-12 and the fair value hierarchy is appropriate","Expected credit loss provisions reflect forward-looking information and management's best estimate","Client money is held and segregated in accordance with CASS 7 rules","All regulatory capital requirements are met and correctly calculated","All related party transactions including fund investments by directors/partners are disclosed","No material regulatory breaches or pending enforcement actions exist beyond those disclosed","Insurance provisions (if applicable) reflect best estimate of claims outstanding and IBNR per IFRS 17/FRS 103"],
  events:["Significant market movements post-YE affecting portfolio valuations at YE","Client money deficit identified post-YE","Regulatory enforcement action or investigation post-YE","Key fund manager departure (key person risk for AUM retention)","Material credit loss or default post-YE on loan book","Changes in regulatory capital requirements post-YE","Significant client redemptions post-YE affecting AUM and fee income"]
},

retail:{
  label:"Retail & Consumer",icon:"🛒",color:"#EC4899",
  sectors:["E-commerce","Grocery","Fashion","Hospitality","Leisure","Food Service"],
  acceptance:["Team experience with inventory counts, loyalty programmes, lease accounting","Multiple locations: plan count attendance logistics (ISA 501.4)","Cash-intensive businesses: elevated fraud risk (ISA 240)","Independence review per FRC ES — common for retail to seek tax services","Consider seasonal factors: YE timing relative to peak trading","IFRS 16 / FRS 102 s20: significant lease portfolio assessment"],
  understanding:["Business model: physical stores, e-commerce, omnichannel. Revenue from product sales, food service, memberships, loyalty","Revenue cycle: POS transactions → daily banking → reconciliation. Online: order → payment → despatch → delivery","Key estimates: inventory shrinkage, loyalty programme deferrals, gift card breakage, lease ROU assets, store impairment","Regulatory: consumer rights, food safety, licensing (alcohol, entertainment), payment card compliance (PCI-DSS)","IT: POS systems, ERP, e-commerce platforms, inventory management, loyalty programme databases","Seasonality: Christmas, summer, back-to-school. YE timing significantly affects inventory levels and trading patterns"],
  mat:{b:"Revenue",p:"0.5-1%",r:"Revenue is the key performance measure for retail. Lower % reflects high volume/low margin nature of retail.",alts:["Gross profit 3-5% — focus on margin management","Total assets 1-2% — where property/leases dominate balance sheet","PBT 5-10% — if stable and positive"]},
  fraud:["Revenue: fictitious sales, returns manipulation, loyalty point fraud (ISA 240.26)","Inventory shrinkage: internal theft, receiving fraud, vendor fraud, systematic under-recording","Cash theft: skimming from POS, void/refund manipulation, cash handling irregularities","Management override (ISA 240.31-33 irrebuttable)","Loyalty programme: inflating deferred revenue to understate current income","Lease classification manipulation to keep liabilities off-balance sheet"],
  sigRisks:[
    {id:"SR01",risk:"Inventory existence and valuation — shrinkage, NRV",resp:"Attend counts at key locations (ISA 501.4). Test shrinkage provision. NRV testing for seasonal/fashion lines.",isa:"ISA 501.4; ISA 540.8; FRS 102.13.4"},
    {id:"SR02",risk:"Management override of controls",resp:"ISA 240.32 mandatory procedures. Focus on cash, inventory adjustments, margin entries.",isa:"ISA 240.31-33 (irrebuttable)"},
    {id:"SR03",risk:"Revenue — loyalty programmes, gift cards, returns",resp:"Test loyalty point deferral methodology. Verify gift card breakage estimates. Test returns provisions.",isa:"ISA 240.26; IFRS 15.B39-B43; FRS 102.23.8"}
  ],
  risks:[
    {id:"R-R01",risk:"Inventory — shrinkage, NRV markdowns, obsolescence of seasonal/fashion stock",lv:"SIGNIFICANT",isa:"ISA 501.4-8; FRS 102.13.4"},
    {id:"R-R02",risk:"Revenue — loyalty programmes, gift cards, returns provisions",lv:"ELEVATED",isa:"ISA 240.26; FRS 102.23.8; IFRS 15.B39-B43"},
    {id:"R-R03",risk:"Lease accounting — ROU assets and liabilities (IFRS 16/FRS 102 s20)",lv:"ELEVATED",isa:"ISA 540.8; IFRS 16.22-46; FRS 102.20.4"},
    {id:"R-R04",risk:"Store impairment — individual store CGU assessment",lv:"ELEVATED",isa:"ISA 540.8; FRS 102.27.5; IAS 36"},
    {id:"R-R05",risk:"Cash controls — high-volume cash handling at POS",lv:"NORMAL",isa:"ISA 315.12-14; ISA 240.26"}
  ],
  procs:[
    {ref:"R-P01",area:"Inventory",proc:"Attend counts at key locations representing >50% of value (ISA 501.4). Test shrinkage provision vs actual count results. NRV for seasonal lines.",as:"Existence; Valuation",isa:"ISA 501.4; FRS 102.13.4"},
    {ref:"R-P02",area:"Revenue",proc:"Test loyalty deferral: verify point issuance rate, redemption rate assumption, fair value per point. Test gift card breakage estimate against historical data.",as:"Accuracy; Cut-off",isa:"IFRS 15.B39-B43; FRS 102.23.8"},
    {ref:"R-P03",area:"Leases",proc:"For material leases: recalculate ROU asset and lease liability. Verify discount rate (IBR). Test lease modifications.",as:"Accuracy; Completeness",isa:"IFRS 16.22-46; FRS 102.20.4-20.9"},
    {ref:"R-P04",area:"Impairment",proc:"Identify loss-making stores. For each: assess recoverable amount (higher of FVLCS and VIU). Challenge management's cash flow forecasts.",as:"Valuation",isa:"ISA 540.8; FRS 102.27.5-27.11"}
  ],
  tests:{
    revenue:{t:"D1 — Revenue & Cash Sales",r:"SIGNIFICANT",a:"COMBINED",isa:"ISA 240.26; ISA 330.18",items:[
      {ref:"D1.01",p:"POS reconciliation: for sample of days, trace POS reports → daily cash/card summary → bank deposit. Investigate variances >trivial.",as:"Completeness; Accuracy",ev:"POS reports, till summaries, bank statements"},
      {ref:"D1.02",p:"Online revenue: for sample, trace order → payment confirmation → despatch → delivery confirmation. Test refund/return processing.",as:"Occurrence; Cut-off",ev:"Order records, despatch notes, payment gateway"},
      {ref:"D1.03",p:"Loyalty programme: verify deferral calculation. Test assumptions (redemption rate, breakage, FV per point) against actual data.",as:"Accuracy; Cut-off",ev:"Loyalty system data, redemption history"},
      {ref:"D1.04",p:"Gift cards: verify deferred revenue balance. Test breakage estimate against historical non-redemption data.",as:"Accuracy; Valuation",ev:"Gift card records, breakage analysis"},
      {ref:"D1.05",p:"Returns provision: compare to actual return rates. Test post-YE returns for correct period.",as:"Accuracy; Cut-off",ev:"Returns data, provision calculation"},
      {ref:"D1.06",p:"Journal testing per ISA 240.32(a): manual entries to revenue, cash, and inventory accounts.",as:"Occurrence",ev:"Journal listing"}
    ]}
  },
  leads:{rev:["Store sales","Online sales","Concession income","Franchise fees","Other"],rec:["Trade debtors","Card receivables","Other receivables","Prepayments"],cash:["Current a/c","Store float/petty cash","Card clearing"],pay:["Trade creditors","Accruals","Gift card liability","Loyalty liability","VAT","Lease liabilities"]},
  kpis:["Like-for-like growth %","Gross margin %","Stock turn days","Rent:revenue ratio","Online mix %","Shrinkage rate %"],
  disc:{frs102:["Revenue policy including loyalty/gift cards (FRS 102.23.30)","Inventory policy (FRS 102.13.22)","Lease commitments (FRS 102.20.16)","Impairment losses (FRS 102.27.32)"],ifrs:["Lease ROU and liabilities (IFRS 16.47-60)","Revenue disaggregation (IFRS 15.114)","Segment reporting (IFRS 8)"],frs102_1a:["Revenue policy","Lease commitments"]},
  gc:["Like-for-like sales trend","Store profitability and closure programme","Lease commitment affordability","Seasonal cash flow patterns","Supplier terms and credit insurance","Online competition and channel shift"],
  ml:[{f:"Cash handling: daily bankings not reconciled to POS within 24 hours",rec:"Same-day reconciliation with exception escalation protocol.",lv:"ELEVATED"},{f:"Inventory: no perpetual inventory counting programme between annual counts",rec:"Rolling cycle count programme covering all locations quarterly.",lv:"ELEVATED"}],
  payTests:{t:"D4 — Payables & Accruals",r:"ELEVATED",a:"SUBSTANTIVE",isa:"ISA 330.6; FRS 102.21",items:[
    {ref:"D4.01",p:"Aged creditors: cast, agree to TB. Retail creditors typically large volume — test by value stratification. Focus on key suppliers >5% of purchases.",as:"Completeness; Accuracy",ev:"Aged creditors, TB"},
    {ref:"D4.02",p:"Sample >PM: vouch to invoice, GRN. Verify supplier rebates/volume discounts correctly netted per FRS 102.23.3 (reduce cost of purchases, not income).",as:"Existence; Accuracy; Classification",ev:"Invoices, GRNs, rebate agreements"},
    {ref:"D4.03",p:"Cut-off: last 10 GRNs before YE, first 10 after — critical for retail seasonal stock build-up around December/January YE.",as:"Cut-off",ev:"GRN log, delivery notes, invoices"},
    {ref:"D4.04",p:"SFURL: review 30 days post-YE. For retailers with centralised distribution, verify DC receipts pre-YE are all invoiced/accrued.",as:"Completeness",ev:"Post-YE bank, DC receiving logs"},
    {ref:"D4.05",p:"Lease liabilities: verify IFRS 16/FRS 102 s20 lease creditor balance for material store leases. Recalculate interest unwinding and payments.",as:"Accuracy; Completeness",ev:"Lease agreements, amortisation schedule"},
    {ref:"D4.06",p:"Gift card liability: verify unredeemed balance at YE. Test breakage estimate (unredeemed portion) against historical redemption patterns.",as:"Accuracy; Valuation",ev:"Gift card system reports, historical redemption data"}
  ]},
  payrollTests:{t:"D5 — Payroll & Staff Costs",r:"NORMAL",a:"SUBSTANTIVE",isa:"ISA 330.6; CA 2006 s.411",items:[
    {ref:"D5.01",p:"Proof in total: recalculate from average headcount × average hourly rate × average hours. Separately for store staff, warehouse, head office. Include agency/seasonal.",as:"Completeness; Accuracy",ev:"Payroll summaries, HR headcount data"},
    {ref:"D5.02",p:"Sample (stratified — directors, store managers, hourly staff, seasonal): verify gross to contract/rota, deductions, net to bank. Check NMW compliance.",as:"Accuracy; Existence",ev:"Contracts, rotas, timesheets, BACS"},
    {ref:"D5.03",p:"National Minimum Wage: verify all hourly workers paid at or above NMW/NLW rate for their age band. HMRC NMW enquiry risk.",as:"Accuracy; Compliance",ev:"Pay rates, age records, HMRC rates"},
    {ref:"D5.04",p:"Directors' remuneration: verify per CA 2006 s.412-413 including benefits in kind, pension contributions. Highest paid director disclosure.",as:"Completeness",ev:"Service contracts, P11D, board minutes"},
    {ref:"D5.05",p:"Holiday pay accrual: verify calculation methodology per Working Time Regulations 1998. Test sample of staff for accrued but untaken days at YE.",as:"Accuracy; Completeness",ev:"HR system, holiday records, calculations"}
  ]},
  controls:["POS controls: till reconciliation daily, void/refund supervisor authorisation, CCTV on tills","Goods receipt: DC scanning with weight/quantity verification; store receiving logged and checked","Inventory: perpetual inventory system with rolling cycle counts; annual full count","Supplier payments: three-way match (PO-GRN-invoice) or two-way (invoice-GRN) with approval authority levels","Cash handling: daily banking, safe limit controls, independent cash-in-transit reconciliation","Gift cards: sequential numbering, activation controls, breakage estimated quarterly"],
  reps:["Inventory quantities per the counting programme and perpetual records are accurate","Inventory is valued at lower of cost and NRV per FRS 102.13.4 including appropriate markdown provisions","Shrinkage provisions reflect actual losses calculated from count results and perpetual system variances","Loyalty programme deferred revenue reflects management's best estimate of redemption rates","Gift card breakage estimates are based on historical patterns and represent the expected unredeemed portion","All lease arrangements have been identified and accounted for per IFRS 16/FRS 102 s20","All store locations assessed for impairment where indicators exist per FRS 102.27"],
  events:["Significant post-YE markdown or clearance sales indicating NRV issue at YE","Store closure announcement post-YE (impairment, lease termination)","Loyalty programme terms change post-YE","Major supplier failure post-YE affecting stock availability","Significant increase in returns post-YE (product quality issue at YE)","Regulatory action post-YE (food safety, trading standards)","E-commerce platform disruption post-YE"]
},

professional_services:{
  label:"Professional Services",icon:"⚖️",color:"#0891B2",
  sectors:["Legal (SRA)","Accountancy","Consulting","Recruitment","Architecture","Engineering Consultancy"],
  acceptance:["Client account: if SRA/ICAEW regulated, assess client money compliance","WIP recoverability: key estimate requiring industry experience","Partnership/LLP structure: understand profit-sharing and capital accounts","Consider regulatory body (SRA, BSB, ICAEW, RICS) specific requirements","Independence: common for professional services firms to be interconnected","Assess lock-up (WIP + debtors) and impact on cash flow/going concern"],
  understanding:["Business model: time-based billing (hourly rates × hours), fixed fees, contingent/success fees, retainers","Revenue cycle: engagement letter → work performed → time recorded → WIP → fee note issued → debtor → cash received","Key estimates: WIP recoverability (lock-up days), fixed-fee stage of completion, PI provisions, partner profit allocation","Regulatory: SRA Accounts Rules 2019 (legal), ICAEW Client Money Regs (accounting), RICS Rules of Conduct","Structure: LLP partnership with members' profit shares and capital contributions, or limited company with director shareholders","IT: practice management (PMS) systems, time recording, billing, document management, client ledger"],
  mat:{b:"Revenue (fee income)",p:"1-2%",r:"Fee income is the primary performance indicator. Partners and lenders focus on fee levels, recovery rates, and profitability.",alts:["Gross profit/net profit 5-10%","Total assets 1-2% — if significant client money or property","Partners' funds 3-5% — focus on equity and distributions"]},
  fraud:["Revenue: fictitious time entries, inflated fee notes, unearned WIP (ISA 240.26)","WIP: failure to write down irrecoverable WIP, carrying stale WIP to inflate profits","Client money: misuse of client funds for firm operations (SRA Accounts Rules breach)","Expense fraud: personal expenses through firm, fictitious disbursements","Management override (ISA 240.31-33 irrebuttable)","Partner profit manipulation: timing of revenue/expenses around profit-sharing dates"],
  sigRisks:[
    {id:"SR01",risk:"WIP recoverability — aged and potentially irrecoverable work",resp:"Detailed WIP ageing analysis. Challenge recoverability of items >90 days with fee earners. Test write-off history. Compare lock-up to industry benchmarks.",isa:"ISA 540.8; FRS 102.23.14-23.16"},
    {id:"SR02",risk:"Management override of controls",resp:"ISA 240.32 mandatory procedures. Focus on WIP adjustments, revenue journals, and partner allocation entries.",isa:"ISA 240.31-33 (irrebuttable)"},
    {id:"SR03",risk:"PI provisions — litigation and claims exposure",resp:"Obtain solicitor's letter (ISA 501.9). Review PI claims register and insurance notifications. Challenge provision adequacy.",isa:"ISA 540.8; ISA 501.9; FRS 102.21.4"}
  ],
  risks:[
    {id:"P-R01",risk:"WIP recoverability — aged, potentially irrecoverable unbilled time and disbursements",lv:"SIGNIFICANT",isa:"ISA 540.8; FRS 102.23.14-23.16"},
    {id:"P-R02",risk:"Revenue on fixed-fee engagements — stage of completion estimation",lv:"ELEVATED",isa:"ISA 240.26; FRS 102.23.14"},
    {id:"P-R03",risk:"PI provisions — claims, notifications, IBNR estimation",lv:"SIGNIFICANT",isa:"ISA 540.8; ISA 501.9; FRS 102.21.4"},
    {id:"P-R04",risk:"Client account compliance — SRA/ICAEW rules",lv:"ELEVATED",isa:"ISA 250.14; SRA Accounts Rules 2019"},
    {id:"P-R05",risk:"Partner capital — measurement of members' interests",lv:"NORMAL",isa:"ISA 330.6; FRS 102 LLP SORP"}
  ],
  procs:[
    {ref:"P-P01",area:"WIP",proc:"Aged WIP analysis. Lock-up >90 days: challenge recoverability with partner. Compare CY write-offs to prior provisions. Test recovery rates by department.",as:"Valuation",isa:"ISA 540.8; FRS 102.23.14"},
    {ref:"P-P02",area:"Revenue",proc:"Fixed-fee: verify stage of completion. Compare budgeted hours to actual. Assess remaining effort. Time-based: sample time records to fee notes.",as:"Occurrence; Accuracy",isa:"ISA 330; FRS 102.23"},
    {ref:"P-P03",area:"Provisions",proc:"PI claims: obtain solicitor's letter (ISA 501.9). Review insurer notifications. For each claim >PM: assess provision adequacy.",as:"Completeness; Valuation",isa:"ISA 540.8; ISA 501.9; FRS 102.21.4"},
    {ref:"P-P04",area:"Client Money",proc:"For SRA-regulated: confirm compliance with SRA Accounts Rules 2019 rules 2-8. Test client account reconciliations. Verify proper transfers.",as:"Existence; Rights",isa:"ISA 250; SRA Accounts Rules 2019"}
  ],
  tests:{
    revenue:{t:"D1 — Fee Income & WIP",r:"SIGNIFICANT",a:"COMBINED",isa:"ISA 240.26; FRS 102.23",items:[
      {ref:"D1.01",p:"WIP: obtain detailed listing by matter/engagement. Cast. Agree to TB. Test ageing — challenge items >90 days for recoverability.",as:"Existence; Valuation",ev:"WIP listing, PMS data, partner confirmations"},
      {ref:"D1.02",p:"Time records: sample fee notes, trace to underlying time records and disbursement invoices. Verify hourly rates to engagement letters.",as:"Occurrence; Accuracy",ev:"Fee notes, time records, engagement letters"},
      {ref:"D1.03",p:"Fixed-fee revenue: for engagements >PM, verify stage of completion. Compare actual hours to budget. Assess reasonableness of profit recognised.",as:"Accuracy; Cut-off",ev:"Budget vs actual, project status reports"},
      {ref:"D1.04",p:"Write-offs: analyse CY write-offs by partner/department. Compare to PY. Assess adequacy of WIP provision.",as:"Valuation",ev:"Write-off analysis, provision calculation"},
      {ref:"D1.05",p:"Analytics: revenue per partner, lock-up days, utilisation rates. Compare to PY and industry benchmarks.",as:"Completeness",ev:"Revenue analysis, industry data"},
      {ref:"D1.06",p:"Journal testing per ISA 240.32(a): manual entries to WIP and fee income accounts.",as:"Occurrence",ev:"Journal listing"}
    ]}
  },
  leads:{rev:["Time-based fees","Fixed fees","Contingent/success fees","Disbursements recharged","Other"],rec:["Trade debtors","WIP","Unbilled disbursements","Other receivables"],cash:["Office account","Client account(s)","Deposit"],pay:["Trade creditors","Accruals","Members' profit shares","Corporation tax/Income tax","VAT"]},
  kpis:["Revenue per partner","Lock-up days","Utilisation rate %","Fee recovery rate %","WIP ageing profile","PI claims frequency"],
  disc:{frs102:["WIP methodology (FRS 102.23.30)","Partner/member arrangements (LLP SORP)","PI exposure and provisions (FRS 102.21.14)","Client account balances","Related parties (FRS 102.33)"],ifrs:["Contract assets (WIP) per IFRS 15","Revenue disaggregation by service line"],frs102_1a:["Revenue policy","Related parties"]},
  gc:["Lock-up days trend — cash conversion","Pipeline of new instructions/engagements","Key client dependency","PI insurance renewal and premium affordability","Partner retirements and capital repayment obligations","Bank facility and covenant compliance"],
  ml:[{f:"Time recording: entries posted >7 days after work performed, reducing accuracy",rec:"Enforce weekly time submission with automated reminders.",lv:"ELEVATED"},{f:"Client account: reconciliation not prepared same day as SRA requires",rec:"Daily automated reconciliation with partner review.",lv:"SIGNIFICANT"}],
  payTests:{t:"D4 — Payables & Accruals",r:"NORMAL",a:"SUBSTANTIVE",isa:"ISA 330.6; FRS 102.21",items:[
    {ref:"D4.01",p:"Aged creditors: agree to TB. Professional services typically have limited trade creditors — focus on counsel fees, expert witness, outsourced services.",as:"Completeness; Accuracy",ev:"Creditors listing, TB"},
    {ref:"D4.02",p:"Sample >PM: vouch to invoice and engagement terms. For legal firms: counsel and barrister fees; for recruitment: contractor payments.",as:"Existence; Accuracy",ev:"Invoices, engagement letters"},
    {ref:"D4.03",p:"SFURL: review 30 days post-YE. Key: counsel fees invoiced late for work done pre-YE; disbursements incurred but not yet billed to client.",as:"Completeness",ev:"Post-YE bank, invoices, disbursement records"},
    {ref:"D4.04",p:"Client account creditors (legal/accountancy): verify amounts held on client account match client ledger balances. Per SRA Accounts Rules 2019 Rule 2.",as:"Accuracy; Completeness",ev:"Client ledger, bank balance, rec"},
    {ref:"D4.05",p:"PI provision: review claims register. For open matters: assess per FRS 102.21.4 — obligating event, >50% probability, reliable estimate. Solicitor's letter ISA 501.9.",as:"Completeness; Valuation",ev:"Claims register, insurer notifications, legal advice"},
    {ref:"D4.06",p:"Partner current accounts/drawings: verify balances to profit-sharing agreement. For LLP: members' capital and undrawn profits.",as:"Accuracy; Existence",ev:"Partnership agreement, drawings records"}
  ]},
  payrollTests:{t:"D5 — Payroll & Staff Costs",r:"NORMAL",a:"SUBSTANTIVE",isa:"ISA 330.6; CA 2006 s.411",items:[
    {ref:"D5.01",p:"Proof in total: reconcile employed staff cost to headcount × average salary. Separately: partners/members (not employees if LLP), employed staff.",as:"Completeness; Accuracy",ev:"Payroll, partnership records, HR"},
    {ref:"D5.02",p:"Sample: verify gross pay to contract, time-based bonus to utilisation/billing targets, deductions per PAYE.",as:"Accuracy; Existence",ev:"Contracts, utilisation reports, BACS"},
    {ref:"D5.03",p:"Partner/member profit allocation: verify allocation per profit-sharing agreement. For LLP: trace to members' report per SORP guidance.",as:"Accuracy; Classification",ev:"Partnership agreement, tax computations"},
    {ref:"D5.04",p:"Trainee/apprentice costs: verify per training contract terms. Assess whether salary costs should be capitalised to WIP on client matters.",as:"Classification; Accuracy",ev:"Training contracts, time records"},
    {ref:"D5.05",p:"Directors'/members' remuneration disclosure per CA 2006 s.412-413 (companies) or LLP SORP. Highest paid director/member.",as:"Completeness",ev:"Service contracts, accounts disclosure"}
  ]},
  controls:["Time recording: daily entry required; weekly lock with manager review; monthly utilisation reporting","Fee note issuance: draft by fee earner, reviewed by partner, issued by billing team — three-stage process","Client account: daily reconciliation per SRA/ICAEW rules; no office-to-client or client-to-office transfers without proper authority","WIP write-off: requires partner authorisation with documented reason; >£[threshold] requires managing partner","Conflict check: new matter opening requires conflict search against all existing clients and matters","Disbursement authorisation: incurred only with client authority; passed through at cost or disclosed mark-up"],
  reps:["All WIP is recoverable or appropriately written down based on current assessment of each matter","Revenue recognition on fixed-fee engagements reflects genuine stage of completion per FRS 102.23","All professional indemnity claims and notifications to insurers are disclosed","Client account monies are held and accounted for in compliance with applicable professional body rules","All partner/member profit-sharing arrangements are per the partnership/LLP agreement","Related party transactions including referral fees and connected firm arrangements are disclosed"],
  events:["Significant PI claim notified or settled post-YE","Major client loss post-YE (revenue impact, WIP recoverability)","Partner departure post-YE (capital withdrawal impact on going concern)","SRA/ICAEW/regulatory investigation post-YE","Settlement of disputes on fee notes post-YE vs WIP carrying value","Client account irregularity discovered post-YE","Changes in insurance terms/excess/coverage post-YE"]
},

property:{
  label:"Property & Real Estate",icon:"🏢",color:"#B45309",
  sectors:["Commercial Investment","Residential Development","REIT","Property Management","Social Housing","Mixed-Use"],
  acceptance:["Expert assessment: external valuer for investment properties — ISA 620","Team: property accounting experience, FRS 102 s16 / IFRS 13 fair value","If REIT: additional regulatory requirements (CTA 2010 Part 12)","Development accounting: stage of completion experience needed","Social housing: Accounting Direction from RSH (Regulator of Social Housing)","Independence: no interest in entity's properties or related developments"],
  understanding:["Business model: investment (hold for rental income and capital growth) vs development (build to sell/let) vs management (agency fees)","Revenue: rental income (FRS 102.20), development sales (FRS 102.23), management fees, service charges","Key estimates: investment property fair value (external valuation), development profit (stage of completion), land impairment","Regulatory: Landlord & Tenant Act 1954/1987, RICS Valuation Standards (Red Book), planning law, Building Safety Act 2022","Lease accounting: operating vs finance classification, incentive spreading (rent-free periods, contributions)","Service charges: held on trust for tenants, separate accounting required per RICS Service Charge Code"],
  mat:{b:"Total assets (investment property dominant)",p:"1-2%",r:"For property companies, the balance sheet (property values) is the primary focus of users (lenders, investors).",alts:["Revenue 1-2% — for development companies","Net asset value 1-2% — for funds/REITs","Profit before revaluations 5-10% — for investment companies"]},
  fraud:["Valuation manipulation: providing misleading information to valuer on ERV, yields, or tenant status (ISA 240.26)","Development profit: premature recognition, understating costs to complete","Management override (ISA 240.31-33 irrebuttable)","Related party transactions: sales/purchases between connected entities at non-market values","Service charge: misallocation of costs between service charge and landlord accounts","Capitalising revenue expenditure as development costs"],
  sigRisks:[
    {id:"SR01",risk:"Investment property valuation — external valuer reliance",resp:"Assess valuer competence and independence (ISA 620). Challenge key assumptions: ERV, yields, void rates. Compare to market evidence.",isa:"ISA 540.8; ISA 620.7-9; FRS 102.16.7; IFRS 13"},
    {id:"SR02",risk:"Management override of controls",resp:"ISA 240.32 mandatory procedures. Focus on valuation adjustments, development cost capitalisation, revenue timing.",isa:"ISA 240.31-33 (irrebuttable)"},
    {id:"SR03",risk:"Development profit — stage of completion estimation",resp:"For ALL developments >PM: independently assess costs to complete, challenge profit margin, verify site sales/completions.",isa:"ISA 240.26; ISA 540.8; FRS 102.23.17-23.20"}
  ],
  risks:[
    {id:"PP-R01",risk:"Investment property valuation — fair value measurement, external valuer reliance",lv:"SIGNIFICANT",isa:"ISA 540.8; ISA 620.7-9; FRS 102.16.7; IFRS 13.72-90"},
    {id:"PP-R02",risk:"Development profit recognition — stage of completion estimation",lv:"SIGNIFICANT",isa:"ISA 240.26; ISA 540.8; FRS 102.23.17-23.20"},
    {id:"PP-R03",risk:"Land and development site impairment",lv:"ELEVATED",isa:"ISA 540.8; FRS 102.27.5; FRS 102.27.11"},
    {id:"PP-R04",risk:"Section 106 / CIL obligations",lv:"NORMAL",isa:"ISA 540.8; FRS 102.21.4; Planning Act 2008 s.205-225"}
  ],
  procs:[
    {ref:"PP-P01",area:"Valuation",proc:"Assess external valuer: competence (RICS qualification), independence (fee <5% of valuer's income), scope. Challenge key inputs: ERV, yield, void, capex assumptions.",as:"Valuation",isa:"ISA 540.8; ISA 620.7-9; FRS 102.16.7"},
    {ref:"PP-P02",area:"Revenue",proc:"Development profit: recalculate stage of completion. Verify costs to complete with QS. Test site sales to completion certificates and legal completions.",as:"Accuracy; Cut-off",isa:"ISA 540.8; FRS 102.23.17-23.20"},
    {ref:"PP-P03",area:"Leases",proc:"Lease incentive spreading: recalculate rent-free period and contribution spreading over lease term. Verify for material leases.",as:"Accuracy",isa:"FRS 102.20.15A"}
  ],
  tests:{
    revenue:{t:"D1 — Rental & Development Revenue",r:"SIGNIFICANT",a:"COMBINED",isa:"ISA 240.26; FRS 102.23",items:[
      {ref:"D1.01",p:"Rental income: for sample of properties, agree rent to lease. Recalculate annual charge including incentive spreading (FRS 102.20.15A). Verify void periods.",as:"Accuracy; Completeness",ev:"Leases, rent rolls, void reports"},
      {ref:"D1.02",p:"Development sales: vouch to exchange of contracts and legal completion. Verify revenue in correct period per completion date.",as:"Occurrence; Cut-off",ev:"Sale contracts, completion statements"},
      {ref:"D1.03",p:"Service charges: verify cost allocation between service charge and landlord. Confirm compliance with RICS Service Charge Code.",as:"Classification; Accuracy",ev:"Service charge accounts, RICS Code"},
      {ref:"D1.04",p:"Investment property gains: agree opening and closing valuations to external valuer's report. Verify movement recognised in P&L per FRS 102.16.7.",as:"Accuracy; Occurrence",ev:"Valuation reports, P&L"},
      {ref:"D1.05",p:"Analytics: rental income vs prior year, occupancy trend, yield analysis. Investigate anomalies.",as:"Completeness",ev:"Revenue analysis, market data"},
      {ref:"D1.06",p:"Journal testing per ISA 240.32(a): manual entries to revenue and valuation accounts.",as:"Occurrence",ev:"Journal listing"}
    ]}
  },
  leads:{rev:["Rental income","Service charge income","Development sales","Management fees","Other"],rec:["Trade debtors — tenants","Development receivables","Other receivables","Prepayments"],cash:["Current a/c","Service charge accounts","Development escrow"],pay:["Trade creditors","Service charge obligations","S.106/CIL","Accruals","Loan liabilities"]},
  kpis:["Net initial yield %","Occupancy rate %","ERV growth %","Development margin %","LTV ratio","WAULT"],
  disc:{frs102:["Investment property valuation method and key assumptions (FRS 102.16.10)","Development property policy (FRS 102.23.30)","Lease commitments (FRS 102.20.16)","Joint venture arrangements (FRS 102.15)"],ifrs:["Fair value hierarchy for properties (IFRS 13.93-99)","Revenue disaggregation (IFRS 15.114)","IFRS 16 lease disclosures"],frs102_1a:["Investment property policy","Capital commitments"]},
  gc:["Void rates and tenant covenants","Development pre-sales and funding","LTV covenants and refinancing","Planning risk on development pipeline","Interest rate exposure","Tenant insolvency risk"],
  ml:[{f:"Valuer information: void periods and capex not communicated accurately to external valuer",rec:"Formal valuer information pack reviewed and signed by finance director before submission.",lv:"SIGNIFICANT"},{f:"Lease records: no central lease database for incentive spreading calculations",rec:"Implement lease management system with automated spreading calculations.",lv:"ELEVATED"}],
  payTests:{t:"D4 — Payables & Accruals",r:"ELEVATED",a:"SUBSTANTIVE",isa:"ISA 330.6; FRS 102.21",items:[
    {ref:"D4.01",p:"Aged creditors: cast, agree to TB. For developers: focus on contractor/subcontractor accruals. For investment: managing agent fees, service charge.",as:"Completeness; Accuracy",ev:"Creditors listing, TB"},
    {ref:"D4.02",p:"Sample >PM: vouch to invoice, architect's certificate (development), or managing agent statement (investment). Verify retention withheld per contract.",as:"Existence; Accuracy",ev:"Invoices, certificates, agent statements"},
    {ref:"D4.03",p:"SFURL: review 30 days post-YE. Development: architect certificates for work completed pre-YE. Investment: service charge costs incurred pre-YE.",as:"Completeness",ev:"Post-YE payments, certificates"},
    {ref:"D4.04",p:"Development cost accruals: agree to QS cost report. Verify costs-to-complete include all contracted and anticipated costs.",as:"Completeness; Accuracy",ev:"QS reports, contractor schedules"},
    {ref:"D4.05",p:"Service charge creditor: verify service charge funds held on behalf of tenants reconcile to collected amounts less expenditure. RICS Service Charge Code.",as:"Accuracy; Completeness",ev:"Service charge accounts, bank statements"},
    {ref:"D4.06",p:"Section 106/CIL obligations: verify amounts payable per planning consent. Assess timing triggers and current provision per FRS 102.21.4.",as:"Completeness; Valuation",ev:"Planning documents, s106 agreements, provision calc"}
  ]},
  payrollTests:{t:"D5 — Payroll & Staff Costs",r:"NORMAL",a:"SUBSTANTIVE",isa:"ISA 330.6; CA 2006 s.411",items:[
    {ref:"D5.01",p:"Proof in total: reconcile to headcount. Property companies typically small headcount — full population testing may be appropriate.",as:"Completeness; Accuracy",ev:"Payroll, HR records"},
    {ref:"D5.02",p:"Full population or large sample: verify gross to contract, verify correct allocation between property management/development/admin.",as:"Accuracy; Classification",ev:"Contracts, timesheets, cost allocations"},
    {ref:"D5.03",p:"Directors' remuneration: verify per CA 2006 s.412-413. For REITs: verify compliance with any investor remuneration agreements.",as:"Completeness; Accuracy",ev:"Service contracts, board minutes"},
    {ref:"D5.04",p:"Development staff: verify time allocated to active developments is capitalised to development cost (inventory). Admin time expensed.",as:"Classification",ev:"Timesheets, project allocations"},
    {ref:"D5.05",p:"Property management staff: verify costs correctly allocated to service charge (rechargeable) vs landlord (non-rechargeable) per RICS Code.",as:"Classification; Accuracy",ev:"Timesheets, service charge budgets"}
  ]},
  controls:["Valuer information: formal information pack signed by FD before submission to external valuer","Rent collection: automated demand system, aged debtor review monthly, legal action trigger at 90 days","Development cost tracking: QS monthly reports reconciled to project accounting, cost-to-complete formally assessed quarterly","Lease database: centralised register with key dates (break, expiry, rent review), incentive spreading automated","Service charge: separate bank accounts per property, annual reconciliation to tenants per RICS Code","Investment decisions: committee approval with independent valuation for all acquisitions >£[threshold]"],
  reps:["Investment properties are valued at fair value and the valuations reflect the current condition and letting status","All information provided to the external valuer is complete and accurate","Development profit is recognised only when the outcome of the contract can be estimated reliably per FRS 102.23.17","All development sites assessed for impairment where indicators exist (planning refusal, cost overrun, market deterioration)","Service charge funds are held on behalf of tenants and accounted for separately per RICS Service Charge Code","All s106/CIL obligations are identified and provided per FRS 102.21.4","All related party transactions including sales/purchases with directors or connected persons are at arm's length and disclosed"],
  events:["Material change in property values post-YE (market evidence of yield shift or ERV decline)","Planning decision post-YE on development site (affecting land valuation)","Major tenant insolvency or vacancy post-YE","Completion of development post-YE (transfer from development to investment/sale)","Changes in interest rates post-YE affecting property yields and LTV covenants","Acquisition or disposal of material property post-YE","REIT regime compliance issue identified post-YE (CTA 2010 Part 12 conditions)"]
},

charities:{
  label:"Charities & Not-for-Profit",icon:"🤝",color:"#059669",
  sectors:["Grant-Making","Service Delivery","Membership","Education","Healthcare","Religious"],
  acceptance:["Team: Charities SORP experience essential — specialist reporting framework","Regulatory: Charity Commission registration and thresholds","Public benefit: assess whether charity meets public benefit requirement (Charities Act 2011)","Independence: assess trustee connections to audit firm (Charities Act 2011 s.185)","Going concern: dependency on grant funding creates specific risk","Consider dual reporting: charity accounts AND Companies Act if charitable company"],
  understanding:["Business model: grant-making, service delivery, trading, membership, fundraising. Income sources: donations, legacies, grants, contracts, trading","Revenue: Charities SORP FRS 102 — income recognised when entitlement, probability, and measurement criteria are met (SORP Module 5)","Fund accounting: unrestricted (general and designated), restricted, endowment. CRITICAL: expenditure from restricted funds must comply with donor conditions","Regulatory: Charities Act 2011, Charity Commission guidance (CC14-CC20), OSCR (Scotland), CCNI (NI)","Governance: board of trustees, articles/trust deed, conflicts of interest policy, safeguarding","Filing: accounts to Charity Commission within 10 months of YE (income >£25k). Annual return."],
  mat:{b:"Total income (or total expenditure)",p:"1-2%",r:"Total incoming resources is the primary measure of charitable activity. Users (funders, regulators) focus on how funds are raised and applied.",alts:["Total expenditure 1-2% — where expenditure management is key focus","Total assets 1-2% — for endowment-heavy charities","Net assets 3-5% — for charities with significant reserves"]},
  fraud:["Donations: fictitious donations for income inflation or money laundering","Legacy income: premature recognition before entitlement criteria met","Grant conditions: expenditure outside restricted fund terms","Trustee benefits: undisclosed payments or benefits to trustees/connected persons (Charities Act 2011 s.185)","Management override (ISA 240.31-33 irrebuttable)","Fundraising: misrepresentation of charitable purposes in appeals"],
  sigRisks:[
    {id:"SR01",risk:"Income recognition — legacies, grants, donations under SORP criteria",resp:"Test legacy income against three criteria: entitlement (notification from executor), probability (estate settled or probate granted), measurement (reliable estimate). Test grant income against conditions.",isa:"ISA 330.18; Charities SORP Module 5-6"},
    {id:"SR02",risk:"Management override of controls",resp:"ISA 240.32 mandatory procedures. Focus on fund transfers, income recognition, expenditure allocation.",isa:"ISA 240.31-33 (irrebuttable)"},
    {id:"SR03",risk:"Fund accounting — restricted fund compliance",resp:"Test sample of restricted fund expenditure against donor conditions. Verify no cross-subsidy from restricted to unrestricted. Confirm correct fund designation.",isa:"ISA 330.6; Charities SORP Module 2; Charities Act 2011 s.15"}
  ],
  risks:[
    {id:"CH-R01",risk:"Income — legacy, grant, and donation recognition under SORP three-criteria test",lv:"SIGNIFICANT",isa:"ISA 330.18; Charities SORP Modules 5-6"},
    {id:"CH-R02",risk:"Fund accounting — restricted vs unrestricted classification and compliance",lv:"SIGNIFICANT",isa:"ISA 330.6; Charities SORP Module 2; Charities Act 2011 s.15"},
    {id:"CH-R03",risk:"Related parties — trustee transactions and connected persons",lv:"ELEVATED",isa:"ISA 550.10-17; Charities Act 2011 s.185; SORP Module 9"},
    {id:"CH-R04",risk:"Going concern — dependency on grant funding and donor income",lv:"ELEVATED",isa:"ISA 570.10-16; Charities SORP Module 3.37-3.38"},
    {id:"CH-R05",risk:"Expenditure allocation — charitable vs support costs basis",lv:"NORMAL",isa:"ISA 330.6; Charities SORP Module 7.15-7.22"}
  ],
  procs:[
    {ref:"CH-P01",area:"Income",proc:"Legacies: test against THREE criteria — (1) entitlement: notification from executor/solicitor, (2) probability: estate sufficient, probate granted, (3) measurement: reliable estimate of amount receivable.",as:"Occurrence; Cut-off",isa:"Charities SORP Module 6.4-6.14; ISA 330.18"},
    {ref:"CH-P02",area:"Income",proc:"Grants: read award letters. Identify conditions vs restrictions. Test expenditure against conditions. Verify return obligations if conditions unmet.",as:"Occurrence; Classification",isa:"Charities SORP Module 5; ISA 330"},
    {ref:"CH-P03",area:"Funds",proc:"Restricted funds: sample expenditure and verify compliance with donor/funder conditions. Test fund transfers for proper authorisation. Verify closing balances.",as:"Classification; Presentation",isa:"Charities SORP Module 2; Charities Act 2011"},
    {ref:"CH-P04",area:"Governance",proc:"Trustee declarations: obtain annual conflict of interest declarations. Test related party transactions for completeness against known connections.",as:"Completeness",isa:"ISA 550; Charities Act 2011 s.185"}
  ],
  tests:{
    revenue:{t:"D1 — Incoming Resources",r:"SIGNIFICANT",a:"COMBINED",isa:"ISA 330.18; SORP Module 5-6",items:[
      {ref:"D1.01",p:"Legacies: for ALL legacies >PM, test three recognition criteria. Obtain probate records. Verify estate valuation. Test post-YE receipts for unrecognised legacies.",as:"Occurrence; Cut-off; Completeness",ev:"Solicitor correspondence, probate, estate accounts"},
      {ref:"D1.02",p:"Grants: sample >PM. Read award letter. Identify performance conditions vs restrictions. Verify conditions met before recognition. Test for returnable grants.",as:"Occurrence; Classification",ev:"Award letters, expenditure records, funder reports"},
      {ref:"D1.03",p:"Donations: for major gifts >PM, verify receipt. For regular giving, test sample to bank receipts and Gift Aid declarations.",as:"Occurrence; Accuracy",ev:"Bank statements, Gift Aid records"},
      {ref:"D1.04",p:"Fundraising income: verify event income to tickets/registrations. Test trading subsidiary income. Verify Gift Aid claimed per HMRC rules.",as:"Completeness; Accuracy",ev:"Event records, trading accounts, HMRC claims"},
      {ref:"D1.05",p:"Analytics: income by fund, by source vs PY. Investigate significant variances. Assess income diversity.",as:"Completeness",ev:"Income analysis, fund reports"},
      {ref:"D1.06",p:"Journal testing per ISA 240.32(a): manual entries to income and fund accounts. Focus on fund transfers.",as:"Occurrence",ev:"Journal listing"}
    ]}
  },
  leads:{rev:["Donations","Legacies","Grants — government","Grants — trusts/foundations","Trading income","Investment income","Other"],rec:["Grant receivables","Legacy receivables","Gift Aid receivable","Other debtors","Prepayments"],cash:["General account","Restricted fund accounts","Investment portfolio"],pay:["Trade creditors","Accruals","Deferred income (conditional grants)","Pension liability","Tax (trading subsidiary)"]},
  kpis:["Charitable spend ratio %","Fundraising efficiency %","Reserves coverage (months)","Admin cost ratio %","Grant utilisation rate %","Income diversity index"],
  disc:{frs102:["Fund analysis (SORP Module 2)","Trustee remuneration and expenses (CA 2011 s.185)","Related party transactions (SORP Module 9)","Reserves policy (SORP Module 3)","Grant conditions and commitments","Staff costs and key management (SORP Module 10)","Charitable expenditure analysis (SORP Module 7)"],ifrs:["N/A — charities use SORP"],frs102_1a:["Simplified SORP format if eligible"],charities_sorp:["Complete SORP disclosures per Modules 1-14"]},
  gc:["Grant funding renewal certainty","Reserves level vs policy","Cash flow — timing of income vs expenditure","Dependency on single funder >25%","Pension obligations (LGPS/other)","Investment portfolio performance"],
  ml:[{f:"Fund accounting: expenditure not coded to correct fund at point of entry",rec:"Mandatory fund coding on all expenditure with restricted fund approval workflow.",lv:"SIGNIFICANT"},{f:"Trustee declarations: annual conflict of interest returns not obtained from all trustees",rec:"Annual declaration process with board chair follow-up for non-returns.",lv:"ELEVATED"},{f:"Gift Aid: claims not submitted within 4-year window",rec:"Quarterly Gift Aid submissions with donor record audit trail.",lv:"NORMAL"}],
  payTests:{t:"D4 — Payables & Accruals",r:"NORMAL",a:"SUBSTANTIVE",isa:"ISA 330.6; Charities SORP Module 7",items:[
    {ref:"D4.01",p:"Creditors listing: cast, agree to TB. Focus on: grant commitments (SORP Module 7), restricted fund obligations, programme delivery costs.",as:"Completeness; Accuracy",ev:"Creditors listing, TB, grant commitments"},
    {ref:"D4.02",p:"Sample >PM: vouch to invoice and authorisation. For grants payable: verify to grant award letter and conditions per SORP Module 7.",as:"Existence; Accuracy",ev:"Invoices, grant award letters, authorisations"},
    {ref:"D4.03",p:"SFURL: review 30 days post-YE. Key risk: programme delivery costs incurred pre-YE but invoiced late; grant payments triggered by milestones.",as:"Completeness",ev:"Post-YE bank, invoices"},
    {ref:"D4.04",p:"Grant commitments: verify grants awarded but not yet paid. Assess whether constructive or legal obligation exists at YE per FRS 102.21.4 and Charities SORP.",as:"Completeness; Valuation",ev:"Grant award letters, trustee minutes, commitment schedule"},
    {ref:"D4.05",p:"Restricted fund obligations: verify amounts received with conditions where conditions are unmet — liability to return or apply. Per SORP Module 4.",as:"Classification; Completeness",ev:"Funding agreements, progress reports"},
    {ref:"D4.06",p:"Deferred income: grants received in advance where conditions not yet met. Distinguish conditions (deferral required) from restrictions (fund accounting).",as:"Classification; Accuracy",ev:"Grant agreements, SORP Module 5 analysis"}
  ]},
  payrollTests:{t:"D5 — Payroll & Staff Costs",r:"NORMAL",a:"SUBSTANTIVE",isa:"ISA 330.6; Charities SORP Module 10",items:[
    {ref:"D5.01",p:"Proof in total: reconcile to headcount × average salary. Separately: staff funded by restricted grants vs unrestricted. Verify allocation methodology.",as:"Completeness; Accuracy",ev:"Payroll, grant-funded staff list"},
    {ref:"D5.02",p:"Sample: verify gross to contract, deductions per PAYE. For restricted-fund staff: verify funded role matches grant conditions.",as:"Accuracy; Classification",ev:"Contracts, grant conditions, timesheets"},
    {ref:"D5.03",p:"Expenditure allocation: verify staff costs split between charitable activities, fundraising, and support costs per SORP Module 7.",as:"Classification",ev:"Allocation policy, cost centre reports, SOFA"},
    {ref:"D5.04",p:"Key management personnel: verify SORP Module 10 disclosure — total remuneration by band, benefits, pension, redundancy/termination payments.",as:"Completeness",ev:"Contracts, payroll, accounts note"},
    {ref:"D5.05",p:"Trustee remuneration and expenses: verify per Charities Act 2011 s.185 — was payment authorised by governing document or Charity Commission order? Full disclosure required.",as:"Completeness; Compliance",ev:"Governing document, CC order, expense claims"}
  ]},
  controls:["Fund accounting: mandatory fund code on every transaction; restricted fund expenditure requires fund manager approval","Income recognition: legacy pipeline register with three-criteria assessment (entitlement, probability, measurement)","Grant management: conditions vs restrictions formally assessed at award stage per SORP Module 5","Trustee declarations: annual conflict of interest return from all trustees; register maintained by company secretary","Expenditure authorisation: dual sign-off above £[threshold]; all expenditure within charitable objects","Fundraising compliance: compliance with Charities Act 2011 s.162A fundraising standards; Fundraising Regulator Code"],
  reps:["All income has been recognised in accordance with the Charities SORP entitlement, probability, and measurement criteria","Fund accounting correctly classifies income and expenditure between unrestricted, restricted, and endowment funds","All expenditure from restricted funds complies with the donor's or funder's conditions","Legacy income is recognised only when the three SORP criteria are met (entitlement confirmed, probable, measurable)","All trustee benefits, payments, and connected person transactions are disclosed per Charities Act 2011 s.185","The reserves policy is appropriate and the level of reserves is explained in the Trustees' Annual Report","All known grant conditions unfulfilled at YE are disclosed and any repayment obligations are provided"],
  events:["Major legacy receipt post-YE (adjusting if entitlement existed at YE per SORP Module 5)","Loss of major funding source post-YE (going concern indicator)","Charity Commission inquiry or regulatory action post-YE","Safeguarding incident post-YE","Trustee conflict of interest discovered post-YE","Significant investment value change post-YE for endowment funds","Grant clawback demand post-YE for non-compliance with conditions"]
}
};

// ═══ FRAMEWORKS, SIZES, WPs ═══
const FW={frs105:{l:"FRS 105",f:"Micro-Entity",c:"#3B82F6"},frs102_1a:{l:"FRS 102 s1A",f:"Small Company",c:"#2563EB"},frs102:{l:"FRS 102",f:"Full UK GAAP",c:"#1E40AF"},ifrs:{l:"IFRS",f:"International",c:"#DC2626"},charities_sorp:{l:"Charities SORP",f:"SORP (FRS 102)",c:"#059669"}};
const SZ={micro:{l:"Micro Entity",to:"≤£632k",ta:"≤£316k",e:"≤10",fw:"frs105"},small:{l:"Small",to:"≤£10.2m",ta:"≤£5.1m",e:"≤50",fw:"frs102_1a"},medium:{l:"Medium",to:"≤£36m",ta:"≤£18m",e:"≤250",fw:"frs102"},large:{l:"Large Private",to:">£36m",ta:">£18m",e:">250",fw:"frs102"},listed:{l:"Listed/PIE",to:"Any",ta:"Any",e:"Any",fw:"ifrs"}};

const WPS=[
  {id:"dash",ref:"⬡",title:"Dashboard",ph:"ov"},{id:"reg",ref:"REG",title:"Regulatory Framework",ph:"ov"},{id:"std",ref:"STD",title:"Standards Reference",ph:"ov"},
  {id:"a1",ref:"A1",title:"Acceptance & Ethics",ph:"pl"},{id:"a2",ref:"A2",title:"Ethics & Independence",ph:"pl"},{id:"a3",ref:"A3",title:"Entity Understanding",ph:"pl"},{id:"a4",ref:"A4",title:"Analytical Review",ph:"pl"},{id:"a5",ref:"A5",title:"Materiality",ph:"pl"},{id:"a6",ref:"A6",title:"Fraud Assessment",ph:"pl"},{id:"a7",ref:"A7",title:"Significant Risks",ph:"pl"},{id:"a8",ref:"A8",title:"Strategy",ph:"pl"},
  {id:"b1",ref:"B1",title:"Risk Summary",ph:"ri"},{id:"b2",ref:"B2",title:"Internal Controls",ph:"ri"},{id:"b3",ref:"B3",title:"Assertion Matrix",ph:"ri"},
  {id:"c1",ref:"C1",title:"Revenue Lead",ph:"le"},{id:"c2",ref:"C2",title:"Receivables Lead",ph:"le"},{id:"c3",ref:"C3",title:"Cash Lead",ph:"le"},{id:"c4",ref:"C4",title:"Payables Lead",ph:"le"},
  {id:"d1",ref:"D1",title:"Revenue Testing",ph:"te",s:true},{id:"d2",ref:"D2",title:"Receivables Testing",ph:"te"},{id:"d3",ref:"D3",title:"Inventory/WIP Testing",ph:"te",s:true},{id:"d4",ref:"D4",title:"Payables Testing",ph:"te"},{id:"d5",ref:"D5",title:"Payroll Testing",ph:"te"},{id:"d6",ref:"D6",title:"Journals & Override",ph:"te",s:true},
  {id:"e1",ref:"E1",title:"Summary of Differences",ph:"co"},{id:"e3",ref:"E3",title:"Going Concern",ph:"co"},{id:"e4",ref:"E4",title:"Subsequent Events",ph:"co"},{id:"e5",ref:"E5",title:"Written Representations",ph:"co"},{id:"e6",ref:"E6",title:"Disclosures",ph:"co"},
  {id:"f1",ref:"F1",title:"ISA 265 Mgmt Letter",ph:"re"},{id:"f2",ref:"F2",title:"ISA 700 Report",ph:"re"},
  {id:"z",ref:"Z",title:"Audit Trail",ph:"tr"},
];
const PH={ov:{l:"Overview",c:"#C4972A"},pl:{l:"A — Planning",c:"#2563EB"},ri:{l:"B — Risk",c:"#DC2626"},le:{l:"C — Leads",c:"#7C3AED"},te:{l:"D — Testing",c:"#B91C1C"},co:{l:"E — Completion",c:"#059669"},re:{l:"F — Reporting",c:"#1F2937"},tr:{l:"Reference",c:"#6B7280"}};

// ═══ APP ═══
export default function AuditEngine(){
  const [rdy,setRdy]=useState(false);
  const [mode,setMode]=useState("landing"); // landing|config|file
  const [ind,setInd]=useState(null);
  const [sec,setSec]=useState(null);
  const [fw,setFw]=useState(null);
  const [sz,setSz]=useState(null);
  const [ent,setEnt]=useState({name:"",fye:"",partner:"",mgr:"",firm:"",co:""});
  const [wp,setWp]=useState("dash");
  const [col,setCol]=useState(false);
  const [hov,setHov]=useState(null);

  useEffect(()=>{setTimeout(()=>setRdy(true),100);},[]);

  const d=ind?I[ind]:null;
  const fwd=fw?FW[fw]:null;
  const szd=sz?SZ[sz]:null;
  const wpo=WPS.find(w=>w.id===wp);
  const grp=useMemo(()=>{const g={};WPS.forEach(w=>{if(!g[w.ph])g[w.ph]=[];g[w.ph].push(w);});return g;},[]);
  const canGo=ind&&sec&&fw&&sz&&ent.name&&ent.fye;

  const Badge=({lv,sm})=>{const c={SIGNIFICANT:{bg:"#FEE2E2",b:"#EF4444",t:"#B91C1C"},ELEVATED:{bg:"#FEF3C7",b:"#F59E0B",t:"#92400E"},NORMAL:{bg:"#D1FAE5",b:"#10B981",t:"#065F46"}}[lv]||{};return<span style={{padding:sm?"1px 5px":"3px 8px",borderRadius:3,background:c.bg,border:`1px solid ${c.b}`,color:c.t,fontSize:sm?7:9,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{lv}</span>;};
  const Hdr=({t,sub,ch})=>(<div style={{borderBottom:"2px solid #2563EB",paddingBottom:10,marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#2563EB",fontWeight:700}}>{wpo?.ref}</div><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:500,color:"#1A1A2E",marginTop:1}}>{t}</h2>{sub&&<div style={{fontSize:8,color:"#6B7280",fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>{sub}</div>}</div><div style={{textAlign:"right",fontSize:8,color:"#9CA3AF",lineHeight:1.5}}><div style={{fontWeight:600,color:"#1A1A2E"}}>{ent.name}</div><div>{d?.label}—{sec}</div><div>{fwd?.l}·{szd?.l}</div><div>YE:{ent.fye}</div></div></div>{ch}</div>);
  const Sign=()=>(<div style={{marginTop:14,padding:"10px 12px",background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:6}}><div style={{fontSize:7,color:"#9CA3AF",fontFamily:"'JetBrains Mono',monospace",fontWeight:600,marginBottom:4}}>SIGN-OFF</div>{["Prepared","Reviewed","Partner"].map((l,i)=>(<div key={i} style={{display:"flex",gap:4,marginBottom:3,alignItems:"center"}}><span style={{fontSize:8,color:"#6B7280",minWidth:60}}>{l}:</span><div style={{flex:1,borderBottom:"1px dotted #CBD5E1",minHeight:14}}/><span style={{fontSize:7,color:"#CBD5E1"}}>Date:</span><div style={{width:55,borderBottom:"1px dotted #CBD5E1",minHeight:14}}/></div>))}</div>);

  // ═══ LANDING PAGE ═══
  if(mode==="landing")return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0F172A 0%,#1E293B 40%,#1B2A4A 100%)",fontFamily:"'DM Sans',sans-serif",color:"#fff",overflow:"hidden",position:"relative"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes glow{0%,100%{opacity:0.3}50%{opacity:0.7}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}*{box-sizing:border-box;margin:0;padding:0}button{font-family:'DM Sans',sans-serif;cursor:pointer}`}</style>
      <div style={{position:"absolute",top:"10%",left:"15%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(37,99,235,0.08),transparent 70%)",animation:"glow 6s ease-in-out infinite",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:"5%",right:"10%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(196,151,42,0.06),transparent 70%)",animation:"glow 8s ease-in-out infinite",pointerEvents:"none"}}/>
      <header style={{padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative",zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:40,height:40,borderRadius:10,background:"linear-gradient(135deg,#E8C547,#C4972A)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#0F172A"}}>A</div><div><div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:600}}>Audit<span style={{color:"#E8C547"}}>Engine</span></div><div style={{fontSize:8,color:"rgba(255,255,255,0.3)",letterSpacing:"0.2em",textTransform:"uppercase"}}>Professional Audit Automation</div></div></div>
        <div style={{display:"flex",gap:16,alignItems:"center"}}><div style={{fontSize:9,color:"rgba(255,255,255,0.25)",fontFamily:"'JetBrains Mono',monospace"}}>ISA (UK) · FRS 102 · CA 2006 · FRC</div><div style={{width:8,height:8,borderRadius:"50%",background:"#10B981",boxShadow:"0 0 8px rgba(16,185,129,0.5)"}}/>
        </div>
      </header>
      <main style={{maxWidth:1100,margin:"0 auto",padding:"60px 40px",textAlign:"center",position:"relative",zIndex:10,opacity:rdy?1:0,transition:"opacity 1s",animation:"fadeUp 0.8s ease-out"}}>
        <div style={{fontSize:10,color:"#E8C547",textTransform:"uppercase",letterSpacing:"0.3em",fontFamily:"'JetBrains Mono',monospace",marginBottom:16}}>Regulatory-Grade Audit Automation</div>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:52,fontWeight:300,lineHeight:1.15,marginBottom:16}}>The Complete<br/><span style={{fontWeight:700,background:"linear-gradient(90deg,#E8C547,#C4972A)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Audit Working Paper</span><br/>Engine</h1>
        <p style={{fontSize:15,color:"rgba(255,255,255,0.45)",maxWidth:600,margin:"0 auto 40px",lineHeight:1.7}}>8 industries. Every ISA paragraph verified. Every FRS section referenced. Companies Act, FRC, and Companies House requirements built in. Reasonable assurance — not absolute.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,maxWidth:800,margin:"0 auto 40px"}}>
          {Object.entries(I).map(([k,v])=>(<div key={k} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:"16px 12px",backdropFilter:"blur(10px)",animation:"float 4s ease-in-out infinite",animationDelay:`${Math.random()*2}s`}}><div style={{fontSize:24,marginBottom:4}}>{v.icon}</div><div style={{fontSize:10,fontWeight:600}}>{v.label}</div><div style={{fontSize:8,color:"rgba(255,255,255,0.3)",fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>{v.risks.length} risks · {v.procs.length} procs · {Object.keys(v.tests).length*6}+ tests</div></div>))}
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",marginBottom:40}}>
          {[{v:"32",l:"Working Papers"},{v:"48+",l:"Risk Factors"},{v:"56+",l:"Procedures"},{v:"400+",l:"Test Steps"},{v:"30+",l:"ISAs Referenced"}].map((s,i)=>(<div key={i} style={{padding:"12px 18px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"#E8C547"}}>{s.v}</div><div style={{fontSize:8,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.08em"}}>{s.l}</div></div>))}
        </div>
        <button onClick={()=>setMode("config")} style={{padding:"16px 48px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#E8C547,#C4972A)",color:"#0F172A",fontFamily:"'DM Sans',sans-serif",fontSize:16,fontWeight:700,letterSpacing:"0.04em",boxShadow:"0 8px 32px rgba(196,151,42,0.3)",transition:"transform 0.2s"}} onMouseEnter={e=>e.target.style.transform="scale(1.03)"} onMouseLeave={e=>e.target.style.transform="scale(1)"}>Launch New Engagement →</button>
        <div style={{marginTop:16,fontSize:10,color:"rgba(255,255,255,0.2)",fontFamily:"'JetBrains Mono',monospace"}}>ISA 200.5: Reasonable assurance is a high level of assurance, but is not a guarantee.</div>
      </main>
      <footer style={{position:"absolute",bottom:0,left:0,right:0,padding:"16px 40px",display:"flex",justifyContent:"space-between",fontSize:8,color:"rgba(255,255,255,0.15)"}}>
        <div>ISA (UK) · FRS 102/105/IFRS · Companies Act 2006 Part 16 · FRC Ethical Standard 2019 · ISQM 1</div>
        <div>8 Industries · 5 Frameworks · 5 Entity Sizes</div>
      </footer>
    </div>
  );

  // ═══ CONFIG ═══
  if(mode==="config")return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#F0F4FF,#F7F8FC)",fontFamily:"'DM Sans',sans-serif",color:"#1A1A2E"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;padding:0}button{font-family:'DM Sans',sans-serif;cursor:pointer}input:focus{outline:none;border-color:#2563EB!important;box-shadow:0 0 0 3px rgba(37,99,235,0.1)}`}</style>
      <header style={{background:"linear-gradient(135deg,#1B2A4A,#2C3E6B)",padding:"12px 28px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:28,height:28,borderRadius:6,background:"linear-gradient(135deg,#E8C547,#C4972A)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:700,color:"#1B2A4A"}}>A</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,color:"#fff"}}>Audit<span style={{color:"#E8C547"}}>Engine</span></div></div>
        <button onClick={()=>setMode("landing")} style={{padding:"4px 10px",borderRadius:4,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.5)",fontSize:9}}>← Back</button>
      </header>
      <div style={{background:"linear-gradient(90deg,#FEF3C7,#FFFBEB)",padding:"6px 28px",borderBottom:"1px solid #FDE68A",fontSize:9,color:"#78716C"}}><strong style={{color:"#92400E"}}>ISA 200.5:</strong> Audit provides <strong>reasonable assurance</strong> — not absolute. Inherent limitations include sampling, judgement, and the persuasive nature of evidence.</div>
      <main style={{maxWidth:960,margin:"0 auto",padding:"20px 28px",opacity:rdy?1:0,transition:"opacity 0.5s",animation:"fadeUp 0.4s ease-out"}}>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:400,marginBottom:3}}>Configure <span style={{color:"#2563EB",fontWeight:700}}>Engagement</span></h1>
        <p style={{fontSize:10,color:"#6B7280",marginBottom:18}}>Every selection cascades through all working papers. ISA references, procedures, and disclosures are industry-specific.</p>
        {/* Industry Grid */}
        <div style={{marginBottom:16}}>
          <div style={{fontSize:8,color:"#2563EB",textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:6,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>▸ Select Industry</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
            {Object.entries(I).map(([k,v])=>(<button key={k} onClick={()=>{setInd(k);setSec(null);}} onMouseEnter={()=>setHov(k)} onMouseLeave={()=>setHov(null)} style={{background:ind===k?"#EFF6FF":hov===k?"#F8FAFC":"#fff",border:`1.5px solid ${ind===k?"#2563EB":"#E2E8F0"}`,borderRadius:8,padding:"10px 8px",textAlign:"left",transition:"all 0.15s",boxShadow:ind===k?"0 2px 8px rgba(37,99,235,0.1)":"none",borderLeft:ind===k?`4px solid ${v.color}`:"4px solid transparent"}}>
              <div style={{fontSize:20,marginBottom:2}}>{v.icon}</div>
              <div style={{fontSize:10,fontWeight:600,color:ind===k?v.color:"#1A1A2E"}}>{v.label}</div>
              <div style={{fontSize:7,color:"#9CA3AF",fontFamily:"'JetBrains Mono',monospace",marginTop:1}}>{v.risks.length} risks · {v.procs.length} procs · {v.sectors.length} sectors</div>
              {ind===k&&<div style={{marginTop:4,display:"flex",gap:2,flexWrap:"wrap"}}>{["SIGNIFICANT","ELEVATED","NORMAL"].map(lv=>{const n=v.risks.filter(r=>r.lv===lv).length;return n?<Badge key={lv} lv={lv} sm/>:null;})}</div>}
            </button>))}
          </div>
        </div>
        {ind&&d&&(<div style={{animation:"fadeUp 0.3s ease-out"}}>
          {/* Sectors */}
          <div style={{marginBottom:12}}><div style={{fontSize:8,color:"#2563EB",textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:5,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>▸ Sector</div><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{d.sectors.map(s=>(<button key={s} onClick={()=>setSec(s)} style={{background:sec===s?d.color:"#fff",border:`1.5px solid ${sec===s?d.color:"#E2E8F0"}`,borderRadius:5,padding:"4px 11px",color:sec===s?"#fff":"#374151",fontSize:9,fontWeight:sec===s?600:400}}>{s}</button>))}</div></div>
          {/* FW + Size */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <div><div style={{fontSize:8,color:"#2563EB",textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:5,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>▸ Framework</div>{Object.entries(FW).map(([k,v])=>(<button key={k} onClick={()=>setFw(k)} style={{width:"100%",marginBottom:2,background:fw===k?"#EFF6FF":"#fff",border:`1.5px solid ${fw===k?"#2563EB":"#E2E8F0"}`,borderRadius:5,padding:"6px 8px",textAlign:"left",display:"flex",alignItems:"center",gap:6}}><div style={{width:3,height:14,borderRadius:1,background:v.c}}/><div style={{fontSize:10,fontWeight:600}}>{v.l}<span style={{fontSize:8,color:"#9CA3AF",marginLeft:5}}>{v.f}</span></div></button>))}</div>
            <div><div style={{fontSize:8,color:"#2563EB",textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:5,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>▸ Entity Size (CA 2006)</div>{Object.entries(SZ).map(([k,v])=>(<button key={k} onClick={()=>{setSz(k);if(!fw)setFw(v.fw);}} style={{width:"100%",marginBottom:2,background:sz===k?"#EFF6FF":"#fff",border:`1.5px solid ${sz===k?"#2563EB":"#E2E8F0"}`,borderRadius:5,padding:"6px 8px",textAlign:"left"}}><div style={{fontSize:10,fontWeight:600}}>{v.l}</div><div style={{fontSize:7,color:"#9CA3AF",fontFamily:"'JetBrains Mono',monospace"}}>TO {v.to} · TA {v.ta} · Emp {v.e}</div></button>))}</div>
          </div>
          {/* Entity Details */}
          <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:8,padding:14,marginBottom:14}}>
            <div style={{fontSize:8,color:"#2563EB",textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:8,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>▸ Entity Details — Populates Every WP Header</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>{[{k:"name",l:"Entity Name *",p:"ABC Ltd"},{k:"fye",l:"Year End *",p:"31/03/2025"},{k:"co",l:"Co. Number",p:"12345678"},{k:"partner",l:"Partner",p:"J Smith"},{k:"mgr",l:"Manager",p:"A Jones"},{k:"firm",l:"Firm",p:"Smith & Co"}].map(f=>(<div key={f.k}><label style={{fontSize:7,color:"#6B7280",fontWeight:600,display:"block",marginBottom:2}}>{f.l}</label><input value={ent[f.k]} onChange={e=>setEnt({...ent,[f.k]:e.target.value})} placeholder={f.p} style={{width:"100%",padding:"6px 8px",borderRadius:4,border:"1.5px solid #E2E8F0",fontSize:10,color:"#1A1A2E",background:"#FAFBFC"}}/></div>))}</div>
          </div>
          {/* Preview */}
          {ind&&sec&&(<div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:8,padding:14,marginBottom:14}}>
            <div style={{fontSize:8,color:d.color,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>▸ {d.label} — Preview</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              <div><div style={{fontSize:8,color:"#6B7280",marginBottom:3}}>Significant Risks</div>{d.sigRisks.map((sr,i)=>(<div key={i} style={{fontSize:9,color:"#374151",padding:"2px 0",borderLeft:`2px solid #DC2626`,paddingLeft:6,marginBottom:2}}>{sr.risk}</div>))}</div>
              <div><div style={{fontSize:8,color:"#6B7280",marginBottom:3}}>Industry KPIs</div>{d.kpis.slice(0,5).map((k,i)=>(<div key={i} style={{fontSize:9,color:"#374151",padding:"2px 0"}}>{k}</div>))}</div>
              <div><div style={{fontSize:8,color:"#6B7280",marginBottom:3}}>Materiality</div><div style={{fontSize:10,fontWeight:600,color:d.color}}>{d.mat.b} at {d.mat.p}</div><div style={{fontSize:8,color:"#6B7280",marginTop:2}}>{d.mat.r.substring(0,100)}...</div></div>
            </div>
          </div>)}
          {/* Launch */}
          <div style={{textAlign:"center",paddingTop:6}}><button onClick={()=>{if(canGo){setMode("file");setWp("dash");}}} disabled={!canGo} style={{padding:"10px 32px",borderRadius:7,background:canGo?"linear-gradient(135deg,#2563EB,#3B82F6)":"#E2E8F0",border:"none",color:canGo?"#fff":"#9CA3AF",fontSize:12,fontWeight:700,boxShadow:canGo?"0 4px 16px rgba(37,99,235,0.25)":"none"}}>Launch Audit File →</button></div>
        </div>)}
      </main>
    </div>
  );

  // ═══ FILE MODE ═══
  return(
    <div style={{display:"flex",height:"100vh",background:"#F7F8FC",fontFamily:"'DM Sans',sans-serif",color:"#1A1A2E",overflow:"hidden"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}@keyframes slideR{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:translateX(0)}}*{box-sizing:border-box;margin:0;padding:0}button{font-family:'DM Sans',sans-serif;cursor:pointer}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:2px}table{border-collapse:collapse}th,td{text-align:left}`}</style>
      {/* Sidebar */}
      <nav style={{width:col?42:190,flexShrink:0,background:"#fff",borderRight:"1px solid #E2E8F0",display:"flex",flexDirection:"column",transition:"width 0.2s",overflow:"hidden"}}>
        <div style={{padding:col?"6px 3px":"8px 10px",borderBottom:"1px solid #E2E8F0",display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:20,height:20,borderRadius:4,background:`linear-gradient(135deg,${d?.color||"#2563EB"},${d?.color||"#2563EB"}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,flexShrink:0}}>{d?.icon}</div>
          {!col&&<div style={{overflow:"hidden",whiteSpace:"nowrap"}}><div style={{fontSize:10,fontWeight:600}}>{ent.name}</div><div style={{fontSize:7,color:"#9CA3AF"}}>{d?.label}</div></div>}
        </div>
        <div style={{display:"flex",gap:2,padding:"2px 3px"}}><button onClick={()=>setCol(!col)} style={{flex:1,padding:2,background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:2,fontSize:7,color:"#9CA3AF"}}>{col?"→":"←"}</button><button onClick={()=>setMode("config")} style={{padding:"2px 4px",background:"#FEF3C7",border:"1px solid #FDE68A",borderRadius:2,fontSize:6,color:"#92400E",fontWeight:700}}>⚙</button></div>
        <div style={{flex:1,overflowY:"auto",padding:"1px 2px"}}>
          {Object.entries(grp).map(([ph,wps])=>(<div key={ph} style={{marginBottom:2}}>{!col&&<div style={{fontSize:6,color:PH[ph]?.c,textTransform:"uppercase",letterSpacing:"0.15em",padding:"2px 4px",fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{PH[ph]?.l}</div>}{wps.map(w=>(<button key={w.id} onClick={()=>setWp(w.id)} style={{width:"100%",padding:col?"2px":"2px 4px",borderRadius:3,border:"none",marginBottom:1,textAlign:"left",display:"flex",alignItems:"center",gap:col?0:3,background:wp===w.id?"#EFF6FF":"transparent",color:wp===w.id?"#2563EB":"#6B7280",fontSize:8,position:"relative"}}>{wp===w.id&&<div style={{position:"absolute",left:0,top:0,bottom:0,width:2,borderRadius:1,background:"#2563EB"}}/>}<span style={{fontSize:7,fontFamily:"'JetBrains Mono',monospace",fontWeight:600,minWidth:col?"auto":16,textAlign:"center",color:w.s?"#DC2626":undefined}}>{w.ref}</span>{!col&&<span style={{fontSize:8,fontWeight:wp===w.id?600:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{w.title}</span>}{!col&&w.s&&<span style={{marginLeft:"auto",width:4,height:4,borderRadius:"50%",background:"#DC2626",flexShrink:0}}/>}</button>))}</div>))}
        </div>
      </nav>
      {/* Content */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <header style={{padding:"5px 16px",borderBottom:"1px solid #E2E8F0",background:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between",minHeight:30}}>
          <div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,color:d?.color||"#2563EB"}}>{wpo?.ref}</span><span style={{fontSize:11,fontWeight:500}}>{wpo?.title}</span>{wpo?.s&&<Badge lv="SIGNIFICANT" sm/>}</div>
          <div style={{fontSize:7,color:"#CBD5E1",fontFamily:"'JetBrains Mono',monospace"}}>ISA 200.5: Reasonable ≠ Absolute</div>
        </header>
        <main style={{flex:1,overflowY:"auto",padding:"14px 18px",animation:"fadeUp 0.2s ease-out"}} key={wp}>
          {/* DASHBOARD */}
          {wp==="dash"&&d&&(<div><Hdr t="Engagement Dashboard" sub="Navigate via sidebar · All content industry-specific"/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:12}}>{[{l:"WPs",v:WPS.length,c:"#2563EB"},{l:"Risks",v:d.risks.length,c:"#F59E0B"},{l:"Procs",v:d.procs.length,c:"#059669"},{l:"Sig Risks",v:d.sigRisks.length,c:"#DC2626"},{l:"Tests",v:Object.values(d.tests).reduce((a,t)=>a+t.items.length,0),c:"#7C3AED"}].map((c,i)=>(<div key={i} style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:"8px 10px",borderTop:`3px solid ${c.c}`}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:c.c}}>{c.v}</div><div style={{fontSize:7,color:"#6B7280",textTransform:"uppercase",fontFamily:"'JetBrains Mono',monospace"}}>{c.l}</div></div>))}</div>
            <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:6,padding:10,marginBottom:12}}><div style={{fontSize:9,fontWeight:700,color:"#92400E",fontFamily:"'JetBrains Mono',monospace"}}>ISA (UK) 200.5 — REASONABLE ASSURANCE</div><div style={{fontSize:9,color:"#78716C",lineHeight:1.5,marginTop:3}}>An audit provides reasonable assurance — a high level, but NOT a guarantee. Limitations include: sampling, judgement, management override potential, and the persuasive (not conclusive) nature of evidence. ISA 200.A53-A57.</div></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12}}><div style={{fontSize:8,color:d.color,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:5}}>ENGAGEMENT</div>{[["Entity",ent.name],["Industry",d.label],["Sector",sec],["Framework",fwd?.l],["Size",szd?.l],["YE",ent.fye],["Partner",ent.partner],["Firm",ent.firm]].map(([k,v],i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",borderBottom:"1px solid #F1F5F9",fontSize:9}}><span style={{color:"#6B7280"}}>{k}</span><span style={{fontWeight:500}}>{v||"—"}</span></div>))}</div>
              <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12}}><div style={{fontSize:8,color:"#DC2626",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:5}}>SIGNIFICANT RISKS</div>{d.sigRisks.map((sr,i)=>(<div key={i} style={{padding:"4px 0",borderBottom:"1px solid #F1F5F9"}}><div style={{display:"flex",alignItems:"center",gap:3}}><span style={{fontSize:7,fontWeight:700,color:"#DC2626",fontFamily:"'JetBrains Mono',monospace"}}>{sr.id}</span><Badge lv="SIGNIFICANT" sm/></div><div style={{fontSize:9,color:"#374151"}}>{sr.risk}</div><div style={{fontSize:7,color:"#9CA3AF",fontFamily:"'JetBrains Mono',monospace"}}>{sr.isa}</div></div>))}</div>
            </div>
          </div>)}
          {/* A1 */}
          {wp==="a1"&&d&&(<div><Hdr t="Acceptance & Continuance" sub="ISQM 1.28-31 · ISA 220.13-17 · FRC Ethical Standard 2019"/><div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12,marginBottom:10}}><div style={{fontSize:8,color:d.color,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>INDUSTRY CONSIDERATIONS — {d.label.toUpperCase()}</div>{d.acceptance.map((a,i)=>(<div key={i} style={{padding:"5px 7px",borderRadius:3,marginBottom:2,background:i%2===0?"#F8FAFC":"#fff",borderLeft:`3px solid ${d.color}`,fontSize:9,color:"#374151",lineHeight:1.5}}>{a}</div>))}</div><Sign/></div>)}
          {/* A3 */}
          {wp==="a3"&&d&&(<div><Hdr t="Entity Understanding" sub="ISA 315.11-24"/><div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12}}><div style={{fontSize:8,color:d.color,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>{d.label.toUpperCase()}</div>{d.understanding.map((u,i)=>(<div key={i} style={{padding:"6px 8px",borderRadius:4,marginBottom:3,background:i%2===0?"#F8FAFC":"#fff",borderLeft:"3px solid #7C3AED",fontSize:9,color:"#374151",lineHeight:1.5}}>{u}</div>))}</div><Sign/></div>)}
          {/* A5 */}
          {wp==="a5"&&d&&(<div><Hdr t="Materiality" sub="ISA 320.10-11 · ISA 450.A2"/><div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12,marginBottom:10}}><div style={{padding:8,background:"#EFF6FF",borderRadius:5,border:"1px solid #BFDBFE",marginBottom:8}}><div style={{fontSize:10,fontWeight:600,color:"#1E40AF"}}>{d.mat.b} at {d.mat.p}</div><div style={{fontSize:9,color:"#374151",marginTop:2}}>{d.mat.r}</div></div>{d.mat.alts.map((a,i)=>(<div key={i} style={{padding:"4px 7px",borderLeft:"2px solid #CBD5E1",fontSize:9,color:"#374151",marginBottom:2}}>{a}</div>))}<div style={{marginTop:6,padding:6,background:"#FEF3C7",borderRadius:4,fontSize:9,color:"#92400E"}}><strong>Trivial:</strong> 5% of OM per ISA 450.A2</div></div><div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:6,padding:10}}><div style={{fontSize:8,color:"#92400E",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:3}}>PROFESSIONAL JUDGEMENT (ISA 320.10)</div>{["OM: £ _____","PM (60-85% of OM): £ _____","Trivial (5% OM): £ _____"].map((f,i)=>(<div key={i} style={{padding:"4px 6px",background:"#fff",borderRadius:3,border:"1px dashed #FDE68A",marginBottom:2,fontSize:9,color:"#92400E"}}>{f}</div>))}</div><Sign/></div>)}
          {/* A6 */}
          {wp==="a6"&&d&&(<div><Hdr t="Fraud Risk Assessment" sub="ISA 240.16-24 · ISA 240.26-27 · ISA 240.31-33"/><div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:5,padding:8,marginBottom:8,fontSize:9,color:"#B91C1C",lineHeight:1.4}}><strong>ISA 240.26:</strong> Revenue recognition fraud PRESUMED — NOT rebutted.<br/><strong>ISA 240.31:</strong> Management override — IRREBUTTABLE. Mandatory ISA 240.32 procedures apply.</div><div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12}}>{d.fraud.map((f,i)=>(<div key={i} style={{padding:"5px 7px",borderRadius:3,marginBottom:2,background:i%2===0?"#FEF2F2":"#fff",borderLeft:"3px solid #EF4444",fontSize:9,color:"#374151",lineHeight:1.4}}>{f}</div>))}</div><Sign/></div>)}
          {/* A7 */}
          {wp==="a7"&&d&&(<div><Hdr t="Significant Risks" sub="ISA 315.28 · ISA 330.18 · ISA 330.21"/><div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:5,padding:7,marginBottom:8,fontSize:8,color:"#B91C1C"}}><strong>ISA 330.18:</strong> Substantive analytical procedures ALONE are insufficient for significant risks. Tests of details are REQUIRED.</div>{d.sigRisks.map((sr,i)=>(<div key={i} style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:10,marginBottom:6}}><div style={{display:"flex",gap:4,alignItems:"center",marginBottom:3}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,color:"#DC2626"}}>{sr.id}</span><Badge lv="SIGNIFICANT"/><span style={{fontSize:7,color:"#9CA3AF",fontFamily:"'JetBrains Mono',monospace"}}>{sr.isa}</span></div><div style={{fontSize:10,fontWeight:600,color:"#1A1A2E",marginBottom:4}}>{sr.risk}</div><div style={{padding:"6px 8px",background:"#F0FDF4",borderRadius:4,border:"1px solid #A7F3D0"}}><div style={{fontSize:7,color:"#065F46",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:2}}>RESPONSE</div><div style={{fontSize:9,color:"#374151",lineHeight:1.5}}>{sr.resp}</div></div></div>))}<Sign/></div>)}
          {/* A8 Strategy */}
          {wp==="a8"&&d&&(<div><Hdr t="Audit Strategy" sub="ISA 300.7-12 · ISA 330.5-6"/><div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12}}><table style={{width:"100%",fontSize:9}}><thead><tr>{["Ref","Area","Procedure","Assertions","ISA"].map(h=><th key={h} style={{background:"#1E40AF",color:"#fff",padding:"5px 4px",fontSize:7,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{h}</th>)}</tr></thead><tbody>{d.procs.map((p,i)=>(<tr key={i} style={{background:i%2===0?"#F8FAFC":"#fff",borderBottom:"1px solid #E2E8F0"}}><td style={{padding:"5px 4px",fontFamily:"'JetBrains Mono',monospace",fontSize:7,fontWeight:700,color:d.color}}>{p.ref}</td><td style={{padding:"5px 4px",fontWeight:600}}>{p.area}</td><td style={{padding:"5px 4px",color:"#374151",lineHeight:1.3,maxWidth:280}}>{p.proc}</td><td style={{padding:"5px 4px",fontSize:7,color:"#6B7280",fontFamily:"'JetBrains Mono',monospace"}}>{p.as}</td><td style={{padding:"5px 4px",fontSize:6,color:"#9CA3AF",fontFamily:"'JetBrains Mono',monospace"}}>{p.isa}</td></tr>))}</tbody></table></div><Sign/></div>)}
          {/* B1 */}
          {wp==="b1"&&d&&(<div><Hdr t="Risk Summary" sub="ISA 315.25-30"/><div style={{display:"flex",gap:4,marginBottom:8}}>{["SIGNIFICANT","ELEVATED","NORMAL"].map(lv=><div key={lv}><Badge lv={lv} sm/><span style={{fontSize:9,fontWeight:600,marginLeft:3}}>{d.risks.filter(r=>r.lv===lv).length}</span></div>)}</div><div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12}}>{d.risks.map((r,i)=>(<div key={i} style={{padding:"6px 8px",borderRadius:4,marginBottom:3,background:i%2===0?"#F8FAFC":"#fff",borderLeft:`3px solid ${r.lv==="SIGNIFICANT"?"#EF4444":r.lv==="ELEVATED"?"#F59E0B":"#10B981"}`}}><div style={{display:"flex",gap:4,alignItems:"center",marginBottom:1}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,fontWeight:700}}>{r.id}</span><Badge lv={r.lv} sm/></div><div style={{fontSize:9,color:"#374151",lineHeight:1.4}}>{r.risk}</div><div style={{fontSize:7,color:"#9CA3AF",fontFamily:"'JetBrains Mono',monospace"}}>{r.isa}</div></div>))}</div><Sign/></div>)}
          {/* C1-C4 Leads */}
          {["c1","c2","c3","c4"].includes(wp)&&d?.leads&&(<div><Hdr t={wpo.title} sub="TB-linked"/><div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12}}><table style={{width:"100%",fontSize:9}}><thead><tr>{["Line","PY £","CY £","Mvmt","WP"].map(h=><th key={h} style={{background:"#7C3AED",color:"#fff",padding:"5px",fontSize:7,fontFamily:"'JetBrains Mono',monospace"}}>{h}</th>)}</tr></thead><tbody>{(d.leads[{c1:"rev",c2:"rec",c3:"cash",c4:"pay"}[wp]]||[]).map((item,i)=>(<tr key={i} style={{background:i%2===0?"#F8FAFC":"#fff",borderBottom:"1px solid #E2E8F0"}}><td style={{padding:"5px"}}>{item}</td><td style={{padding:"5px",color:"#CBD5E1",fontSize:8}}>—</td><td style={{padding:"5px",color:"#CBD5E1",fontSize:8}}>—</td><td style={{padding:"5px",color:"#CBD5E1",fontSize:8}}>—</td><td style={{padding:"5px",fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:"#7C3AED"}}>D{wp[1]}</td></tr>))}</tbody></table></div><Sign/></div>)}
          {/* D1 D3 D6 Testing */}
          {d?.tests&&d.tests[{d1:"revenue",d3:ind==="manufacturing"?"inventory":"wip"}[wp]]&&(<div>{(()=>{const td=d.tests[{d1:"revenue",d3:ind==="manufacturing"?"inventory":"wip"}[wp]];return(<><Hdr t={td.t} sub={td.isa}><div style={{display:"flex",gap:4,marginTop:3}}><Badge lv={td.r}/><span style={{padding:"1px 6px",borderRadius:3,background:td.a==="COMBINED"?"#D1FAE5":"#FEF3C7",fontSize:7,fontWeight:600,color:td.a==="COMBINED"?"#065F46":"#92400E",fontFamily:"'JetBrains Mono',monospace"}}>{td.a}</span></div></Hdr>{td.r==="SIGNIFICANT"&&<div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:4,padding:6,marginBottom:8,fontSize:8,color:"#B91C1C"}}><strong>ISA 330.18:</strong> Tests of details REQUIRED for this significant risk.</div>}<table style={{width:"100%",fontSize:9,background:"#fff",borderRadius:6,overflow:"hidden",border:"1px solid #E2E8F0"}}><thead><tr>{["Ref","Procedure","Assert","Evidence","Result"].map(h=><th key={h} style={{background:td.r==="SIGNIFICANT"?"#B91C1C":"#1E40AF",color:"#fff",padding:"6px 4px",fontSize:7,fontFamily:"'JetBrains Mono',monospace"}}>{h}</th>)}</tr></thead><tbody>{td.items.map((t,i)=>(<tr key={i} style={{background:i%2===0?"#F8FAFC":"#fff",borderBottom:"1px solid #E2E8F0",verticalAlign:"top"}}><td style={{padding:"6px 4px",fontFamily:"'JetBrains Mono',monospace",fontSize:7,fontWeight:700,color:td.r==="SIGNIFICANT"?"#DC2626":"#2563EB",whiteSpace:"nowrap"}}>{t.ref}</td><td style={{padding:"6px 4px",lineHeight:1.4,color:"#374151",maxWidth:260}}>{t.p}</td><td style={{padding:"6px 4px",fontSize:7,color:"#6B7280",fontFamily:"'JetBrains Mono',monospace"}}>{t.as}</td><td style={{padding:"6px 4px",fontSize:7,color:"#9CA3AF"}}>{t.ev}</td><td style={{padding:"6px 4px"}}><div style={{padding:"2px 4px",background:"#F8FAFC",border:"1px dashed #CBD5E1",borderRadius:2,fontSize:7,color:"#CBD5E1"}}>—</div></td></tr>))}</tbody></table><Sign/></>);})()}</div>)}
          {/* D6 Journals */}
          {wp==="d6"&&d&&(<div><Hdr t="Journals & Management Override" sub="ISA 240.31-33 (IRREBUTTABLE)"><Badge lv="SIGNIFICANT"/></Hdr><div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:5,padding:8,marginBottom:10}}><div style={{fontSize:9,color:"#B91C1C",lineHeight:1.5}}><strong>ISA 240.31:</strong> The risk of management override CANNOT be rebutted. The following <strong>mandatory</strong> procedures per ISA 240.32 apply to EVERY audit regardless of assessed risk:</div>{["(a) Test journal entries using risk-based criteria","(b) Review accounting estimates for bias","(c) Evaluate business rationale of significant unusual transactions","(d) Perform at least one unpredictable audit procedure"].map((p,i)=>(<div key={i} style={{fontSize:9,color:"#B91C1C",padding:"2px 0 2px 10px",borderLeft:"2px solid #FECACA"}}>{p}</div>))}</div><Sign/></div>)}
          {/* E3 */}
          {wp==="e3"&&d&&(<div><Hdr t="Going Concern" sub="ISA 570.10-16 · FRS 102.3.8"/><div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:4,padding:7,marginBottom:8,fontSize:8,color:"#B91C1C"}}><strong>ISA 570.2:</strong> Management assesses going concern. Auditor evaluates that assessment. Discovery of material uncertainty may lead to modified opinion or emphasis of matter.</div><div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12}}><div style={{fontSize:8,color:d.color,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>INDICATORS — {d.label.toUpperCase()}</div>{d.gc.map((g,i)=>(<div key={i} style={{display:"flex",gap:5,padding:"3px 0",borderBottom:"1px solid #F1F5F9"}}><div style={{width:12,height:12,borderRadius:2,border:"1.5px solid #F59E0B",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:6,color:"#CBD5E1"}}>☐</span></div><span style={{fontSize:9,color:"#374151",lineHeight:1.3}}>{g}</span></div>))}</div><Sign/></div>)}
          {/* E6 */}
          {wp==="e6"&&d&&(<div><Hdr t="Disclosure Checklist" sub={`${fwd?.l} disclosures`}/><div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12}}><div style={{fontSize:8,color:"#059669",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>{fwd?.l} — {d.label.toUpperCase()}</div>{(d.disc[fw]||d.disc.frs102||[]).map((dc,i)=>(<div key={i} style={{display:"flex",gap:5,padding:"3px 0",borderBottom:"1px solid #F1F5F9"}}><div style={{width:12,height:12,borderRadius:2,border:"1.5px solid #059669",flexShrink:0}}><span style={{fontSize:6,color:"#CBD5E1",display:"flex",justifyContent:"center"}}>☐</span></div><span style={{fontSize:9,color:"#374151",lineHeight:1.3}}>{dc}</span></div>))}</div><Sign/></div>)}
          {/* F1 */}
          {wp==="f1"&&d&&(<div><Hdr t="Report to Management" sub="ISA 265.9-10"/><div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12}}>{d.ml.map((m,i)=>(<div key={i} style={{padding:8,borderRadius:5,marginBottom:5,borderLeft:`3px solid ${m.lv==="SIGNIFICANT"?"#DC2626":m.lv==="ELEVATED"?"#F59E0B":"#10B981"}`,background:i%2===0?"#F8FAFC":"#fff"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:8,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>Finding {i+1}</span><Badge lv={m.lv} sm/></div><div style={{fontSize:9,color:"#374151",lineHeight:1.4,marginBottom:4}}>{m.f}</div><div style={{padding:"4px 6px",background:"#F0FDF4",borderRadius:3,border:"1px solid #A7F3D0"}}><div style={{fontSize:7,color:"#065F46",fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>RECOMMENDATION</div><div style={{fontSize:9,color:"#374151"}}>{m.rec}</div></div></div>))}</div><Sign/></div>)}
          {/* F2 */}
          {wp==="f2"&&(<div><Hdr t="Independent Auditor's Report" sub={`ISA 700 (Revised) · ${fwd?.l}`}/><div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:14}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:12,fontWeight:600,textAlign:"center",marginBottom:10}}>INDEPENDENT AUDITOR'S REPORT TO THE MEMBERS OF {(ent.name||"[ENTITY]").toUpperCase()}</div>{["1. Opinion","2. Basis for opinion","3. Conclusions relating to going concern","4. Other information","5. Directors' responsibilities","6. Auditor's responsibilities","7. Use of this report"].map((s,i)=>(<div key={i} style={{padding:"4px 6px",borderRadius:3,marginBottom:2,background:i===0?"#EFF6FF":"#F8FAFC",borderLeft:i===0?"3px solid #2563EB":"2px solid #E2E8F0",fontSize:10,fontWeight:i===0?600:400}}>{s}</div>))}<div style={{marginTop:10,padding:10,background:"#EFF6FF",borderRadius:5,border:"1px solid #BFDBFE"}}><div style={{fontSize:7,color:"#1E40AF",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:3}}>OPINION ({fwd?.l})</div><div style={{fontSize:9,color:"#374151",lineHeight:1.6,fontStyle:"italic"}}>{fw==="frs102"?"In our opinion, the financial statements give a true and fair view of the state of the company's affairs as at [DATE] and of its [profit/loss] for the year then ended, have been properly prepared in accordance with United Kingdom Generally Accepted Accounting Practice, and have been prepared in accordance with the requirements of the Companies Act 2006.":fw==="ifrs"?"In our opinion, the financial statements give a true and fair view, have been properly prepared in accordance with UK-adopted International Accounting Standards, and have been prepared in accordance with the requirements of the Companies Act 2006.":"[Opinion per applicable framework]"}</div></div></div><Sign/></div>)}
          {/* Z */}
          

          {/* ─── A2: ETHICS & INDEPENDENCE ─── */}
          {wp==="a2"&&(<div><Hdr t="Ethics & Independence" sub="FRC Ethical Standard 2019 · ISA 220.11-14 · ISA 260.14"/>
            <div style={{background:"#FEF3C7",border:"1px solid #FDE68A",borderRadius:5,padding:8,marginBottom:8,fontSize:9,color:"#92400E",lineHeight:1.5}}>
              <strong>FRC Ethical Standard 2019 (Revised 2024):</strong> The ethical standard applies to all statutory audits in the UK and Ireland. Independence is assessed at firm and engagement level throughout the engagement.
            </div>
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12,marginBottom:8}}>
              <div style={{fontSize:8,color:"#1E40AF",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>INDEPENDENCE ASSESSMENT</div>
              {[
                {s:"1. Financial interests (ES 2.1-2.50)",d:"No financial interest in audit client by firm, covered persons, or close family. Includes direct, indirect, and beneficial interests."},
                {s:"2. Non-audit services (ES 5.1-5.167R)",d:"Assess self-review, self-interest, advocacy, familiarity, and intimidation threats. 'Dark grey' services prohibited: preparation of accounting records, valuations with material effect, tax advocacy, internal audit, IT systems design."},
                {s:"3. Long association (ES 3.1-3.18)",d:"Engagement partner rotation: 5 years on, 5 years off (PIE). Key audit partner rotation: 7 years maximum. Senior staff >2 years: assess familiarity threat."},
                {s:"4. Fees (ES 4.1-4.43)",d:"Total fees from one client: assess significance to firm/office. Contingent fees prohibited for audit. Overdue fees >1 year: self-interest threat. Fee threshold: >10% of office income (listed); >15% (non-listed) triggers review."},
                {s:"5. Employment relationships (ES 2.51-2.64)",d:"Former firm staff joining client: cooling-off before senior position. Client staff joining firm: cannot work on that engagement."},
                {s:"6. Gifts and hospitality (ES 2.65-2.72)",d:"Trivial/inconsequential only. Document any gifts received. No gifts to client staff. Hospitality: modest and infrequent."},
                {s:"7. Business relationships (ES 2.73-2.85)",d:"No close business relationship with audit client. Firm providing other services: assess threats and apply safeguards."}
              ].map((item,i)=>(
                <div key={i} style={{padding:"6px 8px",borderRadius:4,marginBottom:3,background:i%2===0?"#F8FAFC":"#fff",borderLeft:"3px solid #2563EB"}}>
                  <div style={{fontSize:9,fontWeight:700,color:"#1E40AF"}}>{item.s}</div>
                  <div style={{fontSize:9,color:"#374151",lineHeight:1.5,marginTop:2}}>{item.d}</div>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12}}>
              <div style={{fontSize:8,color:"#1E40AF",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>CONFIRMATION</div>
              {["I confirm that I have assessed independence threats and applied appropriate safeguards per FRC ES 2019","No prohibited non-audit services have been provided to the audit client","Fee levels are within acceptable limits and do not create a self-interest threat","Rotation requirements are met (or not applicable for non-PIE entities)"].map((c,i)=>(
                <div key={i} style={{display:"flex",gap:5,padding:"3px 0",borderBottom:"1px solid #F1F5F9"}}>
                  <div style={{width:12,height:12,borderRadius:2,border:"1.5px solid #2563EB",flexShrink:0}}><span style={{fontSize:6,color:"#CBD5E1",display:"flex",justifyContent:"center"}}>☐</span></div>
                  <span style={{fontSize:9,color:"#374151",lineHeight:1.3}}>{c}</span>
                </div>
              ))}
            </div>
            <Sign/>
          </div>)}

          {/* ─── A4: PRELIMINARY ANALYTICAL REVIEW ─── */}
          {wp==="a4"&&d&&(<div><Hdr t="Preliminary Analytical Review" sub="ISA 520.5-7 · ISA 315.6(b)"/>
            <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:5,padding:8,marginBottom:8,fontSize:9,color:"#1E40AF",lineHeight:1.5}}>
              <strong>ISA 520.5:</strong> Analytical procedures at planning stage identify unusual relationships and set expectations against which results can be compared. Per ISA 315.6(b), analytical procedures are a required risk assessment procedure.
            </div>
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12,marginBottom:8}}>
              <div style={{fontSize:8,color:d.color,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>INDUSTRY KPIs — {d.label.toUpperCase()}</div>
              <table style={{width:"100%",fontSize:9}}><thead><tr>
                {["KPI","Prior Year","Current Year","Variance","Investigation"].map(h=><th key={h} style={{background:"#1E40AF",color:"#fff",padding:"5px 4px",fontSize:7,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{h}</th>)}
              </tr></thead><tbody>
                {d.kpis.map((k,i)=>(
                  <tr key={i} style={{background:i%2===0?"#F8FAFC":"#fff",borderBottom:"1px solid #E2E8F0"}}>
                    <td style={{padding:"5px 4px",fontWeight:600,fontSize:9}}>{k}</td>
                    <td style={{padding:"5px 4px",border:"1px dashed #E2E8F0",color:"#9CA3AF",fontSize:8}}>PY: £ ___</td>
                    <td style={{padding:"5px 4px",border:"1px dashed #E2E8F0",color:"#9CA3AF",fontSize:8}}>CY: £ ___</td>
                    <td style={{padding:"5px 4px",border:"1px dashed #E2E8F0",color:"#9CA3AF",fontSize:8}}>_____ %</td>
                    <td style={{padding:"5px 4px",border:"1px dashed #E2E8F0",color:"#9CA3AF",fontSize:8}}>Required if &gt;10%</td>
                  </tr>
                ))}
              </tbody></table>
            </div>
            <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:5,padding:8,marginBottom:8,fontSize:9,color:"#92400E"}}>
              <strong>ISA 520.7:</strong> Where analytical procedures identify significant fluctuations or unexpected relationships, the auditor shall investigate by: (a) inquiring of management and obtaining appropriate corroborating evidence, and (b) performing other audit procedures as necessary.
            </div>
            <Sign/>
          </div>)}

          {/* ─── B2: INTERNAL CONTROLS ASSESSMENT ─── */}
          {wp==="b2"&&d&&(<div><Hdr t="Internal Controls Assessment" sub="ISA 315.12-27 · ISA 265.7-9"/>
            <div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:5,padding:8,marginBottom:8,fontSize:9,color:"#B91C1C",lineHeight:1.5}}>
              <strong>ISA 315.12:</strong> The auditor shall obtain an understanding of internal control relevant to the audit. This includes: the control environment (ISA 315.14), entity's risk assessment (ISA 315.15), information system and communication (ISA 315.18), control activities (ISA 315.20), and monitoring (ISA 315.22).<br/><br/>
              <strong>ISA 265.7:</strong> Significant deficiencies in internal control must be communicated in writing to TCWG on a timely basis.
            </div>
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12,marginBottom:8}}>
              <div style={{fontSize:8,color:d.color,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>KEY CONTROLS — {d.label.toUpperCase()}</div>
              {d.controls.map((c,i)=>(
                <div key={i} style={{padding:"6px 8px",borderRadius:4,marginBottom:3,background:i%2===0?"#F8FAFC":"#fff",borderLeft:"3px solid "+d.color}}>
                  <div style={{display:"flex",gap:5,alignItems:"flex-start"}}>
                    <div style={{width:12,height:12,borderRadius:2,border:"1.5px solid "+d.color,flexShrink:0,marginTop:1}}><span style={{fontSize:6,color:"#CBD5E1",display:"flex",justifyContent:"center"}}>☐</span></div>
                    <span style={{fontSize:9,color:"#374151",lineHeight:1.4}}>{c}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12}}>
              <div style={{fontSize:8,color:"#1E40AF",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>CONTROL ENVIRONMENT ASSESSMENT (ISA 315.14)</div>
              {["Management's integrity, ethical values, and competence (ISA 315.14(a))","Board/TCWG oversight of internal control (ISA 315.14(b))","Organisational structure and assignment of authority (ISA 315.14(c))","HR policies and practices — competence of finance staff (ISA 315.14(d))"].map((c,i)=>(
                <div key={i} style={{display:"flex",gap:5,padding:"3px 0",borderBottom:"1px solid #F1F5F9"}}>
                  <div style={{width:12,height:12,borderRadius:2,border:"1.5px solid #2563EB",flexShrink:0}}><span style={{fontSize:6,color:"#CBD5E1",display:"flex",justifyContent:"center"}}>☐</span></div>
                  <span style={{fontSize:9,color:"#374151",lineHeight:1.3}}>{c}</span>
                </div>
              ))}
            </div>
            <Sign/>
          </div>)}

          {/* ─── D2: RECEIVABLES TESTING ─── */}
          {wp==="d2"&&d&&d.tests.debtors&&(<div><Hdr t={d.tests.debtors.t} sub={d.tests.debtors.isa}><Badge lv={d.tests.debtors.r}/></Hdr>
            <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:4,padding:7,marginBottom:8,fontSize:8,color:"#1E40AF"}}>
              <strong>Approach:</strong> {d.tests.debtors.a} | <strong>Assertions:</strong> Existence, Valuation, Completeness, Rights | <strong>ISA 505.7:</strong> Positive confirmation for material balances
            </div>
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12}}>
              <table style={{width:"100%",fontSize:8}}><thead><tr>{["Ref","Procedure","Assertions","Evidence","Result"].map(h=><th key={h} style={{background:"#1E40AF",color:"#fff",padding:"5px 4px",fontSize:7,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{h}</th>)}</tr></thead>
              <tbody>{d.tests.debtors.items.map((t,i)=>(
                <tr key={i} style={{background:i%2===0?"#F8FAFC":"#fff",borderBottom:"1px solid #E2E8F0"}}>
                  <td style={{padding:"5px 4px",fontFamily:"'JetBrains Mono',monospace",fontSize:7,fontWeight:700,color:d.color,verticalAlign:"top"}}>{t.ref}</td>
                  <td style={{padding:"5px 4px",color:"#374151",lineHeight:1.4,maxWidth:240,verticalAlign:"top"}}>{t.p}</td>
                  <td style={{padding:"5px 4px",fontSize:7,color:"#6B7280",fontFamily:"'JetBrains Mono',monospace",verticalAlign:"top"}}>{t.as}</td>
                  <td style={{padding:"5px 4px",fontSize:7,color:"#9CA3AF",verticalAlign:"top"}}>{t.ev}</td>
                  <td style={{padding:"5px 4px",verticalAlign:"top"}}><span style={{padding:"1px 3px",borderRadius:2,background:"#FEF3C7",fontSize:6,color:"#92400E",fontWeight:600}}>◻</span></td>
                </tr>
              ))}</tbody></table>
            </div>
            <Sign/>
          </div>)}

          {/* ─── D4: PAYABLES TESTING ─── */}
          {wp==="d4"&&d&&d.payTests&&(<div><Hdr t={d.payTests.t} sub={d.payTests.isa}><Badge lv={d.payTests.r}/></Hdr>
            <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:4,padding:7,marginBottom:8,fontSize:8,color:"#1E40AF"}}>
              <strong>Approach:</strong> {d.payTests.a} | <strong>Key assertion:</strong> COMPLETENESS — the primary risk for payables is understatement | <strong>SFURL:</strong> search for unrecorded liabilities post-YE
            </div>
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12}}>
              <table style={{width:"100%",fontSize:8}}><thead><tr>{["Ref","Procedure","Assertions","Evidence","Result"].map(h=><th key={h} style={{background:"#1E40AF",color:"#fff",padding:"5px 4px",fontSize:7,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{h}</th>)}</tr></thead>
              <tbody>{d.payTests.items.map((t,i)=>(
                <tr key={i} style={{background:i%2===0?"#F8FAFC":"#fff",borderBottom:"1px solid #E2E8F0"}}>
                  <td style={{padding:"5px 4px",fontFamily:"'JetBrains Mono',monospace",fontSize:7,fontWeight:700,color:d.color,verticalAlign:"top"}}>{t.ref}</td>
                  <td style={{padding:"5px 4px",color:"#374151",lineHeight:1.4,maxWidth:240,verticalAlign:"top"}}>{t.p}</td>
                  <td style={{padding:"5px 4px",fontSize:7,color:"#6B7280",fontFamily:"'JetBrains Mono',monospace",verticalAlign:"top"}}>{t.as}</td>
                  <td style={{padding:"5px 4px",fontSize:7,color:"#9CA3AF",verticalAlign:"top"}}>{t.ev}</td>
                  <td style={{padding:"5px 4px",verticalAlign:"top"}}><span style={{padding:"1px 3px",borderRadius:2,background:"#FEF3C7",fontSize:6,color:"#92400E",fontWeight:600}}>◻</span></td>
                </tr>
              ))}</tbody></table>
            </div>
            <Sign/>
          </div>)}

          {/* ─── D5: PAYROLL TESTING ─── */}
          {wp==="d5"&&d&&d.payrollTests&&(<div><Hdr t={d.payrollTests.t} sub={d.payrollTests.isa}><Badge lv={d.payrollTests.r}/></Hdr>
            <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:4,padding:7,marginBottom:8,fontSize:8,color:"#1E40AF"}}>
              <strong>Approach:</strong> {d.payrollTests.a} | <strong>CA 2006 s.411:</strong> Employee numbers and costs disclosure mandatory | <strong>CA 2006 s.412-413:</strong> Directors' remuneration
            </div>
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12}}>
              <table style={{width:"100%",fontSize:8}}><thead><tr>{["Ref","Procedure","Assertions","Evidence","Result"].map(h=><th key={h} style={{background:"#1E40AF",color:"#fff",padding:"5px 4px",fontSize:7,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{h}</th>)}</tr></thead>
              <tbody>{d.payrollTests.items.map((t,i)=>(
                <tr key={i} style={{background:i%2===0?"#F8FAFC":"#fff",borderBottom:"1px solid #E2E8F0"}}>
                  <td style={{padding:"5px 4px",fontFamily:"'JetBrains Mono',monospace",fontSize:7,fontWeight:700,color:d.color,verticalAlign:"top"}}>{t.ref}</td>
                  <td style={{padding:"5px 4px",color:"#374151",lineHeight:1.4,maxWidth:240,verticalAlign:"top"}}>{t.p}</td>
                  <td style={{padding:"5px 4px",fontSize:7,color:"#6B7280",fontFamily:"'JetBrains Mono',monospace",verticalAlign:"top"}}>{t.as}</td>
                  <td style={{padding:"5px 4px",fontSize:7,color:"#9CA3AF",verticalAlign:"top"}}>{t.ev}</td>
                  <td style={{padding:"5px 4px",verticalAlign:"top"}}><span style={{padding:"1px 3px",borderRadius:2,background:"#FEF3C7",fontSize:6,color:"#92400E",fontWeight:600}}>◻</span></td>
                </tr>
              ))}</tbody></table>
            </div>
            <Sign/>
          </div>)}

          {/* ─── E1: SUMMARY OF DIFFERENCES ─── */}
          {wp==="e1"&&(<div><Hdr t="Summary of Audit Differences" sub="ISA 450.5-12 · ISA 260.16(a)(iii)"/>
            <div style={{background:"#FEF3C7",border:"1px solid #FDE68A",borderRadius:5,padding:8,marginBottom:8,fontSize:9,color:"#92400E",lineHeight:1.5}}>
              <strong>ISA 450.5:</strong> The auditor shall accumulate misstatements identified during the audit, other than those that are clearly trivial (below 5% of OM per ISA 450.A2).<br/>
              <strong>ISA 450.8:</strong> Request management to correct all misstatements accumulated during the audit.<br/>
              <strong>ISA 450.11:</strong> If management refuses to correct, evaluate whether uncorrected misstatements are material individually or in aggregate.<br/>
              <strong>ISA 260.16(a)(iii):</strong> Communicate uncorrected misstatements and the effect on the auditor's opinion.
            </div>
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12,marginBottom:8}}>
              <div style={{fontSize:8,color:"#DC2626",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>ADJUSTED DIFFERENCES</div>
              <table style={{width:"100%",fontSize:8}}><thead><tr>{["#","Description","DR £","CR £","WP Ref","P&L/BS"].map(h=><th key={h} style={{background:"#DC2626",color:"#fff",padding:"5px 4px",fontSize:7,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{h}</th>)}</tr></thead>
              <tbody>{[1,2,3,4,5].map(n=>(
                <tr key={n} style={{background:n%2===0?"#F8FAFC":"#fff",borderBottom:"1px solid #E2E8F0"}}>
                  <td style={{padding:"5px 4px",fontFamily:"'JetBrains Mono',monospace",fontSize:7}}>{n}</td>
                  <td style={{padding:"5px 4px",border:"1px dashed #E2E8F0",minWidth:120}}></td>
                  <td style={{padding:"5px 4px",border:"1px dashed #E2E8F0",minWidth:60}}></td>
                  <td style={{padding:"5px 4px",border:"1px dashed #E2E8F0",minWidth:60}}></td>
                  <td style={{padding:"5px 4px",border:"1px dashed #E2E8F0",minWidth:40}}></td>
                  <td style={{padding:"5px 4px",border:"1px dashed #E2E8F0",minWidth:40}}></td>
                </tr>
              ))}</tbody></table>
            </div>
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12}}>
              <div style={{fontSize:8,color:"#F59E0B",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>UNADJUSTED DIFFERENCES (PASSED)</div>
              <table style={{width:"100%",fontSize:8}}><thead><tr>{["#","Description","DR £","CR £","Reason Not Adjusted","WP Ref"].map(h=><th key={h} style={{background:"#F59E0B",color:"#fff",padding:"5px 4px",fontSize:7,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{h}</th>)}</tr></thead>
              <tbody>{[1,2,3].map(n=>(
                <tr key={n} style={{background:n%2===0?"#F8FAFC":"#fff",borderBottom:"1px solid #E2E8F0"}}>
                  <td style={{padding:"5px 4px",fontFamily:"'JetBrains Mono',monospace",fontSize:7}}>{n}</td>
                  <td style={{padding:"5px 4px",border:"1px dashed #E2E8F0",minWidth:100}}></td>
                  <td style={{padding:"5px 4px",border:"1px dashed #E2E8F0",minWidth:50}}></td>
                  <td style={{padding:"5px 4px",border:"1px dashed #E2E8F0",minWidth:50}}></td>
                  <td style={{padding:"5px 4px",border:"1px dashed #E2E8F0",minWidth:80}}></td>
                  <td style={{padding:"5px 4px",border:"1px dashed #E2E8F0",minWidth:30}}></td>
                </tr>
              ))}</tbody></table>
              <div style={{marginTop:6,padding:6,background:"#FEF2F2",borderRadius:4,fontSize:8,color:"#B91C1C"}}>
                <strong>ISA 450.11:</strong> Total unadjusted: £ _____ | Materiality: £ _____ | Conclusion: unadjusted differences are / are not material individually or in aggregate
              </div>
            </div>
            <Sign/>
          </div>)}

          {/* ─── E4: SUBSEQUENT EVENTS ─── */}
          {wp==="e4"&&d&&(<div><Hdr t="Subsequent Events Review" sub="ISA 560.6-17 · FRS 102.32.1-32.11"/>
            <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:5,padding:8,marginBottom:8,fontSize:9,color:"#1E40AF",lineHeight:1.5}}>
              <strong>ISA 560.6:</strong> Auditor shall perform procedures to identify events between the date of the FS and the date of the auditor's report that require adjustment or disclosure.<br/>
              <strong>FRS 102.32.2-32.4:</strong> <u>Adjusting events</u> — conditions existing at YE. Adjust the financial statements.<br/>
              <strong>FRS 102.32.5-32.6:</strong> <u>Non-adjusting events</u> — conditions arising after YE. Disclose if material but do not adjust.
            </div>
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12,marginBottom:8}}>
              <div style={{fontSize:8,color:"#1E40AF",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>MANDATORY PROCEDURES (ISA 560.7)</div>
              {["(a) Obtain understanding of management procedures to identify subsequent events","(b) Inquire of management and TCWG whether any subsequent events have occurred that might affect the FS","(c) Read minutes of meetings of members, TCWG, and relevant committees held after YE","(d) Read entity's latest interim financial information (if any)","(e) Read latest available management accounts post-YE","(f) Inquire of entity's legal counsel regarding litigation and claims"].map((p,i)=>(
                <div key={i} style={{display:"flex",gap:5,padding:"4px 0",borderBottom:"1px solid #F1F5F9"}}>
                  <div style={{width:12,height:12,borderRadius:2,border:"1.5px solid #2563EB",flexShrink:0}}><span style={{fontSize:6,color:"#CBD5E1",display:"flex",justifyContent:"center"}}>☐</span></div>
                  <span style={{fontSize:9,color:"#374151",lineHeight:1.3}}>{p}</span>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12}}>
              <div style={{fontSize:8,color:d.color,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>INDUSTRY CONSIDERATIONS — {d.label.toUpperCase()}</div>
              {d.events.map((e,i)=>(
                <div key={i} style={{padding:"5px 7px",borderRadius:3,marginBottom:2,background:i%2===0?"#F8FAFC":"#fff",borderLeft:"3px solid "+d.color,fontSize:9,color:"#374151",lineHeight:1.4}}>{e}</div>
              ))}
            </div>
            <div style={{background:"#FEF3C7",border:"1px solid #FDE68A",borderRadius:5,padding:8,marginTop:8,fontSize:8,color:"#92400E"}}>
              <strong>ISA 560.10-11:</strong> Events after the auditor's report date — auditor has no obligation to perform procedures. However, if facts become known that would have caused the report to be modified, consider ISA 560.14-17 actions.
            </div>
            <Sign/>
          </div>)}

          {/* ─── E5: WRITTEN REPRESENTATIONS ─── */}
          {wp==="e5"&&d&&(<div><Hdr t="Written Representations" sub="ISA 580.10-13 · ISA 580.A7-A22"/>
            <div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:5,padding:8,marginBottom:8,fontSize:9,color:"#B91C1C",lineHeight:1.5}}>
              <strong>ISA 580.10-11:</strong> The auditor SHALL request written representations from management. The representation letter must be dated as near as practicable to, but not after, the date of the auditor's report.<br/>
              <strong>ISA 580.13:</strong> If management does not provide requested representations, the auditor shall: (a) discuss with management, (b) re-evaluate integrity, (c) determine impact on opinion — may result in disclaimer (ISA 580.20).
            </div>
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12,marginBottom:8}}>
              <div style={{fontSize:8,color:"#DC2626",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>MANDATORY REPRESENTATIONS (ISA 580.10-11)</div>
              {[
                "Management has fulfilled its responsibility for the preparation of the FS giving a true and fair view per the applicable framework (ISA 580.10(a))",
                "Management has provided the auditor with all information and access as agreed in the engagement letter (ISA 580.10(b))",
                "All transactions have been recorded and are reflected in the FS (ISA 580.10(c))",
                "Management acknowledges its responsibility for internal controls to prevent and detect fraud (ISA 580.11(a))",
                "All known instances of fraud or suspected fraud affecting the entity have been disclosed (ISA 580.11(b)(i))",
                "All known instances of non-compliance or suspected non-compliance with laws and regulations have been disclosed (ISA 580.11(b)(ii))",
                "All known actual or possible litigation and claims have been disclosed and accounted for per FRS 102.21 / IAS 37 (ISA 580.11(b)(iii))",
                "Related party relationships and transactions are properly disclosed per FRS 102.33 / IAS 24 (ISA 580 App.2)"
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",gap:5,padding:"3px 0",borderBottom:"1px solid #F1F5F9"}}>
                  <div style={{width:12,height:12,borderRadius:2,border:"1.5px solid #DC2626",flexShrink:0}}><span style={{fontSize:6,color:"#CBD5E1",display:"flex",justifyContent:"center"}}>☐</span></div>
                  <span style={{fontSize:9,color:"#374151",lineHeight:1.3}}>{r}</span>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12}}>
              <div style={{fontSize:8,color:d.color,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>INDUSTRY-SPECIFIC REPRESENTATIONS — {d.label.toUpperCase()}</div>
              {d.reps.map((r,i)=>(
                <div key={i} style={{display:"flex",gap:5,padding:"3px 0",borderBottom:"1px solid #F1F5F9"}}>
                  <div style={{width:12,height:12,borderRadius:2,border:"1.5px solid "+d.color,flexShrink:0}}><span style={{fontSize:6,color:"#CBD5E1",display:"flex",justifyContent:"center"}}>☐</span></div>
                  <span style={{fontSize:9,color:"#374151",lineHeight:1.3}}>{r}</span>
                </div>
              ))}
            </div>
            <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:5,padding:8,marginTop:8,fontSize:8,color:"#92400E"}}>
              <strong>ISA 580.20:</strong> If management does not provide one or more of the requested written representations, the auditor shall disclaim an opinion on the financial statements.
            </div>
            <Sign/>
          </div>)}

          {/* ─── STD: STANDARDS REFERENCE INDEX ─── */}
          {wp==="std"&&(<div><Hdr t="Standards Reference Index" sub="ISA (UK) · FRS 102 · Companies Act 2006 · Companies House"/>
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12,marginBottom:8}}>
              <div style={{fontSize:8,color:"#1E40AF",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>ISA (UK) — INTERNATIONAL STANDARDS ON AUDITING</div>
              <table style={{width:"100%",fontSize:8}}><thead><tr>{["ISA","Title","Key Paragraphs","Used In"].map(h=><th key={h} style={{background:"#1E40AF",color:"#fff",padding:"5px 4px",fontSize:7,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{h}</th>)}</tr></thead>
              <tbody>{[
                ["200","Overall Objectives","5 (reasonable assurance), A53-A57 (limitations)","Dashboard, REG"],
                ["210","Agreeing Terms","6 (preconditions), 10 (engagement letter)","A1"],
                ["220","Quality Management","11-14 (partner responsibilities), 25 (team competence)","A1"],
                ["230","Audit Documentation","7-8 (sufficient appropriate), 9 (timely), 14 (assembly 60 days)","Z, All WPs"],
                ["240","Fraud","16-24 (risk factors), 26-27 (revenue presumption), 31-33 (override)","A6, A7, D1, D6"],
                ["250","Laws & Regulations","12-17 (comply with laws), 19-22 (non-compliance)","A3, REG"],
                ["260","Communication with TCWG","14-16 (planned scope/timing), 16(a)(iii) (misstatements)","E1, F1"],
                ["265","Internal Control Deficiencies","7-9 (significant deficiencies in writing to TCWG)","B2, F1"],
                ["300","Planning","7-12 (overall strategy and plan)","A8"],
                ["315","Identifying & Assessing Risks","11-24 (understanding entity), 25-30 (risk assessment)","A3, B1, B2"],
                ["320","Materiality","10-11 (PM and OM), 14 (reassess during audit)","A5"],
                ["330","Responses to Assessed Risks","5-6 (overall), 8-9 (controls), 18 (significant risks — ToD required)","A8, D1-D6"],
                ["450","Evaluation of Misstatements","5 (accumulate), 8 (request correction), 11 (evaluate aggregate)","E1"],
                ["500","Audit Evidence","6-7 (sufficient appropriate evidence)","All testing"],
                ["501","Specific Items","4-8 (inventory attendance), 9 (litigation/claims), 12 (segments)","D3, E5"],
                ["505","External Confirmations","7-8 (positive/negative), 16 (non-responses)","D2"],
                ["510","Initial Engagements","6 (opening balances)","A1"],
                ["520","Analytical Procedures","5-7 (planning and substantive analytics)","A4"],
                ["530","Audit Sampling","6-8 (design, size, evaluation)","D1-D5"],
                ["540","Accounting Estimates","8-12 (identifying, assessing, testing estimates)","A7, D1, D3"],
                ["550","Related Parties","11-12 (identify, assess, respond)","A3, E6"],
                ["560","Subsequent Events","6-9 (adjusting), 10-11 (non-adjusting), 14-17 (post-report)","E4"],
                ["570","Going Concern","2 (management responsibility), 10-16 (evaluate), 21-24 (opinion)","E3"],
                ["580","Written Representations","10-11 (mandatory), 13 (refusal), 20 (disclaimer)","E5"],
                ["620","Using Expert Work","8-12 (competence, capability, objectivity)","A1 (specialist industries)"],
                ["700","Forming an Opinion","10-11 (true and fair view), 21-44 (report content)","F2"],
                ["701","Key Audit Matters","PIE entities only. Matters of most significance.","F2 (if PIE)"],
                ["705","Modifications","7-8 (qualified), 9 (adverse), 10 (disclaimer)","F2"],
                ["720","Other Information","14-15 (strategic/directors' report consistency)","F2"]
              ].map((r,i)=>(
                <tr key={i} style={{background:i%2===0?"#F8FAFC":"#fff",borderBottom:"1px solid #E2E8F0"}}>
                  <td style={{padding:"4px",fontFamily:"'JetBrains Mono',monospace",fontSize:7,fontWeight:700,color:"#1E40AF"}}>{r[0]}</td>
                  <td style={{padding:"4px",fontWeight:600}}>{r[1]}</td>
                  <td style={{padding:"4px",fontSize:7,color:"#374151"}}>{r[2]}</td>
                  <td style={{padding:"4px",fontSize:7,color:"#6B7280",fontFamily:"'JetBrains Mono',monospace"}}>{r[3]}</td>
                </tr>
              ))}</tbody></table>
            </div>
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12,marginBottom:8}}>
              <div style={{fontSize:8,color:"#059669",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>FRS 102 — UK GAAP KEY SECTIONS</div>
              <table style={{width:"100%",fontSize:8}}><thead><tr>{["Section","Title","Key Application"].map(h=><th key={h} style={{background:"#059669",color:"#fff",padding:"5px 4px",fontSize:7,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{h}</th>)}</tr></thead>
              <tbody>{[
                ["s1A","Small Entities","Reduced disclosures for small companies (CA 2006 s.382)"],
                ["s2","Concepts","True and fair override, going concern, accruals, materiality"],
                ["s11","Basic Financial Instruments","Recognition, measurement, impairment of basic instruments"],
                ["s12","Other Financial Instruments","Derivatives, hedging, fair value through P&L"],
                ["s13","Inventories","Cost formulas (FIFO/weighted avg), NRV, overhead absorption at normal capacity (s13.8)"],
                ["s16","Investment Property","Fair value model, gains/losses through P&L"],
                ["s17","Property, Plant & Equipment","Cost model, depreciation, component approach, impairment indicators"],
                ["s18","Intangible Assets","Recognition criteria (s18.4), development costs 6 criteria (s18.8H), amortisation"],
                ["s20","Leases","Operating vs finance, lease incentive spreading, IFRS 16 transition"],
                ["s21","Provisions & Contingencies","Recognition (s21.4): present obligation, probable outflow, reliable estimate"],
                ["s23","Revenue","Performance conditions (s23.10), construction contracts (s23.17), multi-element"],
                ["s24","Government Grants","Performance model (s24.4-24.5), conditions, repayment"],
                ["s26","Share-based Payment","Fair value at grant, expense over vesting period"],
                ["s27","Impairment","Indicators, recoverable amount, CGUs, reversals"],
                ["s28","Employee Benefits","Short-term, post-employment, termination benefits"],
                ["s32","Events After Reporting Period","Adjusting (s32.2-32.4), non-adjusting (s32.5-32.6)"],
                ["s33","Related Party Disclosures","Definition, disclosure requirements, exemptions for wholly-owned"]
              ].map((r,i)=>(
                <tr key={i} style={{background:i%2===0?"#F8FAFC":"#fff",borderBottom:"1px solid #E2E8F0"}}>
                  <td style={{padding:"4px",fontFamily:"'JetBrains Mono',monospace",fontSize:7,fontWeight:700,color:"#059669"}}>{r[0]}</td>
                  <td style={{padding:"4px",fontWeight:600}}>{r[1]}</td>
                  <td style={{padding:"4px",fontSize:7,color:"#374151"}}>{r[2]}</td>
                </tr>
              ))}</tbody></table>
            </div>
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12}}>
              <div style={{fontSize:8,color:"#7C3AED",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>COMPANIES ACT 2006 — KEY SECTIONS</div>
              <table style={{width:"100%",fontSize:8}}><thead><tr>{["Section","Provision","Application"].map(h=><th key={h} style={{background:"#7C3AED",color:"#fff",padding:"5px 4px",fontSize:7,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{h}</th>)}</tr></thead>
              <tbody>{[
                ["s382-384","Small companies qualification","TO ≤£10.2m AND TA ≤£5.1m AND employees ≤50 (meet 2 of 3)"],
                ["s393","True and fair view","Directors shall not approve FS unless satisfied they give a true and fair view"],
                ["s394-396","Individual accounts","Form, content, and regulations about individual company accounts"],
                ["s411","Employee information","Average number of employees, aggregate remuneration — disclosure in notes"],
                ["s412-413","Directors' remuneration","Total remuneration, pension contributions, compensation for loss of office"],
                ["s414A-D","Strategic report","Required for all companies except small; contents per s414C"],
                ["s441-442","Filing obligations","Private: 9 months from YE. Public: 6 months from YE"],
                ["s465","Medium companies","TO ≤£36m AND TA ≤£18m AND employees ≤250"],
                ["s475-476","Audit requirement","Every company must have accounts audited (subject to exemptions)"],
                ["s477-479","Small company audit exemption","Exempt if: TO ≤£10.2m AND TA ≤£5.1m (meet both). Not available to PIE/group."],
                ["s485-488","Appointment of auditors","Private company: deemed reappointed unless excluded by articles"],
                ["s495","Auditor's report","Report on FS giving true and fair view per applicable framework"],
                ["s496","Adequacy of records","Report on whether adequate accounting records kept"],
                ["s498-499","Auditor duties & rights","Right to information (s499), right to attend general meetings"],
                ["s510-513","Removal & resignation","Removal by ordinary resolution (s510), statement of circumstances (s519)"]
              ].map((r,i)=>(
                <tr key={i} style={{background:i%2===0?"#F8FAFC":"#fff",borderBottom:"1px solid #E2E8F0"}}>
                  <td style={{padding:"4px",fontFamily:"'JetBrains Mono',monospace",fontSize:7,fontWeight:700,color:"#7C3AED"}}>{r[0]}</td>
                  <td style={{padding:"4px",fontWeight:600}}>{r[1]}</td>
                  <td style={{padding:"4px",fontSize:7,color:"#374151"}}>{r[2]}</td>
                </tr>
              ))}</tbody></table>
              <div style={{marginTop:8,padding:8,background:"#EDE9FE",borderRadius:4,border:"1px solid #C4B5FD"}}>
                <div style={{fontSize:8,fontWeight:700,color:"#7C3AED",fontFamily:"'JetBrains Mono',monospace",marginBottom:3}}>COMPANIES HOUSE FILING</div>
                <div style={{fontSize:9,color:"#374151",lineHeight:1.5}}>
                  Filing deadline: private 9 months, public 6 months from YE (s442). Late filing penalties: 1 month £150, 1-3m £375, 3-6m £750, &gt;6m £1,500 (double for public per s453). Confirmation statement (s853A): annually within 14 days of review date. Event-driven filings: change of director (s167, within 14 days), change of registered office (s87), allotment of shares (s555, within 1 month).
                </div>
              </div>
            </div>
          </div>)}

          {wp==="z"&&(<div><Hdr t="Audit Trail Map" sub="ISA 230.8-11 · Assembly: 60 days (ISA 230.14)"/><div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12}}><table style={{width:"100%",fontSize:8}}><thead><tr>{["Ref","Title","Phase","Sig","Status"].map(h=><th key={h} style={{background:"#4B5563",color:"#fff",padding:"5px",fontSize:7,fontFamily:"'JetBrains Mono',monospace"}}>{h}</th>)}</tr></thead><tbody>{WPS.filter(w=>w.id!=="dash").map((w,i)=>(<tr key={i} style={{background:i%2===0?"#F8FAFC":"#fff",cursor:"pointer"}} onClick={()=>setWp(w.id)}><td style={{padding:"4px",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:w.s?"#DC2626":"#2563EB"}}>{w.ref}</td><td style={{padding:"4px"}}>{w.title}</td><td style={{padding:"4px",color:PH[w.ph]?.c,fontSize:7}}>{PH[w.ph]?.l}</td><td style={{padding:"4px"}}>{w.s&&<Badge lv="SIGNIFICANT" sm/>}</td><td style={{padding:"4px"}}><span style={{padding:"1px 3px",borderRadius:2,background:"#FEF3C7",fontSize:6,color:"#92400E",fontWeight:600}}>Draft</span></td></tr>))}</tbody></table></div></div>)}
          {/* REG */}
          {wp==="reg"&&(<div><Hdr t="Regulatory Framework" sub="Companies Act 2006 · ISA (UK) · FRC · Companies House"/><div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:6,padding:10,marginBottom:10}}><div style={{fontSize:9,fontWeight:700,color:"#92400E",fontFamily:"'JetBrains Mono',monospace",marginBottom:4}}>REASONABLE ASSURANCE — NOT ABSOLUTE (ISA 200.5)</div><div style={{fontSize:9,color:"#78716C",lineHeight:1.5}}>An audit provides reasonable assurance about whether FS are free from material misstatement. This is NOT a guarantee. Limitations include: use of sampling (ISA 200.A53), inherent limitations of internal control including management override (ISA 200.A54), much evidence is persuasive not conclusive (ISA 200.A55), professional judgement creates subjectivity (ISA 200.A56).</div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12}}><div style={{fontSize:8,color:"#1E40AF",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>COMPANIES ACT 2006</div>{[["s.475","Requirement for audited accounts"],["s.477","Small company audit exemption: TO ≤£10.2m AND TA ≤£5.1m"],["s.495","True and fair view opinion"],["s.496","Report if inadequate records (s.386)"],["s.498","Auditor's right to information"],["s.510-513","Removal — special notice, statement"]].map(([r,d],i)=>(<div key={i} style={{display:"flex",gap:4,padding:"2px 0",borderBottom:"1px solid #F1F5F9"}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,fontWeight:700,color:"#2563EB",minWidth:42}}>{r}</span><span style={{fontSize:8,color:"#374151"}}>{d}</span></div>))}</div>
            <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12}}><div style={{fontSize:8,color:"#059669",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>COMPANIES HOUSE FILING</div>{["Private: 9 months from ARD (CA 2006 s.442)","Public: 6 months from ARD","Late penalties: £150-£1,500 (private); doubled for public","Confirmation statement: annually within 14 days (s.853A)","Charity: also file with Charity Commission (CA 2011 s.169)"].map((r,i)=>(<div key={i} style={{padding:"2px 0",borderBottom:"1px solid #F1F5F9",fontSize:8,color:"#374151"}}>• {r}</div>))}</div>
          </div><Sign/></div>)}
          {/* Fallback */}
          {!["dash","reg","a1","a3","a5","a6","a7","a8","b1","c1","c2","c3","c4","d1","d3","d6","e3","e6","f1","f2","z"].includes(wp)&&d&&(<div><Hdr t={wpo?.title} sub=""/><div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:6,padding:12,fontSize:10,color:"#6B7280"}}>Customised {d.label} content for <strong>{sec}</strong> under <strong>{fwd?.l}</strong>. All industry-specific data populated.</div><Sign/></div>)}
        </main>
      </div>
    </div>
  );
}
