import { useState, useEffect } from 'react';
import offlineSyncService from '../services/offlineSyncService';

/**
 * Hook for managing offline mode and sync operations
 * Provides real-time sync status and queue management
 */
export const useOfflineMode = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState({
    queueSize: 0,
    syncInProgress: false,
    pendingActions: []
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      const status = offlineSyncService.getSyncStatus();
      setSyncStatus({
        queueSize: status.queuedCount,
        syncInProgress: status.syncInProgress,
        pendingActions: status.pendingActions
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const handleSyncStarted = (data) => {
      setSyncStatus(prev => ({
        ...prev,
        syncInProgress: true,
        queueSize: data.queueSize
      }));
    };

    const handleSyncCompleted = () => {
      setSyncStatus(prev => ({
        ...prev,
        syncInProgress: false
      }));
    };

    const handleActionQueued = (action) => {
      setSyncStatus(prev => ({
        ...prev,
        queueSize: prev.queueSize + 1,
        pendingActions: [...prev.pendingActions, action]
      }));
    };

    offlineSyncService.on('connectivity:online', handleOnline);
    offlineSyncService.on('connectivity:offline', handleOffline);
    offlineSyncService.on('sync:started', handleSyncStarted);
    offlineSyncService.on('sync:completed', handleSyncCompleted);
    offlineSyncService.on('action:queued', handleActionQueued);

    return () => {
      offlineSyncService.off('connectivity:online', handleOnline);
      offlineSyncService.off('connectivity:offline', handleOffline);
      offlineSyncService.off('sync:started', handleSyncStarted);
      offlineSyncService.off('sync:completed', handleSyncCompleted);
      offlineSyncService.off('action:queued', handleActionQueued);
    };
  }, []);

  const queueAction = (actionId, action) => {
    return offlineSyncService.queueAction(actionId, action);
  };

  const syncNow = () => {
    return offlineSyncService.syncQueue();
  };

  return {
    isOnline,
    syncStatus,
    queueAction,
    syncNow,
    getSyncStatus: offlineSyncService.getSyncStatus.bind(offlineSyncService)
  };
};

export default useOfflineMode;
