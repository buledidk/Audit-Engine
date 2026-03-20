/**
 * CUSTOM REACT HOOKS FOR API CALLS
 * Provides loading, error, and data state management for API operations
 */

import { useState, useCallback } from "react";

/**
 * Hook for executing API calls with loading/error handling
 */
export function useApiCall(apiFunction) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  return { execute, loading, error, data };
}

/**
 * Hook for fetching data on component mount
 */
export function useFetchData(apiFunction, dependencies = []) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  // Initial fetch
  useState(() => {
    refetch();
  }, dependencies);

  return { data, loading, error, refetch };
}

export default { useApiCall, useFetchData };
