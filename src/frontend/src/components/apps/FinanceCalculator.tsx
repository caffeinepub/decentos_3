import { Calculator, DollarSign, TrendingUp } from "lucide-react";
import { useState } from "react";

type CalcTab = "compound" | "mortgage" | "savings";

interface FinanceCalculatorProps {
  windowProps?: Record<string, unknown>;
}

function numFmt(n: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function ResultCard({
  label,
  value,
  sub,
}: { label: string; value: string; sub?: string }) {
  return (
    <div
      className="rounded-xl p-3 flex-1"
      style={{
        background: "var(--os-bg-elevated)",
        border: "1px solid rgba(39,215,224,0.15)",
      }}
    >
      <p
        className="text-[10px] font-semibold mb-1"
        style={{ color: "rgba(39,215,224,0.7)" }}
      >
        {label}
      </p>
      <p
        className="text-lg font-bold"
        style={{ color: "var(--os-text-primary)" }}
      >
        {value}
      </p>
      {sub && (
        <p
          className="text-[10px] mt-0.5"
          style={{ color: "var(--os-text-secondary)" }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

const inputSt = {
  background: "var(--os-border-subtle)",
  border: "1px solid rgba(39,215,224,0.2)",
  color: "var(--os-text-primary)",
  colorScheme: "dark" as const,
};

const lbl = { color: "var(--os-text-secondary)" };

function CompoundInterest() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);
  const [freq, setFreq] = useState(12);

  const r = rate / 100;
  const finalAmt = principal * (1 + r / freq) ** (freq * years);
  const totalInterest = finalAmt - principal;
  const effectiveRate = ((1 + r / freq) ** freq - 1) * 100;

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-semibold block mb-1" style={lbl}>
            Principal ($)
          </p>
          <input
            type="number"
            value={principal}
            min={1}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg text-[12px] outline-none"
            style={inputSt}
          />
        </div>
        <div>
          <p className="text-[11px] font-semibold block mb-1" style={lbl}>
            Annual Rate (%)
          </p>
          <input
            type="number"
            value={rate}
            min={0}
            step={0.1}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg text-[12px] outline-none"
            style={inputSt}
          />
        </div>
        <div>
          <p className="text-[11px] font-semibold block mb-1" style={lbl}>
            Years
          </p>
          <input
            type="number"
            value={years}
            min={1}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg text-[12px] outline-none"
            style={inputSt}
          />
        </div>
        <div>
          <p className="text-[11px] font-semibold block mb-1" style={lbl}>
            Compounds / Year
          </p>
          <select
            value={freq}
            onChange={(e) => setFreq(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg text-[12px] outline-none"
            style={{ ...inputSt, background: "rgba(10,16,20,0.9)" }}
          >
            <option value={1}>Annually (1)</option>
            <option value={4}>Quarterly (4)</option>
            <option value={12}>Monthly (12)</option>
            <option value={365}>Daily (365)</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3">
        <ResultCard label="Final Amount" value={`$${numFmt(finalAmt)}`} />
        <ResultCard
          label="Total Interest"
          value={`$${numFmt(totalInterest)}`}
          sub={`${numFmt((totalInterest / principal) * 100)}% gain`}
        />
        <ResultCard
          label="Effective Rate"
          value={`${numFmt(effectiveRate)}%`}
          sub="per year"
        />
      </div>
      <div
        className="rounded-xl p-3 text-[11px] leading-relaxed"
        style={{
          background: "rgba(39,215,224,0.04)",
          border: "1px solid rgba(39,215,224,0.1)",
          color: "var(--os-text-secondary)",
        }}
      >
        Formula:{" "}
        <span style={{ color: "rgba(39,215,224,0.8)" }}>
          A = P(1 + r/n)^(nt)
        </span>{" "}
        — P=${principal.toLocaleString()}, r={rate}%, n={freq}, t={years}y
      </div>
    </div>
  );
}

function Mortgage() {
  const [loan, setLoan] = useState(300000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);

  const monthlyRate = rate / 100 / 12;
  const n = term * 12;
  const monthly =
    monthlyRate === 0
      ? loan / n
      : (loan * monthlyRate * (1 + monthlyRate) ** n) /
        ((1 + monthlyRate) ** n - 1);
  const totalPaid = monthly * n;
  const totalInterest = totalPaid - loan;
  const principalPct = (loan / totalPaid) * 100;

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-[11px] font-semibold block mb-1" style={lbl}>
            Loan Amount ($)
          </p>
          <input
            type="number"
            value={loan}
            min={1000}
            onChange={(e) => setLoan(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg text-[12px] outline-none"
            style={inputSt}
          />
        </div>
        <div>
          <p className="text-[11px] font-semibold block mb-1" style={lbl}>
            Interest Rate (%)
          </p>
          <input
            type="number"
            value={rate}
            min={0}
            step={0.1}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg text-[12px] outline-none"
            style={inputSt}
          />
        </div>
        <div>
          <p className="text-[11px] font-semibold block mb-1" style={lbl}>
            Term (Years)
          </p>
          <select
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg text-[12px] outline-none"
            style={{ ...inputSt, background: "rgba(10,16,20,0.9)" }}
          >
            {[10, 15, 20, 25, 30].map((v) => (
              <option key={v} value={v}>
                {v} years
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-3">
        <ResultCard label="Monthly Payment" value={`$${numFmt(monthly)}`} />
        <ResultCard label="Total Paid" value={`$${numFmt(totalPaid)}`} />
        <ResultCard
          label="Total Interest"
          value={`$${numFmt(totalInterest)}`}
          sub={`${numFmt((totalInterest / loan) * 100)}% of loan`}
        />
      </div>
      <div className="space-y-2">
        <p
          className="text-[10px] font-semibold"
          style={{ color: "var(--os-text-secondary)" }}
        >
          Payment Breakdown
        </p>
        <div className="h-5 rounded-full overflow-hidden flex">
          <div
            className="h-full transition-all"
            style={{
              width: `${principalPct}%`,
              background: "rgba(39,215,224,0.7)",
            }}
          />
          <div
            className="h-full flex-1"
            style={{ background: "rgba(239,68,68,0.5)" }}
          />
        </div>
        <div className="flex gap-4 text-[11px]">
          <span style={{ color: "rgba(39,215,224,0.8)" }}>
            ■ Principal {numFmt(principalPct)}%
          </span>
          <span style={{ color: "rgba(239,68,68,0.8)" }}>
            ■ Interest {numFmt(100 - principalPct)}%
          </span>
        </div>
      </div>
    </div>
  );
}

function SavingsGoal() {
  const [target, setTarget] = useState(50000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(4);

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

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-[11px] font-semibold block mb-1" style={lbl}>
            Target Amount ($)
          </p>
          <input
            type="number"
            value={target}
            min={100}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg text-[12px] outline-none"
            style={inputSt}
          />
        </div>
        <div>
          <p className="text-[11px] font-semibold block mb-1" style={lbl}>
            Monthly Contribution ($)
          </p>
          <input
            type="number"
            value={monthly}
            min={1}
            onChange={(e) => setMonthly(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg text-[12px] outline-none"
            style={inputSt}
          />
        </div>
        <div>
          <p className="text-[11px] font-semibold block mb-1" style={lbl}>
            Annual Rate (%)
          </p>
          <input
            type="number"
            value={rate}
            min={0}
            step={0.1}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg text-[12px] outline-none"
            style={inputSt}
          />
        </div>
      </div>
      {months >= MAX_MONTHS ? (
        <div
          className="rounded-xl p-3"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <p className="text-[12px]" style={{ color: "rgba(239,68,68,0.8)" }}>
            Goal unreachable with current contributions — increase monthly
            amount.
          </p>
        </div>
      ) : (
        <div className="flex gap-3">
          <ResultCard
            label="Time to Goal"
            value={years > 0 ? `${years}y ${remMonths}m` : `${months}m`}
            sub={`${months} months total`}
          />
          <ResultCard
            label="Total Contributed"
            value={`$${numFmt(totalContributed)}`}
          />
          <ResultCard
            label="Interest Earned"
            value={`$${numFmt(Math.max(0, interestEarned))}`}
            sub={`${numFmt((Math.max(0, interestEarned) / target) * 100)}% of goal`}
          />
        </div>
      )}
    </div>
  );
}

export function FinanceCalculator({ windowProps: _w }: FinanceCalculatorProps) {
  const [tab, setTab] = useState<CalcTab>("compound");

  const tabs: { id: CalcTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "compound",
      label: "Compound Interest",
      icon: <TrendingUp className="w-3.5 h-3.5" />,
    },
    {
      id: "mortgage",
      label: "Mortgage",
      icon: <DollarSign className="w-3.5 h-3.5" />,
    },
    {
      id: "savings",
      label: "Savings Goal",
      icon: <Calculator className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "rgba(8,14,20,0.95)" }}
    >
      <div
        className="flex gap-0 border-b flex-shrink-0"
        style={{
          borderColor: "rgba(39,215,224,0.12)",
          background: "rgba(10,16,20,0.7)",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            data-ocid={`financecalc.${t.id}_tab`}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-semibold transition-all"
            style={{
              color:
                tab === t.id ? "var(--os-accent)" : "var(--os-text-secondary)",
              borderBottom:
                tab === t.id ? "2px solid #27D7E0" : "2px solid transparent",
              background:
                tab === t.id ? "rgba(39,215,224,0.05)" : "transparent",
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {tab === "compound" && <CompoundInterest />}
        {tab === "mortgage" && <Mortgage />}
        {tab === "savings" && <SavingsGoal />}
      </div>
    </div>
  );
}
