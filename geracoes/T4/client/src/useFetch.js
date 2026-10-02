import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';

export function useFetch(path) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const [reloadCount, setReloadCount] = useState(0);
  const reload = useCallback(() => setReloadCount((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, error: null, loading: true }));
    api(path)
      .then((data) => !cancelled && setState({ data, error: null, loading: false }))
      .catch((error) => !cancelled && setState({ data: null, error, loading: false }));
    return () => { cancelled = true; };
  }, [path, reloadCount]);

  return { ...state, reload };
}
