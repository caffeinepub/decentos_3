import {
  Activity,
  ArrowRight,
  BookOpen,
  Check,
  CheckSquare,
  Code,
  Columns,
  FileText,
  Globe,
  Layout,
  Monitor,
  Moon,
  Paintbrush,
  Server,
  Settings,
  Sun,
  Target,
  Terminal,
  TrendingUp,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AppIcon } from "../AppIcons";
import {
  type InstalledApp,
  useInstalledApps,
} from "../context/InstalledAppsContext";
import { useOS } from "../context/OSContext";
import type { DockPosition } from "../context/OSContext";
import { DecentOSLogo } from "./DecentOSLogo";

const ONBOARDING_KEY = "decent_os_onboarded";
const USER_TYPE_KEY = "decent_os_user_type";
const DISPLAY_NAME_KEY = "decentos_display_name";

export function hasBeenOnboarded(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === "true";
  } catch {
    return false;
  }
}

type UserType = "personal" | "developer" | "poweruser" | null;
type AccentColor = "cyan" | "purple" | "amber" | "green" | "rose";

interface OnboardingV2Props {
  onDone: (
    userType: string | null,
    openApp: string | null,
    displayName: string | null,
  ) => void;
}

const USER_TYPES = [
  {
    id: "personal" as UserType,
    icon: User,
    title: "Personal",
    subtitle: "Everyday productivity",
    apps: "Notes, Calendar, File Manager",
    color: "#4f46e5",
  },
  {
    id: "developer" as UserType,
    icon: Code,
    title: "Developer",
    subtitle: "Build and explore",
    apps: "Code Editor, Terminal, API tools",
    color: "#7c3aed",
  },
  {
    id: "poweruser" as UserType,
    icon: Zap,
    title: "Power User",
    subtitle: "Full control",
    apps: "Terminal, Process Monitor, advanced tools",
    color: "#0891b2",
  },
];

const ACCENT_COLORS: { id: AccentColor; hex: string; label: string }[] = [
  { id: "cyan", hex: "#22d3ee", label: "Cyan" },
  { id: "purple", hex: "#8b5cf6", label: "Purple" },
  { id: "amber", hex: "#fbbf24", label: "Amber" },
  { id: "green", hex: "#34d399", label: "Green" },
  { id: "rose", hex: "#fb7185", label: "Rose" },
];

interface PackApp extends InstalledApp {
  description: string;
  color: string;
  LucideIcon: React.ElementType;
}

const APP_PACKS: Record<string, PackApp[]> = {
  personal: [
    {
      id: 14,
      appId: "contactmanager",
      name: "Contact Manager",
      description: "Manage contacts privately on-chain",
      color: "#3B82F6",
      emoji: "👤",
      emojiColor: "#3B82F6",
      LucideIcon: Users,
    },
    {
      id: 19,
      appId: "habittracker",
      name: "Habit Tracker",
      description: "Build streaks, track daily habits",
      color: "#22C55E",
      emoji: "✅",
      emojiColor: "#22C55E",
      LucideIcon: Target,
    },
    {
      id: 15,
      appId: "journal",
      name: "Journal",
      description: "Private daily entries with mood",
      color: "#8B5CF6",
      emoji: "📖",
      emojiColor: "#8B5CF6",
      LucideIcon: BookOpen,
    },
    {
      id: 16,
      appId: "budget",
      name: "Budget Tracker",
      description: "Track income and expenses",
      color: "#10B981",
      emoji: "💰",
      emojiColor: "#10B981",
      LucideIcon: TrendingUp,
    },
    {
      id: 40,
      appId: "taskmanager",
      name: "Task Manager",
      description: "Todos with priority and subtasks",
      color: "#22C55E",
      emoji: "✅",
      emojiColor: "#22C55E",
      LucideIcon: CheckSquare,
    },
  ],
  developer: [
    {
      id: 5,
      appId: "processmonitor",
      name: "Process Monitor",
      description: "Live cycles and process stats",
      color: "#06B6D4",
      emoji: "📊",
      emojiColor: "#06B6D4",
      LucideIcon: Activity,
    },
    {
      id: 7,
      appId: "texteditor",
      name: "Text Editor",
      description: "Lightweight editor with syntax modes",
      color: "#F97316",
      emoji: "📝",
      emojiColor: "#F97316",
      LucideIcon: FileText,
    },
    {
      id: 69,
      appId: "kanban",
      name: "Kanban Board",
      description: "Drag-and-drop project board",
      color: "#27D7E0",
      emoji: "🗂️",
      emojiColor: "#27D7E0",
      LucideIcon: Columns,
    },
    {
      id: 90,
      appId: "apitester",
      name: "API Tester",
      description: "Test HTTP endpoints visually",
      color: "#6366F1",
      emoji: "🧪",
      emojiColor: "#6366F1",
      LucideIcon: Globe,
    },
  ],
  poweruser: [
    {
      id: 5,
      appId: "processmonitor",
      name: "Process Monitor",
      description: "Live cycles and process stats",
      color: "#06B6D4",
      emoji: "📊",
      emojiColor: "#06B6D4",
      LucideIcon: Activity,
    },
    {
      id: 7,
      appId: "texteditor",
      name: "Text Editor",
      description: "Lightweight editor with syntax modes",
      color: "#F97316",
      emoji: "📝",
      emojiColor: "#F97316",
      LucideIcon: FileText,
    },
    {
      id: 69,
      appId: "kanban",
      name: "Kanban Board",
      description: "Drag-and-drop project board",
      color: "#27D7E0",
      emoji: "🗂️",
      emojiColor: "#27D7E0",
      LucideIcon: Columns,
    },
    {
      id: 39,
      appId: "drawing",
      name: "Drawing & Whiteboard",
      description: "Canvas sketching with PNG export",
      color: "#A855F7",
      emoji: "🎨",
      emojiColor: "#A855F7",
      LucideIcon: Paintbrush,
    },
    {
      id: 102,
      appId: "systeminfo",
      name: "System Info",
      description: "Canister stats, memory, uptime",
      color: "#27D7E0",
      emoji: "🖥️",
      emojiColor: "#27D7E0",
      LucideIcon: Monitor,
    },
  ],
};

