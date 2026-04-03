import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  BarChart2,
  Bold,
  Download,
  Eraser,
  Italic,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import { toast } from "sonner";
import { useWindowFocus } from "../../context/WindowFocusContext";
import { useCanisterKV } from "../../hooks/useCanisterKV";

const ROWS = 20;
const COLS = 10;

function colLabel(col: number): string {
  let label = "";
  let c = col;
  while (c >= 0) {
    label = String.fromCharCode(65 + (c % 26)) + label;
    c = Math.floor(c / 26) - 1;
  }
  return label;
}

function cellKey(row: number, col: number) {
  return `${colLabel(col)}${row + 1}`;
}

function parseCellRef(ref: string): [number, number] | null {
  const m = ref.match(/^([A-Z]+)(\d+)$/);
  if (!m) return null;
  const colStr = m[1];
  const row = Number.parseInt(m[2], 10) - 1;
  let col = 0;
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 65 + 1);
  }
  col -= 1;
  return [row, col];
}

interface CellFormat {
  bold?: boolean;
  italic?: boolean;
  align?: "left" | "center" | "right";
  textColor?: string;
  bgColor?: string;
}

// ──────────────────────────────────────────────────
// Formula evaluator — returns specific error codes:
//   #DIV/0!  division by zero
//   #VALUE!  non-numeric operand
//   #NAME?   unknown function
//   #REF!    out-of-range cell reference
//   #N/A     lookup not found
//   #ERR     generic / syntax error
// ──────────────────────────────────────────────────
function evaluateFormula(
  formula: string,
  grid: Record<string, string>,
  visited: Set<string> = new Set(),
): string {
  try {
    const expr = formula.slice(1).trim().toUpperCase();
    const exprOrig = formula.slice(1).trim();

    // Helper: get evaluated numeric value of a cell
    const getCellValue = (ref: string): number => {
      if (visited.has(ref)) return 0; // circular ref
      const parsed = parseCellRef(ref);
      if (parsed) {
        const [r, c] = parsed;
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS) throw new Error("#REF!");
      }
      const raw = grid[ref] ?? "";
      if (raw === "") return 0;
      if (raw.startsWith("=")) {
        const nextVisited = new Set(visited);
        nextVisited.add(ref);
        const result = evaluateFormula(raw, grid, nextVisited);
        if (result.startsWith("#")) throw new Error(result);
        const n = Number.parseFloat(result);
        return Number.isNaN(n) ? 0 : n;
      }
      const n = Number.parseFloat(raw);
      if (Number.isNaN(n)) throw new Error("#VALUE!");
      return n;
    };

    const getCellRaw = (ref: string): string => {
      const raw = grid[ref] ?? "";
      if (raw.startsWith("=")) {
        return evaluateFormula(raw, grid, new Set(visited).add(ref));
      }
      return raw;
    };

    // Helper: get all numeric values in a range
    const getRangeValues = (start: string, end: string): number[] => {
      const s = parseCellRef(start);
      const e = parseCellRef(end);
      if (!s || !e) throw new Error("#REF!");
      const values: number[] = [];
      for (let r = s[0]; r <= e[0]; r++) {
        for (let c = s[1]; c <= e[1]; c++) {
          const raw = grid[cellKey(r, c)] ?? "";
          if (raw === "") {
            values.push(0);
            continue;
          }
          if (raw.startsWith("=")) {
            const res = evaluateFormula(raw, grid, new Set(visited));
            const n = Number.parseFloat(res);
            values.push(Number.isNaN(n) ? 0 : n);
          } else {
            const n = Number.parseFloat(raw);
            values.push(Number.isNaN(n) ? 0 : n);
          }
        }
      }
      return values;
    };

    const getRangeCells = (start: string, end: string): string[] => {
      const s = parseCellRef(start);
      const e = parseCellRef(end);
      if (!s || !e) throw new Error("#REF!");
      const cells: string[] = [];
      for (let r = s[0]; r <= e[0]; r++) {
        for (let c = s[1]; c <= e[1]; c++) {
          cells.push(cellKey(r, c));
        }
      }
      return cells;
    };

    // ── SUM ──
    const sumMatch = expr.match(/^SUM\(([A-Z]+\d+):([A-Z]+\d+)\)$/);
    if (sumMatch) {
      const vals = getRangeValues(sumMatch[1], sumMatch[2]);
      return String(vals.reduce((a, b) => a + b, 0));
    }

    // ── AVERAGE / AVG ──
    const avgMatch = expr.match(/^(?:AVERAGE|AVG)\(([A-Z]+\d+):([A-Z]+\d+)\)$/);
    if (avgMatch) {
      const vals = getRangeValues(avgMatch[1], avgMatch[2]);
      if (vals.length === 0) return "0";
      return String(vals.reduce((a, b) => a + b, 0) / vals.length);
    }

    // ── MIN ──
    const minMatch = expr.match(/^MIN\(([A-Z]+\d+):([A-Z]+\d+)\)$/);
    if (minMatch) {
      const vals = getRangeValues(minMatch[1], minMatch[2]);
      if (vals.length === 0) return "0";
      return String(Math.min(...vals));
    }

    // ── MAX ──
    const maxMatch = expr.match(/^MAX\(([A-Z]+\d+):([A-Z]+\d+)\)$/);
    if (maxMatch) {
      const vals = getRangeValues(maxMatch[1], maxMatch[2]);
      if (vals.length === 0) return "0";
      return String(Math.max(...vals));
    }

    // ── COUNT ──
    const countMatch = expr.match(/^COUNT\(([A-Z]+\d+):([A-Z]+\d+)\)$/);
    if (countMatch) {
      const cells = getRangeCells(countMatch[1], countMatch[2]);
      let count = 0;
      for (const k of cells) {
        const raw = grid[k] ?? "";
        if (raw !== "" && !Number.isNaN(Number.parseFloat(raw))) count++;
      }
      return String(count);
    }

    // ── COUNTA ──
    const countaMatch = expr.match(/^COUNTA\(([A-Z]+\d+):([A-Z]+\d+)\)$/);
    if (countaMatch) {
      const cells = getRangeCells(countaMatch[1], countaMatch[2]);
      return String(cells.filter((k) => (grid[k] ?? "") !== "").length);
    }

    // ── PRODUCT ──
    const productMatch = expr.match(/^PRODUCT\(([A-Z]+\d+):([A-Z]+\d+)\)$/);
    if (productMatch) {
      const vals = getRangeValues(productMatch[1], productMatch[2]);
      if (vals.length === 0) return "0";
      return String(vals.reduce((a, b) => a * b, 1));
    }

    // ── SUMIF ──
    const sumifMatch = exprOrig.match(
      /^SUMIF\(([A-Z]+\d+):([A-Z]+\d+),\s*"?([^,"]+)"?,\s*([A-Z]+\d+):([A-Z]+\d+)\)$/i,
    );
    if (sumifMatch) {
      const critCells = getRangeCells(
        sumifMatch[1].toUpperCase(),
        sumifMatch[2].toUpperCase(),
      );
      const sumCells = getRangeCells(
        sumifMatch[4].toUpperCase(),
        sumifMatch[5].toUpperCase(),
      );
      const criterion = sumifMatch[3].trim();
      let total = 0;
      for (let i = 0; i < critCells.length; i++) {
        const raw = getCellRaw(critCells[i]);
        if (
          raw === criterion ||
          raw.toUpperCase() === criterion.toUpperCase()
        ) {
          total += getCellValue(sumCells[i] ?? critCells[i]);
        }
      }
      return String(total);
    }

    // ── COUNTIF ──
    const countifMatch = exprOrig.match(
      /^COUNTIF\(([A-Z]+\d+):([A-Z]+\d+),\s*"?([^,"]+)"?\)$/i,
    );
    if (countifMatch) {
      const cells = getRangeCells(
        countifMatch[1].toUpperCase(),
        countifMatch[2].toUpperCase(),
      );
      const criterion = countifMatch[3].trim();
      let count = 0;
      for (const k of cells) {
        const raw = getCellRaw(k);
        if (raw === criterion || raw.toUpperCase() === criterion.toUpperCase())
          count++;
      }
      return String(count);
    }

    // ── VLOOKUP ──
    const vlookupMatch = exprOrig.match(
      /^VLOOKUP\(([^,]+),\s*([A-Z]+\d+):([A-Z]+\d+),\s*(\d+)(?:,\s*(\d+))?\)$/i,
    );
    if (vlookupMatch) {
      const lookupVal = vlookupMatch[1].trim().toUpperCase();
      const rangeStart = parseCellRef(vlookupMatch[2].toUpperCase());
      const rangeEnd = parseCellRef(vlookupMatch[3].toUpperCase());
      const colIndex = Number.parseInt(vlookupMatch[4], 10) - 1;
      if (!rangeStart || !rangeEnd) return "#REF!";
      for (let r = rangeStart[0]; r <= rangeEnd[0]; r++) {
        const firstCell = cellKey(r, rangeStart[1]);
        const cellVal = getCellRaw(firstCell).toUpperCase();
        if (cellVal === lookupVal) {
          const targetKey = cellKey(r, rangeStart[1] + colIndex);
          return getCellRaw(targetKey);
        }
      }
      return "#N/A";
    }

    // ── ABS ──
    const absMatch = expr.match(/^ABS\((.+)\)$/);
    if (absMatch) {
      const inner = absMatch[1];
      const ref = parseCellRef(inner);
      const val = ref ? getCellValue(inner) : Number.parseFloat(inner);
      if (Number.isNaN(val)) return "#VALUE!";
      return String(Math.abs(val));
    }

    // ── ROUND ──
    const roundMatch = expr.match(/^ROUND\((.+),\s*(\d+)\)$/);
    if (roundMatch) {
      const inner = roundMatch[1];
      const digits = Number.parseInt(roundMatch[2], 10);
      const ref = parseCellRef(inner);
      const val = ref ? getCellValue(inner) : Number.parseFloat(inner);
      if (Number.isNaN(val)) return "#VALUE!";
      const factor = 10 ** digits;
      return String(Math.round(val * factor) / factor);
    }

    // ── IF ──
    const ifMatch = exprOrig.match(/^IF\((.+)\)$/i);
    if (ifMatch) {
      const args: string[] = [];
      let depth = 0;
      let current = "";
      for (const ch of ifMatch[1]) {
        if (ch === "(" || ch === "[") depth++;
        else if (ch === ")" || ch === "]") depth--;
        else if (ch === "," && depth === 0) {
          args.push(current.trim());
          current = "";
          continue;
        }
        current += ch;
      }
      if (current.trim()) args.push(current.trim());

      if (args.length === 3) {
        const condition = args[0].toUpperCase();
        const trueVal = args[1];
        const falseVal = args[2];

        const substituted = condition.replace(/[A-Z]+\d+/g, (ref) =>
          String(getCellValue(ref)),
        );
        let condResult = false;
        try {
          // biome-ignore lint/security/noGlobalEval: spreadsheet formula evaluation
          condResult = Boolean(eval(substituted));
        } catch {}

        const resolveArg = (arg: string): string => {
          const stripped = arg.replace(/^"|"$/g, "");
          const cRef = parseCellRef(arg.toUpperCase());
          if (cRef) return getCellRaw(arg.toUpperCase());
          return stripped;
        };

        return condResult ? resolveArg(trueVal) : resolveArg(falseVal);
      }
    }

    // ── CONCAT ──
    const concatMatch = expr.match(/^CONCAT\((.+)\)$/);
    if (concatMatch) {
      const inner = concatMatch[1];
      const rangeM = inner.match(/^([A-Z]+\d+):([A-Z]+\d+)$/);
      if (rangeM) {
        const cells = getRangeCells(rangeM[1], rangeM[2]);
        return cells.map((k) => getCellRaw(k)).join("");
      }
      const refs = inner.split(",").map((r) => r.trim());
      return refs
        .map((r) => {
          const cRef = parseCellRef(r);
          return cRef ? getCellRaw(r) : r.replace(/^"|"$/g, "");
        })
        .join("");
    }

    // ── TODAY ──
    if (expr === "TODAY()") {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }

    // ── LEN ──
    const lenMatch = expr.match(/^LEN\(([A-Z]+\d+)\)$/);
    if (lenMatch) {
      return String(getCellRaw(lenMatch[1]).length);
    }

    // ── UPPER ──
    const upperMatch = expr.match(/^UPPER\(([A-Z]+\d+)\)$/);
    if (upperMatch) {
      return getCellRaw(upperMatch[1]).toUpperCase();
    }

    // ── LOWER ──
    const lowerMatch = expr.match(/^LOWER\(([A-Z]+\d+)\)$/);
    if (lowerMatch) {
      return getCellRaw(lowerMatch[1]).toLowerCase();
    }

    // ── TRIM ──
    const trimMatch = expr.match(/^TRIM\(([A-Z]+\d+)\)$/);
    if (trimMatch) {
      return getCellRaw(trimMatch[1]).trim();
    }

    // ── General arithmetic ──
    const exprUpper = exprOrig.toUpperCase();
    const substituted = exprUpper.replace(/[A-Z]+\d+/g, (ref) =>
      String(getCellValue(ref)),
    );

    if (/^[\d+\-*/.()\ ]+$/.test(substituted)) {
      try {
        // biome-ignore lint/security/noGlobalEval: spreadsheet formula evaluation
        const result = eval(substituted);
        if (typeof result === "number" && !Number.isNaN(result)) {
          if (!Number.isFinite(result)) return "#DIV/0!";
          return String(Number.parseFloat(result.toPrecision(10)));
        }
        return "#VALUE!";
      } catch {
        return "#VALUE!";
      }
    }

    // No recognized function matched
    return "#NAME?";
  } catch (err) {
    // Propagate specific error codes
    if (err instanceof Error && err.message.startsWith("#")) {
      return err.message;
    }
    return "#ERR";
  }
}

