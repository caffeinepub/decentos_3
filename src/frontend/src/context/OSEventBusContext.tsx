import type React from "react";
import { createContext, useCallback, useContext, useRef } from "react";

type EventHandler = (payload: unknown) => void;

interface OSEventBusContextType {
  emit: (event: string, payload?: unknown) => void;
  subscribe: (event: string, handler: EventHandler) => () => void;
}

const OSEventBusContext = createContext<OSEventBusContextType | null>(null);

export function OSEventBusProvider({
  children,
}: { children: React.ReactNode }) {
  const listenersRef = useRef<Map<string, Set<EventHandler>>>(new Map());

  const emit = useCallback((event: string, payload?: unknown) => {
    const handlers = listenersRef.current.get(event);
    if (handlers) {
      for (const h of handlers) {
        h(payload);
      }
    }
  }, []);

  const subscribe = useCallback((event: string, handler: EventHandler) => {
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, new Set());
    }
    listenersRef.current.get(event)!.add(handler);
    return () => {
      listenersRef.current.get(event)?.delete(handler);
    };
  }, []);

  return (
    <OSEventBusContext.Provider value={{ emit, subscribe }}>
      {children}
    </OSEventBusContext.Provider>
  );
}

export function useOSEventBus() {
  const ctx = useContext(OSEventBusContext);
  if (!ctx)
    throw new Error("useOSEventBus must be used within OSEventBusProvider");
  return ctx;
}