const FIRST_APPS: Record<string, { id: string; label: string }> = {
  personal: { id: "notes", label: "Open Notes" },
  developer: { id: "codeeditor", label: "Open Code Editor" },
  poweruser: { id: "terminal", label: "Open Terminal" },
};

// 12 visually distinct curated wallpapers
const WALLPAPERS = [
  {
    id: "midnight",
    label: "Midnight",
    value:
      "radial-gradient(ellipse at 30% 40%, #1a0533 0%, #0d1a2e 40%, #0a0f1e 100%)",
    preview: "linear-gradient(135deg, #1a0533 0%, #0d1a2e 60%, #0a0f1e 100%)",
  },
  {
    id: "forest",
    label: "Deep Forest",
    value:
      "radial-gradient(ellipse at 40% 60%, #0d2b0a 0%, #0a1f08 50%, #040d03 100%)",
    preview: "linear-gradient(135deg, #0d2b0a 0%, #0a1f08 60%, #040d03 100%)",
  },
  {
    id: "crimson",
    label: "Crimson",
    value:
      "radial-gradient(ellipse at 60% 30%, #2d0010 0%, #1a0008 50%, #0a0004 100%)",
    preview: "linear-gradient(135deg, #2d0010 0%, #1a0008 60%, #0a0004 100%)",
  },
  {
    id: "ocean",
    label: "Ocean Deep",
    value:
      "radial-gradient(ellipse at 30% 70%, #003d5c 0%, #001a2c 50%, #00080f 100%)",
    preview: "linear-gradient(135deg, #003d5c 0%, #001a2c 60%, #00080f 100%)",
  },
  {
    id: "cosmic",
    label: "Cosmic",
    value:
      "radial-gradient(ellipse at 50% 30%, #2d0060 0%, #0d0022 50%, #05000f 100%)",
    preview: "linear-gradient(135deg, #2d0060 0%, #0d0022 60%, #05000f 100%)",
  },
  {
    id: "amber",
    label: "Amber Night",
    value:
      "radial-gradient(ellipse at 40% 40%, #3d2500 0%, #1a0f00 50%, #080400 100%)",
    preview: "linear-gradient(135deg, #3d2500 0%, #1a0f00 60%, #080400 100%)",
  },
  {
    id: "rose",
    label: "Rose Noir",
    value:
      "radial-gradient(ellipse at 60% 60%, #3d0028 0%, #1a0010 50%, #080005 100%)",
    preview: "linear-gradient(135deg, #3d0028 0%, #1a0010 60%, #080005 100%)",
  },
  {
    id: "arctic",
    label: "Arctic",
    value:
      "radial-gradient(ellipse at 30% 30%, #003040 0%, #001520 50%, #000a10 100%)",
    preview: "linear-gradient(135deg, #003040 0%, #001520 60%, #000a10 100%)",
  },
  {
    id: "obsidian",
    label: "Obsidian",
    value:
      "radial-gradient(ellipse at 50% 50%, #1a1a2e 0%, #0d0d0d 50%, #030303 100%)",
    preview: "linear-gradient(135deg, #1a1a2e 0%, #0d0d0d 60%, #030303 100%)",
  },
  {
    id: "terracotta",
    label: "Terracotta",
    value:
      "radial-gradient(ellipse at 40% 40%, #3d1500 0%, #1a0800 50%, #080300 100%)",
    preview: "linear-gradient(135deg, #3d1500 0%, #1a0800 60%, #080300 100%)",
  },
  {
    id: "steel",
    label: "Steel Storm",
    value:
      "radial-gradient(ellipse at 60% 30%, #1a2535 0%, #0a0f1a 50%, #040608 100%)",
    preview: "linear-gradient(135deg, #1a2535 0%, #0a0f1a 60%, #040608 100%)",
  },
  {
    id: "emerald",
    label: "Emerald",
    value:
      "radial-gradient(ellipse at 30% 60%, #003d22 0%, #001a10 50%, #000805 100%)",
    preview: "linear-gradient(135deg, #003d22 0%, #001a10 60%, #000805 100%)",
  },
];

