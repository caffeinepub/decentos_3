import { c as createLucideIcon, r as reactExports, ae as useReadFile, a7 as useUpdateFileContent, q as useCreateFile, a as useOSEventBus, g as ue, h as useWindowFocus, j as jsxRuntimeExports, S as Search, C as Check, L as LoaderCircle, X } from "./index-8tMpYjTW.js";
import { A as AlignLeft } from "./align-left-lTx1FGaW.js";
import { S as Save } from "./save-Bt6nBroC.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 16-2 2 2 2", key: "kkc6pm" }],
  ["path", { d: "M3 12h15a3 3 0 1 1 0 6h-4", key: "1cl7v7" }],
  ["path", { d: "M3 18h7", key: "sq21v6" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }]
];
const WrapText = createLucideIcon("wrap-text", __iconNode);
function TextEditor({ windowProps }) {
  const fileId = typeof (windowProps == null ? void 0 : windowProps.fileId) === "number" ? windowProps.fileId : null;
  const initialFileName = typeof (windowProps == null ? void 0 : windowProps.fileName) === "string" ? windowProps.fileName : "Document.txt";
  const [fileName, setFileName] = reactExports.useState(initialFileName);
  const [content, setContent] = reactExports.useState("");
  const [isDirty, setIsDirty] = reactExports.useState(false);
  const [fontSize, setFontSize] = reactExports.useState(14);
  const [wordWrap, setWordWrap] = reactExports.useState(true);
  const [showFind, setShowFind] = reactExports.useState(false);
  const [autoSave, setAutoSave] = reactExports.useState(false);
  const [findTerm, setFindTerm] = reactExports.useState("");
  const [replaceTerm, setReplaceTerm] = reactExports.useState("");
  const [saveStatus, setSaveStatus] = reactExports.useState(
    "saved"
  );
  const autoSaveTimer = reactExports.useRef(null);
  const textareaRef = reactExports.useRef(null);
  const { data: fileContent, isLoading } = useReadFile(fileId);
  const updateFile = useUpdateFileContent();
  const createFile = useCreateFile();
  const { subscribe } = useOSEventBus();
  reactExports.useEffect(() => {
    if (fileContent !== void 0 && !isDirty) {
      setContent(fileContent);
    }
  }, [fileContent]);
  reactExports.useEffect(() => {
    const unsub = subscribe("open-file", (payload) => {
      const p = payload;
      if (p.appId !== "texteditor") return;
      setFileName(p.filename ?? "Document.txt");
      setContent(p.content ?? "");
      setIsDirty(false);
      setSaveStatus("saved");
    });
    return unsub;
  }, [subscribe]);
  const handleSave = reactExports.useCallback(async () => {
    if (!isDirty) return;
    setSaveStatus("saving");
    try {
      if (fileId !== null) {
        await updateFile.mutateAsync({ fileId, content });
      } else {
        await createFile.mutateAsync({
          name: fileName,
          content,
          parentId: null
        });
      }
      setIsDirty(false);
      setSaveStatus("saved");
      ue.success("Saved");
    } catch {
      setSaveStatus("unsaved");
      ue.error("Save failed");
    }
  }, [isDirty, fileId, content, fileName, updateFile, createFile]);
  reactExports.useEffect(() => {
    if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    if (autoSave) {
      autoSaveTimer.current = setInterval(() => {
        if (isDirty) handleSave();
      }, 3e4);
    }
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  }, [autoSave, isDirty, handleSave]);
  const { isFocused } = useWindowFocus();
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (!isFocused) return;
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        setShowFind((s) => !s);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFocused, handleSave]);
  const handleContentChange = (val) => {
    setContent(val);
    setIsDirty(true);
    setSaveStatus("unsaved");
  };
  const wordCount = content.trim() === "" ? 0 : content.trim().split(/\s+/).length;
  const lineCount = content.split("\n").length;
  const charCount = content.length;
  const handleReplaceAll = () => {
    if (!findTerm) return;
    const count = content.split(findTerm).length - 1;
    const newContent = content.split(findTerm).join(replaceTerm);
    setContent(newContent);
    setIsDirty(true);
    setSaveStatus("unsaved");
    ue.success(`Replaced ${count} occurrence${count !== 1 ? "s" : ""}`);
  };
  const findCount = findTerm ? content.split(findTerm).length - 1 : 0;
  const isSaving = updateFile.isPending || createFile.isPending;
  const toolbarStyle = {
    borderColor: "rgba(42,58,66,0.8)",
    background: "rgba(18,32,38,0.5)"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "rgba(11,15,18,0.6)" },
      "data-ocid": "texteditor.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-3 py-2 border-b flex-wrap",
            style: toolbarStyle,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlignLeft, { className: "w-4 h-4 text-primary/60 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: fileName,
                  onChange: (e) => setFileName(e.target.value),
                  "data-ocid": "texteditor.input",
                  className: "flex-1 min-w-[80px] bg-transparent text-xs font-medium text-foreground outline-none",
                  placeholder: "File name"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  value: fontSize,
                  onChange: (e) => setFontSize(Number(e.target.value)),
                  "data-ocid": "texteditor.select",
                  className: "bg-transparent text-xs text-muted-foreground border rounded px-1 h-6 outline-none cursor-pointer",
                  style: {
                    borderColor: "rgba(39,215,224,0.2)",
                    background: "rgba(11,20,26,0.8)"
                  },
                  children: [12, 14, 16, 18, 20].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: s, children: [
                    s,
                    "px"
                  ] }, s))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setWordWrap((w) => !w),
                  "data-ocid": "texteditor.toggle",
                  title: "Word wrap",
                  className: "w-6 h-6 flex items-center justify-center rounded transition-colors",
                  style: {
                    background: wordWrap ? "rgba(39,215,224,0.15)" : "transparent",
                    color: wordWrap ? "rgba(39,215,224,1)" : "var(--os-text-secondary)"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(WrapText, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowFind((s) => !s),
                  "data-ocid": "texteditor.secondary_button",
                  title: "Find & Replace (Ctrl+F)",
                  className: "w-6 h-6 flex items-center justify-center rounded transition-colors",
                  style: {
                    background: showFind ? "rgba(39,215,224,0.15)" : "transparent",
                    color: showFind ? "rgba(39,215,224,1)" : "var(--os-text-secondary)"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setAutoSave((s) => !s),
                  "data-ocid": "texteditor.checkbox",
                  title: "Auto-save",
                  className: "flex items-center gap-1 px-2 h-6 rounded text-[10px] transition-colors",
                  style: {
                    background: autoSave ? "rgba(39,215,224,0.1)" : "transparent",
                    border: "1px solid rgba(39,215,224,0.2)",
                    color: autoSave ? "rgba(39,215,224,1)" : "var(--os-text-secondary)"
                  },
                  children: [
                    autoSave && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-2.5 h-2.5" }),
                    "Auto"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground/50 font-mono", children: [
                wordCount,
                "w"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleSave,
                  disabled: isSaving || !isDirty,
                  "data-ocid": "texteditor.save_button",
                  className: "flex items-center gap-1 px-3 h-7 rounded text-xs font-semibold transition-all disabled:opacity-40",
                  style: {
                    background: "rgba(39,215,224,0.12)",
                    border: "1px solid rgba(39,215,224,0.3)",
                    color: "rgba(39,215,224,1)"
                  },
                  children: [
                    isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-3 h-3" }),
                    "Save"
                  ]
                }
              )
            ]
          }
        ),
        showFind && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-3 py-2 border-b",
            style: {
              borderColor: "rgba(42,58,66,0.7)",
              background: "rgba(12,24,28,0.6)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-3.5 h-3.5 text-primary/50 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: findTerm,
                  onChange: (e) => setFindTerm(e.target.value),
                  "data-ocid": "texteditor.search_input",
                  placeholder: "Find...",
                  className: "flex-1 bg-transparent text-xs text-foreground outline-none placeholder-muted-foreground/40 font-mono"
                }
              ),
              findTerm && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-primary/60 font-mono", children: [
                findCount,
                " found"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-4 bg-white/10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: replaceTerm,
                  onChange: (e) => setReplaceTerm(e.target.value),
                  "data-ocid": "texteditor.input",
                  placeholder: "Replace with...",
                  className: "flex-1 bg-transparent text-xs text-foreground outline-none placeholder-muted-foreground/40 font-mono"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: handleReplaceAll,
                  "data-ocid": "texteditor.primary_button",
                  className: "px-2 h-6 rounded text-[10px] font-semibold transition-all",
                  style: {
                    background: "rgba(39,215,224,0.12)",
                    border: "1px solid rgba(39,215,224,0.3)",
                    color: "rgba(39,215,224,1)"
                  },
                  children: "Replace All"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowFind(false),
                  "data-ocid": "texteditor.close_button",
                  className: "w-5 h-5 flex items-center justify-center rounded text-muted-foreground/50 hover:text-foreground transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                }
              )
            ]
          }
        ),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex items-center justify-center flex-1",
            "data-ocid": "texteditor.loading_state",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin text-primary/60" })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            ref: textareaRef,
            value: content,
            onChange: (e) => handleContentChange(e.target.value),
            "data-ocid": "texteditor.editor",
            placeholder: "Start writing...",
            spellCheck: true,
            className: "flex-1 p-4 bg-transparent text-foreground outline-none resize-none placeholder-muted-foreground/30 leading-relaxed",
            style: {
              fontSize: `${fontSize}px`,
              whiteSpace: wordWrap ? "pre-wrap" : "pre",
              overflowWrap: wordWrap ? "break-word" : "normal",
              overflowX: wordWrap ? "hidden" : "auto",
              caretColor: "rgba(39,215,224,0.8)",
              fontFamily: "inherit"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-1 text-[10px] text-muted-foreground/40 font-mono border-t flex items-center justify-between",
            style: { borderColor: "rgba(42,58,66,0.5)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                wordCount,
                " words \\u00b7 ",
                charCount,
                " chars \\u00b7 ",
                lineCount,
                " lines"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  "data-ocid": saveStatus === "saving" ? "texteditor.loading_state" : saveStatus === "saved" ? "texteditor.success_state" : "texteditor.error_state",
                  style: {
                    color: saveStatus === "saving" ? "rgba(255,200,50,0.7)" : saveStatus === "saved" ? "rgba(39,215,224,0.6)" : "rgba(255,100,100,0.7)"
                  },
                  children: saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved" : "Unsaved changes"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
export {
  TextEditor
};
