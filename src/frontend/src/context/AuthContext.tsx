import { type ReactNode, createContext, useContext, useMemo } from "react";
import {
  InternetIdentityProvider,
  useInternetIdentity,
} from "../hooks/useInternetIdentity";

/**
 * DEV_MODE = true → skip Internet Identity; use anonymous session.
 * Flip to false when you're ready for production II auth.
 */
export const DEV_MODE = true;

export interface AuthContextType {
  isAuthenticated: boolean;
  principal: string | null;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: DEV_MODE,
  principal: DEV_MODE ? "dev-mode" : null,
  login: () => {},
  logout: () => {},
  isLoading: false,
});

/**
 * Inner component that consumes InternetIdentityProvider
 * and exposes the simplified AuthContext.
 */
function AuthStateProvider({ children }: { children: ReactNode }) {
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();

  const isAuthenticated = DEV_MODE
    ? true
    : !!identity && !identity.getPrincipal().isAnonymous();

  const principal = DEV_MODE
    ? "dev-mode"
    : (identity?.getPrincipal().toString() ?? null);

  const isLoading = DEV_MODE ? false : isLoggingIn || isInitializing;

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

/**
 * Wrap your app tree with AuthProvider to get auth state everywhere.
 * It includes InternetIdentityProvider internally.
 */
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
