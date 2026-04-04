import { i as useActor, r as reactExports, j as jsxRuntimeExports, aO as Camera, L as LoaderCircle, T as Trash2, X, g as ue } from "./index-8tMpYjTW.js";
import { u as useBlobStorage, C as Cloud } from "./useBlobStorage-DlbSabeR.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { P as Plus } from "./plus-DMYwOcjm.js";
const MOODS = ["😊", "😢", "😤", "😴", "🤩"];
function PhotoJournal() {
  const { actor } = useActor();
  const { upload } = useBlobStorage();
  const [savingEntryId, setSavingEntryId] = reactExports.useState(null);
  const { data: entries, set: setEntries } = useCanisterKV(
    "decent_photo_journal",
    []
  );
  const [selected, setSelected] = reactExports.useState(null);
  const [adding, setAdding] = reactExports.useState(false);
  const [caption, setCaption] = reactExports.useState("");
  const [mood, setMood] = reactExports.useState(MOODS[0]);
  const [imageData, setImageData] = reactExports.useState(null);
  const fileRef = reactExports.useRef(null);
  const handleFile = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      var _a2;
      return setImageData((_a2 = ev.target) == null ? void 0 : _a2.result);
    };
    reader.readAsDataURL(file);
  };
  const handleAdd = () => {
    if (!caption.trim() || !imageData) return;
    const entry = {
      id: Date.now().toString(),
      date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      }),
      caption: caption.trim(),
      mood,
      imageData
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    setAdding(false);
    setCaption("");
    setMood(MOODS[0]);
    setImageData(null);
  };
  const handleDelete = (id) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    if ((selected == null ? void 0 : selected.id) === id) setSelected(null);
  };
  const saveEntryToFiles = async (entry) => {
    if (!actor || !entry.imageData) return;
    setSavingEntryId(entry.id);
    try {
      const response = await fetch(entry.imageData);
      const blob = await response.blob();
      const { url } = await upload(blob);
      await actor.saveFileMetadata({
        url,
        name: `photo-journal-${entry.id}.png`,
        size: BigInt(blob.size),
        mimeType: blob.type || "image/png"
      });
      ue.success("Saved to Files u2713");
    } catch (e) {
      console.error("Save to files failed", e);
      ue.error("Save to Files failed");
    } finally {
      setSavingEntryId(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "rgba(5,5,10,0.95)", color: "#e8e8ee" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-3 flex-shrink-0",
            style: { borderBottom: "1px solid rgba(39,215,224,0.1)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { style: { color: "rgb(39,215,224)", width: 18, height: 18 } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm", children: "Photo Journal" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "photo-journal.open_modal_button",
                  onClick: () => setAdding(true),
                  className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  style: {
                    background: "rgba(39,215,224,0.15)",
                    color: "rgb(39,215,224)",
                    border: "1px solid rgba(39,215,224,0.25)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { width: 12, height: 12 }),
                    "New Entry"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4", children: entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "photo-journal.empty_state",
            className: "flex flex-col items-center justify-center h-full gap-3 opacity-50",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Camera,
                {
                  style: { color: "rgb(39,215,224)", width: 40, height: 40 }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No entries yet. Add your first photo!" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: entries.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": `photo-journal.item.${idx + 1}`,
            className: "relative group cursor-pointer rounded-xl overflow-hidden text-left",
            style: { border: "1px solid rgba(39,215,224,0.12)" },
            onClick: () => setSelected(entry),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: entry.imageData,
                  alt: entry.caption,
                  className: "w-full h-full object-cover"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "absolute bottom-0 left-0 right-0 p-2",
                  style: {
                    background: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(4px)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs truncate font-medium", children: entry.caption }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] opacity-60", children: [
                      entry.mood,
                      " · ",
                      entry.date
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-full flex items-center justify-center",
                  style: { background: "rgba(59,130,246,0.8)" },
                  onClick: (e) => {
                    e.stopPropagation();
                    saveEntryToFiles(entry);
                  },
                  onKeyDown: (e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation();
                      saveEntryToFiles(entry);
                    }
                  },
                  "data-ocid": `photo-journal.save_to_files.${idx + 1}`,
                  title: "Save to Cloud Files",
                  children: savingEntryId === entry.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    LoaderCircle,
                    {
                      width: 10,
                      height: 10,
                      style: { animation: "spin 1s linear infinite" }
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { width: 10, height: 10 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-full flex items-center justify-center",
                  style: { background: "rgba(255,60,60,0.8)" },
                  onClick: (e) => {
                    e.stopPropagation();
                    handleDelete(entry.id);
                  },
                  onKeyDown: (e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation();
                      handleDelete(entry.id);
                    }
                  },
                  "data-ocid": `photo-journal.delete_button.${idx + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { width: 10, height: 10 })
                }
              )
            ]
          },
          entry.id
        )) }) }),
        adding && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "fixed inset-0 z-[9999] flex items-center justify-center",
            style: { background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" },
            onClick: () => setAdding(false),
            onKeyDown: (e) => e.key === "Escape" && setAdding(false),
            role: "presentation",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "photo-journal.dialog",
                className: "rounded-2xl p-5 w-80",
                style: {
                  background: "rgba(10,15,25,0.98)",
                  border: "1px solid rgba(39,215,224,0.25)",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.8)"
                },
                onClick: (e) => e.stopPropagation(),
                onKeyDown: (e) => e.stopPropagation(),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm", children: "New Entry" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setAdding(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { width: 16, height: 16, className: "opacity-60" }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "photo-journal.upload_button",
                      className: "relative mb-3 rounded-xl overflow-hidden cursor-pointer w-full",
                      style: {
                        border: "2px dashed rgba(39,215,224,0.3)",
                        height: 140,
                        background: "rgba(39,215,224,0.03)"
                      },
                      onClick: () => {
                        var _a;
                        return (_a = fileRef.current) == null ? void 0 : _a.click();
                      },
                      children: [
                        imageData ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "img",
                          {
                            src: imageData,
                            alt: "preview",
                            className: "w-full h-full object-cover"
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full gap-2 opacity-50", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Camera,
                            {
                              style: { color: "rgb(39,215,224)", width: 28, height: 28 }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Click to upload photo" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            ref: fileRef,
                            type: "file",
                            accept: "image/*",
                            className: "hidden",
                            onChange: handleFile
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-3 justify-center", children: MOODS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setMood(m),
                      className: "text-xl transition-transform",
                      style: {
                        transform: mood === m ? "scale(1.3)" : "scale(1)",
                        opacity: mood === m ? 1 : 0.5
                      },
                      children: m
                    },
                    m
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "textarea",
                    {
                      "data-ocid": "photo-journal.textarea",
                      className: "w-full rounded-lg px-3 py-2 text-sm resize-none mb-3",
                      style: {
                        background: "var(--os-border-subtle)",
                        border: "1px solid rgba(39,215,224,0.2)",
                        color: "#e8e8ee",
                        outline: "none"
                      },
                      rows: 3,
                      placeholder: "Write a caption...",
                      value: caption,
                      onChange: (e) => setCaption(e.target.value)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "photo-journal.cancel_button",
                        onClick: () => setAdding(false),
                        className: "flex-1 py-2 rounded-lg text-xs opacity-60 hover:opacity-80 transition-opacity",
                        style: { border: "1px solid var(--os-border-window)" },
                        children: "Cancel"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "photo-journal.submit_button",
                        onClick: handleAdd,
                        disabled: !caption.trim() || !imageData,
                        className: "flex-1 py-2 rounded-lg text-xs font-medium transition-all",
                        style: {
                          background: caption.trim() && imageData ? "rgba(39,215,224,0.2)" : "rgba(39,215,224,0.07)",
                          color: "rgb(39,215,224)",
                          border: "1px solid rgba(39,215,224,0.3)",
                          opacity: caption.trim() && imageData ? 1 : 0.5
                        },
                        children: "Add Entry"
                      }
                    )
                  ] })
                ]
              }
            )
          }
        ),
        selected && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "fixed inset-0 z-[9999] flex items-center justify-center",
            style: {
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(8px)"
            },
            onClick: () => setSelected(null),
            onKeyDown: (e) => e.key === "Escape" && setSelected(null),
            role: "presentation",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "photo-journal.modal",
                className: "rounded-2xl overflow-hidden w-96",
                style: {
                  background: "rgba(10,15,25,0.98)",
                  border: "1px solid rgba(39,215,224,0.25)",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.8)"
                },
                onClick: (e) => e.stopPropagation(),
                onKeyDown: (e) => e.stopPropagation(),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: selected.imageData,
                        alt: selected.caption,
                        className: "w-full max-h-64 object-cover"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "photo-journal.close_button",
                        onClick: () => setSelected(null),
                        className: "absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center",
                        style: { background: "rgba(0,0,0,0.6)" },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { width: 14, height: 14 })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: selected.mood }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs opacity-50", children: selected.date })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: selected.caption }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "photo-journal.delete_button",
                        onClick: () => handleDelete(selected.id),
                        className: "mt-3 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all",
                        style: {
                          background: "rgba(255,60,60,0.1)",
                          color: "rgb(255,100,100)",
                          border: "1px solid rgba(255,60,60,0.2)"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { width: 12, height: 12 }),
                          "Delete Entry"
                        ]
                      }
                    )
                  ] })
                ]
              }
            )
          }
        )
      ]
    }
  );
}
export {
  PhotoJournal,
  PhotoJournal as default
};
