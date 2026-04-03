import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Edit3, FileText, Plus, Save, Search, Trash2, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useCanisterKV } from "../../hooks/useCanisterKV";

interface WikiPage {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

function renderMarkdownLike(
  text: string,
  onLinkClick: (title: string) => void,
): React.ReactNode[] {
  const lines = text.split("\n");
  return lines.map((line, li) => {
    if (line.startsWith("# ")) {
      return (
        <h1
          key={`${li}-${line.slice(0, 8)}`}
          className="text-xl font-bold mb-2"
          style={{ color: "rgba(39,215,224,0.95)" }}
        >
          {line.slice(2)}
        </h1>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h2
          key={`${li}-${line.slice(0, 8)}`}
          className="text-lg font-semibold mb-1.5"
          style={{ color: "rgba(39,215,224,0.85)" }}
        >
          {line.slice(3)}
        </h2>
      );
    }
    if (line.startsWith("### ")) {
      return (
        <h3
          key={`${li}-${line.slice(0, 8)}`}
          className="text-base font-semibold mb-1"
          style={{ color: "rgba(39,215,224,0.75)" }}
        >
          {line.slice(4)}
        </h3>
      );
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      return (
        <li
          key={`${li}-${line.slice(0, 8)}`}
          className="ml-4 text-sm mb-0.5"
          style={{ color: "var(--os-text-secondary)" }}
        >
          {renderInline(line.slice(2), onLinkClick)}
        </li>
      );
    }
    if (line.trim() === "") return <br key={`${li}-${line.slice(0, 8)}`} />;
    return (
      <p
        key={`${li}-${line.slice(0, 8)}`}
        className="text-sm mb-1"
        style={{ color: "var(--os-text-secondary)" }}
      >
        {renderInline(line, onLinkClick)}
      </p>
    );
  });
}

function renderInline(
  text: string,
  onLinkClick: (title: string) => void,
): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\[\[([^\]]+)\]\]|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g;
  let lastIndex = 0;
  let i = 0;
  let match = regex.exec(text);
  while (match !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={i++}>{text.slice(lastIndex, match.index)}</span>);
    }
    if (match[1]) {
      const title = match[1];
      parts.push(
        <button
          key={i++}
          type="button"
          onClick={() => onLinkClick(title)}
          className="underline transition-colors"
          style={{ color: "rgba(39,215,224,0.9)" }}
        >
          {title}
        </button>,
      );
    } else if (match[2]) {
      parts.push(
        <strong key={i++} style={{ color: "var(--os-text-primary)" }}>
          {match[3]}
        </strong>,
      );
    } else if (match[4]) {
      parts.push(
        <em key={i++} style={{ color: "var(--os-text-primary)" }}>
          {match[5]}
        </em>,
      );
    }
    lastIndex = match.index + match[0].length;
    match = regex.exec(text);
  }
  if (lastIndex < text.length) {
    parts.push(<span key={i++}>{text.slice(lastIndex)}</span>);
  }
  return parts;
}

