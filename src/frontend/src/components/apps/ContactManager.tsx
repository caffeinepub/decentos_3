import {
  CalendarPlus,
  Edit2,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useOS } from "../../context/OSContext";
import { useOSEventBus } from "../../context/OSEventBusContext";
import { useCanisterKV } from "../../hooks/useCanisterKV";

type ContactGroup = "All" | "Home" | "Work" | "Family" | "Other";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  group?: ContactGroup;
}

function hashColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#ef4444",
    "#14b8a6",
  ];
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return (parts[0]?.charAt(0) ?? "").toUpperCase();
  return (
    (parts[0]?.charAt(0) ?? "") + (parts[parts.length - 1]?.charAt(0) ?? "")
  ).toUpperCase();
}

const GROUPS: ContactGroup[] = ["All", "Home", "Work", "Family", "Other"];

const GROUP_COLORS: Record<ContactGroup, string> = {
  All: "#6366f1",
  Home: "#10b981",
  Work: "#3b82f6",
  Family: "#f59e0b",
  Other: "#8b5cf6",
};

export function ContactManager() {
  const { openApp } = useOS();
  const { emit } = useOSEventBus();
  const { data: contacts, set: setContacts } = useCanisterKV<Contact[]>(
    "decent-contacts",
    [],
  );
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState<ContactGroup>("All");
  const [editing, setEditing] = useState<Contact | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
    group: "Other" as ContactGroup,
  });

  const filtered = contacts.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchGroup =
      activeGroup === "All" || (c.group ?? "Other") === activeGroup;
    return matchSearch && matchGroup;
  });

  const openCreate = () => {
    setForm({ name: "", email: "", phone: "", notes: "", group: "Other" });
    setEditing(null);
    setCreating(true);
  };
  const openEdit = (c: Contact) => {
    setForm({
      name: c.name,
      email: c.email,
      phone: c.phone,
      notes: c.notes,
      group: c.group ?? "Other",
    });
    setEditing(c);
    setCreating(true);
  };

  const saveContact = () => {
    if (!form.name.trim()) return;
    if (editing) {
      setContacts(
        contacts.map((c) => (c.id === editing.id ? { ...c, ...form } : c)),
      );
    } else {
      setContacts([...contacts, { id: Date.now().toString(), ...form }]);
    }
    setCreating(false);
    setEditing(null);
  };

  const deleteContact = (id: string) =>
    setContacts(contacts.filter((c) => c.id !== id));

  const scheduleMeeting = (contact: Contact) => {
    emit("open-calendar", {
      title: `Meeting with ${contact.name}`,
      date: new Date().toISOString().split("T")[0],
    });
    openApp("calendar", "Calendar");
  };

  const sendEmail = (contact: Contact) => {
    if (contact.email) {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  return (
    <div
      className="flex h-full"
      style={{
        background: "var(--os-bg-app)",
        color: "var(--os-text-primary)",
      }}
    >
      {/* Sidebar */}
      <div
        className="w-56 flex-shrink-0 flex flex-col border-r"
        style={{
          borderColor: "var(--os-border-subtle)",
          background: "var(--os-bg-sidebar)",
        }}
      >
        {/* Search */}
        <div
          className="p-3 border-b"
          style={{ borderColor: "var(--os-border-subtle)" }}
        >
          <div className="relative">
            <Search
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
              style={{ color: "var(--os-text-muted)" }}
            />
            <input
              type="text"
              placeholder="Search contacts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="contactmanager.search_input"
              className="w-full h-8 pl-8 pr-3 rounded-md text-xs outline-none"
              style={{
                background: "var(--os-bg-elevated)",
                border: "1px solid var(--os-border-subtle)",
                color: "var(--os-text-primary)",
              }}
            />
          </div>
        </div>

        {/* Group filter tabs */}
        <div
          className="flex flex-col px-2 py-2 gap-0.5 border-b"
          style={{ borderColor: "var(--os-border-subtle)" }}
        >
          {GROUPS.map((g) => {
            const count =
              g === "All"
                ? contacts.length
                : contacts.filter((c) => (c.group ?? "Other") === g).length;
            return (
              <button
                key={g}
                type="button"
                onClick={() => setActiveGroup(g)}
                data-ocid="contactmanager.tab"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all text-left"
                style={{
                  background:
                    activeGroup === g ? `${GROUP_COLORS[g]}22` : "transparent",
                  color:
                    activeGroup === g
                      ? GROUP_COLORS[g]
                      : "var(--os-text-secondary)",
                  fontWeight: activeGroup === g ? 600 : 400,
                }}
              >
                <span className="flex-1">{g}</span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background:
                      activeGroup === g
                        ? `${GROUP_COLORS[g]}33`
                        : "var(--os-bg-elevated)",
                    color:
                      activeGroup === g
                        ? GROUP_COLORS[g]
                        : "var(--os-text-muted)",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Contact list */}
        <div className="flex-1 overflow-y-auto py-1">
          {filtered.length === 0 && (
            <div
              className="flex flex-col items-center justify-center h-24 gap-1"
              data-ocid="contactmanager.empty_state"
            >
              <User
                className="w-6 h-6"
                style={{ color: "var(--os-text-muted)" }}
              />
              <p
                className="text-[11px]"
                style={{ color: "var(--os-text-muted)" }}
              >
                No contacts
              </p>
            </div>
          )}
          {filtered.map((c, i) => {
            const color = hashColor(c.name);
            const initials = getInitials(c.name);
            return (
              <div
                key={c.id}
                className="flex items-center gap-1 px-2 py-1.5 hover:bg-muted/30 transition-colors group"
              >
                <button
                  type="button"
                  onClick={() => openEdit(c)}
                  data-ocid={`contactmanager.item.${i + 1}`}
                  className="flex-1 text-left flex items-center gap-2 min-w-0"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                    style={{
                      background: `${color}28`,
                      color,
                      border: `1.5px solid ${color}44`,
                    }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-xs font-medium truncate"
                      style={{ color: "var(--os-text-primary)" }}
                    >
                      {c.name}
                    </p>
                    <p
                      className="text-[10px] truncate"
                      style={{ color: "var(--os-text-muted)" }}
                    >
                      {c.email || c.phone || (c.group ?? "Other")}
                    </p>
                  </div>
                </button>
                {/* Quick actions on hover */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 flex-shrink-0">
                  {c.email && (
                    <button
                      type="button"
                      onClick={() => sendEmail(c)}
                      data-ocid={`contactmanager.email_button.${i + 1}`}
                      title={`Email ${c.name}`}
                      className="w-6 h-6 flex items-center justify-center rounded transition-all hover:bg-muted/50"
                      style={{ color: "var(--os-text-secondary)" }}
                    >
                      <Mail className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => scheduleMeeting(c)}
                    data-ocid={`contactmanager.calendar_button.${i + 1}`}
                    title={`Schedule meeting with ${c.name}`}
                    className="w-6 h-6 flex items-center justify-center rounded transition-all hover:bg-muted/50"
                    style={{ color: "var(--os-text-secondary)" }}
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="p-3 border-t"
          style={{ borderColor: "var(--os-border-subtle)" }}
        >
          <button
            type="button"
            onClick={openCreate}
            data-ocid="contactmanager.primary_button"
            className="w-full h-8 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold transition-all"
            style={{
              background: "rgba(59,130,246,0.12)",
              border: "1px solid rgba(59,130,246,0.3)",
              color: "rgba(96,165,250,0.9)",
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            New Contact
          </button>
        </div>
      </div>

      {/* Main panel */}
      <div className="flex-1 flex flex-col">
        {creating ? (
          <div className="flex-1 p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2
                className="text-sm font-semibold"
                style={{ color: "var(--os-text-primary)" }}
              >
                {editing ? "Edit Contact" : "New Contact"}
              </h2>
              <button
                type="button"
                onClick={() => setCreating(false)}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors"
                data-ocid="contactmanager.close_button"
              >
                <X
                  className="w-3.5 h-3.5"
                  style={{ color: "var(--os-text-secondary)" }}
                />
              </button>
            </div>

            {/* Preview avatar */}
            {form.name && (
              <div className="flex justify-center mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
                  style={{
                    background: `${hashColor(form.name)}28`,
                    color: hashColor(form.name),
                    border: `2px solid ${hashColor(form.name)}44`,
                  }}
                >
                  {getInitials(form.name)}
                </div>
              </div>
            )}

            <div className="space-y-3 max-w-sm">
              {(["name", "email", "phone"] as const).map((field) => (
                <div key={field}>
                  <p
                    className="block text-[11px] mb-1 capitalize"
                    style={{ color: "var(--os-text-muted)" }}
                  >
                    {field}
                  </p>
                  <input
                    type={field === "email" ? "email" : "text"}
                    value={form[field]}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                    data-ocid="contactmanager.input"
                    className="w-full h-8 px-3 rounded-md text-xs outline-none"
                    style={{
                      background: "var(--os-bg-elevated)",
                      border: "1px solid var(--os-border-subtle)",
                      color: "var(--os-text-primary)",
                    }}
                  />
                </div>
              ))}

              {/* Group field */}
              <div>
                <p
                  className="block text-[11px] mb-1"
                  style={{ color: "var(--os-text-muted)" }}
                >
                  Group
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {(["Home", "Work", "Family", "Other"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, group: g }))}
                      className="px-2.5 h-6 rounded-lg text-[11px] font-medium transition-all"
                      style={{
                        background:
                          form.group === g
                            ? `${GROUP_COLORS[g]}22`
                            : "var(--os-bg-elevated)",
                        border:
                          form.group === g
                            ? `1px solid ${GROUP_COLORS[g]}66`
                            : "1px solid var(--os-border-subtle)",
                        color:
                          form.group === g
                            ? GROUP_COLORS[g]
                            : "var(--os-text-muted)",
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p
                  className="block text-[11px] mb-1"
                  style={{ color: "var(--os-text-muted)" }}
                >
                  Notes
                </p>
                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  rows={3}
                  data-ocid="contactmanager.textarea"
                  className="w-full px-3 py-2 rounded-md text-xs outline-none resize-none"
                  style={{
                    background: "var(--os-bg-elevated)",
                    border: "1px solid var(--os-border-subtle)",
                    color: "var(--os-text-primary)",
                  }}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={saveContact}
                  data-ocid="contactmanager.save_button"
                  className="flex-1 h-8 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: "rgba(59,130,246,0.12)",
                    border: "1px solid rgba(59,130,246,0.3)",
                    color: "rgba(96,165,250,1)",
                  }}
                >
                  {editing ? "Save Changes" : "Create Contact"}
                </button>
                {editing && (
                  <button
                    type="button"
                    onClick={() => {
                      deleteContact(editing.id);
                      setCreating(false);
                    }}
                    data-ocid="contactmanager.delete_button"
                    className="h-8 px-3 rounded-lg text-xs transition-colors"
                    style={{
                      color: "rgba(248,113,113,0.7)",
                      border: "1px solid rgba(248,113,113,0.2)",
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              <User
                className="w-7 h-7"
                style={{ color: "rgba(96,165,250,0.6)" }}
              />
            </div>
            <p className="text-xs" style={{ color: "var(--os-text-muted)" }}>
              Select a contact or create a new one
            </p>
            <button
              type="button"
              onClick={openCreate}
              data-ocid="contactmanager.open_modal_button"
              className="mt-1 px-4 h-8 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.25)",
                color: "rgba(96,165,250,0.9)",
              }}
            >
              <Plus className="w-3.5 h-3.5 inline mr-1" />
              New Contact
            </button>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-6 border-t flex items-center px-4 gap-4"
        style={{
          borderColor: "var(--os-border-subtle)",
          background: "var(--os-bg-sidebar)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <User className="w-3 h-3" style={{ color: "rgba(59,130,246,0.6)" }} />
          <span
            className="text-[10px]"
            style={{ color: "var(--os-text-muted)" }}
          >
            {contacts.length} contacts
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Mail className="w-3 h-3" style={{ color: "rgba(59,130,246,0.4)" }} />
          <span
            className="text-[10px]"
            style={{ color: "var(--os-text-muted)" }}
          >
            Private &amp; on-chain
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Phone
            className="w-3 h-3"
            style={{ color: "rgba(59,130,246,0.4)" }}
          />
          <span
            className="text-[10px]"
            style={{ color: "var(--os-text-muted)" }}
          >
            {filtered.length} shown
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <Edit2
            className="w-3 h-3"
            style={{ color: "rgba(59,130,246,0.4)" }}
          />
          <span
            className="text-[10px]"
            style={{ color: "var(--os-text-muted)" }}
          >
            Click to edit
          </span>
        </div>
      </div>
    </div>
  );
}
