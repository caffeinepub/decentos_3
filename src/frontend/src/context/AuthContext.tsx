import { type ReactNode, createContext, useContext, useMemo } from "react";
import {
  InternetIdentityProvider,
  useInternetIdentity,
} from "../hooks/useInternetIdentity";

/**
 * DEV_MODE = false → require Internet Identity login for full functionality.
 */
export const DEV_MODE = false;

export interface AuthContextType {
  isAuthenticated: boolean;
  principal: string | null;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  principal: null,
  login: () => {},
  logout: () => {},
  isLoading: false,
});

function AuthStateProvider({ children }: { children: ReactNode }) {
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const principal = identity?.getPrincipal().toString() ?? null;

  const isLoading = isLoggingIn || isInitializing;

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      principal,
      login,
      logout: clear,
      isLoading,
    }),
    [isAuthenticated, principal, login, clear, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <InternetIdentityProvider>
      <AuthStateProvider>{children}</AuthStateProvider>
    </InternetIdentityProvider>
  );
}

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
