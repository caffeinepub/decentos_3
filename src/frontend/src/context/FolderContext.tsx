import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface DesktopFolder {
  id: string;
  name: string;
  appIds: string[];
  category: string;
}

const FOLDERS_KEY = "decentos_folders";

const DEFAULT_FOLDERS: DesktopFolder[] = [
  {
    id: "folder_devtools",
    name: "Developer Tools",
    appIds: [
      "jsonformatter",
      "base64tool",
      "colorpicker",
      "regextester",
      "hashgenerator",
      "baseconverter",
      "difftool",
      "codesnippets",
    ],
    category: "Developer",
  },
  {
    id: "folder_finance",
    name: "Finance Suite",
    appIds: [
      "loancalc",
      "splitter",
      "personalfinance",
      "financedashboard",
      "networth",
      "subscriptions",
    ],
    category: "Finance",
  },
  {
    id: "folder_health",
    name: "Health & Wellness",
    appIds: [
      "sleeptracker",
      "watertracker",
      "moodtracker",
      "habitpro",
      "habitcalendar",
    ],
    category: "Health",
  },
];

function loadFolders(): DesktopFolder[] {
  try {
    const raw = localStorage.getItem(FOLDERS_KEY);
    if (raw) return JSON.parse(raw) as DesktopFolder[];
  } catch {
    // ignore
  }
  return DEFAULT_FOLDERS;
}

function saveFolders(folders: DesktopFolder[]) {
  try {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  } catch {
    // ignore
  }
}

interface FolderContextValue {
  folders: DesktopFolder[];
  addFolder: (name: string, category: string) => void;
  removeFolder: (id: string) => void;
  addAppToFolder: (folderId: string, appId: string) => void;
  removeAppFromFolder: (folderId: string, appId: string) => void;
}

const FolderContext = createContext<FolderContextValue | null>(null);

export function FolderProvider({ children }: { children: React.ReactNode }) {
  const [folders, setFolders] = useState<DesktopFolder[]>(loadFolders);

  const update = useCallback((updated: DesktopFolder[]) => {
    setFolders(updated);
    saveFolders(updated);
  }, []);

  const addFolder = useCallback(
    (name: string, category: string) => {
      update([
        ...folders,
        {
          id: `folder_${Date.now()}`,
          name,
          appIds: [],
          category,
        },
      ]);
    },
    [folders, update],
  );

  const removeFolder = useCallback(
    (id: string) => {
      update(folders.filter((f) => f.id !== id));
    },
    [folders, update],
  );

  const addAppToFolder = useCallback(
    (folderId: string, appId: string) => {
      update(
        folders.map((f) =>
          f.id === folderId && !f.appIds.includes(appId)
            ? { ...f, appIds: [...f.appIds, appId] }
            : f,
        ),
      );
    },
    [folders, update],
  );

  const removeAppFromFolder = useCallback(
    (folderId: string, appId: string) => {
      update(
        folders.map((f) =>
          f.id === folderId
            ? { ...f, appIds: f.appIds.filter((id) => id !== appId) }
            : f,
        ),
      );
    },
    [folders, update],
  );

  const value = useMemo(
    () => ({
      folders,
      addFolder,
      removeFolder,
      addAppToFolder,
      removeAppFromFolder,
    }),
    [folders, addFolder, removeFolder, addAppToFolder, removeAppFromFolder],
  );

  return (
    <FolderContext.Provider value={value}>{children}</FolderContext.Provider>
  );
}

export function useFolders(): FolderContextValue {
  const ctx = useContext(FolderContext);
  if (!ctx) throw new Error("useFolders must be used inside FolderProvider");
  return ctx;
}