export function PersonalWiki() {
  const { data: pages, set: setPages } = useCanisterKV<WikiPage[]>(
    "decent-wiki",
    [],
  );
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [search, setSearch] = useState("");
  const [newPageTitle, setNewPageTitle] = useState("");
  const [showNewPage, setShowNewPage] = useState(false);

  const activePage = pages.find((p) => p.id === activePageId) ?? null;

  const navigateTo = useCallback(
    (title: string) => {
      const existing = pages.find(
        (p) => p.title.toLowerCase() === title.toLowerCase(),
      );
      if (existing) {
        setActivePageId(existing.id);
        setEditMode(false);
      } else {
        const newPage: WikiPage = {
          id: `w${Date.now()}`,
          title,
          content: `# ${title}\n\n`,
          updatedAt: new Date().toISOString(),
        };
        setPages([...pages, newPage]);
        setActivePageId(newPage.id);
        setEditMode(true);
        setEditContent(newPage.content);
      }
    },
    [pages, setPages],
  );

  const startEdit = () => {
    if (!activePage) return;
    setEditContent(activePage.content);
    setEditMode(true);
  };

  const saveEdit = () => {
    if (!activePage) return;
    setPages(
      pages.map((p) =>
        p.id === activePage.id
          ? { ...p, content: editContent, updatedAt: new Date().toISOString() }
          : p,
      ),
    );
    setEditMode(false);
  };

  const cancelEdit = () => setEditMode(false);

  const deletePage = (id: string) => {
    setPages(pages.filter((p) => p.id !== id));
    if (activePageId === id)
      setActivePageId(pages.find((p) => p.id !== id)?.id ?? null);
  };

  const addPage = () => {
    if (!newPageTitle.trim()) return;
    const newPage: WikiPage = {
      id: `w${Date.now()}`,
      title: newPageTitle.trim(),
      content: `# ${newPageTitle.trim()}\n\n`,
      updatedAt: new Date().toISOString(),
    };
    setPages([...pages, newPage]);
    setActivePageId(newPage.id);
    setEditMode(true);
    setEditContent(newPage.content);
    setNewPageTitle("");
    setShowNewPage(false);
  };

  const filteredPages = pages.filter(
    (p) => !search || p.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex h-full" style={{ background: "var(--os-bg-app)" }}>
      {/* Sidebar */}
      <div
        className="w-52 flex-shrink-0 flex flex-col border-r"
        style={{
          borderColor: "rgba(39,215,224,0.1)",
          background: "rgba(10,18,24,0.6)",
        }}
      >
        <div className="p-3 flex flex-col gap-2">
          <div
            className="flex items-center gap-1.5"
            style={{
              borderBottom: "1px solid rgba(39,215,224,0.1)",
              paddingBottom: 8,
            }}
          >
            <Search
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: "rgba(39,215,224,0.5)" }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pages..."
              data-ocid="wiki.search_input"
              className="flex-1 bg-transparent text-xs outline-none"
              style={{
                color: "var(--os-text-primary)",
                caretColor: "rgba(39,215,224,0.8)",
              }}
            />
          </div>
          {showNewPage ? (
            <div className="flex gap-1">
              <input
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addPage();
                  if (e.key === "Escape") setShowNewPage(false);
                }}
                placeholder="Page title..."
                data-ocid="wiki.new_page.input"
                className="flex-1 bg-transparent text-xs outline-none border-b"
                style={{
                  color: "var(--os-text-primary)",
                  borderColor: "rgba(39,215,224,0.5)",
                  paddingBottom: 2,
                  caretColor: "rgba(39,215,224,0.8)",
                }}
              />
              <button
                type="button"
                onClick={addPage}
                className="text-xs"
                style={{ color: "rgba(39,215,224,0.8)" }}
                data-ocid="wiki.add_page.button"
              >
                ✓
              </button>
              <button
                type="button"
                onClick={() => setShowNewPage(false)}
                className="text-xs text-muted-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowNewPage(true)}
              data-ocid="wiki.new_page_open.button"
              className="flex items-center gap-1.5 text-xs py-1 px-2 rounded transition-colors hover:bg-white/5"
              style={{ color: "rgba(39,215,224,0.7)" }}
            >
              <Plus className="w-3 h-3" /> New Page
            </button>
          )}
        </div>
        <ScrollArea className="flex-1">
          <div className="px-2 pb-2 flex flex-col gap-0.5">
            {filteredPages.map((page, i) => (
              <button
                key={page.id}
                type="button"
                onClick={() => {
                  setActivePageId(page.id);
                  setEditMode(false);
                }}
                data-ocid={`wiki.item.${i + 1}`}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors group"
                style={{
                  background:
                    page.id === activePageId
                      ? "rgba(39,215,224,0.08)"
                      : "transparent",
                  borderLeft:
                    page.id === activePageId
                      ? "2px solid rgba(39,215,224,0.6)"
                      : "2px solid transparent",
                }}
              >
                <FileText
                  className="w-3 h-3 flex-shrink-0"
                  style={{
                    color:
                      page.id === activePageId
                        ? "rgba(39,215,224,0.7)"
                        : "var(--os-text-muted)",
                  }}
                />
                <span
                  className="flex-1 text-xs truncate"
                  style={{
                    color:
                      page.id === activePageId
                        ? "var(--os-text-primary)"
                        : "var(--os-text-secondary)",
                  }}
                >
                  {page.title}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePage(page.id);
                  }}
                  data-ocid={`wiki.delete_button.${i + 1}`}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </button>
            ))}
            {filteredPages.length === 0 && (
              <div
                className="text-center py-4 text-[10px]"
                style={{ color: "var(--os-text-muted)" }}
                data-ocid="wiki.empty_state"
              >
                No pages
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activePage ? (
          <>
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: "1px solid rgba(39,215,224,0.1)" }}
            >
              <h2
                className="font-semibold text-sm"
                style={{ color: "var(--os-text-primary)" }}
              >
                {activePage.title}
              </h2>
              <div className="flex items-center gap-2">
                {editMode ? (
                  <>
                    <Button
                      size="sm"
                      onClick={saveEdit}
                      data-ocid="wiki.save.button"
                      className="h-7 text-xs"
                    >
                      <Save className="w-3 h-3 mr-1" /> Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={cancelEdit}
                      data-ocid="wiki.cancel.button"
                      className="h-7 text-xs"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={startEdit}
                    data-ocid="wiki.edit.button"
                    className="h-7 text-xs"
                  >
                    <Edit3 className="w-3 h-3 mr-1" /> Edit
                  </Button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-auto p-5">
              {editMode ? (
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  data-ocid="wiki.editor"
                  className="w-full h-full min-h-[400px] resize-none text-sm font-mono"
                  style={{
                    background: "var(--os-border-subtle)",
                    border: "1px solid rgba(39,215,224,0.15)",
                    color: "var(--os-text-primary)",
                    caretColor: "rgba(39,215,224,0.8)",
                  }}
                  placeholder="Write your page content here...\n\nUse # for headers, **bold**, *italic*, and [[Page Name]] for internal links."
                />
              ) : (
                <div className="prose-like">
                  {renderMarkdownLike(activePage.content, navigateTo)}
                </div>
              )}
            </div>
          </>
        ) : (
          <div
            className="flex-1 flex items-center justify-center"
            data-ocid="wiki.main.empty_state"
          >
            <div className="text-center">
              <FileText
                className="w-12 h-12 mx-auto mb-3"
                style={{ color: "rgba(39,215,224,0.2)" }}
              />
              <p className="text-sm" style={{ color: "var(--os-text-muted)" }}>
                Select a page or create a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
