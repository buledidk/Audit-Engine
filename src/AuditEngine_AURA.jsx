import { useEffect } from "react";
import { I, FW, SZ, ET, WPS, TESTS, C, CL, HELP_TEXT, REGULATORY_DETAIL_MAP } from "./data";
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { uploadFile, getDownloadUrl, deleteDocument } from './DocumentService';
import ReviewNotesPanel from './ReviewNotesPanel';
import VersionHistoryModal from './VersionHistoryModal';
import EngagementPlanning from './components/EngagementPlanning';
import { smartExtract } from "./DataExtractor";
import { validateImportData } from "./IntegrationsEngine";
import { generateTestingWorkbook } from "./ExcelGenerator";
import { EngagementProvider, useEngagement } from "./context/EngagementContext";
import { useAuditHelpers } from "./hooks/useAuditHelpers.jsx";
import { useExportHandlers } from "./hooks/useExportHandlers.jsx";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts.jsx";
import AIPanel, { useAIEngine } from "./components/AIPanel";
import AgentPanel from "./agents/AgentPanel";
import { AddModal, SampleCalcModal, WelcomeWizard, ExtractPreviewModal, ToastNotification } from "./components/AuditModals";
import { WPHead } from "./components/wp/WPHeader";
import AuditSidebar from "./components/AuditSidebar";
import { EvidenceTracker } from "./components/wp/EvidenceTracker";
import Dashboard from "./components/AuditDashboard";
import WPBody from "./components/wp/WPBody";
import ReviewDashboard from "./components/ReviewDashboard";

// ═══════════════════════════════════════════════════════════════
// AUDITENGINE v10 AURA — FULL AUDIT SOFTWARE
// 69 Working Papers · 8 Industries · FSLI-Driven · Editable
// ═══════════════════════════════════════════════════════════════

export default function AuditEngine({ initialEngId }){
  return(
    <EngagementProvider initialEngId={initialEngId}>
      <AuditLayout/>
    </EngagementProvider>
  );
}

