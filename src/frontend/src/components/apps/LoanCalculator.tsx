import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface Amortization {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface Result {
  monthly: number;
  total: number;
  totalInterest: number;
  schedule: Amortization[];
}

function calculate(
  principal: number,
  annualRate: number,
  years: number,
): Result {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  const monthly =
    r === 0
      ? principal / n
      : (principal * (r * (1 + r) ** n)) / ((1 + r) ** n - 1);
  const total = monthly * n;
  const totalInterest = total - principal;
  let balance = principal;
  const schedule: Amortization[] = [];
  for (let i = 1; i <= Math.min(n, 24); i++) {
    const interestPayment = balance * r;
    const principalPayment = monthly - interestPayment;
    balance -= principalPayment;
    schedule.push({
      month: i,
      payment: monthly,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance),
    });
  }
  return { monthly, total, totalInterest, schedule };
}

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

function PieChart({
  principal,
  interest,
}: { principal: number; interest: number }) {
  const total = principal + interest;
  const principalPct = principal / total;
  const r = 70;
  const cx = 90;
  const cy = 90;
  const circ = 2 * Math.PI * r;
  const principalDash = principalPct * circ;
  const interestDash = circ - principalDash;
  return (
    <div className="flex items-center gap-6">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <title>Loan breakdown</title>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--os-border-subtle)"
          strokeWidth="28"
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--os-accent)"
          strokeWidth="28"
          strokeDasharray={`${principalDash} ${interestDash}`}
          strokeDashoffset={circ * 0.25}
          strokeLinecap="butt"
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#F97316"
          strokeWidth="28"
          strokeDasharray={`${interestDash} ${principalDash}`}
          strokeDashoffset={circ * 0.25 - principalDash}
          strokeLinecap="butt"
        />
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fill="rgba(220,235,240,0.9)"
          fontSize="13"
          fontWeight="700"
        >
          {fmt(principal + interest)}
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fill="rgba(180,200,210,0.4)"
          fontSize="10"
        >
          total cost
        </text>
      </svg>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ background: "var(--os-accent)" }}
          />
          <div>
            <p className="text-[10px] text-muted-foreground/60">Principal</p>
            <p className="text-sm font-bold text-foreground">
              {fmt(principal)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ background: "#F97316" }}
          />
          <div>
            <p className="text-[10px] text-muted-foreground/60">Interest</p>
            <p className="text-sm font-bold" style={{ color: "#F97316" }}>
              {fmt(interest)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LoanInputs {
  principal: string;
  rate: string;
  years: string;
}

interface Props {
  windowProps?: Record<string, unknown>;
}

export function LoanCalculator(_: Props) {
  const {
    data: savedInputs,
    set: saveInputs,
    loading,
  } = useCanisterKV<LoanInputs>("decentos_loancalc", {
    principal: "250000",
    rate: "6.5",
    years: "30",
  });
  const [principal, setPrincipal] = useState("250000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");
  const [result, setResult] = useState<Result | null>(() =>
    calculate(250000, 6.5, 30),
  );
  const [tab, setTab] = useState<"summary" | "amortization">("summary");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!loading && !initialized) {
      setPrincipal(savedInputs.principal);
      setRate(savedInputs.rate);
      setYears(savedInputs.years);
      setResult(
        calculate(
          Number.parseFloat(savedInputs.principal),
          Number.parseFloat(savedInputs.rate),
          Number.parseInt(savedInputs.years),
        ),
      );
      setInitialized(true);
    }
  }, [loading, savedInputs, initialized]);

  const handleCalc = () => {
    const p = Number.parseFloat(principal);
    const r = Number.parseFloat(rate);
    const y = Number.parseInt(years);
    if (
      Number.isNaN(p) ||
      Number.isNaN(r) ||
      Number.isNaN(y) ||
      p <= 0 ||
      r < 0 ||
      y <= 0
    )
      return;
    setResult(calculate(p, r, y));
    saveInputs({ principal, rate, years });
  };

  const cardStyle =
    "flex flex-col items-center justify-center rounded-xl border border-border bg-muted/50 p-4 gap-1";

  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{ background: "rgba(11,15,18,0.7)" }}
      >
        <Loader2
          className="w-6 h-6 animate-spin"
          style={{ color: "rgba(39,215,224,0.7)" }}
        />
      </div>
    );
  }

  return (
    <div
      className="flex h-full flex-col gap-3 overflow-hidden p-4"
      style={{ background: "rgba(11,15,18,0.7)" }}
    >
      <div className="grid grid-cols-3 gap-3 flex-shrink-0">
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground/60">
            Principal ($)
          </Label>
          <Input
            data-ocid="loancalc.input"
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="border-border bg-muted/50 text-foreground"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground/60">
            Annual Rate (%)
          </Label>
          <Input
            data-ocid="loancalc.input"
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="border-border bg-muted/50 text-foreground"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground/60">
            Term (years)
          </Label>
          <Input
            data-ocid="loancalc.input"
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="border-border bg-muted/50 text-foreground"
          />
        </div>
      </div>
      <Button
        data-ocid="loancalc.submit_button"
        onClick={handleCalc}
        style={{ background: "var(--os-accent)", color: "#000" }}
        className="font-semibold flex-shrink-0"
      >
        Calculate
      </Button>

      {result && (
        <>
          <div className="grid grid-cols-3 gap-3 flex-shrink-0">
            <div className={cardStyle}>
              <span className="text-xs text-muted-foreground/60">
                Monthly Payment
              </span>
              <span
                className="text-lg font-bold"
                style={{ color: "var(--os-accent)" }}
              >
                {fmt(result.monthly)}
              </span>
            </div>
            <div className={cardStyle}>
              <span className="text-xs text-muted-foreground/60">
                Total Payment
              </span>
              <span className="text-lg font-bold text-foreground">
                {fmt(result.total)}
              </span>
            </div>
            <div className={cardStyle}>
              <span className="text-xs text-muted-foreground/60">
                Total Interest
              </span>
              <span className="text-lg font-bold" style={{ color: "#F97316" }}>
                {fmt(result.totalInterest)}
              </span>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {(["summary", "amortization"] as const).map((t) => (
              <button
                key={t}
                type="button"
                data-ocid={`loancalc.${t}.tab`}
                onClick={() => setTab(t)}
                className="px-3 py-1 rounded text-xs transition-all capitalize"
                style={{
                  background:
                    tab === t
                      ? "rgba(39,215,224,0.15)"
                      : "var(--os-border-subtle)",
                  color:
                    tab === t ? "var(--os-accent)" : "var(--os-text-secondary)",
                  border: `1px solid ${tab === t ? "rgba(39,215,224,0.4)" : "var(--os-border-subtle)"}`,
                }}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === "summary" ? (
            <div className="flex-1 flex items-start justify-center overflow-auto">
              <PieChart
                principal={Number.parseFloat(principal)}
                interest={result.totalInterest}
              />
            </div>
          ) : (
            <ScrollArea className="flex-1">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    {[
                      "Month",
                      "Payment",
                      "Principal",
                      "Interest",
                      "Balance",
                    ].map((h) => (
                      <TableHead
                        key={h}
                        className="text-muted-foreground/60 text-xs"
                      >
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.schedule.map((row) => (
                    <TableRow
                      key={row.month}
                      className="border-white/5 hover:bg-muted/50"
                    >
                      <TableCell className="text-muted-foreground text-xs">
                        {row.month}
                      </TableCell>
                      <TableCell className="text-foreground text-xs">
                        {fmt(row.payment)}
                      </TableCell>
                      <TableCell
                        className="text-xs"
                        style={{ color: "var(--os-accent)" }}
                      >
                        {fmt(row.principal)}
                      </TableCell>
                      <TableCell
                        className="text-xs"
                        style={{ color: "#F97316" }}
                      >
                        {fmt(row.interest)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {fmt(row.balance)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </>
      )}
    </div>
  );
}
