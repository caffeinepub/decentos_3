import {
  Check,
  Copy,
  Eye,
  EyeOff,
  FileDown,
  Lock,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCanisterKV } from "../../hooks/useCanisterKV";

type CredentialCategory = "Work" | "Personal" | "Finance" | "Social" | "Other";

interface Credential {
  id: string;
  site: string;
  username: string;
  password: string;
  category?: CredentialCategory;
  lastUsed?: number;
  updatedAt?: number;
  history?: Array<{ password: string; changedAt: number }>;
}

const CATEGORIES: CredentialCategory[] = [
  "Work",
  "Personal",
  "Finance",
  "Social",
  "Other",
];

const CATEGORY_COLORS: Record<CredentialCategory, string> = {
  Work: "rgba(59,130,246,0.8)",
  Personal: "rgba(168,85,247,0.8)",
  Finance: "rgba(34,197,94,0.8)",
  Social: "rgba(249,115,22,0.8)",
  Other: "rgba(148,163,184,0.8)",
};

const CATEGORY_BG: Record<CredentialCategory, string> = {
  Work: "rgba(59,130,246,0.1)",
  Personal: "rgba(168,85,247,0.1)",
  Finance: "rgba(34,197,94,0.1)",
  Social: "rgba(249,115,22,0.1)",
  Other: "rgba(148,163,184,0.1)",
};

const COMMON_PASSWORDS = new Set([
  "password",
  "123456",
  "qwerty",
  "password123",
  "admin",
  "letmein",
  "welcome",
  "monkey",
  "12345678",
  "dragon",
  "master",
  "login",
  "pass",
  "1234",
  "abc123",
  "111111",
]);

function isBreached(password: string): boolean {
  return COMMON_PASSWORDS.has(password.toLowerCase());
}

let credCounter = 0;

type VaultState = "locked" | "setup" | "unlocked";

function calcPasswordStrength(pw: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!pw) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Weak", color: "#EF4444" };
  if (score <= 2) return { score, label: "Fair", color: "#F97316" };
  if (score <= 3) return { score, label: "Good", color: "#EAB308" };
  return { score, label: "Strong", color: "#22C55E" };
}

