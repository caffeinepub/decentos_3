import { Download, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface LineItem {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
}

const CATEGORIES = [
  "Travel",
  "Meals",
  "Accommodation",
  "Software",
  "Office Supplies",
  "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
  Travel: "#3b82f6",
  Meals: "#f97316",
  Accommodation: "#8b5cf6",
  Software: "#06b6d4",
  "Office Supplies": "#22c55e",
  Other: "#6b7280",
};

export default function ExpenseReport() {
  const { data: items, set: saveItems } = useCanisterKV<LineItem[]>(
    "expensereport_items",
    [],
  );
  const [reportTitle, setReportTitle] = useState("Expense Report");
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    category: CATEGORIES[0],
    amount: "",
  });

  const categoryTotals = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = items
        .filter((i) => i.category === cat)
        .reduce((s, i) => s + i.amount, 0);
      return acc;
    },
    {} as Record<string, number>,
  );

  const total = items.reduce((s, i) => s + i.amount, 0);

  function addItem() {
    const amount = Number.parseFloat(form.amount);
    if (!form.description.trim() || Number.isNaN(amount) || amount <= 0) {
      toast.error("Please fill in all fields with a valid amount");
      return;
    }
    const newItem: LineItem = {
      id: `item_${Date.now()}`,
      date: form.date,
      description: form.description.trim(),
      category: form.category,
      amount,
    };
    saveItems([...items, newItem]);
    setForm((prev) => ({ ...prev, description: "", amount: "" }));
    toast.success("Expense added ✓");
  }

  function removeItem(id: string) {
    saveItems(items.filter((i) => i.id !== id));
  }

  function exportCSV() {
    const header = "Date,Description,Category,Amount\n";
    const rows = items
      .map(
        (i) =>
          `${i.date},"${i.description}",${i.category},${i.amount.toFixed(2)}`,
      )
      .join("\n");
    const csv = `${header + rows}\n\nTotal,,,$${total.toFixed(2)}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportTitle.replace(/\s+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported as CSV");
  }

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{
        background: "var(--os-bg-app)",
        color: "var(--os-text-primary)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--os-border)" }}
      >
        <input
          className="font-semibold text-sm bg-transparent outline-none"
          style={{ color: "var(--os-text-primary)" }}
          value={reportTitle}
          onChange={(e) => setReportTitle(e.target.value)}
        />
        <button
          type="button"
          onClick={exportCSV}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
          style={{
            background: "var(--os-accent)",
            color: "var(--os-text-primary)",
          }}
        >
          <Download size={12} />
          Export CSV
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: add form + items */}
        <div
          className="flex flex-col flex-1 overflow-hidden border-r"
          style={{ borderColor: "var(--os-border)" }}
        >
          {/* Add form */}
          <div
            className="p-4 space-y-2 border-b"
            style={{ borderColor: "var(--os-border)" }}
          >
            <p
              className="text-xs font-medium"
              style={{ color: "var(--os-text-muted)" }}
            >
              Add Expense
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="expense-date"
                  className="text-xs"
                  style={{ color: "var(--os-text-secondary)" }}
                >
                  Date
                </label>
                <input
                  id="expense-date"
                  type="date"
                  className="w-full text-xs px-2 py-1.5 rounded-lg border mt-0.5"
                  style={{
                    background: "var(--os-bg-secondary)",
                    color: "var(--os-text-primary)",
                    borderColor: "var(--os-border)",
                    colorScheme: "dark",
                  }}
                  value={form.date}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, date: e.target.value }))
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="expense-category"
                  className="text-xs"
                  style={{ color: "var(--os-text-secondary)" }}
                >
                  Category
                </label>
                <select
                  id="expense-category"
                  className="w-full text-xs px-2 py-1.5 rounded-lg border mt-0.5 outline-none"
                  style={{
                    background: "var(--os-bg-secondary)",
                    color: "var(--os-text-primary)",
                    borderColor: "var(--os-border)",
                  }}
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="expense-desc"
                  className="text-xs"
                  style={{ color: "var(--os-text-secondary)" }}
                >
                  Description
                </label>
                <input
                  id="expense-desc"
                  type="text"
                  className="w-full text-xs px-2 py-1.5 rounded-lg border mt-0.5"
                  style={{
                    background: "var(--os-bg-secondary)",
                    color: "var(--os-text-primary)",
                    borderColor: "var(--os-border)",
                  }}
                  placeholder="What was this expense for?"
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                />
              </div>
              <div>
                <label
                  htmlFor="expense-amount"
                  className="text-xs"
                  style={{ color: "var(--os-text-secondary)" }}
                >
                  Amount ($)
                </label>
                <input
                  id="expense-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full text-xs px-2 py-1.5 rounded-lg border mt-0.5"
                  style={{
                    background: "var(--os-bg-secondary)",
                    color: "var(--os-text-primary)",
                    borderColor: "var(--os-border)",
                  }}
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, amount: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addItem}
                  className="w-full flex items-center justify-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                  style={{
                    background: "var(--os-accent)",
                    color: "var(--os-text-primary)",
                  }}
                >
                  <Plus size={12} />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center h-32 text-center"
                data-ocid="expensereport.empty_state"
              >
                <p
                  className="text-sm"
                  style={{ color: "var(--os-text-muted)" }}
                >
                  No expenses yet. Add one above.
                </p>
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--os-border)" }}>
                    {["Date", "Description", "Category", "Amount", ""].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left font-medium"
                          style={{ color: "var(--os-text-muted)" }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr
                      key={item.id}
                      data-ocid={`expensereport.item.${idx + 1}`}
                      className="hover:opacity-80 transition-opacity"
                      style={{ borderBottom: "1px solid var(--os-border)" }}
                    >
                      <td
                        className="px-3 py-2"
                        style={{ color: "var(--os-text-secondary)" }}
                      >
                        {item.date}
                      </td>
                      <td
                        className="px-3 py-2"
                        style={{ color: "var(--os-text-primary)" }}
                      >
                        {item.description}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className="px-1.5 py-0.5 rounded text-xs"
                          style={{
                            background: `${CATEGORY_COLORS[item.category]}22`,
                            color: CATEGORY_COLORS[item.category],
                          }}
                        >
                          {item.category}
                        </span>
                      </td>
                      <td
                        className="px-3 py-2 font-mono"
                        style={{ color: "var(--os-text-primary)" }}
                      >
                        ${item.amount.toFixed(2)}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="opacity-40 hover:opacity-100 transition-opacity"
                          style={{ color: "#ef4444" }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right: summary */}
        <div className="w-48 flex flex-col p-4 gap-3" style={{ flexShrink: 0 }}>
          <p
            className="text-xs font-semibold"
            style={{ color: "var(--os-text-secondary)" }}
          >
            Summary
          </p>
          <div className="space-y-2">
            {CATEGORIES.filter((c) => categoryTotals[c] > 0).map((cat) => (
              <div key={cat}>
                <div className="flex justify-between text-xs mb-0.5">
                  <span style={{ color: "var(--os-text-secondary)" }}>
                    {cat}
                  </span>
                  <span
                    className="font-mono"
                    style={{ color: CATEGORY_COLORS[cat] }}
                  >
                    ${categoryTotals[cat].toFixed(2)}
                  </span>
                </div>
                <div
                  className="h-1 rounded-full overflow-hidden"
                  style={{ background: "var(--os-bg-secondary)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${total > 0 ? (categoryTotals[cat] / total) * 100 : 0}%`,
                      background: CATEGORY_COLORS[cat],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            className="mt-auto pt-3 border-t"
            style={{ borderColor: "var(--os-border)" }}
          >
            <div className="flex justify-between text-sm font-semibold">
              <span style={{ color: "var(--os-text-primary)" }}>Total</span>
              <span style={{ color: "var(--os-accent)" }}>
                ${total.toFixed(2)}
              </span>
            </div>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--os-text-muted)" }}
            >
              {items.length} expense{items.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
