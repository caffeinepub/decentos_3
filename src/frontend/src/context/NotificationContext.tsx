import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type NotifType = "info" | "success" | "error";

export interface OSNotification {
  id: string;
  title: string;
  message: string;
  type: NotifType;
  timestamp: number;
  read: boolean;
}

interface NotificationContextType {
  notifications: OSNotification[];
  addNotification: (title: string, message: string, type?: NotifType) => void;
  markAllRead: () => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const STORAGE_KEY = "decentos_notifications";
const MAX_NOTIFICATIONS = 50;

function load(): OSNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as OSNotification[];
  } catch {
    return [];
  }
}

function save(items: OSNotification[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function NotificationProvider({
  children,
}: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<OSNotification[]>(load);

  useEffect(() => {
    save(notifications);
  }, [notifications]);

  const addNotification = useCallback(
    (title: string, message: string, type: NotifType = "info") => {
      const item: OSNotification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        title,
        message,
        type,
        timestamp: Date.now(),
        read: false,
      };
      setNotifications((prev) => [item, ...prev].slice(0, MAX_NOTIFICATIONS));
    },
    [],
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAllRead,
        clearAll,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  return ctx;
}
