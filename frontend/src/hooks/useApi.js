import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for data fetching with loading, error, and isDemo states.
 * 
 * @param {Function} apiFunc - Async function returning { data, isDemo, error? }
 * @param {Array} deps - Dependency array triggering refetch
 * @param {boolean} immediate - Whether to execute immediately on mount
 */
export function useApi(apiFunc, deps = [], immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (...args) => {
    if (!apiFunc) return;
    
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunc(...args);
      if (isMountedRef.current) {
        setData(result.data);
        setIsDemo(!!result.isDemo);
        if (result.error && !result.data) {
          setError(result.error);
        }
      }
      return result;
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message || 'Unknown network error');
      }
      throw err;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [apiFunc]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    data,
    loading,
    error,
    isDemo,
    refetch: execute
  };
}
