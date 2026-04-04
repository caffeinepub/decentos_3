import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, S as Search, X, F as FileText, T as Trash2 } from "./index-8tMpYjTW.js";
import { B as Button } from "./button-BMA-bo_z.js";
import { S as ScrollArea } from "./scroll-area-frdS_iE5.js";
import { T as Textarea } from "./textarea-BIAzjIhr.js";
import { u as useCanisterKV } from "./useCanisterKV-DlPKSuXE.js";
import { P as Plus } from "./plus-DMYwOcjm.js";
import { S as Save } from "./save-Bt6nBroC.js";
import "./utils-CLTBVgOB.js";
import "./index-Dt4skXFn.js";
import "./index-DQsGwgle.js";
import "./index-BlmlyJvC.js";
import "./index-Bh3wJO-k.js";
import "./index-H3VjlnDK.js";
import "./index-B5o_Z5wf.js";
import "./index-BeS__rWb.js";
import "./index-IXOTxK3N.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 20h9", key: "t2du7b" }],
  [
    "path",
    {
      d: "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",
      key: "1ykcvy"
    }
  ]
];
const PenLine = createLucideIcon("pen-line", __iconNode);
function renderMarkdownLike(text, onLinkClick) {
  const lines = text.split("\n");
  return lines.map((line, li) => {
    if (line.startsWith("# ")) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h1",
        {
          className: "text-xl font-bold mb-2",
          style: { color: "rgba(39,215,224,0.95)" },
          children: line.slice(2)
        },
        `${li}-${line.slice(0, 8)}`
      );
    }
    if (line.startsWith("## ")) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h2",
        {
          className: "text-lg font-semibold mb-1.5",
          style: { color: "rgba(39,215,224,0.85)" },
          children: line.slice(3)
        },
        `${li}-${line.slice(0, 8)}`
      );
    }
    if (line.startsWith("### ")) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h3",
        {
          className: "text-base font-semibold mb-1",
          style: { color: "rgba(39,215,224,0.75)" },
          children: line.slice(4)
        },
        `${li}-${line.slice(0, 8)}`
      );
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "li",
        {
          className: "ml-4 text-sm mb-0.5",
          style: { color: "var(--os-text-secondary)" },
          children: renderInline(line.slice(2), onLinkClick)
        },
        `${li}-${line.slice(0, 8)}`
      );
    }
    if (line.trim() === "") return /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}, `${li}-${line.slice(0, 8)}`);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: "text-sm mb-1",
        style: { color: "var(--os-text-secondary)" },
        children: renderInline(line, onLinkClick)
      },
      `${li}-${line.slice(0, 8)}`
    );
  });
}
function renderInline(text, onLinkClick) {
  const parts = [];
  const regex = /\[\[([^\]]+)\]\]|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g;
  let lastIndex = 0;
  let i = 0;
  let match = regex.exec(text);
  while (match !== null) {
    if (match.index > lastIndex) {
      parts.push(/* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: text.slice(lastIndex, match.index) }, i++));
    }
    if (match[1]) {
      const title = match[1];
      parts.push(
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => onLinkClick(title),
            className: "underline transition-colors",
            style: { color: "rgba(39,215,224,0.9)" },
            children: title
          },
          i++
        )
      );
    } else if (match[2]) {
      parts.push(
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "var(--os-text-primary)" }, children: match[3] }, i++)
      );
    } else if (match[4]) {
      parts.push(
        /* @__PURE__ */ jsxRuntimeExports.jsx("em", { style: { color: "var(--os-text-primary)" }, children: match[5] }, i++)
      );
    }
    lastIndex = match.index + match[0].length;
    match = regex.exec(text);
  }
  if (lastIndex < text.length) {
    parts.push(/* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: text.slice(lastIndex) }, i++));
  }
  return parts;
}
function PersonalWiki() {
  const { data: pages, set: setPages } = useCanisterKV(
    "decent-wiki",
    []
  );
  const [activePageId, setActivePageId] = reactExports.useState(null);
  const [editMode, setEditMode] = reactExports.useState(false);
  const [editContent, setEditContent] = reactExports.useState("");
  const [search, setSearch] = reactExports.useState("");
  const [newPageTitle, setNewPageTitle] = reactExports.useState("");
  const [showNewPage, setShowNewPage] = reactExports.useState(false);
  const activePage = pages.find((p) => p.id === activePageId) ?? null;
  const navigateTo = reactExports.useCallback(
    (title) => {
      const existing = pages.find(
        (p) => p.title.toLowerCase() === title.toLowerCase()
      );
      if (existing) {
        setActivePageId(existing.id);
        setEditMode(false);
      } else {
        const newPage = {
          id: `w${Date.now()}`,
          title,
          content: `# ${title}

`,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        setPages([...pages, newPage]);
        setActivePageId(newPage.id);
        setEditMode(true);
        setEditContent(newPage.content);
      }
    },
    [pages, setPages]
  );
  const startEdit = () => {
    if (!activePage) return;
    setEditContent(activePage.content);
    setEditMode(true);
  };
  const saveEdit = () => {
    if (!activePage) return;
    setPages(
      pages.map(
        (p) => p.id === activePage.id ? { ...p, content: editContent, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } : p
      )
    );
    setEditMode(false);
  };
  const cancelEdit = () => setEditMode(false);
  const deletePage = (id) => {
    var _a;
    setPages(pages.filter((p) => p.id !== id));
    if (activePageId === id)
      setActivePageId(((_a = pages.find((p) => p.id !== id)) == null ? void 0 : _a.id) ?? null);
  };
  const addPage = () => {
    if (!newPageTitle.trim()) return;
    const newPage = {
      id: `w${Date.now()}`,
      title: newPageTitle.trim(),
      content: `# ${newPageTitle.trim()}

`,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    setPages([...pages, newPage]);
    setActivePageId(newPage.id);
    setEditMode(true);
    setEditContent(newPage.content);
    setNewPageTitle("");
    setShowNewPage(false);
  };
  const filteredPages = pages.filter(
    (p) => !search || p.title.toLowerCase().includes(search.toLowerCase())
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full", style: { background: "var(--os-bg-app)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "w-52 flex-shrink-0 flex flex-col border-r",
        style: {
          borderColor: "rgba(39,215,224,0.1)",
          background: "rgba(10,18,24,0.6)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-1.5",
                style: {
                  borderBottom: "1px solid rgba(39,215,224,0.1)",
                  paddingBottom: 8
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Search,
                    {
                      className: "w-3.5 h-3.5 flex-shrink-0",
                      style: { color: "rgba(39,215,224,0.5)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: search,
                      onChange: (e) => setSearch(e.target.value),
                      placeholder: "Search pages...",
                      "data-ocid": "wiki.search_input",
                      className: "flex-1 bg-transparent text-xs outline-none",
                      style: {
                        color: "var(--os-text-primary)",
                        caretColor: "rgba(39,215,224,0.8)"
                      }
                    }
                  )
                ]
              }
            ),
            showNewPage ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: newPageTitle,
                  onChange: (e) => setNewPageTitle(e.target.value),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") addPage();
                    if (e.key === "Escape") setShowNewPage(false);
                  },
                  placeholder: "Page title...",
                  "data-ocid": "wiki.new_page.input",
                  className: "flex-1 bg-transparent text-xs outline-none border-b",
                  style: {
                    color: "var(--os-text-primary)",
                    borderColor: "rgba(39,215,224,0.5)",
                    paddingBottom: 2,
                    caretColor: "rgba(39,215,224,0.8)"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: addPage,
                  className: "text-xs",
                  style: { color: "rgba(39,215,224,0.8)" },
                  "data-ocid": "wiki.add_page.button",
                  children: "✓"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowNewPage(false),
                  className: "text-xs text-muted-foreground",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setShowNewPage(true),
                "data-ocid": "wiki.new_page_open.button",
                className: "flex items-center gap-1.5 text-xs py-1 px-2 rounded transition-colors hover:bg-white/5",
                style: { color: "rgba(39,215,224,0.7)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                  " New Page"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-2 pb-2 flex flex-col gap-0.5", children: [
            filteredPages.map((page, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  setActivePageId(page.id);
                  setEditMode(false);
                },
                "data-ocid": `wiki.item.${i + 1}`,
                className: "w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors group",
                style: {
                  background: page.id === activePageId ? "rgba(39,215,224,0.08)" : "transparent",
                  borderLeft: page.id === activePageId ? "2px solid rgba(39,215,224,0.6)" : "2px solid transparent"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FileText,
                    {
                      className: "w-3 h-3 flex-shrink-0",
                      style: {
                        color: page.id === activePageId ? "rgba(39,215,224,0.7)" : "var(--os-text-muted)"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "flex-1 text-xs truncate",
                      style: {
                        color: page.id === activePageId ? "var(--os-text-primary)" : "var(--os-text-secondary)"
                      },
                      children: page.title
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: (e) => {
                        e.stopPropagation();
                        deletePage(page.id);
                      },
                      "data-ocid": `wiki.delete_button.${i + 1}`,
                      className: "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
                    }
                  )
                ]
              },
              page.id
            )),
            filteredPages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-center py-4 text-[10px]",
                style: { color: "var(--os-text-muted)" },
                "data-ocid": "wiki.empty_state",
                children: "No pages"
              }
            )
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col min-w-0", children: activePage ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between px-4 py-2.5",
          style: { borderBottom: "1px solid rgba(39,215,224,0.1)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h2",
              {
                className: "font-semibold text-sm",
                style: { color: "var(--os-text-primary)" },
                children: activePage.title
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: editMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  onClick: saveEdit,
                  "data-ocid": "wiki.save.button",
                  className: "h-7 text-xs",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-3 h-3 mr-1" }),
                    " Save"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  onClick: cancelEdit,
                  "data-ocid": "wiki.cancel.button",
                  className: "h-7 text-xs",
                  children: "Cancel"
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "ghost",
                onClick: startEdit,
                "data-ocid": "wiki.edit.button",
                className: "h-7 text-xs",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "w-3 h-3 mr-1" }),
                  " Edit"
                ]
              }
            ) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-5", children: editMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          value: editContent,
          onChange: (e) => setEditContent(e.target.value),
          "data-ocid": "wiki.editor",
          className: "w-full h-full min-h-[400px] resize-none text-sm font-mono",
          style: {
            background: "var(--os-border-subtle)",
            border: "1px solid rgba(39,215,224,0.15)",
            color: "var(--os-text-primary)",
            caretColor: "rgba(39,215,224,0.8)"
          },
          placeholder: "Write your page content here...\\n\\nUse # for headers, **bold**, *italic*, and [[Page Name]] for internal links."
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prose-like", children: renderMarkdownLike(activePage.content, navigateTo) }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 flex items-center justify-center",
        "data-ocid": "wiki.main.empty_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FileText,
            {
              className: "w-12 h-12 mx-auto mb-3",
              style: { color: "rgba(39,215,224,0.2)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: "var(--os-text-muted)" }, children: "Select a page or create a new one" })
        ] })
      }
    ) })
  ] });
}
export {
  PersonalWiki
};
