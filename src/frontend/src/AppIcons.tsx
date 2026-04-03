import {
  Activity,
  ArrowLeftRight,
  BadgeDollarSign,
  BarChart3,
  Binary,
  BookMarked,
  BookOpen,
  Bookmark,
  BookmarkPlus,
  Braces,
  Calculator,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  Camera,
  CheckSquare,
  ChefHat,
  Clipboard,
  ClipboardList,
  Clock,
  Code2,
  Columns2,
  CreditCard,
  Database,
  DollarSign,
  Droplets,
  Dumbbell,
  FileCode,
  FilePlus2,
  FileText,
  Flag,
  Flame,
  Folder,
  FolderOpen,
  GitBranch,
  Globe,
  Globe2,
  GraduationCap,
  Grid,
  Hash,
  Heart,
  Image,
  Info,
  Keyboard,
  Languages,
  Layers,
  LayoutDashboard,
  Library,
  Lock,
  MessageSquare,
  Moon,
  Music,
  Network,
  Package,
  Paintbrush,
  Palette,
  PiggyBank,
  Plane,
  QrCode,
  Receipt,
  Scissors,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sigma,
  Smile,
  Split,
  StickyNote,
  Store,
  Table2,
  Target,
  Terminal,
  Timer,
  TreePine,
  TrendingUp,
  UserCheck,
  Users,
  Wand2,
  Wifi,
  Zap,
} from "lucide-react";

void TreePine;
void BadgeDollarSign;
void Dumbbell;
void Zap;
void FolderOpen;
void Folder;

const APP_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  filemanager: Folder,
  appstore: Store,
  appregistry: Grid,
  terminal: Terminal,
  notes: StickyNote,
  wordprocessor: BookOpen,
  calendar: CalendarDays,
  spreadsheet: Table2,
  codeeditor: Code2,
  calculator: Calculator,
  browser: Globe,
  processmonitor: Activity,
  texteditor: FileText,
  settings: Settings,
  clipboard: Clipboard,
  pomodoro: Timer,
  pomodorov2: Timer,
  networkmonitor: Network,
  filenotes: FilePlus2,
  drawing: Paintbrush,
  taskmanager: CheckSquare,
  passwordmanager: Lock,
  contactmanager: Users,
  journal: BookMarked,
  budget: DollarSign,
  markdown: FileCode,
  converter: ArrowLeftRight,
  habittracker: Target,
  bookmarks: Bookmark,
  planner: CalendarClock,
  flashcards: Layers,
  recipes: ChefHat,
  mindmap: GitBranch,
  portfolio: TrendingUp,
  timetracker: Clock,
  personalwiki: Library,
  goaltracker: Flag,
  stickynotes: MessageSquare,
  jsonformatter: Braces,
  base64tool: Binary,
  colorpicker: Palette,
  regextester: Search,
  hashgenerator: Hash,
  worldclock: Globe2,
  baseconverter: Sigma,
  encryption: ShieldCheck,
  qrcode: QrCode,
  loancalc: PiggyBank,
  sleeptracker: Moon,
  shortcuts: Keyboard,
  musicplayer: Music,
  imageviewer: Image,
  dashboard: LayoutDashboard,
  personalfinance: TrendingUp,
  vocabnotes: BookOpen,
  moodtracker: Smile,
  codesnippets: Scissors,
  readinglist: BookmarkPlus,
  dailylog: ClipboardList,
  splitter: Split,
  personalcrm: UserCheck,
  financedashboard: BarChart3,
  securenotes: ShieldAlert,
  watertracker: Droplets,
  networth: TrendingUp,
  languagenotes: Languages,
  expensetracker: Receipt,
  studytimer: GraduationCap,
  datavisualizer: Database,
  invoicegenerator: Receipt,
  meetingnotes: ClipboardList,
  kanban: Columns2,
  markdowneditor: FileCode,
  habitcalendar: CalendarCheck,
  "ai-prompts": Wand2,
  subscriptions: CreditCard,
  "interview-prep": GraduationCap,
  medicalrecords: Heart,
  tripplanner: Plane,
  "photo-journal": Camera,
  "network-monitor": Wifi,
  "personal-dashboard": LayoutDashboard,
  systeminfo: Info,
  dailyjournal: BookMarked,
  budgetplanner: PiggyBank,
  habitstreakspro: Flame,
};

