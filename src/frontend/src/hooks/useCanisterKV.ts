import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "./useActor";

/**
 * useCanisterKV — wraps canister KV calls with localStorage fallback.
 *
 * On mount: loads from canister (kvGet), falls back to localStorage if actor unavailable.
 * set(value): saves to canister (kvSet) AND localStorage (belt+suspenders).
 * loading: true while initial load is in progress.
 */
export function useCanisterKV<T>(
  key: string,
  defaultValue: T,
): { data: T; set: (value: T) => void; loading: boolean } {
  const { actor, isFetching } = useActor();
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false);

  // Load on mount / when actor becomes available
  useEffect(() => {
    if (isFetching) return; // still loading actor
    if (initializedRef.current) return; // already loaded
    initializedRef.current = true;

    async function load() {
      try {
        if (actor) {
          const raw = await actor.kvGet(key);
          if (raw != null) {
            try {
              setData(JSON.parse(raw) as T);
              setLoading(false);
              return;
            } catch {
              // fall through to localStorage
            }
          }
        }
      } catch {
        // fall through to localStorage
      }

      // Fallback: localStorage
      try {
        const raw = localStorage.getItem(key);
        if (raw != null) {
          setData(JSON.parse(raw) as T);
        }
      } catch {
        // use defaultValue
      }
      setLoading(false);
    }

    load();
  }, [actor, isFetching, key]);

  const set = useCallback(
    (value: T) => {
      setData(value);
      const json = JSON.stringify(value);

      // Always write to localStorage immediately (never lose data)
      try {
        localStorage.setItem(key, json);
      } catch {
        // ignore storage quota errors
      }

      // Fire-and-forget canister write
      if (actor) {
        actor
          .kvSet(key, json)
          .then(() => {
            toast.success("Saved to chain ✓", { duration: 1500 });
          })
          .catch(() => {
            // Silently ignore — data is safe in localStorage
          });
      }
    },
    [actor, key],
  );

  return { data, set, loading };
}