function AuditLayout(){
  const {
    activeWP, setActiveWP, sbOpen, setSbOpen, cfg, setCfg,
    signOffs, setSignOffs, wpNotes, setWpNotes, cellData, setCellData, agentPanelOpen, setAgentPanelOpen,
    customItems, setCustomItems, showModal, setShowModal, mi, setMi,
    uploads, setUploads, archived, setArchived, reviewStatus, setReviewStatus,
    integrations, setIntegrations, showSampleCalc, setShowSampleCalc,
    tbData, setTbData, tbMappings, setTbMappings,
    aiOpen, setAiOpen, showDebug, setShowDebug,
    aiLoading, setAiLoading, aiMessages, setAiMessages,
    aiInput, setAiInput, aiMode, setAiMode,
    arMod, coaMod, fmUIMod,
    engId, setEngId, storageRef,
    aiAuditTrail, setAiAuditTrail, toastMsg, setToastMsg,
    chResult, setChResult, wpSearch, setWpSearch,
    validationResult, setValidationResult,
    mobileMenuOpen, setMobileMenuOpen, showWelcome, setShowWelcome,
    extractPreview, setExtractPreview, lastSaveTime, setLastSaveTime,
    downloadingBtns, setDownloadingBtns, splashDone,
    theme, CC, toggleTheme, showToast, upd,
    debugClicks, debugTimer, renderCount, wpSearchRef,
    ind, fw, sz, indAcc,
    signOffLog, setSignOffLog, reviewNotes, setReviewNotes,
    documentLinks, setDocumentLinks, changeLog, setChangeLog,
    cellHistoryKey, setCellHistoryKey,
    allWPs, totalWPs, doneCount, visibleWPs, curWP,
    startNewEngagement, switchEngagement, forceSaveAll
  } = useEngagement();

  const {
    getCell, setCell, BoundET, ST, doSign,
    getUserIdentity, formatSignOff, getSectionName, tc,
    inp, lbl
  } = useAuditHelpers();

  const { generateWord, generateEngagementLetterWord, generateRepresentationsWord, generateManagementLetterWord, generateAuditReportWord, generateAuditWorkbook, doExportEngagement, doImportEngagement, loadDemoEngagement, buildWPCsv, doExport } = useExportHandlers();

  useEffect(()=>{renderCount.current++;});

  const { callAI, exportAITrail } = useAIEngine();

  useKeyboardShortcuts({ buildWPCsv, doExport, curWP });

  // ═══ EXPORT CONTEXT BUILDER ═══
  const buildExportCtx=()=>({entityName:cfg.entityName,fye:cfg.fye,industry:ind?.l,sector:cfg.sector,framework:fw?.l,materiality:cfg.materiality,perfMateriality:cfg.perfMateriality,trivial:cfg.trivial,firmName:cfg.firmName,partner:cfg.partner,manager:cfg.manager,entitySize:sz?.l,cellData,signOffs,wpNotes,customItems,getCell,allWPs,risks:ind?[...ind.r,...(customItems.risks||[])]:[],tbData,tbMappings,companyNumber:cfg.companyNumber});

  // ═══ DATA EXTRACTION HANDLER ═══
  const handleSmartExtract=async(wpId,file)=>{
    try{
      const result=await smartExtract(file,wpId);
      const dataRows=Array.isArray(result.data)?result.data:result.data?.rows||[];
      const validation=dataRows.length>0?validateImportData({rows:dataRows},result.type||"trialBalance"):null;
      setExtractPreview({wpId,result,fileName:file.name,validation});
      showToast("Data extracted from "+file.name+(validation&&!validation.valid?" (validation issues found)":""));
    }catch(e){console.error("Extract error:",e);showToast("Extract failed: "+e.message,"error");}
  };

  // ═══ ENHANCED DOWNLOAD HANDLERS ═══
  const withLoading=(key,fn)=>async(...args)=>{
    if(downloadingBtns[key])return;
    setDownloadingBtns(p=>({...p,[key]:true}));
    try{await fn(...args);}catch(e){console.error("Download error:",e);showToast("Download failed: "+e.message,"error");}finally{setDownloadingBtns(p=>{const n={...p};delete n[key];return n;});}
  };
  const downloadTestingXlsx=async(wp)=>{
    const key="testing_"+wp.id;
    if(downloadingBtns[key])return;
    setDownloadingBtns(p=>({...p,[key]:true}));
    try{const fsliLines=wp.fk&&ind?.f?.[wp.fk]?ind.f[wp.fk].filter(l=>l!=="N/A"&&l!=="N/A for pure SaaS"):[];
    await generateTestingWorkbook(wp,{...buildExportCtx(),fsliLines,tests:TESTS[wp.id]||[],customTests:customItems.tests[wp.id]||[],conclusion:wpNotes["conclusion_"+wp.id]||"",wpNotes:wpNotes[wp.id]||""});
    showToast(wp.ref+" Excel downloaded","export");}catch(e){console.error("Download error:",e);showToast("Download failed: "+e.message,"error");}finally{setDownloadingBtns(p=>{const n={...p};delete n[key];return n;});}
  };

  // ═══ FSLI MAPPED TOTALS (needed by IntegrationsHub) ═══
  const FSLI_CATS=["Revenue","Receivables","Inventory","Payables","Cash","Fixed Assets","Equity","Loans","Provisions","Tax","Other"];
  const getMappedTotals=()=>{const totals={};FSLI_CATS.forEach(c=>totals[c]={py:0,cy:0});tbData.forEach((r,i)=>{const cat=tbMappings[i];if(cat&&totals[cat]){totals[cat].py+=r.py;totals[cat].cy+=r.cy;}});return totals;};

  const sw=sbOpen?268:52;

  return(
    <div style={{minHeight:"100vh",background:CC.bg,fontFamily:"'DM Sans',sans-serif",color:CC.tx,display:"flex",position:"relative"}}>
      {!splashDone&&<div className="ae-splash"><div className="ae-splash-logo">AE</div><div className="ae-splash-title">AuditEngine</div><div className="ae-splash-tagline">Audit Intelligence. Redefined.</div><div className="ae-splash-bar"><div className="ae-splash-bar-fill"/></div><div style={{marginTop:16,fontSize:9,color:"rgba(255,255,255,0.25)"}}>Powered by Indus Nexus Limited</div></div>}
      {cfg.configured&&<div style={{position:"fixed",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${indAcc}00,${indAcc},${indAcc}00)`,zIndex:300}}/>}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulseGlow{0%,100%{box-shadow:0 0 8px rgba(99,102,241,0.4)}50%{box-shadow:0 0 20px rgba(99,102,241,0.7)}}*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:rgba(255,255,255,0.02)}::-webkit-scrollbar-thumb{background:${C.acc}55;border-radius:3px}::-webkit-scrollbar-thumb:hover{background:${C.acc}88}button{transition:all 0.2s ease}button:hover{filter:brightness(1.1)}input,textarea,select{transition:border-color 0.2s ease,box-shadow 0.2s ease,background 0.2s ease}input:focus,textarea:focus,select:focus{border-color:${C.acc}99!important;box-shadow:0 0 0 2px ${C.acc}22!important}tr{transition:background 0.15s ease}tr:hover{background:rgba(255,255,255,0.04)!important}div[style*="animation"]{will-change:opacity,transform}@media print{aside[role="navigation"],div[class*="splash"],div[class*="debug"],button[title="AI Fill"]{display:none!important}body,div{background:#fff!important;color:#000!important}div[style*="minHeight"]{display:block!important;padding:0!important}div[style*="marginLeft"]{margin-left:0!important}table{border:1px solid #999!important}th{background:#e8eaf6!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:15mm 12mm;size:A4}h1,h2,h3{page-break-after:avoid}tr{page-break-inside:avoid}::before{content:"AuditEngine v10 AURA · " attr(data-entity) " · " attr(data-fye);display:block;text-align:center;font-size:10pt;color:#1E3A5F;border-bottom:2px solid #1E3A5F;padding-bottom:6px;margin-bottom:12px}::after{content:"Generated by AuditEngine v10 AURA · Indus Nexus Limited";display:block;text-align:center;font-size:8pt;color:#666;border-top:1px solid #ccc;padding-top:6px;margin-top:20px;position:fixed;bottom:0;left:0;right:0}}@media(max-width:1200px){aside[role="navigation"]{width:52px!important}main[role="main"]{margin-left:52px!important}}@media(max-width:768px){aside[role="navigation"]{transform:translateX(-100%);width:268px!important}aside[role="navigation"].ae-mobile-open{transform:translateX(0)!important}main[role="main"]{margin-left:0!important}.ae-hamburger{display:flex!important}}`}</style>
      <button className="ae-hamburger" onClick={()=>setMobileMenuOpen(p=>!p)} style={{display:"none",position:"fixed",top:8,left:8,zIndex:200,width:36,height:36,borderRadius:8,background:CC.acc,border:"none",alignItems:"center",justifyContent:"center",fontSize:18,color:"#000",cursor:"pointer"}}>{mobileMenuOpen?"✕":"☰"}</button>
      <AuditSidebar/>
      <main role="main" aria-label="Working paper content" style={{marginLeft:sw,marginRight:aiOpen?420:agentPanelOpen?440:0,flex:1,minHeight:"100vh",transition:"margin 0.3s ease"}}>
        {archived&&<div style={{padding:"10px 32px",background:"rgba(239,83,80,0.08)",borderBottom:"1px solid rgba(239,83,80,0.2)",display:"flex",alignItems:"center",gap:10,fontSize:11,color:C.red,fontWeight:600}}>🔒 This engagement is archived per ISA 230.14. Modifications are locked. Assembly date: {new Date().toISOString().slice(0,10)}</div>}
        {reviewStatus&&!archived&&<div style={{padding:"8px 32px",background:"rgba(99,102,241,0.08)",borderBottom:"1px solid rgba(99,102,241,0.2)",display:"flex",alignItems:"center",gap:10,fontSize:11,color:"#A5B4FC",fontWeight:600}}>📋 Status: {reviewStatus}</div>}
        {cfg.configured&&<div style={{padding:"8px 32px",background:"linear-gradient(90deg,"+indAcc+"18,transparent)",borderBottom:"1px solid "+indAcc+"33",display:"flex",alignItems:"center",gap:20,fontSize:10,color:C.dim,flexWrap:"wrap"}}>
          <span style={{fontWeight:700,color:indAcc}}>{cfg.entityName}</span><span>FYE: {cfg.fye}</span><span>{ind?.ic} {ind?.l} — {cfg.sector}</span><span>{fw?.l}</span><span>£{cfg.materiality||"TBD"}</span>{cfg.engagementType&&<span style={{padding:"1px 8px",borderRadius:4,background:indAcc+"15",border:"1px solid "+indAcc+"33",color:indAcc,fontSize:9,fontWeight:600}}>{ET.find(e=>e.k===cfg.engagementType)?.l}</span>}<span style={{marginLeft:"auto",fontWeight:600,color:indAcc}}>{doneCount}/{totalWPs} complete</span>{lastSaveTime&&<span style={{fontSize:9,color:C.grn,fontWeight:600,display:"flex",alignItems:"center",gap:4}}><span style={{width:6,height:6,borderRadius:"50%",background:C.grn,display:"inline-block",animation:"pulseGlow 2s ease-in-out infinite"}}/>Saved {lastSaveTime}</span>}
        </div>}
        {curWP&&curWP.type!=="separator"&&activeWP!=="dashboard"&&<div style={{padding:"8px 32px",background:CC.card,borderBottom:"1px solid "+CC.brd,fontSize:11,color:CC.dim,display:"flex",alignItems:"center",gap:6}}>
          <span style={{color:CC.fnt}}>{getSectionName(curWP)}</span>
          <span style={{color:CC.fnt}}>›</span>
          <span style={{color:tc(curWP.type),fontWeight:600}}>{curWP.ref}</span>
          <span style={{color:CC.fnt}}>—</span>
          <span style={{color:CC.tx}}>{curWP.label}</span>
        </div>}
        <div style={{padding:"24px 32px",maxWidth:1100}}>
          {activeWP==="dashboard"?<Dashboard/>
          :activeWP==="engagement-planning"?<EngagementPlanning cfg={cfg} onConfigChange={setCfg} onComplete={(c)=>{setCfg({...c,configured:true});setActiveWP("dashboard");}} colors={CC}/>
          :activeWP==="review-dashboard"?<ReviewDashboard/>
          :curWP&&curWP.type!=="separator"?<div style={{animation:"fadeUp 0.4s ease-out"}}>
            <WPHead wp={curWP} buildWPCsv={buildWPCsv} callAI={callAI} handleSmartExtract={handleSmartExtract}/>
            <WPBody wp={curWP} buildExportCtx={buildExportCtx} getMappedTotals={getMappedTotals}/>
            <EvidenceTracker wpId={curWP.id}/>
            <div style={{marginTop:24,background:C.card,border:"1px solid "+C.brd,borderRadius:10,padding:16}}>
              <div style={{fontSize:10,color:C.acc,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700,marginBottom:8}}>Working Paper Notes</div>
              <textarea value={wpNotes[curWP.id]||""} onChange={e=>setWpNotes(p=>({...p,[curWP.id]:e.target.value}))} style={{...inp,minHeight:80,resize:"vertical"}} placeholder={"Document observations for "+curWP.label+"..."}/>
            </div>
          </div>:null}
        </div>
      </main>
      {cfg.configured&&!aiOpen&&!agentPanelOpen&&<div style={{position:"fixed",right:24,bottom:24,display:"flex",flexDirection:"column",gap:10,zIndex:150}}>
        <button onClick={()=>setAgentPanelOpen(true)} aria-label="Open Audit Agents" style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#10B981,#059669)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#fff",boxShadow:"0 4px 24px rgba(16,185,129,0.4)",transition:"transform 0.2s"}} title="Open Audit Agents">🤖</button>
        <button onClick={()=>setAiOpen(true)} aria-label="Open AURA AI Assistant (Ctrl+/)" style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#6366F1,#8B5CF6)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,color:"#fff",boxShadow:"0 4px 24px rgba(99,102,241,0.4)",animation:"pulseGlow 2s ease-in-out infinite",transition:"transform 0.2s"}} title="Open AURA AI Assistant (Ctrl+/)">💬</button>
      </div>}
      <AIPanel/>
      <AgentPanel/>
      <AddModal/>
      <SampleCalcModal/>
      <WelcomeWizard/>
      <ExtractPreviewModal/>
      <ToastNotification/>
      {cellHistoryKey&&<VersionHistoryModal cellKey={cellHistoryKey} changeLog={changeLog} onClose={()=>setCellHistoryKey(null)} colors={CC}/>}
      {showDebug&&<div style={{position:"fixed",top:60,right:24,width:360,background:"#0D1428",border:"1px solid "+C.acc+"44",borderRadius:12,padding:20,zIndex:999,boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontSize:14,color:C.acc,fontWeight:700}}>Debug Panel</div>
          <button onClick={()=>setShowDebug(false)} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:16}}>✕</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:11}}>
          {[
            ["Framework",fw?.l||"Not set"],
            ["Industry",ind?.l||"Not set"],
            ["Entity Size",sz?.l||"Not set"],
            ["Active WP",activeWP],
            ["Configured",String(cfg.configured)],
            ["Archived",String(archived)],
            ["cellData keys",Object.keys(cellData).length],
            ["signOffs count",Object.keys(signOffs).length],
            ["Render count",renderCount.current],
            ["Review Status",reviewStatus||"None"],
            ["Memory (MB)",typeof performance!=="undefined"&&performance.memory?Math.round(performance.memory.usedJSHeapSize/1048576):"N/A"],
            ["WPs Total",totalWPs],
            ["AI Trail",aiAuditTrail.length+" entries"]
          ].map(([k,v],i)=><div key={i} style={{padding:"6px 10px",borderRadius:6,background:"rgba(255,255,255,0.03)",border:"1px solid "+C.brd}}>
            <div style={{fontSize:9,color:C.fnt}}>{k}</div>
            <div style={{color:C.tx,fontWeight:600}}>{v}</div>
          </div>)}
        </div>
        {aiAuditTrail.length>0&&<div style={{marginTop:12}}>
          <button onClick={exportAITrail} style={{width:"100%",padding:"8px 12px",borderRadius:6,background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.3)",color:"#A5B4FC",cursor:"pointer",fontSize:10,fontWeight:600}}>Export AI Audit Trail ({aiAuditTrail.length} entries)</button>
          <div style={{marginTop:8,maxHeight:150,overflowY:"auto"}}>
            {aiAuditTrail.slice(-5).reverse().map((a,i)=><div key={i} style={{fontSize:9,color:C.dim,padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
              <span style={{color:C.acc}}>{a.id}</span> · {a.wpRef} · {a.timestamp.slice(11,16)} · {a.status}
            </div>)}
          </div>
        </div>}
      </div>}
    </div>
  );
}
