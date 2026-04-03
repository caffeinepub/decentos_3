import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { UserProfile } from "../backend.d";
import { DEV_MODE } from "../context/AuthContext";
import { useOS } from "../context/OSContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { DecentOSLogo } from "./DecentOSLogo";

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 13) % 100}%`,
  duration: `${12 + (i % 8) * 2}s`,
  delay: `${(i * 1.3) % 8}s`,
  size: i % 3 === 0 ? 3 : 2,
}));

export function LoginScreen() {
  const { login: iiLogin, isLoggingIn, identity } = useInternetIdentity();
  const { actor } = useActor();
  const { setSession } = useOS();
  const [status, setStatus] = useState<"idle" | "initializing" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    setStatus("idle");
    setErrorMsg("");
    try {
      await iiLogin();
    } catch {
      setStatus("error");
      setErrorMsg("Login failed. Please try again.");
    }
  };

  const handleDevMode = () => {
    setSession({
      principal: "dev-mode",
      displayName: "Developer",
      cyclesBalance: BigInt(1_000_000_000),
    });
  };

  useEffect(() => {
    if (!identity || !actor || status !== "idle") return;

    const initSession = async () => {
      setStatus("initializing");
      try {
        const principal = identity.getPrincipal();
        const profile: UserProfile = {
          id: principal,
          username: `user_${principal.toString().slice(0, 6)}`,
          displayName: `User_${principal.toString().slice(0, 6)}`,
          createdAt: BigInt(Date.now()) * BigInt(1_000_000),
          darkMode: false,
          cycles: BigInt(1000000),
          updatedAt: BigInt(Date.now()) * BigInt(1_000_000),
        };
        await actor.saveCallerUserProfile(profile);
        const [saved, cycles] = await Promise.all([
          actor.getCallerUserProfile(),
          actor.getCyclesBalance(),
        ]);
        const displayName = saved?.displayName ?? profile.displayName;
        setSession({
          principal: principal.toString(),
          displayName,
          cyclesBalance: cycles,
        });
      } catch (err) {
        console.error(err);
        setStatus("error");
        setErrorMsg("Failed to initialize session. Please try again.");
      }
    };

    initSession();
  }, [identity, actor, status, setSession]);

  const isLoading = isLoggingIn || status === "initializing";

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0B0F12 0%, #0F1820 50%, #0B0F12 100%)",
      }}
    >
      {/* Subtle scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="particle absolute rounded-full"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay,
              background: "rgba(99,102,241,0.5)",
            }}
          />
        ))}
      </div>

      {/* Atmospheric glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(99,102,241,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Login card */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="os-window w-[380px] p-8 flex flex-col items-center gap-6"
          data-ocid="login.card"
        >
          {/* Logo + Title */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.25)",
              }}
            >
              <DecentOSLogo size={40} color="rgba(165,180,252,0.95)" />
            </div>
            <div className="text-center">
              <h1
                className="text-2xl font-bold tracking-tight"
                style={{
                  color: "var(--os-text-primary, #f1f5f9)",
                  fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
                }}
              >
                DecentOS
              </h1>
              <p
                className="text-xs mt-1 tracking-wider"
                style={{ color: "var(--os-text-muted, rgba(148,163,184,0.7))" }}
              >
                Decentralized · On-chain · Yours
              </p>
            </div>
          </div>

          {/* Divider */}
          <div
            className="w-full h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)",
            }}
          />

          {/* Network info */}
          <div className="w-full text-center">
            <p
              className="text-xs font-mono leading-relaxed"
              style={{ color: "var(--os-text-muted, rgba(148,163,184,0.6))" }}
            >
              Internet Computer Protocol · v1.0
            </p>
          </div>

          {/* Primary action: Internet Identity */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
            data-ocid="login.primary_button"
            className="w-full h-11 rounded-lg font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
            style={{
              background: isLoading
                ? "rgba(99,102,241,0.1)"
                : "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.4)",
              color: "rgba(165,180,252,1)",
              boxShadow: isLoading ? "none" : "0 0 24px rgba(99,102,241,0.12)",
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Connecting...
              </>
            ) : (
              "Sign in with Internet Identity"
            )}
          </button>

          {/* Dev Mode shortcut — only shown when DEV_MODE is enabled */}
          {DEV_MODE && (
            <button
              type="button"
              onClick={handleDevMode}
              data-ocid="login.secondary_button"
              className="w-full h-9 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                background: "rgba(217,119,6,0.08)",
                border: "1px solid rgba(217,119,6,0.25)",
                color: "rgba(251,191,36,0.8)",
              }}
            >
              ⚡ Continue as Guest (Dev Mode)
            </button>
          )}

          {status === "error" && (
            <p
              className="text-xs text-destructive text-center"
              data-ocid="login.error_state"
            >
              {errorMsg}
            </p>
          )}

          <p
            className="text-[10px] text-center"
            style={{ color: "var(--os-text-muted, rgba(148,163,184,0.4))" }}
          >
            Secured by Internet Identity · No passwords · No tracking
          </p>
        </motion.div>
      </div>

      {/* Version footer */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono"
        style={{ color: "rgba(148,163,184,0.3)" }}
      >
        DecentOS v1.0 · Powered by Internet Computer
      </div>
    </div>
  );
}
