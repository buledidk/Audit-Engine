import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules/xlsx')) return 'vendor-xlsx';
          if (id.includes('node_modules/docx')) return 'vendor-docx';
          if (id.includes('node_modules/pdfkit') || id.includes('node_modules/pdfmake')) return 'vendor-pdf';
          if (id.includes('node_modules/exceljs')) return 'vendor-exceljs';
          if (id.includes('node_modules/react-dom')) return 'vendor-react';
          if (id.includes('node_modules/react-router')) return 'vendor-react';
          if (id.includes('node_modules/react/')) return 'vendor-react';
          // Data chunks — split large files into individual chunks to stay under 500KB
          if (id.includes('StandardsLibrary')) return 'data-standards-lib';
          if (id.includes('RegulatoryData')) return 'data-regulatory';
          if (id.includes('CrossReferenceIndex')) return 'data-crossref';
          if (id.includes('AuditMethodology')) return 'data-methodology';
          if (id.includes('TestingProgrammes') || id.includes('AdditionalWPs')) return 'data-testing';
          if (id.includes('ChartOfAccounts')) return 'data-coa';
          if (id.includes('IFRSEncyclopaedia')) return 'data-ifrs';
          if (id.includes('FRSEncyclopaedia')) return 'data-frs';
          if (id.includes('AuditResearch')) return 'data-research';
          if (id.includes('FinancialModels')) return 'data-models';
          if (id.includes('ComplianceFrameworks')) return 'data-compliance';
          // Export engine chunks
          if (id.includes('ExcelGenerator') || id.includes('WordGenerator') || id.includes('DocxExporter') || id.includes('ExportEngine') || id.includes('XlsxExporter')) return 'exporters';
          if (id.includes('demoSeed')) return 'demo-data';
        },
      },
    },
  },
})
