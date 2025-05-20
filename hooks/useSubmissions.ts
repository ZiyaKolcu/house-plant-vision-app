import { useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useRef, useState } from 'react';
import { fetchData } from '../app/utils/api';

export default function useSubmissions() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const isMounted = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [forceRefresh, setForceRefresh] = useState(0);

  const cleanupRequests = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const createAbortController = () => {
    cleanupRequests();
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current.signal;
  };

  const triggerRefresh = useCallback(() => {
    setForceRefresh((prev) => prev + 1);
  }, []);

  const fetchSubmissions = useCallback(async () => {
    if (!isMounted.current) return;

    setLoading(true);
    setError(null);

    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) {
        if (isMounted.current) {
          setError('Authentication token not found. Please sign in again.');
          setLoading(false);
        }
        return;
      }

      if (isMounted.current) {
        setAuthToken(token);
      }

      const signal = createAbortController();

      const data = await fetchData<any[]>('http://192.168.1.101:8000/api/v1/submissions/my', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal,
      });

      if (!isMounted.current) return;

      if (Array.isArray(data)) {
        setSubmissions(data);
      } else {
        setError('Received invalid data format from server');
        console.error('Invalid submissions data format:', data);
      }
    } catch (e) {
      if ((e as any)?.name === 'AbortError' || !isMounted.current) return;

      console.error('Error fetching submissions:', e);
      setError(
        `Failed to load submissions: ${
          (e as Error)?.message || 'Unknown error'
        }`
      );
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      isMounted.current = true;
      fetchSubmissions();

      return () => {
        isMounted.current = false;
        cleanupRequests();
      };
    }, [forceRefresh, fetchSubmissions])
  );

  return {
    submissions,
    loading,
    error,
    authToken,
    triggerRefresh,
  };
}
