import { r as reactExports, j as jsxRuntimeExports, F as FileText, M as Minimize2, l as Maximize2 } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { D as Download } from "./download-CRM1KdTk.js";
const DEFAULT_RESUME = `# Jane Smith
**Software Engineer** · jane@example.com · github.com/janesmith · San Francisco, CA

---

## Summary

Full-stack engineer with 5+ years building scalable web applications. Passionate about clean architecture, developer experience, and decentralized systems.

---

## Experience

### Senior Software Engineer — Acme Corp
*Jan 2022 – Present · San Francisco, CA*

- Led migration of monolith to microservices, reducing deploy time by 60%
- Architected real-time notification system serving 2M+ daily active users
- Mentored 4 junior engineers; established code review culture

### Software Engineer — Startup XYZ
*Jun 2019 – Dec 2021 · Remote*

- Built React + TypeScript frontend from scratch with 95% test coverage
- Integrated Stripe payments processing $500K+ monthly transactions
- Reduced page load times by 40% through lazy loading and bundle splitting

---

## Education

### B.S. Computer Science — UC Berkeley
*2015 – 2019 · GPA: 3.8/4.0*

---

## Skills

**Languages:** TypeScript, JavaScript, Python, Rust, Motoko
**Frontend:** React, Next.js, Tailwind CSS, Framer Motion
**Backend:** Node.js, PostgreSQL, Redis, GraphQL
**Infrastructure:** AWS, Docker, ICP, GitHub Actions

---

## Projects

### DecentOS — Decentralized OS on ICP
*Personal project · github.com/janesmith/decentos*

- Browser-based OS with 70+ apps running entirely on the Internet Computer
- Built glassmorphic window manager with zero-rerender drag via MotionValues
`;
const STORAGE_KEY = "decent_markdown_resume";
function parseMarkdown(md) {
  return md.split("\n").map((line) => {
    if (/^---+$/.test(line.trim())) return "<hr>";
    if (line.startsWith("# ")) return `<h1>${esc(line.slice(2))}</h1>`;
    if (line.startsWith("## ")) return `<h2>${esc(line.slice(3))}</h2>`;
    if (line.startsWith("### ")) return `<h3>${esc(line.slice(4))}</h3>`;
    if (line.startsWith("- "))
      return `<li>${inlineFormat(line.slice(2))}</li>`;
    if (line.trim() === "") return "<br>";
    return `<p>${inlineFormat(line)}</p>`;
  }).join("\n").replace(/<br>\n<li>/g, "<li>").replace(/<\/li>\n<br>/g, "</li>");
}
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function inlineFormat(s) {
  return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/`(.+?)`/g, "<code>$1</code>");
}
const FONT_SIZES = [
  { id: "sm", label: "S", val: "12px" },
  { id: "md", label: "M", val: "14px" },
  { id: "lg", label: "L", val: "16px" }
];
function MarkdownResume() {
  const { data: savedContent, set: saveContent } = useCanisterKV(
    STORAGE_KEY,
    DEFAULT_RESUME
  );
  const [content, setContent] = reactExports.useState(DEFAULT_RESUME);
  const [fontSize, setFontSize] = reactExports.useState("14px");
  const [previewOnly, setPreviewOnly] = reactExports.useState(false);
  const saveDebounce = reactExports.useRef(null);
  const hydratedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    setContent(savedContent);
  }, [savedContent]);
  const handleContentChange = (val) => {
    setContent(val);
    if (saveDebounce.current) clearTimeout(saveDebounce.current);
    saveDebounce.current = setTimeout(() => saveContent(val), 800);
  };
  const exportTxt = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.md";
    a.click();
    URL.revokeObjectURL(url);
  };
  const previewHtml = parseMarkdown(content);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "rgba(8,12,18,0.97)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-shrink-0 flex items-center gap-3 px-3 py-2 flex-wrap",
            style: {
              borderBottom: "1px solid rgba(39,215,224,0.15)",
              background: "rgba(10,16,22,0.95)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4", style: { color: "var(--os-accent)" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-semibold tracking-wider",
                    style: { color: "var(--os-accent)" },
                    children: "MARKDOWN RESUME"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: FONT_SIZES.map((fs) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setFontSize(fs.val),
                  "data-ocid": `markdownresume.fontsize_${fs.id}.toggle`,
                  className: "w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-all",
                  style: fontSize === fs.val ? {
                    background: "rgba(39,215,224,0.2)",
                    border: "1px solid rgba(39,215,224,0.5)",
                    color: "var(--os-accent)"
                  } : {
                    background: "transparent",
                    border: "1px solid var(--os-text-muted)",
                    color: "var(--os-text-secondary)"
                  },
                  children: fs.label
                },
                fs.id
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setPreviewOnly((v) => !v),
                  "data-ocid": "markdownresume.preview.toggle",
                  className: "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all",
                  style: {
                    background: previewOnly ? "rgba(39,215,224,0.2)" : "rgba(39,215,224,0.08)",
                    border: "1px solid rgba(39,215,224,0.3)",
                    color: "var(--os-accent)"
                  },
                  children: [
                    previewOnly ? /* @__PURE__ */ jsxRuntimeExports.jsx(Minimize2, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "w-3 h-3" }),
                    previewOnly ? "Edit" : "Preview"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: exportTxt,
                  "data-ocid": "markdownresume.export.button",
                  className: "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all ml-auto",
                  style: {
                    background: "rgba(39,215,224,0.1)",
                    border: "1px solid rgba(39,215,224,0.3)",
                    color: "var(--os-accent)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
                    "Export .md"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex overflow-hidden", children: [
          !previewOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col",
              style: {
                width: previewOnly ? "0" : "50%",
                borderRight: "1px solid rgba(39,215,224,0.1)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "px-3 py-1 text-[10px] font-semibold tracking-widest flex-shrink-0",
                    style: {
                      background: "rgba(39,215,224,0.04)",
                      borderBottom: "1px solid rgba(39,215,224,0.08)",
                      color: "rgba(39,215,224,0.5)"
                    },
                    children: "EDITOR"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    value: content,
                    onChange: (e) => handleContentChange(e.target.value),
                    "data-ocid": "markdownresume.editor",
                    className: "flex-1 resize-none outline-none font-mono p-3",
                    style: {
                      background: "transparent",
                      color: "var(--os-text-primary)",
                      fontSize: "12px",
                      lineHeight: "1.6",
                      scrollbarWidth: "thin",
                      scrollbarColor: "rgba(39,215,224,0.3) transparent"
                    },
                    spellCheck: false
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col overflow-hidden", style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "px-3 py-1 text-[10px] font-semibold tracking-widest flex-shrink-0",
                style: {
                  background: "rgba(39,215,224,0.04)",
                  borderBottom: "1px solid rgba(39,215,224,0.08)",
                  color: "rgba(39,215,224,0.5)"
                },
                children: "PREVIEW"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex-1 overflow-y-auto",
                style: {
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(39,215,224,0.3) transparent"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "resume-preview",
                    "data-ocid": "markdownresume.panel",
                    dangerouslySetInnerHTML: { __html: previewHtml },
                    style: {
                      padding: "24px 32px",
                      background: "var(--os-text-primary)",
                      minHeight: "100%",
                      fontSize,
                      lineHeight: "1.7",
                      color: "#1a1a1a",
                      fontFamily: "Georgia, 'Times New Roman', serif"
                    }
                  }
                )
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        .resume-preview h1 { font-size: 1.8em; font-weight: 700; margin: 0 0 4px; color: #111; }
        .resume-preview h2 { font-size: 1.1em; font-weight: 700; margin: 16px 0 6px; text-transform: uppercase; letter-spacing: 0.08em; color: #333; border-bottom: 2px solid #27D7E0; padding-bottom: 4px; }
        .resume-preview h3 { font-size: 1em; font-weight: 700; margin: 10px 0 2px; color: #222; }
        .resume-preview p { margin: 2px 0; }
        .resume-preview li { margin: 3px 0 3px 16px; list-style: disc; }
        .resume-preview hr { border: none; border-top: 1px solid #e0e0e0; margin: 12px 0; }
        .resume-preview strong { font-weight: 700; }
        .resume-preview em { font-style: italic; color: #555; }
        .resume-preview code { font-family: monospace; background: #f0f0f0; padding: 1px 4px; border-radius: 3px; font-size: 0.9em; }
      ` })
      ]
    }
  );
}
export {
  MarkdownResume
};
