import { useEffect, useState } from "react";

/**
 * Browser-only persistence for the demo data. Reads storage after mount so the
 * server render and first client render match (no hydration mismatch), and only
 * writes back once the saved value has been loaded.
 */
export function usePersistentState<T>(key: string, initialValue: T, isValid: (value: unknown) => value is T = (v): v is T => Array.isArray(v) === Array.isArray(initialValue)) {
  const [value, setValue] = useState<T>(initialValue);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(key);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        // Ignore saved data of the wrong shape instead of crashing the screen.
        if (isValid(parsed)) setValue(parsed);
      }
    } catch {
      // Corrupt or unavailable storage: keep the initial demo data.
    }
    setLoaded(true);
  }, [key]);
  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or blocked: changes stay in memory for this session.
    }
  }, [key, value, loaded]);
  return [value, setValue] as const;
}
