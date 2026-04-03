import { MessageSquare, Plus, Trash2, UserCheck, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

type RelType = "Personal" | "Professional" | "Partner" | "Family";

const REL_COLORS: Record<RelType, string> = {
  Personal: "rgba(39,215,224,0.8)",
  Professional: "rgba(99,179,237,0.85)",
  Partner: "rgba(246,135,179,0.85)",
  Family: "rgba(134,239,172,0.85)",
};
const REL_BG: Record<RelType, string> = {
  Personal: "rgba(39,215,224,0.12)",
  Professional: "rgba(99,179,237,0.12)",
  Partner: "rgba(246,135,179,0.12)",
  Family: "rgba(134,239,172,0.12)",
};

interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  relationship: RelType;
  lastContacted: string;
  followUp: string;
  notes: string;
}

function genId() {
  return `crm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

const EMPTY: Omit<Contact, "id"> = {
  name: "",
  company: "",
  email: "",
  phone: "",
  relationship: "Personal",
  lastContacted: "",
  followUp: "",
  notes: "",
};

function Field({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        className="block text-[10px] font-semibold mb-0.5"
        style={{ color: "rgba(39,215,224,0.6)" }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "var(--os-border-subtle)",
  border: "1px solid rgba(39,215,224,0.15)",
  borderRadius: 6,
  color: "rgba(220,235,240,0.9)",
  padding: "4px 8px",
  fontSize: 12,
  outline: "none",
};

export function PersonalCRM() {
  const { data: contacts, set: setContacts } = useCanisterKV<Contact[]>(
    "decent-crm",
    [],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<Omit<Contact, "id">>(EMPTY);
  const [logEntry, setLogEntry] = useState("");

  const filtered = useMemo(() => {
    if (!search) return contacts;
    const q = search.toLowerCase();
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q),
    );
  }, [contacts, search]);

  const selected = contacts.find((c) => c.id === selectedId) ?? null;

  const addContact = useCallback(() => {
    if (!form.name.trim()) return;
    const contact: Contact = { id: genId(), ...form };
    const updated = [contact, ...contacts];
    setContacts(updated);
    setSelectedId(contact.id);
    setShowAdd(false);
    setForm(EMPTY);
  }, [contacts, form, setContacts]);

  const deleteContact = useCallback(
    (id: string) => {
      const updated = contacts.filter((c) => c.id !== id);
      setContacts(updated);
      setSelectedId(updated[0]?.id ?? null);
    },
    [contacts, setContacts],
  );

  const updateField = useCallback(
    (field: keyof Contact, value: string) => {
      if (!selectedId) return;
      const updated = contacts.map((c) =>
        c.id === selectedId ? { ...c, [field]: value } : c,
      );
      setContacts(updated);
    },
    [contacts, selectedId, setContacts],
  );

  const logInteraction = useCallback(() => {
    if (!selectedId || !logEntry.trim()) return;
    const timestamp = new Date().toLocaleString();
    const entry = `[${timestamp}] ${logEntry.trim()}`;
    const note = selected?.notes ? `${entry}\n\n${selected.notes}` : entry;
    updateField("notes", note);
    updateField("lastContacted", new Date().toISOString().split("T")[0]);
    setLogEntry("");
  }, [selectedId, logEntry, selected, updateField]);

  return (
    <div className="flex h-full" style={{ background: "rgba(11,15,18,0.6)" }}>
      {/* Sidebar */}
      <div
        className="w-52 flex-shrink-0 flex flex-col border-r"
        style={{
          borderColor: "rgba(42,58,66,0.8)",
          background: "rgba(10,16,20,0.8)",
        }}
      >
        <div
          className="flex items-center justify-between px-3 py-2.5 border-b flex-shrink-0"
          style={{
            borderColor: "rgba(42,58,66,0.8)",
            background: "rgba(18,32,38,0.5)",
          }}
        >
          <span className="text-xs font-semibold text-foreground/80">
            Contacts
          </span>
          <button
            type="button"
            onClick={() => {
              setShowAdd(true);
              setForm(EMPTY);
            }}
            data-ocid="personalcrm.add_button"
            className="flex items-center justify-center w-6 h-6 rounded transition-all hover:bg-muted/50"
            style={{
              background: "rgba(39,215,224,0.1)",
              border: "1px solid rgba(39,215,224,0.3)",
              color: "rgba(39,215,224,0.9)",
            }}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div
          className="px-2 py-2 border-b flex-shrink-0"
          style={{ borderColor: "rgba(42,58,66,0.4)" }}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            data-ocid="personalcrm.search_input"
            className="w-full px-2 py-1 text-[10px] rounded outline-none"
            style={{
              background: "var(--os-border-subtle)",
              border: "1px solid rgba(39,215,224,0.15)",
              color: "var(--os-text-primary)",
            }}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center h-full gap-2 p-4"
              data-ocid="personalcrm.empty_state"
            >
              <UserCheck
                className="w-8 h-8"
                style={{ color: "rgba(39,215,224,0.2)" }}
              />
              <p className="text-[10px] text-muted-foreground/60 text-center">
                {search ? "No matches" : "No contacts yet"}
              </p>
            </div>
          ) : (
            filtered.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                data-ocid={`personalcrm.item.${i + 1}`}
                className="w-full text-left px-3 py-2.5 border-b group transition-colors"
                style={{
                  borderColor: "rgba(42,58,66,0.4)",
                  background:
                    selectedId === c.id
                      ? "rgba(39,215,224,0.08)"
                      : "transparent",
                  borderLeft:
                    selectedId === c.id
                      ? "2px solid rgba(39,215,224,0.6)"
                      : "2px solid transparent",
                }}
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    className="text-xs font-medium truncate"
                    style={{
                      color:
                        selectedId === c.id
                          ? "rgba(39,215,224,0.9)"
                          : "rgba(200,220,230,0.8)",
                    }}
                  >
                    {c.name}
                  </span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      background: REL_BG[c.relationship],
                      color: REL_COLORS[c.relationship],
                    }}
                  >
                    {c.relationship}
                  </span>
                </div>
                {c.lastContacted && (
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                    Last: {c.lastContacted}
                  </p>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {selected ? (
          <div className="flex-1 overflow-y-auto">
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
              style={{
                borderColor: "rgba(42,58,66,0.6)",
                background: "rgba(18,32,38,0.5)",
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: REL_BG[selected.relationship],
                    color: REL_COLORS[selected.relationship],
                  }}
                >
                  {selected.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {selected.name}
                  </div>
                  {selected.company && (
                    <div className="text-[10px] text-muted-foreground/60">
                      {selected.company}
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => deleteContact(selected.id)}
                data-ocid="personalcrm.delete_button"
                className="text-destructive/50 hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 grid grid-cols-2 gap-3">
              <Field label="Name">
                <input
                  style={INPUT_STYLE}
                  value={selected.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </Field>
              <Field label="Company">
                <input
                  style={INPUT_STYLE}
                  value={selected.company}
                  onChange={(e) => updateField("company", e.target.value)}
                />
              </Field>
              <Field label="Email">
                <input
                  style={INPUT_STYLE}
                  type="email"
                  value={selected.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </Field>
              <Field label="Phone">
                <input
                  style={INPUT_STYLE}
                  value={selected.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </Field>
              <Field label="Relationship">
                <select
                  style={INPUT_STYLE}
                  value={selected.relationship}
                  onChange={(e) => updateField("relationship", e.target.value)}
                  data-ocid="personalcrm.select"
                >
                  {(
                    [
                      "Personal",
                      "Professional",
                      "Partner",
                      "Family",
                    ] as RelType[]
                  ).map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Last Contacted">
                <input
                  style={INPUT_STYLE}
                  type="date"
                  value={selected.lastContacted}
                  onChange={(e) => updateField("lastContacted", e.target.value)}
                />
              </Field>
              <Field label="Follow-up Date">
                <input
                  style={INPUT_STYLE}
                  type="date"
                  value={selected.followUp}
                  onChange={(e) => updateField("followUp", e.target.value)}
                />
              </Field>
            </div>

            {/* Log interaction */}
            <div className="px-4 pb-2">
              <p
                className="block text-[10px] font-semibold mb-1"
                style={{ color: "rgba(39,215,224,0.6)" }}
              >
                Log Interaction
              </p>
              <div className="flex gap-2">
                <input
                  style={{ ...INPUT_STYLE, flex: 1 }}
                  value={logEntry}
                  onChange={(e) => setLogEntry(e.target.value)}
                  placeholder="What happened? (Enter to log)"
                  data-ocid="personalcrm.input"
                  onKeyDown={(e) => e.key === "Enter" && logInteraction()}
                />
                <button
                  type="button"
                  onClick={logInteraction}
                  data-ocid="personalcrm.primary_button"
                  className="flex items-center gap-1 px-3 py-1 rounded text-xs transition-all"
                  style={{
                    background: "rgba(39,215,224,0.15)",
                    border: "1px solid rgba(39,215,224,0.3)",
                    color: "rgba(39,215,224,0.9)",
                  }}
                >
                  <MessageSquare className="w-3 h-3" /> Log
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="px-4 pb-4">
              <p
                className="block text-[10px] font-semibold mb-1"
                style={{ color: "rgba(39,215,224,0.6)" }}
              >
                Conversation Log & Notes
              </p>
              <textarea
                value={selected.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                data-ocid="personalcrm.editor"
                rows={6}
                className="w-full text-xs font-mono resize-none outline-none p-2 rounded leading-relaxed"
                style={{
                  background: "var(--os-border-subtle)",
                  border: "1px solid rgba(39,215,224,0.15)",
                  color: "rgba(200,220,230,0.8)",
                  caretColor: "rgba(39,215,224,0.8)",
                }}
              />
            </div>
          </div>
        ) : (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-3"
            data-ocid="personalcrm.empty_state"
          >
            <UserCheck
              className="w-14 h-14"
              style={{ color: "rgba(39,215,224,0.15)" }}
            />
            <p className="text-sm text-muted-foreground/60">
              Select a contact or add a new one
            </p>
            <button
              type="button"
              onClick={() => {
                setShowAdd(true);
                setForm(EMPTY);
              }}
              data-ocid="personalcrm.open_modal_button"
              className="flex items-center gap-1.5 px-4 h-8 rounded text-xs font-semibold transition-all"
              style={{
                background: "rgba(39,215,224,0.12)",
                border: "1px solid rgba(39,215,224,0.3)",
                color: "rgba(39,215,224,1)",
              }}
            >
              <Plus className="w-3.5 h-3.5" /> Add Contact
            </button>
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {showAdd && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          data-ocid="personalcrm.dialog"
        >
          <div
            className="rounded-xl w-96 flex flex-col overflow-hidden"
            style={{
              background: "rgba(10,18,26,0.98)",
              border: "1px solid rgba(39,215,224,0.25)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "rgba(39,215,224,0.15)" }}
            >
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--os-accent)" }}
              >
                Add Contact
              </span>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="text-muted-foreground/60 hover:text-muted-foreground"
                data-ocid="personalcrm.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {(
                [
                  ["name", "Name *"],
                  ["company", "Company"],
                  ["email", "Email"],
                  ["phone", "Phone"],
                ] as [keyof typeof form, string][]
              ).map(([key, label]) => (
                <Field key={key} label={label}>
                  <input
                    style={INPUT_STYLE}
                    value={form[key] as string}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [key]: e.target.value }))
                    }
                    data-ocid={key === "name" ? "personalcrm.input" : undefined}
                  />
                </Field>
              ))}
              <Field label="Relationship">
                <select
                  style={INPUT_STYLE}
                  value={form.relationship}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      relationship: e.target.value as RelType,
                    }))
                  }
                >
                  {(
                    [
                      "Personal",
                      "Professional",
                      "Partner",
                      "Family",
                    ] as RelType[]
                  ).map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="px-4 pb-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                data-ocid="personalcrm.cancel_button"
                className="px-4 h-8 rounded text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addContact}
                data-ocid="personalcrm.submit_button"
                disabled={!form.name.trim()}
                className="px-4 h-8 rounded text-xs font-semibold transition-all disabled:opacity-40"
                style={{
                  background: "rgba(39,215,224,0.15)",
                  border: "1px solid rgba(39,215,224,0.35)",
                  color: "rgba(39,215,224,1)",
                }}
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
