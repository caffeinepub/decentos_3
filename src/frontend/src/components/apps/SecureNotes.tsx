import { FileText, Lock, Plus, ShieldAlert, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

const PIN_KEY = "decentos_secure_notes_pin";

interface SecureNote {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

function xorCipher(text: string, key: string): string {
  if (!key) return text;
  return text
    .split("")
    .map((char, i) =>
      String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length)),
    )
    .join("");
}
function encrypt(text: string, pin: string): string {
  return btoa(xorCipher(text, pin));
}
function decrypt(encoded: string, pin: string): string {
  try {
    return xorCipher(atob(encoded), pin);
  } catch {
    return "";
  }
}
function genId() {
  return `sn_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

export function SecureNotes() {
  const {
    data: storedPin,
    set: savePin,
    loading: pinLoading,
  } = useCanisterKV<string>(PIN_KEY, "");
  const [phase, setPhase] = useState<"setup" | "verify" | "app">("setup");
  const phaseInitRef = useRef<boolean>(false);
  // Set phase once PIN data loads from canister
  useEffect(() => {
    if (pinLoading || phaseInitRef.current) return;
    phaseInitRef.current = true;
    setPhase(storedPin ? "verify" : "setup");
  }, [pinLoading, storedPin]);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [activePin, setActivePin] = useState("");
  const [notes, setNotesState] = useState<SecureNote[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data: canisterNotes, set: saveCanisterNotes } = useCanisterKV<
    SecureNote[]
  >("decentos_secure_notes", []);

  const selectedNote = notes.find((n) => n.id === selectedId) ?? null;

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const unlockWithPin = useCallback((p: string, loadedNotes: SecureNote[]) => {
    setActivePin(p);
    setNotesState(loadedNotes);
    setSelectedId(loadedNotes[0]?.id ?? null);
    if (loadedNotes[0]) {
      setEditTitle(loadedNotes[0].title);
      setEditContent(decrypt(loadedNotes[0].content, p));
    }
    setPhase("app");
    setUnlocked(true);
    setPin("");
    setConfirmPin("");
  }, []);

  const handleSetupPin = useCallback(() => {
    if (pin.length < 4) {
      setPinError("PIN must be at least 4 digits");
      return;
    }
    if (pin !== confirmPin) {
      setPinError("PINs do not match");
      return;
    }
    savePin(pin);
    unlockWithPin(pin, canisterNotes);
  }, [pin, confirmPin, canisterNotes, unlockWithPin, savePin]);

  const handleVerifyPin = useCallback(() => {
    if (pin !== storedPin) {
      setPinError("Incorrect PIN");
      return;
    }
    unlockWithPin(pin, canisterNotes);
  }, [pin, canisterNotes, unlockWithPin, storedPin]);

  const lock = useCallback(() => {
    setPhase("verify");
    setUnlocked(false);
    setActivePin("");
    setNotesState([]);
    setSelectedId(null);
    setEditTitle("");
    setEditContent("");
    setPin("");
  }, []);

  const selectNote = useCallback(
    (note: SecureNote) => {
      setSelectedId(note.id);
      setEditTitle(note.title);
      setEditContent(decrypt(note.content, activePin));
    },
    [activePin],
  );

  const persistNotes = useCallback(
    (updated: SecureNote[]) => {
      setNotesState(updated);
      saveCanisterNotes(updated);
    },
    [saveCanisterNotes],
  );

  const saveEdit = useCallback(
    (title: string, content: string) => {
      if (!selectedId) return;
      const encContent = encrypt(content, activePin);
      persistNotes(
        notes.map((n) =>
          n.id === selectedId
            ? { ...n, title, content: encContent, updatedAt: Date.now() }
            : n,
        ),
      );
    },
    [selectedId, activePin, notes, persistNotes],
  );

  const handleTitleChange = (val: string) => {
    setEditTitle(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => saveEdit(val, editContent), 1000);
  };
  const handleContentChange = (val: string) => {
    setEditContent(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => saveEdit(editTitle, val), 1000);
  };

  const createNote = useCallback(() => {
    const note: SecureNote = {
      id: genId(),
      title: "Untitled",
      content: encrypt("", activePin),
      updatedAt: Date.now(),
    };
    const updated = [note, ...notes];
    persistNotes(updated);
    setSelectedId(note.id);
    setEditTitle(note.title);
    setEditContent("");
  }, [activePin, notes, persistNotes]);

  const deleteNote = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const updated = notes.filter((n) => n.id !== id);
      persistNotes(updated);
      if (selectedId === id) {
        const next = updated[0] ?? null;
        setSelectedId(next?.id ?? null);
        if (next) {
          setEditTitle(next.title);
          setEditContent(decrypt(next.content, activePin));
        } else {
          setEditTitle("");
          setEditContent("");
        }
      }
    },
    [selectedId, notes, activePin, persistNotes],
  );

  if (!unlocked) {
    const isSetup = phase === "setup";
    return (
      <div
        className="h-full flex flex-col items-center justify-center gap-6"
        style={{ background: "rgba(11,15,18,0.6)" }}
      >
        <div className="flex flex-col items-center gap-2">
          <ShieldAlert
            className="w-12 h-12"
            style={{ color: "rgba(39,215,224,0.6)" }}
          />
          <h2 className="text-lg font-semibold text-muted-foreground">
            {isSetup ? "Create PIN" : "Secure Notes"}
          </h2>
          <p className="text-xs text-muted-foreground/60">
            {isSetup
              ? "Set a PIN to protect your notes"
              : "Enter your PIN to unlock"}
          </p>
        </div>
        <div className="flex flex-col gap-3 w-64">
          <input
            type="password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setPinError("");
            }}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              (isSetup ? handleSetupPin() : handleVerifyPin())
            }
            placeholder={isSetup ? "Create PIN (min 4 chars)" : "Enter PIN"}
            data-ocid="securenotes.input"
            className="px-3 py-2 rounded text-sm outline-none text-center tracking-widest"
            style={{
              background: "var(--os-border-subtle)",
              border: "1px solid rgba(39,215,224,0.25)",
              color: "rgba(220,235,240,0.9)",
            }}
          />
          {isSetup && (
            <input
              type="password"
              value={confirmPin}
              onChange={(e) => {
                setConfirmPin(e.target.value);
                setPinError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSetupPin()}
              placeholder="Confirm PIN"
              className="px-3 py-2 rounded text-sm outline-none text-center tracking-widest"
              style={{
                background: "var(--os-border-subtle)",
                border: "1px solid rgba(39,215,224,0.25)",
                color: "rgba(220,235,240,0.9)",
              }}
            />
          )}
          {pinError && (
            <p
              className="text-xs text-red-400 text-center"
              data-ocid="securenotes.error_state"
            >
              {pinError}
            </p>
          )}
          <button
            type="button"
            onClick={isSetup ? handleSetupPin : handleVerifyPin}
            data-ocid="securenotes.submit_button"
            className="h-9 rounded text-sm font-semibold transition-all"
            style={{
              background: "rgba(39,215,224,0.15)",
              border: "1px solid rgba(39,215,224,0.35)",
              color: "rgba(39,215,224,1)",
            }}
          >
            {isSetup ? "Set PIN & Enter" : "Unlock"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full" style={{ background: "rgba(11,15,18,0.6)" }}>
      <div
        className="w-48 flex-shrink-0 flex flex-col border-r"
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
          <span
            className="text-xs font-semibold"
            style={{ color: "rgba(39,215,224,0.7)" }}
          >
            Secure Notes
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={createNote}
              data-ocid="securenotes.primary_button"
              className="flex items-center justify-center w-6 h-6 rounded transition-all hover:bg-muted/50"
              style={{
                background: "rgba(39,215,224,0.1)",
                border: "1px solid rgba(39,215,224,0.3)",
                color: "rgba(39,215,224,0.9)",
              }}
            >
              <Plus className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={lock}
              data-ocid="securenotes.toggle"
              title="Lock"
              className="flex items-center justify-center w-6 h-6 rounded transition-all hover:bg-muted/50"
              style={{ color: "var(--os-text-muted)" }}
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {notes.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center h-full gap-2 p-4"
              data-ocid="securenotes.empty_state"
            >
              <FileText className="w-8 h-8 opacity-20" />
              <p className="text-[10px] text-muted-foreground/60 text-center">
                No secure notes
              </p>
            </div>
          ) : (
            notes.map((note, i) => (
              <button
                key={note.id}
                type="button"
                onClick={() => selectNote(note)}
                data-ocid={`securenotes.item.${i + 1}`}
                className="w-full text-left px-3 py-2.5 border-b group transition-colors"
                style={{
                  borderColor: "rgba(42,58,66,0.4)",
                  background:
                    selectedId === note.id
                      ? "rgba(39,215,224,0.08)"
                      : "transparent",
                }}
              >
                <div className="flex items-start justify-between gap-1">
                  <span
                    className="text-[11px] font-medium truncate"
                    style={{
                      color:
                        selectedId === note.id
                          ? "rgba(39,215,224,0.9)"
                          : "var(--os-text-secondary)",
                    }}
                  >
                    {note.title}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => deleteNote(note.id, e)}
                    data-ocid="securenotes.delete_button"
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-colors flex-shrink-0"
                    style={{ color: "rgba(255,100,100,0.6)" }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <div
                  className="text-[10px] mt-0.5"
                  style={{ color: "var(--os-text-muted)" }}
                >
                  {new Date(note.updatedAt).toLocaleDateString()}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        {selectedNote ? (
          <>
            <div
              className="px-4 py-2.5 border-b flex-shrink-0"
              style={{
                borderColor: "rgba(42,58,66,0.6)",
                background: "rgba(14,22,28,0.8)",
              }}
            >
              <input
                value={editTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Note title"
                data-ocid="securenotes.input"
                className="w-full text-sm font-semibold bg-transparent outline-none"
                style={{ color: "var(--os-text-primary)" }}
              />
            </div>
            <textarea
              value={editContent}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Start writing..."
              data-ocid="securenotes.editor"
              className="flex-1 w-full p-4 text-sm bg-transparent outline-none resize-none"
              style={{ color: "rgba(200,220,230,0.85)", lineHeight: 1.7 }}
            />
          </>
        ) : (
          <div
            className="flex flex-col items-center justify-center h-full gap-3"
            data-ocid="securenotes.empty_state"
          >
            <ShieldAlert className="w-12 h-12 opacity-20" />
            <p className="text-sm text-muted-foreground/60">
              Select or create a note
            </p>
            <button
              type="button"
              onClick={createNote}
              data-ocid="securenotes.primary_button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium"
              style={{
                background: "rgba(39,215,224,0.12)",
                border: "1px solid rgba(39,215,224,0.3)",
                color: "rgba(39,215,224,0.9)",
              }}
            >
              <Plus className="w-3.5 h-3.5" /> New Secure Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
