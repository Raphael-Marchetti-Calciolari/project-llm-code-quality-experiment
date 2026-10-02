import { useEffect, useState } from "react";

// Executes `load` on mount/deps change and exposes { data, error, loading, setData }.
export function useAsync(load, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, error: null, loading: true });
    load()
      .then((data) => !cancelled && setState({ data, error: null, loading: false }))
      .catch((error) => !cancelled && setState({ data: null, error, loading: false }));
    return () => {
      cancelled = true;
    };
  }, deps);

  return {
    ...state,
    setData: (data) => setState((s) => ({ ...s, data })),
  };
}
