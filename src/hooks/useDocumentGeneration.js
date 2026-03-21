import { useState, useCallback, useEffect } from 'react';
import documentationGenerationService from '../services/documentationGenerationService';

/**
 * Hook for managing documentation generation and export
 * Handles auto-generation on phase completion
 */
export const useDocumentGeneration = () => {
  const [status, setStatus] = useState('idle');
  const [documents, setDocuments] = useState({});
  const [generatingPhase, setGeneratingPhase] = useState(null);

  useEffect(() => {
    const handleStarted = (data) => {
      setGeneratingPhase(data.phaseId);
      setStatus('generating');
    };

    const handleCompleted = (data) => {
      setDocuments(prev => ({
        ...prev,
        [data.phaseId]: {
          ...data,
          status: 'ready',
          generatedAt: new Date().toISOString()
        }
      }));
      setStatus('complete');
      setGeneratingPhase(null);
    };

    documentationGenerationService.on('documentation:started', handleStarted);
    documentationGenerationService.on('documentation:completed', handleCompleted);

    return () => {
      documentationGenerationService.off('documentation:started', handleStarted);
      documentationGenerationService.off('documentation:completed', handleCompleted);
    };
  }, []);

  const generateDocumentation = useCallback(async (phaseId, phaseData) => {
    try {
      return await documentationGenerationService.generateDocumentationForPhase(phaseId, phaseData);
    } catch (error) {
      setStatus('error');
      throw error;
    }
  }, []);

  const downloadDocument = useCallback(async (phaseId, format) => {
    try {
      if (format === 'excel') {
        return await documentationGenerationService.exportToExcel(phaseId);
      } else if (format === 'word') {
        return await documentationGenerationService.exportToWord(phaseId);
      } else if (format === 'pdf') {
        // PDF export would be similar
        console.log(`PDF export for ${phaseId} initiated`);
      }
    } catch (error) {
      setStatus('error');
      throw error;
    }
  }, []);

  return {
    status,
    documents,
    generatingPhase,
    generateDocumentation,
    downloadDocument,
    getGeneratedDocuments: documentationGenerationService.getGeneratedDocuments.bind(documentationGenerationService)
  };
};

export default useDocumentGeneration;
