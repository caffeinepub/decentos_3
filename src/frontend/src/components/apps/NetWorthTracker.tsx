import { Plus, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface LineItem {
  id: string;
  label: string;
  amount: number;
}
interface NetWorthData {
  assets: LineItem[];
  liabilities: LineItem[];
}

const DEFAULT_DATA: NetWorthData = {
  assets: [
    { id: "a1", label: "Checking Account", amount: 5200 },
    { id: "a2", label: "Savings Account", amount: 18000 },
    { id: "a3", label: "Investments", amount: 32000 },
  ],
  liabilities: [
    { id: "l1", label: "Credit Card", amount: 2400 },
    { id: "l2", label: "Student Loan", amount: 15000 },
  ],
};

function genId() {
  return Math.random().toString(36).slice(2, 9);
}
function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function ItemRow({
  item,
  onUpdate,
  onDelete,
  ocidBase,
}: {
  item: LineItem;
  onUpdate: (id: string, label: string, amount: number) => void;
  onDelete: (id: string) => void;
  ocidBase: string;
}) {
  return (
    <div
      className="flex items-center gap-2 py-1.5 border-b"
      style={{ borderColor: "var(--os-border-subtle)" }}
    >
      <input
        value={item.label}
        onChange={(e) => onUpdate(item.id, e.target.value, item.amount)}
        placeholder="Label"
        className="flex-1 bg-transparent text-sm outline-none"
        style={{ color: "var(--os-text-primary)" }}
        data-ocid={`${ocidBase}.input`}
      />
      <span className="text-xs" style={{ color: "var(--os-text-muted)" }}>
        $
      </span>
      <input
        type="number"
        value={item.amount}
        onChange={(e) =>
          onUpdate(item.id, item.label, Number.parseFloat(e.target.value) || 0)
        }
        className="w-24 bg-transparent text-right text-sm outline-none font-mono"
        style={{ color: "rgba(39,215,224,1)" }}
        data-ocid={`${ocidBase}.input`}
      />
      <button
        type="button"
        onClick={() => onDelete(item.id)}
        data-ocid={`${ocidBase}.delete_button`}
        className="p-1 rounded hover:bg-red-500/10 transition-colors"
      >
        <Trash2
          className="w-3.5 h-3.5"
          style={{ color: "rgba(255,100,100,0.5)" }}
        />
      </button>
    </div>
  );
}

export function NetWorthTracker() {
  const { data, set } = useCanisterKV<NetWorthData>(
    "decentos_networth",
    DEFAULT_DATA,
  );

  const update = (
    section: "assets" | "liabilities",
    id: string,
    label: string,
    amount: number,
  ) =>
    set({
      ...data,
      [section]: data[section].map((item) =>
        item.id === id ? { ...item, label, amount } : item,
      ),
    });
  const add = (section: "assets" | "liabilities") =>
    set({
      ...data,
      [section]: [...data[section], { id: genId(), label: "", amount: 0 }],
    });
  const remove = (section: "assets" | "liabilities", id: string) =>
    set({ ...data, [section]: data[section].filter((i) => i.id !== id) });

  const totalAssets = data.assets.reduce((s, i) => s + i.amount, 0);
  const totalLiabilities = data.liabilities.reduce((s, i) => s + i.amount, 0);
  const netWorth = totalAssets - totalLiabilities;
  const assetRatio =
    totalAssets + totalLiabilities > 0
      ? (totalAssets / (totalAssets + totalLiabilities)) * 100
      : 50;

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{
        background: "rgba(9,13,16,0.9)",
        color: "var(--os-text-primary)",
      }}
      data-ocid="networth.panel"
    >
      <div
        className="flex flex-col items-center py-6 flex-shrink-0 border-b"
        style={{
          borderColor: "rgba(39,215,224,0.1)",
          background: "rgba(18,32,38,0.5)",
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          {netWorth >= 0 ? (
            <TrendingUp
              className="w-5 h-5"
              style={{ color: "rgba(39,215,224,1)" }}
            />
          ) : (
            <TrendingDown
              className="w-5 h-5"
              style={{ color: "rgba(255,100,100,1)" }}
            />
          )}
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--os-text-secondary)" }}
          >
            Net Worth
          </span>
        </div>
        <div
          className="text-4xl font-bold font-mono"
          style={{
            color: netWorth >= 0 ? "rgba(39,215,224,1)" : "rgba(255,100,100,1)",
          }}
        >
          {fmt(netWorth)}
        </div>
        <div className="flex gap-6 mt-3 text-xs">
          <div className="text-center">
            <div style={{ color: "var(--os-text-secondary)" }}>Assets</div>
            <div
              className="font-semibold font-mono"
              style={{ color: "rgba(100,220,100,0.9)" }}
            >
              {fmt(totalAssets)}
            </div>
          </div>
          <div className="text-center">
            <div style={{ color: "var(--os-text-secondary)" }}>Liabilities</div>
            <div
              className="font-semibold font-mono"
              style={{ color: "rgba(255,120,120,0.9)" }}
            >
              {fmt(totalLiabilities)}
            </div>
          </div>
        </div>
        <div
          className="w-64 h-2 rounded-full mt-3 overflow-hidden"
          style={{ background: "rgba(255,120,120,0.2)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${assetRatio}%`,
              background: "rgba(100,220,100,0.6)",
            }}
          />
        </div>
        <div
          className="flex w-64 justify-between text-[10px] mt-1"
          style={{ color: "var(--os-text-muted)" }}
        >
          <span>Assets {Math.round(assetRatio)}%</span>
          <span>Liabilities {Math.round(100 - assetRatio)}%</span>
        </div>
      </div>
      <div className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div
            className="rounded-xl p-4"
            style={{
              background: "rgba(100,220,100,0.04)",
              border: "1px solid rgba(100,220,100,0.1)",
            }}
            data-ocid="networth.card"
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "rgba(100,220,100,0.7)" }}
              >
                Assets
              </span>
              <button
                type="button"
                onClick={() => add("assets")}
                data-ocid="networth.primary_button"
                className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded"
                style={{
                  background: "rgba(100,220,100,0.1)",
                  color: "rgba(100,220,100,0.8)",
                }}
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            {data.assets.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onUpdate={(id, label, amount) =>
                  update("assets", id, label, amount)
                }
                onDelete={(id) => remove("assets", id)}
                ocidBase="networth.assets"
              />
            ))}
            <div
              className="mt-2 pt-2 border-t text-right text-xs font-mono font-semibold"
              style={{
                borderColor: "rgba(100,220,100,0.1)",
                color: "rgba(100,220,100,0.9)",
              }}
            >
              {fmt(totalAssets)}
            </div>
          </div>
          <div
            className="rounded-xl p-4"
            style={{
              background: "rgba(255,100,100,0.04)",
              border: "1px solid rgba(255,100,100,0.1)",
            }}
            data-ocid="networth.card"
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "rgba(255,120,120,0.7)" }}
              >
                Liabilities
              </span>
              <button
                type="button"
                onClick={() => add("liabilities")}
                data-ocid="networth.secondary_button"
                className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded"
                style={{
                  background: "rgba(255,100,100,0.1)",
                  color: "rgba(255,120,120,0.8)",
                }}
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            {data.liabilities.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onUpdate={(id, label, amount) =>
                  update("liabilities", id, label, amount)
                }
                onDelete={(id) => remove("liabilities", id)}
                ocidBase="networth.liabilities"
              />
            ))}
            <div
              className="mt-2 pt-2 border-t text-right text-xs font-mono font-semibold"
              style={{
                borderColor: "rgba(255,100,100,0.1)",
                color: "rgba(255,120,120,0.9)",
              }}
            >
              {fmt(totalLiabilities)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