function displayValue(key: string, grid: Record<string, string>): string {
  const raw = grid[key] ?? "";
  if (raw.startsWith("=")) return evaluateFormula(raw, grid);
  return raw;
}

const COL_LABELS = Array.from({ length: COLS }, (_, i) => colLabel(i));
const ROW_NUMBERS = Array.from({ length: ROWS }, (_, i) => i + 1);

interface SpreadsheetData {
  grid: Record<string, string>;
  formatting: Record<string, CellFormat>;
}

function SpreadsheetChart({
  grid,
  col,
  chartType,
  rows,
  canvasRef,
}: {
  grid: Record<string, string>;
  col: string;
  chartType: "bar" | "line";
  rows: number;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  const data: { label: string; value: number }[] = [];
  for (let r = 0; r < rows; r++) {
    const key = `${col}${r + 1}`;
    const raw = grid[key] ?? "";
    const n = Number.parseFloat(raw);
    if (!Number.isNaN(n)) data.push({ label: String(r + 1), value: n });
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const PAD = { top: 24, right: 16, bottom: 32, left: 40 };
    const chartW = W - PAD.left - PAD.right;
    const chartH = H - PAD.top - PAD.bottom;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "#1c1c1e";
    ctx.fillRect(0, 0, W, H);

    if (data.length === 0) {
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`No numeric data in column ${col}`, W / 2, H / 2);
      return;
    }

    const maxVal = Math.max(...data.map((d) => d.value), 0);
    const minVal = Math.min(...data.map((d) => d.value), 0);
    const range = maxVal - minVal || 1;

    const toY = (v: number) =>
      PAD.top + chartH - ((v - minVal) / range) * chartH;

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = PAD.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(PAD.left + chartW, y);
      ctx.stroke();
      const label = (maxVal - (range / 4) * i).toFixed(1);
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.font = "9px monospace";
      ctx.textAlign = "right";
      ctx.fillText(label, PAD.left - 4, y + 3);
    }

    // Axes
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD.left, PAD.top);
    ctx.lineTo(PAD.left, PAD.top + chartH);
    ctx.lineTo(PAD.left + chartW, PAD.top + chartH);
    ctx.stroke();

    const ACCENT = "rgba(99,102,241,0.8)";
    const barW = Math.max(4, Math.floor(chartW / data.length) - 4);
    const step = chartW / data.length;

    if (chartType === "bar") {
      data.forEach((d, i) => {
        const x = PAD.left + step * i + step / 2 - barW / 2;
        const y = toY(d.value);
        const barH = toY(minVal) - y;
        ctx.fillStyle = ACCENT;
        ctx.beginPath();
        ctx.roundRect?.(x, y, barW, Math.max(barH, 1), [2, 2, 0, 0]);
        ctx.fill();
        // x label
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.font = "9px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(d.label, x + barW / 2, PAD.top + chartH + 14);
      });
    } else {
      ctx.strokeStyle = ACCENT;
      ctx.lineWidth = 2;
      ctx.beginPath();
      data.forEach((d, i) => {
        const x = PAD.left + step * i + step / 2;
        const y = toY(d.value);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      // Dots
      data.forEach((d, i) => {
        const x = PAD.left + step * i + step / 2;
        const y = toY(d.value);
        ctx.fillStyle = ACCENT;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        // x label
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.font = "9px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(d.label, x, PAD.top + chartH + 14);
      });
    }
  });

  return (
    <canvas
      ref={canvasRef}
      width={460}
      height={280}
      style={{ borderRadius: 8, border: "1px solid var(--os-border-subtle)" }}
    />
  );
}

