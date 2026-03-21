import { useState, useCallback, useEffect } from 'react';
import integrationsService from '../services/integrationsService';

/**
 * Hook for managing external integrations
 * Provides real-time status and event tracking
 */
export const useIntegrations = () => {
  const [connections, setConnections] = useState({});
  const [activityLog, setActivityLog] = useState([]);
  const [isIntegrating, setIsIntegrating] = useState(false);

  useEffect(() => {
    // Load initial connection status
    const status = integrationsService.getConnectionStatus();
    setConnections(status);

    // Subscribe to integration events
    const handleIntegrationEvent = (data) => {
      const activity = {
        id: Date.now(),
        ...data,
        timestamp: new Date().toLocaleTimeString()
      };
      setActivityLog(prev => [activity, ...prev].slice(0, 20));
    };

    integrationsService.on('integration:slack-sent', handleIntegrationEvent);
    integrationsService.on('integration:github-issue-created', handleIntegrationEvent);
    integrationsService.on('integration:email-sent', handleIntegrationEvent);
    integrationsService.on('integration:aws-upload-complete', handleIntegrationEvent);

    return () => {
      integrationsService.off('integration:slack-sent', handleIntegrationEvent);
      integrationsService.off('integration:github-issue-created', handleIntegrationEvent);
      integrationsService.off('integration:email-sent', handleIntegrationEvent);
      integrationsService.off('integration:aws-upload-complete', handleIntegrationEvent);
    };
  }, []);

  const sendSlackNotification = useCallback(async (channel, message, findings) => {
    setIsIntegrating(true);
    try {
      return await integrationsService.notifySlack(channel, message, findings);
    } finally {
      setIsIntegrating(false);
    }
  }, []);

  const createGitHubIssue = useCallback(async (finding) => {
    setIsIntegrating(true);
    try {
      return await integrationsService.createGitHubIssue(finding);
    } finally {
      setIsIntegrating(false);
    }
  }, []);

  const sendEmailReport = useCallback(async (recipients, reportData) => {
    setIsIntegrating(true);
    try {
      return await integrationsService.sendEmailReport(recipients, reportData);
    } finally {
      setIsIntegrating(false);
    }
  }, []);

  const uploadToAWS = useCallback(async (bucket, files) => {
    setIsIntegrating(true);
    try {
      return await integrationsService.uploadToAWS(bucket, files);
    } finally {
      setIsIntegrating(false);
    }
  }, []);

  return {
    connections,
    activityLog,
    isIntegrating,
    sendSlackNotification,
    createGitHubIssue,
    sendEmailReport,
    uploadToAWS,
    getConnectionStatus: () => integrationsService.getConnectionStatus(),
    getEventLog: (limit) => integrationsService.getEventLog(limit)
  };
};

export default useIntegrations;
