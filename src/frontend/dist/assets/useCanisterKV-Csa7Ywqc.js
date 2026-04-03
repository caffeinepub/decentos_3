import { i as useActor, r as reactExports, g as ue } from "./index-CZGIn5x2.js";
function useCanisterKV(key, defaultValue) {
  const { actor, isFetching } = useActor();
  const [data, setData] = reactExports.useState(defaultValue);
  const [loading, setLoading] = reactExports.useState(true);
  const initializedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (isFetching) return;
    if (initializedRef.current) return;
    initializedRef.current = true;
    async function load() {
      try {
        if (actor) {
          const raw = await actor.kvGet(key);
          if (raw != null) {
            try {
              setData(JSON.parse(raw));
              setLoading(false);
              return;
            } catch {
            }
          }
        }
      } catch {
      }
      try {
        const raw = localStorage.getItem(key);
        if (raw != null) {
          setData(JSON.parse(raw));
        }
      } catch {
      }
      setLoading(false);
    }
    load();
  }, [actor, isFetching, key]);
  const set = reactExports.useCallback(
    (value) => {
      setData(value);
      const json = JSON.stringify(value);
      try {
        localStorage.setItem(key, json);
      } catch {
      }
      if (actor) {
        actor.kvSet(key, json).then(() => {
          ue.success("Saved to chain ✓", { duration: 1500 });
        }).catch(() => {
        });
      }
    },
    [actor, key]
  );
  return { data, set, loading };
}
export {
  useCanisterKV as u
};
