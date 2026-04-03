import { createContext, useContext } from "react";

interface WindowFocusContextType {
  windowId: string;
  isFocused: boolean;
}

const WindowFocusContext = createContext<WindowFocusContextType>({
  windowId: "",
  isFocused: false,
});

export function WindowFocusProvider({
  windowId,
  isFocused,
  children,
}: WindowFocusContextType & { children: React.ReactNode }) {
  return (
    <WindowFocusContext.Provider value={{ windowId, isFocused }}>
      {children}
    </WindowFocusContext.Provider>
  );
}

export function useWindowFocus() {
  return useContext(WindowFocusContext);
}
