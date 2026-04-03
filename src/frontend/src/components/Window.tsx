import { Maximize2, Minimize2 } from "lucide-react";
import { AnimatePresence, motion, useMotionValue } from "motion/react";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppIcon } from "../AppIcons";
import { type WindowState, useFocusContext, useOS } from "../context/OSContext";
import { WindowFocusProvider } from "../context/WindowFocusContext";

// Lazy-loaded app components
const FileManager = React.lazy(() =>
  import("./apps/FileManager").then((m) => ({ default: m.FileManager })),
);
const Notes = React.lazy(() =>
  import("./apps/Notes").then((m) => ({ default: m.Notes })),
);
const AppStore = React.lazy(() =>
  import("./apps/AppStore").then((m) => ({ default: m.AppStore })),
);
const Terminal = React.lazy(() =>
  import("./apps/Terminal").then((m) => ({ default: m.Terminal })),
);
const Settings = React.lazy(() =>
  import("./apps/Settings").then((m) => ({ default: m.Settings })),
);
const CodeEditor = React.lazy(() =>
  import("./apps/CodeEditor").then((m) => ({ default: m.CodeEditor })),
);
const ProcessMonitor = React.lazy(() =>
  import("./apps/ProcessMonitor").then((m) => ({ default: m.ProcessMonitor })),
);
const Calculator = React.lazy(() =>
  import("./apps/Calculator").then((m) => ({ default: m.Calculator })),
);
const TextEditor = React.lazy(() =>
  import("./apps/TextEditor").then((m) => ({ default: m.TextEditor })),
);
const Browser = React.lazy(() =>
  import("./apps/Browser").then((m) => ({ default: m.Browser })),
);
const MusicPlayer = React.lazy(() =>
  import("./apps/MusicPlayer").then((m) => ({ default: m.MusicPlayer })),
);
const ImageViewer = React.lazy(() =>
  import("./apps/ImageViewer").then((m) => ({ default: m.ImageViewer })),
);
const Spreadsheet = React.lazy(() =>
  import("./apps/Spreadsheet").then((m) => ({ default: m.Spreadsheet })),
);
const Calendar = React.lazy(() =>
  import("./apps/Calendar").then((m) => ({ default: m.Calendar })),
);
const PasswordManager = React.lazy(() =>
  import("./apps/PasswordManager").then((m) => ({
    default: m.PasswordManager,
  })),
);
const Drawing = React.lazy(() =>
  import("./apps/Drawing").then((m) => ({ default: m.Drawing })),
);
const TaskManager = React.lazy(() =>
  import("./apps/TaskManager").then((m) => ({ default: m.TaskManager })),
);
const PomodoroTimer = React.lazy(() =>
  import("./apps/PomodoroTimer").then((m) => ({ default: m.PomodoroTimer })),
);
const ContactManager = React.lazy(() =>
  import("./apps/ContactManager").then((m) => ({ default: m.ContactManager })),
);
const Journal = React.lazy(() =>
  import("./apps/Journal").then((m) => ({ default: m.Journal })),
);
const BudgetTracker = React.lazy(() =>
  import("./apps/BudgetTracker").then((m) => ({ default: m.BudgetTracker })),
);
const MarkdownViewer = React.lazy(() =>
  import("./apps/MarkdownViewer").then((m) => ({ default: m.MarkdownViewer })),
);
const UnitConverter = React.lazy(() =>
  import("./apps/UnitConverter").then((m) => ({ default: m.UnitConverter })),
);
const HabitTracker = React.lazy(() =>
  import("./apps/HabitTracker").then((m) => ({ default: m.HabitTracker })),
);
const BookmarksManager = React.lazy(() =>
  import("./apps/BookmarksManager").then((m) => ({
    default: m.BookmarksManager,
  })),
);
const DailyPlanner = React.lazy(() =>
  import("./apps/DailyPlanner").then((m) => ({ default: m.DailyPlanner })),
);
const FlashcardApp = React.lazy(() =>
  import("./apps/FlashcardApp").then((m) => ({ default: m.FlashcardApp })),
);
const RecipeManager = React.lazy(() =>
  import("./apps/RecipeManager").then((m) => ({ default: m.RecipeManager })),
);
const MindMap = React.lazy(() =>
  import("./apps/MindMap").then((m) => ({ default: m.MindMap })),
);
const IcpPortfolio = React.lazy(() =>
  import("./apps/IcpPortfolio").then((m) => ({ default: m.IcpPortfolio })),
);
const TimeTracker = React.lazy(() =>
  import("./apps/TimeTracker").then((m) => ({ default: m.TimeTracker })),
);
const PersonalWiki = React.lazy(() =>
  import("./apps/PersonalWiki").then((m) => ({ default: m.PersonalWiki })),
);
const GoalTracker = React.lazy(() =>
  import("./apps/GoalTracker").then((m) => ({ default: m.GoalTracker })),
);
const StickyNotes = React.lazy(() =>
  import("./apps/StickyNotes").then((m) => ({ default: m.StickyNotes })),
);
const JsonFormatter = React.lazy(() =>
  import("./apps/JsonFormatter").then((m) => ({ default: m.JsonFormatter })),
);
const Base64Tool = React.lazy(() =>
  import("./apps/Base64Tool").then((m) => ({ default: m.Base64Tool })),
);
const ColorPicker = React.lazy(() =>
  import("./apps/ColorPicker").then((m) => ({ default: m.ColorPicker })),
);
const RegexTester = React.lazy(() =>
  import("./apps/RegexTester").then((m) => ({ default: m.RegexTester })),
);
const HashGenerator = React.lazy(() =>
  import("./apps/HashGenerator").then((m) => ({ default: m.HashGenerator })),
);
const WorldClock = React.lazy(() =>
  import("./apps/WorldClock").then((m) => ({ default: m.WorldClock })),
);
const BaseConverter = React.lazy(() =>
  import("./apps/BaseConverter").then((m) => ({ default: m.BaseConverter })),
);
const EncryptionTool = React.lazy(() =>
  import("./apps/EncryptionTool").then((m) => ({ default: m.EncryptionTool })),
);
const QrCodeGenerator = React.lazy(() =>
  import("./apps/QrCodeGenerator").then((m) => ({
    default: m.QrCodeGenerator,
  })),
);
const LoanCalculator = React.lazy(() =>
  import("./apps/LoanCalculator").then((m) => ({ default: m.LoanCalculator })),
);
const SleepTracker = React.lazy(() =>
  import("./apps/SleepTracker").then((m) => ({ default: m.SleepTracker })),
);
const KeyboardShortcuts = React.lazy(() =>
  import("./apps/KeyboardShortcuts").then((m) => ({
    default: m.KeyboardShortcuts,
  })),
);
const PersonalFinance = React.lazy(() =>
  import("./apps/PersonalFinance").then((m) => ({
    default: m.PersonalFinance,
  })),
);
const VocabNotes = React.lazy(() =>
  import("./apps/VocabNotes").then((m) => ({ default: m.VocabNotes })),
);
const MoodTracker = React.lazy(() =>
  import("./apps/MoodTracker").then((m) => ({ default: m.MoodTracker })),
);
const CodeSnippets = React.lazy(() =>
  import("./apps/CodeSnippets").then((m) => ({ default: m.CodeSnippets })),
);
const ReadingList = React.lazy(() =>
  import("./apps/ReadingList").then((m) => ({ default: m.ReadingList })),
);
const DailyLog = React.lazy(() =>
  import("./apps/DailyLog").then((m) => ({ default: m.DailyLog })),
);
const ExpenseSplitter = React.lazy(() =>
  import("./apps/ExpenseSplitter").then((m) => ({
    default: m.ExpenseSplitter,
  })),
);
const PersonalCRM = React.lazy(() =>
  import("./apps/PersonalCRM").then((m) => ({ default: m.PersonalCRM })),
);
const FinanceDashboard = React.lazy(() =>
  import("./apps/FinanceDashboard").then((m) => ({
    default: m.FinanceDashboard,
  })),
);
const SecureNotes = React.lazy(() =>
  import("./apps/SecureNotes").then((m) => ({ default: m.SecureNotes })),
);
const DailyStandup = React.lazy(() =>
  import("./apps/DailyStandup").then((m) => ({ default: m.DailyStandup })),
);
const HabitTrackerPro = React.lazy(() =>
  import("./apps/HabitTrackerPro").then((m) => ({
    default: m.HabitTrackerPro,
  })),
);
const WaterTracker = React.lazy(() =>
  import("./apps/WaterTracker").then((m) => ({ default: m.WaterTracker })),
);
const NetWorthTracker = React.lazy(() =>
  import("./apps/NetWorthTracker").then((m) => ({
    default: m.NetWorthTracker,
  })),
);
const LanguageNotes = React.lazy(() =>
  import("./apps/LanguageNotes").then((m) => ({ default: m.LanguageNotes })),
);
const ExpenseTracker = React.lazy(() =>
  import("./apps/ExpenseTracker").then((m) => ({ default: m.ExpenseTracker })),
);
const StudyTimer = React.lazy(() =>
  import("./apps/StudyTimer").then((m) => ({ default: m.StudyTimer })),
);
const DataVisualizer = React.lazy(() =>
  import("./apps/DataVisualizer").then((m) => ({ default: m.DataVisualizer })),
);
const InvoiceGenerator = React.lazy(() =>
  import("./apps/InvoiceGenerator").then((m) => ({
    default: m.InvoiceGenerator,
  })),
);
const MeetingNotes = React.lazy(() =>
  import("./apps/MeetingNotes").then((m) => ({ default: m.MeetingNotes })),
);
const KanbanBoard = React.lazy(() =>
  import("./apps/KanbanBoard").then((m) => ({ default: m.KanbanBoard })),
);
const MarkdownEditor = React.lazy(() =>
  import("./apps/MarkdownEditor").then((m) => ({ default: m.MarkdownEditor })),
);
const HabitCalendar = React.lazy(() =>
  import("./apps/HabitCalendar").then((m) => ({ default: m.HabitCalendar })),
);
const DiffTool = React.lazy(() =>
  import("./apps/DiffTool").then((m) => ({ default: m.DiffTool })),
);
const Stopwatch = React.lazy(() =>
  import("./apps/Stopwatch").then((m) => ({ default: m.Stopwatch })),
);
const PersonalTimeline = React.lazy(() =>
  import("./apps/PersonalTimeline").then((m) => ({
    default: m.PersonalTimeline,
  })),
);
const Scratchpad = React.lazy(() =>
  import("./apps/Scratchpad").then((m) => ({ default: m.Scratchpad })),
);
const FocusBoard = React.lazy(() =>
  import("./apps/FocusBoard").then((m) => ({ default: m.FocusBoard })),
);
const AiPromptBuilder = React.lazy(() =>
  import("./apps/AiPromptBuilder").then((m) => ({
    default: m.AiPromptBuilder,
  })),
);
const SubscriptionTracker = React.lazy(() =>
  import("./apps/SubscriptionTracker").then((m) => ({
    default: m.SubscriptionTracker,
  })),
);
const InterviewPrep = React.lazy(() =>
  import("./apps/InterviewPrep").then((m) => ({ default: m.InterviewPrep })),
);
const MedicalRecords = React.lazy(() =>
  import("./apps/MedicalRecords").then((m) => ({ default: m.MedicalRecords })),
);
const TripPlanner = React.lazy(() =>
  import("./apps/TripPlanner").then((m) => ({ default: m.TripPlanner })),
);
const DreamJournal = React.lazy(() =>
  import("./apps/DreamJournal").then((m) => ({ default: m.DreamJournal })),
);
const PasswordGenerator = React.lazy(() =>
  import("./apps/PasswordGenerator").then((m) => ({
    default: m.PasswordGenerator,
  })),
);
const NetworkMonitor = React.lazy(() =>
  import("./apps/NetworkMonitor").then((m) => ({ default: m.NetworkMonitor })),
);
const PhotoJournal = React.lazy(() =>
  import("./apps/PhotoJournal").then((m) => ({ default: m.PhotoJournal })),
);
const PersonalDashboard = React.lazy(() =>
  import("./apps/PersonalDashboard").then((m) => ({
    default: m.PersonalDashboard,
  })),
);

