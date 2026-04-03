import { c as createLucideIcon, u as useOS, a as useOSEventBus, i as useActor, r as reactExports, n as useListChildren, o as useCreateFolder, p as useCreateFile, q as useDeleteNode, j as jsxRuntimeExports, R as RefreshCw, f as ChevronRight, T as Trash2, s as Folder, g as ue, I as Image } from "./index-CZGIn5x2.js";
import { u as useBlobStorage, C as Cloud } from "./useBlobStorage-Dn9nuc1E.js";
import { H as HardDrive } from "./hard-drive-3zhvBM_J.js";
import { A as ArrowLeft } from "./arrow-left-n15hTu7y.js";
import { F as FolderPlus } from "./folder-plus-3DvUBalN.js";
import { F as FilePlus } from "./file-plus-C3QW-0o5.js";
import { L as LoaderCircle } from "./loader-circle-CDA4iBPc.js";
import { U as Upload } from "./upload-DJSynx7U.js";
import { D as Download } from "./download-CRM1KdTk.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }]
];
const File = createLucideIcon("file", __iconNode);
var FileType = /* @__PURE__ */ ((FileType2) => {
  FileType2["file"] = "file";
  FileType2["folder"] = "folder";
  return FileType2;
})(FileType || {});
function formatBytes(bytes) {
  const n = typeof bytes === "bigint" ? Number(bytes) : bytes;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
function formatDate(ns) {
  const ms = Number(ns / BigInt(1e6));
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function getMimeIcon(mimeType) {
  if (mimeType.startsWith("image/"))
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-4 h-4 text-pink-400/80 flex-shrink-0" });
  if (mimeType.startsWith("text/") || mimeType.includes("json"))
    return /* @__PURE__ */ jsxRuntimeExports.jsx(File, { className: "w-4 h-4 text-blue-400/80 flex-shrink-0" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(File, { className: "w-4 h-4 text-primary/70 flex-shrink-0" });
}
const MAX_STORAGE_BYTES = 400 * 1024 * 1024 * 1024;
function parseMarkdown(md) {
  return md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(
    /^### (.+)$/gm,
    '<h3 style="color:var(--os-text-primary);font-size:13px;font-weight:600;margin:8px 0 4px">$1</h3>'
  ).replace(
    /^## (.+)$/gm,
    '<h2 style="color:var(--os-text-primary);font-size:15px;font-weight:700;margin:10px 0 4px">$1</h2>'
  ).replace(
    /^# (.+)$/gm,
    '<h1 style="color:var(--os-text-primary);font-size:18px;font-weight:800;margin:12px 0 6px">$1</h1>'
  ).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>").replace(
    /`([^`]+)`/g,
    '<code style="background:rgba(255,255,255,0.08);padding:1px 4px;border-radius:3px;font-family:monospace;font-size:11px">$1</code>'
  ).replace(
    /^[ \t]*[-*+] (.+)$/gm,
    '<li style="list-style:disc;margin-left:16px;margin-bottom:2px">$1</li>'
  ).replace(
    /^[ \t]*\d+\. (.+)$/gm,
    '<li style="list-style:decimal;margin-left:16px;margin-bottom:2px">$1</li>'
  ).replace(
    /^> (.+)$/gm,
    '<blockquote style="border-left:2px solid var(--os-accent);padding-left:8px;color:var(--os-text-muted);font-style:italic">$1</blockquote>'
  ).replace(/\n\n/g, '</p><p style="margin:6px 0">');
}
function FileManager({ windowProps: _windowProps }) {
  var _a, _b;
  const { openApp } = useOS();
  const { emit } = useOSEventBus();
  const { actor } = useActor();
  const { upload, isUploading } = useBlobStorage();
  const uploadInputRef = reactExports.useRef(null);
  const [tab, setTab] = reactExports.useState("filesystem");
  const [currentFolderId, setCurrentFolderId] = reactExports.useState(null);
  const [breadcrumbs, setBreadcrumbs] = reactExports.useState([
    { id: null, name: "Home" }
  ]);
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const [selectedNode, setSelectedNode] = reactExports.useState(null);
  const [contextMenu, setContextMenu] = reactExports.useState(null);
  const [creating, setCreating] = reactExports.useState(null);
  const [newName, setNewName] = reactExports.useState("");
  const inputRef = reactExports.useRef(null);
  const [cloudFiles, setCloudFiles] = reactExports.useState([]);
  const [cloudLoading, setCloudLoading] = reactExports.useState(false);
  const [cloudLoaded, setCloudLoaded] = reactExports.useState(false);
  const [storageUsed, setStorageUsed] = reactExports.useState(BigInt(0));
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const [cloudSortBy, setCloudSortBy] = reactExports.useState(
    "date"
  );
  const [renamingId, setRenamingId] = reactExports.useState(null);
  const [renameValue, setRenameValue] = reactExports.useState("");
  const {
    data: children,
    isLoading,
    refetch
  } = useListChildren(currentFolderId);
  const createFolder = useCreateFolder();
  const createFile = useCreateFile();
  const deleteNode = useDeleteNode();
  const loadCloudFiles = async () => {
    if (!actor) return;
    setCloudLoading(true);
    try {
      const [files2, used] = await Promise.all([
        actor.getFileMetadata(),
        actor.getTotalStorageBytesUsed()
      ]);
      setCloudFiles(files2);
      setStorageUsed(used);
      setCloudLoaded(true);
    } catch (e) {
      console.error("Failed to load cloud files", e);
      ue.error("Failed to load cloud files");
    } finally {
      setCloudLoading(false);
    }
  };
  const handleTabChange = (t) => {
    setTab(t);
    if (t === "cloud" && !cloudLoaded) {
      loadCloudFiles();
    }
  };
  const handleCloudUpload = async (e) => {
    var _a2;
    const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
    if (!file || !actor) return;
    try {
      setUploadProgress(0);
      const { url } = await upload(file, (pct) => setUploadProgress(pct));
      await actor.saveFileMetadata({
        url,
        name: file.name,
        size: BigInt(file.size),
        mimeType: file.type || "application/octet-stream"
      });
      ue.success("Saved to chain ✓");
      await loadCloudFiles();
    } catch (e2) {
      console.error("Upload failed", e2);
      ue.error("Upload failed");
    } finally {
      setUploadProgress(0);
      if (uploadInputRef.current) uploadInputRef.current.value = "";
    }
  };
  const handleCloudDelete = async (url, name) => {
    if (!actor) return;
    try {
      await actor.deleteFileByUrl(url);
      setCloudFiles((prev) => prev.filter((f) => f.url !== url));
      ue.success(`Deleted ${name}`);
      const used = await actor.getTotalStorageBytesUsed();
      setStorageUsed(used);
    } catch {
      ue.error("Delete failed");
    }
  };
  const navigateTo = (id, name) => {
    setCurrentFolderId(id);
    if (id === null) {
      setBreadcrumbs([{ id: null, name: "Home" }]);
    } else {
      setBreadcrumbs((prev) => [...prev, { id, name }]);
    }
    setSelectedId(null);
  };
  const navigateToBreadcrumb = (item, index) => {
    setCurrentFolderId(item.id);
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
    setSelectedId(null);
  };
  const handleNodeClick = (node) => {
    setSelectedId(node.id);
    if (node.nodeType === FileType.folder) {
      setSelectedNode(null);
      navigateTo(node.id, node.name);
    } else {
      setSelectedNode(node);
    }
  };
  const getFileApp = (name) => {
    var _a2;
    const ext = ((_a2 = name.split(".").pop()) == null ? void 0 : _a2.toLowerCase()) ?? "";
    if (["txt", "md", "log"].includes(ext))
      return { appId: "notes", label: "Notes" };
    if (["write", "doc", "rtf"].includes(ext))
      return { appId: "wordprocessor", label: "WriteOS" };
    if (["js", "ts", "mo", "py", "json", "html", "css"].includes(ext))
      return { appId: "codeeditor", label: "Code Editor" };
    if (ext === "csv") return { appId: "spreadsheet", label: "Spreadsheet" };
    if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext))
      return { appId: "imageviewer", label: "Image Viewer" };
    return { appId: "texteditor", label: "Text Editor" };
  };
  const getFileEventAppId = (name) => {
    var _a2;
    const ext = ((_a2 = name.split(".").pop()) == null ? void 0 : _a2.toLowerCase()) ?? "";
    if (["txt", "md"].includes(ext)) return "texteditor";
    if (["js", "ts", "mo"].includes(ext)) return "codeeditor";
    return "";
  };
  const handleNodeDoubleClick = (node) => {
    if (node.nodeType === FileType.file) {
      const { appId } = getFileApp(node.name);
      openApp(appId, node.name, { fileId: node.id, fileName: node.name });
      const eventAppId = getFileEventAppId(node.name);
      if (eventAppId) {
        emit("open-file", {
          filename: node.name,
          content: node.content ?? "",
          appId: eventAppId
        });
      }
    }
  };
  const handleContextMenu = (e, node) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, node });
  };
  const handleDelete = async (nodeId) => {
    try {
      await deleteNode.mutateAsync(nodeId);
      ue.success("Deleted");
      setSelectedId(null);
    } catch {
      ue.error("Delete failed");
    }
    setContextMenu(null);
  };
  const handleCreate = async () => {
    if (!newName.trim()) {
      setCreating(null);
      return;
    }
    try {
      if (creating === "folder") {
        await createFolder.mutateAsync({
          name: newName.trim(),
          parentId: currentFolderId
        });
        ue.success(`Folder "${newName}" created`);
      } else {
        await createFile.mutateAsync({
          name: newName.trim(),
          content: "",
          parentId: currentFolderId
        });
        ue.success(`File "${newName}" created`);
      }
    } catch {
      ue.error("Creation failed");
    }
    setNewName("");
    setCreating(null);
  };
  const goBack = () => {
    if (breadcrumbs.length <= 1) return;
    setSelectedNode(null);
    const prev = breadcrumbs[breadcrumbs.length - 2];
    navigateToBreadcrumb(prev, breadcrumbs.length - 2);
  };
  const startRename = (node) => {
    setRenamingId(node.id);
    setRenameValue(node.name);
    setContextMenu(null);
  };
  const commitRename = async (nodeId) => {
    if (!renameValue.trim()) {
      setRenamingId(null);
      return;
    }
    const node = children == null ? void 0 : children.find((n) => n.id === nodeId);
    if (!node) {
      setRenamingId(null);
      return;
    }
    try {
      if (renameValue.trim() !== node.name) {
        await deleteNode.mutateAsync(nodeId);
        if (node.nodeType === FileType.folder) {
          await createFolder.mutateAsync({
            name: renameValue.trim(),
            parentId: currentFolderId
          });
        } else {
          await createFile.mutateAsync({
            name: renameValue.trim(),
            content: node.content ?? "",
            parentId: currentFolderId
          });
        }
        ue.success(`Renamed to "${renameValue.trim()}"`);
        refetch();
      }
    } catch {
      ue.error("Rename failed");
    }
    setRenamingId(null);
  };
  const folders = (children == null ? void 0 : children.filter((n) => n.nodeType === FileType.folder)) ?? [];
  const files = (children == null ? void 0 : children.filter((n) => n.nodeType === FileType.file)) ?? [];
  const storageUsedPct = Math.min(
    Number(storageUsed) / MAX_STORAGE_BYTES * 100,
    100
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full text-sm",
      style: { background: "var(--os-bg-app)" },
      onClick: () => setContextMenu(null),
      onKeyDown: (e) => e.key === "Escape" && setContextMenu(null),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-0 border-b flex-shrink-0",
            style: {
              borderColor: "rgba(42,58,66,0.8)",
              background: "rgba(18,32,38,0.5)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => handleTabChange("filesystem"),
                  "data-ocid": "filemanager.filesystem.tab",
                  className: "flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors border-b-2",
                  style: {
                    borderBottomColor: tab === "filesystem" ? "#27D7E0" : "transparent",
                    color: tab === "filesystem" ? "#27D7E0" : "var(--os-text-secondary)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-3.5 h-3.5" }),
                    "File System"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => handleTabChange("cloud"),
                  "data-ocid": "filemanager.cloud.tab",
                  className: "flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors border-b-2",
                  style: {
                    borderBottomColor: tab === "cloud" ? "#27D7E0" : "transparent",
                    color: tab === "cloud" ? "#27D7E0" : "var(--os-text-secondary)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { className: "w-3.5 h-3.5" }),
                    "Cloud Files"
                  ]
                }
              )
            ]
          }
        ),
        tab === "filesystem" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-1 px-3 py-2 border-b",
              style: {
                borderColor: "rgba(42,58,66,0.8)",
                background: "rgba(18,32,38,0.5)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: goBack,
                    disabled: breadcrumbs.length <= 1,
                    "data-ocid": "filemanager.secondary_button",
                    className: "w-7 h-7 flex items-center justify-center rounded hover:bg-white/8 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => refetch(),
                    "data-ocid": "filemanager.refresh.button",
                    className: "w-7 h-7 flex items-center justify-center rounded hover:bg-white/8 text-muted-foreground hover:text-foreground transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 flex-1 mx-2 overflow-hidden", children: breadcrumbs.map((crumb, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "flex items-center gap-1",
                    children: [
                      i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3 text-muted-foreground/50 flex-shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => navigateToBreadcrumb(crumb, i),
                          "data-ocid": "filemanager.breadcrumb.link",
                          className: `text-xs hover:text-primary transition-colors truncate ${i === breadcrumbs.length - 1 ? "text-primary font-medium" : "text-muted-foreground"}`,
                          children: [
                            i === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-3.5 h-3.5 inline mr-1" }) : null,
                            crumb.name
                          ]
                        }
                      )
                    ]
                  },
                  `${crumb.id ?? "root"}-${i}`
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setCreating("folder");
                      setNewName("");
                      setTimeout(() => {
                        var _a2;
                        return (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
                      }, 50);
                    },
                    "data-ocid": "filemanager.new_folder.button",
                    className: "flex items-center gap-1 px-2 h-7 rounded text-xs text-muted-foreground hover:text-primary hover:bg-white/5 transition-colors",
                    title: "New Folder",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderPlus, { className: "w-3.5 h-3.5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setCreating("file");
                      setNewName("");
                      setTimeout(() => {
                        var _a2;
                        return (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
                      }, 50);
                    },
                    "data-ocid": "filemanager.new_file.button",
                    className: "flex items-center gap-1 px-2 h-7 rounded text-xs text-muted-foreground hover:text-primary hover:bg-white/5 transition-colors",
                    title: "New File",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(FilePlus, { className: "w-3.5 h-3.5" })
                  }
                ),
                selectedId !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleDelete(selectedId),
                    "data-ocid": "filemanager.delete_button",
                    className: "flex items-center gap-1 px-2 h-7 rounded text-xs text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                  }
                )
              ]
            }
          ),
          creating && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-3 py-2 border-b flex items-center gap-2",
              style: {
                borderColor: "rgba(42,58,66,0.8)",
                background: "rgba(39,215,224,0.04)"
              },
              children: [
                creating === "folder" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "w-4 h-4 os-cyan-text" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(File, { className: "w-4 h-4 os-cyan-text" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    ref: inputRef,
                    value: newName,
                    onChange: (e) => setNewName(e.target.value),
                    onKeyDown: (e) => {
                      if (e.key === "Enter") handleCreate();
                      if (e.key === "Escape") {
                        setCreating(null);
                        setNewName("");
                      }
                    },
                    placeholder: creating === "folder" ? "Folder name" : "File name",
                    "data-ocid": "filemanager.input",
                    className: "flex-1 bg-transparent text-xs text-foreground outline-none border-b border-primary/50 pb-0.5 placeholder-muted-foreground/50"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleCreate,
                    "data-ocid": "filemanager.confirm_button",
                    className: "text-xs text-primary hover:underline",
                    children: "Create"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setCreating(null);
                      setNewName("");
                    },
                    "data-ocid": "filemanager.cancel_button",
                    className: "text-xs text-muted-foreground hover:underline",
                    children: "Cancel"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 min-h-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-2", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex items-center justify-center h-full",
                "data-ocid": "filemanager.loading_state",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin text-primary/60" })
              }
            ) : folders.length === 0 && files.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center justify-center h-full gap-2 text-muted-foreground/40",
                "data-ocid": "filemanager.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-10 h-10" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "Empty directory" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px]", children: "Create a file or folder to get started" })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-0.5", children: [...folders, ...files].map((node, i) => {
              var _a2;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => renamingId !== node.id && handleNodeClick(node),
                  onDoubleClick: () => {
                    if (node.nodeType === FileType.folder) return;
                    if (renamingId === node.id) return;
                    handleNodeDoubleClick(node);
                  },
                  onContextMenu: (e) => handleContextMenu(e, node),
                  "data-ocid": `filemanager.item.${i + 1}`,
                  className: `w-full flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer transition-colors text-left ${selectedId === node.id ? "bg-primary/15 border border-primary/30" : "hover:bg-white/5"}`,
                  onKeyDown: (e) => {
                    if (e.key === "F2") startRename(node);
                  },
                  children: [
                    node.nodeType === FileType.folder ? /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "w-4 h-4 text-yellow-400/80 flex-shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(File, { className: "w-4 h-4 text-primary/70 flex-shrink-0" }),
                    renamingId === node.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        autoFocus: true,
                        value: renameValue,
                        onChange: (e) => setRenameValue(e.target.value),
                        onKeyDown: (e) => {
                          e.stopPropagation();
                          if (e.key === "Enter") commitRename(node.id);
                          if (e.key === "Escape") setRenamingId(null);
                        },
                        onBlur: () => commitRename(node.id),
                        onClick: (e) => e.stopPropagation(),
                        className: "flex-1 bg-transparent outline-none text-xs border-b border-primary/50",
                        style: { color: "var(--os-text-primary)" },
                        "data-ocid": "filemanager.rename.input"
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "flex-1 text-xs truncate",
                        onDoubleClick: (e) => {
                          e.stopPropagation();
                          startRename(node);
                        },
                        children: node.name
                      }
                    ),
                    node.nodeType === FileType.file && renamingId !== node.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground/50 font-mono", children: [
                      ((_a2 = node.content) == null ? void 0 : _a2.length) ?? 0,
                      "b"
                    ] })
                  ]
                },
                node.id
              );
            }) }) }),
            selectedNode && selectedNode.nodeType !== FileType.folder && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "w-48 flex-shrink-0 border-l flex flex-col overflow-hidden",
                style: {
                  borderColor: "rgba(42,58,66,0.8)",
                  background: "rgba(14,24,32,0.7)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "px-3 py-2 border-b flex-shrink-0",
                      style: { borderColor: "rgba(42,58,66,0.6)" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-[10px] font-semibold uppercase tracking-wide",
                          style: { color: "var(--os-text-muted)" },
                          children: "File Info"
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex flex-col gap-2 overflow-y-auto flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground/50 mb-0.5", children: "Name" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-[11px] font-medium break-all",
                          style: { color: "var(--os-text-primary)" },
                          children: selectedNode.name
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground/50 mb-0.5", children: "Size" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "p",
                        {
                          className: "text-[11px] font-mono",
                          style: { color: "var(--os-text-secondary)" },
                          children: [
                            ((_a = selectedNode.content) == null ? void 0 : _a.length) ?? 0,
                            " bytes"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground/50 mb-0.5", children: "Type" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-[11px]",
                          style: { color: "var(--os-text-secondary)" },
                          children: ((_b = selectedNode.name.split(".").pop()) == null ? void 0 : _b.toUpperCase()) ?? "File"
                        }
                      )
                    ] }),
                    selectedNode.name.toLowerCase().endsWith(".md") && selectedNode.content && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground/50 mb-1", children: "Preview" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "text-[10px] leading-relaxed overflow-y-auto max-h-32",
                          style: { color: "var(--os-text-secondary)" },
                          dangerouslySetInnerHTML: {
                            __html: `<p style="margin:0">${parseMarkdown(selectedNode.content)}</p>`
                          }
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleDelete(selectedNode.id),
                        "data-ocid": "filemanager.delete_button",
                        className: "mt-auto flex items-center gap-1.5 w-full px-2 py-1.5 rounded text-xs transition-colors",
                        style: {
                          background: "rgba(239,68,68,0.08)",
                          border: "1px solid rgba(239,68,68,0.2)",
                          color: "#f87171"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" }),
                          " Delete"
                        ]
                      }
                    )
                  ] })
                ]
              }
            )
          ] }),
          contextMenu && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "fixed z-[99999] os-window py-1 min-w-32",
              style: { left: contextMenu.x, top: contextMenu.y },
              onClick: (e) => e.stopPropagation(),
              onKeyDown: (e) => e.stopPropagation(),
              "data-ocid": "filemanager.dropdown_menu",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => startRename(contextMenu.node),
                    className: "w-full text-left px-3 py-1.5 text-xs hover:bg-white/8 transition-colors",
                    children: "Rename"
                  }
                ),
                contextMenu.node.nodeType === FileType.file && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      const { appId } = getFileApp(contextMenu.node.name);
                      openApp(appId, contextMenu.node.name, {
                        fileId: contextMenu.node.id,
                        fileName: contextMenu.node.name
                      });
                      const eventAppId = getFileEventAppId(contextMenu.node.name);
                      if (eventAppId) {
                        emit("open-file", {
                          filename: contextMenu.node.name,
                          content: contextMenu.node.content ?? "",
                          appId: eventAppId
                        });
                      }
                      setContextMenu(null);
                    },
                    className: "w-full text-left px-3 py-1.5 text-xs hover:bg-white/8 transition-colors",
                    children: [
                      "Open with ",
                      getFileApp(contextMenu.node.name).label
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleDelete(contextMenu.node.id),
                    "data-ocid": "filemanager.delete_button",
                    className: "w-full text-left px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 transition-colors",
                    children: "Delete"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-3 py-1 text-[10px] text-muted-foreground/50 font-mono border-t",
              style: { borderColor: "rgba(42,58,66,0.5)" },
              children: [
                (children == null ? void 0 : children.length) ?? 0,
                " items · ",
                folders.length,
                " folders · ",
                files.length,
                " files"
              ]
            }
          )
        ] }),
        tab === "cloud" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2 px-3 py-2 border-b flex-shrink-0",
              style: {
                borderColor: "rgba(42,58,66,0.8)",
                background: "rgba(18,32,38,0.5)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    ref: uploadInputRef,
                    type: "file",
                    className: "hidden",
                    onChange: handleCloudUpload
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      var _a2;
                      return (_a2 = uploadInputRef.current) == null ? void 0 : _a2.click();
                    },
                    disabled: isUploading,
                    "data-ocid": "filemanager.upload_button",
                    className: "flex items-center gap-1.5 px-3 h-7 rounded text-xs font-medium transition-colors",
                    style: {
                      background: isUploading ? "rgba(39,215,224,0.05)" : "rgba(39,215,224,0.1)",
                      color: "var(--os-accent)",
                      border: "1px solid rgba(39,215,224,0.3)"
                    },
                    children: [
                      isUploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-3.5 h-3.5" }),
                      isUploading ? `Uploading ${uploadProgress}%` : "Upload File"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: loadCloudFiles,
                    "data-ocid": "filemanager.refresh.button",
                    className: "w-7 h-7 flex items-center justify-center rounded hover:bg-white/8 text-muted-foreground hover:text-foreground transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1" }),
                ["name", "date", "size"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setCloudSortBy(s),
                    "data-ocid": `filemanager.sort_${s}.toggle`,
                    className: "px-2 h-6 rounded text-[10px] capitalize transition-colors",
                    style: {
                      background: cloudSortBy === s ? "rgba(39,215,224,0.1)" : "transparent",
                      color: cloudSortBy === s ? "#27D7E0" : "var(--os-text-muted)",
                      border: cloudSortBy === s ? "1px solid rgba(39,215,224,0.3)" : "1px solid transparent"
                    },
                    children: s
                  },
                  s
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground/50 font-mono ml-1", children: [
                  cloudFiles.length,
                  " file",
                  cloudFiles.length !== 1 ? "s" : ""
                ] })
              ]
            }
          ),
          isUploading && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-0.5 flex-shrink-0",
              style: { background: "var(--os-border-subtle)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full transition-all",
                  style: {
                    width: `${uploadProgress}%`,
                    background: "var(--os-accent)"
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-2", children: cloudLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex items-center justify-center h-full",
              "data-ocid": "filemanager.cloud.loading_state",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin text-primary/60" })
            }
          ) : cloudFiles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center h-full gap-3",
              "data-ocid": "filemanager.cloud.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { className: "w-10 h-10 text-muted-foreground/30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-sm font-medium",
                      style: { color: "var(--os-text-primary)" },
                      children: "Your on-chain drive is empty"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs mt-1",
                      style: { color: "var(--os-text-muted)" },
                      children: "Files you upload are stored permanently on ICP."
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs",
                      style: { color: "var(--os-text-muted)" },
                      children: "No cloud account needed."
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      var _a2;
                      return (_a2 = uploadInputRef.current) == null ? void 0 : _a2.click();
                    },
                    "data-ocid": "filemanager.cloud.upload_button",
                    className: "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors",
                    style: {
                      background: "rgba(39,215,224,0.08)",
                      color: "var(--os-accent)",
                      border: "1px solid rgba(39,215,224,0.2)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-3.5 h-3.5" }),
                      "Upload a file"
                    ]
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5", children: [...cloudFiles].sort((a, b) => {
            if (cloudSortBy === "name")
              return a.name.localeCompare(b.name);
            if (cloudSortBy === "size") return Number(b.size - a.size);
            return Number(b.uploadedAt - a.uploadedAt);
          }).map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `filemanager.cloud.item.${i + 1}`,
              className: "flex items-center gap-2 px-3 py-2 rounded hover:bg-white/5 transition-colors group",
              children: [
                getMimeIcon(f.mimeType),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-xs truncate", children: f.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-muted-foreground/50", children: formatBytes(f.size) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/40", children: formatDate(f.uploadedAt) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: f.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    download: f.name,
                    "data-ocid": `filemanager.cloud.download_button.${i + 1}`,
                    className: "w-6 h-6 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary",
                    title: "Download",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleCloudDelete(f.url, f.name),
                    "data-ocid": `filemanager.cloud.delete_button.${i + 1}`,
                    className: "w-6 h-6 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground/50 hover:text-destructive",
                    title: "Delete",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                  }
                )
              ]
            },
            f.url
          )) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-3 py-2 border-t flex-shrink-0",
              style: { borderColor: "rgba(42,58,66,0.5)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60", children: "Cloud Storage" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-muted-foreground/60", children: [
                    formatBytes(storageUsed),
                    " of 400 GB"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-1 rounded-full overflow-hidden",
                    style: { background: "var(--os-border-subtle)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-full rounded-full transition-all",
                        style: {
                          width: `${storageUsedPct}%`,
                          background: "linear-gradient(90deg, #27D7E0 0%, #3B82F6 100%)"
                        }
                      }
                    )
                  }
                )
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  FileManager
};
