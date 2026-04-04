import { c as createLucideIcon, r as reactExports, u as useOS, v as useInstalledApps, w as useListAvailableApps, x as useInstallApp, y as useUninstallApp, z as useGrantPermissions, A as useRevokePermissions, j as jsxRuntimeExports, S as Search, X, L as LoaderCircle, D as AppIcon, E as TrendingUp, P as Package, m as Lock, T as Trash2, g as ue } from "./index-8tMpYjTW.js";
import { S as Star } from "./star-CUwRbTIB.js";
import { E as ExternalLink } from "./external-link-C_L1PEdN.js";
import { D as Download } from "./download-BCO-vDCJ.js";
import { S as Shield } from "./shield-DHJOVrKO.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
const CATEGORIES = [
  "All",
  "System",
  "Productivity",
  "Developer",
  "Media",
  "Utilities",
  "Security",
  "Finance",
  "Health",
  "Entertainment"
];
const CATEGORY_ICONS = {
  All: "����",
  System: "������",
  Productivity: "����",
  Developer: "����",
  Media: "����",
  Utilities: "����",
  Security: "����",
  Finance: "����",
  Health: "����",
  Entertainment: "����"
};
const CORE_APP_IDS = /* @__PURE__ */ new Set([
  "filemanager",
  "appstore",
  "notes",
  "wordprocessor",
  "calculator",
  "browser",
  "terminal",
  "codeeditor",
  "calendar",
  "spreadsheet"
]);
const CATEGORY_COLORS = {
  System: "#3b82f6",
  Productivity: "#8b5cf6",
  Developer: "#7c3aed",
  Media: "#ec4899",
  Utilities: "#f59e0b",
  Security: "#10b981",
  Finance: "#22c55e",
  Health: "#ef4444",
  Entertainment: "#f97316",
  All: "#6366f1"
};
const BUILTIN_APPS = [
  // ������ Core apps (always on desktop, locked) ������
  {
    id: 1,
    name: "File Manager",
    description: "Browse and manage your on-chain file system with full CRUD operations",
    appId: "filemanager",
    version: "1.0.0",
    permissions: ["file:read", "file:write"],
    category: "System",
    emoji: "����",
    emojiColor: "#3B82F6",
    isCore: true
  },
  {
    id: 2,
    name: "Terminal",
    description: "Command-line shell with full kernel access and real-time system interaction",
    appId: "terminal",
    version: "2.1.0",
    permissions: ["system:read", "file:read", "file:write"],
    category: "System",
    emoji: "���",
    emojiColor: "#22C55E",
    isCore: true
  },
  {
    id: 3,
    name: "Notes",
    description: "Multi-note editor with sidebar, auto-save, and local storage",
    appId: "notes",
    version: "2.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "����",
    emojiColor: "#F59E0B",
    isCore: true
  },
  {
    id: 4,
    name: "Code Editor",
    description: "Full IDE with Motoko syntax highlighting, line numbers, and file save/load",
    appId: "codeeditor",
    version: "1.5.0",
    permissions: ["file:read", "file:write"],
    category: "Developer",
    emoji: "�������",
    emojiColor: "#8B5CF6",
    isCore: true,
    featured: true
  },
  {
    id: 6,
    name: "Calculator",
    description: "Scientific calculator with full history and keyboard support",
    appId: "calculator",
    version: "1.0.0",
    permissions: [],
    category: "Utilities",
    emoji: "����",
    emojiColor: "#10B981",
    isCore: true
  },
  {
    id: 8,
    name: "Browser",
    description: "Fetch real URLs via blockchain HTTP outcalls ��� no centralized servers",
    appId: "browser",
    version: "1.0.0",
    permissions: ["network:read"],
    category: "Utilities",
    emoji: "����",
    emojiColor: "#6366F1",
    isCore: true,
    featured: true
  },
  {
    id: 35,
    name: "WriteOS",
    description: "Rich text word processor with file system integration and auto-save",
    appId: "wordprocessor",
    version: "2.0.0",
    permissions: ["file:read", "file:write"],
    category: "Productivity",
    emoji: "����",
    emojiColor: "#F97316",
    isCore: true,
    featured: true
  },
  {
    id: 36,
    name: "Calendar",
    description: "Monthly calendar with on-chain event storage and reminders",
    appId: "calendar",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "����",
    emojiColor: "#06B6D4",
    isCore: true
  },
  {
    id: 37,
    name: "Spreadsheet",
    description: "Spreadsheet with formulas (SUM, AVERAGE, MIN, MAX, COUNT) and CSV export",
    appId: "spreadsheet",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "����",
    emojiColor: "#10B981",
    isCore: true
  },
  // ������ Installable system/utility apps ������
  {
    id: 5,
    name: "Process Monitor",
    description: "Live view of running processes and real-time cycles usage metrics",
    appId: "processmonitor",
    version: "1.0.0",
    permissions: ["system:read"],
    category: "System",
    emoji: "����",
    emojiColor: "#06B6D4"
  },
  {
    id: 9,
    name: "Music Player",
    description: "Play audio files stored in your decentralized file system",
    appId: "musicplayer",
    version: "1.0.0",
    permissions: ["file:read"],
    category: "Media",
    emoji: "����",
    emojiColor: "#EC4899"
  },
  {
    id: 10,
    name: "Image Viewer",
    description: "View and browse images stored in your blockchain file system",
    appId: "imageviewer",
    version: "1.0.0",
    permissions: ["file:read"],
    category: "Media",
    emoji: "�������",
    emojiColor: "#14B8A6"
  },
  {
    id: 11,
    name: "System Dashboard",
    description: "Real-time system stats, cycle metrics, and OS health at a glance",
    appId: "dashboard",
    version: "1.0.0",
    permissions: ["system:read"],
    category: "System",
    emoji: "����",
    emojiColor: "#27D7E0",
    featured: true
  },
  {
    id: 12,
    name: "Settings",
    description: "Configure OS preferences, manage permissions, and customize the desktop",
    appId: "settings",
    version: "1.0.0",
    permissions: ["system:read", "system:write"],
    category: "System",
    emoji: "������",
    emojiColor: "#64748B"
  },
  {
    id: 13,
    name: "Clipboard Manager",
    description: "Track copy/paste history, pin important clips, and share between apps",
    appId: "clipboard",
    version: "1.0.0",
    permissions: [],
    category: "Utilities",
    emoji: "����",
    emojiColor: "#84CC16"
  },
  {
    id: 38,
    name: "Pomodoro Timer",
    description: "Focus timer with work/break phases, SVG ring, and audio alerts",
    appId: "pomodoro",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "������",
    emojiColor: "#F43F5E"
  },
  {
    id: 39,
    name: "Drawing & Whiteboard",
    description: "Canvas-based sketching tool with pen, shapes, colors, undo, and PNG export",
    appId: "drawing",
    version: "1.0.0",
    permissions: [],
    category: "Media",
    emoji: "����",
    emojiColor: "#A855F7"
  },
  {
    id: 40,
    name: "Task Manager",
    description: "Track to-dos with priority levels and completion status",
    appId: "taskmanager",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "���",
    emojiColor: "#22C55E"
  },
  {
    id: 41,
    name: "Password Manager",
    description: "PIN-protected vault for storing credentials securely on-chain",
    appId: "passwordmanager",
    version: "1.0.0",
    permissions: [],
    category: "Utilities",
    emoji: "����",
    emojiColor: "#EF4444"
  },
  // ������ Marketplace apps ������
  {
    id: 14,
    name: "Contact Manager",
    description: "Store and manage personal contacts privately on the blockchain",
    appId: "contactmanager",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "����",
    emojiColor: "#3B82F6"
  },
  {
    id: 15,
    name: "Journal",
    description: "Private daily journal with mood tracking and date-stamped entries",
    appId: "journal",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "����",
    emojiColor: "#8B5CF6",
    featured: true
  },
  {
    id: 16,
    name: "Budget Tracker",
    description: "Track income and expenses with categories and running totals",
    appId: "budget",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "����",
    emojiColor: "#10B981"
  },
  {
    id: 17,
    name: "Markdown Viewer",
    description: "Live side-by-side markdown editor and renderer with code blocks",
    appId: "markdown",
    version: "1.0.0",
    permissions: [],
    category: "Developer",
    emoji: "����",
    emojiColor: "#F59E0B"
  },
  {
    id: 18,
    name: "Unit Converter",
    description: "Convert length, weight, temperature, and data units ��� all offline",
    appId: "converter",
    version: "1.0.0",
    permissions: [],
    category: "Utilities",
    emoji: "����",
    emojiColor: "#06B6D4"
  },
  {
    id: 19,
    name: "Habit Tracker",
    description: "Build daily habits with streak tracking and a 7-day completion grid",
    appId: "habittracker",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "���",
    emojiColor: "#22C55E",
    featured: true
  },
  {
    id: 20,
    name: "Bookmarks",
    description: "Save and organize URLs with tags, search, and a detail panel",
    appId: "bookmarks",
    version: "1.0.0",
    permissions: [],
    category: "Utilities",
    emoji: "����",
    emojiColor: "#6366F1"
  },
  {
    id: 21,
    name: "Daily Planner",
    description: "Time-blocked daily schedule with an hourly timeline",
    appId: "planner",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "����",
    emojiColor: "#06B6D4",
    featured: true
  },
  {
    id: 22,
    name: "Flashcards",
    description: "Create decks and study with 3D card flip and progress tracking",
    appId: "flashcards",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "����",
    emojiColor: "#F59E0B"
  },
  {
    id: 23,
    name: "Recipe Manager",
    description: "Store and organize recipes with ingredients, steps, and categories",
    appId: "recipes",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "����",
    emojiColor: "#F43F5E"
  },
  {
    id: 24,
    name: "Mind Map",
    description: "Visual brainstorming canvas with draggable nodes and connections",
    appId: "mindmap",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "����",
    emojiColor: "#8B5CF6",
    featured: true
  },
  {
    id: 25,
    name: "ICP Portfolio",
    description: "Track ICP and crypto holdings with prices and 24h change",
    appId: "portfolio",
    version: "1.0.0",
    permissions: [],
    category: "Utilities",
    emoji: "����",
    emojiColor: "#27D7E0"
  },
  {
    id: 26,
    name: "Time Tracker",
    description: "Track time across projects and tasks with timers and entries",
    appId: "timetracker",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "������",
    emojiColor: "#27D7E0"
  },
  {
    id: 27,
    name: "Personal Wiki",
    description: "Your private linked knowledge base with markdown and [[page]] links",
    appId: "personalwiki",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "����",
    emojiColor: "#8B5CF6",
    featured: true
  },
  {
    id: 28,
    name: "Goal Tracker",
    description: "Set goals, track milestones, and measure progress over time",
    appId: "goaltracker",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "����",
    emojiColor: "#F59E0B"
  },
  {
    id: 29,
    name: "Sticky Notes",
    description: "Colorful sticky notes for quick reminders and ideas",
    appId: "stickynotes",
    version: "1.0.0",
    permissions: [],
    category: "Utilities",
    emoji: "����",
    emojiColor: "#EC4899"
  },
  {
    id: 32,
    name: "Color Picker",
    description: "Pick colors, view HEX/RGB/HSL values, and save a personal palette",
    appId: "colorpicker",
    version: "1.0.0",
    permissions: [],
    category: "Developer",
    emoji: "����",
    emojiColor: "#EC4899"
  },
  {
    id: 42,
    name: "World Clock",
    description: "Multi-timezone world clock with add/remove cities and live time display",
    appId: "worldclock",
    version: "1.0.0",
    permissions: [],
    category: "Utilities",
    emoji: "����",
    emojiColor: "#27D7E0"
  },
  {
    id: 44,
    name: "Encryption Tool",
    description: "Encrypt and decrypt text with a password using XOR cipher.",
    appId: "encryption",
    version: "1.0.0",
    permissions: [],
    category: "Security",
    emoji: "����",
    emojiColor: "#27D7E0"
  },
  {
    id: 45,
    name: "QR Code Generator",
    description: "Generate QR codes from any text or URL.",
    appId: "qrcode",
    version: "1.0.0",
    permissions: [],
    category: "Utilities",
    emoji: "����",
    emojiColor: "#8B5CF6"
  },
  {
    id: 46,
    name: "Loan Calculator",
    description: "Calculate monthly payments and amortization schedule.",
    appId: "loancalc",
    version: "1.0.0",
    permissions: [],
    category: "Finance",
    emoji: "����",
    emojiColor: "#22C55E"
  },
  {
    id: 47,
    name: "Sleep Tracker",
    description: "Track your sleep patterns and view weekly averages.",
    appId: "sleeptracker",
    version: "1.0.0",
    permissions: [],
    category: "Health",
    emoji: "����",
    emojiColor: "#6366F1"
  },
  {
    id: 48,
    name: "Keyboard Shortcuts",
    description: "Quick reference for all DecentOS keyboard shortcuts.",
    appId: "shortcuts",
    version: "1.0.0",
    permissions: [],
    category: "System",
    emoji: "������",
    emojiColor: "#F59E0B"
  },
  {
    id: 49,
    name: "Personal Finance",
    description: "Track income, expenses, assets, and liabilities. Calculate net worth.",
    appId: "personalfinance",
    version: "1.0.0",
    permissions: [],
    category: "Finance",
    emoji: "����",
    emojiColor: "#22C55E"
  },
  {
    id: 50,
    name: "Vocab Notes",
    description: "Build vocabulary lists and quiz yourself with flashcard-style review.",
    appId: "vocabnotes",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "����",
    emojiColor: "#8B5CF6"
  },
  {
    id: 51,
    name: "Mood Tracker",
    description: "Log your daily mood with notes and visualize trends over time.",
    appId: "moodtracker",
    version: "1.0.0",
    permissions: [],
    category: "Health",
    emoji: "����",
    emojiColor: "#27D7E0"
  },
  {
    id: 52,
    name: "Code Snippets",
    description: "Save and organize reusable code snippets with syntax highlighting.",
    appId: "codesnippets",
    version: "1.0.0",
    permissions: [],
    category: "Developer",
    emoji: "������",
    emojiColor: "#8B5CF6"
  },
  {
    id: 53,
    name: "Reading List",
    description: "Save URLs with personal notes and tags. Your private, permanent reading list.",
    appId: "readinglist",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "����",
    emojiColor: "#6366F1"
  },
  {
    id: 54,
    name: "Daily Log",
    description: "Quick daily standup log: what you did, doing, and blockers. Timestamped entries.",
    appId: "dailylog",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "����",
    emojiColor: "#22C55E"
  },
  {
    id: 55,
    name: "Expense Splitter",
    description: "Add participants and expenses, auto-calculate who owes whom.",
    appId: "splitter",
    version: "1.0.0",
    permissions: [],
    category: "Finance",
    emoji: "����",
    emojiColor: "#F59E0B"
  },
  {
    id: 56,
    name: "Personal CRM",
    description: "Track relationships, contacts, and conversations on-chain.",
    appId: "personalcrm",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    featured: true,
    emoji: "����",
    emojiColor: "#27D7E0"
  },
  {
    id: 57,
    name: "Finance Dashboard",
    description: "Personal finance overview with expense breakdown and savings trend.",
    appId: "financedashboard",
    version: "1.0.0",
    permissions: [],
    category: "Finance",
    featured: true,
    emoji: "����",
    emojiColor: "#63B3ED"
  },
  {
    id: 58,
    name: "Secure Notes",
    description: "PIN-protected, encrypted notes for sensitive information.",
    appId: "securenotes",
    version: "1.0.0",
    permissions: [],
    category: "Security",
    featured: true,
    emoji: "����",
    emojiColor: "#A78BFA"
  },
  {
    id: 60,
    name: "Habit Tracker Pro",
    description: "Build habits with streaks, longest-streak tracking, and a 4-week heatmap.",
    appId: "habitpro",
    version: "1.0.0",
    permissions: [],
    category: "Health",
    featured: true,
    emoji: "����",
    emojiColor: "#22C55E"
  },
  {
    id: 61,
    name: "Water Tracker",
    description: "Daily hydration tracking with streaks and weekly history",
    appId: "watertracker",
    version: "1.0.0",
    permissions: [],
    category: "Health",
    featured: false,
    emoji: "����",
    emojiColor: "#27D7E0"
  },
  {
    id: 62,
    name: "Net Worth Tracker",
    description: "Track assets and liabilities to calculate your personal net worth",
    appId: "networth",
    version: "1.0.0",
    permissions: [],
    category: "Finance",
    featured: false,
    emoji: "����",
    emojiColor: "#22C55E"
  },
  {
    id: 63,
    name: "Language Notes",
    description: "Vocabulary flashcards and quiz mode for language learning",
    appId: "languagenotes",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    featured: true,
    emoji: "�������",
    emojiColor: "#A78BFA"
  },
  {
    id: 64,
    name: "Expense Tracker",
    description: "Track personal expenses by category with monthly breakdown and CSS bar charts",
    appId: "expensetracker",
    version: "1.0.0",
    permissions: [],
    category: "Finance",
    featured: true,
    emoji: "����",
    emojiColor: "#F59E0B"
  },
  {
    id: 65,
    name: "Study Timer",
    description: "Pomodoro-style focus timer with session goals, streak tracking, and audio alerts",
    appId: "studytimer",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    featured: true,
    emoji: "����",
    emojiColor: "#27D7E0"
  },
  {
    id: 66,
    name: "Data Visualizer",
    description: "Paste JSON and explore it as a collapsible color-coded tree with path copy",
    appId: "datavisualizer",
    version: "1.0.0",
    permissions: [],
    category: "Developer",
    featured: true,
    emoji: "����",
    emojiColor: "#22C55E"
  },
  {
    id: 67,
    name: "Invoice Generator",
    description: "Create and print professional invoices with line items, tax calculation, and PDF-ready layout",
    appId: "invoicegenerator",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    featured: true,
    emoji: "����",
    emojiColor: "#27D7E0"
  },
  {
    id: 68,
    name: "Meeting Notes",
    description: "Structured meeting records with agendas, attendees, notes, and action item tracking",
    appId: "meetingnotes",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    featured: true,
    emoji: "����",
    emojiColor: "#22C55E"
  },
  {
    id: 69,
    name: "Kanban Board",
    description: "Visual project board with drag-and-drop cards across columns",
    appId: "kanban",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    featured: true,
    emoji: "�������",
    emojiColor: "#27D7E0"
  },
  {
    id: 70,
    name: "Markdown Editor",
    description: "Split-pane editor with live preview for writing Markdown documents",
    appId: "markdowneditor",
    version: "1.0.0",
    permissions: [],
    category: "Developer",
    featured: true,
    emoji: "����",
    emojiColor: "#A78BFA"
  },
  {
    id: 71,
    name: "Habit Calendar",
    description: "Visual calendar for tracking daily habits with streaks and completion stats",
    appId: "habitcalendar",
    version: "1.0.0",
    permissions: [],
    category: "Health",
    featured: true,
    emoji: "����",
    emojiColor: "#22C55E"
  },
  {
    id: 72,
    name: "Diff Tool",
    description: "Side-by-side text diff with live line-by-line comparison, added/removed highlighting, and copy-to-clipboard",
    appId: "difftool",
    version: "1.0.0",
    permissions: [],
    category: "Developer",
    emoji: "���",
    emojiColor: "#06B6D4"
  },
  {
    id: 73,
    name: "Stopwatch",
    description: "Precision stopwatch with lap tracking, fastest/slowest lap highlights, and cumulative timing",
    appId: "stopwatch",
    version: "1.0.0",
    permissions: [],
    category: "Utilities",
    emoji: "������",
    emojiColor: "#10B981"
  },
  {
    id: 74,
    name: "Focus Board",
    description: "One-thing-at-a-time focus manager with task queue, done history, and on-chain persistence",
    appId: "focusboard",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "����",
    emojiColor: "#39D7E0"
  },
  {
    id: 75,
    name: "Personal Timeline",
    description: "Track life milestones and major events on a visual timeline.",
    appId: "timeline",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "�������",
    emojiColor: "#6366F1"
  },
  {
    id: 76,
    name: "Scratchpad",
    description: "Instant auto-saving scratch notepad for quick thoughts.",
    appId: "scratchpad",
    version: "1.0.0",
    permissions: [],
    category: "Utilities",
    emoji: "����",
    emojiColor: "#10B981"
  },
  {
    id: 78,
    name: "Subscription Tracker",
    description: "Track recurring subscriptions and monthly spending with renewal alerts",
    appId: "subscriptions",
    version: "1.0.0",
    permissions: [],
    category: "Finance",
    emoji: "����",
    emojiColor: "#27D7E0"
  },
  {
    id: 81,
    name: "Trip Planner",
    description: "Plan trips with itinerary, packing list, budget tracker, and day-by-day schedule",
    appId: "tripplanner",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "������",
    emojiColor: "#27D7E0"
  },
  {
    id: 86,
    name: "File Notes",
    description: "Attach notes to files and topics. Persisted on-chain.",
    appId: "filenotes",
    isCore: false,
    featured: false,
    emoji: "����",
    emojiColor: "#27D7E0",
    category: "Productivity"
  },
  {
    id: 87,
    name: "Photo Journal",
    description: "Daily photo entries with captions and mood tracking.",
    appId: "photo-journal",
    isCore: false,
    featured: false,
    emoji: "ud83dudcf8",
    emojiColor: "#27D7E0",
    category: "Health"
  },
  {
    id: 88,
    name: "Personal Dashboard",
    description: "Configurable widgets: clock, notes, recent apps, and more.",
    appId: "personal-dashboard",
    isCore: false,
    featured: false,
    emoji: "ud83dudcca",
    emojiColor: "#27D7E0",
    category: "Productivity"
  },
  {
    id: 89,
    name: "Workout Tracker",
    description: "Log exercises, track PRs, and view weekly workout summaries.",
    appId: "workout",
    isCore: false,
    featured: true,
    emoji: "�������",
    emojiColor: "#27D7E0",
    category: "Health"
  },
  {
    id: 90,
    name: "API Tester",
    description: "Test HTTP endpoints with a full request builder and response viewer.",
    appId: "apitester",
    isCore: false,
    featured: true,
    emoji: "���",
    emojiColor: "#27D7E0",
    category: "Developer"
  },
  {
    id: 91,
    name: "Financial Goals",
    description: "Track savings goals with progress bars, deadlines, and fund allocation.",
    appId: "financialgoals",
    isCore: false,
    featured: true,
    emoji: "����",
    emojiColor: "#27D7E0",
    category: "Finance"
  },
  {
    id: 93,
    name: "Color Palette",
    description: "Generate complementary, analogous, and triadic color palettes from any base color.",
    appId: "colorpalettegen",
    isCore: false,
    featured: false,
    emoji: "����",
    emojiColor: "#27D7E0",
    category: "Developer"
  },
  {
    id: 95,
    name: "Personal Knowledge Base",
    description: "Zettelkasten-style linked notes with [[wiki links]], graph view, and on-chain persistence.",
    appId: "knowledgebase",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "����",
    emojiColor: "#27D7E0",
    featured: true
  },
  {
    id: 96,
    name: "File Converter",
    description: "Convert between JSON, CSV, YAML, and XML formats with a clean two-panel interface and on-chain history.",
    appId: "fileconverter",
    version: "1.0.0",
    permissions: [],
    category: "Developer",
    emoji: "����",
    emojiColor: "#27D7E0",
    featured: false,
    isCore: false
  },
  {
    id: 102,
    name: "System Info",
    description: "Canister stats, memory usage, cycles balance, uptime, and installed apps overview.",
    appId: "systeminfo",
    version: "1.0.0",
    permissions: [],
    category: "System",
    emoji: "������",
    emojiColor: "#27D7E0",
    featured: false,
    isCore: false
  },
  {
    id: 103,
    name: "Habit Streaks",
    description: "Track daily habits with streak counters, fire visualizations, and longest-streak records.",
    appId: "habitstreaks",
    version: "1.0.0",
    permissions: [],
    category: "Health",
    emoji: "����",
    emojiColor: "#F97316",
    featured: true,
    isCore: false
  },
  {
    id: 104,
    name: "Finance Calculator",
    description: "Compound interest, mortgage payments, and savings goal calculators in one place.",
    appId: "financecalc",
    version: "1.0.0",
    permissions: [],
    category: "Finance",
    emoji: "����",
    emojiColor: "#22C55E",
    featured: false,
    isCore: false
  },
  {
    id: 105,
    name: "Meeting Planner",
    description: "Schedule meetings with attendees, agenda, duration tracking, and on-chain persistence.",
    appId: "meetingplanner",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "����",
    emojiColor: "#8B5CF6",
    featured: false,
    isCore: false
  },
  {
    id: 106,
    name: "AI Writing Assistant",
    description: "Template-based writing assistant for emails, blog posts, cover letters, meeting agendas, and product descriptions.",
    appId: "aiwriting",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "✍️",
    emojiColor: "#8B5CF6",
    featured: true,
    isCore: false
  },
  {
    id: 107,
    name: "Expense Report",
    description: "Create and manage expense reports with line items, category breakdowns, and CSV export.",
    appId: "expensereport",
    version: "1.0.0",
    permissions: [],
    category: "Finance",
    emoji: "🧾",
    emojiColor: "#F97316",
    featured: false,
    isCore: false
  },
  {
    id: 108,
    name: "Mind Calendar",
    description: "Unified focus hub: quick notes, today's schedule from Calendar, and a Pomodoro focus timer.",
    appId: "mindcalendar",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "🧠",
    emojiColor: "#6366F1",
    featured: true,
    isCore: false
  },
  {
    id: 109,
    name: "Daily Journal",
    description: "A private daily journal with mood tracking, word count, and streak tracking — one entry per day.",
    appId: "dailyjournal",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "📔",
    emojiColor: "#F59E0B",
    featured: true,
    isCore: false
  },
  {
    id: 110,
    name: "Budget Planner",
    description: "Monthly budget tracker with income, expense categories, and visual progress bars.",
    appId: "budgetplanner",
    version: "1.0.0",
    permissions: [],
    category: "Finance",
    emoji: "💰",
    emojiColor: "#10B981",
    featured: true,
    isCore: false
  },
  {
    id: 111,
    name: "Developer Toolkit",
    description: "JSON formatter, Base64 encode/decode, Hash generator, regex tester, and base converter — all in one app.",
    appId: "devtoolkit",
    version: "1.0.0",
    permissions: [],
    category: "Developer",
    emoji: "🛠️",
    emojiColor: "#7C3AED",
    featured: true,
    isCore: false
  },
  {
    id: 113,
    name: "Focus Mode",
    description: "Full-screen focus timer with ambient sound (white noise, rain, café), session log, and preset durations for deep work sessions",
    appId: "focus-mode",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "🎯",
    emojiColor: "#7c3aed"
  },
  {
    id: 112,
    name: "Habit Streaks Pro",
    description: "GitHub-style heatmap for habit tracking. Build streaks, visualize consistency, and track your completion rate over 52 weeks.",
    appId: "habitstreakspro",
    version: "1.0.0",
    permissions: [],
    category: "Productivity",
    emoji: "🔥",
    emojiColor: "#22C55E",
    featured: true,
    isCore: false
  }
];
function getAppRating(id) {
  return Math.round((3.5 + id % 15 / 10) * 10) / 10;
}
function getAppReviews(id) {
  return 50 + id * 7 % 900;
}
function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-0.5", children: Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      style: {
        fontSize: 9,
        color: i < full || i === full && half ? "rgba(251,191,36,0.9)" : "var(--os-text-muted)"
      },
      children: i < full ? "★" : i === full && half ? "★" : "☆"
    },
    i
  )) });
}
function AppStore({ windowProps: _windowProps }) {
  const [confirmApp, setConfirmApp] = reactExports.useState(null);
  const [selectedCategory, setSelectedCategory] = reactExports.useState("All");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [debouncedQuery, setDebouncedQuery] = reactExports.useState("");
  const [recentlyInstalled, setRecentlyInstalled] = reactExports.useState(
    []
  );
  const [recentInstallHintId, setRecentInstallHintId] = reactExports.useState(
    null
  );
  const [forYouInstallCount, setForYouInstallCount] = reactExports.useState(() => {
    try {
      return Number.parseInt(
        localStorage.getItem("decentos_for_you_installs") ?? "0",
        10
      );
    } catch {
      return 0;
    }
  });
  const debounceRef = reactExports.useRef(null);
  const [visibleCount, setVisibleCount] = reactExports.useState(24);
  const sentinelRef = reactExports.useRef(null);
  const { openApp } = useOS();
  reactExports.useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(searchQuery), 150);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);
  reactExports.useEffect(() => {
    setVisibleCount(24);
  }, [selectedCategory, debouncedQuery]);
  reactExports.useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        var _a;
        if ((_a = entries[0]) == null ? void 0 : _a.isIntersecting) {
          setVisibleCount((n) => n + 12);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [selectedCategory, debouncedQuery]);
  const { installedIds, install, uninstall } = useInstalledApps();
  const { data: availableApps, isLoading: loadingAll } = useListAvailableApps();
  const installApp = useInstallApp();
  const uninstallApp = useUninstallApp();
  const grantPermissions = useGrantPermissions();
  const revokePermissions = useRevokePermissions();
  const displayApps = availableApps && availableApps.length > 0 ? availableApps : BUILTIN_APPS;
  const filteredApps = reactExports.useMemo(
    () => displayApps.filter((app) => {
      const matchesCategory = selectedCategory === "All" || app.category === selectedCategory;
      const matchesSearch = !debouncedQuery || app.name.toLowerCase().includes(debouncedQuery.toLowerCase()) || app.description.toLowerCase().includes(debouncedQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }),
    [displayApps, selectedCategory, debouncedQuery]
  );
  const featuredApps = displayApps.filter((a) => a.featured && !a.isCore);
  const handleInstall = async (app) => {
    setConfirmApp(null);
    const installedApp = {
      id: app.id,
      appId: app.appId ?? "",
      name: app.name,
      emoji: app.emoji ?? "����",
      emojiColor: app.emojiColor ?? "#64748B"
    };
    install(installedApp);
    setRecentlyInstalled((prev) => {
      const next = [app, ...prev.filter((a) => a.id !== app.id)].slice(0, 3);
      return next;
    });
    setRecentInstallHintId(app.id);
    setTimeout(
      () => setRecentInstallHintId((id) => id === app.id ? null : id),
      4e3
    );
    const newCount = forYouInstallCount + 1;
    setForYouInstallCount(newCount);
    try {
      localStorage.setItem("decentos_for_you_installs", String(newCount));
    } catch {
    }
    ue.success(`${app.name} added to desktop`);
    try {
      await grantPermissions.mutateAsync({
        appId: app.id,
        permissions: app.permissions ?? []
      });
      await installApp.mutateAsync(app.id);
    } catch {
    }
    if (app.appId) {
      openApp(app.appId, app.name);
    }
  };
  const handleUninstall = async (app) => {
    uninstall(app.id);
    ue.success(`${app.name} removed from desktop`);
    try {
      await revokePermissions.mutateAsync(app.id);
      await uninstallApp.mutateAsync(app.id);
    } catch {
    }
  };
  const handleLaunch = (app) => {
    if (app.appId) {
      openApp(app.appId, app.name);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full", style: { background: "var(--os-bg-app)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "w-40 flex-shrink-0 flex flex-col border-r py-3",
        style: {
          borderColor: "var(--os-border-subtle)",
          background: "var(--os-bg-app)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50", children: "Categories" }) }),
          CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setSelectedCategory(cat),
              "data-ocid": `appstore.${cat.toLowerCase()}.tab`,
              className: "flex items-center gap-2 px-3 py-1.5 text-xs transition-all text-left",
              style: selectedCategory === cat ? {
                background: "rgba(99,102,241,0.15)",
                borderLeft: "2px solid rgba(99,102,241,0.8)",
                color: "rgba(165,168,255,0.95)",
                paddingLeft: "10px"
              } : {
                color: "rgba(160,160,170,0.7)",
                borderLeft: "2px solid transparent"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: CATEGORY_ICONS[cat] }),
                cat
              ]
            },
            cat
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "px-3 mt-3 pt-3 border-t",
              style: { borderColor: "var(--os-border-subtle)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground/30 leading-relaxed", children: [
                "DecentOS Marketplace",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--os-text-muted)" }, children: "v5.0 ��� on-chain" })
              ] })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "px-4 py-3 border-b flex items-center gap-3 flex-shrink-0",
          style: {
            borderColor: "var(--os-border-subtle)",
            background: "var(--os-bg-app)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Search apps...",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  "data-ocid": "appstore.search_input",
                  className: "w-full h-8 pl-8 pr-7 rounded-md text-xs bg-white/5 border text-foreground placeholder-muted-foreground/40 outline-none transition-colors focus:border-cyan-500/40",
                  style: { border: "1px solid var(--os-border-subtle)" }
                }
              ),
              searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setSearchQuery(""),
                  className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground/40 flex-shrink-0", children: [
              filteredApps.length,
              " app",
              filteredApps.length !== 1 ? "s" : ""
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: loadingAll ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex items-center justify-center h-full",
          "data-ocid": "appstore.loading_state",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin text-primary/60" })
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-6", children: [
        selectedCategory === "All" && !debouncedQuery && recentlyInstalled.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px]", children: "����" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h3",
              {
                className: "text-xs font-semibold",
                style: { color: "var(--os-text-secondary)" },
                children: "Recently Installed"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: recentlyInstalled.map((app) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => app.appId && openApp(app.appId, app.name),
              className: "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all hover:opacity-80",
              style: {
                background: "var(--os-accent-color-alpha)",
                border: "1px solid var(--os-accent-color-border)",
                color: "rgba(39,215,224,0.85)"
              },
              children: [
                app.appId && /* @__PURE__ */ jsxRuntimeExports.jsx(AppIcon, { appId: app.appId, size: 12 }),
                app.name
              ]
            },
            app.id
          )) })
        ] }),
        selectedCategory === "All" && !debouncedQuery && forYouInstallCount < 3 && (() => {
          const userType = (() => {
            try {
              return localStorage.getItem("decent_os_user_type") ?? "personal";
            } catch {
              return "personal";
            }
          })();
          const priorityIds = {
            personal: [
              "journalapp",
              "habittracker",
              "budgettracker",
              "contactmanager"
            ],
            developer: [
              "apitester",
              "kanban",
              "developertoolkit",
              "difftool"
            ],
            poweruser: [
              "processmonitor",
              "encryptiontool",
              "datavisualizer",
              "developertoolkit"
            ]
          };
          const ids = priorityIds[userType] ?? priorityIds.personal;
          const forYouApps = ids.map((id) => displayApps.find((a) => a.appId === id)).filter(
            (a) => !!a && !installedIds.has(a.id)
          ).slice(0, 4);
          if (!forYouApps.length) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Sparkles,
                {
                  className: "w-3.5 h-3.5",
                  style: { color: "var(--os-accent-color)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h3",
                {
                  className: "text-xs font-semibold",
                  style: { color: "var(--os-text-secondary)" },
                  children: "For You"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: forYouApps.map((app) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-lg p-2.5 flex items-center gap-2",
                style: {
                  background: "var(--os-bg-elevated)",
                  border: "1px solid var(--os-border-window)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      style: {
                        background: "var(--os-accent-color-alpha)"
                      },
                      children: app.appId && /* @__PURE__ */ jsxRuntimeExports.jsx(AppIcon, { appId: app.appId, size: 16 })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs font-medium truncate",
                        style: { color: "var(--os-text-primary)" },
                        children: app.name
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleInstall(app),
                        className: "text-[10px] mt-0.5",
                        style: {
                          color: "var(--os-accent-color)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0
                        },
                        children: "+ Install"
                      }
                    )
                  ] })
                ]
              },
              app.id
            )) })
          ] });
        })(),
        selectedCategory === "All" && !debouncedQuery && (() => {
          const trendingIds = [
            "habittracker",
            "mindmap",
            "budgettracker",
            "developertoolkit"
          ];
          const trendingApps = trendingIds.map((id) => displayApps.find((a) => a.appId === id)).filter((a) => !!a).slice(0, 4);
          if (!trendingApps.length) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 16 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TrendingUp,
                {
                  className: "w-3.5 h-3.5",
                  style: { color: "var(--os-accent-color)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h3",
                {
                  className: "text-xs font-semibold",
                  style: { color: "var(--os-text-secondary)" },
                  children: "Trending"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-1 scrollbar-none", children: trendingApps.map((app) => {
              const isInstalled = installedIds.has(app.id);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-lg p-2.5 flex-shrink-0 flex items-center gap-2",
                  style: {
                    background: "var(--os-bg-elevated)",
                    border: "1px solid var(--os-border-window)",
                    width: 160
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        style: {
                          background: "var(--os-accent-color-alpha)"
                        },
                        children: app.appId && /* @__PURE__ */ jsxRuntimeExports.jsx(AppIcon, { appId: app.appId, size: 16 })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-xs font-medium truncate",
                          style: { color: "var(--os-text-primary)" },
                          children: app.name
                        }
                      ),
                      isInstalled ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-[10px]",
                          style: { color: "var(--os-text-muted)" },
                          children: "Installed ✓"
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => handleInstall(app),
                          className: "text-[10px] mt-0.5",
                          style: {
                            color: "var(--os-accent-color)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0
                          },
                          children: "+ Install"
                        }
                      )
                    ] })
                  ]
                },
                app.id
              );
            }) })
          ] });
        })(),
        selectedCategory === "All" && !debouncedQuery && featuredApps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 24 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Star,
              {
                className: "w-3.5 h-3.5",
                style: { color: "var(--os-text-secondary)" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h3",
              {
                className: "text-xs font-semibold",
                style: { color: "var(--os-text-secondary)" },
                children: "Featured"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: featuredApps.slice(0, 3).map((app, i) => {
            const isInstalled = installedIds.has(app.id);
            const catColor = CATEGORY_COLORS[app.category ?? "All"] ?? "#6366f1";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `appstore.featured.card.${i + 1}`,
                className: "rounded-xl overflow-hidden flex flex-col",
                style: {
                  background: "var(--os-bg-elevated)",
                  border: "1px solid var(--os-border-window)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.15)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      style: {
                        height: 64,
                        background: `linear-gradient(135deg, ${catColor}44 0%, ${catColor}22 100%)`,
                        borderBottom: `1px solid ${catColor}33`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              width: 40,
                              height: 40,
                              borderRadius: 10,
                              background: catColor,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: `0 4px 12px ${catColor}55`
                            },
                            children: app.appId ? /* @__PURE__ */ jsxRuntimeExports.jsx(AppIcon, { appId: app.appId, size: 20 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AppIcon, { appId: "unknown", size: 20 })
                          }
                        ),
                        isInstalled && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            style: {
                              position: "absolute",
                              top: 6,
                              right: 8,
                              fontSize: 9,
                              padding: "2px 6px",
                              borderRadius: 10,
                              background: `${catColor}33`,
                              color: catColor,
                              fontWeight: 700,
                              border: `1px solid ${catColor}44`
                            },
                            children: "✓ Installed"
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex flex-col gap-2 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "text-[12px] font-semibold leading-tight",
                          style: { color: "var(--os-text-primary)" },
                          children: app.name
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-[10px] mt-1 leading-relaxed line-clamp-2",
                          style: { color: "var(--os-text-secondary)" },
                          children: app.description
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto pt-1", children: isInstalled ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleLaunch(app),
                        "data-ocid": `appstore.featured.secondary_button.${i + 1}`,
                        className: "w-full flex items-center justify-center gap-1 h-7 rounded-lg text-[11px] font-medium transition-all",
                        style: {
                          background: `${catColor}22`,
                          border: `1px solid ${catColor}44`,
                          color: catColor
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3 h-3" }),
                          "Open"
                        ]
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => setConfirmApp(app),
                        "data-ocid": `appstore.featured.primary_button.${i + 1}`,
                        className: "w-full flex items-center justify-center gap-1 h-7 rounded-lg text-[11px] font-medium transition-all",
                        style: {
                          background: `${catColor}22`,
                          border: `1px solid ${catColor}55`,
                          color: catColor
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
                          "Install"
                        ]
                      }
                    ) })
                  ] })
                ]
              },
              app.id
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          (selectedCategory !== "All" || debouncedQuery) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: CATEGORY_ICONS[selectedCategory] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-foreground/70", children: debouncedQuery ? `Results for "${debouncedQuery}"` : selectedCategory })
          ] }),
          filteredApps.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center h-32 gap-2 text-muted-foreground/40",
              "data-ocid": "appstore.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-10 h-10" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "No apps found" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2", children: filteredApps.slice(0, visibleCount).map((app, i) => {
            const isCore = app.isCore || CORE_APP_IDS.has(app.appId ?? "");
            const isInstalled = isCore || installedIds.has(app.id);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `appstore.item.${i + 1}`,
                className: "rounded-lg p-3 transition-colors flex items-center gap-3",
                style: {
                  background: "var(--os-bg-elevated)",
                  border: isInstalled ? "1px solid rgba(39,215,224,0.15)" : "1px solid rgba(42,58,66,0.6)",
                  contentVisibility: "auto",
                  containIntrinsicSize: "0 80px"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                      style: {
                        background: "var(--os-accent-color-alpha)"
                      },
                      children: app.appId ? /* @__PURE__ */ jsxRuntimeExports.jsx(AppIcon, { appId: app.appId, size: 20 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AppIcon, { appId: "unknown", size: 20 })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: app.name }),
                      app.version && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-muted-foreground/40", children: [
                        "v",
                        app.version
                      ] }),
                      isCore ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full",
                          style: {
                            background: "rgba(100,116,139,0.15)",
                            border: "1px solid rgba(100,116,139,0.3)",
                            color: "var(--os-text-secondary)"
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-2 h-2" }),
                            "Core App"
                          ]
                        }
                      ) : isInstalled ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-[10px] px-1.5 py-0.5 rounded-full",
                          style: {
                            background: "var(--os-accent-color-alpha)",
                            border: "1px solid rgba(39,215,224,0.3)",
                            color: "rgba(39,215,224,0.8)"
                          },
                          children: "��� On Desktop"
                        }
                      ) : null,
                      app.category && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-[10px] px-1.5 py-0.5 rounded text-muted-foreground/50",
                          style: {
                            background: "var(--os-border-subtle)"
                          },
                          children: app.category
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: app.description }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { rating: getAppRating(app.id) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "text-[10px]",
                          style: { color: "var(--os-text-muted)" },
                          children: [
                            getAppRating(app.id).toFixed(1),
                            " (",
                            getAppReviews(app.id),
                            ")"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-1.5", children: (app.permissions ?? []).map((perm) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded",
                        style: {
                          background: "rgba(255,200,0,0.06)",
                          border: "1px solid rgba(255,200,0,0.15)",
                          color: "rgba(255,200,0,0.7)"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-2 h-2" }),
                          perm
                        ]
                      },
                      perm
                    )) }),
                    recentInstallHintId === app.id && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-[10px] mt-1",
                        style: { color: "var(--os-text-muted)" },
                        "data-ocid": `appstore.success_state.${i + 1}`,
                        children: "Find it on your desktop"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 flex-shrink-0", children: isCore ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => handleLaunch(app),
                      "data-ocid": `appstore.secondary_button.${i + 1}`,
                      className: "flex items-center gap-1 px-2 h-7 rounded text-xs transition-all",
                      style: {
                        background: "rgba(100,116,139,0.1)",
                        border: "1px solid rgba(100,116,139,0.25)",
                        color: "var(--os-text-secondary)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3 h-3" }),
                        "Open"
                      ]
                    }
                  ) : isInstalled ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    app.appId && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleLaunch(app),
                        "data-ocid": `appstore.secondary_button.${i + 1}`,
                        className: "flex items-center gap-1 px-2 h-7 rounded text-xs transition-all",
                        style: {
                          background: "var(--os-accent-color-alpha)",
                          border: "1px solid rgba(39,215,224,0.25)",
                          color: "rgba(39,215,224,0.85)"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3 h-3" }),
                          "Launch"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleUninstall(app),
                        "data-ocid": `appstore.delete_button.${i + 1}`,
                        className: "flex items-center gap-1 px-2 h-7 rounded text-xs text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
                      }
                    )
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-end gap-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setConfirmApp(app),
                      "data-ocid": `appstore.install.button.${i + 1}`,
                      className: "flex items-center gap-1 px-2 h-7 rounded text-xs transition-all",
                      style: {
                        background: "var(--os-accent-color-alpha)",
                        border: "1px solid rgba(39,215,224,0.3)",
                        color: "rgba(39,215,224,0.9)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
                        "Install"
                      ]
                    }
                  ) }) })
                ]
              },
              app.id
            );
          }) }),
          filteredApps.length > visibleCount && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: sentinelRef, className: "h-8" })
        ] })
      ] }) })
    ] }),
    confirmApp && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 flex items-center justify-center z-50",
        style: {
          background: "var(--os-bg-desktop)",
          backdropFilter: "blur(4px)"
        },
        "data-ocid": "appstore.dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "os-window p-5 max-w-xs w-full mx-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-10 h-10 rounded-xl flex items-center justify-center",
                style: {
                  background: "var(--os-accent-color-alpha)"
                },
                children: confirmApp.appId ? /* @__PURE__ */ jsxRuntimeExports.jsx(AppIcon, { appId: confirmApp.appId, size: 20 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AppIcon, { appId: "unknown", size: 20 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground", children: [
                "Install ",
                confirmApp.name,
                "?"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-mono text-muted-foreground/50", children: [
                "v",
                confirmApp.version
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-3", children: confirmApp.description }),
          (confirmApp.permissions ?? []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground mb-1.5", children: "Requires permissions:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: (confirmApp.permissions ?? []).map((perm) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded",
                style: {
                  background: "rgba(255,200,0,0.08)",
                  border: "1px solid rgba(255,200,0,0.2)",
                  color: "rgba(255,200,0,0.8)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-2 h-2" }),
                  perm
                ]
              },
              perm
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => handleInstall(confirmApp),
                "data-ocid": "appstore.confirm_button",
                className: "flex-1 h-8 rounded text-xs font-semibold transition-all",
                style: {
                  background: "rgba(39,215,224,0.15)",
                  border: "1px solid rgba(39,215,224,0.4)",
                  color: "rgba(39,215,224,1)"
                },
                children: "Install & Launch"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setConfirmApp(null),
                "data-ocid": "appstore.cancel_button",
                className: "flex-1 h-8 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors",
                children: "Cancel"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  AppStore
};
