import { c as createLucideIcon, r as reactExports, g as ue, j as jsxRuntimeExports, m as Lock, S as Search, T as Trash2, C as Check, n as Copy, X, R as RefreshCw } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { S as Shield } from "./shield-DHJOVrKO.js";
import { P as Plus } from "./plus-DMYwOcjm.js";
import { U as Upload } from "./upload-CPulOAno.js";
import { E as Eye } from "./eye-DdII2rDh.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const EyeOff = createLucideIcon("eye-off", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M12 18v-6", key: "17g6i2" }],
  ["path", { d: "m9 15 3 3 3-3", key: "1npd3o" }]
];
const FileDown = createLucideIcon("file-down", __iconNode);
const CATEGORIES = [
  "Work",
  "Personal",
  "Finance",
  "Social",
  "Other"
];
const CATEGORY_COLORS = {
  Work: "rgba(59,130,246,0.8)",
  Personal: "rgba(168,85,247,0.8)",
  Finance: "rgba(34,197,94,0.8)",
  Social: "rgba(249,115,22,0.8)",
  Other: "rgba(148,163,184,0.8)"
};
const CATEGORY_BG = {
  Work: "rgba(59,130,246,0.1)",
  Personal: "rgba(168,85,247,0.1)",
  Finance: "rgba(34,197,94,0.1)",
  Social: "rgba(249,115,22,0.1)",
  Other: "rgba(148,163,184,0.1)"
};
const COMMON_PASSWORDS = /* @__PURE__ */ new Set([
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
  "111111"
]);
function isBreached(password) {
  return COMMON_PASSWORDS.has(password.toLowerCase());
}
let credCounter = 0;
function calcPasswordStrength(pw) {
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
  onFilterSelect
}) {
  const stats = credentials.reduce(
    (acc, c) => {
      const b = getStrengthBadge(c.password);
      if (b.label === "Strong") acc.strong++;
      else if (b.label === "Fair") acc.fair++;
      else if (b.label === "Weak") acc.weak++;
      return acc;
    },
    { strong: 0, fair: 0, weak: 0 }
  );
  const weakCreds = credentials.filter(
    (c) => getStrengthBadge(c.password).label === "Weak"
  );
  const fairCreds = credentials.filter(
    (c) => getStrengthBadge(c.password).label === "Fair"
  );
  const reusedPasswords = credentials.filter((c) => {
    const count = credentials.filter((x) => x.password === c.password).length;
    return count > 1;
  });
  const oldPasswords = credentials.filter((c) => {
    if (!c.updatedAt) return false;
    const days = (Date.now() - c.updatedAt) / (1e3 * 60 * 60 * 24);
    return days > 90;
  });
  const breachedCreds = credentials.filter((c) => isBreached(c.password));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-3 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: [
      { label: "Strong", count: stats.strong, color: "#22C55E", dot: "🟢" },
      { label: "Fair", count: stats.fair, color: "#F97316", dot: "🟡" },
      { label: "Weak", count: stats.weak, color: "#EF4444", dot: "🔴" }
    ].map(({ label, count, color, dot }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl p-3 text-center",
        style: {
          background: `${color}10`,
          border: `1px solid ${color}33`
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg mb-0.5", children: dot }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold", style: { color }, children: count }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-[10px]",
              style: { color: "var(--os-text-secondary)" },
              children: label
            }
          )
        ]
      },
      label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: [
      {
        label: "Reused",
        count: reusedPasswords.length,
        color: "#F97316",
        filter: "reused",
        icon: "🔁"
      },
      {
        label: "Outdated",
        count: oldPasswords.length,
        color: "#EAB308",
        filter: "old",
        icon: "📅"
      },
      {
        label: "Breached",
        count: breachedCreds.length,
        color: "#F97316",
        filter: "breached",
        icon: "⚠️"
      }
    ].map(({ label, count, color, filter, icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => onFilterSelect == null ? void 0 : onFilterSelect(filter),
        className: "rounded-xl p-2.5 text-center transition-all hover:opacity-80",
        style: { background: `${color}10`, border: `1px solid ${color}33` },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base mb-0.5", children: icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold", style: { color }, children: count }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-[10px]",
              style: { color: "var(--os-text-secondary)" },
              children: label
            }
          )
        ]
      },
      label
    )) }),
    weakCreds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-[10px] font-semibold mb-2 uppercase tracking-wide",
          style: { color: "#EF4444" },
          children: "🔴 Weak passwords — update these"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: weakCreds.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between px-3 py-2 rounded-lg text-xs",
          style: {
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/80 truncate flex-1", children: c.site }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--os-text-secondary)" }, children: c.username })
          ]
        },
        c.id
      )) })
    ] }),
    fairCreds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-[10px] font-semibold mb-2 uppercase tracking-wide",
          style: { color: "#F97316" },
          children: "🟡 Fair passwords — could be stronger"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: fairCreds.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between px-3 py-2 rounded-lg text-xs",
          style: {
            background: "rgba(249,115,22,0.08)",
            border: "1px solid rgba(249,115,22,0.2)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/80 truncate flex-1", children: c.site }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--os-text-secondary)" }, children: c.username })
          ]
        },
        c.id
      )) })
    ] }),
    credentials.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center py-12 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl", children: "🔐" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/50", children: "No credentials yet — add some to see health analysis" })
    ] }),
    credentials.length > 0 && weakCreds.length === 0 && fairCreds.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center py-8 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl", children: "✅" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "#22C55E" }, children: "All passwords are strong — great work!" })
    ] })
  ] });
}
function getStrengthBadge(pw) {
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
function PasswordManager() {
  const [vaultState, setVaultState] = reactExports.useState("setup");
  const [activeTab, setActiveTab] = reactExports.useState(
    "credentials"
  );
  const [healthFilter, setHealthFilter] = reactExports.useState(null);
  const [masterPin, setMasterPin] = reactExports.useState("");
  const [pinInput, setPinInput] = reactExports.useState("");
  const [pinError, setPinError] = reactExports.useState("");
  const {
    data: persistedCreds,
    set: persistCreds,
    loading: credsLoading
  } = useCanisterKV("passwords_data", []);
  const [credentials, setCredentials] = reactExports.useState([]);
  const credsHydratedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (credsHydratedRef.current) return;
    credsHydratedRef.current = true;
    if (persistedCreds.length > 0) setCredentials(persistedCreds);
  }, [persistedCreds, credsLoading]);
  const [revealedIds, setRevealedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [credSearch, setCredSearch] = reactExports.useState("");
  const [categoryFilter, setCategoryFilter] = reactExports.useState("All");
  const [showAddModal, setShowAddModal] = reactExports.useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = reactExports.useState(null);
  const [newSite, setNewSite] = reactExports.useState("");
  const [newUsername, setNewUsername] = reactExports.useState("");
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [newCategory, setNewCategory] = reactExports.useState("Personal");
  const [showNewPassword, setShowNewPassword] = reactExports.useState(false);
  const [showGenerator, setShowGenerator] = reactExports.useState(false);
  const [genLength, setGenLength] = reactExports.useState(16);
  const [genSymbols, setGenSymbols] = reactExports.useState(true);
  const [genNumbers, setGenNumbers] = reactExports.useState(true);
  const [genUppercase, setGenUppercase] = reactExports.useState(true);
  const [generatedPw, setGeneratedPw] = reactExports.useState("");
  const pinInputRef = reactExports.useRef(null);
  const siteInputRef = reactExports.useRef(null);
  const [copiedIds, setCopiedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [showHistoryFor, setShowHistoryFor] = reactExports.useState(null);
  const [historyRevealIds, setHistoryRevealIds] = reactExports.useState(
    /* @__PURE__ */ new Set()
  );
  const { data: savedAutoLock, set: saveAutoLock } = useCanisterKV(
    "decent_pm_autolock",
    0
  );
  const [autoLockMinutes, setAutoLockMinutes] = reactExports.useState(0);
  const autoLockHydratedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (autoLockHydratedRef.current) return;
    autoLockHydratedRef.current = true;
    setAutoLockMinutes(savedAutoLock);
  }, [savedAutoLock]);
  const autoLockTimerRef = reactExports.useRef(null);
  const resetAutoLockTimer = reactExports.useCallback(() => {
    if (autoLockTimerRef.current) clearTimeout(autoLockTimerRef.current);
    if (autoLockMinutes > 0) {
      autoLockTimerRef.current = setTimeout(
        () => {
          setVaultState("locked");
          setPinInput("");
          setRevealedIds(/* @__PURE__ */ new Set());
        },
        autoLockMinutes * 60 * 1e3
      );
    }
  }, [autoLockMinutes]);
  reactExports.useEffect(() => {
    if (vaultState === "unlocked") {
      resetAutoLockTimer();
      return () => {
        if (autoLockTimerRef.current) clearTimeout(autoLockTimerRef.current);
      };
    }
  }, [vaultState, resetAutoLockTimer]);
  reactExports.useEffect(() => {
    if (vaultState !== "unlocked")
      setTimeout(() => {
        var _a;
        return (_a = pinInputRef.current) == null ? void 0 : _a.focus();
      }, 50);
  }, [vaultState]);
  reactExports.useEffect(() => {
    if (showAddModal) setTimeout(() => {
      var _a;
      return (_a = siteInputRef.current) == null ? void 0 : _a.focus();
    }, 50);
  }, [showAddModal]);
  const handleSetPin = reactExports.useCallback(() => {
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
  const handleUnlock = reactExports.useCallback(() => {
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
  const handleImportCSV = reactExports.useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,text/csv";
    input.onchange = (e) => {
      var _a;
      const file = (_a = e.target.files) == null ? void 0 : _a[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        var _a2, _b;
        try {
          const text = (_a2 = ev.target) == null ? void 0 : _a2.result;
          const lines = text.split("\n").filter(Boolean);
          const dataLines = ((_b = lines[0]) == null ? void 0 : _b.toLowerCase().startsWith("site")) ? lines.slice(1) : lines;
          const imported = [];
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
                category: "Other"
              });
            }
          }
          if (imported.length === 0) {
            ue.error("No valid credentials found in CSV");
            return;
          }
          setCredentials((prev) => {
            const updated = [...prev, ...imported];
            persistCreds(updated);
            return updated;
          });
          ue.success(
            `Imported ${imported.length} credential${imported.length !== 1 ? "s" : ""}`
          );
        } catch {
          ue.error("Failed to parse CSV");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [persistCreds]);
  const exportCSV = reactExports.useCallback(() => {
    if (credentials.length === 0) return;
    const header = "site,username,password,category";
    const rows = credentials.map((c) => {
      const esc = (s) => `"${s.replace(/"/g, '""')}"`;
      return [
        esc(c.site),
        esc(c.username),
        esc(c.password),
        esc(c.category ?? "Other")
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
    ue.success("Passwords exported");
  }, [credentials]);
  const handleLock = reactExports.useCallback(() => {
    setVaultState("locked");
    setPinInput("");
    setRevealedIds(/* @__PURE__ */ new Set());
  }, []);
  const toggleReveal = reactExports.useCallback((id) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const copyPassword = reactExports.useCallback(
    (cred) => {
      navigator.clipboard.writeText(cred.password).then(() => {
        ue.success("Password copied");
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
        }, 2e3);
        setCredentials((prev) => {
          const updated = prev.map(
            (c) => c.id === cred.id ? { ...c, lastUsed: Date.now() } : c
          );
          persistCreds(updated);
          return updated;
        });
      });
    },
    [persistCreds]
  );
  const copyUsername = reactExports.useCallback((username, credId) => {
    navigator.clipboard.writeText(username).then(() => {
      ue.success("Username copied");
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
      }, 2e3);
    });
  }, []);
  const handleAddCredential = reactExports.useCallback(() => {
    if (!newSite.trim() || !newUsername.trim() || !newPassword.trim()) {
      ue.error("All fields are required");
      return;
    }
    const newCred = {
      id: `cred-${++credCounter}`,
      site: newSite.trim(),
      username: newUsername.trim(),
      password: newPassword.trim(),
      category: newCategory,
      updatedAt: Date.now(),
      history: []
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
    ue.success("Credential saved");
  }, [newSite, newUsername, newPassword, newCategory, persistCreds]);
  const handleDelete = reactExports.useCallback(
    (id) => {
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
      ue.success("Credential deleted");
    },
    [persistCreds]
  );
  const filteredCreds = credentials.filter((c) => {
    const matchesSearch = !credSearch.trim() || c.site.toLowerCase().includes(credSearch.toLowerCase()) || c.username.toLowerCase().includes(credSearch.toLowerCase());
    const matchesCategory = categoryFilter === "All" || c.category === categoryFilter;
    const matchesHealth = !healthFilter || healthFilter === "weak" && getStrengthBadge(c.password).label === "Weak" || healthFilter === "reused" && credentials.filter((x) => x.password === c.password).length > 1 || healthFilter === "old" && c.updatedAt && (Date.now() - c.updatedAt) / (1e3 * 60 * 60 * 24) > 90 || healthFilter === "breached" && isBreached(c.password);
    return matchesSearch && matchesCategory && matchesHealth;
  });
  const pwStrength = calcPasswordStrength(newPassword);
  const formatPasswordAge = (ts) => {
    if (!ts) return null;
    const days = Math.floor((Date.now() - ts) / (1e3 * 60 * 60 * 24));
    if (days < 1) return { label: "Today", color: "#22C55E" };
    if (days < 30) return { label: `${days}d`, color: "#22C55E" };
    if (days < 90)
      return {
        label: days < 60 ? `${Math.floor(days / 7)}w` : `${Math.floor(days / 30)}mo`,
        color: "#F97316"
      };
    if (days < 365)
      return { label: `${Math.floor(days / 30)}mo`, color: "#EF4444" };
    return { label: `${Math.floor(days / 365)}yr`, color: "#EF4444" };
  };
  const formatLastUsed = (ts) => {
    if (!ts) return null;
    const diff = Date.now() - ts;
    if (diff < 6e4) return "just now";
    if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
    if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
    return new Date(ts).toLocaleDateString(void 0, {
      month: "short",
      day: "numeric"
    });
  };
  if (vaultState !== "unlocked") {
    const isSetup = vaultState === "setup";
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center h-full gap-6",
        style: { background: "var(--os-bg-app)" },
        "data-ocid": "passwordmanager.panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-16 h-16 rounded-2xl flex items-center justify-center",
                style: {
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  boxShadow: "0 0 30px rgba(99,102,241,0.1)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Shield,
                  {
                    className: "w-8 h-8",
                    style: { color: "rgba(99,102,241,0.9)" }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h2",
              {
                className: "text-sm font-bold tracking-wide",
                style: { color: "rgba(99,102,241,1)" },
                children: isSetup ? "Create Vault" : "Vault Locked"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center max-w-[200px]", children: isSetup ? "Set a 4–6 digit PIN to protect your credentials" : "Enter your PIN to unlock the vault" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 w-48", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: pinInputRef,
                type: "password",
                inputMode: "numeric",
                value: pinInput,
                onChange: (e) => {
                  setPinInput(e.target.value);
                  setPinError("");
                },
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    if (isSetup) handleSetPin();
                    else handleUnlock();
                  }
                },
                maxLength: 6,
                "data-ocid": "passwordmanager.input",
                placeholder: "Enter PIN",
                className: "w-full rounded-xl px-4 py-3 text-center text-lg font-mono outline-none tracking-[0.5em]",
                style: {
                  background: "rgba(0,0,0,0.4)",
                  border: `1px solid ${pinError ? "rgba(248,113,113,0.6)" : "rgba(99,102,241,0.25)"}`,
                  color: "rgba(99,102,241,1)",
                  caretColor: "rgba(99,102,241,0.8)"
                }
              }
            ),
            pinError && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-[11px] text-center",
                style: { color: "rgba(248,113,113,0.9)" },
                "data-ocid": "passwordmanager.error_state",
                children: pinError
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: isSetup ? handleSetPin : handleUnlock,
                "data-ocid": "passwordmanager.primary_button",
                className: "w-full py-2.5 rounded-xl text-sm font-semibold transition-all",
                style: {
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.35)",
                  color: "rgba(99,102,241,1)"
                },
                children: isSetup ? "Create Vault" : "Unlock"
              }
            )
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "var(--os-bg-app)" },
      "data-ocid": "passwordmanager.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0",
            style: {
              borderColor: "rgba(99,102,241,0.15)",
              background: "var(--os-bg-app)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Shield,
                  {
                    className: "w-4 h-4",
                    style: { color: "rgba(99,102,241,0.8)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-semibold",
                    style: { color: "rgba(99,102,241,1)" },
                    children: "Vault"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-[10px] px-1.5 py-0.5 rounded-full",
                    style: {
                      background: "rgba(99,102,241,0.1)",
                      color: "rgba(99,102,241,0.7)",
                      border: "1px solid rgba(99,102,241,0.2)"
                    },
                    children: [
                      credentials.length,
                      " item",
                      credentials.length !== 1 ? "s" : ""
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowAddModal(true),
                    "data-ocid": "passwordmanager.primary_button",
                    className: "flex items-center gap-1 px-3 h-7 rounded text-xs font-semibold transition-all",
                    style: {
                      background: "rgba(99,102,241,0.12)",
                      border: "1px solid rgba(99,102,241,0.3)",
                      color: "rgba(99,102,241,1)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                      " Add"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: autoLockMinutes,
                    onChange: (e) => {
                      const val = Number(e.target.value);
                      setAutoLockMinutes(val);
                      saveAutoLock(val);
                    },
                    title: "Auto-lock after",
                    className: "h-7 px-2 rounded text-[10px] outline-none",
                    style: {
                      background: "var(--os-border-subtle)",
                      border: "1px solid var(--os-text-muted)",
                      color: "var(--os-text-secondary)",
                      colorScheme: "dark"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 0, children: "No auto-lock" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 5, children: "Lock 5 min" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 10, children: "Lock 10 min" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 30, children: "Lock 30 min" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleImportCSV,
                    "data-ocid": "passwordmanager.upload_button",
                    title: "Import CSV",
                    className: "flex items-center gap-1 px-2 h-7 rounded text-xs transition-all",
                    style: {
                      background: "var(--os-border-subtle)",
                      border: "1px solid var(--os-text-muted)",
                      color: "var(--os-text-secondary)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-3 h-3" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: exportCSV,
                    "data-ocid": "passwordmanager.export_button",
                    title: "Export CSV",
                    className: "flex items-center gap-1 px-2 h-7 rounded text-xs transition-all",
                    style: {
                      background: "var(--os-border-subtle)",
                      border: "1px solid var(--os-text-muted)",
                      color: "var(--os-text-secondary)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { className: "w-3 h-3" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleLock,
                    "data-ocid": "passwordmanager.secondary_button",
                    className: "flex items-center gap-1 px-2 h-7 rounded text-xs transition-all",
                    style: {
                      background: "var(--os-border-subtle)",
                      border: "1px solid var(--os-text-muted)",
                      color: "var(--os-text-secondary)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3" })
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 pt-2.5 pb-2 flex-shrink-0 flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Search,
              {
                className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3",
                style: { color: "rgba(99,102,241,0.4)" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                placeholder: "Search by site or username...",
                value: credSearch,
                onChange: (e) => setCredSearch(e.target.value),
                "data-ocid": "passwordmanager.search_input",
                className: "w-full pl-8 pr-3 py-1.5 rounded-lg text-xs outline-none",
                style: {
                  background: "var(--os-border-subtle)",
                  border: "1px solid rgba(99,102,241,0.15)",
                  color: "var(--os-text-secondary)"
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: categoryFilter,
              onChange: (e) => setCategoryFilter(e.target.value),
              "data-ocid": "passwordmanager.select",
              className: "h-8 px-2 rounded-lg text-xs outline-none flex-shrink-0",
              style: {
                background: "var(--os-border-subtle)",
                border: "1px solid rgba(99,102,241,0.15)",
                color: "var(--os-text-primary)",
                colorScheme: "dark"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "All", children: "All" }),
                CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex border-b flex-shrink-0 px-3",
            style: { borderColor: "rgba(99,102,241,0.15)" },
            children: ["credentials", "health"].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setActiveTab(tab),
                "data-ocid": "passwordmanager.tab",
                className: "px-3 py-1.5 text-xs capitalize transition-colors",
                style: {
                  borderBottom: activeTab === tab ? "2px solid rgba(99,102,241,0.7)" : "2px solid transparent",
                  color: activeTab === tab ? "rgba(99,102,241,1)" : "var(--os-text-secondary)",
                  marginBottom: -1
                },
                children: tab === "health" ? "🛡️ Health" : "🔑 Credentials"
              },
              tab
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-3 pb-3 space-y-2", children: activeTab === "health" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          PasswordHealthView,
          {
            credentials,
            onFilterSelect: (filter) => {
              setHealthFilter(filter);
              setActiveTab("credentials");
            }
          }
        ) : filteredCreds.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center h-full gap-3 py-12",
            "data-ocid": "passwordmanager.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Lock,
                {
                  className: "w-10 h-10",
                  style: { color: "rgba(99,102,241,0.12)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "var(--os-text-muted)" }, children: credSearch || categoryFilter !== "All" ? "No matching credentials" : "No credentials yet" }),
              !credSearch && categoryFilter === "All" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowAddModal(true),
                  "data-ocid": "passwordmanager.open_modal_button",
                  className: "text-xs px-3 py-1.5 rounded-lg transition-all",
                  style: {
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    color: "rgba(99,102,241,0.9)"
                  },
                  children: "+ Add your first credential"
                }
              )
            ]
          }
        ) : filteredCreds.map((cred, i) => {
          const badge = getStrengthBadge(cred.password);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl p-3",
              "data-ocid": `passwordmanager.item.${i + 1}`,
              style: {
                background: "var(--os-bg-elevated)",
                border: "1px solid rgba(55,55,65,0.6)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground flex-1 truncate", children: cred.site }),
                  isBreached(cred.password) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      title: "Password found in common breach list",
                      className: "text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0",
                      style: {
                        background: "rgba(249,115,22,0.15)",
                        color: "rgba(249,115,22,0.9)",
                        border: "1px solid rgba(249,115,22,0.35)"
                      },
                      children: "⚠️ Breached"
                    }
                  ),
                  cred.category && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0",
                      style: {
                        background: CATEGORY_BG[cred.category],
                        color: CATEGORY_COLORS[cred.category],
                        border: `1px solid ${CATEGORY_COLORS[cred.category]}33`
                      },
                      children: cred.category
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0 font-medium",
                      style: {
                        background: `${badge.color}18`,
                        color: badge.color,
                        border: `1px solid ${badge.color}44`
                      },
                      title: `Password strength: ${badge.label}`,
                      children: [
                        badge.dot,
                        " ",
                        badge.label
                      ]
                    }
                  ),
                  (() => {
                    const age = formatPasswordAge(cred.updatedAt);
                    return age ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0 font-medium",
                        style: {
                          background: `${age.color}15`,
                          color: age.color,
                          border: `1px solid ${age.color}35`
                        },
                        title: "Password age",
                        children: age.label
                      }
                    ) : null;
                  })(),
                  cred.lastUsed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "text-[9px] flex-shrink-0",
                      style: { color: "var(--os-text-muted)" },
                      children: [
                        "used ",
                        formatLastUsed(cred.lastUsed)
                      ]
                    }
                  ),
                  deleteConfirmId === cred.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleDelete(cred.id),
                        "data-ocid": "passwordmanager.confirm_button",
                        className: "text-[10px] px-2 py-0.5 rounded text-red-400 hover:text-red-300",
                        children: "Delete"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setDeleteConfirmId(null),
                        "data-ocid": "passwordmanager.cancel_button",
                        className: "text-[10px] px-2 py-0.5 rounded text-muted-foreground hover:text-foreground",
                        children: "Cancel"
                      }
                    )
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setDeleteConfirmId(cred.id),
                      "data-ocid": "passwordmanager.delete_button",
                      className: "w-6 h-6 flex items-center justify-center rounded hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/50 w-16 flex-shrink-0", children: "Username" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground/80 flex-1 font-mono truncate", children: cred.username }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => copyUsername(cred.username, cred.id),
                      "data-ocid": "passwordmanager.button",
                      className: "w-6 h-6 flex items-center justify-center rounded hover:bg-muted/50 transition-colors",
                      title: "Copy username",
                      style: {
                        color: copiedIds.has(`un-${cred.id}`) ? "#22C55E" : void 0
                      },
                      children: copiedIds.has(`un-${cred.id}`) ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/50 w-16 flex-shrink-0", children: "Password" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground/80 flex-1 font-mono truncate", children: revealedIds.has(cred.id) ? cred.password : "•".repeat(Math.min(cred.password.length, 16)) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => toggleReveal(cred.id),
                      "data-ocid": "passwordmanager.toggle",
                      className: "w-6 h-6 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors",
                      title: revealedIds.has(cred.id) ? "Hide password" : "Show password",
                      children: revealedIds.has(cred.id) ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3 h-3" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => copyPassword(cred),
                      "data-ocid": "passwordmanager.button",
                      className: "w-6 h-6 flex items-center justify-center rounded hover:bg-muted/50 transition-colors",
                      title: "Copy password",
                      style: {
                        color: copiedIds.has(`pw-${cred.id}`) ? "#22C55E" : void 0
                      },
                      children: copiedIds.has(`pw-${cred.id}`) ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3" })
                    }
                  )
                ] }),
                (cred.history ?? []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowHistoryFor(
                        showHistoryFor === cred.id ? null : cred.id
                      ),
                      className: "text-[10px] transition-colors",
                      style: { color: "var(--os-text-muted)" },
                      children: showHistoryFor === cred.id ? "▲ Hide history" : `▼ History (${(cred.history ?? []).length})`
                    }
                  ),
                  showHistoryFor === cred.id && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "mt-1.5 flex flex-col gap-1",
                      style: {
                        borderTop: "1px solid var(--os-border-subtle)",
                        paddingTop: 6
                      },
                      children: (cred.history ?? []).slice().reverse().map((h, hi) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "flex items-center gap-2",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "text-[10px] font-mono flex-1 truncate",
                                style: { color: "var(--os-text-secondary)" },
                                children: historyRevealIds.has(`${cred.id}-${hi}`) ? h.password : "•".repeat(Math.min(h.password.length, 14))
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "text-[9px]",
                                style: { color: "var(--os-text-muted)" },
                                children: new Date(h.changedAt).toLocaleDateString()
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => setHistoryRevealIds((prev) => {
                                  const next = new Set(prev);
                                  const k = `${cred.id}-${hi}`;
                                  if (next.has(k)) next.delete(k);
                                  else next.add(k);
                                  return next;
                                }),
                                className: "text-[9px] px-1 rounded",
                                style: {
                                  color: "var(--os-text-muted)",
                                  background: "var(--os-border-subtle)"
                                },
                                children: historyRevealIds.has(`${cred.id}-${hi}`) ? "hide" : "show"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => navigator.clipboard.writeText(h.password).then(
                                  () => ue.success("Copied old password")
                                ),
                                className: "text-[9px] px-1 rounded",
                                style: {
                                  color: "var(--os-text-muted)",
                                  background: "var(--os-border-subtle)"
                                },
                                children: "copy"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => {
                                  setCredentials((prev) => {
                                    const updated = prev.map((c) => {
                                      if (c.id !== cred.id) return c;
                                      const oldPw = c.password;
                                      const hist = [
                                        ...c.history ?? [],
                                        {
                                          password: oldPw,
                                          changedAt: Date.now()
                                        }
                                      ].slice(-10);
                                      return {
                                        ...c,
                                        password: h.password,
                                        history: hist,
                                        updatedAt: Date.now()
                                      };
                                    });
                                    persistCreds(updated);
                                    return updated;
                                  });
                                  ue.success("Password restored");
                                  setShowHistoryFor(null);
                                },
                                className: "text-[9px] px-1 rounded",
                                style: {
                                  color: "rgba(99,102,241,0.9)",
                                  background: "rgba(99,102,241,0.1)",
                                  border: "1px solid rgba(99,102,241,0.2)"
                                },
                                children: "restore"
                              }
                            )
                          ]
                        },
                        `${h.changedAt}`
                      ))
                    }
                  )
                ] })
              ]
            },
            cred.id
          );
        }) }),
        showAddModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 flex items-center justify-center z-50",
            style: { background: "rgba(0,0,0,0.65)" },
            "data-ocid": "passwordmanager.modal",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl p-5 w-72",
                style: {
                  background: "rgba(13,22,32,0.98)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.7), 0 0 20px rgba(99,102,241,0.08)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "h3",
                      {
                        className: "text-sm font-semibold",
                        style: { color: "rgba(99,102,241,1)" },
                        children: "Add Credential"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setShowAddModal(false),
                        "data-ocid": "passwordmanager.close_button",
                        className: "w-6 h-6 flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60 mb-1 block", children: "Site / App" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          ref: siteInputRef,
                          value: newSite,
                          onChange: (e) => setNewSite(e.target.value),
                          "data-ocid": "passwordmanager.input",
                          placeholder: "e.g. GitHub",
                          className: "w-full rounded-lg px-3 py-2 text-xs bg-transparent outline-none",
                          style: {
                            border: "1px solid rgba(99,102,241,0.25)",
                            color: "var(--os-text-primary)"
                          }
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60 mb-1 block", children: "Username" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          value: newUsername,
                          onChange: (e) => setNewUsername(e.target.value),
                          "data-ocid": "passwordmanager.input",
                          placeholder: "Username or email",
                          className: "w-full rounded-lg px-3 py-2 text-xs bg-transparent outline-none",
                          style: {
                            border: "1px solid var(--os-text-muted)",
                            color: "var(--os-text-primary)"
                          }
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60 mb-1 block", children: "Category" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "select",
                        {
                          value: newCategory,
                          onChange: (e) => setNewCategory(e.target.value),
                          "data-ocid": "passwordmanager.select",
                          className: "w-full rounded-lg px-3 py-2 text-xs outline-none",
                          style: {
                            background: "var(--os-border-subtle)",
                            border: "1px solid var(--os-text-muted)",
                            color: "var(--os-text-primary)",
                            colorScheme: "dark"
                          },
                          children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60 mb-1 block", children: "Password" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: showNewPassword ? "text" : "password",
                            value: newPassword,
                            onChange: (e) => setNewPassword(e.target.value),
                            onKeyDown: (e) => e.key === "Enter" && handleAddCredential(),
                            "data-ocid": "passwordmanager.input",
                            placeholder: "Password",
                            className: "w-full rounded-lg px-3 py-2 pr-8 text-xs bg-transparent outline-none",
                            style: {
                              border: "1px solid var(--os-text-muted)",
                              color: "var(--os-text-primary)"
                            }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setShowNewPassword((v) => !v),
                            className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                            children: showNewPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3 h-3" })
                          }
                        )
                      ] }),
                      newPassword && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0.5 mb-1", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "flex-1 h-1 rounded-full transition-all",
                            style: {
                              background: i <= pwStrength.score ? pwStrength.color : "var(--os-text-muted)"
                            }
                          },
                          i
                        )) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "text-[10px]",
                            style: { color: pwStrength.color },
                            children: pwStrength.label
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => setShowGenerator((v) => !v),
                          className: "flex items-center gap-1 text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors mb-1",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3" }),
                            "Password generator"
                          ]
                        }
                      ),
                      showGenerator && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "rounded-lg p-2.5 space-y-2",
                          style: {
                            background: "var(--os-border-subtle)",
                            border: "1px solid var(--os-border-subtle)"
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground/60", children: [
                                "Length: ",
                                genLength
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "input",
                                {
                                  type: "range",
                                  min: 8,
                                  max: 32,
                                  value: genLength,
                                  onChange: (e) => setGenLength(Number(e.target.value)),
                                  className: "accent-cyan-400 w-24 h-2"
                                }
                              )
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: [
                              {
                                label: "Symbols",
                                state: genSymbols,
                                set: setGenSymbols
                              },
                              {
                                label: "Numbers",
                                state: genNumbers,
                                set: setGenNumbers
                              },
                              {
                                label: "Uppercase",
                                state: genUppercase,
                                set: setGenUppercase
                              }
                            ].map(({ label, state, set }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "label",
                              {
                                className: "flex items-center gap-1 cursor-pointer",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    "input",
                                    {
                                      type: "checkbox",
                                      checked: state,
                                      onChange: (e) => set(e.target.checked),
                                      className: "accent-cyan-400 w-3 h-3"
                                    }
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60", children: label })
                                ]
                              },
                              label
                            )) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "button",
                                {
                                  type: "button",
                                  onClick: generatePassword,
                                  "data-ocid": "passwordmanager.button",
                                  className: "flex items-center gap-1 px-2 py-1.5 rounded text-[10px] font-medium transition-all",
                                  style: {
                                    background: "rgba(99,102,241,0.12)",
                                    border: "1px solid rgba(99,102,241,0.25)",
                                    color: "rgba(99,102,241,0.9)"
                                  },
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3" }),
                                    " Generate"
                                  ]
                                }
                              ),
                              generatedPw && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-1", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "input",
                                  {
                                    readOnly: true,
                                    value: generatedPw,
                                    className: "flex-1 px-2 py-1 rounded text-[10px] font-mono outline-none truncate",
                                    style: {
                                      background: "var(--os-border-subtle)",
                                      border: "1px solid var(--os-border-subtle)",
                                      color: "var(--os-text-secondary)"
                                    }
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: () => {
                                      setNewPassword(generatedPw);
                                      setShowGenerator(false);
                                    },
                                    "data-ocid": "passwordmanager.secondary_button",
                                    className: "px-2 py-1 rounded text-[10px] font-medium flex-shrink-0 transition-all",
                                    style: {
                                      background: "rgba(99,102,241,0.1)",
                                      border: "1px solid rgba(99,102,241,0.2)",
                                      color: "rgba(99,102,241,0.8)"
                                    },
                                    children: "Use"
                                  }
                                )
                              ] })
                            ] })
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: handleAddCredential,
                        "data-ocid": "passwordmanager.submit_button",
                        className: "w-full py-2.5 rounded-xl text-xs font-semibold transition-all mt-1",
                        style: {
                          background: "rgba(99,102,241,0.15)",
                          border: "1px solid rgba(99,102,241,0.35)",
                          color: "rgba(99,102,241,1)"
                        },
                        children: "Save Credential"
                      }
                    )
                  ] })
                ]
              }
            )
          }
        )
      ]
    }
  );
}
export {
  PasswordManager
};
