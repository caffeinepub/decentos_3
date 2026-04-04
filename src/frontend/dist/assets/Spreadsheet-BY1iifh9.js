import { c as createLucideIcon, r as reactExports, h as useWindowFocus, j as jsxRuntimeExports, X, g as ue } from "./index-8tMpYjTW.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { B as Bold, I as Italic } from "./italic-H3QB-IXR.js";
import { A as AlignLeft } from "./align-left-lTx1FGaW.js";
import { A as AlignCenter, a as AlignRight, C as ChartNoAxesColumn } from "./chart-no-axes-column-BdDAiPie.js";
import { U as Upload } from "./upload-CPulOAno.js";
import { D as Download } from "./download-BCO-vDCJ.js";
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
      d: "m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21",
      key: "182aya"
    }
  ],
  ["path", { d: "M22 21H7", key: "t4ddhn" }],
  ["path", { d: "m5 11 9 9", key: "1mo9qw" }]
];
const Eraser = createLucideIcon("eraser", __iconNode);
const ROWS = 20;
const COLS = 10;
function colLabel(col) {
  let label = "";
  let c = col;
  while (c >= 0) {
    label = String.fromCharCode(65 + c % 26) + label;
    c = Math.floor(c / 26) - 1;
  }
  return label;
}
function cellKey(row, col) {
  return `${colLabel(col)}${row + 1}`;
}
function parseCellRef(ref) {
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
function evaluateFormula(formula, grid, visited = /* @__PURE__ */ new Set()) {
  try {
    const expr = formula.slice(1).trim().toUpperCase();
    const exprOrig = formula.slice(1).trim();
    const getCellValue = (ref) => {
      if (visited.has(ref)) return 0;
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
        const result2 = evaluateFormula(raw, grid, nextVisited);
        if (result2.startsWith("#")) throw new Error(result2);
        const n2 = Number.parseFloat(result2);
        return Number.isNaN(n2) ? 0 : n2;
      }
      const n = Number.parseFloat(raw);
      if (Number.isNaN(n)) throw new Error("#VALUE!");
      return n;
    };
    const getCellRaw = (ref) => {
      const raw = grid[ref] ?? "";
      if (raw.startsWith("=")) {
        return evaluateFormula(raw, grid, new Set(visited).add(ref));
      }
      return raw;
    };
    const getRangeValues = (start, end) => {
      const s = parseCellRef(start);
      const e = parseCellRef(end);
      if (!s || !e) throw new Error("#REF!");
      const values = [];
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
    const getRangeCells = (start, end) => {
      const s = parseCellRef(start);
      const e = parseCellRef(end);
      if (!s || !e) throw new Error("#REF!");
      const cells = [];
      for (let r = s[0]; r <= e[0]; r++) {
        for (let c = s[1]; c <= e[1]; c++) {
          cells.push(cellKey(r, c));
        }
      }
      return cells;
    };
    const sumMatch = expr.match(/^SUM\(([A-Z]+\d+):([A-Z]+\d+)\)$/);
    if (sumMatch) {
      const vals = getRangeValues(sumMatch[1], sumMatch[2]);
      return String(vals.reduce((a, b) => a + b, 0));
    }
    const avgMatch = expr.match(/^(?:AVERAGE|AVG)\(([A-Z]+\d+):([A-Z]+\d+)\)$/);
    if (avgMatch) {
      const vals = getRangeValues(avgMatch[1], avgMatch[2]);
      if (vals.length === 0) return "0";
      return String(vals.reduce((a, b) => a + b, 0) / vals.length);
    }
    const minMatch = expr.match(/^MIN\(([A-Z]+\d+):([A-Z]+\d+)\)$/);
    if (minMatch) {
      const vals = getRangeValues(minMatch[1], minMatch[2]);
      if (vals.length === 0) return "0";
      return String(Math.min(...vals));
    }
    const maxMatch = expr.match(/^MAX\(([A-Z]+\d+):([A-Z]+\d+)\)$/);
    if (maxMatch) {
      const vals = getRangeValues(maxMatch[1], maxMatch[2]);
      if (vals.length === 0) return "0";
      return String(Math.max(...vals));
    }
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
    const countaMatch = expr.match(/^COUNTA\(([A-Z]+\d+):([A-Z]+\d+)\)$/);
    if (countaMatch) {
      const cells = getRangeCells(countaMatch[1], countaMatch[2]);
      return String(cells.filter((k) => (grid[k] ?? "") !== "").length);
    }
    const productMatch = expr.match(/^PRODUCT\(([A-Z]+\d+):([A-Z]+\d+)\)$/);
    if (productMatch) {
      const vals = getRangeValues(productMatch[1], productMatch[2]);
      if (vals.length === 0) return "0";
      return String(vals.reduce((a, b) => a * b, 1));
    }
    const sumifMatch = exprOrig.match(
      /^SUMIF\(([A-Z]+\d+):([A-Z]+\d+),\s*"?([^,"]+)"?,\s*([A-Z]+\d+):([A-Z]+\d+)\)$/i
    );
    if (sumifMatch) {
      const critCells = getRangeCells(
        sumifMatch[1].toUpperCase(),
        sumifMatch[2].toUpperCase()
      );
      const sumCells = getRangeCells(
        sumifMatch[4].toUpperCase(),
        sumifMatch[5].toUpperCase()
      );
      const criterion = sumifMatch[3].trim();
      let total = 0;
      for (let i = 0; i < critCells.length; i++) {
        const raw = getCellRaw(critCells[i]);
        if (raw === criterion || raw.toUpperCase() === criterion.toUpperCase()) {
          total += getCellValue(sumCells[i] ?? critCells[i]);
        }
      }
      return String(total);
    }
    const countifMatch = exprOrig.match(
      /^COUNTIF\(([A-Z]+\d+):([A-Z]+\d+),\s*"?([^,"]+)"?\)$/i
    );
    if (countifMatch) {
      const cells = getRangeCells(
        countifMatch[1].toUpperCase(),
        countifMatch[2].toUpperCase()
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
    const vlookupMatch = exprOrig.match(
      /^VLOOKUP\(([^,]+),\s*([A-Z]+\d+):([A-Z]+\d+),\s*(\d+)(?:,\s*(\d+))?\)$/i
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
    const absMatch = expr.match(/^ABS\((.+)\)$/);
    if (absMatch) {
      const inner = absMatch[1];
      const ref = parseCellRef(inner);
      const val = ref ? getCellValue(inner) : Number.parseFloat(inner);
      if (Number.isNaN(val)) return "#VALUE!";
      return String(Math.abs(val));
    }
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
    const ifMatch = exprOrig.match(/^IF\((.+)\)$/i);
    if (ifMatch) {
      const args = [];
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
        const substituted = condition.replace(
          /[A-Z]+\d+/g,
          (ref) => String(getCellValue(ref))
        );
        let condResult = false;
        try {
          condResult = Boolean(eval(substituted));
        } catch {
        }
        const resolveArg = (arg) => {
          const stripped = arg.replace(/^"|"$/g, "");
          const cRef = parseCellRef(arg.toUpperCase());
          if (cRef) return getCellRaw(arg.toUpperCase());
          return stripped;
        };
        return condResult ? resolveArg(trueVal) : resolveArg(falseVal);
      }
    }
    const concatMatch = expr.match(/^CONCAT\((.+)\)$/);
    if (concatMatch) {
      const inner = concatMatch[1];
      const rangeM = inner.match(/^([A-Z]+\d+):([A-Z]+\d+)$/);
      if (rangeM) {
        const cells = getRangeCells(rangeM[1], rangeM[2]);
        return cells.map((k) => getCellRaw(k)).join("");
      }
      const refs = inner.split(",").map((r) => r.trim());
      return refs.map((r) => {
        const cRef = parseCellRef(r);
        return cRef ? getCellRaw(r) : r.replace(/^"|"$/g, "");
      }).join("");
    }
    if (expr === "TODAY()") {
      const now = /* @__PURE__ */ new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
    const lenMatch = expr.match(/^LEN\(([A-Z]+\d+)\)$/);
    if (lenMatch) {
      return String(getCellRaw(lenMatch[1]).length);
    }
    const upperMatch = expr.match(/^UPPER\(([A-Z]+\d+)\)$/);
    if (upperMatch) {
      return getCellRaw(upperMatch[1]).toUpperCase();
    }
    const lowerMatch = expr.match(/^LOWER\(([A-Z]+\d+)\)$/);
    if (lowerMatch) {
      return getCellRaw(lowerMatch[1]).toLowerCase();
    }
    const trimMatch = expr.match(/^TRIM\(([A-Z]+\d+)\)$/);
    if (trimMatch) {
      return getCellRaw(trimMatch[1]).trim();
    }
    const exprUpper = exprOrig.toUpperCase();
    const substituted = exprUpper.replace(
      /[A-Z]+\d+/g,
      (ref) => String(getCellValue(ref))
    );
    if (/^[\d+\-*/.()\ ]+$/.test(substituted)) {
      try {
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
    return "#NAME?";
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("#")) {
      return err.message;
    }
    return "#ERR";
  }
}
function displayValue(key, grid2) {
  const raw = grid2[key] ?? "";
  if (raw.startsWith("=")) return evaluateFormula(raw, grid2);
  return raw;
}
const COL_LABELS = Array.from({ length: COLS }, (_, i) => colLabel(i));
const ROW_NUMBERS = Array.from({ length: ROWS }, (_, i) => i + 1);
function SpreadsheetChart({
  grid: grid2,
  col,
  chartType,
  rows,
  canvasRef
}) {
  const data = [];
  for (let r = 0; r < rows; r++) {
    const key = `${col}${r + 1}`;
    const raw = grid2[key] ?? "";
    const n = Number.parseFloat(raw);
    if (!Number.isNaN(n)) data.push({ label: String(r + 1), value: n });
  }
  reactExports.useEffect(() => {
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
    const toY = (v) => PAD.top + chartH - (v - minVal) / range * chartH;
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = PAD.top + chartH / 4 * i;
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(PAD.left + chartW, y);
      ctx.stroke();
      const label = (maxVal - range / 4 * i).toFixed(1);
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.font = "9px monospace";
      ctx.textAlign = "right";
      ctx.fillText(label, PAD.left - 4, y + 3);
    }
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
        var _a;
        const x = PAD.left + step * i + step / 2 - barW / 2;
        const y = toY(d.value);
        const barH = toY(minVal) - y;
        ctx.fillStyle = ACCENT;
        ctx.beginPath();
        (_a = ctx.roundRect) == null ? void 0 : _a.call(ctx, x, y, barW, Math.max(barH, 1), [2, 2, 0, 0]);
        ctx.fill();
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
      data.forEach((d, i) => {
        const x = PAD.left + step * i + step / 2;
        const y = toY(d.value);
        ctx.fillStyle = ACCENT;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.font = "9px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(d.label, x, PAD.top + chartH + 14);
      });
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      width: 460,
      height: 280,
      style: { borderRadius: 8, border: "1px solid var(--os-border-subtle)" }
    }
  );
}
function Spreadsheet() {
  var _a;
  const { data: ssData, set: setSsData } = useCanisterKV(
    "decentos_spreadsheet",
    { grid: {}, formatting: {} }
  );
  const grid2 = ssData.grid;
  const pendingFmtRef = reactExports.useRef({});
  const [localFmt, setLocalFmt] = reactExports.useState({});
  const fmtTimerRef = reactExports.useRef(null);
  const fmtSyncedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!fmtSyncedRef.current && Object.keys(ssData.formatting).length > 0) {
      fmtSyncedRef.current = true;
      pendingFmtRef.current = ssData.formatting;
      setLocalFmt(ssData.formatting);
    }
  }, [ssData.formatting]);
  const formatting = localFmt;
  const [activeCell, setActiveCell] = reactExports.useState(null);
  const [editValue, setEditValue] = reactExports.useState("");
  const [editing, setEditing] = reactExports.useState(false);
  const [fileName, setFileName] = reactExports.useState("sheet1.json");
  const [freezeFirstRow, setFreezeFirstRow] = reactExports.useState(false);
  const [chartOpen, setChartOpen] = reactExports.useState(false);
  const [chartCol, setChartCol] = reactExports.useState("A");
  const [chartType, setChartType] = reactExports.useState("bar");
  const chartCanvasRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  const formulaBarRef = reactExports.useRef(null);
  const undoHistory = reactExports.useRef({});
  const activeCellKey = activeCell ? cellKey(activeCell[0], activeCell[1]) : null;
  const activeFmt = activeCellKey ? formatting[activeCellKey] ?? {} : {};
  const ssDataRef = reactExports.useRef(ssData);
  ssDataRef.current = ssData;
  const displayValues = reactExports.useMemo(() => {
    const vals = {};
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
  const setFormatting = reactExports.useCallback(
    (f) => {
      setSsData({ ...ssDataRef.current, formatting: f });
    },
    [setSsData]
  );
  const setGrid = reactExports.useCallback(
    (g) => {
      setSsData({ ...ssDataRef.current, grid: g });
    },
    [setSsData]
  );
  const updateFmt = reactExports.useCallback(
    (key, patch) => {
      setLocalFmt((prev) => {
        const next = { ...prev, [key]: { ...prev[key], ...patch } };
        pendingFmtRef.current = next;
        if (fmtTimerRef.current) clearTimeout(fmtTimerRef.current);
        fmtTimerRef.current = setTimeout(() => {
          setSsData({
            ...ssDataRef.current,
            formatting: pendingFmtRef.current
          });
        }, 500);
        return next;
      });
    },
    [setSsData]
  );
  const clearFmt = reactExports.useCallback(
    (key) => {
      setLocalFmt((prev) => {
        const next = { ...prev };
        delete next[key];
        pendingFmtRef.current = next;
        if (fmtTimerRef.current) clearTimeout(fmtTimerRef.current);
        fmtTimerRef.current = setTimeout(() => {
          setSsData({
            ...ssDataRef.current,
            formatting: pendingFmtRef.current
          });
        }, 500);
        return next;
      });
    },
    [setSsData]
  );
  const commitEdit = reactExports.useCallback(
    (row, col, value) => {
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
    [setGrid]
  );
  const startEdit = reactExports.useCallback((row, col) => {
    setActiveCell([row, col]);
    setEditValue(ssDataRef.current.grid[cellKey(row, col)] ?? "");
    setEditing(true);
    setTimeout(() => {
      var _a2;
      return (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
    }, 10);
  }, []);
  const handleCellClick = reactExports.useCallback(
    (row, col) => {
      var _a2;
      if (editing && activeCell) {
        commitEdit(
          activeCell[0],
          activeCell[1],
          ((_a2 = inputRef.current) == null ? void 0 : _a2.value) ?? editValue
        );
      }
      setActiveCell([row, col]);
      setEditValue(ssDataRef.current.grid[cellKey(row, col)] ?? "");
      setEditing(true);
      setTimeout(() => {
        var _a3;
        return (_a3 = inputRef.current) == null ? void 0 : _a3.focus();
      }, 10);
    },
    [editing, activeCell, commitEdit, editValue]
  );
  const handleCellDoubleClick = reactExports.useCallback(
    (row, col) => startEdit(row, col),
    [startEdit]
  );
  const handleKeyDown = reactExports.useCallback(
    (e) => {
      var _a2;
      if (!activeCell) return;
      const [row, col] = activeCell;
      const currentValue = ((_a2 = inputRef.current) == null ? void 0 : _a2.value) ?? editValue;
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
        const nextCol = e.shiftKey ? Math.max(col - 1, 0) : Math.min(col + 1, COLS - 1);
        setActiveCell([row, nextCol]);
        setEditValue(ssDataRef.current.grid[cellKey(row, nextCol)] ?? "");
        setEditing(false);
      } else if (e.key === "Escape") {
        setEditing(false);
        setEditValue(ssDataRef.current.grid[cellKey(row, col)] ?? "");
      }
    },
    [activeCell, commitEdit, editValue]
  );
  const handleFormulaBarKeyDown = reactExports.useCallback(
    (e) => {
      var _a2;
      if (!activeCell) return;
      const [row, col] = activeCell;
      const currentValue = ((_a2 = formulaBarRef.current) == null ? void 0 : _a2.value) ?? editValue;
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
        const nextCol = e.shiftKey ? Math.max(col - 1, 0) : Math.min(col + 1, COLS - 1);
        setActiveCell([row, nextCol]);
        setEditValue(ssDataRef.current.grid[cellKey(row, nextCol)] ?? "");
        setEditing(false);
      } else if (e.key === "Escape") {
        setEditing(false);
        setEditValue(ssDataRef.current.grid[cellKey(row, col)] ?? "");
      }
    },
    [activeCell, commitEdit, editValue]
  );
  const handleFormulaChange = reactExports.useCallback(
    (val) => {
      setEditValue(val);
      if (!editing) setEditing(true);
    },
    [editing]
  );
  const handleFormulaFocus = reactExports.useCallback(() => {
    if (activeCell && !editing) {
      const key = cellKey(activeCell[0], activeCell[1]);
      setEditValue(ssDataRef.current.grid[key] ?? "");
      setEditing(true);
    }
  }, [activeCell, editing]);
  const { isFocused } = useWindowFocus();
  reactExports.useEffect(() => {
    const handler = (e) => {
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
    const json = JSON.stringify({ fileName, grid: grid2, formatting }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    ue.success(`Saved ${fileName}`);
  };
  const handleLoad = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      var _a2;
      const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        var _a3;
        try {
          const parsed = JSON.parse((_a3 = ev.target) == null ? void 0 : _a3.result);
          if (parsed.grid) {
            setGrid(parsed.grid);
            setFileName(parsed.fileName ?? file.name);
            if (parsed.formatting) {
              setFormatting(parsed.formatting);
            }
            ue.success("Spreadsheet loaded");
          }
        } catch {
          ue.error("Invalid file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };
  const CELL_W = 80;
  const CELL_H = 26;
  const ROW_HEADER_W = 36;
  const [colWidths, setColWidths] = reactExports.useState(
    () => Array(COLS).fill(CELL_W)
  );
  const resizeDragRef = reactExports.useRef(null);
  const handleColResizeMouseDown = (e, colIdx) => {
    e.preventDefault();
    e.stopPropagation();
    resizeDragRef.current = {
      colIdx,
      startX: e.clientX,
      startW: colWidths[colIdx]
    };
    const onMouseMove = (ev) => {
      if (!resizeDragRef.current) return;
      const delta = ev.clientX - resizeDragRef.current.startX;
      const newW = Math.max(40, resizeDragRef.current.startW + delta);
      setColWidths((prev) => {
        const next = [...prev];
        next[resizeDragRef.current.colIdx] = newW;
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
  const btnBase = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 22,
    borderRadius: 4,
    cursor: "pointer",
    border: "1px solid transparent",
    background: "transparent",
    transition: "background 0.1s"
  };
  const fmtBtn = (active) => ({
    ...btnBase,
    background: active ? "rgba(99,102,241,0.2)" : "transparent",
    border: active ? "1px solid rgba(99,102,241,0.4)" : "1px solid transparent",
    color: active ? "rgba(99,102,241,1)" : "var(--os-text-secondary)"
  });
  const ERROR_CODES = /* @__PURE__ */ new Set([
    "#DIV/0!",
    "#VALUE!",
    "#NAME?",
    "#REF!",
    "#N/A",
    "#ERR"
  ]);
  const isErrorValue = (v) => ERROR_CODES.has(v) || v.startsWith("#");
  const errorTitle = (v) => {
    if (v === "#DIV/0!") return "Division by zero";
    if (v === "#VALUE!") return "Invalid value or non-numeric operand";
    if (v === "#NAME?") return "Unknown function or name";
    if (v === "#REF!") return "Cell reference out of range";
    if (v === "#N/A") return "Value not found";
    return "Formula error";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "var(--os-bg-app)", userSelect: "none" },
      "data-ocid": "spreadsheet.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-0.5 px-2 flex-shrink-0 flex-wrap",
            style: {
              height: 34,
              borderBottom: "1px solid rgba(99,102,241,0.15)",
              background: "var(--os-bg-elevated)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => activeCellKey && updateFmt(activeCellKey, { bold: !activeFmt.bold }),
                  style: fmtBtn(!!activeFmt.bold),
                  title: "Bold (Ctrl+B)",
                  "data-ocid": "spreadsheet.toggle",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bold, { className: "w-3 h-3" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => activeCellKey && updateFmt(activeCellKey, { italic: !activeFmt.italic }),
                  style: fmtBtn(!!activeFmt.italic),
                  title: "Italic (Ctrl+I)",
                  "data-ocid": "spreadsheet.toggle",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Italic, { className: "w-3 h-3" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    width: 1,
                    height: 14,
                    background: "var(--os-text-muted)",
                    margin: "0 2px"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => activeCellKey && updateFmt(activeCellKey, { align: "left" }),
                  style: fmtBtn(activeFmt.align === "left"),
                  title: "Align Left",
                  "data-ocid": "spreadsheet.toggle",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlignLeft, { className: "w-3 h-3" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => activeCellKey && updateFmt(activeCellKey, { align: "center" }),
                  style: fmtBtn(activeFmt.align === "center"),
                  title: "Align Center",
                  "data-ocid": "spreadsheet.toggle",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlignCenter, { className: "w-3 h-3" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => activeCellKey && updateFmt(activeCellKey, { align: "right" }),
                  style: fmtBtn(activeFmt.align === "right"),
                  title: "Align Right",
                  "data-ocid": "spreadsheet.toggle",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlignRight, { className: "w-3 h-3" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    width: 1,
                    height: 14,
                    background: "var(--os-text-muted)",
                    margin: "0 2px"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--os-text-secondary)", fontSize: 9 }, children: "A" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "color",
                    value: activeFmt.textColor ?? "#e2e8f0",
                    onChange: (e) => activeCellKey && updateFmt(activeCellKey, { textColor: e.target.value }),
                    title: "Text color",
                    className: "w-5 h-5 rounded cursor-pointer",
                    style: {
                      padding: 0,
                      border: "1px solid var(--os-border-window)",
                      background: "transparent"
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--os-text-secondary)", fontSize: 9 }, children: "bg" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "color",
                    value: activeFmt.bgColor ?? "#000000",
                    onChange: (e) => activeCellKey && updateFmt(activeCellKey, { bgColor: e.target.value }),
                    title: "Cell background",
                    className: "w-5 h-5 rounded cursor-pointer",
                    style: {
                      padding: 0,
                      border: "1px solid var(--os-border-window)",
                      background: "transparent"
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    width: 1,
                    height: 14,
                    background: "var(--os-text-muted)",
                    margin: "0 2px"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => activeCellKey && clearFmt(activeCellKey),
                  style: btnBase,
                  title: "Clear format",
                  "data-ocid": "spreadsheet.secondary_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Eraser,
                    {
                      className: "w-3 h-3",
                      style: { color: "var(--os-text-secondary)" }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    width: 1,
                    height: 14,
                    background: "var(--os-text-muted)",
                    margin: "0 2px"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setFreezeFirstRow((v) => !v),
                  style: fmtBtn(freezeFirstRow),
                  title: "Freeze first row",
                  "data-ocid": "spreadsheet.toggle",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 9, fontWeight: 700 }, children: "❄" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    width: 1,
                    height: 14,
                    background: "var(--os-text-muted)",
                    margin: "0 2px"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setChartOpen(true),
                  "data-ocid": "spreadsheet.secondary_button",
                  className: "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors",
                  style: {
                    background: "rgba(99,102,241,0.08)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    color: "var(--os-text-secondary)"
                  },
                  title: "Chart",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { className: "w-3 h-3" }),
                    "Chart"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-3 py-1.5 border-b flex-shrink-0",
            style: {
              borderColor: "rgba(99,102,241,0.15)",
              background: "var(--os-bg-elevated)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[10px] font-mono w-10 text-center flex-shrink-0",
                  style: { color: "rgba(99,102,241,0.7)" },
                  children: activeCellKey ?? ""
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex-1 flex items-center",
                  style: {
                    border: "1px solid rgba(99,102,241,0.2)",
                    borderRadius: 4,
                    background: "var(--os-border-subtle)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "px-2 font-mono text-[10px]",
                        style: { color: "rgba(99,102,241,0.5)" },
                        children: "ƒ"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        ref: formulaBarRef,
                        value: editing ? editValue : activeCellKey ? grid2[activeCellKey] ?? "" : "",
                        onChange: (e) => handleFormulaChange(e.target.value),
                        onKeyDown: handleFormulaBarKeyDown,
                        onFocus: handleFormulaFocus,
                        onBlur: (e) => {
                          if (activeCell && editing) {
                            commitEdit(activeCell[0], activeCell[1], e.currentTarget.value);
                          }
                        },
                        "data-ocid": "spreadsheet.input",
                        className: "flex-1 bg-transparent outline-none text-xs font-mono text-foreground py-0.5 pr-2",
                        placeholder: "Value or =SUM(A1:A5)"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: fileName,
                  onChange: (e) => setFileName(e.target.value),
                  className: "bg-transparent outline-none text-[10px] font-mono text-muted-foreground w-24",
                  style: { borderBottom: "1px solid var(--os-border-subtle)" },
                  placeholder: "filename.json"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleLoad,
                  "data-ocid": "spreadsheet.upload_button",
                  className: "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors",
                  style: {
                    background: "var(--os-border-subtle)",
                    border: "1px solid var(--os-text-muted)",
                    color: "var(--os-text-secondary)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-3 h-3" }),
                    "Load"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleSave,
                  "data-ocid": "spreadsheet.save_button",
                  className: "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors",
                  style: {
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    color: "rgba(99,102,241,1)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
                    "Save"
                  ]
                }
              )
            ]
          }
        ),
        chartOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 flex items-center justify-center z-50",
            style: { background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col rounded-xl overflow-hidden",
                style: {
                  width: 520,
                  maxHeight: "80vh",
                  background: "var(--os-bg-app)",
                  border: "1px solid var(--os-border-window)",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.5)"
                },
                "data-ocid": "spreadsheet.modal",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0",
                      style: {
                        borderColor: "var(--os-border-subtle)",
                        background: "var(--os-bg-elevated)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "text-xs font-bold",
                            style: { color: "var(--os-text-primary)" },
                            children: "Chart"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setChartOpen(false),
                            "data-ocid": "spreadsheet.close_button",
                            className: "w-5 h-5 flex items-center justify-center rounded hover:bg-muted/30",
                            style: { color: "var(--os-text-muted)" },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center gap-3 px-4 py-2 flex-shrink-0",
                      style: { borderBottom: "1px solid var(--os-border-subtle)" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "label",
                          {
                            className: "flex items-center gap-1.5 text-[11px]",
                            style: { color: "var(--os-text-secondary)" },
                            children: [
                              "Column:",
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "select",
                                {
                                  value: chartCol,
                                  onChange: (e) => setChartCol(e.target.value),
                                  className: "rounded px-1.5 py-0.5 text-[11px] outline-none",
                                  style: {
                                    background: "var(--os-bg-elevated)",
                                    border: "1px solid var(--os-border-subtle)",
                                    color: "var(--os-text-primary)"
                                  },
                                  children: Array.from({ length: COLS }, (_, i) => colLabel(i)).map(
                                    (c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c)
                                  )
                                }
                              )
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: ["bar", "line"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setChartType(t),
                            className: "px-2 py-0.5 rounded text-[11px] capitalize transition-colors",
                            style: {
                              background: chartType === t ? "rgba(99,102,241,0.2)" : "var(--os-bg-elevated)",
                              border: chartType === t ? "1px solid rgba(99,102,241,0.4)" : "1px solid var(--os-border-subtle)",
                              color: chartType === t ? "rgba(99,102,241,1)" : "var(--os-text-secondary)"
                            },
                            children: t
                          },
                          t
                        )) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            type: "button",
                            onClick: () => {
                              const canvas = chartCanvasRef.current;
                              if (!canvas) return;
                              const url = canvas.toDataURL("image/png");
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = "chart.png";
                              a.click();
                            },
                            "data-ocid": "spreadsheet.save_button",
                            className: "ml-auto flex items-center gap-1 px-2 py-0.5 rounded text-[11px]",
                            style: {
                              background: "rgba(99,102,241,0.12)",
                              border: "1px solid rgba(99,102,241,0.3)",
                              color: "rgba(99,102,241,1)"
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
                              " Export PNG"
                            ]
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SpreadsheetChart,
                    {
                      grid: grid2,
                      col: chartCol,
                      chartType,
                      rows: ROWS,
                      canvasRef: chartCanvasRef
                    }
                  ) })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "table",
          {
            className: "border-collapse",
            style: { tableLayout: "fixed" },
            "data-ocid": "spreadsheet.table",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "th",
                  {
                    style: {
                      width: ROW_HEADER_W,
                      minWidth: ROW_HEADER_W,
                      height: CELL_H,
                      background: freezeFirstRow ? "rgba(25,50,60,0.95)" : "var(--os-bg-sidebar)",
                      borderRight: "1px solid rgba(99,102,241,0.15)",
                      borderBottom: freezeFirstRow ? "2px solid rgba(99,102,241,0.4)" : "1px solid rgba(99,102,241,0.15)",
                      position: "sticky",
                      top: 0,
                      left: 0,
                      zIndex: 3
                    }
                  }
                ),
                COL_LABELS.map((_label, c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "th",
                  {
                    style: {
                      width: colWidths[c],
                      minWidth: colWidths[c],
                      height: CELL_H,
                      background: "var(--os-bg-sidebar)",
                      borderRight: "1px solid rgba(99,102,241,0.1)",
                      borderBottom: "1px solid rgba(99,102,241,0.15)",
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                      color: activeCell && activeCell[1] === c ? "rgba(99,102,241,1)" : "var(--os-text-secondary)",
                      fontWeight: 600,
                      fontSize: 10,
                      textAlign: "center",
                      letterSpacing: 1,
                      userSelect: "none",
                      overflow: "visible"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%"
                        },
                        children: [
                          _label,
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              onMouseDown: (e) => handleColResizeMouseDown(e, c),
                              style: {
                                position: "absolute",
                                right: 0,
                                top: 0,
                                width: 4,
                                height: "100%",
                                cursor: "col-resize",
                                background: "transparent",
                                zIndex: 1
                              },
                              onMouseEnter: (e) => {
                                e.currentTarget.style.background = "rgba(99,102,241,0.4)";
                              },
                              onMouseLeave: (e) => {
                                e.currentTarget.style.background = "transparent";
                              }
                            }
                          )
                        ]
                      }
                    )
                  },
                  _label
                ))
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: ROW_NUMBERS.map((rowNum) => {
                const r = rowNum - 1;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "td",
                    {
                      style: {
                        width: ROW_HEADER_W,
                        minWidth: ROW_HEADER_W,
                        height: CELL_H,
                        background: "var(--os-bg-sidebar)",
                        borderRight: "1px solid rgba(99,102,241,0.15)",
                        borderBottom: "1px solid rgba(99,102,241,0.07)",
                        position: "sticky",
                        left: 0,
                        zIndex: 1,
                        color: activeCell && activeCell[0] === r ? "rgba(99,102,241,1)" : "var(--os-text-muted)",
                        fontWeight: 600,
                        fontSize: 10,
                        textAlign: "center"
                      },
                      children: rowNum
                    }
                  ),
                  COL_LABELS.map((_label, c) => {
                    const key = cellKey(r, c);
                    const isActive = (activeCell == null ? void 0 : activeCell[0]) === r && (activeCell == null ? void 0 : activeCell[1]) === c;
                    const isEditingCell = isActive && editing;
                    const fmt = formatting[key] ?? {};
                    const cellVal = displayValues[key] ?? "";
                    const isErr = isErrorValue(cellVal);
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "td",
                      {
                        onClick: () => handleCellClick(r, c),
                        onDoubleClick: () => handleCellDoubleClick(r, c),
                        onKeyDown: (e) => {
                          if (e.key === "Enter" || e.key === " ")
                            handleCellDoubleClick(r, c);
                        },
                        "data-ocid": `spreadsheet.row.${rowNum}`,
                        style: {
                          width: colWidths[c],
                          minWidth: colWidths[c],
                          height: CELL_H,
                          borderRight: "1px solid rgba(99,102,241,0.07)",
                          borderBottom: "1px solid rgba(99,102,241,0.07)",
                          background: isActive ? "rgba(99,102,241,0.15)" : fmt.bgColor ?? "transparent",
                          outline: isActive ? "2px solid rgba(99,102,241,0.7)" : "none",
                          outlineOffset: -1,
                          padding: 0,
                          cursor: "cell",
                          position: "relative"
                        },
                        children: isEditingCell ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            ref: inputRef,
                            value: editValue,
                            onChange: (e) => setEditValue(e.target.value),
                            onKeyDown: handleKeyDown,
                            onBlur: (e) => commitEdit(r, c, e.currentTarget.value),
                            "data-ocid": "spreadsheet.editor",
                            style: {
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
                              caretColor: "rgba(99,102,241,0.9)"
                            }
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            title: isErr ? errorTitle(cellVal) : void 0,
                            style: {
                              display: "block",
                              padding: "0 4px",
                              fontFamily: "monospace",
                              fontSize: 11,
                              fontWeight: fmt.bold ? "bold" : "normal",
                              fontStyle: fmt.italic ? "italic" : "normal",
                              textAlign: fmt.align ?? "left",
                              background: isErr ? "rgba(239,68,68,0.18)" : void 0,
                              color: isErr ? "#EF4444" : isActive ? "rgba(99,102,241,1)" : fmt.textColor ?? "var(--os-text-secondary)",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            },
                            children: cellVal
                          }
                        )
                      },
                      key
                    );
                  })
                ] }, String(rowNum));
              }) })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-4 px-3 flex-shrink-0",
            style: {
              height: 24,
              borderTop: "1px solid rgba(99,102,241,0.1)",
              background: "var(--os-bg-app)",
              fontSize: 10,
              color: "var(--os-text-muted)",
              fontFamily: "monospace"
            },
            children: [
              activeCell ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(99,102,241,0.7)" }, children: activeCellKey }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: activeCellKey && displayValues[activeCellKey] ? displayValues[activeCellKey] : "—" }),
                activeCellKey && ((_a = grid2[activeCellKey]) == null ? void 0 : _a.startsWith("=")) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--os-text-muted)" }, children: grid2[activeCellKey] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--os-text-muted)" }, children: "No cell selected" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto", style: { color: "var(--os-text-muted)" }, children: [
                ROWS,
                "×",
                COLS
              ] })
            ]
          }
        )
      ]
    }
  );
}
export {
  Spreadsheet
};