const TOTAL_STEPS = 6;

// Direction-aware horizontal slide — like macOS setup assistant
let slideDirection = 1;
const stepVariants = {
  enter: () => ({ opacity: 0, x: slideDirection * 80 }),
  center: { opacity: 1, x: 0 },
  exit: () => ({ opacity: 0, x: slideDirection * -80 }),
};

// Shared button styles
const pillPrimary: React.CSSProperties = {
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  border: "none",
  borderRadius: 50,
  color: "white",
  cursor: "pointer",
  fontSize: 15,
  fontWeight: 600,
  padding: "13px 32px",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  letterSpacing: "-0.01em",
  boxShadow: "0 4px 24px rgba(99,102,241,0.35)",
  transition: "all 0.2s ease",
};

const pillPrimaryFull: React.CSSProperties = {
  ...pillPrimary,
  width: "100%",
  justifyContent: "center",
  borderRadius: 50,
};

const pillPrimaryDisabled: React.CSSProperties = {
  ...pillPrimaryFull,
  background: "rgba(255,255,255,0.1)",
  color: "rgba(255,255,255,0.3)",
  cursor: "not-allowed",
  boxShadow: "none",
};

const ghostBack: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "rgba(255,255,255,0.4)",
  cursor: "pointer",
  fontSize: 14,
  padding: "10px 8px",
  letterSpacing: "-0.01em",
  transition: "color 0.15s ease",
};

// Step dot indicator
function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 28,
      }}
    >
      {Array.from({ length: total }, (_, i) => i).map((i) => (
        <div
          key={`dot-${i}`}
          style={{
            width: i === current ? 20 : 6,
            height: 6,
            borderRadius: 3,
            background:
              i === current
                ? "rgba(255,255,255,0.9)"
                : i < current
                  ? "rgba(255,255,255,0.45)"
                  : "rgba(255,255,255,0.18)",
            transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      ))}
    </div>
  );
}

