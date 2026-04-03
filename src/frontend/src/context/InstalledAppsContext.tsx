import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "decentos_installed_apps";

export interface InstalledApp {
  id: number;
  appId: string;
  name: string;
  emoji: string;
  emojiColor: string;
}

function loadFromStorage(): InstalledApp[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as InstalledApp[];
  } catch {
    return [];
  }
}

function saveToStorage(apps: InstalledApp[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch {}
}

interface InstalledAppsContextValue {
  installedApps: InstalledApp[];
  installedIds: Set<number>;
  install: (app: InstalledApp) => void;
  uninstall: (id: number) => void;
}

const InstalledAppsContext = createContext<InstalledAppsContextValue | null>(
  null,
);

export function InstalledAppsProvider({
  children,
}: { children: React.ReactNode }) {
  // Lazy initializer calls loadFromStorage() exactly once — no double-init useEffect needed
  const [installedApps, setInstalledApps] = useState<InstalledApp[]>(() =>
    loadFromStorage(),
  );

  const installedIds = useMemo(
    () => new Set(installedApps.map((a) => a.id)),
    [installedApps],
  );

  const install = useCallback((app: InstalledApp) => {
    setInstalledApps((prev) => {
      if (prev.some((a) => a.id === app.id)) return prev;
      const updated = [...prev, app];
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const uninstall = useCallback((id: number) => {
    setInstalledApps((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  return (
    <InstalledAppsContext.Provider
      value={{ installedApps, installedIds, install, uninstall }}
    >
      {children}
    </InstalledAppsContext.Provider>
  );
}

export function useInstalledApps(): InstalledAppsContextValue {
  const ctx = useContext(InstalledAppsContext);
  if (!ctx)
    throw new Error(
      "useInstalledApps must be used within InstalledAppsProvider",
    );
  return ctx;
}
