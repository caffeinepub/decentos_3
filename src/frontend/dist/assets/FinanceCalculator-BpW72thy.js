import { r as reactExports, j as jsxRuntimeExports, E as TrendingUp, an as DollarSign, aX as Calculator } from "./index-8tMpYjTW.js";
function numFmt(n) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function ResultCard({
  label,
  value,
  sub
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl p-3 flex-1",
      style: {
        background: "var(--os-bg-elevated)",
        border: "1px solid rgba(39,215,224,0.15)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-[10px] font-semibold mb-1",
            style: { color: "rgba(39,215,224,0.7)" },
            children: label
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-lg font-bold",
            style: { color: "var(--os-text-primary)" },
            children: value
          }
        ),
        sub && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-[10px] mt-0.5",
            style: { color: "var(--os-text-secondary)" },
            children: sub
          }
        )
      ]
    }
  );
}
const inputSt = {
  background: "var(--os-border-subtle)",
  border: "1px solid rgba(39,215,224,0.2)",
  color: "var(--os-text-primary)",
  colorScheme: "dark"
};
const lbl = { color: "var(--os-text-secondary)" };
function CompoundInterest() {
  const [principal, setPrincipal] = reactExports.useState(1e4);
  const [rate, setRate] = reactExports.useState(7);
  const [years, setYears] = reactExports.useState(10);
  const [freq, setFreq] = reactExports.useState(12);
  const r = rate / 100;
  const finalAmt = principal * (1 + r / freq) ** (freq * years);
  const totalInterest = finalAmt - principal;
  const effectiveRate = ((1 + r / freq) ** freq - 1) * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold block mb-1", style: lbl, children: "Principal ($)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: principal,
            min: 1,
            onChange: (e) => setPrincipal(Number(e.target.value)),
            className: "w-full px-3 py-2 rounded-lg text-[12px] outline-none",
            style: inputSt
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold block mb-1", style: lbl, children: "Annual Rate (%)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: rate,
            min: 0,
            step: 0.1,
            onChange: (e) => setRate(Number(e.target.value)),
            className: "w-full px-3 py-2 rounded-lg text-[12px] outline-none",
            style: inputSt
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold block mb-1", style: lbl, children: "Years" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: years,
            min: 1,
            onChange: (e) => setYears(Number(e.target.value)),
            className: "w-full px-3 py-2 rounded-lg text-[12px] outline-none",
            style: inputSt
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold block mb-1", style: lbl, children: "Compounds / Year" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: freq,
            onChange: (e) => setFreq(Number(e.target.value)),
            className: "w-full px-3 py-2 rounded-lg text-[12px] outline-none",
            style: { ...inputSt, background: "rgba(10,16,20,0.9)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 1, children: "Annually (1)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 4, children: "Quarterly (4)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 12, children: "Monthly (12)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 365, children: "Daily (365)" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResultCard, { label: "Final Amount", value: `$${numFmt(finalAmt)}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ResultCard,
        {
          label: "Total Interest",
          value: `$${numFmt(totalInterest)}`,
          sub: `${numFmt(totalInterest / principal * 100)}% gain`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ResultCard,
        {
          label: "Effective Rate",
          value: `${numFmt(effectiveRate)}%`,
          sub: "per year"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl p-3 text-[11px] leading-relaxed",
        style: {
          background: "rgba(39,215,224,0.04)",
          border: "1px solid rgba(39,215,224,0.1)",
          color: "var(--os-text-secondary)"
        },
        children: [
          "Formula:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(39,215,224,0.8)" }, children: "A = P(1 + r/n)^(nt)" }),
          " ",
          "— P=$",
          principal.toLocaleString(),
          ", r=",
          rate,
          "%, n=",
          freq,
          ", t=",
          years,
          "y"
        ]
      }
    )
  ] });
}
function Mortgage() {
  const [loan, setLoan] = reactExports.useState(3e5);
  const [rate, setRate] = reactExports.useState(6.5);
  const [term, setTerm] = reactExports.useState(30);
  const monthlyRate = rate / 100 / 12;
  const n = term * 12;
  const monthly = monthlyRate === 0 ? loan / n : loan * monthlyRate * (1 + monthlyRate) ** n / ((1 + monthlyRate) ** n - 1);
  const totalPaid = monthly * n;
  const totalInterest = totalPaid - loan;
  const principalPct = loan / totalPaid * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold block mb-1", style: lbl, children: "Loan Amount ($)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: loan,
            min: 1e3,
            onChange: (e) => setLoan(Number(e.target.value)),
            className: "w-full px-3 py-2 rounded-lg text-[12px] outline-none",
            style: inputSt
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold block mb-1", style: lbl, children: "Interest Rate (%)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: rate,
            min: 0,
            step: 0.1,
            onChange: (e) => setRate(Number(e.target.value)),
            className: "w-full px-3 py-2 rounded-lg text-[12px] outline-none",
            style: inputSt
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold block mb-1", style: lbl, children: "Term (Years)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            value: term,
            onChange: (e) => setTerm(Number(e.target.value)),
            className: "w-full px-3 py-2 rounded-lg text-[12px] outline-none",
            style: { ...inputSt, background: "rgba(10,16,20,0.9)" },
            children: [10, 15, 20, 25, 30].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: v, children: [
              v,
              " years"
            ] }, v))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResultCard, { label: "Monthly Payment", value: `$${numFmt(monthly)}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResultCard, { label: "Total Paid", value: `$${numFmt(totalPaid)}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ResultCard,
        {
          label: "Total Interest",
          value: `$${numFmt(totalInterest)}`,
          sub: `${numFmt(totalInterest / loan * 100)}% of loan`
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-[10px] font-semibold",
          style: { color: "var(--os-text-secondary)" },
          children: "Payment Breakdown"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-5 rounded-full overflow-hidden flex", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full transition-all",
            style: {
              width: `${principalPct}%`,
              background: "rgba(39,215,224,0.7)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full flex-1",
            style: { background: "rgba(239,68,68,0.5)" }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 text-[11px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgba(39,215,224,0.8)" }, children: [
          "■ Principal ",
          numFmt(principalPct),
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgba(239,68,68,0.8)" }, children: [
          "■ Interest ",
          numFmt(100 - principalPct),
          "%"
        ] })
      ] })
    ] })
  ] });
}
function SavingsGoal() {
  const [target, setTarget] = reactExports.useState(5e4);
  const [monthly, setMonthly] = reactExports.useState(500);
  const [rate, setRate] = reactExports.useState(4);
  const monthlyRate = rate / 100 / 12;
  let months = 0;
  let balance = 0;
  const MAX_MONTHS = 600;
  while (balance < target && months < MAX_MONTHS) {
    balance = balance * (1 + monthlyRate) + monthly;
    months++;
  }
  const totalContributed = monthly * months;
  const interestEarned = balance - totalContributed;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold block mb-1", style: lbl, children: "Target Amount ($)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: target,
            min: 100,
            onChange: (e) => setTarget(Number(e.target.value)),
            className: "w-full px-3 py-2 rounded-lg text-[12px] outline-none",
            style: inputSt
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold block mb-1", style: lbl, children: "Monthly Contribution ($)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: monthly,
            min: 1,
            onChange: (e) => setMonthly(Number(e.target.value)),
            className: "w-full px-3 py-2 rounded-lg text-[12px] outline-none",
            style: inputSt
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold block mb-1", style: lbl, children: "Annual Rate (%)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: rate,
            min: 0,
            step: 0.1,
            onChange: (e) => setRate(Number(e.target.value)),
            className: "w-full px-3 py-2 rounded-lg text-[12px] outline-none",
            style: inputSt
          }
        )
      ] })
    ] }),
    months >= MAX_MONTHS ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-xl p-3",
        style: {
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.2)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px]", style: { color: "rgba(239,68,68,0.8)" }, children: "Goal unreachable with current contributions — increase monthly amount." })
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ResultCard,
        {
          label: "Time to Goal",
          value: years > 0 ? `${years}y ${remMonths}m` : `${months}m`,
          sub: `${months} months total`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ResultCard,
        {
          label: "Total Contributed",
          value: `$${numFmt(totalContributed)}`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ResultCard,
        {
          label: "Interest Earned",
          value: `$${numFmt(Math.max(0, interestEarned))}`,
          sub: `${numFmt(Math.max(0, interestEarned) / target * 100)}% of goal`
        }
      )
    ] })
  ] });
}
function FinanceCalculator({ windowProps: _w }) {
  const [tab, setTab] = reactExports.useState("compound");
  const tabs = [
    {
      id: "compound",
      label: "Compound Interest",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3.5 h-3.5" })
    },
    {
      id: "mortgage",
      label: "Mortgage",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-3.5 h-3.5" })
    },
    {
      id: "savings",
      label: "Savings Goal",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calculator, { className: "w-3.5 h-3.5" })
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "rgba(8,14,20,0.95)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex gap-0 border-b flex-shrink-0",
            style: {
              borderColor: "rgba(39,215,224,0.12)",
              background: "rgba(10,16,20,0.7)"
            },
            children: tabs.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": `financecalc.${t.id}_tab`,
                onClick: () => setTab(t.id),
                className: "flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-semibold transition-all",
                style: {
                  color: tab === t.id ? "var(--os-accent)" : "var(--os-text-secondary)",
                  borderBottom: tab === t.id ? "2px solid #27D7E0" : "2px solid transparent",
                  background: tab === t.id ? "rgba(39,215,224,0.05)" : "transparent"
                },
                children: [
                  t.icon,
                  t.label
                ]
              },
              t.id
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto", children: [
          tab === "compound" && /* @__PURE__ */ jsxRuntimeExports.jsx(CompoundInterest, {}),
          tab === "mortgage" && /* @__PURE__ */ jsxRuntimeExports.jsx(Mortgage, {}),
          tab === "savings" && /* @__PURE__ */ jsxRuntimeExports.jsx(SavingsGoal, {})
        ] })
      ]
    }
  );
}
export {
  FinanceCalculator
};
