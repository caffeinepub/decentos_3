import { Clock, Delete } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowFocus } from "../../context/WindowFocusContext";

interface HistoryEntry {
  expression: string;
  result: string;
}

type CalcOp = "+" | "-" | "*" | "/" | null;

export function Calculator() {
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [pendingOp, setPendingOp] = useState<CalcOp>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [pressed, setPressed] = useState<string | null>(null);

  // Stable ref to avoid exhaustive-deps issues
  const pressedRef = useRef(setPressed);
  pressedRef.current = setPressed;

  const animatePress = useCallback((key: string) => {
    pressedRef.current(key);
    setTimeout(() => pressedRef.current(null), 120);
  }, []);

  const inputDigit = useCallback(
    (digit: string) => {
      animatePress(digit);
      if (waitingForOperand) {
        setDisplay(digit);
        setWaitingForOperand(false);
      } else {
        setDisplay((prev) =>
          prev === "0" ? digit : prev.length >= 15 ? prev : prev + digit,
        );
      }
    },
    [waitingForOperand, animatePress],
  );

  const inputDot = useCallback(() => {
    animatePress(".");
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) setDisplay((prev) => `${prev}.`);
  }, [display, waitingForOperand, animatePress]);

  const clearAll = useCallback(() => {
    animatePress("C");
    setDisplay("0");
    setPrevValue(null);
    setPendingOp(null);
    setWaitingForOperand(false);
    setExpression("");
  }, [animatePress]);

  const clearEntry = useCallback(() => {
    animatePress("CE");
    setDisplay("0");
  }, [animatePress]);

  const toggleSign = useCallback(() => {
    animatePress("+/-");
    setDisplay((prev) =>
      prev.startsWith("-") ? prev.slice(1) : prev === "0" ? "0" : `-${prev}`,
    );
  }, [animatePress]);

  const percent = useCallback(() => {
    animatePress("%");
    setDisplay((prev) => String(Number.parseFloat(prev) / 100));
  }, [animatePress]);

  const backspace = useCallback(() => {
    animatePress("back");
    if (waitingForOperand) return;
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
  }, [waitingForOperand, animatePress]);

  const handleOp = useCallback(
    (op: CalcOp) => {
      animatePress(op ?? "");
      const current = Number.parseFloat(display);
      if (prevValue !== null && pendingOp && !waitingForOperand) {
        const prev = Number.parseFloat(prevValue);
        let result = prev;
        if (pendingOp === "+") result = prev + current;
        else if (pendingOp === "-") result = prev - current;
        else if (pendingOp === "*") result = prev * current;
        else if (pendingOp === "/") result = current !== 0 ? prev / current : 0;
        const resultStr = String(Number.parseFloat(result.toPrecision(12)));
        setDisplay(resultStr);
        setPrevValue(resultStr);
        setExpression(`${resultStr} ${op ?? ""}`);
      } else {
        setPrevValue(display);
        setExpression(`${display} ${op ?? ""}`);
      }
      setPendingOp(op);
      setWaitingForOperand(true);
    },
    [display, prevValue, pendingOp, waitingForOperand, animatePress],
  );

  const calculate = useCallback(() => {
    animatePress("=");
    if (prevValue === null || pendingOp === null) return;
    const prev = Number.parseFloat(prevValue);
    const current = Number.parseFloat(display);
    let result = prev;
    if (pendingOp === "+") result = prev + current;
    else if (pendingOp === "-") result = prev - current;
    else if (pendingOp === "*") result = prev * current;
    else if (pendingOp === "/") result = current !== 0 ? prev / current : 0;
    const expr = `${prevValue} ${pendingOp} ${display}`;
    const resultStr = String(Number.parseFloat(result.toPrecision(12)));
    setHistory((h) => [
      { expression: expr, result: resultStr },
      ...h.slice(0, 49),
    ]);
    setExpression(expr);
    setDisplay(resultStr);
    setPrevValue(null);
    setPendingOp(null);
    setWaitingForOperand(true);
  }, [display, prevValue, pendingOp, animatePress]);

  const { isFocused } = useWindowFocus();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isFocused) return;
      if (e.key >= "0" && e.key <= "9") inputDigit(e.key);
      else if (e.key === ".") inputDot();
      else if (e.key === "+") handleOp("+");
      else if (e.key === "-") handleOp("-");
      else if (e.key === "*") handleOp("*");
      else if (e.key === "/") {
        e.preventDefault();
        handleOp("/");
      } else if (e.key === "Enter" || e.key === "=") calculate();
      else if (e.key === "Escape") clearAll();
      else if (e.key === "Backspace") backspace();
      else if (e.key === "%") percent();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    isFocused,
    inputDigit,
    inputDot,
    handleOp,
    calculate,
    clearAll,
    backspace,
    percent,
  ]);

  const btnBase =
    "h-12 rounded-lg text-sm font-semibold transition-all duration-75 select-none flex items-center justify-center cursor-pointer active:scale-95";
  const btnDigit =
    "bg-white/5 border border-white/10 hover:bg-white/10 text-foreground";
  const btnOp =
    "bg-primary/15 border border-primary/30 hover:bg-primary/25 text-primary";
  const btnAction =
    "bg-white/8 border border-white/15 hover:bg-white/15 text-muted-foreground hover:text-foreground";
  const btnEquals =
    "bg-primary/80 hover:bg-primary border-0 text-black font-bold col-span-1";

  const buttons: { label: string; type: string; action: () => void }[] = [
    { label: "C", type: "action", action: clearAll },
    { label: "CE", type: "action", action: clearEntry },
    { label: "%", type: "action", action: percent },
    { label: "/", type: "op", action: () => handleOp("/") },
    { label: "7", type: "digit", action: () => inputDigit("7") },
    { label: "8", type: "digit", action: () => inputDigit("8") },
    { label: "9", type: "digit", action: () => inputDigit("9") },
    { label: "*", type: "op", action: () => handleOp("*") },
    { label: "4", type: "digit", action: () => inputDigit("4") },
    { label: "5", type: "digit", action: () => inputDigit("5") },
    { label: "6", type: "digit", action: () => inputDigit("6") },
    { label: "-", type: "op", action: () => handleOp("-") },
    { label: "1", type: "digit", action: () => inputDigit("1") },
    { label: "2", type: "digit", action: () => inputDigit("2") },
    { label: "3", type: "digit", action: () => inputDigit("3") },
    { label: "+", type: "op", action: () => handleOp("+") },
    { label: "+/-", type: "action", action: toggleSign },
    { label: "0", type: "digit", action: () => inputDigit("0") },
    { label: ".", type: "digit", action: inputDot },
    { label: "=", type: "equals", action: calculate },
  ];

  return (
    <div
      className="flex h-full"
      style={{ background: "rgba(9,13,16,0.85)" }}
      data-ocid="calculator.panel"
    >
      {/* History sidebar */}
      {showHistory && (
        <div
          className="w-44 flex-shrink-0 flex flex-col border-r overflow-hidden"
          style={{
            borderColor: "rgba(39,215,224,0.15)",
            background: "rgba(11,20,26,0.7)",
          }}
        >
          <div
            className="px-3 py-2 text-[10px] font-mono text-primary/60 border-b"
            style={{ borderColor: "rgba(39,215,224,0.1)" }}
          >
            HISTORY
          </div>
          <div className="flex-1 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-xs text-muted-foreground/40 p-3">
                No history yet.
              </p>
            ) : (
              history.map((h, i) => (
                <button
                  key={`${i}-${h.result}`}
                  type="button"
                  data-ocid={`calculator.item.${i + 1}`}
                  onClick={() => {
                    setDisplay(h.result);
                    setWaitingForOperand(true);
                  }}
                  className="w-full text-left px-3 py-2 border-b hover:bg-primary/10 transition-colors"
                  style={{ borderColor: "rgba(39,215,224,0.07)" }}
                >
                  <div className="text-[9px] text-muted-foreground/50 font-mono">
                    {h.expression}
                  </div>
                  <div className="text-xs font-semibold text-primary font-mono">
                    {h.result}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Main calc */}
      <div className="flex-1 flex flex-col p-3 gap-3">
        {/* Display */}
        <div
          className="rounded-xl p-3 flex flex-col items-end gap-1 min-h-[80px] justify-end"
          style={{
            background: "rgba(6,18,22,0.9)",
            border: "1px solid rgba(39,215,224,0.2)",
            boxShadow:
              "0 0 20px rgba(39,215,224,0.06), inset 0 1px 0 rgba(39,215,224,0.08)",
          }}
        >
          <div className="text-[10px] font-mono text-muted-foreground/50 h-4 truncate max-w-full">
            {expression || "\u00A0"}
          </div>
          <div
            className="font-mono font-bold text-foreground truncate max-w-full"
            style={{
              fontSize:
                display.length > 12
                  ? "18px"
                  : display.length > 8
                    ? "22px"
                    : "28px",
              color: "rgba(39,215,224,1)",
              textShadow: "0 0 16px rgba(39,215,224,0.4)",
            }}
          >
            {display}
          </div>
        </div>

        {/* Backspace + History row */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={backspace}
            data-ocid="calculator.delete_button"
            className={`${btnBase} ${btnAction} flex-1 gap-1 text-xs`}
            style={{
              transform: pressed === "back" ? "scale(0.93)" : "scale(1)",
            }}
          >
            <Delete className="w-3.5 h-3.5" />
            Del
          </button>
          <button
            type="button"
            onClick={() => setShowHistory((s) => !s)}
            data-ocid="calculator.toggle"
            className={`${btnBase} flex-1 gap-1 text-xs`}
            style={{
              background: showHistory
                ? "rgba(39,215,224,0.15)"
                : "var(--os-border-subtle)",
              border: `1px solid ${
                showHistory ? "rgba(39,215,224,0.4)" : "var(--os-text-muted)"
              }`,
              color: showHistory
                ? "rgba(39,215,224,1)"
                : "var(--os-text-secondary)",
            }}
          >
            <Clock className="w-3.5 h-3.5" />
            History
          </button>
        </div>

        {/* Button grid */}
        <div className="grid grid-cols-4 gap-2 flex-1">
          {buttons.map((btn) => (
            <button
              key={btn.label}
              type="button"
              onClick={btn.action}
              data-ocid="calculator.button"
              className={`${btnBase} ${
                btn.type === "digit"
                  ? btnDigit
                  : btn.type === "op"
                    ? btnOp
                    : btn.type === "equals"
                      ? btnEquals
                      : btnAction
              }`}
              style={{
                transform: pressed === btn.label ? "scale(0.9)" : "scale(1)",
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
