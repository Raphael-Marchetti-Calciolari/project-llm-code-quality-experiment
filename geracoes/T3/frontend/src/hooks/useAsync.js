import { useCallback, useEffect, useState } from "react";

// Executes `load` on mount/deps change and exposes { data, error, loading, setData }.
// `deps` must list every value captured by `load` (e.g. [slug]); `load` itself is not a dependency.
// `setData` accepts a value or an updater function (prev) => next.
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

  const setData = useCallback(
    (data) => setState((s) => ({ ...s, data: typeof data === "function" ? data(s.data) : data })),
    []
  );

  return { ...state, setData };
}
