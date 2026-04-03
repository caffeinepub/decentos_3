import { r as reactExports, j as jsxRuntimeExports, aw as BookmarkPlus, X, m as Copy, T as Trash2 } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { T as Tag } from "./tag-p61Tn5o4.js";
import { E as ExternalLink } from "./external-link-DGsWt7db.js";
const BG = "rgba(11,15,18,0.6)";
const BORDER = "rgba(42,58,66,0.8)";
const CYAN = "rgb(39,215,224)";
function getDomain(url) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}
function ReadingList() {
  const { data: items, set: setItemsKV } = useCanisterKV(
    "decentos_readinglist",
    []
  );
  const [selected, setSelected] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  const [tagFilter, setTagFilter] = reactExports.useState(null);
  const [url, setUrl] = reactExports.useState("");
  const [title, setTitle] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [tags, setTags] = reactExports.useState("");
  const selectedItem = items.find((i) => i.id === selected) ?? null;
  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    const matchSearch = !q || item.title.toLowerCase().includes(q) || item.url.toLowerCase().includes(q) || item.notes.toLowerCase().includes(q);
    const matchTag = !tagFilter || item.tags.includes(tagFilter);
    return matchSearch && matchTag;
  });
  function addItem() {
    if (!url.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      url: url.trim(),
      title: title.trim() || getDomain(url.trim()),
      notes: notes.trim(),
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      savedAt: Date.now()
    };
    setItemsKV([newItem, ...items]);
    setSelected(newItem.id);
    setUrl("");
    setTitle("");
    setNotes("");
    setTags("");
  }
  function deleteItem(id) {
    setItemsKV(items.filter((i) => i.id !== id));
    if (selected === id) setSelected(null);
  }
  function exportMarkdown() {
    const md = items.map((i) => `- [${i.title}](${i.url})${i.notes ? ` — ${i.notes}` : ""}`).join("\n");
    navigator.clipboard.writeText(md).catch(() => {
    });
  }
  const allTags = Array.from(new Set(items.flatMap((i) => i.tags)));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: BG,
        color: "#e2e8f0",
        fontSize: 13
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              padding: "10px 14px",
              borderBottom: `1px solid ${BORDER}`,
              background: "var(--os-bg-elevated)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, marginBottom: 6 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    value: url,
                    onChange: (e) => {
                      setUrl(e.target.value);
                      if (!title) setTitle(getDomain(e.target.value));
                    },
                    placeholder: "https://...",
                    "data-ocid": "readinglist.input",
                    style: {
                      flex: 2,
                      background: "var(--os-border-subtle)",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 5,
                      padding: "4px 8px",
                      color: "#e2e8f0",
                      fontSize: 12,
                      outline: "none"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    value: title,
                    onChange: (e) => setTitle(e.target.value),
                    placeholder: "Title (auto)",
                    style: {
                      flex: 1,
                      background: "var(--os-border-subtle)",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 5,
                      padding: "4px 8px",
                      color: "#e2e8f0",
                      fontSize: 12,
                      outline: "none"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: addItem,
                    "data-ocid": "readinglist.primary_button",
                    style: {
                      background: CYAN,
                      color: "#000",
                      border: "none",
                      borderRadius: 5,
                      padding: "4px 12px",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 4
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkPlus, { style: { width: 14, height: 14 } }),
                      " Save"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    value: notes,
                    onChange: (e) => setNotes(e.target.value),
                    placeholder: "Notes (optional)",
                    rows: 1,
                    style: {
                      flex: 2,
                      background: "var(--os-border-subtle)",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 5,
                      padding: "4px 8px",
                      color: "#e2e8f0",
                      fontSize: 12,
                      outline: "none",
                      resize: "none"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    value: tags,
                    onChange: (e) => setTags(e.target.value),
                    placeholder: "Tags (comma separated)",
                    style: {
                      flex: 1,
                      background: "var(--os-border-subtle)",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 5,
                      padding: "4px 8px",
                      color: "#e2e8f0",
                      fontSize: 12,
                      outline: "none"
                    }
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flex: 1, overflow: "hidden" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                width: 240,
                borderRight: `1px solid ${BORDER}`,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      padding: "8px 10px",
                      borderBottom: `1px solid ${BORDER}`,
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                      alignItems: "center"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          value: search,
                          onChange: (e) => setSearch(e.target.value),
                          placeholder: "Search…",
                          "data-ocid": "readinglist.search_input",
                          style: {
                            flex: 1,
                            minWidth: 80,
                            background: "var(--os-border-subtle)",
                            border: `1px solid ${BORDER}`,
                            borderRadius: 4,
                            padding: "3px 7px",
                            color: "#e2e8f0",
                            fontSize: 11,
                            outline: "none"
                          }
                        }
                      ),
                      tagFilter && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => setTagFilter(null),
                          style: {
                            background: "rgba(39,215,224,0.15)",
                            border: `1px solid ${CYAN}`,
                            borderRadius: 3,
                            padding: "1px 6px",
                            fontSize: 10,
                            color: CYAN,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 2
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { style: { width: 9, height: 9 } }),
                            tagFilter,
                            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { style: { width: 9, height: 9 } })
                          ]
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { overflowY: "auto", flex: 1 }, children: [
                  filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      "data-ocid": "readinglist.empty_state",
                      style: {
                        padding: 16,
                        color: "var(--os-text-muted)",
                        fontSize: 11,
                        textAlign: "center"
                      },
                      children: "No items yet"
                    }
                  ),
                  filtered.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setSelected(item.id),
                      "data-ocid": `readinglist.item.${i + 1}`,
                      style: {
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 10px",
                        cursor: "pointer",
                        borderBottom: "1px solid rgba(42,58,66,0.4)",
                        background: selected === item.id ? "rgba(39,215,224,0.08)" : "transparent",
                        borderLeft: selected === item.id ? `2px solid ${CYAN}` : "2px solid transparent",
                        border: "none",
                        color: "inherit"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              fontWeight: 600,
                              fontSize: 12,
                              color: selected === item.id ? CYAN : "#e2e8f0",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            },
                            children: item.title
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              fontSize: 10,
                              color: "var(--os-text-muted)",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            },
                            children: getDomain(item.url)
                          }
                        ),
                        item.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              display: "flex",
                              gap: 3,
                              marginTop: 3,
                              flexWrap: "wrap"
                            },
                            children: item.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  background: "rgba(39,215,224,0.1)",
                                  border: "1px solid rgba(39,215,224,0.2)",
                                  borderRadius: 2,
                                  padding: "0 4px",
                                  fontSize: 9,
                                  color: CYAN
                                },
                                children: tag
                              },
                              tag
                            ))
                          }
                        )
                      ]
                    },
                    item.id
                  ))
                ] }),
                allTags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      padding: "6px 10px",
                      borderTop: `1px solid ${BORDER}`,
                      display: "flex",
                      gap: 4,
                      flexWrap: "wrap"
                    },
                    children: allTags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setTagFilter(tagFilter === tag ? null : tag),
                        style: {
                          background: tagFilter === tag ? "rgba(39,215,224,0.2)" : "rgba(39,215,224,0.07)",
                          border: "1px solid rgba(39,215,224,0.2)",
                          borderRadius: 3,
                          padding: "1px 5px",
                          fontSize: 10,
                          color: CYAN,
                          cursor: "pointer"
                        },
                        children: tag
                      },
                      tag
                    ))
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflow: "auto", padding: 16 }, children: selectedItem ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  alignItems: "flex-start"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        fontWeight: 700,
                        fontSize: 15,
                        color: CYAN,
                        flex: 1,
                        marginRight: 8
                      },
                      children: selectedItem.title
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: exportMarkdown,
                        "data-ocid": "readinglist.secondary_button",
                        title: "Export all as Markdown",
                        style: {
                          background: "var(--os-border-subtle)",
                          border: `1px solid ${BORDER}`,
                          borderRadius: 4,
                          padding: "4px 8px",
                          cursor: "pointer",
                          color: "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 11
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { style: { width: 12, height: 12 } }),
                          " Export"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => deleteItem(selectedItem.id),
                        "data-ocid": "readinglist.delete_button",
                        style: {
                          background: "rgba(239,68,68,0.1)",
                          border: "1px solid rgba(239,68,68,0.25)",
                          borderRadius: 4,
                          padding: "4px 8px",
                          cursor: "pointer",
                          color: "#f87171",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 11
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { style: { width: 12, height: 12 } }),
                          " Delete"
                        ]
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: selectedItem.url,
                target: "_blank",
                rel: "noreferrer",
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: CYAN,
                  fontSize: 12,
                  marginBottom: 12,
                  textDecoration: "none",
                  wordBreak: "break-all"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ExternalLink,
                    {
                      style: { width: 12, height: 12, flexShrink: 0 }
                    }
                  ),
                  selectedItem.url
                ]
              }
            ),
            selectedItem.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 12 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    fontSize: 10,
                    color: "var(--os-text-secondary)",
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  },
                  children: "Notes"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    background: "var(--os-border-subtle)",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 6,
                    padding: "8px 10px",
                    fontSize: 12,
                    lineHeight: 1.6
                  },
                  children: selectedItem.notes
                }
              )
            ] }),
            selectedItem.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 12 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    fontSize: 10,
                    color: "var(--os-text-secondary)",
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  },
                  children: "Tags"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 5 }, children: selectedItem.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    background: "rgba(39,215,224,0.1)",
                    border: "1px solid rgba(39,215,224,0.25)",
                    borderRadius: 4,
                    padding: "2px 8px",
                    fontSize: 11,
                    color: CYAN
                  },
                  children: tag
                },
                tag
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 10, color: "var(--os-text-muted)" }, children: [
              "Saved ",
              new Date(selectedItem.savedAt).toLocaleString()
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "var(--os-text-muted)",
                gap: 8
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkPlus, { style: { width: 36, height: 36, opacity: 0.3 } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12 }, children: "Select an item or save a new URL" })
              ]
            }
          ) })
        ] })
      ]
    }
  );
}
export {
  ReadingList
};
