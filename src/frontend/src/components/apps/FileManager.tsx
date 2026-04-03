import {
  ArrowLeft,
  ChevronRight,
  Cloud,
  Download,
  File,
  FilePlus,
  Folder,
  FolderPlus,
  HardDrive,
  Image,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { FileMetadata } from "../../backend.d";
import { type FileNodeView, FileType } from "../../backend.d";
import { useOS } from "../../context/OSContext";
import { useOSEventBus } from "../../context/OSEventBusContext";
import { useActor } from "../../hooks/useActor";
import { useBlobStorage } from "../../hooks/useBlobStorage";
import {
  useCreateFile,
  useCreateFolder,
  useDeleteNode,
  useListChildren,
} from "../../hooks/useQueries";

interface FileManagerProps {
  windowProps?: Record<string, unknown>;
}

interface BreadcrumbItem {
  id: number | null;
  name: string;
}

function formatBytes(bytes: number | bigint): string {
  const n = typeof bytes === "bigint" ? Number(bytes) : bytes;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDate(ns: bigint): string {
  const ms = Number(ns / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getMimeIcon(mimeType: string) {
  if (mimeType.startsWith("image/"))
    return <Image className="w-4 h-4 text-pink-400/80 flex-shrink-0" />;
  if (mimeType.startsWith("text/") || mimeType.includes("json"))
    return <File className="w-4 h-4 text-blue-400/80 flex-shrink-0" />;
  return <File className="w-4 h-4 text-primary/70 flex-shrink-0" />;
}

const MAX_STORAGE_BYTES = 400 * 1024 * 1024 * 1024; // 400 GB

type Tab = "filesystem" | "cloud";

function parseMarkdown(md: string): string {
  return (
    md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // Headers
      .replace(
        /^### (.+)$/gm,
        '<h3 style="color:var(--os-text-primary);font-size:13px;font-weight:600;margin:8px 0 4px">$1</h3>',
      )
      .replace(
        /^## (.+)$/gm,
        '<h2 style="color:var(--os-text-primary);font-size:15px;font-weight:700;margin:10px 0 4px">$1</h2>',
      )
      .replace(
        /^# (.+)$/gm,
        '<h1 style="color:var(--os-text-primary);font-size:18px;font-weight:800;margin:12px 0 6px">$1</h1>',
      )
      // Bold/italic
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      // Code
      .replace(
        /`([^`]+)`/g,
        '<code style="background:rgba(255,255,255,0.08);padding:1px 4px;border-radius:3px;font-family:monospace;font-size:11px">$1</code>',
      )
      // Lists
      .replace(
        /^[ \t]*[-*+] (.+)$/gm,
        '<li style="list-style:disc;margin-left:16px;margin-bottom:2px">$1</li>',
      )
      .replace(
        /^[ \t]*\d+\. (.+)$/gm,
        '<li style="list-style:decimal;margin-left:16px;margin-bottom:2px">$1</li>',
      )
      // Blockquotes
      .replace(
        /^> (.+)$/gm,
        '<blockquote style="border-left:2px solid var(--os-accent);padding-left:8px;color:var(--os-text-muted);font-style:italic">$1</blockquote>',
      )
      // Paragraphs
      .replace(/\n\n/g, '</p><p style="margin:6px 0">')
  );
}

export function FileManager({ windowProps: _windowProps }: FileManagerProps) {
  const { openApp } = useOS();
  const { emit } = useOSEventBus();
  const { actor } = useActor();
  const { upload, isUploading } = useBlobStorage();
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<Tab>("filesystem");

  // Filesystem state
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: null, name: "Home" },
  ]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedNode, setSelectedNode] = useState<FileNodeView | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    node: FileNodeView;
  } | null>(null);
  const [creating, setCreating] = useState<"folder" | "file" | null>(null);
  const [newName, setNewName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Cloud files state
  const [cloudFiles, setCloudFiles] = useState<FileMetadata[]>([]);
  const [cloudLoading, setCloudLoading] = useState(false);
  const [cloudLoaded, setCloudLoaded] = useState(false);
  const [storageUsed, setStorageUsed] = useState<bigint>(BigInt(0));
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [cloudSortBy, setCloudSortBy] = useState<"name" | "date" | "size">(
    "date",
  );
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const {
    data: children,
    isLoading,
    refetch,
  } = useListChildren(currentFolderId);
  const createFolder = useCreateFolder();
  const createFile = useCreateFile();
  const deleteNode = useDeleteNode();

  const loadCloudFiles = async () => {
    if (!actor) return;
    setCloudLoading(true);
    try {
      const [files, used] = await Promise.all([
        actor.getFileMetadata(),
        actor.getTotalStorageBytesUsed(),
      ]);
      setCloudFiles(files);
      setStorageUsed(used);
      setCloudLoaded(true);
    } catch (e) {
      console.error("Failed to load cloud files", e);
      toast.error("Failed to load cloud files");
    } finally {
      setCloudLoading(false);
    }
  };

  const handleTabChange = (t: Tab) => {
    setTab(t);
    if (t === "cloud" && !cloudLoaded) {
      loadCloudFiles();
    }
  };

  const handleCloudUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !actor) return;
    try {
      setUploadProgress(0);
      const { url } = await upload(file, (pct) => setUploadProgress(pct));
      await actor.saveFileMetadata({
        url,
        name: file.name,
        size: BigInt(file.size),
        mimeType: file.type || "application/octet-stream",
      });
      toast.success("Saved to chain ✓");
      await loadCloudFiles();
    } catch (e) {
      console.error("Upload failed", e);
      toast.error("Upload failed");
    } finally {
      setUploadProgress(0);
      if (uploadInputRef.current) uploadInputRef.current.value = "";
    }
  };

  const handleCloudDelete = async (url: string, name: string) => {
    if (!actor) return;
    try {
      await actor.deleteFileByUrl(url);
      setCloudFiles((prev) => prev.filter((f) => f.url !== url));
      toast.success(`Deleted ${name}`);
      const used = await actor.getTotalStorageBytesUsed();
      setStorageUsed(used);
    } catch {
      toast.error("Delete failed");
    }
  };

  const navigateTo = (id: number | null, name: string) => {
    setCurrentFolderId(id);
    if (id === null) {
      setBreadcrumbs([{ id: null, name: "Home" }]);
    } else {
      setBreadcrumbs((prev) => [...prev, { id, name }]);
    }
    setSelectedId(null);
  };

  const navigateToBreadcrumb = (item: BreadcrumbItem, index: number) => {
    setCurrentFolderId(item.id);
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
    setSelectedId(null);
  };

  const handleNodeClick = (node: FileNodeView) => {
    setSelectedId(node.id);
    if (node.nodeType === FileType.folder) {
      setSelectedNode(null);
      navigateTo(node.id, node.name);
    } else {
      setSelectedNode(node);
    }
  };

  const getFileApp = (name: string): { appId: string; label: string } => {
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
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

  const getFileEventAppId = (name: string): string => {
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    if (["txt", "md"].includes(ext)) return "texteditor";
    if (["js", "ts", "mo"].includes(ext)) return "codeeditor";
    return "";
  };

  const handleNodeDoubleClick = (node: FileNodeView) => {
    if (node.nodeType === FileType.file) {
      const { appId } = getFileApp(node.name);
      openApp(appId, node.name, { fileId: node.id, fileName: node.name });
      const eventAppId = getFileEventAppId(node.name);
      if (eventAppId) {
        emit("open-file", {
          filename: node.name,
          content: node.content ?? "",
          appId: eventAppId,
        });
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent, node: FileNodeView) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, node });
  };

  const handleDelete = async (nodeId: number) => {
    try {
      await deleteNode.mutateAsync(nodeId);
      toast.success("Deleted");
      setSelectedId(null);
    } catch {
      toast.error("Delete failed");
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
          parentId: currentFolderId,
        });
        toast.success(`Folder "${newName}" created`);
      } else {
        await createFile.mutateAsync({
          name: newName.trim(),
          content: "",
          parentId: currentFolderId,
        });
        toast.success(`File "${newName}" created`);
      }
    } catch {
      toast.error("Creation failed");
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

  const startRename = (node: FileNodeView) => {
    setRenamingId(node.id);
    setRenameValue(node.name);
    setContextMenu(null);
  };

  const commitRename = async (nodeId: number) => {
    if (!renameValue.trim()) {
      setRenamingId(null);
      return;
    }
    // Find the node to rename
    const node = children?.find((n) => n.id === nodeId);
    if (!node) {
      setRenamingId(null);
      return;
    }
    try {
      if (renameValue.trim() !== node.name) {
        // Delete old, create new with same content
        await deleteNode.mutateAsync(nodeId);
        if (node.nodeType === FileType.folder) {
          await createFolder.mutateAsync({
            name: renameValue.trim(),
            parentId: currentFolderId,
          });
        } else {
          await createFile.mutateAsync({
            name: renameValue.trim(),
            content: node.content ?? "",
            parentId: currentFolderId,
          });
        }
        toast.success(`Renamed to "${renameValue.trim()}"`);
        refetch();
      }
    } catch {
      toast.error("Rename failed");
    }
    setRenamingId(null);
  };

  const folders = children?.filter((n) => n.nodeType === FileType.folder) ?? [];
  const files = children?.filter((n) => n.nodeType === FileType.file) ?? [];

  const storageUsedPct = Math.min(
    (Number(storageUsed) / MAX_STORAGE_BYTES) * 100,
    100,
  );

  return (
    <div
      className="flex flex-col h-full text-sm"
      style={{ background: "var(--os-bg-app)" }}
      onClick={() => setContextMenu(null)}
      onKeyDown={(e) => e.key === "Escape" && setContextMenu(null)}
    >
      {/* Tab bar */}
      <div
        className="flex items-center gap-0 border-b flex-shrink-0"
        style={{
          borderColor: "rgba(42,58,66,0.8)",
          background: "rgba(18,32,38,0.5)",
        }}
      >
        <button
          type="button"
          onClick={() => handleTabChange("filesystem")}
          data-ocid="filemanager.filesystem.tab"
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors border-b-2"
          style={{
            borderBottomColor: tab === "filesystem" ? "#27D7E0" : "transparent",
            color:
              tab === "filesystem" ? "#27D7E0" : "var(--os-text-secondary)",
          }}
        >
          <HardDrive className="w-3.5 h-3.5" />
          File System
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("cloud")}
          data-ocid="filemanager.cloud.tab"
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors border-b-2"
          style={{
            borderBottomColor: tab === "cloud" ? "#27D7E0" : "transparent",
            color: tab === "cloud" ? "#27D7E0" : "var(--os-text-secondary)",
          }}
        >
          <Cloud className="w-3.5 h-3.5" />
          Cloud Files
        </button>
      </div>

      {/* FILESYSTEM TAB */}
      {tab === "filesystem" && (
        <>
          {/* Toolbar */}
          <div
            className="flex items-center gap-1 px-3 py-2 border-b"
            style={{
              borderColor: "rgba(42,58,66,0.8)",
              background: "rgba(18,32,38,0.5)",
            }}
          >
            <button
              type="button"
              onClick={goBack}
              disabled={breadcrumbs.length <= 1}
              data-ocid="filemanager.secondary_button"
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/8 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => refetch()}
              data-ocid="filemanager.refresh.button"
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/8 text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1 flex-1 mx-2 overflow-hidden">
              {breadcrumbs.map((crumb, i) => (
                <span
                  key={`${crumb.id ?? "root"}-${i}`}
                  className="flex items-center gap-1"
                >
                  {i > 0 && (
                    <ChevronRight className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                  )}
                  <button
                    type="button"
                    onClick={() => navigateToBreadcrumb(crumb, i)}
                    data-ocid="filemanager.breadcrumb.link"
                    className={`text-xs hover:text-primary transition-colors truncate ${
                      i === breadcrumbs.length - 1
                        ? "text-primary font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {i === 0 ? (
                      <HardDrive className="w-3.5 h-3.5 inline mr-1" />
                    ) : null}
                    {crumb.name}
                  </button>
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setCreating("folder");
                setNewName("");
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
              data-ocid="filemanager.new_folder.button"
              className="flex items-center gap-1 px-2 h-7 rounded text-xs text-muted-foreground hover:text-primary hover:bg-white/5 transition-colors"
              title="New Folder"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setCreating("file");
                setNewName("");
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
              data-ocid="filemanager.new_file.button"
              className="flex items-center gap-1 px-2 h-7 rounded text-xs text-muted-foreground hover:text-primary hover:bg-white/5 transition-colors"
              title="New File"
            >
              <FilePlus className="w-3.5 h-3.5" />
            </button>
            {selectedId !== null && (
              <button
                type="button"
                onClick={() => handleDelete(selectedId)}
                data-ocid="filemanager.delete_button"
                className="flex items-center gap-1 px-2 h-7 rounded text-xs text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* New name input */}
          {creating && (
            <div
              className="px-3 py-2 border-b flex items-center gap-2"
              style={{
                borderColor: "rgba(42,58,66,0.8)",
                background: "rgba(39,215,224,0.04)",
              }}
            >
              {creating === "folder" ? (
                <Folder className="w-4 h-4 os-cyan-text" />
              ) : (
                <File className="w-4 h-4 os-cyan-text" />
              )}
              <input
                ref={inputRef}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                  if (e.key === "Escape") {
                    setCreating(null);
                    setNewName("");
                  }
                }}
                placeholder={
                  creating === "folder" ? "Folder name" : "File name"
                }
                data-ocid="filemanager.input"
                className="flex-1 bg-transparent text-xs text-foreground outline-none border-b border-primary/50 pb-0.5 placeholder-muted-foreground/50"
              />
              <button
                type="button"
                onClick={handleCreate}
                data-ocid="filemanager.confirm_button"
                className="text-xs text-primary hover:underline"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreating(null);
                  setNewName("");
                }}
                data-ocid="filemanager.cancel_button"
                className="text-xs text-muted-foreground hover:underline"
              >
                Cancel
              </button>
            </div>
          )}

          {/* File list + info panel */}
          <div className="flex flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto p-2">
              {isLoading ? (
                <div
                  className="flex items-center justify-center h-full"
                  data-ocid="filemanager.loading_state"
                >
                  <Loader2 className="w-5 h-5 animate-spin text-primary/60" />
                </div>
              ) : folders.length === 0 && files.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground/40"
                  data-ocid="filemanager.empty_state"
                >
                  <HardDrive className="w-10 h-10" />
                  <p className="text-xs">Empty directory</p>
                  <p className="text-[10px]">
                    Create a file or folder to get started
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-0.5">
                  {[...folders, ...files].map((node, i) => (
                    <button
                      type="button"
                      key={node.id}
                      onClick={() =>
                        renamingId !== node.id && handleNodeClick(node)
                      }
                      onDoubleClick={() => {
                        if (node.nodeType === FileType.folder) return;
                        if (renamingId === node.id) return;
                        handleNodeDoubleClick(node);
                      }}
                      onContextMenu={(e) => handleContextMenu(e, node)}
                      data-ocid={`filemanager.item.${i + 1}`}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer transition-colors text-left ${
                        selectedId === node.id
                          ? "bg-primary/15 border border-primary/30"
                          : "hover:bg-white/5"
                      }`}
                      onKeyDown={(e) => {
                        if (e.key === "F2") startRename(node);
                      }}
                    >
                      {node.nodeType === FileType.folder ? (
                        <Folder className="w-4 h-4 text-yellow-400/80 flex-shrink-0" />
                      ) : (
                        <File className="w-4 h-4 text-primary/70 flex-shrink-0" />
                      )}
                      {renamingId === node.id ? (
                        <input
                          // biome-ignore lint/a11y/noAutofocus: intentional focus for rename input
                          autoFocus
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => {
                            e.stopPropagation();
                            if (e.key === "Enter") commitRename(node.id);
                            if (e.key === "Escape") setRenamingId(null);
                          }}
                          onBlur={() => commitRename(node.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 bg-transparent outline-none text-xs border-b border-primary/50"
                          style={{ color: "var(--os-text-primary)" }}
                          data-ocid="filemanager.rename.input"
                        />
                      ) : (
                        <span
                          className="flex-1 text-xs truncate"
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            startRename(node);
                          }}
                        >
                          {node.name}
                        </span>
                      )}
                      {node.nodeType === FileType.file &&
                        renamingId !== node.id && (
                          <span className="text-[10px] text-muted-foreground/50 font-mono">
                            {node.content?.length ?? 0}b
                          </span>
                        )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* File info panel */}
            {selectedNode && selectedNode.nodeType !== FileType.folder && (
              <div
                className="w-48 flex-shrink-0 border-l flex flex-col overflow-hidden"
                style={{
                  borderColor: "rgba(42,58,66,0.8)",
                  background: "rgba(14,24,32,0.7)",
                }}
              >
                <div
                  className="px-3 py-2 border-b flex-shrink-0"
                  style={{ borderColor: "rgba(42,58,66,0.6)" }}
                >
                  <p
                    className="text-[10px] font-semibold uppercase tracking-wide"
                    style={{ color: "var(--os-text-muted)" }}
                  >
                    File Info
                  </p>
                </div>
                <div className="p-3 flex flex-col gap-2 overflow-y-auto flex-1">
                  <div>
                    <p className="text-[9px] text-muted-foreground/50 mb-0.5">
                      Name
                    </p>
                    <p
                      className="text-[11px] font-medium break-all"
                      style={{ color: "var(--os-text-primary)" }}
                    >
                      {selectedNode.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground/50 mb-0.5">
                      Size
                    </p>
                    <p
                      className="text-[11px] font-mono"
                      style={{ color: "var(--os-text-secondary)" }}
                    >
                      {selectedNode.content?.length ?? 0} bytes
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground/50 mb-0.5">
                      Type
                    </p>
                    <p
                      className="text-[11px]"
                      style={{ color: "var(--os-text-secondary)" }}
                    >
                      {selectedNode.name.split(".").pop()?.toUpperCase() ??
                        "File"}
                    </p>
                  </div>
                  {selectedNode.name.toLowerCase().endsWith(".md") &&
                    selectedNode.content && (
                      <div className="mt-1">
                        <p className="text-[9px] text-muted-foreground/50 mb-1">
                          Preview
                        </p>
                        <div
                          className="text-[10px] leading-relaxed overflow-y-auto max-h-32"
                          style={{ color: "var(--os-text-secondary)" }}
                          // biome-ignore lint/security/noDangerouslySetInnerHtml: intentional markdown preview
                          dangerouslySetInnerHTML={{
                            __html: `<p style="margin:0">${parseMarkdown(selectedNode.content)}</p>`,
                          }}
                        />
                      </div>
                    )}
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedNode.id)}
                    data-ocid="filemanager.delete_button"
                    className="mt-auto flex items-center gap-1.5 w-full px-2 py-1.5 rounded text-xs transition-colors"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      color: "#f87171",
                    }}
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Context menu */}
          {contextMenu && (
            <div
              className="fixed z-[99999] os-window py-1 min-w-32"
              style={{ left: contextMenu.x, top: contextMenu.y }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              data-ocid="filemanager.dropdown_menu"
            >
              <button
                type="button"
                onClick={() => startRename(contextMenu.node)}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/8 transition-colors"
              >
                Rename
              </button>
              {contextMenu.node.nodeType === FileType.file && (
                <button
                  type="button"
                  onClick={() => {
                    const { appId } = getFileApp(contextMenu.node.name);
                    openApp(appId, contextMenu.node.name, {
                      fileId: contextMenu.node.id,
                      fileName: contextMenu.node.name,
                    });
                    const eventAppId = getFileEventAppId(contextMenu.node.name);
                    if (eventAppId) {
                      emit("open-file", {
                        filename: contextMenu.node.name,
                        content: contextMenu.node.content ?? "",
                        appId: eventAppId,
                      });
                    }
                    setContextMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/8 transition-colors"
                >
                  Open with {getFileApp(contextMenu.node.name).label}
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(contextMenu.node.id)}
                data-ocid="filemanager.delete_button"
                className="w-full text-left px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 transition-colors"
              >
                Delete
              </button>
            </div>
          )}

          <div
            className="px-3 py-1 text-[10px] text-muted-foreground/50 font-mono border-t"
            style={{ borderColor: "rgba(42,58,66,0.5)" }}
          >
            {children?.length ?? 0} items &middot; {folders.length} folders
            &middot; {files.length} files
          </div>
        </>
      )}

      {/* CLOUD FILES TAB */}
      {tab === "cloud" && (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Cloud toolbar */}
          <div
            className="flex items-center gap-2 px-3 py-2 border-b flex-shrink-0"
            style={{
              borderColor: "rgba(42,58,66,0.8)",
              background: "rgba(18,32,38,0.5)",
            }}
          >
            <input
              ref={uploadInputRef}
              type="file"
              className="hidden"
              onChange={handleCloudUpload}
            />
            <button
              type="button"
              onClick={() => uploadInputRef.current?.click()}
              disabled={isUploading}
              data-ocid="filemanager.upload_button"
              className="flex items-center gap-1.5 px-3 h-7 rounded text-xs font-medium transition-colors"
              style={{
                background: isUploading
                  ? "rgba(39,215,224,0.05)"
                  : "rgba(39,215,224,0.1)",
                color: "var(--os-accent)",
                border: "1px solid rgba(39,215,224,0.3)",
              }}
            >
              {isUploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              {isUploading ? `Uploading ${uploadProgress}%` : "Upload File"}
            </button>
            <button
              type="button"
              onClick={loadCloudFiles}
              data-ocid="filemanager.refresh.button"
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/8 text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <span className="flex-1" />
            {/* Sort controls */}
            {(["name", "date", "size"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setCloudSortBy(s)}
                data-ocid={`filemanager.sort_${s}.toggle`}
                className="px-2 h-6 rounded text-[10px] capitalize transition-colors"
                style={{
                  background:
                    cloudSortBy === s ? "rgba(39,215,224,0.1)" : "transparent",
                  color: cloudSortBy === s ? "#27D7E0" : "var(--os-text-muted)",
                  border:
                    cloudSortBy === s
                      ? "1px solid rgba(39,215,224,0.3)"
                      : "1px solid transparent",
                }}
              >
                {s}
              </button>
            ))}
            <span className="text-[10px] text-muted-foreground/50 font-mono ml-1">
              {cloudFiles.length} file{cloudFiles.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Upload progress bar */}
          {isUploading && (
            <div
              className="h-0.5 flex-shrink-0"
              style={{ background: "var(--os-border-subtle)" }}
            >
              <div
                className="h-full transition-all"
                style={{
                  width: `${uploadProgress}%`,
                  background: "var(--os-accent)",
                }}
              />
            </div>
          )}

          {/* Cloud file list */}
          <div className="flex-1 overflow-y-auto p-2">
            {cloudLoading ? (
              <div
                className="flex items-center justify-center h-full"
                data-ocid="filemanager.cloud.loading_state"
              >
                <Loader2 className="w-5 h-5 animate-spin text-primary/60" />
              </div>
            ) : cloudFiles.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center h-full gap-3"
                data-ocid="filemanager.cloud.empty_state"
              >
                <Cloud className="w-10 h-10 text-muted-foreground/30" />
                <div className="text-center">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--os-text-primary)" }}
                  >
                    Your on-chain drive is empty
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--os-text-muted)" }}
                  >
                    Files you upload are stored permanently on ICP.
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--os-text-muted)" }}
                  >
                    No cloud account needed.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => uploadInputRef.current?.click()}
                  data-ocid="filemanager.cloud.upload_button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                  style={{
                    background: "rgba(39,215,224,0.08)",
                    color: "var(--os-accent)",
                    border: "1px solid rgba(39,215,224,0.2)",
                  }}
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload a file
                </button>
              </div>
            ) : (
              <div className="space-y-0.5">
                {[...cloudFiles]
                  .sort((a, b) => {
                    if (cloudSortBy === "name")
                      return a.name.localeCompare(b.name);
                    if (cloudSortBy === "size") return Number(b.size - a.size);
                    return Number(b.uploadedAt - a.uploadedAt);
                  })
                  .map((f, i) => (
                    <div
                      key={f.url}
                      data-ocid={`filemanager.cloud.item.${i + 1}`}
                      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/5 transition-colors group"
                    >
                      {getMimeIcon(f.mimeType)}
                      <span className="flex-1 text-xs truncate">{f.name}</span>
                      <span className="text-[10px] font-mono text-muted-foreground/50">
                        {formatBytes(f.size)}
                      </span>
                      <span className="text-[10px] text-muted-foreground/40">
                        {formatDate(f.uploadedAt)}
                      </span>
                      <a
                        href={f.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={f.name}
                        data-ocid={`filemanager.cloud.download_button.${i + 1}`}
                        className="w-6 h-6 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCloudDelete(f.url, f.name)}
                        data-ocid={`filemanager.cloud.delete_button.${i + 1}`}
                        className="w-6 h-6 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground/50 hover:text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Storage bar */}
          <div
            className="px-3 py-2 border-t flex-shrink-0"
            style={{ borderColor: "rgba(42,58,66,0.5)" }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground/60">
                Cloud Storage
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/60">
                {formatBytes(storageUsed)} of 400 GB
              </span>
            </div>
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ background: "var(--os-border-subtle)" }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${storageUsedPct}%`,
                  background:
                    "linear-gradient(90deg, #27D7E0 0%, #3B82F6 100%)",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
