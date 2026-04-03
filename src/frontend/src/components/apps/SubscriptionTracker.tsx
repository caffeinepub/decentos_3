import { AlertCircle, CreditCard, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

type BillingCycle = "monthly" | "yearly";
type SubCategory = "streaming" | "software" | "utilities" | "other";
type SubStatus = "active" | "cancelled";

interface Subscription {
  id: string;
  name: string;
  cost: number;
  billingCycle: BillingCycle;
  renewalDate: string;
  category: SubCategory;
  status: SubStatus;
  notes: string;
}

const BG = "rgba(11,15,18,0.6)";
const BORDER = "rgba(42,58,66,0.8)";
const CYAN = "rgba(39,215,224,0.8)";
const TEXT = "rgba(220,235,240,0.9)";
const MUTED = "rgba(180,200,210,0.45)";
const BTN_BG = "rgba(39,215,224,0.12)";
const BTN_BORDER = "rgba(39,215,224,0.3)";

const INPUT_STYLE: React.CSSProperties = {
  background: "var(--os-border-subtle)",
  border: `1px solid ${BORDER}`,
  borderRadius: 6,
  color: TEXT,
  padding: "6px 10px",
  fontSize: 12,
  outline: "none",
  width: "100%",
};

const CATEGORY_COLORS: Record<SubCategory, string> = {
  streaming: "rgba(168,85,247,0.8)",
  software: "rgba(39,215,224,0.8)",
  utilities: "rgba(245,158,11,0.8)",
  other: "rgba(148,163,184,0.8)",
};

function getRenewalStatus(dateStr: string): "ok" | "soon" | "overdue" {
  const diff = (new Date(dateStr).getTime() - Date.now()) / 86400000;
  if (diff < 0) return "overdue";
  if (diff < 7) return "soon";
  return "ok";
}

const EMPTY: Omit<Subscription, "id"> = {
  name: "",
  cost: 0,
  billingCycle: "monthly",
  renewalDate: new Date().toISOString().slice(0, 10),
  category: "software",
  status: "active",
  notes: "",
};

export function SubscriptionTracker() {
  const { data: subs, set: setSubs } = useCanisterKV<Subscription[]>(
    "decent-subscriptions",
    [],
  );
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Subscription, "id">>(EMPTY);

  const activeSubs = subs.filter((s) => s.status === "active");
  const monthlyTotal = activeSubs.reduce((sum, s) => {
    return sum + (s.billingCycle === "monthly" ? s.cost : s.cost / 12);
  }, 0);

  const openAdd = () => {
    setForm(EMPTY);
    setEditId(null);
    setShowAdd(true);
  };

  const openEdit = (s: Subscription) => {
    setForm({
      name: s.name,
      cost: s.cost,
      billingCycle: s.billingCycle,
      renewalDate: s.renewalDate,
      category: s.category,
      status: s.status,
      notes: s.notes,
    });
    setEditId(s.id);
    setShowAdd(true);
  };

  const saveSub = () => {
    if (!form.name.trim()) return;
    if (editId) {
      setSubs(subs.map((s) => (s.id === editId ? { ...s, ...form } : s)));
    } else {
      setSubs([...subs, { id: `sub_${Date.now()}`, ...form }]);
    }
    setShowAdd(false);
    setEditId(null);
  };

  const deleteSub = (id: string) => setSubs(subs.filter((s) => s.id !== id));

  const sorted = [...subs].sort((a, b) =>
    a.renewalDate.localeCompare(b.renewalDate),
  );

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: BG, color: TEXT, fontSize: 13 }}
      data-ocid="subscriptions.panel"
    >
      {/* Header */}
      <div
        className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: BORDER }}
      >
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" style={{ color: CYAN }} />
          <span className="font-semibold text-sm">Subscription Tracker</span>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{
            background: BTN_BG,
            border: `1px solid ${BTN_BORDER}`,
            color: CYAN,
          }}
          data-ocid="subscriptions.primary_button"
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>

      {/* Monthly Summary */}
      <div
        className="px-4 py-3 border-b"
        style={{ borderColor: BORDER, background: "rgba(39,215,224,0.04)" }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: MUTED }}>
            Total Monthly Cost
          </span>
          <span className="text-lg font-bold" style={{ color: CYAN }}>
            ${monthlyTotal.toFixed(2)}/mo
          </span>
        </div>
        <div className="mt-1 flex gap-4 text-xs" style={{ color: MUTED }}>
          <span>
            {activeSubs.length} active subscription
            {activeSubs.length !== 1 ? "s" : ""}
          </span>
          <span>${(monthlyTotal * 12).toFixed(2)}/yr</span>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAdd && (
        <div
          className="p-4 border-b"
          style={{ borderColor: BORDER, background: "rgba(10,16,20,0.8)" }}
          data-ocid="subscriptions.modal"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <p
                className="block text-[10px] font-semibold mb-1"
                style={{ color: CYAN }}
              >
                NAME
              </p>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Netflix, Spotify..."
                style={INPUT_STYLE}
                data-ocid="subscriptions.input"
              />
            </div>
            <div>
              <p
                className="block text-[10px] font-semibold mb-1"
                style={{ color: CYAN }}
              >
                COST ($)
              </p>
              <input
                type="number"
                value={form.cost}
                onChange={(e) =>
                  setForm({ ...form, cost: Number(e.target.value) })
                }
                style={INPUT_STYLE}
                data-ocid="subscriptions.input"
              />
            </div>
            <div>
              <p
                className="block text-[10px] font-semibold mb-1"
                style={{ color: CYAN }}
              >
                BILLING
              </p>
              <select
                value={form.billingCycle}
                onChange={(e) =>
                  setForm({
                    ...form,
                    billingCycle: e.target.value as BillingCycle,
                  })
                }
                style={INPUT_STYLE}
                data-ocid="subscriptions.select"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <p
                className="block text-[10px] font-semibold mb-1"
                style={{ color: CYAN }}
              >
                RENEWAL DATE
              </p>
              <input
                type="date"
                value={form.renewalDate}
                onChange={(e) =>
                  setForm({ ...form, renewalDate: e.target.value })
                }
                style={INPUT_STYLE}
                data-ocid="subscriptions.input"
              />
            </div>
            <div>
              <p
                className="block text-[10px] font-semibold mb-1"
                style={{ color: CYAN }}
              >
                CATEGORY
              </p>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as SubCategory })
                }
                style={INPUT_STYLE}
                data-ocid="subscriptions.select"
              >
                <option value="streaming">Streaming</option>
                <option value="software">Software</option>
                <option value="utilities">Utilities</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <p
                className="block text-[10px] font-semibold mb-1"
                style={{ color: CYAN }}
              >
                STATUS
              </p>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as SubStatus })
                }
                style={INPUT_STYLE}
                data-ocid="subscriptions.select"
              >
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-span-2">
              <p
                className="block text-[10px] font-semibold mb-1"
                style={{ color: CYAN }}
              >
                NOTES
              </p>
              <input
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Optional notes"
                style={INPUT_STYLE}
                data-ocid="subscriptions.input"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={saveSub}
              disabled={!form.name.trim()}
              className="flex-1 py-2 rounded-lg text-xs font-medium"
              style={{
                background: BTN_BG,
                border: `1px solid ${BTN_BORDER}`,
                color: CYAN,
                opacity: form.name.trim() ? 1 : 0.5,
              }}
              data-ocid="subscriptions.save_button"
            >
              {editId ? "Update" : "Add Subscription"}
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 rounded-lg text-xs"
              style={{
                background: "var(--os-border-subtle)",
                border: `1px solid ${BORDER}`,
                color: TEXT,
              }}
              data-ocid="subscriptions.cancel_button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4">
        {sorted.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-full"
            style={{ color: MUTED }}
            data-ocid="subscriptions.empty_state"
          >
            <CreditCard className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">No subscriptions yet</p>
            <p className="text-xs mt-1">Add your first subscription above</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((s, i) => {
              const status = getRenewalStatus(s.renewalDate);
              const renewColor =
                status === "overdue"
                  ? "rgba(248,113,113,0.9)"
                  : status === "soon"
                    ? "rgba(251,191,36,0.9)"
                    : MUTED;
              const monthlyCost =
                s.billingCycle === "monthly" ? s.cost : s.cost / 12;
              return (
                <div
                  key={s.id}
                  className="p-3 rounded-xl flex items-center gap-3"
                  style={{
                    background: "rgba(10,16,20,0.6)",
                    border: `1px solid ${s.status === "cancelled" ? "rgba(42,58,66,0.4)" : BORDER}`,
                    opacity: s.status === "cancelled" ? 0.6 : 1,
                  }}
                  data-ocid={`subscriptions.item.${i + 1}`}
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: CATEGORY_COLORS[s.category] }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-medium text-sm truncate"
                        style={{ color: TEXT }}
                      >
                        {s.name}
                      </span>
                      {s.status === "cancelled" && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded"
                          style={{
                            background: "rgba(148,163,184,0.15)",
                            color: MUTED,
                          }}
                        >
                          cancelled
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs" style={{ color: MUTED }}>
                        {s.category}
                      </span>
                      <span
                        className="text-xs flex items-center gap-1"
                        style={{ color: renewColor }}
                      >
                        {status !== "ok" && <AlertCircle className="w-3 h-3" />}
                        Renews {new Date(s.renewalDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold" style={{ color: CYAN }}>
                      ${s.cost.toFixed(2)}
                    </p>
                    <p className="text-[10px]" style={{ color: MUTED }}>
                      {s.billingCycle === "yearly"
                        ? `$${monthlyCost.toFixed(2)}/mo`
                        : "monthly"}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(s)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: CYAN, background: BTN_BG }}
                      data-ocid={`subscriptions.edit_button.${i + 1}`}
                    >
                      <Plus
                        className="w-3 h-3"
                        style={{ transform: "rotate(45deg)" }}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSub(s.id)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{
                        color: "rgba(248,113,113,0.8)",
                        background: "rgba(248,113,113,0.08)",
                      }}
                      data-ocid={`subscriptions.delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
