/**
 * useAgentMetrics Hook
 * React hook for accessing real-time agent monitoring metrics
 * Automatically updates every 2 seconds or subscribes to WebSocket updates
 */

import { useState, useEffect, useCallback } from 'react';

export const useAgentMetrics = (autoRefresh = true, refreshInterval = 2000) => {
  const [agents, setAgents] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  /**
   * Fetch metrics from API
   */
  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/metrics/dashboard');
      if (!response.ok) throw new Error('Failed to fetch metrics');

      const data = await response.json();

      if (data.success && data.dashboard) {
        const dashboard = data.dashboard;

        setAgents(dashboard.agents || []);
        setSystemHealth(dashboard.systemHealth);
        setMetrics(dashboard.metrics);
        setAlerts(dashboard.metrics.alerts || []);
        setLastUpdated(new Date().toISOString());
      }

      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching metrics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get specific agent metrics
   */
  const getAgentMetrics = useCallback(async (agentName) => {
    try {
      const response = await fetch(`/api/metrics/agents/${agentName}`);
      if (!response.ok) throw new Error(`Failed to fetch metrics for ${agentName}`);

      const data = await response.json();
      return data.success ? data : null;
    } catch (err) {
      console.error(`Error fetching metrics for ${agentName}:`, err);
      return null;
    }
  }, []);

  /**
   * Acknowledge alert
   */
  const acknowledgeAlert = useCallback(async (alertId) => {
    try {
      const response = await fetch(`/api/metrics/alerts/${alertId}/acknowledge`, {
        method: 'POST'
      });

      if (response.ok) {
        // Remove acknowledged alert from local state
        setAlerts(prev => prev.filter(a => a.id !== alertId));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error acknowledging alert:', err);
      return false;
    }
  }, []);

  /**
   * Reset recovery for agent
   */
  const resetAgentRecovery = useCallback(async (agentName) => {
    try {
      const response = await fetch(`/api/metrics/recovery/${agentName}/reset`, {
        method: 'POST'
      });

      if (response.ok) {
        // Refresh metrics after reset
        await fetchMetrics();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error resetting recovery:', err);
      return false;
    }
  }, [fetchMetrics]);

  /**
   * Enable/disable auto-recovery
   */
  const setAutoRecovery = useCallback(async (enabled) => {
    try {
      const action = enabled ? 'enable' : 'disable';
      const response = await fetch(`/api/metrics/recovery/auto-recovery/${action}`, {
        method: 'POST'
      });

      if (response.ok) {
        await fetchMetrics();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error setting auto-recovery:', err);
      return false;
    }
  }, [fetchMetrics]);

  /**
   * Admin restart agent
   */
  const restartAgent = useCallback(async (agentName) => {
    try {
      const response = await fetch(`/api/admin/agents/${agentName}/restart`, {
        method: 'POST'
      });

      if (response.ok) {
        await fetchMetrics();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error restarting agent:', err);
      return false;
    }
  }, [fetchMetrics]);

  /**
   * Perform health check
   */
  const performHealthCheck = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/health-check', {
        method: 'POST'
      });

      if (response.ok) {
        const data = await response.json();
        await fetchMetrics();
        return data.health;
      }
      return null;
    } catch (err) {
      console.error('Error performing health check:', err);
      return null;
    }
  }, [fetchMetrics]);

  /**
   * Export metrics data
   */
  const exportMetrics = useCallback(async () => {
    try {
      const response = await fetch('/api/metrics/export');
      if (!response.ok) throw new Error('Failed to export metrics');

      // Trigger file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `monitoring-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return true;
    } catch (err) {
      console.error('Error exporting metrics:', err);
      return false;
    }
  }, []);

  /**
   * Setup auto-refresh
   */
  useEffect(() => {
    // Initial fetch
    fetchMetrics();

    if (!autoRefresh) return;

    // Setup auto-refresh interval
    const interval = setInterval(fetchMetrics, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchMetrics]);

  return {
    // State
    agents,
    systemHealth,
    metrics,
    alerts,
    loading,
    error,
    lastUpdated,

    // Methods
    fetchMetrics,
    getAgentMetrics,
    acknowledgeAlert,
    resetAgentRecovery,
    setAutoRecovery,
    restartAgent,
    performHealthCheck,
    exportMetrics
  };
};

export default useAgentMetrics;
