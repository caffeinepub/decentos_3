import { Camera, Cloud, Loader2, Plus, Trash2, X } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../../hooks/useActor";
import { useBlobStorage } from "../../hooks/useBlobStorage";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface JournalEntry {
  id: string;
  date: string;
  caption: string;
  mood: string;
  imageData: string;
}

const MOODS = ["😊", "😢", "😤", "😴", "🤩"];

// NOTE: PhotoJournal stores imageData as base64 strings which can be large.
// useCanisterKV handles this, but be mindful of storage costs.
export function PhotoJournal() {
  const { actor } = useActor();
  const { upload } = useBlobStorage();
  const [savingEntryId, setSavingEntryId] = useState<string | null>(null);

  const { data: entries, set: setEntries } = useCanisterKV<JournalEntry[]>(
    "decent_photo_journal",
    [],
  );
  const [selected, setSelected] = useState<JournalEntry | null>(null);
  const [adding, setAdding] = useState(false);
  const [caption, setCaption] = useState("");
  const [mood, setMood] = useState(MOODS[0]);
  const [imageData, setImageData] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageData(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (!caption.trim() || !imageData) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      caption: caption.trim(),
      mood,
      imageData,
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    setAdding(false);
    setCaption("");
    setMood(MOODS[0]);
    setImageData(null);
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    if (selected?.id === id) setSelected(null);
  };

  const saveEntryToFiles = async (entry: JournalEntry) => {
    if (!actor || !entry.imageData) return;
    setSavingEntryId(entry.id);
    try {
      // Convert base64 data URL to blob
      const response = await fetch(entry.imageData);
      const blob = await response.blob();
      const { url } = await upload(blob);
      await actor.saveFileMetadata({
        url,
        name: `photo-journal-${entry.id}.png`,
        size: BigInt(blob.size),
        mimeType: blob.type || "image/png",
      });
      toast.success("Saved to Files u2713");
    } catch (e) {
      console.error("Save to files failed", e);
      toast.error("Save to Files failed");
    } finally {
      setSavingEntryId(null);
    }
  };
  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "rgba(5,5,10,0.95)", color: "#e8e8ee" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(39,215,224,0.1)" }}
      >
        <div className="flex items-center gap-2">
          <Camera style={{ color: "rgb(39,215,224)", width: 18, height: 18 }} />
          <span className="font-semibold text-sm">Photo Journal</span>
        </div>
        <button
          type="button"
          data-ocid="photo-journal.open_modal_button"
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: "rgba(39,215,224,0.15)",
            color: "rgb(39,215,224)",
            border: "1px solid rgba(39,215,224,0.25)",
          }}
        >
          <Plus width={12} height={12} />
          New Entry
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {entries.length === 0 ? (
          <div
            data-ocid="photo-journal.empty_state"
            className="flex flex-col items-center justify-center h-full gap-3 opacity-50"
          >
            <Camera
              style={{ color: "rgb(39,215,224)", width: 40, height: 40 }}
            />
            <p className="text-sm">No entries yet. Add your first photo!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {entries.map((entry, idx) => (
              <button
                key={entry.id}
                type="button"
                data-ocid={`photo-journal.item.${idx + 1}`}
                className="relative group cursor-pointer rounded-xl overflow-hidden text-left"
                style={{ border: "1px solid rgba(39,215,224,0.12)" }}
                onClick={() => setSelected(entry)}
              >
                <div className="aspect-square w-full">
                  <img
                    src={entry.imageData}
                    alt={entry.caption}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="absolute bottom-0 left-0 right-0 p-2"
                  style={{
                    background: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <p className="text-xs truncate font-medium">
                    {entry.caption}
                  </p>
                  <p className="text-[10px] opacity-60">
                    {entry.mood} · {entry.date}
                  </p>
                </div>
                <div
                  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(59,130,246,0.8)" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    saveEntryToFiles(entry);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation();
                      saveEntryToFiles(entry);
                    }
                  }}
                  data-ocid={`photo-journal.save_to_files.${idx + 1}`}
                  title="Save to Cloud Files"
                >
                  {savingEntryId === entry.id ? (
                    <Loader2
                      width={10}
                      height={10}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  ) : (
                    <Cloud width={10} height={10} />
                  )}
                </div>
                <div
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,60,60,0.8)" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(entry.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation();
                      handleDelete(entry.id);
                    }
                  }}
                  data-ocid={`photo-journal.delete_button.${idx + 1}`}
                >
                  <Trash2 width={10} height={10} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {adding && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
          onClick={() => setAdding(false)}
          onKeyDown={(e) => e.key === "Escape" && setAdding(false)}
          role="presentation"
        >
          <div
            data-ocid="photo-journal.dialog"
            className="rounded-2xl p-5 w-80"
            style={{
              background: "rgba(10,15,25,0.98)",
              border: "1px solid rgba(39,215,224,0.25)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.8)",
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">New Entry</h3>
              <button type="button" onClick={() => setAdding(false)}>
                <X width={16} height={16} className="opacity-60" />
              </button>
            </div>

            {/* Image Upload */}
            <button
              type="button"
              data-ocid="photo-journal.upload_button"
              className="relative mb-3 rounded-xl overflow-hidden cursor-pointer w-full"
              style={{
                border: "2px dashed rgba(39,215,224,0.3)",
                height: 140,
                background: "rgba(39,215,224,0.03)",
              }}
              onClick={() => fileRef.current?.click()}
            >
              {imageData ? (
                <img
                  src={imageData}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 opacity-50">
                  <Camera
                    style={{ color: "rgb(39,215,224)", width: 28, height: 28 }}
                  />
                  <span className="text-xs">Click to upload photo</span>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />
            </button>

            {/* Mood */}
            <div className="flex gap-2 mb-3 justify-center">
              {MOODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className="text-xl transition-transform"
                  style={{
                    transform: mood === m ? "scale(1.3)" : "scale(1)",
                    opacity: mood === m ? 1 : 0.5,
                  }}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Caption */}
            <textarea
              data-ocid="photo-journal.textarea"
              className="w-full rounded-lg px-3 py-2 text-sm resize-none mb-3"
              style={{
                background: "var(--os-border-subtle)",
                border: "1px solid rgba(39,215,224,0.2)",
                color: "#e8e8ee",
                outline: "none",
              }}
              rows={3}
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            <div className="flex gap-2">
              <button
                type="button"
                data-ocid="photo-journal.cancel_button"
                onClick={() => setAdding(false)}
                className="flex-1 py-2 rounded-lg text-xs opacity-60 hover:opacity-80 transition-opacity"
                style={{ border: "1px solid var(--os-border-window)" }}
              >
                Cancel
              </button>
              <button
                type="button"
                data-ocid="photo-journal.submit_button"
                onClick={handleAdd}
                disabled={!caption.trim() || !imageData}
                className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  background:
                    caption.trim() && imageData
                      ? "rgba(39,215,224,0.2)"
                      : "rgba(39,215,224,0.07)",
                  color: "rgb(39,215,224)",
                  border: "1px solid rgba(39,215,224,0.3)",
                  opacity: caption.trim() && imageData ? 1 : 0.5,
                }}
              >
                Add Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail View */}
      {selected && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setSelected(null)}
          onKeyDown={(e) => e.key === "Escape" && setSelected(null)}
          role="presentation"
        >
          <div
            data-ocid="photo-journal.modal"
            className="rounded-2xl overflow-hidden w-96"
            style={{
              background: "rgba(10,15,25,0.98)",
              border: "1px solid rgba(39,215,224,0.25)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.8)",
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selected.imageData}
                alt={selected.caption}
                className="w-full max-h-64 object-cover"
              />
              <button
                type="button"
                data-ocid="photo-journal.close_button"
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.6)" }}
              >
                <X width={14} height={14} />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{selected.mood}</span>
                <span className="text-xs opacity-50">{selected.date}</span>
              </div>
              <p className="text-sm">{selected.caption}</p>
              <button
                type="button"
                data-ocid="photo-journal.delete_button"
                onClick={() => handleDelete(selected.id)}
                className="mt-3 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: "rgba(255,60,60,0.1)",
                  color: "rgb(255,100,100)",
                  border: "1px solid rgba(255,60,60,0.2)",
                }}
              >
                <Trash2 width={12} height={12} />
                Delete Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoJournal;
