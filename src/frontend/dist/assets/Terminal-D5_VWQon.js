import { u as useOS, i as useActor, v as useInstalledApps, r as reactExports, j as jsxRuntimeExports } from "./index-8tMpYjTW.js";
const HELP_TEXT = `
DecentOS Shell v2.0.0
─────────────────────────────
Commands:
  help                  Show this help
  clear                 Clear terminal
  whoami                Show your principal
  cycles                Show cycles balance
  version               Show OS version
  ls [folderId]         List directory (default: root)
  mkdir <name>          Create folder in root
  touch <name>          Create empty file in root
  rm <id>               Delete node by ID
  cat <id>              Read file by ID
  write <id> <content>  Write content to file by ID
  pwd                   Show current path
  echo <text>           Print text to terminal
  date                  Show current system time
  apps                  List installed applications
  sysinfo               Show system information
  ps                    List open windows (running processes)
  storage               Show on-chain storage statistics
  man <command>         Show command manual
  uname [-a]            Show system information
  uptime                Show session uptime
  df [-h]               Show disk/storage usage
─────────────────────────────
`.trim();
let lineId = 0;
const sessionStartMs = Date.now();
function mkLine(text, type) {
  return { text, type, id: ++lineId };
}
function bigintNsToDate(ns) {
  const ms = Number(ns / BigInt(1e6));
  return new Date(ms).toLocaleString();
}
function Terminal({ windowProps: _windowProps }) {
  const { session, windows } = useOS();
  const { actor } = useActor();
  const { installedApps } = useInstalledApps();
  const [output, setOutput] = reactExports.useState(() => {
    const base = [
      mkLine("⬡ DecentOS Kernel Shell v2.0.0", "system"),
      mkLine("Connected to Internet Computer Protocol.", "system"),
      mkLine("Type `help` for available commands.", "system"),
      mkLine("", "system")
    ];
    try {
      if (localStorage.getItem("decentos_terminal_hint_shown") !== "true") {
        base.push(
          mkLine(
            "[hint] Type 'help' to see available commands · 'df -h' for storage · 'uname' for system info",
            "system"
          )
        );
      }
    } catch {
    }
    return base;
  });
  const [firstCommandFired, setFirstCommandFired] = reactExports.useState(false);
  const [input, setInput] = reactExports.useState("");
  const [history, setHistory] = reactExports.useState([]);
  const [historyIndex, setHistoryIndex] = reactExports.useState(-1);
  const [isProcessing, setIsProcessing] = reactExports.useState(false);
  const bottomRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    var _a;
    (_a = bottomRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  }, [output]);
  const print = (text, type = "output") => {
    setOutput((prev) => [...prev, mkLine(text, type)]);
  };
  const runCommand = async (cmd) => {
    var _a;
    const trimmed = cmd.trim();
    if (!trimmed) return;
    if (!actor) {
      print("Not connected to the network.", "error");
      return;
    }
    print(`$ ${trimmed}`, "input");
    setHistory((prev) => [trimmed, ...prev.slice(0, 49)]);
    setHistoryIndex(-1);
    if (!firstCommandFired) {
      setFirstCommandFired(true);
      try {
        localStorage.setItem("decentos_terminal_hint_shown", "true");
      } catch {
      }
      setOutput((prev) => prev.filter((l) => !l.text.startsWith("[hint]")));
    }
    const [command, ...args] = trimmed.split(/\s+/);
    setIsProcessing(true);
    try {
      switch (command.toLowerCase()) {
        case "help":
          print(HELP_TEXT);
          break;
        case "clear":
          setOutput([]);
          break;
        case "whoami": {
          const principal = (session == null ? void 0 : session.principal) ?? await actor.getPrincipalAsText();
          print(`Principal: ${principal}`);
          break;
        }
        case "cycles": {
          const balance = await actor.getCyclesBalance();
          print(`Cycles balance: ${balance.toString()} cycles`);
          break;
        }
        case "version": {
          const ver = await actor.getOSVersion();
          print(`DecentOS ${ver}`);
          break;
        }
        case "pwd":
          print(`/home/${(session == null ? void 0 : session.displayName) ?? "user"}`);
          break;
        case "ls": {
          const folderId = args[0] ? Number.parseInt(args[0]) : null;
          const nodes = await actor.listChildren(folderId);
          if (nodes.length === 0) {
            print("(empty directory)");
          } else {
            const lines = nodes.map(
              (n) => `  ${n.nodeType === "folder" ? "d" : "-"}  ${String(n.id).padStart(4)}  ${n.name}`
            );
            print(["type id   name", "─────────────────", ...lines].join("\n"));
          }
          break;
        }
        case "mkdir": {
          if (!args[0]) {
            print("Usage: mkdir <name>", "error");
            break;
          }
          const id = await actor.createFolder(args[0], null);
          print(`Created folder "${args[0]}" (id: ${id})`);
          break;
        }
        case "touch": {
          if (!args[0]) {
            print("Usage: touch <name>", "error");
            break;
          }
          const id = await actor.createFile(args[0], "", null);
          print(`Created file "${args[0]}" (id: ${id})`);
          break;
        }
        case "rm": {
          if (!args[0]) {
            print("Usage: rm <id>", "error");
            break;
          }
          const rmId = Number.parseInt(args[0]);
          if (Number.isNaN(rmId)) {
            print("Invalid ID", "error");
            break;
          }
          await actor.deleteNode(rmId);
          print(`Deleted node ${rmId}`);
          break;
        }
        case "cat": {
          if (!args[0]) {
            print("Usage: cat <id|filename>", "error");
            break;
          }
          const catId = Number.parseInt(args[0]);
          if (Number.isNaN(catId)) {
            print(`File not found: ${args[0]}`, "error");
            break;
          }
          const content = await actor.readFile(catId);
          print(content || "(empty file)");
          break;
        }
        case "echo": {
          print(args.join(" "));
          break;
        }
        case "write": {
          if (args.length < 2) {
            print("Usage: write <id> <content>", "error");
            break;
          }
          const writeId = Number.parseInt(args[0]);
          if (Number.isNaN(writeId)) {
            print("Invalid ID", "error");
            break;
          }
          const writeContent = args.slice(1).join(" ");
          await actor.updateFileContent(writeId, writeContent);
          print(`Written to file ${writeId}: "${writeContent}"`);
          break;
        }
        case "date": {
          const sysTime = await actor.getSystemTime();
          print(`System time: ${bigintNsToDate(sysTime)}`);
          break;
        }
        case "apps": {
          const installedApps2 = await actor.listUserInstalledApps();
          if (installedApps2.length === 0) {
            print("No apps installed.");
          } else {
            const header = "  Name                         Description";
            const divider = "  ────────────────────────────────────────────────────────";
            const rows = installedApps2.map(
              (a) => `  ${a.name.padEnd(28)} ${a.description ?? ""}`.slice(0, 60)
            );
            print([header, divider, ...rows].join("\n"));
          }
          break;
        }
        case "sysinfo": {
          const [ver, principal, cyclesBal] = await Promise.all([
            actor.getOSVersion(),
            actor.getPrincipalAsText(),
            actor.getCyclesBalance()
          ]);
          const truncatedPrincipal = `${principal.slice(0, 16)}...${principal.slice(-8)}`;
          const cyclesNum = Number(cyclesBal);
          const cyclesFormatted = cyclesNum >= 1e12 ? `${(cyclesNum / 1e12).toFixed(2)}T` : cyclesNum >= 1e9 ? `${(cyclesNum / 1e9).toFixed(2)}G` : cyclesNum >= 1e6 ? `${(cyclesNum / 1e6).toFixed(2)}M` : `${cyclesNum}`;
          const sysInfoBlock = [
            "╔══════════════════════════════════════╗",
            "║          DecentOS System Info         ║",
            "╠══════════════════════════════════════╣",
            `║  OS        DecentOS ${ver.padEnd(16)}║`,
            "║  Network   Internet Computer          ║",
            `║  Principal ${truncatedPrincipal.padEnd(26)}║`,
            `║  Cycles    ${cyclesFormatted.padEnd(26)}║`,
            "║  Shell     /bin/dsh v2.0              ║",
            "║  Kernel    Motoko canister             ║",
            "╚══════════════════════════════════════╝"
          ].join("\n");
          print(sysInfoBlock, "system");
          break;
        }
        case "ps": {
          const openWins = windows ?? [];
          if (openWins.length === 0) {
            print("No open windows.");
          } else {
            const header = "  PID   APP              TITLE";
            const divider = "  ──────────────────────────────────────";
            const rows = openWins.filter((w) => !w.minimized).map(
              (w, i) => `  ${String(i + 1).padStart(3)}   ${String(w.appId ?? "unknown").padEnd(16)} ${w.title ?? w.appId ?? ""}`
            );
            const minimized = openWins.filter(
              (w) => w.minimized
            ).length;
            print(
              [
                header,
                divider,
                ...rows,
                "",
                `  ${openWins.length} process(es) — ${minimized} minimized`
              ].join("\n")
            );
          }
          break;
        }
        case "storage": {
          try {
            const installedCount = (installedApps == null ? void 0 : installedApps.length) ?? 0;
            const storageRows = [
              "╔══════════════════════════════════════╗",
              "║        DecentOS Storage Report        ║",
              "╠══════════════════════════════════════╣",
              "║  Type          Used        Limit      ║",
              "╠══════════════════════════════════════╣",
              "║  Stable Mem    ~varies     400 GB     ║",
              "║  Heap          ~varies     4 GB       ║",
              "║  KV Keys       on-chain    unlimited  ║",
              `║  Installed Apps ${String(installedCount).padEnd(3)}                  ║`,
              "╠══════════════════════════════════════╣",
              "║  All data persists on Internet        ║",
              "║  Computer — no cloud storage used.    ║",
              "╚══════════════════════════════════════╝"
            ];
            print(storageRows.join("\n"), "system");
          } catch {
            print("Unable to retrieve storage stats.", "error");
          }
          break;
        }
        case "man": {
          const manCmd = (_a = args[0]) == null ? void 0 : _a.toLowerCase();
          const manuals = {
            help: "help — show all available commands",
            clear: "clear — clear terminal output",
            echo: "echo <text> — print text to terminal",
            cat: "cat <id|filename> — read file content by ID or print not found",
            pwd: "pwd — print working directory (/home/user)",
            mkdir: "mkdir <name> — create a new directory",
            touch: "touch <name> — create an empty file",
            ls: "ls [folderId] — list directory contents",
            whoami: "whoami — display current principal",
            cycles: "cycles — show cycles balance",
            version: "version — show DecentOS version",
            date: "date — show current system time",
            apps: "apps — list installed applications",
            sysinfo: "sysinfo — show full system information",
            ps: "ps — list running processes (open windows)",
            storage: "storage — show on-chain storage stats",
            uname: "uname [-a] — show OS and architecture info",
            uptime: "uptime — show session uptime since page load",
            df: "df [-h] — show disk/storage usage summary",
            rm: "rm <id> — delete a file or folder by ID",
            write: "write <id> <content> — write content to a file by ID"
          };
          if (!manCmd) {
            print("Usage: man <command>", "error");
          } else if (manuals[manCmd]) {
            print(manuals[manCmd]);
          } else {
            print(`No manual entry for: ${manCmd}`, "error");
          }
          break;
        }
        case "uname": {
          print("DecentOS 1.0 ICP-Blockchain aarch64");
          break;
        }
        case "uptime": {
          const elapsed = Math.floor((Date.now() - sessionStartMs) / 1e3);
          const hrs = Math.floor(elapsed / 3600);
          const mins = Math.floor(elapsed % 3600 / 60);
          const secs = elapsed % 60;
          const parts = [];
          if (hrs > 0) parts.push(`${hrs}h`);
          if (mins > 0) parts.push(`${mins}m`);
          parts.push(`${secs}s`);
          print(`up ${parts.join(" ")} — session active since page load`);
          break;
        }
        case "df": {
          print(
            [
              "Filesystem          Size     Used    Avail   Use%",
              "─────────────────────────────────────────────────",
              "canister/stable     400G     ~varies   ~varies  —",
              "canister/heap         4G     ~varies   ~varies  —",
              "blob-storage        400G     ~varies   ~varies  —",
              "",
              "All storage on Internet Computer blockchain.",
              "Run 'storage' for a detailed breakdown."
            ].join("\n")
          );
          break;
        }
        default:
          print(
            `Command not found: ${command}. Type 'help' for help.`,
            "error"
          );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      print(`Error: ${msg}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(idx);
      if (history[idx]) setInput(history[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(historyIndex - 1, -1);
      setHistoryIndex(idx);
      setInput(idx === -1 ? "" : history[idx]);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full font-mono text-xs",
      style: { background: "var(--os-bg-app)" },
      onClick: () => {
        var _a;
        return (_a = inputRef.current) == null ? void 0 : _a.focus();
      },
      onKeyDown: (e) => {
        var _a;
        return e.key === "Enter" && ((_a = inputRef.current) == null ? void 0 : _a.focus());
      },
      "data-ocid": "terminal.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-3 space-y-0.5", children: [
          output.map((line) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `leading-5 whitespace-pre-wrap break-all ${line.type === "input" ? "text-primary" : line.type === "error" ? "text-destructive" : line.type === "system" ? "text-primary/60" : "text-foreground/80"}`,
              children: line.text
            },
            line.id
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-3 py-2 border-t",
            style: {
              borderColor: "rgba(55,55,65,0.8)",
              background: "rgba(18,18,24,0.8)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "os-cyan-text flex-shrink-0", children: "$" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: inputRef,
                  value: input,
                  onChange: (e) => setInput(e.target.value),
                  onKeyDown: handleKeyDown,
                  disabled: isProcessing,
                  placeholder: isProcessing ? "Processing..." : "",
                  "data-ocid": "terminal.input",
                  className: "flex-1 bg-transparent text-foreground outline-none placeholder-muted-foreground/40 disabled:opacity-50",
                  style: { caretColor: "rgba(129,140,248,0.8)" }
                }
              ),
              isProcessing && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-primary/60 animate-pulse",
                  "data-ocid": "terminal.loading_state",
                  children: "▋"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
export {
  Terminal
};
