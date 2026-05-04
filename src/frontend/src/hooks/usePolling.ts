import { useCallback, useEffect, useRef, useState } from "react";

interface PollingState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function usePolling<T>(
  fn: () => Promise<T>,
  intervalMs: number,
  enabled = true,
): PollingState<T> {
  const [state, setState] = useState<PollingState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  const fnRef = useRef(fn);
  fnRef.current = fn;

  const run = useCallback(async () => {
    try {
      const data = await fnRef.current();
      setState({ data, error: null, loading: false });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Polling error";
      setState((prev) => ({ ...prev, error: msg, loading: false }));
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    run();
    const id = setInterval(run, intervalMs);
    return () => clearInterval(id);
  }, [enabled, intervalMs, run]);

  return state;
}