// Category color map: vibrant iOS-style solid gradients with white icons
const SYSTEM_STYLE = {
  bg: "linear-gradient(145deg, #3b82f6, #2563eb)",
  color: "white",
};
const PRODUCTIVITY_STYLE = {
  bg: "linear-gradient(145deg, #f59e0b, #d97706)",
  color: "white",
};
const DEVELOPER_STYLE = {
  bg: "linear-gradient(145deg, #8b5cf6, #7c3aed)",
  color: "white",
};
const FINANCE_STYLE = {
  bg: "linear-gradient(145deg, #10b981, #059669)",
  color: "white",
};
const HEALTH_STYLE = {
  bg: "linear-gradient(145deg, #ef4444, #dc2626)",
  color: "white",
};
const UTILITIES_STYLE = {
  bg: "linear-gradient(145deg, #6366f1, #4f46e5)",
  color: "white",
};
const MEDIA_STYLE = {
  bg: "linear-gradient(145deg, #ec4899, #db2777)",
  color: "white",
};
const DEFAULT_STYLE = {
  bg: "linear-gradient(145deg, #64748b, #475569)",
  color: "white",
};

const APP_CATEGORY_STYLES: Record<string, { bg: string; color: string }> = {
  // System
  filemanager: SYSTEM_STYLE,
  appstore: SYSTEM_STYLE,
  appregistry: SYSTEM_STYLE,
  terminal: SYSTEM_STYLE,
  settings: SYSTEM_STYLE,
  processmonitor: SYSTEM_STYLE,
  texteditor: SYSTEM_STYLE,
  shortcuts: SYSTEM_STYLE,
  systeminfo: SYSTEM_STYLE,
  networkmonitor: SYSTEM_STYLE,
  dashboard: SYSTEM_STYLE,
  "personal-dashboard": SYSTEM_STYLE,
  // Productivity
  notes: PRODUCTIVITY_STYLE,
  wordprocessor: PRODUCTIVITY_STYLE,
  calendar: PRODUCTIVITY_STYLE,
  spreadsheet: PRODUCTIVITY_STYLE,
  taskmanager: PRODUCTIVITY_STYLE,
  contactmanager: PRODUCTIVITY_STYLE,
  journal: PRODUCTIVITY_STYLE,
  goaltracker: PRODUCTIVITY_STYLE,
  kanban: PRODUCTIVITY_STYLE,
  planner: PRODUCTIVITY_STYLE,
  timetracker: PRODUCTIVITY_STYLE,
  meetingnotes: PRODUCTIVITY_STYLE,
  standup: PRODUCTIVITY_STYLE,
  readinglist: PRODUCTIVITY_STYLE,
  dailylog: PRODUCTIVITY_STYLE,
  personalwiki: PRODUCTIVITY_STYLE,
  habittracker: PRODUCTIVITY_STYLE,
  markdowneditor: PRODUCTIVITY_STYLE,
  stickynotes: PRODUCTIVITY_STYLE,
  languagenotes: PRODUCTIVITY_STYLE,
  scratchpad: PRODUCTIVITY_STYLE,
  focusboard: PRODUCTIVITY_STYLE,
  personalcrm: PRODUCTIVITY_STYLE,
  meetingplanner: PRODUCTIVITY_STYLE,
  pomodoropro: PRODUCTIVITY_STYLE,
  studytimer: PRODUCTIVITY_STYLE,
  vocabnotes: PRODUCTIVITY_STYLE,
  timeline: PRODUCTIVITY_STYLE,
  habitpro: PRODUCTIVITY_STYLE,
  habitcalendar: PRODUCTIVITY_STYLE,
  habitstreaks: PRODUCTIVITY_STYLE,
  // Developer
  codeeditor: DEVELOPER_STYLE,
  jsonformatter: DEVELOPER_STYLE,
  base64tool: DEVELOPER_STYLE,
  colorpicker: DEVELOPER_STYLE,
  regextester: DEVELOPER_STYLE,
  hashgenerator: DEVELOPER_STYLE,
  baseconverter: DEVELOPER_STYLE,
  codesnippets: DEVELOPER_STYLE,
  markdown: DEVELOPER_STYLE,
  difftool: DEVELOPER_STYLE,
  datavisualizer: DEVELOPER_STYLE,
  apitester: DEVELOPER_STYLE,
  colorpalettegen: DEVELOPER_STYLE,
  markdownresume: DEVELOPER_STYLE,
  knowledgebase: DEVELOPER_STYLE,
  markdownviewer: DEVELOPER_STYLE,
  fileconverter: DEVELOPER_STYLE,
  codereview: DEVELOPER_STYLE,
  lifestats: DEVELOPER_STYLE,
  passwordgen: DEVELOPER_STYLE,
  // Finance
  budget: FINANCE_STYLE,
  loancalc: FINANCE_STYLE,
  personalfinance: FINANCE_STYLE,
  financedashboard: FINANCE_STYLE,
  networth: FINANCE_STYLE,
  splitter: FINANCE_STYLE,
  expensetracker: FINANCE_STYLE,
  invoicegenerator: FINANCE_STYLE,
  subscriptions: FINANCE_STYLE,
  financialgoals: FINANCE_STYLE,
  financecalc: FINANCE_STYLE,
  // Health
  sleeptracker: HEALTH_STYLE,
  moodtracker: HEALTH_STYLE,
  watertracker: HEALTH_STYLE,
  medicalrecords: HEALTH_STYLE,
  dreamjournal: HEALTH_STYLE,
  workout: HEALTH_STYLE,
  "photo-journal": HEALTH_STYLE,
  // Utilities
  calculator: UTILITIES_STYLE,
  browser: UTILITIES_STYLE,
  converter: UTILITIES_STYLE,
  worldclock: UTILITIES_STYLE,
  qrcode: UTILITIES_STYLE,
  bookmarks: UTILITIES_STYLE,
  pomodoro: UTILITIES_STYLE,
  pomodorov2: UTILITIES_STYLE,
  clipboard: UTILITIES_STYLE,
  stopwatch: UTILITIES_STYLE,
  encryption: UTILITIES_STYLE,
  passwordmanager: UTILITIES_STYLE,
  securenotes: UTILITIES_STYLE,
  smartclipboard: UTILITIES_STYLE,
  "ai-prompts": UTILITIES_STYLE,
  "interview-prep": UTILITIES_STYLE,
  // Media / Creative
  drawing: MEDIA_STYLE,
  musicvisualizer: MEDIA_STYLE,
  musicplayer: MEDIA_STYLE,
  imageviewer: MEDIA_STYLE,
  // New sprint apps
  aiwriting: PRODUCTIVITY_STYLE,
  expensereport: FINANCE_STYLE,
  mindcalendar: PRODUCTIVITY_STYLE,
  dailyjournal: PRODUCTIVITY_STYLE,
  budgetplanner: FINANCE_STYLE,
  habitstreakspro: {
    bg: "linear-gradient(145deg, #22c55e, #16a34a)",
    color: "white",
  },
};

export function getAppIconColor(appId: string): { bg: string; color: string } {
  return APP_CATEGORY_STYLES[appId] ?? DEFAULT_STYLE;
}

interface AppIconProps {
  appId: string;
  size?: number;
  className?: string;
}

export function AppIcon({ appId, size = 24, className }: AppIconProps) {
  const IconComponent = APP_ICON_MAP[appId] ?? Package;
  const { bg, color } = getAppIconColor(appId);
  const tileSize = Math.min(Math.round(size * 2.2), 56);
  const borderRadius = tileSize >= 48 ? 12 : Math.round(tileSize * 0.22);

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          width: tileSize,
          height: tileSize,
          borderRadius,
          background: bg,
          border: "1px solid rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <IconComponent
          style={{ width: size, height: size, color, flexShrink: 0 }}
        />
      </span>
    </span>
  );
}