const WorkoutTracker = React.lazy(() => import("./apps/WorkoutTracker"));
const ApiTester = React.lazy(() => import("./apps/ApiTester"));
const FinancialGoals = React.lazy(() => import("./apps/FinancialGoals"));
const MusicVisualizer = React.lazy(() =>
  import("./apps/MusicVisualizer").then((m) => ({
    default: m.MusicVisualizer,
  })),
);
const ColorPaletteGenerator = React.lazy(() =>
  import("./apps/ColorPaletteGenerator").then((m) => ({
    default: m.ColorPaletteGenerator,
  })),
);
const MarkdownResume = React.lazy(() =>
  import("./apps/MarkdownResume").then((m) => ({ default: m.MarkdownResume })),
);

const WordProcessor = React.lazy(() =>
  import("./apps/WordProcessor").then((m) => ({ default: m.WordProcessor })),
);
const PersonalKnowledgeBase = React.lazy(() =>
  import("./apps/PersonalKnowledgeBase").then((m) => ({
    default: m.PersonalKnowledgeBase,
  })),
);
const FileConverter = React.lazy(() =>
  import("./apps/FileConverter").then((m) => ({ default: m.FileConverter })),
);
const PomodoroProApp = React.lazy(() =>
  import("./apps/PomodoroProApp").then((m) => ({ default: m.PomodoroProApp })),
);
const SmartClipboard = React.lazy(() =>
  import("./apps/SmartClipboard").then((m) => ({ default: m.SmartClipboard })),
);
const CodeReviewNotes = React.lazy(() =>
  import("./apps/CodeReviewNotes").then((m) => ({
    default: m.CodeReviewNotes,
  })),
);
const LifeStats = React.lazy(() =>
  import("./apps/LifeStats").then((m) => ({ default: m.LifeStats })),
);
const SystemInfo = React.lazy(() =>
  import("./apps/SystemInfo").then((m) => ({ default: m.SystemInfo })),
);
const WhiteboardLite = React.lazy(() =>
  import("./apps/WhiteboardLite").then((m) => ({ default: m.WhiteboardLite })),
);
const HabitStreaks = React.lazy(() =>
  import("./apps/HabitStreaks").then((m) => ({ default: m.HabitStreaks })),
);
const FinanceCalculator = React.lazy(() =>
  import("./apps/FinanceCalculator").then((m) => ({
    default: m.FinanceCalculator,
  })),
);
const MeetingPlanner = React.lazy(() =>
  import("./apps/MeetingPlanner").then((m) => ({ default: m.MeetingPlanner })),
);
const AIWritingAssistant = React.lazy(
  () => import("./apps/AIWritingAssistant"),
);
const ExpenseReport = React.lazy(() => import("./apps/ExpenseReport"));
const MindCalendar = React.lazy(() => import("./apps/MindCalendar"));
const DailyJournal = React.lazy(() =>
  import("./apps/DailyJournal").then((m) => ({ default: m.DailyJournal })),
);
const BudgetPlanner = React.lazy(() =>
  import("./apps/BudgetPlanner").then((m) => ({ default: m.BudgetPlanner })),
);
const DeveloperToolkit = React.lazy(() =>
  import("./apps/DeveloperToolkit").then((m) => ({
    default: m.DeveloperToolkit,
  })),
);
const HabitStreaksPro = React.lazy(() =>
  import("./apps/HabitStreaksPro").then((m) => ({
    default: m.HabitStreaksPro,
  })),
);
const FocusMode = React.lazy(() =>
  import("./apps/FocusMode").then((m) => ({ default: m.FocusMode })),
);