export function OnboardingV2({ onDone }: OnboardingV2Props) {
  const [step, setStepRaw] = useState(0);
  const goToStep = (next: number) => {
    slideDirection = next > step ? 1 : -1;
    setStepRaw(next);
  };
  // keep setStep alias for simplicity
  const setStep = goToStep;
  const [userType, setUserType] = useState<UserType>(null);
  const [selectedWallpaper, setSelectedWallpaper] = useState("midnight");
  const [previewWallpaper, setPreviewWallpaper] = useState(
    () => WALLPAPERS[0].value,
  );
  const [isDark, setIsDark] = useState(true);
  const [dockPos, setDockPos] = useState<DockPosition>("bottom");
  const [displayName, setDisplayName] = useState("");
  const [selectedAccent, setSelectedAccent] = useState<AccentColor>("cyan");
  const [selectedPack, setSelectedPack] = useState<Set<number>>(new Set());

  const { setWallpaper, setTheme, setDockPosition, setAccentColor } = useOS();
  const { install, installedIds } = useInstalledApps();

  const handleSkip = () => {
    try {
      localStorage.setItem(ONBOARDING_KEY, "true");
    } catch {}
    onDone(null, null, null);
  };

  const handleDone = (type: UserType, launch: boolean) => {
    try {
      localStorage.setItem(ONBOARDING_KEY, "true");
      if (type) localStorage.setItem(USER_TYPE_KEY, type);
      if (displayName.trim()) {
        localStorage.setItem(DISPLAY_NAME_KEY, displayName.trim());
      }
      const wallpaper = WALLPAPERS.find((w) => w.id === selectedWallpaper);
      if (wallpaper) setWallpaper(wallpaper.value);
      setTheme(isDark ? "dark" : "light");
      setDockPosition(dockPos);
      setAccentColor(selectedAccent);
      if (type && APP_PACKS[type]) {
        for (const app of APP_PACKS[type]) {
          if (selectedPack.has(app.id) && !installedIds.has(app.id)) {
            install({
              id: app.id,
              appId: app.appId,
              name: app.name,
              emoji: app.emoji,
              emojiColor: app.emojiColor,
            });
          }
        }
      }
    } catch {}
    const app = type && launch ? (FIRST_APPS[type]?.id ?? null) : null;
    const name = displayName.trim() || null;
    onDone(type, app, name);
  };

  const isAppearanceStep = step === 3;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "radial-gradient(ellipse at 50% 60%, #0f1729 0%, #060810 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        overflow: "hidden",
      }}
    >
      {/* Ambient light blobs — purely decorative */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
            top: "10%",
            left: "15%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)",
            bottom: "10%",
            right: "10%",
            transform: "translate(30%, 30%)",
          }}
        />
      </div>

      {/* Skip button — top right, always visible */}
      <button
        type="button"
        onClick={handleSkip}
        data-ocid="onboarding.close_button"
        style={{
          position: "absolute",
          top: 24,
          right: 28,
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          color: "rgba(255,255,255,0.4)",
          cursor: "pointer",
          padding: "5px 14px",
          fontSize: 13,
          display: "flex",
          alignItems: "center",
          gap: 5,
          zIndex: 10,
          letterSpacing: "-0.01em",
          backdropFilter: "blur(8px)",
        }}
      >
        <X size={12} /> Skip
      </button>

      {/* Animated width container: narrow for most steps, wide for appearance */}
      <motion.div
        animate={{
          maxWidth: isAppearanceStep ? 920 : 560,
        }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: "100%",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <AnimatePresence mode="wait">
          {/* ── Step 0: Welcome ── */}
          {step === 0 && (
            <motion.div
              key="step0"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
              style={{ textAlign: "center" }}
            >
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.1,
                  duration: 0.5,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                style={{
                  marginBottom: 28,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <DecentOSLogo size={60} />
              </motion.div>
              <h1
                style={{
                  color: "white",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  margin: "0 0 16px",
                  lineHeight: 1.15,
                  letterSpacing: "-0.03em",
                }}
              >
                Your OS.
                <br />
                <span style={{ color: "rgba(255,255,255,0.55)" }}>
                  On-chain. Yours forever.
                </span>
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  margin: "0 auto 44px",
                  maxWidth: 400,
                }}
              >
                A fully decentralized operating system running in your browser.
                No accounts. No servers. Your data lives on the blockchain
                permanently.
              </p>
              <StepDots total={TOTAL_STEPS} current={0} />
              <button
                type="button"
                onClick={() => setStep(1)}
                data-ocid="onboarding.primary_button"
                style={pillPrimary}
              >
                Get Started <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {/* ── Step 1: User Type ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
            >
              <h2
                style={{
                  color: "white",
                  fontSize: "2rem",
                  fontWeight: 700,
                  margin: "0 0 10px",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.2,
                }}
              >
                What brings you to DecentOS?
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "1rem",
                  margin: "0 0 32px",
                  lineHeight: 1.6,
                }}
              >
                We'll personalize your setup based on how you work.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 36,
                }}
              >
                {USER_TYPES.map((type) => {
                  const Icon = type.icon;
                  const selected = userType === type.id;
                  return (
                    <button
                      type="button"
                      key={type.id}
                      onClick={() => setUserType(type.id)}
                      data-ocid={`onboarding.${type.id}.button`}
                      style={{
                        background: selected
                          ? "rgba(99,102,241,0.18)"
                          : "rgba(255,255,255,0.04)",
                        border: selected
                          ? "1.5px solid rgba(99,102,241,0.7)"
                          : "1.5px solid rgba(255,255,255,0.08)",
                        borderRadius: 16,
                        padding: "16px 18px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        textAlign: "left",
                        transition: "all 0.15s ease",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: selected
                            ? type.color
                            : "rgba(255,255,255,0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "background 0.15s ease",
                        }}
                      >
                        <Icon size={22} color="white" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            color: "white",
                            fontWeight: 600,
                            fontSize: 15,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {type.title}
                        </div>
                        <div
                          style={{
                            color: "rgba(255,255,255,0.4)",
                            fontSize: 13,
                            marginTop: 2,
                          }}
                        >
                          {type.subtitle} — {type.apps}
                        </div>
                      </div>
                      {selected && (
                        <Check
                          size={17}
                          color="#818cf8"
                          style={{ flexShrink: 0 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              <StepDots total={TOTAL_STEPS} current={1} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  style={ghostBack}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => userType && setStep(2)}
                  disabled={!userType}
                  data-ocid="onboarding.continue_button"
                  style={
                    userType
                      ? pillPrimary
                      : {
                          ...pillPrimary,
                          ...pillPrimaryDisabled,
                          width: "auto",
                        }
                  }
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Personalize ── */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
            >
              <h2
                style={{
                  color: "white",
                  fontSize: "2rem",
                  fontWeight: 700,
                  margin: "0 0 10px",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.2,
                }}
              >
                Make it yours
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "1rem",
                  margin: "0 0 36px",
                  lineHeight: 1.6,
                }}
              >
                Set your name and choose an accent color.
              </p>

              {/* Display name */}
              <div style={{ marginBottom: 32 }}>
                <label
                  htmlFor="onboarding-name"
                  style={{
                    display: "block",
                    color: "rgba(255,255,255,0.35)",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 10,
                  }}
                >
                  Your Name
                </label>
                <input
                  id="onboarding-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name (optional)"
                  data-ocid="onboarding.name.input"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.06)",
                    border: "1.5px solid rgba(255,255,255,0.1)",
                    borderRadius: 14,
                    color: "white",
                    fontSize: 15,
                    padding: "13px 16px",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s ease",
                    letterSpacing: "-0.01em",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(99,102,241,0.7)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                />
              </div>

              {/* Accent color */}
              <div style={{ marginBottom: 44 }}>
                <p
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    margin: "0 0 14px",
                  }}
                >
                  Accent Color
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                  }}
                >
                  {ACCENT_COLORS.map((ac) => {
                    const isSelected = selectedAccent === ac.id;
                    return (
                      <button
                        key={ac.id}
                        type="button"
                        onClick={() => {
                          setSelectedAccent(ac.id);
                          setAccentColor(ac.id);
                        }}
                        title={ac.label}
                        data-ocid={`onboarding.accent_${ac.id}.button`}
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          background: ac.hex,
                          border: isSelected
                            ? "2.5px solid white"
                            : "2.5px solid transparent",
                          cursor: "pointer",
                          padding: 0,
                          outline: isSelected
                            ? "2px solid rgba(255,255,255,0.25)"
                            : "none",
                          outlineOffset: 2,
                          transition: "all 0.15s ease",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: isSelected
                            ? `0 0 16px ${ac.hex}88`
                            : "none",
                        }}
                      >
                        {isSelected && (
                          <Check size={15} color="white" strokeWidth={3} />
                        )}
                      </button>
                    );
                  })}
                  <span
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: 13,
                      marginLeft: 4,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {ACCENT_COLORS.find((a) => a.id === selectedAccent)?.label}
                  </span>
                </div>
              </div>

              <StepDots total={TOTAL_STEPS} current={2} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={ghostBack}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  data-ocid="onboarding.continue_button"
                  style={pillPrimary}
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Choose your look — two-column, expands to 900px ── */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
              style={{ display: "flex", gap: 32, alignItems: "stretch" }}
            >
              {/* ── Left: controls ── */}
              <div
                style={{
                  flex: "0 0 340px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h2
                  style={{
                    color: "white",
                    fontSize: "2rem",
                    fontWeight: 700,
                    margin: "0 0 10px",
                    letterSpacing: "-0.025em",
                    lineHeight: 1.2,
                  }}
                >
                  Choose your look
                </h2>
                <p
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: "1rem",
                    margin: "0 0 28px",
                    lineHeight: 1.6,
                  }}
                >
                  Pick a wallpaper and UI theme.
                </p>

                {/* Light / Dark toggle */}
                <p
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    margin: "0 0 10px",
                  }}
                >
                  Appearance
                </p>
                <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                  <button
                    type="button"
                    onClick={() => setIsDark(true)}
                    data-ocid="onboarding.dark_toggle"
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: isDark
                        ? "1.5px solid rgba(99,102,241,0.7)"
                        : "1.5px solid rgba(255,255,255,0.08)",
                      background: isDark
                        ? "rgba(99,102,241,0.18)"
                        : "rgba(255,255,255,0.04)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 7,
                      color: "white",
                      fontSize: 13,
                      fontWeight: 600,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Moon size={15} />
                    Dark
                    {isDark && <Check size={13} color="#818cf8" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDark(false)}
                    data-ocid="onboarding.light_toggle"
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: !isDark
                        ? "1.5px solid rgba(99,102,241,0.7)"
                        : "1.5px solid rgba(255,255,255,0.08)",
                      background: !isDark
                        ? "rgba(99,102,241,0.18)"
                        : "rgba(255,255,255,0.04)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 7,
                      color: "white",
                      fontSize: 13,
                      fontWeight: 600,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Sun size={15} />
                    Light
                    {!isDark && <Check size={13} color="#818cf8" />}
                  </button>
                </div>

                {/* Wallpaper picker */}
                <p
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    margin: "0 0 10px",
                  }}
                >
                  Wallpaper
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 7,
                    marginBottom: 24,
                  }}
                >
                  {WALLPAPERS.map((w) => {
                    const isSelected = selectedWallpaper === w.id;
                    return (
                      <button
                        type="button"
                        key={w.id}
                        onClick={() => {
                          setSelectedWallpaper(w.id);
                          setPreviewWallpaper(w.value);
                        }}
                        onMouseEnter={() => setPreviewWallpaper(w.value)}
                        onMouseLeave={() => {
                          const current = WALLPAPERS.find(
                            (wp) => wp.id === selectedWallpaper,
                          );
                          setPreviewWallpaper(
                            current?.value ?? WALLPAPERS[0].value,
                          );
                        }}
                        data-ocid={`onboarding.wallpaper.${w.id}`}
                        style={{
                          height: 38,
                          borderRadius: 10,
                          background: w.preview,
                          border: isSelected
                            ? "2px solid #818cf8"
                            : "2px solid rgba(255,255,255,0.08)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          padding: "0 12px",
                          gap: 8,
                          transition:
                            "border-color 0.15s ease, box-shadow 0.15s ease",
                          boxShadow: isSelected ? "0 0 0 1px #818cf8" : "none",
                        }}
                        title={w.label}
                      >
                        <span
                          style={{
                            flex: 1,
                            fontSize: 12,
                            color: "rgba(255,255,255,0.9)",
                            fontWeight: 600,
                            textAlign: "left",
                            textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {w.label}
                        </span>
                        {isSelected && (
                          <Check
                            size={13}
                            color="white"
                            strokeWidth={3}
                            style={{
                              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.8))",
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Dock position */}
                <p
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    margin: "0 0 10px",
                  }}
                >
                  Dock Position
                </p>
                <div style={{ display: "flex", gap: 8, marginBottom: 36 }}>
                  {(["bottom", "left", "right"] as DockPosition[]).map(
                    (pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setDockPos(pos)}
                        data-ocid={`onboarding.dock_${pos}.button`}
                        style={{
                          flex: 1,
                          padding: "8px 10px",
                          borderRadius: 10,
                          border:
                            dockPos === pos
                              ? "1.5px solid rgba(99,102,241,0.7)"
                              : "1.5px solid rgba(255,255,255,0.08)",
                          background:
                            dockPos === pos
                              ? "rgba(99,102,241,0.18)"
                              : "rgba(255,255,255,0.04)",
                          cursor: "pointer",
                          color: "white",
                          fontSize: 12,
                          fontWeight: 600,
                          textTransform: "capitalize",
                          transition: "all 0.15s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 5,
                        }}
                      >
                        {dockPos === pos && <Check size={12} color="#818cf8" />}
                        {pos}
                      </button>
                    ),
                  )}
                </div>

                <StepDots total={TOTAL_STEPS} current={3} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    style={ghostBack}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (userType && APP_PACKS[userType]) {
                        setSelectedPack(
                          new Set(APP_PACKS[userType].map((a) => a.id)),
                        );
                      }
                      setStep(4);
                    }}
                    data-ocid="onboarding.continue_button"
                    style={pillPrimary}
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* ── Right: live OS preview ── */}
              <div
                style={{
                  flex: 1,
                  borderRadius: 16,
                  background: previewWallpaper,
                  transition: "background 0.5s ease",
                  position: "relative",
                  overflow: "hidden",
                  minHeight: 420,
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
                }}
              >
                {/* Menu bar */}
                <div
                  style={{
                    height: 28,
                    background: isDark
                      ? "rgba(20,20,28,0.9)"
                      : "rgba(240,240,248,0.95)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 16px",
                    justifyContent: "space-between",
                    backdropFilter: "blur(8px)",
                    borderBottom: isDark
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: isDark
                        ? "rgba(255,255,255,0.85)"
                        : "rgba(0,0,0,0.8)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    DecentOS
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: isDark
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(0,0,0,0.45)",
                    }}
                  >
                    9:41 AM
                  </span>
                </div>

                {/* Desktop area */}
                <div
                  style={{
                    position: "relative",
                    padding: 20,
                    height: "calc(100% - 28px - 52px)",
                    overflow: "hidden",
                  }}
                >
                  {/* Desktop icons */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                      width: 100,
                    }}
                  >
                    {[
                      { color: "#f59e0b", label: "Notes" },
                      { color: "#3b82f6", label: "Calendar" },
                      { color: "#10b981", label: "Files" },
                      { color: "#8b5cf6", label: "Settings" },
                    ].map((icon) => (
                      <div
                        key={icon.label}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 9,
                            background: icon.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                          }}
                        >
                          <div
                            style={{
                              width: 18,
                              height: 18,
                              background: "rgba(255,255,255,0.85)",
                              borderRadius: 4,
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 10,
                            color: "white",
                            textShadow: "0 1px 3px rgba(0,0,0,0.9)",
                            fontWeight: 600,
                            textAlign: "center",
                          }}
                        >
                          {icon.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Fake window */}
                  <div
                    style={{
                      position: "absolute",
                      top: "15%",
                      left: "22%",
                      right: 20,
                      bottom: 12,
                      borderRadius: 12,
                      background: isDark
                        ? "rgba(30,30,38,0.92)"
                        : "rgba(250,250,252,0.93)",
                      backdropFilter: "blur(16px)",
                      border: isDark
                        ? "1px solid rgba(255,255,255,0.1)"
                        : "1px solid rgba(0,0,0,0.08)",
                      overflow: "hidden",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    }}
                  >
                    <div
                      style={{
                        height: 28,
                        background: isDark
                          ? "rgba(40,40,52,0.95)"
                          : "rgba(245,245,250,0.95)",
                        display: "flex",
                        alignItems: "center",
                        padding: "0 10px",
                        gap: 6,
                        borderBottom: isDark
                          ? "1px solid rgba(255,255,255,0.06)"
                          : "1px solid rgba(0,0,0,0.07)",
                      }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: "#ff5f57",
                        }}
                      />
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: "#febc2e",
                        }}
                      />
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: "#28c840",
                        }}
                      />
                      <span
                        style={{
                          fontSize: 10,
                          color: isDark
                            ? "rgba(255,255,255,0.6)"
                            : "rgba(0,0,0,0.5)",
                          marginLeft: 4,
                          fontWeight: 600,
                        }}
                      >
                        Notes
                      </span>
                    </div>
                    <div
                      style={{
                        padding: 12,
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      {[
                        { w: "65%", h: 6, r: 3, heavy: true },
                        { w: "88%", h: 4, r: 2, heavy: false },
                        { w: "72%", h: 4, r: 2, heavy: false },
                        { w: "55%", h: 4, r: 2, heavy: false },
                      ].map((line) => (
                        <div
                          key={`${line.w}-${line.h}`}
                          style={{
                            height: line.h,
                            borderRadius: line.r,
                            background: isDark
                              ? line.heavy
                                ? "rgba(255,255,255,0.18)"
                                : "rgba(255,255,255,0.09)"
                              : line.heavy
                                ? "rgba(0,0,0,0.12)"
                                : "rgba(0,0,0,0.07)",
                            width: line.w,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dock — responds to dockPos */}
                <div
                  style={{
                    position: "absolute",
                    ...(dockPos === "bottom"
                      ? {
                          bottom: 8,
                          left: "50%",
                          transform: "translateX(-50%)",
                        }
                      : dockPos === "left"
                        ? {
                            left: 8,
                            top: "50%",
                            transform: "translateY(-50%)",
                          }
                        : {
                            right: 8,
                            top: "50%",
                            transform: "translateY(-50%)",
                          }),
                    background: isDark
                      ? "rgba(30,30,38,0.75)"
                      : "rgba(240,240,248,0.8)",
                    backdropFilter: "blur(16px)",
                    borderRadius: 14,
                    padding: dockPos === "bottom" ? "6px 10px" : "10px 6px",
                    display: "flex",
                    flexDirection: dockPos === "bottom" ? "row" : "column",
                    gap: 6,
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                    transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  {["#f59e0b", "#3b82f6", "#ef4444", "#10b981", "#8b5cf6"].map(
                    (color) => (
                      <div
                        key={color}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 5,
                          background: color,
                        }}
                      />
                    ),
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 4: App Pack ── */}
          {step === 4 && userType && (
            <motion.div
              key="step4"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
            >
              <h2
                style={{
                  color: "white",
                  fontSize: "2rem",
                  fontWeight: 700,
                  margin: "0 0 10px",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.2,
                }}
              >
                Install your starter apps
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "1rem",
                  margin: "0 0 28px",
                  lineHeight: 1.6,
                }}
              >
                Handpicked for{" "}
                {userType === "personal"
                  ? "personal use"
                  : userType === "developer"
                    ? "developers"
                    : "power users"}
                . Uncheck any you don't want.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginBottom: 24,
                  maxHeight: 320,
                  overflowY: "auto",
                  paddingRight: 4,
                }}
              >
                {(APP_PACKS[userType] ?? []).map((app) => {
                  const Icon = app.LucideIcon;
                  const checked = selectedPack.has(app.id);
                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => {
                        setSelectedPack((prev) => {
                          const next = new Set(prev);
                          if (next.has(app.id)) {
                            next.delete(app.id);
                          } else {
                            next.add(app.id);
                          }
                          return next;
                        });
                      }}
                      data-ocid={`onboarding.pack_${app.appId}.toggle`}
                      style={{
                        background: checked
                          ? "rgba(99,102,241,0.12)"
                          : "rgba(255,255,255,0.04)",
                        border: checked
                          ? "1.5px solid rgba(99,102,241,0.5)"
                          : "1.5px solid rgba(255,255,255,0.08)",
                        borderRadius: 14,
                        padding: "12px 16px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        textAlign: "left",
                        transition: "all 0.15s ease",
                        width: "100%",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 9,
                          background: app.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={17} color="white" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            color: "white",
                            fontWeight: 600,
                            fontSize: 14,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {app.name}
                        </div>
                        <div
                          style={{
                            color: "rgba(255,255,255,0.4)",
                            fontSize: 12,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {app.description}
                        </div>
                      </div>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 5,
                          background: checked
                            ? "#6366f1"
                            : "rgba(255,255,255,0.08)",
                          border: checked
                            ? "1.5px solid #6366f1"
                            : "1.5px solid rgba(255,255,255,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all 0.15s ease",
                        }}
                      >
                        {checked && (
                          <Check size={11} color="white" strokeWidth={3} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <p
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: 12,
                  margin: "0 0 20px",
                  textAlign: "center",
                  letterSpacing: "-0.01em",
                }}
              >
                {selectedPack.size} app{selectedPack.size !== 1 ? "s" : ""}{" "}
                selected · More in the App Store later
              </p>

              <StepDots total={TOTAL_STEPS} current={4} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  style={ghostBack}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  data-ocid="onboarding.continue_button"
                  style={pillPrimary}
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 5: All Set ── */}
          {step === 5 && (
            <motion.div
              key="step5"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
              style={{ textAlign: "center" }}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.1,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 28px",
                  boxShadow: "0 0 48px rgba(99,102,241,0.45)",
                }}
              >
                <Check size={32} color="white" strokeWidth={2.5} />
              </motion.div>
              <h2
                style={{
                  color: "white",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  margin: "0 0 16px",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                }}
              >
                {displayName.trim()
                  ? `You're all set,\n${displayName.trim()}.`
                  : "You're all set."}
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "1.05rem",
                  margin: "0 auto 44px",
                  lineHeight: 1.7,
                  maxWidth: 380,
                }}
              >
                Your{" "}
                {userType === "personal"
                  ? "personal"
                  : userType === "developer"
                    ? "developer"
                    : "power user"}{" "}
                workspace is ready. Let's open your first app.
              </p>

              <StepDots total={TOTAL_STEPS} current={5} />

              {userType && (
                <button
                  type="button"
                  onClick={() => handleDone(userType, true)}
                  data-ocid="onboarding.open_app_button"
                  style={{ ...pillPrimary, marginBottom: 16 }}
                >
                  {FIRST_APPS[userType]?.label ?? "Open App"}{" "}
                  <ArrowRight size={16} />
                </button>
              )}

              <div>
                <button
                  type="button"
                  onClick={() => handleDone(userType, false)}
                  data-ocid="onboarding.secondary_button"
                  style={ghostBack}
                >
                  Go to desktop instead
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