function PasswordHealthView({
  credentials,
  onFilterSelect,
}: {
  credentials: Credential[];
  onFilterSelect?: (filter: "weak" | "reused" | "old" | "breached") => void;
}) {
  const stats = credentials.reduce(
    (acc, c) => {
      const b = getStrengthBadge(c.password);
      if (b.label === "Strong") acc.strong++;
      else if (b.label === "Fair") acc.fair++;
      else if (b.label === "Weak") acc.weak++;
      return acc;
    },
    { strong: 0, fair: 0, weak: 0 },
  );

  const weakCreds = credentials.filter(
    (c) => getStrengthBadge(c.password).label === "Weak",
  );
  const fairCreds = credentials.filter(
    (c) => getStrengthBadge(c.password).label === "Fair",
  );
  const reusedPasswords = credentials.filter((c) => {
    const count = credentials.filter((x) => x.password === c.password).length;
    return count > 1;
  });
  const oldPasswords = credentials.filter((c) => {
    if (!c.updatedAt) return false;
    const days = (Date.now() - c.updatedAt) / (1000 * 60 * 60 * 24);
    return days > 90;
  });
  const breachedCreds = credentials.filter((c) => isBreached(c.password));

  return (
    <div className="py-3 space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Strong", count: stats.strong, color: "#22C55E", dot: "🟢" },
          { label: "Fair", count: stats.fair, color: "#F97316", dot: "🟡" },
          { label: "Weak", count: stats.weak, color: "#EF4444", dot: "🔴" },
        ].map(({ label, count, color, dot }) => (
          <div
            key={label}
            className="rounded-xl p-3 text-center"
            style={{
              background: `${color}10`,
              border: `1px solid ${color}33`,
            }}
          >
            <div className="text-lg mb-0.5">{dot}</div>
            <div className="text-xl font-bold" style={{ color }}>
              {count}
            </div>
            <div
              className="text-[10px]"
              style={{ color: "var(--os-text-secondary)" }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Reused / Old / Breached summary */}
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            label: "Reused",
            count: reusedPasswords.length,
            color: "#F97316",
            filter: "reused" as const,
            icon: "🔁",
          },
          {
            label: "Outdated",
            count: oldPasswords.length,
            color: "#EAB308",
            filter: "old" as const,
            icon: "📅",
          },
          {
            label: "Breached",
            count: breachedCreds.length,
            color: "#F97316",
            filter: "breached" as const,
            icon: "⚠️",
          },
        ].map(({ label, count, color, filter, icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => onFilterSelect?.(filter)}
            className="rounded-xl p-2.5 text-center transition-all hover:opacity-80"
            style={{ background: `${color}10`, border: `1px solid ${color}33` }}
          >
            <div className="text-base mb-0.5">{icon}</div>
            <div className="text-lg font-bold" style={{ color }}>
              {count}
            </div>
            <div
              className="text-[10px]"
              style={{ color: "var(--os-text-secondary)" }}
            >
              {label}
            </div>
          </button>
        ))}
      </div>

      {/* Weak passwords */}
      {weakCreds.length > 0 && (
        <div>
          <p
            className="text-[10px] font-semibold mb-2 uppercase tracking-wide"
            style={{ color: "#EF4444" }}
          >
            🔴 Weak passwords — update these
          </p>
          <div className="space-y-1">
            {weakCreds.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                <span className="text-foreground/80 truncate flex-1">
                  {c.site}
                </span>
                <span style={{ color: "var(--os-text-secondary)" }}>
                  {c.username}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fair passwords */}
      {fairCreds.length > 0 && (
        <div>
          <p
            className="text-[10px] font-semibold mb-2 uppercase tracking-wide"
            style={{ color: "#F97316" }}
          >
            🟡 Fair passwords — could be stronger
          </p>
          <div className="space-y-1">
            {fairCreds.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs"
                style={{
                  background: "rgba(249,115,22,0.08)",
                  border: "1px solid rgba(249,115,22,0.2)",
                }}
              >
                <span className="text-foreground/80 truncate flex-1">
                  {c.site}
                </span>
                <span style={{ color: "var(--os-text-secondary)" }}>
                  {c.username}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {credentials.length === 0 && (
        <div className="flex flex-col items-center py-12 gap-3">
          <div className="text-4xl">🔐</div>
          <p className="text-xs text-muted-foreground/50">
            No credentials yet — add some to see health analysis
          </p>
        </div>
      )}

      {credentials.length > 0 &&
        weakCreds.length === 0 &&
        fairCreds.length === 0 && (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="text-4xl">✅</div>
            <p className="text-xs" style={{ color: "#22C55E" }}>
              All passwords are strong — great work!
            </p>
          </div>
        )}
    </div>
  );
}

function getStrengthBadge(pw: string): {
  label: string;
  color: string;
  dot: string;
} {
  if (!pw) return { label: "—", color: "var(--os-text-muted)", dot: "⚫" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: "Weak", color: "#EF4444", dot: "🔴" };
  if (score <= 3) return { label: "Fair", color: "#F97316", dot: "🟡" };
  return { label: "Strong", color: "#22C55E", dot: "🟢" };
}

export function PasswordManager() {
  const [vaultState, setVaultState] = useState<VaultState>("setup");
  const [activeTab, setActiveTab] = useState<"credentials" | "health">(
    "credentials",
  );
  const [healthFilter, setHealthFilter] = useState<
    "weak" | "reused" | "old" | "breached" | null
  >(null);
  const [masterPin, setMasterPin] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const {
    data: persistedCreds,
    set: persistCreds,
    loading: credsLoading,
  } = useCanisterKV<Credential[]>("passwords_data", []);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const credsHydratedRef = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: hydrate once
  useEffect(() => {
    if (credsHydratedRef.current) return;
    credsHydratedRef.current = true;
    if (persistedCreds.length > 0) setCredentials(persistedCreds);
  }, [persistedCreds, credsLoading]);

  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [credSearch, setCredSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    CredentialCategory | "All"
  >("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [newSite, setNewSite] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newCategory, setNewCategory] =
    useState<CredentialCategory>("Personal");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [genLength, setGenLength] = useState(16);
  const [genSymbols, setGenSymbols] = useState(true);
  const [genNumbers, setGenNumbers] = useState(true);
  const [genUppercase, setGenUppercase] = useState(true);
  const [generatedPw, setGeneratedPw] = useState("");
  const pinInputRef = useRef<HTMLInputElement>(null);
  const siteInputRef = useRef<HTMLInputElement>(null);
  const [copiedIds, setCopiedIds] = useState<Set<string>>(new Set());
  const [showHistoryFor, setShowHistoryFor] = useState<string | null>(null);
  const [historyRevealIds, setHistoryRevealIds] = useState<Set<string>>(
    new Set(),
  );

  const { data: savedAutoLock, set: saveAutoLock } = useCanisterKV<number>(
    "decent_pm_autolock",
    0,
  );
  const [autoLockMinutes, setAutoLockMinutes] = useState<number>(0);
  const autoLockHydratedRef = useRef(false);
  useEffect(() => {
    if (autoLockHydratedRef.current) return;
    autoLockHydratedRef.current = true;
    setAutoLockMinutes(savedAutoLock);
  }, [savedAutoLock]);
  const autoLockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetAutoLockTimer = useCallback(() => {
    if (autoLockTimerRef.current) clearTimeout(autoLockTimerRef.current);
    if (autoLockMinutes > 0) {
      autoLockTimerRef.current = setTimeout(
        () => {
          setVaultState("locked");
          setPinInput("");
          setRevealedIds(new Set());
        },
        autoLockMinutes * 60 * 1000,
      );
    }
  }, [autoLockMinutes]);

  useEffect(() => {
    if (vaultState === "unlocked") {
      resetAutoLockTimer();
      return () => {
        if (autoLockTimerRef.current) clearTimeout(autoLockTimerRef.current);
      };
    }
  }, [vaultState, resetAutoLockTimer]);

  useEffect(() => {
    if (vaultState !== "unlocked")
      setTimeout(() => pinInputRef.current?.focus(), 50);
  }, [vaultState]);

  useEffect(() => {
    if (showAddModal) setTimeout(() => siteInputRef.current?.focus(), 50);
  }, [showAddModal]);

  const handleSetPin = useCallback(() => {
    if (pinInput.length < 4) {
      setPinError("PIN must be at least 4 digits");
      return;
    }
    if (!/^\d+$/.test(pinInput)) {
      setPinError("PIN must contain only digits");
      return;
    }
    setMasterPin(pinInput);
    setPinInput("");
    setPinError("");
    setVaultState("unlocked");
  }, [pinInput]);

  const handleUnlock = useCallback(() => {
    if (pinInput === masterPin) {
      setVaultState("unlocked");
      setPinInput("");
      setPinError("");
      resetAutoLockTimer();
    } else {
      setPinError("Incorrect PIN");
    }
  }, [pinInput, masterPin, resetAutoLockTimer]);

  const generatePassword = () => {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    let charset = lower;
    if (genUppercase) charset += upper;
    if (genNumbers) charset += numbers;
    if (genSymbols) charset += symbols;
    let pw = "";
    for (let i = 0; i < genLength; i++) {
      pw += charset[Math.floor(Math.random() * charset.length)];
    }
    setGeneratedPw(pw);
  };

  const handleImportCSV = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,text/csv";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const text = ev.target?.result as string;
          const lines = text.split("\n").filter(Boolean);
          const dataLines = lines[0]?.toLowerCase().startsWith("site")
            ? lines.slice(1)
            : lines;
          const imported: Credential[] = [];
          for (const line of dataLines) {
            const parts = line.split(",");
            const site = (parts[0] ?? "").replace(/^"|"$/g, "").trim();
            const username = (parts[1] ?? "").replace(/^"|"$/g, "").trim();
            const password = (parts[2] ?? "").replace(/^"|"$/g, "").trim();
            if (site && username && password) {
              imported.push({
                id: `cred-imp-${++credCounter}`,
                site,
                username,
                password,
                category: "Other",
              });
            }
          }
          if (imported.length === 0) {
            toast.error("No valid credentials found in CSV");
            return;
          }
          setCredentials((prev) => {
            const updated = [...prev, ...imported];
            persistCreds(updated);
            return updated;
          });
          toast.success(
            `Imported ${imported.length} credential${imported.length !== 1 ? "s" : ""}`,
          );
        } catch {
          toast.error("Failed to parse CSV");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [persistCreds]);

  const exportCSV = useCallback(() => {
    if (credentials.length === 0) return;
    const header = "site,username,password,category";
    const rows = credentials.map((c) => {
      const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
      return [
        esc(c.site),
        esc(c.username),
        esc(c.password),
        esc(c.category ?? "Other"),
      ].join(",");
    });
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "passwords.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Passwords exported");
  }, [credentials]);

  const handleLock = useCallback(() => {
    setVaultState("locked");
    setPinInput("");
    setRevealedIds(new Set());
  }, []);

  const toggleReveal = useCallback((id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const copyPassword = useCallback(
    (cred: Credential) => {
      navigator.clipboard.writeText(cred.password).then(() => {
        toast.success("Password copied");
        setCopiedIds((prev) => {
          const next = new Set(prev);
          next.add(`pw-${cred.id}`);
          return next;
        });
        setTimeout(() => {
          setCopiedIds((prev) => {
            const next = new Set(prev);
            next.delete(`pw-${cred.id}`);
            return next;
          });
        }, 2000);
        // Update lastUsed
        setCredentials((prev) => {
          const updated = prev.map((c) =>
            c.id === cred.id ? { ...c, lastUsed: Date.now() } : c,
          );
          persistCreds(updated);
          return updated;
        });
      });
    },
    [persistCreds],
  );

  const copyUsername = useCallback((username: string, credId: string) => {
    navigator.clipboard.writeText(username).then(() => {
      toast.success("Username copied");
      setCopiedIds((prev) => {
        const next = new Set(prev);
        next.add(`un-${credId}`);
        return next;
      });
      setTimeout(() => {
        setCopiedIds((prev) => {
          const next = new Set(prev);
          next.delete(`un-${credId}`);
          return next;
        });
      }, 2000);
    });
  }, []);

  const handleAddCredential = useCallback(() => {
    if (!newSite.trim() || !newUsername.trim() || !newPassword.trim()) {
      toast.error("All fields are required");
      return;
    }
    const newCred: Credential = {
      id: `cred-${++credCounter}`,
      site: newSite.trim(),
      username: newUsername.trim(),
      password: newPassword.trim(),
      category: newCategory,
      updatedAt: Date.now(),
      history: [],
    };
    setCredentials((prev) => {
      const updated = [...prev, newCred];
      persistCreds(updated);
      return updated;
    });
    setNewSite("");
    setNewUsername("");
    setNewPassword("");
    setNewCategory("Personal");
    setShowAddModal(false);
    toast.success("Credential saved");
  }, [newSite, newUsername, newPassword, newCategory, persistCreds]);

  const handleDelete = useCallback(
    (id: string) => {
      setCredentials((prev) => {
        const updated = prev.filter((c) => c.id !== id);
        persistCreds(updated);
        return updated;
      });
      setDeleteConfirmId(null);
      setRevealedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast.success("Credential deleted");
    },
    [persistCreds],
  );

  const filteredCreds = credentials.filter((c) => {
    const matchesSearch =
      !credSearch.trim() ||
      c.site.toLowerCase().includes(credSearch.toLowerCase()) ||
      c.username.toLowerCase().includes(credSearch.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || c.category === categoryFilter;
    const matchesHealth =
      !healthFilter ||
      (healthFilter === "weak" &&
        getStrengthBadge(c.password).label === "Weak") ||
      (healthFilter === "reused" &&
        credentials.filter((x) => x.password === c.password).length > 1) ||
      (healthFilter === "old" &&
        c.updatedAt &&
        (Date.now() - c.updatedAt) / (1000 * 60 * 60 * 24) > 90) ||
      (healthFilter === "breached" && isBreached(c.password));
    return matchesSearch && matchesCategory && matchesHealth;
  });

  const pwStrength = calcPasswordStrength(newPassword);

  const formatPasswordAge = (
    ts?: number,
  ): { label: string; color: string } | null => {
    if (!ts) return null;
    const days = Math.floor((Date.now() - ts) / (1000 * 60 * 60 * 24));
    if (days < 1) return { label: "Today", color: "#22C55E" };
    if (days < 30) return { label: `${days}d`, color: "#22C55E" };
    if (days < 90)
      return {
        label:
          days < 60 ? `${Math.floor(days / 7)}w` : `${Math.floor(days / 30)}mo`,
        color: "#F97316",
      };
    if (days < 365)
      return { label: `${Math.floor(days / 30)}mo`, color: "#EF4444" };
    return { label: `${Math.floor(days / 365)}yr`, color: "#EF4444" };
  };

  const formatLastUsed = (ts?: number) => {
    if (!ts) return null;
    const diff = Date.now() - ts;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(ts).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  if (vaultState !== "unlocked") {
    const isSetup = vaultState === "setup";
    return (
      <div
        className="flex flex-col items-center justify-center h-full gap-6"
        style={{ background: "var(--os-bg-app)" }}
        data-ocid="passwordmanager.panel"
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.3)",
              boxShadow: "0 0 30px rgba(99,102,241,0.1)",
            }}
          >
            <Shield
              className="w-8 h-8"
              style={{ color: "rgba(99,102,241,0.9)" }}
            />
          </div>
          <h2
            className="text-sm font-bold tracking-wide"
            style={{ color: "rgba(99,102,241,1)" }}
          >
            {isSetup ? "Create Vault" : "Vault Locked"}
          </h2>
          <p className="text-xs text-muted-foreground text-center max-w-[200px]">
            {isSetup
              ? "Set a 4–6 digit PIN to protect your credentials"
              : "Enter your PIN to unlock the vault"}
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 w-48">
          <input
            ref={pinInputRef}
            type="password"
            inputMode="numeric"
            value={pinInput}
            onChange={(e) => {
              setPinInput(e.target.value);
              setPinError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (isSetup) handleSetPin();
                else handleUnlock();
              }
            }}
            maxLength={6}
            data-ocid="passwordmanager.input"
            placeholder="Enter PIN"
            className="w-full rounded-xl px-4 py-3 text-center text-lg font-mono outline-none tracking-[0.5em]"
            style={{
              background: "rgba(0,0,0,0.4)",
              border: `1px solid ${pinError ? "rgba(248,113,113,0.6)" : "rgba(99,102,241,0.25)"}`,
              color: "rgba(99,102,241,1)",
              caretColor: "rgba(99,102,241,0.8)",
            }}
          />
          {pinError && (
            <p
              className="text-[11px] text-center"
              style={{ color: "rgba(248,113,113,0.9)" }}
              data-ocid="passwordmanager.error_state"
            >
              {pinError}
            </p>
          )}
          <button
            type="button"
            onClick={isSetup ? handleSetPin : handleUnlock}
            data-ocid="passwordmanager.primary_button"
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.35)",
              color: "rgba(99,102,241,1)",
            }}
          >
            {isSetup ? "Create Vault" : "Unlock"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "var(--os-bg-app)" }}
      data-ocid="passwordmanager.panel"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0"
        style={{
          borderColor: "rgba(99,102,241,0.15)",
          background: "var(--os-bg-app)",
        }}
      >
        <div className="flex items-center gap-2">
          <Shield
            className="w-4 h-4"
            style={{ color: "rgba(99,102,241,0.8)" }}
          />
          <span
            className="text-xs font-semibold"
            style={{ color: "rgba(99,102,241,1)" }}
          >
            Vault
          </span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full"
            style={{
              background: "rgba(99,102,241,0.1)",
              color: "rgba(99,102,241,0.7)",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            {credentials.length} item{credentials.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            data-ocid="passwordmanager.primary_button"
            className="flex items-center gap-1 px-3 h-7 rounded text-xs font-semibold transition-all"
            style={{
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.3)",
              color: "rgba(99,102,241,1)",
            }}
          >
            <Plus className="w-3 h-3" /> Add
          </button>
          <select
            value={autoLockMinutes}
            onChange={(e) => {
              const val = Number(e.target.value);
              setAutoLockMinutes(val);
              saveAutoLock(val);
            }}
            title="Auto-lock after"
            className="h-7 px-2 rounded text-[10px] outline-none"
            style={{
              background: "var(--os-border-subtle)",
              border: "1px solid var(--os-text-muted)",
              color: "var(--os-text-secondary)",
              colorScheme: "dark",
            }}
          >
            <option value={0}>No auto-lock</option>
            <option value={5}>Lock 5 min</option>
            <option value={10}>Lock 10 min</option>
            <option value={30}>Lock 30 min</option>
          </select>
          <button
            type="button"
            onClick={handleImportCSV}
            data-ocid="passwordmanager.upload_button"
            title="Import CSV"
            className="flex items-center gap-1 px-2 h-7 rounded text-xs transition-all"
            style={{
              background: "var(--os-border-subtle)",
              border: "1px solid var(--os-text-muted)",
              color: "var(--os-text-secondary)",
            }}
          >
            <Upload className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={exportCSV}
            data-ocid="passwordmanager.export_button"
            title="Export CSV"
            className="flex items-center gap-1 px-2 h-7 rounded text-xs transition-all"
            style={{
              background: "var(--os-border-subtle)",
              border: "1px solid var(--os-text-muted)",
              color: "var(--os-text-secondary)",
            }}
          >
            <FileDown className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={handleLock}
            data-ocid="passwordmanager.secondary_button"
            className="flex items-center gap-1 px-2 h-7 rounded text-xs transition-all"
            style={{
              background: "var(--os-border-subtle)",
              border: "1px solid var(--os-text-muted)",
              color: "var(--os-text-secondary)",
            }}
          >
            <Lock className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Search + Category filter */}
      <div className="px-3 pt-2.5 pb-2 flex-shrink-0 flex gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3"
            style={{ color: "rgba(99,102,241,0.4)" }}
          />
          <input
            type="text"
            placeholder="Search by site or username..."
            value={credSearch}
            onChange={(e) => setCredSearch(e.target.value)}
            data-ocid="passwordmanager.search_input"
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none"
            style={{
              background: "var(--os-border-subtle)",
              border: "1px solid rgba(99,102,241,0.15)",
              color: "var(--os-text-secondary)",
            }}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value as CredentialCategory | "All")
          }
          data-ocid="passwordmanager.select"
          className="h-8 px-2 rounded-lg text-xs outline-none flex-shrink-0"
          style={{
            background: "var(--os-border-subtle)",
            border: "1px solid rgba(99,102,241,0.15)",
            color: "var(--os-text-primary)",
            colorScheme: "dark",
          }}
        >
          <option value="All">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Tab bar */}
      <div
        className="flex border-b flex-shrink-0 px-3"
        style={{ borderColor: "rgba(99,102,241,0.15)" }}
      >
        {(["credentials", "health"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            data-ocid="passwordmanager.tab"
            className="px-3 py-1.5 text-xs capitalize transition-colors"
            style={{
              borderBottom:
                activeTab === tab
                  ? "2px solid rgba(99,102,241,0.7)"
                  : "2px solid transparent",
              color:
                activeTab === tab
                  ? "rgba(99,102,241,1)"
                  : "var(--os-text-secondary)",
              marginBottom: -1,
            }}
          >
            {tab === "health" ? "🛡️ Health" : "🔑 Credentials"}
          </button>
        ))}
      </div>

      {/* Credentials list or Health view */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
        {activeTab === "health" ? (
          <PasswordHealthView
            credentials={credentials}
            onFilterSelect={(filter) => {
              setHealthFilter(filter);
              setActiveTab("credentials");
            }}
          />
        ) : filteredCreds.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-full gap-3 py-12"
            data-ocid="passwordmanager.empty_state"
          >
            <Lock
              className="w-10 h-10"
              style={{ color: "rgba(99,102,241,0.12)" }}
            />
            <p className="text-xs" style={{ color: "var(--os-text-muted)" }}>
              {credSearch || categoryFilter !== "All"
                ? "No matching credentials"
                : "No credentials yet"}
            </p>
            {!credSearch && categoryFilter === "All" && (
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                data-ocid="passwordmanager.open_modal_button"
                className="text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: "rgba(99,102,241,0.9)",
                }}
              >
                + Add your first credential
              </button>
            )}
          </div>
        ) : (
          filteredCreds.map((cred, i) => {
            const badge = getStrengthBadge(cred.password);
            return (
              <div
                key={cred.id}
                className="rounded-xl p-3"
                data-ocid={`passwordmanager.item.${i + 1}`}
                style={{
                  background: "var(--os-bg-elevated)",
                  border: "1px solid rgba(55,55,65,0.6)",
                }}
              >
                {/* Site + category badge + delete */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-foreground flex-1 truncate">
                    {cred.site}
                  </span>
                  {isBreached(cred.password) && (
                    <span
                      title="Password found in common breach list"
                      className="text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        background: "rgba(249,115,22,0.15)",
                        color: "rgba(249,115,22,0.9)",
                        border: "1px solid rgba(249,115,22,0.35)",
                      }}
                    >
                      ⚠️ Breached
                    </span>
                  )}
                  {cred.category && (
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        background: CATEGORY_BG[cred.category],
                        color: CATEGORY_COLORS[cred.category],
                        border: `1px solid ${CATEGORY_COLORS[cred.category]}33`,
                      }}
                    >
                      {cred.category}
                    </span>
                  )}
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0 font-medium"
                    style={{
                      background: `${badge.color}18`,
                      color: badge.color,
                      border: `1px solid ${badge.color}44`,
                    }}
                    title={`Password strength: ${badge.label}`}
                  >
                    {badge.dot} {badge.label}
                  </span>
                  {(() => {
                    const age = formatPasswordAge(cred.updatedAt);
                    return age ? (
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0 font-medium"
                        style={{
                          background: `${age.color}15`,
                          color: age.color,
                          border: `1px solid ${age.color}35`,
                        }}
                        title="Password age"
                      >
                        {age.label}
                      </span>
                    ) : null;
                  })()}
                  {cred.lastUsed && (
                    <span
                      className="text-[9px] flex-shrink-0"
                      style={{ color: "var(--os-text-muted)" }}
                    >
                      used {formatLastUsed(cred.lastUsed)}
                    </span>
                  )}
                  {deleteConfirmId === cred.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDelete(cred.id)}
                        data-ocid="passwordmanager.confirm_button"
                        className="text-[10px] px-2 py-0.5 rounded text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        data-ocid="passwordmanager.cancel_button"
                        className="text-[10px] px-2 py-0.5 rounded text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(cred.id)}
                      data-ocid="passwordmanager.delete_button"
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Username row */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] text-muted-foreground/50 w-16 flex-shrink-0">
                    Username
                  </span>
                  <span className="text-xs text-foreground/80 flex-1 font-mono truncate">
                    {cred.username}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyUsername(cred.username, cred.id)}
                    data-ocid="passwordmanager.button"
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted/50 transition-colors"
                    title="Copy username"
                    style={{
                      color: copiedIds.has(`un-${cred.id}`)
                        ? "#22C55E"
                        : undefined,
                    }}
                  >
                    {copiedIds.has(`un-${cred.id}`) ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>

                {/* Password row */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground/50 w-16 flex-shrink-0">
                    Password
                  </span>
                  <span className="text-xs text-foreground/80 flex-1 font-mono truncate">
                    {revealedIds.has(cred.id)
                      ? cred.password
                      : "\u2022".repeat(Math.min(cred.password.length, 16))}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleReveal(cred.id)}
                    data-ocid="passwordmanager.toggle"
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                    title={
                      revealedIds.has(cred.id)
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {revealedIds.has(cred.id) ? (
                      <EyeOff className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyPassword(cred)}
                    data-ocid="passwordmanager.button"
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted/50 transition-colors"
                    title="Copy password"
                    style={{
                      color: copiedIds.has(`pw-${cred.id}`)
                        ? "#22C55E"
                        : undefined,
                    }}
                  >
                    {copiedIds.has(`pw-${cred.id}`) ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
                {/* History section */}
                {(cred.history ?? []).length > 0 && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setShowHistoryFor(
                          showHistoryFor === cred.id ? null : cred.id,
                        )
                      }
                      className="text-[10px] transition-colors"
                      style={{ color: "var(--os-text-muted)" }}
                    >
                      {showHistoryFor === cred.id
                        ? "▲ Hide history"
                        : `▼ History (${(cred.history ?? []).length})`}
                    </button>
                    {showHistoryFor === cred.id && (
                      <div
                        className="mt-1.5 flex flex-col gap-1"
                        style={{
                          borderTop: "1px solid var(--os-border-subtle)",
                          paddingTop: 6,
                        }}
                      >
                        {(cred.history ?? [])
                          .slice()
                          .reverse()
                          .map((h, hi) => (
                            <div
                              key={`${h.changedAt}`}
                              className="flex items-center gap-2"
                            >
                              <span
                                className="text-[10px] font-mono flex-1 truncate"
                                style={{ color: "var(--os-text-secondary)" }}
                              >
                                {historyRevealIds.has(`${cred.id}-${hi}`)
                                  ? h.password
                                  : "•".repeat(Math.min(h.password.length, 14))}
                              </span>
                              <span
                                className="text-[9px]"
                                style={{ color: "var(--os-text-muted)" }}
                              >
                                {new Date(h.changedAt).toLocaleDateString()}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setHistoryRevealIds((prev) => {
                                    const next = new Set(prev);
                                    const k = `${cred.id}-${hi}`;
                                    if (next.has(k)) next.delete(k);
                                    else next.add(k);
                                    return next;
                                  })
                                }
                                className="text-[9px] px-1 rounded"
                                style={{
                                  color: "var(--os-text-muted)",
                                  background: "var(--os-border-subtle)",
                                }}
                              >
                                {historyRevealIds.has(`${cred.id}-${hi}`)
                                  ? "hide"
                                  : "show"}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  navigator.clipboard
                                    .writeText(h.password)
                                    .then(() =>
                                      toast.success("Copied old password"),
                                    )
                                }
                                className="text-[9px] px-1 rounded"
                                style={{
                                  color: "var(--os-text-muted)",
                                  background: "var(--os-border-subtle)",
                                }}
                              >
                                copy
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setCredentials((prev) => {
                                    const updated = prev.map((c) => {
                                      if (c.id !== cred.id) return c;
                                      const oldPw = c.password;
                                      const hist = [
                                        ...(c.history ?? []),
                                        {
                                          password: oldPw,
                                          changedAt: Date.now(),
                                        },
                                      ].slice(-10);
                                      return {
                                        ...c,
                                        password: h.password,
                                        history: hist,
                                        updatedAt: Date.now(),
                                      };
                                    });
                                    persistCreds(updated);
                                    return updated;
                                  });
                                  toast.success("Password restored");
                                  setShowHistoryFor(null);
                                }}
                                className="text-[9px] px-1 rounded"
                                style={{
                                  color: "rgba(99,102,241,0.9)",
                                  background: "rgba(99,102,241,0.1)",
                                  border: "1px solid rgba(99,102,241,0.2)",
                                }}
                              >
                                restore
                              </button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add credential modal */}
      {showAddModal && (
        <div
          className="absolute inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.65)" }}
          data-ocid="passwordmanager.modal"
        >
          <div
            className="rounded-xl p-5 w-72"
            style={{
              background: "rgba(13,22,32,0.98)",
              border: "1px solid rgba(99,102,241,0.3)",
              boxShadow:
                "0 8px 40px rgba(0,0,0,0.7), 0 0 20px rgba(99,102,241,0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-sm font-semibold"
                style={{ color: "rgba(99,102,241,1)" }}
              >
                Add Credential
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                data-ocid="passwordmanager.close_button"
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Site */}
              <div>
                <span className="text-[10px] text-muted-foreground/60 mb-1 block">
                  Site / App
                </span>
                <input
                  ref={siteInputRef}
                  value={newSite}
                  onChange={(e) => setNewSite(e.target.value)}
                  data-ocid="passwordmanager.input"
                  placeholder="e.g. GitHub"
                  className="w-full rounded-lg px-3 py-2 text-xs bg-transparent outline-none"
                  style={{
                    border: "1px solid rgba(99,102,241,0.25)",
                    color: "var(--os-text-primary)",
                  }}
                />
              </div>

              {/* Username */}
              <div>
                <span className="text-[10px] text-muted-foreground/60 mb-1 block">
                  Username
                </span>
                <input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  data-ocid="passwordmanager.input"
                  placeholder="Username or email"
                  className="w-full rounded-lg px-3 py-2 text-xs bg-transparent outline-none"
                  style={{
                    border: "1px solid var(--os-text-muted)",
                    color: "var(--os-text-primary)",
                  }}
                />
              </div>

              {/* Category */}
              <div>
                <span className="text-[10px] text-muted-foreground/60 mb-1 block">
                  Category
                </span>
                <select
                  value={newCategory}
                  onChange={(e) =>
                    setNewCategory(e.target.value as CredentialCategory)
                  }
                  data-ocid="passwordmanager.select"
                  className="w-full rounded-lg px-3 py-2 text-xs outline-none"
                  style={{
                    background: "var(--os-border-subtle)",
                    border: "1px solid var(--os-text-muted)",
                    color: "var(--os-text-primary)",
                    colorScheme: "dark",
                  }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div>
                <span className="text-[10px] text-muted-foreground/60 mb-1 block">
                  Password
                </span>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleAddCredential()
                    }
                    data-ocid="passwordmanager.input"
                    placeholder="Password"
                    className="w-full rounded-lg px-3 py-2 pr-8 text-xs bg-transparent outline-none"
                    style={{
                      border: "1px solid var(--os-text-muted)",
                      color: "var(--os-text-primary)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                  </button>
                </div>

                {/* Strength meter */}
                {newPassword && (
                  <div className="mt-1.5">
                    <div className="flex gap-0.5 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="flex-1 h-1 rounded-full transition-all"
                          style={{
                            background:
                              i <= pwStrength.score
                                ? pwStrength.color
                                : "var(--os-text-muted)",
                          }}
                        />
                      ))}
                    </div>
                    <span
                      className="text-[10px]"
                      style={{ color: pwStrength.color }}
                    >
                      {pwStrength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Generator */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowGenerator((v) => !v)}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors mb-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Password generator
                </button>
                {showGenerator && (
                  <div
                    className="rounded-lg p-2.5 space-y-2"
                    style={{
                      background: "var(--os-border-subtle)",
                      border: "1px solid var(--os-border-subtle)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground/60">
                        Length: {genLength}
                      </span>
                      <input
                        type="range"
                        min={8}
                        max={32}
                        value={genLength}
                        onChange={(e) => setGenLength(Number(e.target.value))}
                        className="accent-cyan-400 w-24 h-2"
                      />
                    </div>
                    <div className="flex gap-3">
                      {[
                        {
                          label: "Symbols",
                          state: genSymbols,
                          set: setGenSymbols,
                        },
                        {
                          label: "Numbers",
                          state: genNumbers,
                          set: setGenNumbers,
                        },
                        {
                          label: "Uppercase",
                          state: genUppercase,
                          set: setGenUppercase,
                        },
                      ].map(({ label, state, set }) => (
                        <label
                          key={label}
                          className="flex items-center gap-1 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={state}
                            onChange={(e) => set(e.target.checked)}
                            className="accent-cyan-400 w-3 h-3"
                          />
                          <span className="text-[10px] text-muted-foreground/60">
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={generatePassword}
                        data-ocid="passwordmanager.button"
                        className="flex items-center gap-1 px-2 py-1.5 rounded text-[10px] font-medium transition-all"
                        style={{
                          background: "rgba(99,102,241,0.12)",
                          border: "1px solid rgba(99,102,241,0.25)",
                          color: "rgba(99,102,241,0.9)",
                        }}
                      >
                        <RefreshCw className="w-3 h-3" /> Generate
                      </button>
                      {generatedPw && (
                        <div className="flex-1 flex items-center gap-1">
                          <input
                            readOnly
                            value={generatedPw}
                            className="flex-1 px-2 py-1 rounded text-[10px] font-mono outline-none truncate"
                            style={{
                              background: "var(--os-border-subtle)",
                              border: "1px solid var(--os-border-subtle)",
                              color: "var(--os-text-secondary)",
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setNewPassword(generatedPw);
                              setShowGenerator(false);
                            }}
                            data-ocid="passwordmanager.secondary_button"
                            className="px-2 py-1 rounded text-[10px] font-medium flex-shrink-0 transition-all"
                            style={{
                              background: "rgba(99,102,241,0.1)",
                              border: "1px solid rgba(99,102,241,0.2)",
                              color: "rgba(99,102,241,0.8)",
                            }}
                          >
                            Use
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleAddCredential}
                data-ocid="passwordmanager.submit_button"
                className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all mt-1"
                style={{
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.35)",
                  color: "rgba(99,102,241,1)",
                }}
              >
                Save Credential
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