const APP_COMPONENTS: Record<
  string,
  React.ComponentType<{ windowProps?: Record<string, unknown> }>
> = {
  filemanager: FileManager,
  notes: Notes,
  appstore: AppStore,
  terminal: Terminal,
  settings: Settings,
  codeeditor: CodeEditor,
  processmonitor: ProcessMonitor,
  calculator: Calculator,
  texteditor: TextEditor,
  browser: Browser,
  musicplayer: MusicPlayer,
  imageviewer: ImageViewer,
  dashboard: ProcessMonitor,
  wordprocessor: WordProcessor,
  spreadsheet: Spreadsheet,
  calendar: Calendar,
  passwordmanager: PasswordManager,
  drawing: Drawing,
  taskmanager: TaskManager,
  pomodoro: PomodoroTimer,
  contactmanager: ContactManager,
  journal: Journal,
  budget: BudgetTracker,
  markdown: MarkdownViewer,
  converter: UnitConverter,
  habittracker: HabitTracker,
  bookmarks: BookmarksManager,
  planner: DailyPlanner,
  flashcards: FlashcardApp,
  recipes: RecipeManager,
  mindmap: MindMap,
  portfolio: IcpPortfolio,
  timetracker: TimeTracker,
  personalwiki: PersonalWiki,
  goaltracker: GoalTracker,
  stickynotes: StickyNotes,
  jsonformatter: JsonFormatter,
  base64tool: Base64Tool,
  colorpicker: ColorPicker,
  regextester: RegexTester,
  hashgenerator: HashGenerator,
  worldclock: WorldClock,
  baseconverter: BaseConverter,
  encryption: EncryptionTool,
  qrcode: QrCodeGenerator,
  loancalc: LoanCalculator,
  sleeptracker: SleepTracker,
  shortcuts: KeyboardShortcuts,
  personalfinance: PersonalFinance,
  vocabnotes: VocabNotes,
  moodtracker: MoodTracker,
  codesnippets: CodeSnippets,
  readinglist: ReadingList,
  dailylog: DailyLog,
  splitter: ExpenseSplitter,
  personalcrm: PersonalCRM,
  financedashboard: FinanceDashboard,
  securenotes: SecureNotes,
  standup: DailyStandup,
  habitpro: HabitTrackerPro,
  watertracker: WaterTracker,
  networth: NetWorthTracker,
  languagenotes: LanguageNotes,
  expensetracker: ExpenseTracker,
  studytimer: StudyTimer,
  datavisualizer: DataVisualizer,
  invoicegenerator: InvoiceGenerator,
  meetingnotes: MeetingNotes,
  kanban: KanbanBoard,
  markdowneditor: MarkdownEditor,
  habitcalendar: HabitCalendar,
  difftool: DiffTool,
  stopwatch: Stopwatch,
  focusboard: FocusBoard,
  timeline: PersonalTimeline,
  scratchpad: Scratchpad,
  "ai-prompts": AiPromptBuilder,
  subscriptions: SubscriptionTracker,
  "interview-prep": InterviewPrep,
  medicalrecords: MedicalRecords,
  tripplanner: TripPlanner,
  dreamjournal: DreamJournal,
  passwordgen: PasswordGenerator,
  pomodorov2: PomodoroTimer,
  networkmonitor: NetworkMonitor,
  filenotes: Notes,
  "photo-journal": PhotoJournal,
  "personal-dashboard": PersonalDashboard,
  workout: WorkoutTracker,
  apitester: ApiTester,
  financialgoals: FinancialGoals,
  musicvisualizer: MusicVisualizer,
  colorpalettegen: ColorPaletteGenerator,
  markdownresume: MarkdownResume,
  knowledgebase: PersonalKnowledgeBase,
  fileconverter: FileConverter,
  pomodoropro: PomodoroProApp,
  whiteboardlite: WhiteboardLite,
  smartclipboard: SmartClipboard,
  codereview: CodeReviewNotes,
  lifestats: LifeStats,
  systeminfo: SystemInfo,
  habitstreaks: HabitStreaks,
  financecalc: FinanceCalculator,
  meetingplanner: MeetingPlanner,
  aiwriting: AIWritingAssistant,
  expensereport: ExpenseReport,
  mindcalendar: MindCalendar,
  dailyjournal: DailyJournal,
  budgetplanner: BudgetPlanner,
  devtoolkit: DeveloperToolkit,
  habitstreakspro: HabitStreaksPro,
  "focus-mode": FocusMode,
};

