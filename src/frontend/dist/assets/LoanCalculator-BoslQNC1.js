import { j as jsxRuntimeExports, r as reactExports } from "./index-CZGIn5x2.js";
import { B as Button } from "./button-DBwl-7M-.js";
import { I as Input } from "./input-C2UuKq0p.js";
import { L as Label } from "./label-CGkVOZPp.js";
import { S as ScrollArea } from "./scroll-area-0_61eqCO.js";
import { c as cn } from "./utils-C29Fbx4G.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { L as LoaderCircle } from "./loader-circle-CDA4iBPc.js";
import "./index-B265m3O3.js";
import "./index-B9-lQkRo.js";
import "./index-YwGfiBwk.js";
import "./index-DxR-hlVQ.js";
import "./index-DfmnWLAm.js";
import "./index-C4X58sdz.js";
import "./index-9Nd72esH.js";
import "./index-IXOTxK3N.js";
function Table({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "table-container",
      className: "relative w-full overflow-x-auto",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "table",
        {
          "data-slot": "table",
          className: cn("w-full caption-bottom text-sm", className),
          ...props
        }
      )
    }
  );
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: cn("[&_tr]:border-b", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "th",
    {
      "data-slot": "table-head",
      className: cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function calculate(principal, annualRate, years) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  const monthly = r === 0 ? principal / n : principal * (r * (1 + r) ** n) / ((1 + r) ** n - 1);
  const total = monthly * n;
  const totalInterest = total - principal;
  let balance = principal;
  const schedule = [];
  for (let i = 1; i <= Math.min(n, 24); i++) {
    const interestPayment = balance * r;
    const principalPayment = monthly - interestPayment;
    balance -= principalPayment;
    schedule.push({
      month: i,
      payment: monthly,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance)
    });
  }
  return { monthly, total, totalInterest, schedule };
}
const fmt = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });
function PieChart({
  principal,
  interest
}) {
  const total = principal + interest;
  const principalPct = principal / total;
  const r = 70;
  const cx = 90;
  const cy = 90;
  const circ = 2 * Math.PI * r;
  const principalDash = principalPct * circ;
  const interestDash = circ - principalDash;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "180", height: "180", viewBox: "0 0 180 180", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Loan breakdown" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "circle",
        {
          cx,
          cy,
          r,
          fill: "none",
          stroke: "var(--os-border-subtle)",
          strokeWidth: "28"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "circle",
        {
          cx,
          cy,
          r,
          fill: "none",
          stroke: "var(--os-accent)",
          strokeWidth: "28",
          strokeDasharray: `${principalDash} ${interestDash}`,
          strokeDashoffset: circ * 0.25,
          strokeLinecap: "butt"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "circle",
        {
          cx,
          cy,
          r,
          fill: "none",
          stroke: "#F97316",
          strokeWidth: "28",
          strokeDasharray: `${interestDash} ${principalDash}`,
          strokeDashoffset: circ * 0.25 - principalDash,
          strokeLinecap: "butt"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "text",
        {
          x: cx,
          y: cy - 8,
          textAnchor: "middle",
          fill: "rgba(220,235,240,0.9)",
          fontSize: "13",
          fontWeight: "700",
          children: fmt(principal + interest)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "text",
        {
          x: cx,
          y: cy + 10,
          textAnchor: "middle",
          fill: "rgba(180,200,210,0.4)",
          fontSize: "10",
          children: "total cost"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-3 h-3 rounded-sm",
            style: { background: "var(--os-accent)" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/60", children: "Principal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: fmt(principal) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-3 h-3 rounded-sm",
            style: { background: "#F97316" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/60", children: "Interest" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", style: { color: "#F97316" }, children: fmt(interest) })
        ] })
      ] })
    ] })
  ] });
}
function LoanCalculator(_) {
  const {
    data: savedInputs,
    set: saveInputs,
    loading
  } = useCanisterKV("decentos_loancalc", {
    principal: "250000",
    rate: "6.5",
    years: "30"
  });
  const [principal, setPrincipal] = reactExports.useState("250000");
  const [rate, setRate] = reactExports.useState("6.5");
  const [years, setYears] = reactExports.useState("30");
  const [result, setResult] = reactExports.useState(
    () => calculate(25e4, 6.5, 30)
  );
  const [tab, setTab] = reactExports.useState("summary");
  const [initialized, setInitialized] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!loading && !initialized) {
      setPrincipal(savedInputs.principal);
      setRate(savedInputs.rate);
      setYears(savedInputs.years);
      setResult(
        calculate(
          Number.parseFloat(savedInputs.principal),
          Number.parseFloat(savedInputs.rate),
          Number.parseInt(savedInputs.years)
        )
      );
      setInitialized(true);
    }
  }, [loading, savedInputs, initialized]);
  const handleCalc = () => {
    const p = Number.parseFloat(principal);
    const r = Number.parseFloat(rate);
    const y = Number.parseInt(years);
    if (Number.isNaN(p) || Number.isNaN(r) || Number.isNaN(y) || p <= 0 || r < 0 || y <= 0)
      return;
    setResult(calculate(p, r, y));
    saveInputs({ principal, rate, years });
  };
  const cardStyle = "flex flex-col items-center justify-center rounded-xl border border-border bg-muted/50 p-4 gap-1";
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center h-full",
        style: { background: "rgba(11,15,18,0.7)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          LoaderCircle,
          {
            className: "w-6 h-6 animate-spin",
            style: { color: "rgba(39,215,224,0.7)" }
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex h-full flex-col gap-3 overflow-hidden p-4",
      style: { background: "rgba(11,15,18,0.7)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground/60", children: "Principal ($)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "loancalc.input",
                type: "number",
                value: principal,
                onChange: (e) => setPrincipal(e.target.value),
                className: "border-border bg-muted/50 text-foreground"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground/60", children: "Annual Rate (%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "loancalc.input",
                type: "number",
                step: "0.1",
                value: rate,
                onChange: (e) => setRate(e.target.value),
                className: "border-border bg-muted/50 text-foreground"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground/60", children: "Term (years)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "loancalc.input",
                type: "number",
                value: years,
                onChange: (e) => setYears(e.target.value),
                className: "border-border bg-muted/50 text-foreground"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "loancalc.submit_button",
            onClick: handleCalc,
            style: { background: "var(--os-accent)", color: "#000" },
            className: "font-semibold flex-shrink-0",
            children: "Calculate"
          }
        ),
        result && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cardStyle, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/60", children: "Monthly Payment" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-lg font-bold",
                  style: { color: "var(--os-accent)" },
                  children: fmt(result.monthly)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cardStyle, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/60", children: "Total Payment" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-foreground", children: fmt(result.total) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cardStyle, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/60", children: "Total Interest" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", style: { color: "#F97316" }, children: fmt(result.totalInterest) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-shrink-0", children: ["summary", "amortization"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `loancalc.${t}.tab`,
              onClick: () => setTab(t),
              className: "px-3 py-1 rounded text-xs transition-all capitalize",
              style: {
                background: tab === t ? "rgba(39,215,224,0.15)" : "var(--os-border-subtle)",
                color: tab === t ? "var(--os-accent)" : "var(--os-text-secondary)",
                border: `1px solid ${tab === t ? "rgba(39,215,224,0.4)" : "var(--os-border-subtle)"}`
              },
              children: t
            },
            t
          )) }),
          tab === "summary" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-start justify-center overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            PieChart,
            {
              principal: Number.parseFloat(principal),
              interest: result.totalInterest
            }
          ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { className: "border-border", children: [
              "Month",
              "Payment",
              "Principal",
              "Interest",
              "Balance"
            ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              TableHead,
              {
                className: "text-muted-foreground/60 text-xs",
                children: h
              },
              h
            )) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: result.schedule.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TableRow,
              {
                className: "border-white/5 hover:bg-muted/50",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground text-xs", children: row.month }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-foreground text-xs", children: fmt(row.payment) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TableCell,
                    {
                      className: "text-xs",
                      style: { color: "var(--os-accent)" },
                      children: fmt(row.principal)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TableCell,
                    {
                      className: "text-xs",
                      style: { color: "#F97316" },
                      children: fmt(row.interest)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground text-xs", children: fmt(row.balance) })
                ]
              },
              row.month
            )) })
          ] }) })
        ] })
      ]
    }
  );
}
export {
  LoanCalculator
};