export function Spreadsheet() {
  const { data: ssData, set: setSsData } = useCanisterKV<SpreadsheetData>(
    "decentos_spreadsheet",
    { grid: {}, formatting: {} },
  );

  const grid = ssData.grid;

  // ── Local formatting state for immediate UI feedback (debounced canister write) ──
  const pendingFmtRef = useRef<Record<string, CellFormat>>({});
  const [localFmt, setLocalFmt] = useState<Record<string, CellFormat>>({});
  const fmtTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fmtSyncedRef = useRef(false);

  // Sync from canister on first load
  useEffect(() => {
    if (!fmtSyncedRef.current && Object.keys(ssData.formatting).length > 0) {
      fmtSyncedRef.current = true;
      pendingFmtRef.current = ssData.formatting;
      setLocalFmt(ssData.formatting);
    }
  }, [ssData.formatting]);

  const formatting = localFmt;

  const [activeCell, setActiveCell] = useState<[number, number] | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editing, setEditing] = useState(false);
  const [fileName, setFileName] = useState("sheet1.json");
  const [freezeFirstRow, setFreezeFirstRow] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const [chartCol, setChartCol] = useState("A");
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);

  // Refs for both inputs to avoid stale closures
  const inputRef = useRef<HTMLInputElement>(null); // cell grid input
  const formulaBarRef = useRef<HTMLInputElement>(null); // formula bar input

  // 1-step undo
  const undoHistory = useRef<Record<string, string>>({});

  const activeCellKey = activeCell
    ? cellKey(activeCell[0], activeCell[1])
    : null;
  const activeFmt = activeCellKey ? (formatting[activeCellKey] ?? {}) : {};

  // Always-current ref for ssData to avoid stale closures in callbacks
  const ssDataRef = useRef(ssData);
  ssDataRef.current = ssData;

  // ── Memoized display values — only recomputes when grid changes ──
  const displayValues = useMemo(() => {
    const vals: Record<string, string> = {};
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const key = cellKey(r, c);
        if (ssData.grid[key]) {
          vals[key] = displayValue(key, ssData.grid);
        }
      }
    }
    return vals;
  }, [ssData.grid]);

  // ── Formatters ──
  const setFormatting = useCallback(
    (f: Record<string, CellFormat>) => {
      setSsData({ ...ssDataRef.current, formatting: f });
    },
    [setSsData],
  );

  const setGrid = useCallback(
    (g: Record<string, string>) => {
      setSsData({ ...ssDataRef.current, grid: g });
    },
    [setSsData],
  );

  // ── updateFmt — immediate local update, debounced canister write ──
  const updateFmt = useCallback(
    (key: string, patch: Partial<CellFormat>) => {
      setLocalFmt((prev) => {
        const next = { ...prev, [key]: { ...prev[key], ...patch } };
        pendingFmtRef.current = next;

        if (fmtTimerRef.current) clearTimeout(fmtTimerRef.current);
        fmtTimerRef.current = setTimeout(() => {
          setSsData({
            ...ssDataRef.current,
            formatting: pendingFmtRef.current,
          });
        }, 500);

        return next;
      });
    },
    [setSsData],
  );

  const clearFmt = useCallback(
    (key: string) => {
      setLocalFmt((prev) => {
        const next = { ...prev };
        delete next[key];
        pendingFmtRef.current = next;

        if (fmtTimerRef.current) clearTimeout(fmtTimerRef.current);
        fmtTimerRef.current = setTimeout(() => {
          setSsData({
            ...ssDataRef.current,
            formatting: pendingFmtRef.current,
          });
        }, 500);

        return next;
      });
    },
    [setSsData],
  );

  // ── commitEdit — always read live input value via ref ──
  const commitEdit = useCallback(
    (row: number, col: number, value: string) => {
      const key = cellKey(row, col);
      const currentGrid = ssDataRef.current.grid;
      undoHistory.current[key] = currentGrid[key] ?? "";
      const newGrid = (() => {
        if (value === "") {
          const n = { ...currentGrid };
          delete n[key];
          return n;
        }
        return { ...currentGrid, [key]: value };
      })();
      setGrid(newGrid);
      setEditing(false);
    },
    [setGrid],
  );

  const startEdit = useCallback((row: number, col: number) => {
    setActiveCell([row, col]);
    setEditValue(ssDataRef.current.grid[cellKey(row, col)] ?? "");
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 10);
  }, []);

  // ── handleCellClick — use inputRef for live value from cell input ──
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (editing && activeCell) {
        commitEdit(
          activeCell[0],
          activeCell[1],
          inputRef.current?.value ?? editValue,
        );
      }
      setActiveCell([row, col]);
      setEditValue(ssDataRef.current.grid[cellKey(row, col)] ?? "");
      setEditing(true);
      setTimeout(() => inputRef.current?.focus(), 10);
    },
    [editing, activeCell, commitEdit, editValue],
  );

  const handleCellDoubleClick = useCallback(
    (row: number, col: number) => startEdit(row, col),
    [startEdit],
  );

  // ── handleKeyDown — for CELL INPUT in the grid ──
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!activeCell) return;
      const [row, col] = activeCell;
      // Always read from the real DOM input to avoid stale state
      const currentValue = inputRef.current?.value ?? editValue;

      if (e.key === "Enter") {
        e.preventDefault();
        commitEdit(row, col, currentValue);
        const nextRow = Math.min(row + 1, ROWS - 1);
        setActiveCell([nextRow, col]);
        setEditValue(ssDataRef.current.grid[cellKey(nextRow, col)] ?? "");
        setEditing(false);
      } else if (e.key === "Tab") {
        e.preventDefault();
        commitEdit(row, col, currentValue);
        const nextCol = e.shiftKey
          ? Math.max(col - 1, 0)
          : Math.min(col + 1, COLS - 1);
        setActiveCell([row, nextCol]);
        setEditValue(ssDataRef.current.grid[cellKey(row, nextCol)] ?? "");
        setEditing(false);
      } else if (e.key === "Escape") {
        setEditing(false);
        setEditValue(ssDataRef.current.grid[cellKey(row, col)] ?? "");
      }
    },
    [activeCell, commitEdit, editValue],
  );

  // ── handleFormulaBarKeyDown — separate handler for the formula bar ──
  // Uses formulaBarRef.current?.value to get live input DOM value
  const handleFormulaBarKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!activeCell) return;
      const [row, col] = activeCell;
      // Read directly from the formula bar DOM element
      const currentValue = formulaBarRef.current?.value ?? editValue;

      if (e.key === "Enter") {
        e.preventDefault();
        commitEdit(row, col, currentValue);
        const nextRow = Math.min(row + 1, ROWS - 1);
        setActiveCell([nextRow, col]);
        setEditValue(ssDataRef.current.grid[cellKey(nextRow, col)] ?? "");
        setEditing(false);
      } else if (e.key === "Tab") {
        e.preventDefault();
        commitEdit(row, col, currentValue);
        const nextCol = e.shiftKey
          ? Math.max(col - 1, 0)
          : Math.min(col + 1, COLS - 1);
        setActiveCell([row, nextCol]);
        setEditValue(ssDataRef.current.grid[cellKey(row, nextCol)] ?? "");
        setEditing(false);
      } else if (e.key === "Escape") {
        setEditing(false);
        setEditValue(ssDataRef.current.grid[cellKey(row, col)] ?? "");
      }
    },
    [activeCell, commitEdit, editValue],
  );

  const handleFormulaChange = useCallback(
    (val: string) => {
      setEditValue(val);
      if (!editing) setEditing(true);
    },
    [editing],
  );

  const handleFormulaFocus = useCallback(() => {
    if (activeCell && !editing) {
      const key = cellKey(activeCell[0], activeCell[1]);
      setEditValue(ssDataRef.current.grid[key] ?? "");
      setEditing(true);
    }
  }, [activeCell, editing]);

  const { isFocused } = useWindowFocus();

  // ── Arrow key navigation when NOT editing ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isFocused) return;
      if (editing) return;
      if (!activeCell) return;
      const [row, col] = activeCell;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveCell([Math.min(row + 1, ROWS - 1), col]);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveCell([Math.max(row - 1, 0), col]);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveCell([row, Math.min(col + 1, COLS - 1)]);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveCell([row, Math.max(col - 1, 0)]);
      } else if (e.key === "Enter") {
        e.preventDefault();
        startEdit(row, col);
      } else if ((e.key === "d" || e.key === "D") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (row > 0) {
          const currentGrid = ssDataRef.current.grid;
          const sourceKey = cellKey(row - 1, col);
          const sourceVal = currentGrid[sourceKey] ?? "";
          const key = cellKey(row, col);
          const next = { ...currentGrid, [key]: sourceVal };
          setGrid(next);
        }
      } else if (e.key === "Delete" || e.key === "Backspace") {
        const currentGrid = ssDataRef.current.grid;
        const key = cellKey(row, col);
        const next = { ...currentGrid };
        delete next[key];
        setGrid(next);
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        startEdit(row, col);
        setEditValue(e.key);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFocused, editing, activeCell, startEdit, setGrid]);

  const handleSave = () => {
    const json = JSON.stringify({ fileName, grid, formatting }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Saved ${fileName}`);
  };

  const handleLoad = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target?.result as string);
          if (parsed.grid) {
            setGrid(parsed.grid);
            setFileName(parsed.fileName ?? file.name);
            if (parsed.formatting) {
              setFormatting(parsed.formatting);
            }
            toast.success("Spreadsheet loaded");
          }
        } catch {
          toast.error("Invalid file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const CELL_W = 80;
  const CELL_H = 26;
  const ROW_HEADER_W = 36;
  const [colWidths, setColWidths] = useState<number[]>(() =>
    Array(COLS).fill(CELL_W),
  );
  const resizeDragRef = useRef<{
    colIdx: number;
    startX: number;
    startW: number;
  } | null>(null);

  const handleColResizeMouseDown = (e: React.MouseEvent, colIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    resizeDragRef.current = {
      colIdx,
      startX: e.clientX,
      startW: colWidths[colIdx],
    };
    const onMouseMove = (ev: MouseEvent) => {
      if (!resizeDragRef.current) return;
      const delta = ev.clientX - resizeDragRef.current.startX;
      const newW = Math.max(40, resizeDragRef.current.startW + delta);
      setColWidths((prev) => {
        const next = [...prev];
        next[resizeDragRef.current!.colIdx] = newW;
        return next;
      });
    };
    const onMouseUp = () => {
      resizeDragRef.current = null;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const btnBase: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 22,
    borderRadius: 4,
    cursor: "pointer",
    border: "1px solid transparent",
    background: "transparent",
    transition: "background 0.1s",
  };

  const fmtBtn = (active: boolean): React.CSSProperties => ({
    ...btnBase,
    background: active ? "rgba(99,102,241,0.2)" : "transparent",
    border: active ? "1px solid rgba(99,102,241,0.4)" : "1px solid transparent",
    color: active ? "rgba(99,102,241,1)" : "var(--os-text-secondary)",
  });

  // ── Error type helpers ──
  const ERROR_CODES = new Set([
    "#DIV/0!",
    "#VALUE!",
    "#NAME?",
    "#REF!",
    "#N/A",
    "#ERR",
  ]);
  const isErrorValue = (v: string) => ERROR_CODES.has(v) || v.startsWith("#");

  const errorTitle = (v: string) => {
    if (v === "#DIV/0!") return "Division by zero";
    if (v === "#VALUE!") return "Invalid value or non-numeric operand";
    if (v === "#NAME?") return "Unknown function or name";
    if (v === "#REF!") return "Cell reference out of range";
    if (v === "#N/A") return "Value not found";
    return "Formula error";
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "var(--os-bg-app)", userSelect: "none" }}
      data-ocid="spreadsheet.panel"
    >
      {/* Toolbar */}
      <div
        className="flex items-center gap-0.5 px-2 flex-shrink-0 flex-wrap"
        style={{
          height: 34,
          borderBottom: "1px solid rgba(99,102,241,0.15)",
          background: "var(--os-bg-elevated)",
        }}
      >
        <button
          type="button"
          onClick={() =>
            activeCellKey && updateFmt(activeCellKey, { bold: !activeFmt.bold })
          }
          style={fmtBtn(!!activeFmt.bold)}
          title="Bold (Ctrl+B)"
          data-ocid="spreadsheet.toggle"
        >
          <Bold className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={() =>
            activeCellKey &&
            updateFmt(activeCellKey, { italic: !activeFmt.italic })
          }
          style={fmtBtn(!!activeFmt.italic)}
          title="Italic (Ctrl+I)"
          data-ocid="spreadsheet.toggle"
        >
          <Italic className="w-3 h-3" />
        </button>

        <div
          style={{
            width: 1,
            height: 14,
            background: "var(--os-text-muted)",
            margin: "0 2px",
          }}
        />

        <button
          type="button"
          onClick={() =>
            activeCellKey && updateFmt(activeCellKey, { align: "left" })
          }
          style={fmtBtn(activeFmt.align === "left")}
          title="Align Left"
          data-ocid="spreadsheet.toggle"
        >
          <AlignLeft className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={() =>
            activeCellKey && updateFmt(activeCellKey, { align: "center" })
          }
          style={fmtBtn(activeFmt.align === "center")}
          title="Align Center"
          data-ocid="spreadsheet.toggle"
        >
          <AlignCenter className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={() =>
            activeCellKey && updateFmt(activeCellKey, { align: "right" })
          }
          style={fmtBtn(activeFmt.align === "right")}
          title="Align Right"
          data-ocid="spreadsheet.toggle"
        >
          <AlignRight className="w-3 h-3" />
        </button>

        <div
          style={{
            width: 1,
            height: 14,
            background: "var(--os-text-muted)",
            margin: "0 2px",
          }}
        />

        <div className="flex items-center gap-1">
          <span style={{ color: "var(--os-text-secondary)", fontSize: 9 }}>
            A
          </span>
          <input
            type="color"
            value={activeFmt.textColor ?? "#e2e8f0"}
            onChange={(e) =>
              activeCellKey &&
              updateFmt(activeCellKey, { textColor: e.target.value })
            }
            title="Text color"
            className="w-5 h-5 rounded cursor-pointer"
            style={{
              padding: 0,
              border: "1px solid var(--os-border-window)",
              background: "transparent",
            }}
          />
        </div>
        <div className="flex items-center gap-1">
          <span style={{ color: "var(--os-text-secondary)", fontSize: 9 }}>
            bg
          </span>
          <input
            type="color"
            value={activeFmt.bgColor ?? "#000000"}
            onChange={(e) =>
              activeCellKey &&
              updateFmt(activeCellKey, { bgColor: e.target.value })
            }
            title="Cell background"
            className="w-5 h-5 rounded cursor-pointer"
            style={{
              padding: 0,
              border: "1px solid var(--os-border-window)",
              background: "transparent",
            }}
          />
        </div>

        <div
          style={{
            width: 1,
            height: 14,
            background: "var(--os-text-muted)",
            margin: "0 2px",
          }}
        />

        <button
          type="button"
          onClick={() => activeCellKey && clearFmt(activeCellKey)}
          style={btnBase}
          title="Clear format"
          data-ocid="spreadsheet.secondary_button"
        >
          <Eraser
            className="w-3 h-3"
            style={{ color: "var(--os-text-secondary)" }}
          />
        </button>

        <div
          style={{
            width: 1,
            height: 14,
            background: "var(--os-text-muted)",
            margin: "0 2px",
          }}
        />

        <button
          type="button"
          onClick={() => setFreezeFirstRow((v) => !v)}
          style={fmtBtn(freezeFirstRow)}
          title="Freeze first row"
          data-ocid="spreadsheet.toggle"
        >
          <span style={{ fontSize: 9, fontWeight: 700 }}>❄</span>
        </button>

        <div
          style={{
            width: 1,
            height: 14,
            background: "var(--os-text-muted)",
            margin: "0 2px",
          }}
        />
        <button
          type="button"
          onClick={() => setChartOpen(true)}
          data-ocid="spreadsheet.secondary_button"
          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors"
          style={{
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.2)",
            color: "var(--os-text-secondary)",
          }}
          title="Chart"
        >
          <BarChart2 className="w-3 h-3" />
          Chart
        </button>
      </div>

      {/* Formula Bar */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 border-b flex-shrink-0"
        style={{
          borderColor: "rgba(99,102,241,0.15)",
          background: "var(--os-bg-elevated)",
        }}
      >
        {/* Cell reference indicator */}
        <span
          className="text-[10px] font-mono w-10 text-center flex-shrink-0"
          style={{ color: "rgba(99,102,241,0.7)" }}
        >
          {activeCellKey ?? ""}
        </span>

        {/* Formula input */}
        <div
          className="flex-1 flex items-center"
          style={{
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: 4,
            background: "var(--os-border-subtle)",
          }}
        >
          <span
            className="px-2 font-mono text-[10px]"
            style={{ color: "rgba(99,102,241,0.5)" }}
          >
            ƒ
          </span>
          <input
            ref={formulaBarRef}
            value={
              editing
                ? editValue
                : activeCellKey
                  ? (grid[activeCellKey] ?? "")
                  : ""
            }
            onChange={(e) => handleFormulaChange(e.target.value)}
            onKeyDown={handleFormulaBarKeyDown}
            onFocus={handleFormulaFocus}
            onBlur={(e) => {
              if (activeCell && editing) {
                // Use the formula bar's own live value
                commitEdit(activeCell[0], activeCell[1], e.currentTarget.value);
              }
            }}
            data-ocid="spreadsheet.input"
            className="flex-1 bg-transparent outline-none text-xs font-mono text-foreground py-0.5 pr-2"
            placeholder="Value or =SUM(A1:A5)"
          />
        </div>

        <input
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="bg-transparent outline-none text-[10px] font-mono text-muted-foreground w-24"
          style={{ borderBottom: "1px solid var(--os-border-subtle)" }}
          placeholder="filename.json"
        />
        <button
          type="button"
          onClick={handleLoad}
          data-ocid="spreadsheet.upload_button"
          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors"
          style={{
            background: "var(--os-border-subtle)",
            border: "1px solid var(--os-text-muted)",
            color: "var(--os-text-secondary)",
          }}
        >
          <Upload className="w-3 h-3" />
          Load
        </button>
        <button
          type="button"
          onClick={handleSave}
          data-ocid="spreadsheet.save_button"
          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors"
          style={{
            background: "rgba(99,102,241,0.12)",
            border: "1px solid rgba(99,102,241,0.3)",
            color: "rgba(99,102,241,1)",
          }}
        >
          <Download className="w-3 h-3" />
          Save
        </button>
      </div>

      {/* Chart Modal */}
      {chartOpen && (
        <div
          className="absolute inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="flex flex-col rounded-xl overflow-hidden"
            style={{
              width: 520,
              maxHeight: "80vh",
              background: "var(--os-bg-app)",
              border: "1px solid var(--os-border-window)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
            }}
            data-ocid="spreadsheet.modal"
          >
            <div
              className="flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0"
              style={{
                borderColor: "var(--os-border-subtle)",
                background: "var(--os-bg-elevated)",
              }}
            >
              <span
                className="text-xs font-bold"
                style={{ color: "var(--os-text-primary)" }}
              >
                Chart
              </span>
              <button
                type="button"
                onClick={() => setChartOpen(false)}
                data-ocid="spreadsheet.close_button"
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-muted/30"
                style={{ color: "var(--os-text-muted)" }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div
              className="flex items-center gap-3 px-4 py-2 flex-shrink-0"
              style={{ borderBottom: "1px solid var(--os-border-subtle)" }}
            >
              <label
                className="flex items-center gap-1.5 text-[11px]"
                style={{ color: "var(--os-text-secondary)" }}
              >
                Column:
                <select
                  value={chartCol}
                  onChange={(e) => setChartCol(e.target.value)}
                  className="rounded px-1.5 py-0.5 text-[11px] outline-none"
                  style={{
                    background: "var(--os-bg-elevated)",
                    border: "1px solid var(--os-border-subtle)",
                    color: "var(--os-text-primary)",
                  }}
                >
                  {Array.from({ length: COLS }, (_, i) => colLabel(i)).map(
                    (c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ),
                  )}
                </select>
              </label>
              <div className="flex items-center gap-1">
                {(["bar", "line"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setChartType(t)}
                    className="px-2 py-0.5 rounded text-[11px] capitalize transition-colors"
                    style={{
                      background:
                        chartType === t
                          ? "rgba(99,102,241,0.2)"
                          : "var(--os-bg-elevated)",
                      border:
                        chartType === t
                          ? "1px solid rgba(99,102,241,0.4)"
                          : "1px solid var(--os-border-subtle)",
                      color:
                        chartType === t
                          ? "rgba(99,102,241,1)"
                          : "var(--os-text-secondary)",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  const canvas = chartCanvasRef.current;
                  if (!canvas) return;
                  const url = canvas.toDataURL("image/png");
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "chart.png";
                  a.click();
                }}
                data-ocid="spreadsheet.save_button"
                className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded text-[11px]"
                style={{
                  background: "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: "rgba(99,102,241,1)",
                }}
              >
                <Download className="w-3 h-3" /> Export PNG
              </button>
            </div>
            <div className="flex items-center justify-center p-4">
              <SpreadsheetChart
                grid={grid}
                col={chartCol}
                chartType={chartType}
                rows={ROWS}
                canvasRef={chartCanvasRef}
              />
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="flex-1 overflow-auto">
        <table
          className="border-collapse"
          style={{ tableLayout: "fixed" }}
          data-ocid="spreadsheet.table"
        >
          <thead>
            <tr>
              <th
                style={{
                  width: ROW_HEADER_W,
                  minWidth: ROW_HEADER_W,
                  height: CELL_H,
                  background: freezeFirstRow
                    ? "rgba(25,50,60,0.95)"
                    : "var(--os-bg-sidebar)",
                  borderRight: "1px solid rgba(99,102,241,0.15)",
                  borderBottom: freezeFirstRow
                    ? "2px solid rgba(99,102,241,0.4)"
                    : "1px solid rgba(99,102,241,0.15)",
                  position: "sticky",
                  top: 0,
                  left: 0,
                  zIndex: 3,
                }}
              />
              {COL_LABELS.map((_label, c) => (
                <th
                  key={_label}
                  style={{
                    width: colWidths[c],
                    minWidth: colWidths[c],
                    height: CELL_H,
                    background: "var(--os-bg-sidebar)",
                    borderRight: "1px solid rgba(99,102,241,0.1)",
                    borderBottom: "1px solid rgba(99,102,241,0.15)",
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                    color:
                      activeCell && activeCell[1] === c
                        ? "rgba(99,102,241,1)"
                        : "var(--os-text-secondary)",
                    fontWeight: 600,
                    fontSize: 10,
                    textAlign: "center",
                    letterSpacing: 1,
                    userSelect: "none",
                    overflow: "visible",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    {_label}
                    <div
                      onMouseDown={(e) => handleColResizeMouseDown(e, c)}
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        width: 4,
                        height: "100%",
                        cursor: "col-resize",
                        background: "transparent",
                        zIndex: 1,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.background =
                          "rgba(99,102,241,0.4)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.background =
                          "transparent";
                      }}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROW_NUMBERS.map((rowNum) => {
              const r = rowNum - 1;
              return (
                <tr key={String(rowNum)}>
                  <td
                    style={{
                      width: ROW_HEADER_W,
                      minWidth: ROW_HEADER_W,
                      height: CELL_H,
                      background: "var(--os-bg-sidebar)",
                      borderRight: "1px solid rgba(99,102,241,0.15)",
                      borderBottom: "1px solid rgba(99,102,241,0.07)",
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      color:
                        activeCell && activeCell[0] === r
                          ? "rgba(99,102,241,1)"
                          : "var(--os-text-muted)",
                      fontWeight: 600,
                      fontSize: 10,
                      textAlign: "center",
                    }}
                  >
                    {rowNum}
                  </td>
                  {COL_LABELS.map((_label, c) => {
                    const key = cellKey(r, c);
                    const isActive =
                      activeCell?.[0] === r && activeCell?.[1] === c;
                    const isEditingCell = isActive && editing;
                    const fmt = formatting[key] ?? {};
                    const cellVal = displayValues[key] ?? "";
                    const isErr = isErrorValue(cellVal);

                    return (
                      <td
                        key={key}
                        onClick={() => handleCellClick(r, c)}
                        onDoubleClick={() => handleCellDoubleClick(r, c)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ")
                            handleCellDoubleClick(r, c);
                        }}
                        data-ocid={`spreadsheet.row.${rowNum}`}
                        style={{
                          width: colWidths[c],
                          minWidth: colWidths[c],
                          height: CELL_H,
                          borderRight: "1px solid rgba(99,102,241,0.07)",
                          borderBottom: "1px solid rgba(99,102,241,0.07)",
                          background: isActive
                            ? "rgba(99,102,241,0.15)"
                            : (fmt.bgColor ?? "transparent"),
                          outline: isActive
                            ? "2px solid rgba(99,102,241,0.7)"
                            : "none",
                          outlineOffset: -1,
                          padding: 0,
                          cursor: "cell",
                          position: "relative",
                        }}
                      >
                        {isEditingCell ? (
                          <input
                            ref={inputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={(e) =>
                              commitEdit(r, c, e.currentTarget.value)
                            }
                            data-ocid="spreadsheet.editor"
                            style={{
                              width: "100%",
                              height: "100%",
                              background: "rgba(99,102,241,0.08)",
                              border: "none",
                              outline: "none",
                              padding: "0 4px",
                              fontFamily: "monospace",
                              fontSize: 11,
                              fontWeight: fmt.bold ? "bold" : "normal",
                              fontStyle: fmt.italic ? "italic" : "normal",
                              textAlign: fmt.align ?? "left",
                              color: fmt.textColor ?? "rgba(99,102,241,1)",
                              caretColor: "rgba(99,102,241,0.9)",
                            }}
                          />
                        ) : (
                          <span
                            title={isErr ? errorTitle(cellVal) : undefined}
                            style={{
                              display: "block",
                              padding: "0 4px",
                              fontFamily: "monospace",
                              fontSize: 11,
                              fontWeight: fmt.bold ? "bold" : "normal",
                              fontStyle: fmt.italic ? "italic" : "normal",
                              textAlign: fmt.align ?? "left",
                              background: isErr
                                ? "rgba(239,68,68,0.18)"
                                : undefined,
                              color: isErr
                                ? "#EF4444"
                                : isActive
                                  ? "rgba(99,102,241,1)"
                                  : (fmt.textColor ??
                                    "var(--os-text-secondary)"),
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {cellVal}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Status bar */}
      <div
        className="flex items-center gap-4 px-3 flex-shrink-0"
        style={{
          height: 24,
          borderTop: "1px solid rgba(99,102,241,0.1)",
          background: "var(--os-bg-app)",
          fontSize: 10,
          color: "var(--os-text-muted)",
          fontFamily: "monospace",
        }}
      >
        {activeCell ? (
          <>
            <span style={{ color: "rgba(99,102,241,0.7)" }}>
              {activeCellKey}
            </span>
            <span>
              {activeCellKey && displayValues[activeCellKey]
                ? displayValues[activeCellKey]
                : "\u2014"}
            </span>
            {/* Show raw formula if cell has one */}
            {activeCellKey && grid[activeCellKey]?.startsWith("=") && (
              <span style={{ color: "var(--os-text-muted)" }}>
                {grid[activeCellKey]}
              </span>
            )}
          </>
        ) : (
          <span style={{ color: "var(--os-text-muted)" }}>
            No cell selected
          </span>
        )}
        <span className="ml-auto" style={{ color: "var(--os-text-muted)" }}>
          {ROWS}×{COLS}
        </span>
      </div>
    </div>
  );
}