// Prefetch top apps during browser idle time
if (typeof window !== "undefined" && "requestIdleCallback" in window) {
  (
    window as Window & { requestIdleCallback: (cb: () => void) => void }
  ).requestIdleCallback(() => {
    import("./apps/Notes");
    import("./apps/FileManager");
    import("./apps/Calendar");
    import("./apps/Settings");
    import("./apps/AppStore");
  });
  (
    window as Window & { requestIdleCallback: (cb: () => void) => void }
  ).requestIdleCallback(() => {
    import("./apps/WordProcessor");
    import("./apps/Spreadsheet");
    import("./apps/PasswordManager");
    import("./apps/TaskManager");
    import("./apps/Terminal");
  });
}

function AppSkeleton() {
  return (
    <div className="flex-1 flex items-center justify-center h-full macos-app-bg">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "oklch(0.83 0.13 196)",
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

const MENUBAR_H = 28;
const TASKBAR_H = 48;

interface WindowProps {
  window: WindowState;
}

export const Window = React.memo(function Window({ window: win }: WindowProps) {
  const {
    closeWindow,
    minimizeWindow,
    bringToFront,
    updateWindowPos,
    updateWindowSize,
  } = useOS();
  const { focusedWindowId } = useFocusContext();
  const xMV = useMotionValue(win.x);
  const yMV = useMotionValue(win.y);
  const sizeRef = useRef({ width: win.width, height: win.height });
  sizeRef.current = { width: win.width, height: win.height };
  const windowDivRef = useRef<HTMLDivElement>(null);
  const localResizeW = useRef(win.width);
  const localResizeH = useRef(win.height);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0, started: false });
  const resizing = useRef(false);
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const [maximized, setMaximized] = useState(false);
  const prevState = useRef({ x: win.x, y: win.y, w: win.width, h: win.height });
  const snapped = useRef<null | "left" | "right">(null);
  const preSnapState = useRef<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const snapPreviewDir = useRef<null | "left" | "right">(null);
  const snapOverlayRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);

  const isFocused = focusedWindowId === win.id;

  useEffect(() => {
    xMV.set(win.x);
  }, [win.x, xMV]);
  useEffect(() => {
    yMV.set(win.y);
  }, [win.y, yMV]);

  const onHeaderMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      if (maximized) return;
      e.preventDefault();
      dragStart.current = { x: e.clientX, y: e.clientY, started: false };
      dragOffset.current = {
        x: e.clientX - xMV.get(),
        y: e.clientY - yMV.get(),
      };
      dragging.current = true;
      bringToFront(win.id);

      if (snapped.current && preSnapState.current) {
        const ps = preSnapState.current;
        updateWindowSize(win.id, ps.w, ps.h);
        dragOffset.current = { x: ps.w / 2, y: e.clientY - yMV.get() };
        snapped.current = null;
        preSnapState.current = null;
      }
    },
    [win.id, bringToFront, maximized, updateWindowSize, xMV, yMV],
  );

  const onResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (maximized) return;
      e.preventDefault();
      e.stopPropagation();
      resizing.current = true;
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        w: sizeRef.current.width,
        h: sizeRef.current.height,
      };
    },
    [maximized],
  );

  const handleMaximize = useCallback(() => {
    const clientW = document.documentElement.clientWidth;
    const clientH = document.documentElement.clientHeight;
    if (!maximized) {
      prevState.current = {
        x: xMV.get(),
        y: yMV.get(),
        w: sizeRef.current.width,
        h: sizeRef.current.height,
      };
      updateWindowPos(win.id, 0, 0);
      updateWindowSize(win.id, clientW, clientH - 48);
      setMaximized(true);
    } else {
      updateWindowPos(win.id, prevState.current.x, prevState.current.y);
      updateWindowSize(win.id, prevState.current.w, prevState.current.h);
      setMaximized(false);
    }
  }, [maximized, win.id, updateWindowPos, updateWindowSize, xMV, yMV]);

  useEffect(() => {
    const DRAG_THRESHOLD = 5;
    const SNAP_ZONE = 60;

    const onMouseMove = (e: MouseEvent) => {
      if (dragging.current) {
        if (!dragStart.current.started) {
          const dx = Math.abs(e.clientX - dragStart.current.x);
          const dy = Math.abs(e.clientY - dragStart.current.y);
          if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) return;
          dragStart.current.started = true;
        }
        const clientW = document.documentElement.clientWidth;
        const clientH = document.documentElement.clientHeight;
        const x = Math.max(
          0,
          Math.min(
            e.clientX - dragOffset.current.x,
            clientW - sizeRef.current.width,
          ),
        );
        const y = Math.max(
          MENUBAR_H,
          Math.min(e.clientY - dragOffset.current.y, clientH - 48 - 36),
        );
        xMV.set(x);
        yMV.set(y);
        const centerX = e.clientX;
        const newDir =
          centerX < SNAP_ZONE
            ? "left"
            : clientW - centerX < SNAP_ZONE
              ? "right"
              : null;
        if (newDir !== snapPreviewDir.current) {
          snapPreviewDir.current = newDir;
          if (snapOverlayRef.current) {
            if (newDir) {
              snapOverlayRef.current.style.display = "block";
              snapOverlayRef.current.style.left =
                newDir === "left" ? "0" : "50%";
            } else {
              snapOverlayRef.current.style.display = "none";
            }
          }
        }
      }
      if (resizing.current) {
        const dx = e.clientX - resizeStart.current.x;
        const dy = e.clientY - resizeStart.current.y;
        const newW = Math.max(320, resizeStart.current.w + dx);
        const newH = Math.max(200, resizeStart.current.h + dy);
        localResizeW.current = newW;
        localResizeH.current = newH;
        if (windowDivRef.current) {
          windowDivRef.current.style.width = `${newW}px`;
          windowDivRef.current.style.height = `${newH}px`;
        }
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (dragging.current && dragStart.current.started) {
        const clientW = document.documentElement.clientWidth;
        const clientH = document.documentElement.clientHeight;
        const availH = clientH - MENUBAR_H - TASKBAR_H;
        const halfW = clientW / 2;
        const centerX = e.clientX;
        if (centerX < SNAP_ZONE) {
          preSnapState.current = {
            x: xMV.get(),
            y: yMV.get(),
            w: sizeRef.current.width,
            h: sizeRef.current.height,
          };
          updateWindowPos(win.id, 0, MENUBAR_H);
          updateWindowSize(win.id, halfW, availH);
          snapped.current = "left";
        } else if (clientW - centerX < SNAP_ZONE) {
          preSnapState.current = {
            x: xMV.get(),
            y: yMV.get(),
            w: sizeRef.current.width,
            h: sizeRef.current.height,
          };
          updateWindowPos(win.id, halfW, MENUBAR_H);
          updateWindowSize(win.id, halfW, availH);
          snapped.current = "right";
        } else {
          updateWindowPos(win.id, xMV.get(), yMV.get());
        }
      }
      if (resizing.current) {
        updateWindowSize(win.id, localResizeW.current, localResizeH.current);
      }
      dragging.current = false;
      dragStart.current.started = false;
      resizing.current = false;
      snapPreviewDir.current = null;
      if (snapOverlayRef.current) snapOverlayRef.current.style.display = "none";
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [win.id, updateWindowPos, updateWindowSize, xMV, yMV]);

  const AppComponent = APP_COMPONENTS[win.appId];

  return (
    <AnimatePresence>
      {!win.minimized && (
        <>
          <div
            ref={snapOverlayRef}
            className="fixed pointer-events-none"
            style={{
              display: "none",
              top: MENUBAR_H,
              left: 0,
              width: "50%",
              height: `calc(100vh - ${MENUBAR_H}px - ${TASKBAR_H}px)`,
              background:
                "rgba(var(--os-accent-r),var(--os-accent-g),var(--os-accent-b),0.08)",
              border:
                "2px solid rgba(var(--os-accent-r),var(--os-accent-g),var(--os-accent-b),0.35)",
              borderRadius: 10,
              zIndex: win.zIndex - 1,
              backdropFilter: "blur(2px)",
            }}
          />
          <motion.div
            ref={windowDivRef}
            key={win.id}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { type: "spring", stiffness: 400, damping: 30 },
            }}
            exit={
              isMinimizing
                ? {
                    opacity: 0,
                    scale: 0.1,
                    y: "70vh",
                    transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
                  }
                : {
                    opacity: 0,
                    scale: 0.94,
                    y: 10,
                    transition: { duration: 0.15, ease: "easeIn" },
                  }
            }
            className={`os-window absolute select-none ${isFocused ? "os-window-focused" : ""}`}
            style={{
              left: xMV,
              top: yMV,
              width: win.width,
              height: win.height,
              zIndex: win.zIndex,
              display: "flex",
              flexDirection: "column",
              willChange: "transform",
            }}
            onMouseDown={() => bringToFront(win.id)}
            data-ocid={`${win.appId}.panel`}
          >
            {/* Title bar */}
            <div
              className="os-window-header"
              onMouseDown={onHeaderMouseDown}
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              {/* Traffic light buttons (left side, macOS style) */}
              <div className="flex items-center gap-[7px]">
                <button
                  type="button"
                  onClick={() => closeWindow(win.id)}
                  data-ocid={`${win.appId}.close_button`}
                  title="Close"
                  className="os-win-btn os-win-btn-close"
                >
                  {showControls && (
                    <svg
                      width="6"
                      height="6"
                      viewBox="0 0 8 8"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1.5 1.5l5 5M6.5 1.5l-5 5"
                        stroke="rgba(0,0,0,0.45)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMinimizing(true);
                    setTimeout(() => {
                      minimizeWindow(win.id);
                      setIsMinimizing(false);
                    }, 280);
                  }}
                  data-ocid={`${win.appId}.secondary_button`}
                  title="Minimize"
                  className="os-win-btn os-win-btn-min"
                >
                  {showControls && (
                    <svg
                      width="6"
                      height="6"
                      viewBox="0 0 8 8"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1.5 4h5"
                        stroke="rgba(0,0,0,0.45)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleMaximize}
                  data-ocid={`${win.appId}.toggle`}
                  title={maximized ? "Restore" : "Maximize"}
                  className="os-win-btn os-win-btn-max"
                >
                  {showControls &&
                    (maximized ? (
                      <Minimize2
                        style={{
                          width: 6,
                          height: 6,
                          color: "rgba(0,0,0,0.45)",
                        }}
                      />
                    ) : (
                      <Maximize2
                        style={{
                          width: 6,
                          height: 6,
                          color: "rgba(0,0,0,0.45)",
                        }}
                      />
                    ))}
                </button>
              </div>

              {/* Centered title */}
              <div className="absolute left-0 right-0 flex items-center justify-center pointer-events-none">
                <div className="flex items-center gap-1.5">
                  <AppIcon
                    appId={win.appId}
                    size={13}
                    className="flex-shrink-0 opacity-70"
                  />
                  <span
                    className="text-[12px] font-semibold tracking-wide truncate"
                    style={{
                      color: isFocused
                        ? "var(--os-text-primary)"
                        : "var(--os-text-muted)",
                      transition: "color 0.2s",
                    }}
                  >
                    {win.title}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden relative flex flex-col">
              <WindowFocusProvider windowId={win.id} isFocused={isFocused}>
                <Suspense fallback={<AppSkeleton />}>
                  <div className="flex flex-col h-full w-full min-h-0">
                    {AppComponent ? (
                      <AppComponent windowProps={win.props} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                        Unknown app: {win.appId}
                      </div>
                    )}
                  </div>
                </Suspense>
              </WindowFocusProvider>
            </div>

            <div
              className="resize-handle"
              onMouseDown={onResizeMouseDown}
              data-ocid={`${win.appId}.drag_handle`}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
