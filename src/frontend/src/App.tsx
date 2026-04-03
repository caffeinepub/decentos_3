import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Desktop } from "./components/Desktop";
import LandingPage from "./components/LandingPage";
import { LoginScreen } from "./components/LoginScreen";
import { AuthProvider, DEV_MODE, useAuth } from "./context/AuthContext";
import { ClipboardProvider } from "./context/ClipboardContext";
import { FolderProvider } from "./context/FolderContext";
import { InstalledAppsProvider } from "./context/InstalledAppsContext";
import { NotificationProvider } from "./context/NotificationContext";
import { OSProvider } from "./context/OSContext";
import { OSEventBusProvider } from "./context/OSEventBusContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 10_000,
    },
  },
});

const DEV_SESSION = {
  principal: "dev-mode",
  displayName: "Developer",
  cyclesBalance: BigInt(1_000_000_000),
};

/**
 * Inner OS shell — only rendered when authenticated (or DEV_MODE).
 */
function OSShell() {
  useEffect(() => {
    const prefetch = () => {
      import("./components/apps/Notes");
      import("./components/apps/Calendar");
      import("./components/apps/Spreadsheet");
      import("./components/apps/WordProcessor");
      import("./components/apps/PasswordManager");
    };
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(prefetch, { timeout: 3000 });
    } else {
      setTimeout(prefetch, 2000);
    }
  }, []);

  return (
    <NotificationProvider>
      <OSEventBusProvider>
        <OSProvider initialSession={DEV_SESSION}>
          <InstalledAppsProvider>
            <ClipboardProvider>
              <FolderProvider>
                <Desktop />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    style: {
                      background: "rgba(22, 22, 28, 0.95)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "#E8EEF2",
                      backdropFilter: "blur(12px)",
                    },
                  }}
                />
              </FolderProvider>
            </ClipboardProvider>
          </InstalledAppsProvider>
        </OSProvider>
      </OSEventBusProvider>
    </NotificationProvider>
  );
}

/**
 * Auth gate — shows LoginScreen if not authenticated (only in non-DEV_MODE).
 */
function AuthGate() {
  const { isAuthenticated, isLoading } = useAuth();

  // DEV_MODE: skip login entirely
  if (DEV_MODE) return <OSShell />;

  // Non-DEV_MODE: gate on authentication
  if (!isAuthenticated && !isLoading) return <LoginScreen />;

  return <OSShell />;
}

export default function App() {
  const [launched, setLaunched] = useState(false);

  if (!launched) {
    return <LandingPage onLaunch={() => setLaunched(true)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </QueryClientProvider>
  );
}
