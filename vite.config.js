import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/xlsx')) return 'vendor-xlsx';
          if (id.includes('node_modules/docx')) return 'vendor-docx';
          if (id.includes('node_modules/react-dom')) return 'vendor-react';
          if (id.includes('node_modules/react-router')) return 'vendor-react';
          if (id.includes('node_modules/react/')) return 'vendor-react';
          if (id.includes('StandardsLibrary') || id.includes('RegulatoryData') || id.includes('CrossReferenceIndex')) return 'data-standards';
          if (id.includes('AuditMethodology') || id.includes('TestingProgrammes') || id.includes('AdditionalWPs')) return 'data-methodology';
          if (id.includes('ChartOfAccounts') || id.includes('FRSEncyclopaedia') || id.includes('IFRSEncyclopaedia') || id.includes('AuditResearch')) return 'data-reference';
          if (id.includes('FinancialModels') || id.includes('ComplianceFrameworks')) return 'data-models';
          if (id.includes('ExcelGenerator') || id.includes('WordGenerator') || id.includes('DocxExporter') || id.includes('ExportEngine') || id.includes('XlsxExporter')) return 'exporters';
          if (id.includes('demoSeed')) return 'demo-data';
        },
      },
    },
  },
})
